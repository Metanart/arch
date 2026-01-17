/**
 * Creates a predicate for filtering files.
 *
 * @param allowedExts list of allowed extensions (without dot, in lowercase). If empty → allow any.
 * @param blockedNames list of file names to exclude (exact match).
 * @param blockedPatterns list of RegExp patterns to exclude by name.
 * @param minSize minimum file size (bytes). If undefined → no limit.
 * @param maxSize maximum file size (bytes). If undefined → no limit.
 */
export function makeFilePredicate(
  allowedExts: string[] = [],
  blockedNames: string[] = [],
  blockedPatterns: RegExp[] = [],
  minSize?: number,
  maxSize?: number
) {
  const allowedSet = new Set(allowedExts.map((e) => e.toLowerCase()))

  return (fileName: string, fileSize: number): boolean => {
    const ext = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : ''

    // 1. Check by name
    if (blockedNames.includes(fileName)) return false

    // 2. Check by patterns
    for (const pattern of blockedPatterns) {
      if (pattern.test(fileName)) return false
    }

    // 3. Check by extension
    if (allowedSet.size > 0 && !allowedSet.has(ext)) return false

    // 4. Check by size
    if (minSize != null && fileSize < minSize) return false
    if (maxSize != null && fileSize > maxSize) return false

    return true
  }
}
