# EGE Sales

Sistema Next.js para criar paginas de vendas reutilizaveis por slug, com identidade EGE, painel admin protegido, checkout Kiwify e tracking Google Ads.

## Rotas

- `/produto1` e `/produto2`: exemplos de paginas de venda.
- `/[slug]`: template dinamico para qualquer produto.
- `/painelsecreto/login`: login do painel.
- `/painelsecreto`: painel protegido por cookie httpOnly.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/produto1`.

## Variaveis de ambiente

Configure no `.env.local` e tambem na Vercel:

```bash
ADMIN_USER="admin"
ADMIN_PASS="troque-esta-senha"
ADMIN_SESSION_SECRET="troque-este-segredo-longo"

NEXT_PUBLIC_EGE_STORE_URL="https://sualoja.com.br"
NEXT_PUBLIC_GOOGLE_ADS_ID="AW-XXXXXXXXX"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL="XXXXXXXXXXXX"

UPSTASH_REDIS_REST_URL="https://seu-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="seu-token"
```

As credenciais do painel nunca sao expostas no frontend. A validacao acontece na API server-side e a sessao e salva em cookie httpOnly.

## Criar novos produtos

1. Acesse `/painelsecreto/login`.
2. Entre com `ADMIN_USER` e `ADMIN_PASS`.
3. Clique em `Novo produto`.
4. Edite slug, textos, preco, midia, checkout Kiwify e tracking.
5. Clique em `Salvar alteracoes`.
6. Abra a rota gerada, como `/meu-produto`.

Os produtos criados no painel sao salvos em Redis/Upstash via API server-side. Configure `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` na Vercel para garantir persistencia real entre navegadores, horas e novos deploys. O projeto tambem aceita `KV_REST_API_URL`, `KV_REST_API_TOKEN` e os nomes gerados pela integracao com prefixo `UPSTASH_REDIS_REST_KV`.

## Google Ads

O projeto carrega `gtag.js` quando `NEXT_PUBLIC_GOOGLE_ADS_ID` esta configurado. Por produto, o painel permite definir:

- Google Ads ID, como `AW-XXXX`.
- Conversion Label.

Eventos disparados:

- `PageView`
- `ViewContent`
- `cta_click`
- `video_click`
- `conversion` no clique do CTA

## Deploy na Vercel

Envie o projeto para a Vercel, configure as variaveis de ambiente e faça o deploy como projeto Next.js.
