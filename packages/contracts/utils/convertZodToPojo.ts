import { z } from 'zod'
import { PojosMetadataMap } from '@automapper/pojos'

type Ctor = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor
type PojoShape = Record<string, Ctor>

// Zod v4 public API for schema introspection
interface ZodDef {
  type?: string
  typeName?: string
  innerType?: z.ZodTypeAny
  schema?: z.ZodTypeAny
  value?: unknown
  values?: unknown[]
}

// Type-safe access to Zod definition
function getZodDef(t: z.ZodTypeAny): ZodDef {
  if ('_zod' in t) {
    return (t as { _zod: { def: ZodDef } })._zod.def
  }
  return (t as { _def: ZodDef })._def
}

function unwrap(t: z.ZodTypeAny): z.ZodTypeAny {
  // Use Zod v4 public API (_zod.def) instead of deprecated _def
  const def = getZodDef(t)
  const kind = def?.typeName || def?.type

  if (
    kind === 'ZodOptional' ||
    kind === 'ZodNullable' ||
    kind === 'optional' ||
    kind === 'nullable'
  ) {
    return unwrap(def.innerType!)
  }
  if (kind === 'ZodDefault' || kind === 'default') return unwrap(def.innerType!)
  if (kind === 'ZodEffects' || kind === 'effects') return unwrap(def.schema!)
  return t
}

export function convertZodToPojo<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  overrides: Partial<Record<string, Ctor>> = {}
): PojoShape {
  const entries = Object.entries(schema.shape)
    .map(([key, val]) => {
      const base = unwrap(val as z.ZodTypeAny)
      // Use Zod v4 public API (_zod.def) instead of deprecated _def
      const def = getZodDef(base)
      const kind = def?.typeName || def?.type
      let ctor: Ctor | undefined
      switch (kind) {
        case 'ZodString':
        case 'string':
          ctor = String
          break
        case 'ZodNumber':
        case 'number':
          ctor = Number
          break
        case 'ZodBoolean':
        case 'boolean':
          ctor = Boolean
          break
        case 'ZodDate':
        case 'date':
          ctor = Date
          break
        case 'ZodEnum':
        case 'ZodNativeEnum':
        case 'enum':
          ctor = String
          break
        case 'ZodLiteral':
        case 'literal': {
          // Handle both old (value) and new (values) literal formats
          const v = def.value || (def.values && def.values[0])
          ctor = typeof v === 'number' ? Number : typeof v === 'boolean' ? Boolean : String
          break
        }
        default:
          ctor = undefined
      }
      return [key, overrides[key] ?? ctor] as const
    })
    .filter(([, c]) => !!c)
  return Object.fromEntries(entries) as PojoShape
}

export function registerPojosFromZod<T extends z.ZodRawShape>(
  items: ReadonlyArray<{
    key: string
    schema: z.ZodObject<T>
    overrides?: Partial<Record<string, Ctor>>
  }>
) {
  for (const { key, schema, overrides } of items) {
    PojosMetadataMap.create(key, convertZodToPojo(schema, overrides))
  }
}
