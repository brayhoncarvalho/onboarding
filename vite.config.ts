import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/onboarding/',
  resolve: {
    alias: [
      // Subpath deve vir ANTES do pacote geral (ordem importa no Vite)
      {
        find: '@dock/console-uikit-vue/style.css',
        replacement: path.resolve(__dirname, 'src/lib/dock-ds-stub.css'),
      },
      {
        find: '@dock/console-uikit-vue',
        replacement: path.resolve(__dirname, 'src/lib/dock-ds-stub.ts'),
      },
    ],
  },
})
