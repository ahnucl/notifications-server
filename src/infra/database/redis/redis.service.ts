import { createClient } from 'redis'

const client = createClient({})

client.on('error', (error) => {
  console.error(`Redis client error:`, error)
})

export { client }
