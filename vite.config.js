import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const base =
    isDev ? '/' : process.env.BASE_PATH || (repoName ? `/${repoName}/` : '/')

  return {
    plugins: [react()],
    base,
  }
})
