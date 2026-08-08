import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path) => readFile(resolve(process.cwd(), path), 'utf8')

describe('deployment configuration contract', () => {
  it('runs separate frontend and backend checks for pull requests and main pushes', async () => {
    const workflow = await readProjectFile('.github/workflows/ci.yml')

    expect(workflow).toMatch(/pull_request:/)
    expect(workflow).toMatch(/push:\s*\n\s+branches:\s*\[main\]/)
    expect(workflow).toMatch(/frontend:[\s\S]*?npm ci[\s\S]*?npm test[\s\S]*?npm run build/)
    expect(workflow).toMatch(/backend:[\s\S]*?working-directory:\s*server[\s\S]*?npm ci[\s\S]*?npm test[\s\S]*?npm run typecheck[\s\S]*?npm run build/)
  })

  it('defines checks-gated frontend and backend Render services', async () => {
    const blueprint = await readProjectFile('render.yaml')

    expect(blueprint.match(/branch:\s*main/g)).toHaveLength(2)
    expect(blueprint.match(/plan:\s*free/g)).toHaveLength(2)
    expect(blueprint.match(/autoDeployTrigger:\s*checksPass/g)).toHaveLength(2)
    expect(blueprint).toMatch(/runtime:\s*static[\s\S]*?staticPublishPath:\s*\.\/dist/)
    expect(blueprint).toMatch(/type:\s*rewrite[\s\S]*?source:\s*\/\*[\s\S]*?destination:\s*\/index\.html/)
    expect(blueprint).toMatch(/runtime:\s*node[\s\S]*?rootDir:\s*server[\s\S]*?buildCommand:\s*npm ci && npm run build[\s\S]*?startCommand:\s*npm start[\s\S]*?healthCheckPath:\s*\/health/)
  })

  it('declares required environment variables without inline values', async () => {
    const blueprint = await readProjectFile('render.yaml')
    const requiredNames = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_API_BASE_URL',
      'SUPABASE_URL',
      'SUPABASE_DB_URL',
      'CORS_ORIGIN',
    ]

    for (const name of requiredNames) {
      expect(blueprint).toMatch(new RegExp(`key: ${name}\\s*\\n\\s+sync: false`))
    }
    expect(blueprint).not.toMatch(/key:\s*PORT/)
    expect(blueprint).not.toMatch(/(?:password|service[_-]?role|secret)[^\n]*:/i)
  })
})
