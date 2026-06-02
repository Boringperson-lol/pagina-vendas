# Página de Vendas Escalável

Projeto Next.js pronto para deploy na Vercel com páginas dinâmicas por slug e painel secreto para editar conteúdo sem mexer no código.

## Rotas

- `/produto1` e `/produto2`: exemplos de páginas de venda.
- `/[slug]`: qualquer produto dinâmico.
- `/painelsecreto`: painel admin não indexado.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/produto1`.

## Google Ads

Configure no `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID="AW-XXXXXXXXX"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL="XXXXXXXXXXXX"
```

Também é possível alterar esses campos por produto no painel secreto.

## Criar novos produtos

1. Acesse `/painelsecreto`.
2. Clique em `Novo produto`.
3. Edite slug, textos, preço, mídia, checkout Kiwify e tracking.
4. Clique em `Salvar alterações`.
5. Abra a rota gerada, como `/meu-produto`.

Nesta versão, o painel usa `localStorage` como mock API. Para produção com múltiplos usuários, substitua `lib/storage.ts` por banco/API.

## Deploy

O projeto está configurado para Vercel. Envie o repositório, configure as variáveis de ambiente e faça o deploy como projeto Next.js.
