import { execSync } from 'node:child_process'

export function setup() {
  execSync(
    'docker run --rm -p 6380:6379 -d --name web-notifications-database-test redis:8.0.2-bookworm'
  )
}

export function teardown() {
  execSync('docker stop web-notifications-database-test')
}
