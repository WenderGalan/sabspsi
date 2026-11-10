import { readFile, writeFile } from 'node:fs/promises'
import { renderToString } from 'vue/server-renderer'
import { urlPublica } from './seo.mjs'
import { criarPagina } from '../.ssr/entry-server.js'

const dados = JSON.parse(await readFile(new URL('../dados.json', import.meta.url), 'utf8'))
const conteudo = await renderToString(criarPagina())
const arquivo = new URL('../dist/index.html', import.meta.url)
const html = await readFile(arquivo, 'utf8')
const marcador = '<div id="app"></div>'
if (!html.includes(marcador)) throw new Error('Não foi encontrado o elemento da aplicação no HTML final.')
await writeFile(arquivo, html.replace(marcador, `<div id="app">${conteudo}</div>`))

const origem = urlPublica(dados)
const robos = `User-agent: *\nAllow: /\n${origem ? `Sitemap: ${origem}/sitemap.xml\n` : ''}`
await writeFile(new URL('../dist/robots.txt', import.meta.url), robos)
if (origem) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origem}/</loc></url></urlset>\n`
  await writeFile(new URL('../dist/sitemap.xml', import.meta.url), sitemap)
}
console.log(`HTML pré-renderizado para busca${origem ? ` em ${origem}` : ' (URL pública pendente)'}.`)
