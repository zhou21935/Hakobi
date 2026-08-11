import { describe, expect, it } from 'vitest'
import { loadConfig } from '../../src/config.js'
describe('loadConfig', () => {
 it('loads validated values', () => expect(loadConfig({ SUPABASE_URL:'https://test.supabase.co/', SUPABASE_DB_URL:'postgresql://user:secret@localhost/db', CORS_ORIGIN:'http://localhost:5173', PORT:'4000' })).toMatchObject({ supabaseUrl:'https://test.supabase.co', port:4000 }))
 it('never discloses database secrets', () => expect(() => loadConfig({ SUPABASE_DB_URL:'secret-value' })).toThrowError(/SUPABASE_URL, SUPABASE_DB_URL, CORS_ORIGIN/))
})
