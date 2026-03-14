/* eslint-disable @typescript-eslint/no-explicit-any */

export const OMIT = Symbol('OMIT')

type Key = string | number | symbol

export function convertDto<
  GSourceObject extends Record<Key, any>,
  GTargetObject extends Record<Key, any>
>(
  sourceObject: GSourceObject,
  options?: {
    includeKeys?: readonly (keyof GSourceObject | string)[]
    excludeKeys?: readonly (keyof GSourceObject | string)[]
    transforms?: Partial<
      Record<keyof GSourceObject & string, (value: any, key: string, source: GSourceObject) => any>
    >
    defaultTransform?: (value: any, key: string, source: GSourceObject) => any
  }
): GTargetObject {
  const { includeKeys, excludeKeys, transforms, defaultTransform } = options ?? {}

  const includeSet =
    includeKeys && includeKeys.length > 0 ? new Set<string>(includeKeys as any) : null

  const excludeSet =
    excludeKeys && excludeKeys.length > 0 ? new Set<string>(excludeKeys as any) : null

  const targetObject = Object.keys(sourceObject).reduce<Record<string, any>>((acc, key) => {
    if (includeSet && !includeSet.has(key)) return acc
    if (excludeSet && excludeSet.has(key)) return acc

    const value = (sourceObject as Record<string, any>)[key]

    const fieldTransformer = transforms && transforms[key as keyof GSourceObject & string]

    let transformedValue = value

    if (fieldTransformer) {
      transformedValue = fieldTransformer(value, key, sourceObject)
    } else if (defaultTransform) {
      transformedValue = defaultTransform(value, key, sourceObject)
    }

    if (transformedValue !== OMIT) acc[key] = transformedValue

    return acc
  }, {})

  return targetObject as any as GTargetObject
}
