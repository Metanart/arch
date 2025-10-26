/* eslint-disable @typescript-eslint/no-explicit-any */

export const OMIT = Symbol('OMIT')

type Key = string | number | symbol

export function convertDto<
  SourceObject extends Record<Key, any>,
  ResultObject extends Record<Key, any>
>(
  sourceObject: SourceObject,
  options?: {
    includeKeys?: readonly (keyof SourceObject | string)[]
    excludeKeys?: readonly (keyof SourceObject | string)[]
    transforms?: Partial<
      Record<keyof SourceObject & string, (value: any, key: string, source: SourceObject) => any>
    >
    defaultTransform?: (value: any, key: string, source: SourceObject) => any
  }
): ResultObject {
  const { includeKeys, excludeKeys, transforms, defaultTransform } = options ?? {}

  const includeSet =
    includeKeys && includeKeys.length > 0 ? new Set<string>(includeKeys as any) : null

  const excludeSet =
    excludeKeys && excludeKeys.length > 0 ? new Set<string>(excludeKeys as any) : null

  const resultObject = Object.keys(sourceObject).reduce<Record<string, any>>((acc, key) => {
    if (includeSet && !includeSet.has(key)) return acc
    if (excludeSet && excludeSet.has(key)) return acc

    const value = (sourceObject as Record<string, any>)[key]

    const fieldTransformer = transforms && transforms[key as keyof SourceObject & string]

    let transformedValue = value

    if (fieldTransformer) {
      transformedValue = fieldTransformer(value, key, sourceObject)
    } else if (defaultTransform) {
      transformedValue = defaultTransform(value, key, sourceObject)
    }

    if (transformedValue !== OMIT) acc[key] = transformedValue

    return acc
  }, {})

  return resultObject as any as ResultObject
}
