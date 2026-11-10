<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import dados from '../dados.json'

const cena = ref(null)
const hero = ref(null)
const passoAtivo = ref(0)
const menuAberto = ref(false)
const heroPronto = ref(false)
const whatsapp = computed(() => `https://wa.me/${dados.contato.telefoneWhatsapp}?text=${encodeURIComponent(dados.contato.mensagemWhatsapp)}`)
let frame = 0
let observador
const movimentoReduzido = typeof window === 'undefined' ? { matches: false } : window.matchMedia('(prefers-reduced-motion: reduce)')
const anoAtual = new Intl.DateTimeFormat('pt-BR', { year: 'numeric', timeZone: 'America/Campo_Grande' }).format(new Date())

function atualizarCena() {
  if (!cena.value || movimentoReduzido.matches) return
  const retangulo = cena.value.getBoundingClientRect()
  const distancia = Math.max(1, retangulo.height - window.innerHeight)
  const valor = Math.max(0, Math.min(1, -retangulo.top / distancia))
  passoAtivo.value = Math.min(dados.escuta.reflexoes.length - 1, Math.floor(valor * dados.escuta.reflexoes.length))
  cena.value.style.setProperty('--escuta-progresso', valor.toFixed(3))
}

function aoRolar() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    atualizarCena()
    if (!hero.value || movimentoReduzido.matches) return
    const altura = Math.max(1, hero.value.offsetHeight)
    const valor = Math.max(0, Math.min(1, -hero.value.getBoundingClientRect().top / altura))
    hero.value.style.setProperty('--hero-scroll', valor.toFixed(3))
    hero.value.style.setProperty('--hero-shift', `${(valor * 58).toFixed(1)}px`)
    hero.value.style.setProperty('--hero-rotate', `${(valor * 19).toFixed(1)}deg`)
  })
}

function moverPonteiro(evento) {
  if (!hero.value || movimentoReduzido.matches || matchMedia('(pointer: coarse)').matches) return
  const rect = hero.value.getBoundingClientRect()
  hero.value.style.setProperty('--pointer-x', `${(((evento.clientX - rect.left) / rect.width - .5) * 22).toFixed(2)}px`)
  hero.value.style.setProperty('--pointer-y', `${(((evento.clientY - rect.top) / rect.height - .5) * 22).toFixed(2)}px`)
}

onMounted(() => {
  document.documentElement.classList.add('motion-ready')
  observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue
      entrada.target.classList.add('is-visible')
      observador.unobserve(entrada.target)
    }
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' })
  document.querySelectorAll('[data-reveal]').forEach((elemento) => observador.observe(elemento))
  requestAnimationFrame(() => { heroPronto.value = true })
  aoRolar()
  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRolar)
  hero.value?.addEventListener('pointermove', moverPonteiro, { passive: true })
})

onUnmounted(() => {
  observador?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', aoRolar)
  window.removeEventListener('resize', aoRolar)
  hero.value?.removeEventListener('pointermove', moverPonteiro)
})
</script>

