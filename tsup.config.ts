import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/main.ts'],
  tsconfig: './tsconfig.build.json',
})
