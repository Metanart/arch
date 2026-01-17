/** Hard-blocked folder names (exact match) */
export const BLOCKED_DIR_NAMES: string[] = [
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  '.idea',
  '.vscode',
  '__MACOSX',
  '.DS_Store', // sometimes appears as a folder on macOS
  'Thumbs.db', // Windows artifact
  '.Trash', // macOS/Linux trash
  'venv', // Python virtual env
  '.venv',
  'env',
  '.env',
  'dist',
  'build',
  'out',
  'coverage',
  '.cache'
]

/** Regular expressions for more flexible filtering */
export const BLOCKED_DIR_PATTERNS: RegExp[] = [
  /^__pycache__$/i, // Python cache
  /^backup/i, // backup, backups, Backup-old
  /^temp/i, // temp, tmp
  /^tmp$/i,
  /^log(s)?$/i, // log, logs
  /^cache$/i,
  /^\./ // hidden folders starting with "."
]
