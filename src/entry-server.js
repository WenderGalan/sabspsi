import { createSSRApp } from 'vue'
import App from './App.vue'

export function criarPagina() {
  return createSSRApp(App)
}
