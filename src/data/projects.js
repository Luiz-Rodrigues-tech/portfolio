// Textos em i18n/translations.js, pelo id. Os sem `featured` só aparecem em "Ver mais projetos".
const projects = [
  {
    id: 'inzupt',
    featured: true,
    image: '/img/optimized/inzupt.webp',
    width: 1200,
    height: 5609,
    tags: ['Vue.js', 'Tailwind CSS', 'GSAP'],
    live: 'https://inzupt.com.br',
  },
  {
    id: 'alm',
    featured: true,
    image: '/img/optimized/alm-tech.webp',
    width: 1200,
    height: 750,
    tags: ['Vue.js', 'Tailwind CSS'],
    live: 'https://almtechno.com.br',
  },
  {
    id: 'leonel',
    featured: true,
    image: '/img/optimized/leonel-gessos.webp',
    width: 1200,
    height: 2820,
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS'],
    live: 'https://leonelgesso.com.br',
  },
  {
    id: 'equali',
    featured: true,
    image: '/img/optimized/equali-consultoria.webp',
    width: 1200,
    height: 1150,
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://red-chough-671278.hostingersite.com',
  },
  {
    id: 'izadora',
    featured: true,
    image: '/img/optimized/izadora.webp',
    width: 1200,
    height: 3163,
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://izadoraportfolio.com',
  },
  {
    id: 'rejuvenesce',
    image: '/img/optimized/rejuvenesce.webp',
    width: 1200,
    height: 4471,
    tags: ['Laravel', 'Vue.js', 'Tailwind CSS'],
  },
  {
    id: 'english',
    image: '/img/optimized/english-fast.webp',
    width: 1200,
    height: 1083,
    tags: ['React', 'JavaScript', 'CSS'],
    live: 'https://lightcoral-caterpillar-755231.hostingersite.com',
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
export const moreProjects = projects.filter((project) => !project.featured)

export default projects
