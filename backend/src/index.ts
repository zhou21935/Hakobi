import { buildApp } from './app.js'
import { loadConfig } from './config.js'

async function main() {
  try {
    const config = loadConfig()
    const app = await buildApp(config)
    let closing = false
    const close = async () => { if (closing) return; closing = true; await app.close() }
    process.once('SIGINT', close)
    process.once('SIGTERM', close)
    await app.listen({ host: '0.0.0.0', port: config.port })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Server startup failed')
    process.exitCode = 1
  }
}
void main()
