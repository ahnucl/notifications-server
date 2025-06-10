import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  tsconfig: './tsconfig.build.json',
})