<template>
  <a class="skip-link" href="#conteudo">{{ dados.acessibilidade.pular }}</a>

  <header class="cabecalho">
    <a class="marca" href="#inicio" :aria-label="dados.site.nome">
      <span class="marca-simbolo" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>{{ dados.site.nome }}</span>
    </a>
    <button class="menu-toggle" type="button" :aria-expanded="menuAberto" aria-controls="menu-principal" @click="menuAberto = !menuAberto">
      {{ menuAberto ? dados.navegacao.fechar : dados.navegacao.abrir }}
    </button>
    <nav id="menu-principal" class="menu" :class="{ aberto: menuAberto }" :aria-label="dados.acessibilidade.navegacao">
      <a href="#sobre" @click="menuAberto = false">{{ dados.navegacao.sobre }}</a>
      <a href="#olhar" @click="menuAberto = false">{{ dados.navegacao.olhar }}</a>
      <a href="#trajetoria" @click="menuAberto = false">{{ dados.navegacao.trajetoria }}</a>
      <a class="menu-contato" href="#contato" @click="menuAberto = false">{{ dados.navegacao.contato }} <svg class="icon-arrow icon-arrow-up" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" /></svg></a>
    </nav>
  </header>

  <main id="conteudo">
    <section id="inicio" ref="hero" class="hero" :class="{ 'is-ready': heroPronto }">
      <div class="hero-orbita" aria-hidden="true"><span class="orbita-linha orbita-linha-a"></span><span class="orbita-linha orbita-linha-b"></span><span class="orbita-planeta"></span></div>
      <svg class="hero-traco" viewBox="0 0 700 360" fill="none" aria-hidden="true"><path d="M-20 295C81 289 110 147 209 157c81 8 72 131 173 122 89-9 87-143 169-157 65-11 79 53 164 32" /></svg>
      <div class="hero-conteudo">
        <p class="eyebrow hero-eyebrow">{{ dados.abertura.selo }}</p>
        <h1><span class="hero-line"><span class="hero-line-text">{{ dados.abertura.tituloLinha1 }}</span></span>{{ ' ' }}<span class="hero-line"><span class="hero-line-text">{{ dados.abertura.tituloLinha2 }}</span></span>{{ ' ' }}<span class="hero-line"><em class="hero-line-text">{{ dados.abertura.tituloLinha3 }}</em></span></h1>
        <div class="hero-baixo">
          <p>{{ dados.abertura.texto }}</p>
          <a class="link-texto" href="#sobre">{{ dados.abertura.chamada }} <svg class="icon-arrow icon-arrow-down" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5 19 19M19 7v12H7" /></svg></a>
        </div>
      </div>
      <div class="hero-retrato">
        <div class="hero-foto-wrap"><img :src="dados.pessoa.fotoPrincipal" :alt="dados.pessoa.fotoPrincipalAlt" fetchpriority="high" /></div>
        <div class="hero-sticker" aria-hidden="true"><span></span><span></span><span></span><i></i><i></i></div>
        <p class="hero-legenda">{{ dados.pessoa.formacao }}<br />{{ dados.pessoa.cidade }}</p>
      </div>
      <p class="hero-nota">{{ dados.abertura.nota }}</p>
    </section>

    <section id="sobre" class="sobre section-shell">
      <div class="sobre-coluna">
        <p class="eyebrow" data-reveal="fade">{{ dados.sobre.marcador }}</p>
        <h2 data-reveal="rise">{{ dados.sobre.titulo }}</h2>
        <div class="sobre-corpo" data-reveal="rise">
          <p>{{ dados.sobre.texto1 }}</p>
          <p>{{ dados.sobre.texto2 }}</p>
        </div>
      </div>
      <div class="sobre-detalhe"><img :src="dados.pessoa.fotoLivro" :alt="dados.pessoa.fotoLivroAlt" loading="lazy" /><span class="doodle-asterisco" aria-hidden="true">✳</span><span class="doodle-orbita" aria-hidden="true"></span></div>
      <p class="sobre-assinatura">{{ dados.sobre.legenda }}</p>
    </section>

    <section id="olhar" class="olhar section-shell">
      <div class="olhar-topo">
        <p class="eyebrow" data-reveal="fade">{{ dados.olhar.marcador }}</p>
        <span class="olhar-estrela" aria-hidden="true">✳</span>
      </div>
      <h2 data-reveal="rise">{{ dados.olhar.titulo }}</h2>
      <div class="olhar-rodape">
        <p data-reveal="fade">{{ dados.olhar.texto }}</p>
        <div class="olhar-frase" data-reveal="scale"><span aria-hidden="true">“</span>{{ dados.olhar.frase }}</div>
      </div>
    </section>

    <section ref="cena" class="escuta" :aria-label="dados.escuta.marcador">
      <div class="escuta-palco">
        <div class="escuta-cabecalho">
          <p class="eyebrow">{{ dados.escuta.marcador }}</p>
          <p class="escuta-intro">{{ dados.escuta.introducao }}</p>
        </div>
        <div class="escuta-centro" aria-hidden="true">
          <div class="escuta-traco escuta-traco-a"></div>
          <div class="escuta-traco escuta-traco-b"></div>
          <div class="escuta-circulo"><span class="escuta-vazio"></span><span class="escuta-nucleo"></span></div>
          <div class="escuta-ponto escuta-ponto-a"></div>
          <div class="escuta-ponto escuta-ponto-b"></div>
          <div class="escuta-ponto escuta-ponto-c"></div>
        </div>
        <div class="escuta-texto">
          <h2>{{ dados.escuta.titulo }}</h2>
          <div class="escuta-cartoes">
            <article v-for="(item, indice) in dados.escuta.reflexoes" :key="item.titulo" class="escuta-cartao" :class="{ ativo: passoAtivo === indice }">
              <span class="cartao-marcador">{{ String(indice + 1).padStart(2, '0') }}</span>
              <h3>{{ item.titulo }}</h3>
              <p>{{ item.texto }}</p>
            </article>
          </div>
        </div>
        <div class="escuta-rodape"><span>{{ dados.escuta.conclusao }}</span><span class="escuta-contador">{{ String(passoAtivo + 1).padStart(2, '0') }} / {{ String(dados.escuta.reflexoes.length).padStart(2, '0') }}</span></div>
      </div>
      <div class="escuta-reduzida">
        <article v-for="(item, indice) in dados.escuta.reflexoes" :key="item.titulo">
          <span>{{ String(indice + 1).padStart(2, '0') }}</span><h3>{{ item.titulo }}</h3><p>{{ item.texto }}</p>
        </article>
      </div>
    </section>

    <section id="trajetoria" class="trajetoria section-shell">
      <div class="trajetoria-imagem" data-reveal="left"><img :src="dados.pessoa.fotoSecundaria" :alt="dados.pessoa.fotoSecundariaAlt" loading="lazy" decoding="async" /></div>
      <div class="trajetoria-conteudo">
        <p class="eyebrow" data-reveal="fade">{{ dados.trajetoria.marcador }}</p>
        <h2 data-reveal="rise">{{ dados.trajetoria.titulo }}</h2>
        <p data-reveal="fade">{{ dados.trajetoria.texto }}</p>
        <ul class="trajetoria-lista">
          <li v-for="experiencia in dados.trajetoria.experiencias" :key="experiencia">{{ experiencia }}</li>
        </ul>
        <p class="trajetoria-nota">{{ dados.trajetoria.nota }}</p>
      </div>
    </section>

    <section id="perguntas" class="perguntas section-shell" aria-labelledby="perguntas-titulo">
      <div class="perguntas-intro">
        <p class="eyebrow" data-reveal="fade">{{ dados.perguntas.marcador }}</p>
        <h2 id="perguntas-titulo" data-reveal="rise">{{ dados.perguntas.titulo }}</h2>
      </div>
      <div class="perguntas-lista">
        <article v-for="item in dados.perguntas.itens" :key="item.pergunta" data-reveal="rise">
          <h3>{{ item.pergunta }}</h3>
          <p>{{ item.resposta }}</p>
        </article>
      </div>
    </section>

    <section id="contato" class="contato section-shell">
      <div class="contato-forma" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="eyebrow" data-reveal="fade">{{ dados.contato.marcador }}</p>
      <h2 data-reveal="rise">{{ dados.contato.titulo }}</h2>
      <p class="contato-texto">{{ dados.contato.texto }}</p>
      <a class="botao-contato" :href="whatsapp" target="_blank" rel="noopener noreferrer">{{ dados.contato.botao }} <svg class="icon-arrow icon-arrow-up" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" /></svg></a>
      <div class="contato-links">
        <a :href="dados.contato.instagramUrl" target="_blank" rel="noopener noreferrer">{{ dados.contato.instagramExibido }}</a>
        <a :href="whatsapp" target="_blank" rel="noopener noreferrer">{{ dados.contato.telefoneExibido }}</a>
      </div>
    </section>
  </main>

  <footer class="rodape">
    <a class="marca" href="#inicio"><span class="marca-simbolo" aria-hidden="true"><i></i><i></i><i></i></span><span>{{ dados.site.nome }}</span></a>
    <p>{{ dados.contato.rodape }}</p>
    <small>{{ dados.contato.notaProfissional }}</small>
    <div class="rodape-creditos"><span>© {{ anoAtual }} {{ dados.site.nome }}. {{ dados.rodape.direitos }}</span><a :href="dados.rodape.githubUrl" target="_blank" rel="noopener noreferrer">{{ dados.rodape.credito }} <strong>{{ dados.rodape.desenvolvedor }}</strong><svg class="icon-arrow icon-arrow-up" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" /></svg></a></div>
  </footer>
</template>
