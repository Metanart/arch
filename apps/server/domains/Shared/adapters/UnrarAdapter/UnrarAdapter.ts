import { extract } from './extract'
import { isPasswordProtected } from './isPasswordProtected'
import { listContents } from './listContents'
import { testIntegrity } from './testIntegrity'

export const UnrarAdapter = {
  extract,
  isPasswordProtected,
  listContents,
  testIntegrity
}
