import { getEnv } from '@/infra/env/env.service'
import { createClient, RedisClientType, SCHEMA_FIELD_TYPE } from 'redis'

export function makeClient() {
  const env = getEnv()
  const client = createClient({
    socket: {
      port: env.REDIS_PORT,
      host: env.REDIS_HOST,
    },
    database: env.REDIS_DATABASE,
  })

  client.on('error', (error) => {
    console.error(`Redis client error:`, error)
  })

  return client as RedisClientType
}

export async function createIndex(client: RedisClientType) {
  const existingIndexes = await client.ft._list()

  if (existingIndexes.includes('idx:notifications')) return

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
