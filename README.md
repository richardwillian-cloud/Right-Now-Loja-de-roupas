# Right Now — loja fictícia de moda urbana premium

Projeto de portfólio: um e-commerce completo (demonstrativo) com identidade visual própria, inspirada em bordados de **partitura musical**. Nenhum pagamento é processado e nenhum dado sai do navegador.

**Stack:** React 18 · TypeScript · Tailwind CSS · Zustand · React Hook Form · Zod · React Router · Framer Motion · Vite · Vitest

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # checagem de tipos + build de produção em /dist
npm run test       # testes de validadores, frete, preços, catálogo e schema
```

## Publicando

O projeto usa `HashRouter` e `base: './'`, então o conteúdo de `dist/` funciona em qualquer hospedagem estática: Netlify, Vercel, GitHub Pages ou Cloudflare Pages (build: `npm run build`, pasta: `dist`).

## Páginas

| Rota | Página |
| --- | --- |
| `/` | Home (apresentação da marca) |
| `/shop` | Catálogo com categorias, filtros e busca |
| `/produto/:slug` | Detalhes, tamanho/cor, medidas, composição e cuidados |
| `/favoritos` | Favoritos persistentes |
| `/cart` | Carrinho, frete demonstrativo e cupom |
| `/checkout` | Checkout com validação (RHF + Zod) |
| `/pedido-confirmado/:id` | Mensagem “Obrigado por testar meu site” |
| `/pedidos` | Histórico de pedidos demonstrativos |
| `/admin` | CRUD de produtos, estoque e status de pedidos |
| `/ajuda` | Entrega, trocas, medidas e cuidados |

## Para testar

- Cupons: `RIGHTNOW10` (10%) e `PARTITURA15` (15%). Pix tem 5% extra.
- Frete grátis (entrega padrão) a partir de R$ 900.
- CPF válido: `529.982.247-25`. Cartão válido (Luhn): `4242 4242 4242 4242`, qualquer validade futura e CVV.

## Estrutura

```
src/
  components/  layout · music · product · shop · cart · admin · ui
  data/        catálogo (15 peças) e tabelas de medidas
  hooks/       useCartSummary · useShopFilters (filtros na URL)
  lib/         schemas Zod · validadores · frete · preços · catálogo · formatação
  pages/       uma por rota
  store/       Zustand: produtos · carrinho · favoritos · pedidos · UI (persistência em localStorage)
public/products/  fotos recortadas do catálogo (frente e costas)
```

## Decisões de projeto

- **Estado:** quatro stores Zustand com `persist`; o estoque baixa a cada compra e o carrinho respeita o estoque de cada tamanho.
- **Formulários:** schemas Zod únicos (checkout, produto, cupom, newsletter) com `zodResolver`; máscaras de CPF, CEP, telefone e cartão; validação de CPF e Luhn.
- **Filtros:** categoria, tamanho, cor, preço e disponibilidade ficam na URL, então qualquer busca é um link compartilhável.
- **Acessibilidade:** rótulos associados, `aria-live`, foco visível, navegação por teclado e `prefers-reduced-motion`.
- **Trocar imagens:** substitua os arquivos em `public/products/` e ajuste `src/data/products.ts`.
