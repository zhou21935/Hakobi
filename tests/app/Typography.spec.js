import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('application typography', () => {
  it('loads only the specified Chiron GoRound TC Google Font stylesheet', () => {
    const html = readFileSync('index.html', 'utf8')

    expect(html).toContain('<link rel="preconnect" href="https://fonts.googleapis.com"')
    expect(html).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin')
    expect(html).toContain('https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@200..900&display=swap')
    expect(html).not.toMatch(/Baloo|Noto\+Sans\+TC/)
  })

  it('uses Chiron GoRound TC for headings and body text with Medium 500 by default', () => {
    const css = readFileSync('src/assets/main.css', 'utf8')

    expect(css).toContain("--font-heading: 'Chiron GoRound TC', system-ui, sans-serif;")
    expect(css).toContain("--font-sans: 'Chiron GoRound TC', system-ui, sans-serif;")
    expect(css).toMatch(/body\s*\{[^}]*font-family:\s*var\(--font-sans\);[^}]*font-weight:\s*500;/s)
    expect(css).not.toMatch(/Baloo|Noto Sans TC/)
  })
})
