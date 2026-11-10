export function urlPublica(dados, ambiente = process.env) {
  const informada = dados.site.urlPublica?.trim()
  const daVercel = ambiente.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const valor = informada || (daVercel ? `https://${daVercel}` : '')
  if (!valor) return ''

  try {
    const url = new URL(valor)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
    return url.origin
  } catch {
    return ''
  }
}

const escapar = (valor) => String(valor).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function metadadosHtml(dados, ambiente = process.env) {
  const origem = urlPublica(dados, ambiente)
  const titulo = escapar(dados.site.tituloAba)
  const descricao = escapar(dados.site.descricao)
  const imagem = origem ? new URL(dados.site.imagemCompartilhamento, origem).href : ''
  const robos = ambiente.VERCEL_ENV === 'preview' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const pessoa = {
    '@type': 'Person',
    name: dados.pessoa.nome,
    description: dados.pessoa.apresentacao,
    sameAs: [dados.contato.instagramUrl],
    knowsAbout: dados.pessoa.temas,
    homeLocation: { '@type': 'Place', name: dados.pessoa.cidade }
  }
  const pagina = {
    '@type': 'WebPage',
    name: dados.site.tituloAba,
    description: dados.site.descricao,
    inLanguage: dados.site.idioma,
    about: pessoa
  }
  if (origem) {
    pagina['@id'] = `${origem}/#pagina`
    pagina.url = `${origem}/`
    pessoa['@id'] = `${origem}/#sabrina`
    pessoa.image = imagem
  }
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', ...pagina }).replaceAll('<', '\\u003c')

  return [
    `<title>${titulo}</title>`,
    `<meta name="description" content="${descricao}" />`,
    `<meta name="robots" content="${robos}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapar(dados.site.nome)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${titulo}" />`,
    `<meta property="og:description" content="${descricao}" />`,
    origem ? `<link rel="canonical" href="${escapar(`${origem}/`)}" />` : '',
    origem ? `<meta property="og:url" content="${escapar(`${origem}/`)}" />` : '',
    imagem ? `<meta property="og:image" content="${escapar(imagem)}" />` : '',
    imagem ? `<meta property="og:image:alt" content="${escapar(dados.pessoa.fotoPrincipalAlt)}" />` : '',
    imagem ? `<meta name="twitter:card" content="summary_large_image" />` : '',
    `<link rel="preload" as="image" href="${escapar(dados.pessoa.fotoPrincipal)}" fetchpriority="high" />`,
    `<script type="application/ld+json">${jsonLd}</script>`
  ].filter(Boolean).join('\n    ')
}
