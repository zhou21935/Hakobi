import { z } from 'zod'

const schema = z.object({
  SUPABASE_URL: z.url().refine((url) => url.startsWith('https://'), 'must use HTTPS'),
  SUPABASE_DB_URL: z.string().regex(/^postgres(ql)?:\/\//, 'must be PostgreSQL'),
  CORS_ORIGIN: z.url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000)
})

export type Config = { supabaseUrl: string; databaseUrl: string; corsOrigin: string; port: number }

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = schema.safeParse(env)
  if (!result.success) {
    const names = result.error.issues.map((issue) => String(issue.path[0])).filter(Boolean)
    throw new Error(`Invalid server configuration: ${[...new Set(names)].join(', ')}`)
  }
  return {
    supabaseUrl: result.data.SUPABASE_URL.replace(/\/$/, ''),
    databaseUrl: result.data.SUPABASE_DB_URL,
    corsOrigin: result.data.CORS_ORIGIN,
    port: result.data.PORT
  }
}

