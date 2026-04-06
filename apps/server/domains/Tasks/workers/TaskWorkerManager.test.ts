import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TASK_TYPE } from '@arch/contracts'

import { TaskWorkerManager } from './TaskWorkerManager'

const mockSendRequest = vi.hoisted(() => vi.fn())
const mockTerminate = vi.hoisted(() => vi.fn())
const mockConstructor = vi.hoisted(() => vi.fn())

vi.mock('./TaskWorkerClient', () => {
  class MockTaskWorkerClient {
    sendRequest = mockSendRequest
    terminate = mockTerminate
    constructor() {
      mockConstructor()
    }
  }
  return { TaskWorkerClient: MockTaskWorkerClient }
})

describe('TaskWorkerManager', () => {
  const maxWorkers = 2
  let manager: TaskWorkerManager

  beforeEach(() => {
    vi.clearAllMocks()
    mockTerminate.mockResolvedValue(undefined)
    manager = new TaskWorkerManager({ maxWorkers })
  })

  describe('start/stop', () => {
    it('creates maxWorkers TaskWorkerClient instances on start', async () => {
      await manager.start()
      expect(mockConstructor).toHaveBeenCalledTimes(maxWorkers)
    })

    it('calls terminate on each worker on stop', async () => {
      await manager.start()
      await manager.stop()
      expect(mockTerminate).toHaveBeenCalledTimes(maxWorkers)
    })

    it('is idempotent: start twice does not create more workers', async () => {
      await manager.start()
      await manager.start()
      expect(mockConstructor).toHaveBeenCalledTimes(maxWorkers)
    })

    it('is idempotent: stop when not started is safe', async () => {
      await manager.stop()
      expect(mockTerminate).not.toHaveBeenCalled()
    })
  })

  describe('pool state', () => {
    it('getMaxWorkers returns constructor value', () => {
      expect(manager.getMaxWorkers()).toBe(maxWorkers)
    })

    it('hasAvailableWorker is false when not started', () => {
      expect(manager.hasAvailableWorker()).toBe(false)
    })

    it('hasAvailableWorker is true after start when no tasks running', async () => {
      await manager.start()
      expect(manager.hasAvailableWorker()).toBe(true)
    })

    it('getActiveWorkerCount is 0 when no tasks running', async () => {
      await manager.start()
      expect(manager.getActiveWorkerCount()).toBe(0)
    })
  })

  describe('executeTask', () => {
    it('dispatches to a worker and emits onTaskCompleted when sendRequest resolves', async () => {
      await manager.start()
      const completed = vi.fn().mockResolvedValue(undefined)
      manager.onTaskCompleted(completed)

      mockSendRequest.mockResolvedValueOnce({
        requestId: 1,
        type: TASK_TYPE.MULTIPLY,
        payload: { result: 10 }
      })

      await manager.executeTask({
        taskId: 't1',
        type: TASK_TYPE.MULTIPLY,
        payload: { value: 5 }
      })

      await vi.waitFor(
        () => {
          expect(mockSendRequest).toHaveBeenCalledWith(TASK_TYPE.MULTIPLY, { value: 5 })
          expect(completed).toHaveBeenCalledWith(
            expect.objectContaining({
              taskId: 't1',
              result: { result: 10 },
              durationMs: expect.any(Number)
            })
          )
        },
        { timeout: 500 }
      )
    })

    it('emits onTaskFailed when sendRequest rejects', async () => {
      await manager.start()
      const failed = vi.fn().mockResolvedValue(undefined)
      manager.onTaskFailed(failed)
      const err = new Error('worker error')
      mockSendRequest.mockRejectedValueOnce(err)

      await manager.executeTask({
        taskId: 't2',
        type: TASK_TYPE.MULTIPLY,
        payload: { value: 1 }
      })

      await vi.waitFor(
        () => {
          expect(failed).toHaveBeenCalledWith(
            expect.objectContaining({
              taskId: 't2',
              error: err,
              durationMs: expect.any(Number)
            })
          )
        },
        { timeout: 500 }
      )
    })

    it('queues task when no worker available and runs when worker frees', async () => {
      await manager.start()
      const completed = vi.fn().mockResolvedValue(undefined)
      manager.onTaskCompleted(completed)

      let resolveFirst: (v: unknown) => void
      let resolveSecond: (v: unknown) => void
      const firstPromise = new Promise<unknown>((resolve) => {
        resolveFirst = resolve
      })
      const secondPromise = new Promise<unknown>((resolve) => {
        resolveSecond = resolve
      })
      mockSendRequest
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise)
        .mockResolvedValueOnce({ requestId: 3, type: TASK_TYPE.MULTIPLY, payload: { result: 4 } })

      await manager.executeTask({ taskId: 't3', type: TASK_TYPE.MULTIPLY, payload: { value: 2 } })
      await manager.executeTask({ taskId: 't4', type: TASK_TYPE.MULTIPLY, payload: { value: 2 } })
      await manager.executeTask({ taskId: 't5', type: TASK_TYPE.MULTIPLY, payload: { value: 2 } })

      expect(mockSendRequest).toHaveBeenCalledTimes(2)
      resolveFirst!({ requestId: 1, type: TASK_TYPE.MULTIPLY, payload: { result: 4 } })
      await Promise.resolve()
      resolveSecond!({ requestId: 2, type: TASK_TYPE.MULTIPLY, payload: { result: 4 } })

      await vi.waitFor(
        () => {
          expect(completed).toHaveBeenCalledTimes(3)
          const taskIds = completed.mock.calls.map((c) => c[0].taskId)
          expect(taskIds).toContain('t3')
          expect(taskIds).toContain('t4')
          expect(taskIds).toContain('t5')
          expect(mockSendRequest).toHaveBeenCalledTimes(3)
        },
        { timeout: 500 }
      )
    })

    it('executeTask when not started returns without throwing', async () => {
      await expect(
        manager.executeTask({ taskId: 't0', type: TASK_TYPE.MULTIPLY, payload: { value: 1 } })
      ).resolves.toBeUndefined()
      expect(mockSendRequest).not.toHaveBeenCalled()
    })
  })

  describe('event handlers', () => {
    it('invokes all onTaskCompleted handlers', async () => {
      await manager.start()
      const h1 = vi.fn().mockResolvedValue(undefined)
      const h2 = vi.fn().mockResolvedValue(undefined)
      manager.onTaskCompleted(h1)
      manager.onTaskCompleted(h2)
      mockSendRequest.mockResolvedValueOnce({
        requestId: 1,
        type: TASK_TYPE.MULTIPLY,
        payload: { result: 0 }
      })

      await manager.executeTask({ taskId: 't6', type: TASK_TYPE.MULTIPLY, payload: { value: 0 } })

      await vi.waitFor(
        () => {
          expect(h1).toHaveBeenCalledOnce()
          expect(h2).toHaveBeenCalledOnce()
        },
        { timeout: 500 }
      )
    })
  })
})
