import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('Supabase deployment documentation', () => {
  it('documents target confirmation, migration safety, rollback, and verification', async () => {
    const guide = await readFile(`${process.cwd()}/docs/supabase-setup.md`, 'utf8')
    for (const required of [
      'project ref', 'supabase migration list', 'supabase db push', '備份',
      '不得對遠端執行', 'forward migration', 'npm run verify:deployment'
    ]) expect(guide.toLowerCase()).toContain(required.toLowerCase())
  })

  it('records the non-secret deployment verification result', async () => {
    const record = await readFile(`${process.cwd()}/docs/deployment-record.md`, 'utf8')
    for (const required of [
      'uoqxviuwkcrxvlrnxcei', 'http://localhost:3000', 'http://localhost:5173',
      'Remote database is up to date', 'cleaned=true', 'owner isolation: passed',
      'verification time'
    ]) expect(record.toLowerCase()).toContain(required.toLowerCase())
    expect(record).not.toMatch(/password|access[_ -]?token|anon[_ -]?key|postgres(?:ql)?:\/\//i)
  })
})
