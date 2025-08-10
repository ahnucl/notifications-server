import { execSync } from 'node:child_process'
import { test as baseTest } from 'vitest'

const containerPortMap: Map<string, number> = new Map()

export const test = baseTest.extend({
  databaseContainer: async ({}, use) => {
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

    return () => {
      execSync(`docker stop ${containerName}`)
    }
  },
})
