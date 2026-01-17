/**
 * Safely gets the file extension from a file name.
 *
 * @param fileName the file name to get the extension from
 * @returns the file extension, or an empty string if the file name is invalid or has no extension
 */
export function safeGetFileExtension(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return ''
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) return ''
  return fileName.slice(lastDotIndex + 1).toLowerCase()
}
