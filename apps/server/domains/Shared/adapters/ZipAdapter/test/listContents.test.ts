import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { archive } from '../archive'
import { listContents } from '../listContents'

describe('listContents (integration)', () => {
  let tempDir: string
  let inputDir: string
  let zipPath: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'listContents-test-'))
    inputDir = join(tempDir, 'input')
    zipPath = join(tempDir, 'archive.zip')
    await mkdir(inputDir, { recursive: true })
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  it('returns file paths only (no directories) for a zip with files and subdirs', async () => {
    await writeFile(join(inputDir, 'a.txt'), 'a')
    await mkdir(join(inputDir, 'sub'), { recursive: true })
    await writeFile(join(inputDir, 'sub', 'b.txt'), 'b')

    await archive(inputDir, zipPath)

    const entries = await listContents(zipPath)
    expect(entries.sort()).toEqual(['a.txt', 'sub/b.txt'])
  })

  it('returns empty array for an empty zip', async () => {
    await archive(inputDir, zipPath)

    const entries = await listContents(zipPath)
    expect(entries).toEqual([])
  })

  it('throws AppError with ZIP_LIST_CONTENTS_ABORTED when signal is already aborted', async () => {
    await writeFile(join(inputDir, 'x.txt'), 'x')
    await archive(inputDir, zipPath)

    const controller = new AbortController()
    controller.abort()

    await expect(listContents(zipPath, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AppError',
      code: 'ZIP_LIST_CONTENTS_ABORTED',
      details: { archivePath: zipPath }
    })
  })
})
