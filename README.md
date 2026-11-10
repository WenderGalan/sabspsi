# SabsPsi

Landing page de Sabrina Galan, criada com Vue 3 e Vite para publicação na Vercel.

## Editar conteúdo

Todos os textos, contatos, URLs, descrições de imagem e metadados da página ficam em [`dados.json`](./dados.json). Para trocar uma foto, coloque o arquivo em `public/imagens/` e altere o caminho correspondente em `dados.json`.

O link do WhatsApp é montado a partir de `contato.telefoneWhatsapp` (somente dígitos) e `contato.mensagemWhatsapp`. Confira o número antes de publicar.

O crédito de desenvolvimento, o link do GitHub e o copyright do rodapé ficam em `rodape` no mesmo JSON. As animações estão no próprio componente e em `src/style.css`, com alternativa para movimento reduzido.

O ano do copyright é calculado automaticamente no fuso de Campo Grande.

## Executar

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## Vercel

Importe este repositório na Vercel. O framework é Vite; o comando de build é `npm run build` e a pasta de saída é `dist`. O projeto usa npm e `package-lock.json`.

## Busca no Google

O build entrega o texto da página já no HTML, além de título, descrição, dados estruturados e `robots.txt`. Quando a URL de produção estiver disponível, defina `site.urlPublica` em `dados.json` (por exemplo, `https://seudominio.com.br`). Se esse campo estiver vazio, o build na Vercel usa `VERCEL_PROJECT_PRODUCTION_URL` para gerar a URL canônica, a imagem de compartilhamento e `sitemap.xml`. Não coloque uma URL de preview nesse campo.

Depois de publicar, verifique o domínio no Google Search Console, envie `/sitemap.xml` e use a Inspeção de URL para confirmar que a página foi rastreada e indexada. A hospedagem na Vercel permite indexação, mas não garante posição nas buscas. Conteúdo útil, links de outros sites e uma presença local legítima continuam relevantes. O site apresenta Sabrina como estudante e não usa marcação de consultório ou serviço psicológico particular.

Sabrina é apresentada como estudante de Psicologia no 8º semestre. O texto público não anuncia atendimento psicológico particular. Antes de alterar essa informação, confirme a situação de formação, registro e eventual estágio supervisionado.
