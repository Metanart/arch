import { BLOCKED_DIR_NAMES, BLOCKED_DIR_PATTERNS } from './utils/dirBlocklists'
import { BLOCKED_FILE_NAMES, BLOCKED_FILE_PATTERNS } from './utils/fileBlocklists'
import { makeDirPredicate } from './utils/makeDirPredicate'
import { makeFilePredicate } from './utils/makeFilePredicate'
import { safeGetFileExtension } from './utils/safeGetFileExtension'

export const defaultDirPredicate = makeDirPredicate(
  BLOCKED_DIR_NAMES,
  BLOCKED_DIR_PATTERNS,
  false // allowHidden
)

export const defaultFilePredicate = makeFilePredicate(
  ['zip', 'rar', 'jpg', 'jpeg', 'png', 'webp', 'stl'],
  BLOCKED_FILE_NAMES,
  BLOCKED_FILE_PATTERNS,
  1,
  10 * 1_000_000_000
)

export const defaultKeyFilePredicate = (fileName: string): boolean => {
  const ext = safeGetFileExtension(fileName)
  return ext === 'zip' || ext === 'rar'
}
