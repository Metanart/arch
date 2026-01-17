/** Hard-blocked file names (exact match) */
export const BLOCKED_FILE_NAMES: string[] = [
  'Thumbs.db', // Windows thumbnail cache
  'ehthumbs.db', // Windows media cache
  'desktop.ini', // Windows folder settings
  '.DS_Store', // macOS system file
  'Icon\r', // macOS folder icon
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.npmignore',
  '.editorconfig',
  '.env',
  'package-lock.json',
  'yarn.lock'
]

/** Regular expressions for flexible filtering */
export const BLOCKED_FILE_PATTERNS: RegExp[] = [
  /^~\$.*$/, // temporary files MS Office (~$file.docx)
  /^\.~lock\..*#$/, // temporary files LibreOffice
  /^\.?cache/i, // .cache, cache.db and etc.
  /^.*\.log$/i, // all .log files
  /^.*\.tmp$/i, // all .tmp files
  /^.*\.bak$/i, // backup files
  /^.*\.swp$/i // vim swap files
]
