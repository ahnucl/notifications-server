import { createIndex, makeClient } from '@/infra/database/redis/redis.service'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

beforeEach(async () => {
  const containerName = execSync(
    'docker run --rm -p :6379 -d redis:8.0.2-bookworm'
  )
    .toString()
    .trim()

  const portOutput = execSync(`docker port ${containerName} 6379/tcp`)
    .toString()
    .trim()

  const hostPort = portOutput.split(':').pop()

  process.env.REDIS_PORT = hostPort

  const redis = makeClient()
  await redis.connect()
  await createIndex(redis)
  await redis.close()

  return () => {
    execSync(`docker stop ${containerName}`)
  }
})
