import { describe, expect, it } from 'vitest'
import { loadConfig } from '../../src/config.js'
describe('loadConfig', () => {
 it('loads validated values', () => expect(loadConfig({ SUPABASE_URL:'https://test.supabase.co/', SUPABASE_SERVICE_ROLE_KEY:'server-only-key', SUPABASE_DB_URL:'postgresql://user:secret@localhost/db', CORS_ORIGIN:'http://localhost:5173', PORT:'4000' })).toMatchObject({ supabaseUrl:'https://test.supabase.co', supabaseServiceRoleKey:'server-only-key', port:4000 }))
 it('fails startup clearly when the server-only storage credential is absent', () => expect(() => loadConfig({ SUPABASE_URL:'https://test.supabase.co', SUPABASE_DB_URL:'postgresql://user:secret@localhost/db', CORS_ORIGIN:'http://localhost:5173' })).toThrowError(/SUPABASE_SERVICE_ROLE_KEY/))
 it('never discloses database secrets', () => expect(() => loadConfig({ SUPABASE_DB_URL:'secret-value' })).toThrowError(/SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL, CORS_ORIGIN/))
})
