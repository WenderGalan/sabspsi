import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'
import { metadadosHtml } from './scripts/seo.mjs'

const dados = JSON.parse(readFileSync(new URL('./dados.json', import.meta.url), 'utf8'))

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'metadados-do-json',
      transformIndexHtml(html) {
        return html.replace('<!-- SITE_META -->', metadadosHtml(dados))
      }
    }
  ]
})
