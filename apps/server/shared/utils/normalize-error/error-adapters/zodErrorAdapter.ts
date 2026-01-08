import { z, ZodError } from 'zod'
import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

export type ZodErrorCode = 'ZOD_VALIDATION_ERROR'

type ZodIssueDTO = {
  path: string
  message: string
  code: z.core.$ZodIssue['code']
}

type ZodValidationDetails = {
  schema?: string
  issues: ZodIssueDTO[]
  issuesCount: number
}

type ZodAdapterOptions = {
  schema?: string
  maxIssues?: number
  includeSummaryInMessage?: boolean
}

function formatZodPath(path: Array<symbol | string | number>): string {
  if (path.length === 0) return '(root)'
  return path.map((segment) => (typeof segment === 'number' ? String(segment) : segment)).join('.')
}

function mapIssue(issue: z.core.$ZodIssue): ZodIssueDTO {
  return {
    path: formatZodPath(issue.path),
    message: issue.message,
    code: issue.code
  }
}

function buildMessage(issues: ZodIssueDTO[], includeSummary: boolean): string {
  if (issues.length === 0) return 'Validation failed.'

  const first = issues[0]
  if (!includeSummary || issues.length === 1) {
    return `${first.path}: ${first.message}`
  }

  const remaining = issues.length - 1
  return `${first.path}: ${first.message} (+${remaining} more)`
}

export function zodErrorAdapter(
  error: unknown,
  context: AppContext,
  options: ZodAdapterOptions = {}
): AppError<ZodErrorCode> | null {
  if (!(error instanceof ZodError)) return null

  const maxIssues = options.maxIssues ?? 25
  const includeSummaryInMessage = options.includeSummaryInMessage ?? true

  const mappedIssues = error.issues.slice(0, maxIssues).map(mapIssue)
  const message = buildMessage(mappedIssues, includeSummaryInMessage)

  const details: ZodValidationDetails = {
    schema: options.schema,
    issues: mappedIssues,
    issuesCount: error.issues.length
  }

  return new AppError<ZodErrorCode>({
    code: 'ZOD_VALIDATION_ERROR',
    message,
    cause: error,
    details,
    ...context
  })
}
