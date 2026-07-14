import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createConsoleDesignSystem } from '@dock/console-uikit-vue'
import '@dock/console-uikit-vue/style.css'

const app = createApp(App)
app.use(createConsoleDesignSystem({ lang: 'pt' }))

app.mount('#app')
