/**
 * Creates a predicate for filtering directories.
 *
 * @param blockedNames  list of directory names to skip (exact match)
 * @param blockedPatterns list of RegExp patterns that should not match names
 * @param allowHidden   include hidden directories (starting with ".")
 */
export function makeDirPredicate(
  blockedNames: string[] = [],
  blockedPatterns: RegExp[] = [],
  allowHidden = false
) {
  return (dirName: string): boolean => {
    // 1. Hidden directories
    if (!allowHidden && dirName.startsWith('.')) return false

    // 2. Explicitly blocked names
    if (blockedNames.includes(dirName)) return false

    // 3. Check by patterns
    for (const pattern of blockedPatterns) {
      if (pattern.test(dirName)) return false
    }

    return true
  }
}
