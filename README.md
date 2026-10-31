# portfolio

Portfólio de Luiz Henrique, feito com React, Vite e GSAP.

```bash
npm install
npm run dev
npm run build
npm run preview
```

- Animações: `src/lib/gsap.js` e `src/hooks/usePageMotion.js`. Elas são ligadas por atributos `data-*` nos componentes.
- Textos em PT, EN e ES: `src/i18n/translations.js`.
- Projetos: `src/data/projects.js`.
- Hospedagem: Vercel, com Node 24. Rotas e headers ficam em `vercel.json`.
- Segurança: a CSP fica em `vite.config.js` e em `vercel.json`. Ao mudar uma, mude a outra.
- `source-assets/`: arquivos originais que não são publicados com o site.
