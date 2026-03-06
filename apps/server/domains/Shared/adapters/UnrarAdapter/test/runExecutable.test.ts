import { EventEmitter } from 'node:events'

import { AppError } from '@arch/utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { runExecutable } from '../runExecutable'
import { UnrarServiceErrorCode } from '../types'

const FAKE_EXE_PATH = '/fake/unrar/path'

const resolvePathToExecutableMock = vi.fn<() => string>(() => FAKE_EXE_PATH)

type MockStream = EventEmitter & { setEncoding: (_enc: string) => EventEmitter }

function createMockStream(): MockStream {
  const stream = new EventEmitter()
  const mockStream = stream as MockStream
  mockStream.setEncoding = () => mockStream
  return mockStream
}

type MockChild = EventEmitter & { stdout: MockStream; stderr: MockStream }

function createMockChild(): { child: MockChild; stdout: MockStream; stderr: MockStream } {
  const stdout = createMockStream()
  const stderr = createMockStream()
  const child = new EventEmitter() as MockChild
  child.stdout = stdout
  child.stderr = stderr
  return { child, stdout, stderr }
}

const spawnMock = vi.fn((_exe: string, _args: readonly string[], _opts: object): MockChild => {
  const { child } = createMockChild()
  return child
})

vi.mock('../resolvePathToExecutable', () => ({
  resolvePathToExecutable: (): string => resolvePathToExecutableMock()
}))

vi.mock('child_process', () => ({
  spawn: (exe: string, args: readonly string[], opts: object) => spawnMock(exe, args, opts)
}))

describe('runExecutable', () => {
  afterEach(() => {
    vi.clearAllMocks()
    resolvePathToExecutableMock.mockReturnValue(FAKE_EXE_PATH)
  })

  describe('normal behavior', () => {
    it('resolves with concatenated stdout when process exits with code 0', async () => {
      const promise = runExecutable(['x', 'y'])
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.stdout.emit('data', 'line1\n')
      child.stdout.emit('data', 'line2')
      child.emit('close', 0)

      await expect(promise).resolves.toBe('line1\nline2')
    })

    it('calls spawn with executable path, arguments, and options', async () => {
      const promise = runExecutable(['list', 'archive.rar'])
      expect(spawnMock).toHaveBeenCalledWith(
        FAKE_EXE_PATH,
        ['list', 'archive.rar'],
        expect.objectContaining({
          stdio: ['ignore', 'pipe', 'pipe'],
          windowsHide: true
        })
      )
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.emit('close', 0)
      await promise
    })

    it('passes abort signal to spawn options when provided', async () => {
      const controller = new AbortController()
      const promise = runExecutable(['x'], controller.signal)
      expect(spawnMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({ signal: controller.signal })
      )
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.emit('close', 0)
      await promise
    })
  })

  describe('error handling', () => {
    it('rejects with AppError when process exits with non-zero code', async () => {
      const promise = runExecutable(['bad'])
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.stderr.emit('data', 'error: file not found')
      child.emit('close', 2)

      await expect(promise).rejects.toMatchObject({
        code: 'UNRAR_EXECUTABLE_RUN_FAILED',
        kind: 'AppError',
        details: { exitCode: 2 }
      } as Partial<AppError<UnrarServiceErrorCode, { exitCode: number }>>)
    })

    it('error message includes stderr when exit code is non-zero', async () => {
      const promise = runExecutable(['bad'])
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.stderr.emit('data', 'stderr message')
      child.emit('close', 1)

      await expect(promise).rejects.toThrow(/stderr message/)
    })

    it('error message includes stdout when stderr is empty and exit code is non-zero', async () => {
      const promise = runExecutable(['bad'])
      const child = spawnMock.mock.results[0]?.value as MockChild
      child.stdout.emit('data', 'stdout only')
      child.emit('close', 1)

      await expect(promise).rejects.toThrow(/stdout only/)
    })

    it('rejects with child process error when process emits error', async () => {
      const promise = runExecutable(['x'])
      const child = spawnMock.mock.results[0]?.value as MockChild
      const err = new Error('spawn ENOENT')
      child.emit('error', err)

      await expect(promise).rejects.toThrow('spawn ENOENT')
    })
  })

  describe('resolvePathToExecutable', () => {
    it('throws when resolvePathToExecutable throws', () => {
      resolvePathToExecutableMock.mockImplementation(() => {
        throw new AppError<UnrarServiceErrorCode, { prod: string; dev: string }>({
          domain: 'Global',
          layer: 'FileSystem',
          origin: 'UnrarService.resolvePathToExecutable',
          code: 'UNRAR_EXECUTABLE_NOT_FOUND',
          message: 'Not found',
          details: { prod: '/p', dev: '/d' }
        })
      })

      expect(() => runExecutable(['x'])).toThrow(AppError)
      expect(spawnMock).not.toHaveBeenCalled()
    })
  })
})
