import { archive } from './archive'
import { extract } from './extract'
import { listContents } from './listContents'

export const ZipService = {
  listContents,
  extract,
  archive
}
