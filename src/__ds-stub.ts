// Stub local para @dock/console-uikit-vue (DS não instalado no ambiente)
// Este arquivo é referenciado apenas pelo alias do Vite em dev quando o pacote não está disponível.
import type { App } from 'vue'

export function createConsoleDesignSystem(_options?: { lang?: string }) {
  return {
    install(_app: App) {
      // noop — stub sem funcionalidade
    },
  }
}
