# portfolio

Portfólio de Luiz Henrique, feito com React, Vite e GSAP.

```bash
npm install
npm run dev
npm run build
npm run preview
```

- Animações: `src/lib/gsap.js` e `src/hooks/usePageMotion.js`. Elas são ligadas por atributos `data-*` nos componentes.
- Tema claro e escuro: as cores ficam no início de `src/index.css`, a transição em `src/lib/theme.js` e a Lua e o Sol em `src/components/Sky.jsx`. Ao criar uma cor nova, adicione também à lista `TOKENS`.
- Mascote: animações em `src/components/mascot/Castor.jsx`, com `npm run dev` dá para ver todas em `/mascote`. As peças saem de `source-assets/mascote/gerar-pecas.py`.
- Textos em PT, EN e ES: `src/i18n/translations.js`.
- Projetos: `src/data/projects.js`.
- Hospedagem: Vercel, com Node 24. Rotas e headers ficam em `vercel.json`.
- Segurança: a CSP fica em `vite.config.js` e em `vercel.json`. Ao mudar uma, mude a outra.
- `source-assets/`: arquivos originais que não são publicados com o site.
