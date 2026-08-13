import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path) => readFile(resolve(process.cwd(), path), 'utf8')

describe('deployment configuration contract', () => {
  it('exposes frontend, backend, and full-project commands from the repository root', async () => {
    const rootPackage = JSON.parse(await readProjectFile('package.json'))
    const backendPackage = JSON.parse(await readProjectFile('backend/package.json'))

    expect(rootPackage.scripts).toMatchObject({
      dev: 'vite',
      test: 'vitest run',
      build: 'vite build',
      'dev:backend': 'npm --prefix backend run dev',
      'test:backend': 'npm --prefix backend test',
      'typecheck:backend': 'npm --prefix backend run typecheck',
      'build:backend': 'npm --prefix backend run build',
      'test:all': 'npm test && npm run test:backend',
      'build:all': 'npm run build && npm run build:backend',
    })
    expect(backendPackage.scripts).toMatchObject({
      dev: 'node --env-file=.env --watch --import tsx src/index.ts',
      test: 'vitest run',
      typecheck: 'tsc --noEmit',
      build: 'tsc -p tsconfig.build.json',
      start: 'node dist/index.js',
    })
  })

  it('runs separate frontend and backend checks for pull requests and main pushes', async () => {
    const workflow = await readProjectFile('.github/workflows/ci.yml')

    expect(workflow).toMatch(/pull_request:/)
    expect(workflow).toMatch(/push:\s*\n\s+branches:\s*\[main\]/)
    expect(workflow).toMatch(/frontend:[\s\S]*?npm ci[\s\S]*?npm test[\s\S]*?npm run build/)
    expect(workflow).toMatch(/backend:[\s\S]*?working-directory:\s*backend[\s\S]*?cache-dependency-path:\s*backend\/package-lock\.json[\s\S]*?npm ci[\s\S]*?npm test[\s\S]*?npm run typecheck[\s\S]*?npm run build/)
    expect(workflow).not.toMatch(/working-directory:\s*server|cache-dependency-path:\s*server\//)
  })

  it('defines checks-gated frontend and backend Render services', async () => {
    const blueprint = await readProjectFile('render.yaml')

    expect(blueprint.match(/branch:\s*main/g)).toHaveLength(2)
    expect(blueprint.match(/plan:\s*free/g)).toHaveLength(1)
    expect(blueprint).toMatch(/runtime:\s*node\s*\n\s+plan:\s*free/)
    expect(blueprint.match(/autoDeployTrigger:\s*checksPass/g)).toHaveLength(2)
    expect(blueprint).toMatch(/runtime:\s*static[\s\S]*?staticPublishPath:\s*\.\/dist/)
    expect(blueprint).toMatch(/type:\s*rewrite[\s\S]*?source:\s*\/\*[\s\S]*?destination:\s*\/index\.html/)
    expect(blueprint).toMatch(/runtime:\s*node[\s\S]*?rootDir:\s*backend[\s\S]*?buildCommand:\s*npm ci && npm run build[\s\S]*?startCommand:\s*npm start[\s\S]*?healthCheckPath:\s*\/health/)
    expect(blueprint).not.toMatch(/rootDir:\s*server/)
  })

  it('declares required environment variables without inline values', async () => {
    const blueprint = await readProjectFile('render.yaml')
    const requiredNames = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_API_BASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_DB_URL',
      'CORS_ORIGIN',
    ]

    for (const name of requiredNames) {
      expect(blueprint).toMatch(new RegExp(`key: ${name}\\s*\\n\\s+sync: false`))
    }
    expect(blueprint).not.toMatch(/key:\s*PORT/)
    expect(blueprint).not.toMatch(/(?:password|secret)[^\n]*:/i)
  })
})
