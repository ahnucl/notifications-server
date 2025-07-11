import { z } from 'zod'

export const envSchema = z.object({
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
  REDIS_DATABASE: z.coerce.number().default(0),
})

export type Env = z.infer<typeof envSchema>

export function getEnv() {
  return envSchema.parse(process.env)
}
