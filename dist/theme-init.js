// Roda antes de pintar a página para quem escolheu o tema claro não ver um flash escuro.
// Fica em arquivo próprio porque a CSP do site não permite script inline.
try {
  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.documentElement.dataset.theme = 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f4f6f3')
  }
} catch {
  // Sem storage o site abre no tema padrão, o escuro
}
