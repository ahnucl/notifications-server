import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // globalSeKtup: ['./test/setup-global-e2e.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [tsConfigPaths()],
})
