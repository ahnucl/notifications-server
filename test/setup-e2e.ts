import { config } from 'dotenv'
// import { execSync } from 'node:child_process'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

beforeEach(() => {
  // const containerName = execSync(
  //   'docker run --rm -p 6380:6379 -d redis:8.0.2-bookworm'
  // )
  //   .toString()
  //   .trim()
  // return () => {
  //   execSync(`docker stop ${containerName}`)
  // }
})
