import { createClient, SCHEMA_FIELD_TYPE } from 'redis'

const client = createClient({
  socket: {
    port: 6380, // use .env
    host: 'localhost',
  },
  database: 0,
})

export async function createIndex() {
  await client.ft.create(
    'idx:notifications',
    {
      '$.id': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'id',
      },
      '$.recipientId': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'recipientId',
      },
      '$.metadata.type': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'type',
      },
      '$.readAt': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'readAt',
      },
    },
    {
      ON: 'JSON',
      PREFIX: 'notification:',
    }
  )
}

client.on('error', (error) => {
  console.error(`Redis client error:`, error)
})

export type AppRedisClient = typeof client

export { client }
