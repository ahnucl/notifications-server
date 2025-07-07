import { createClient } from 'redis'

const client = createClient({
  socket: {
    port: 6379,
    host: 'localhost',
  },
  database: 0,
})

client.on('error', (error) => {
  console.error(`Redis client error:`, error)
})

export type AppRedisClient = typeof client

export { client }
