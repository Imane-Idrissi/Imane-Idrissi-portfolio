export default {
  title: 'CollabSpace Documentation',
  description: 'Technical documentation for the CollabSpace task board system',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Task Board', link: '/task-board-documentation' }
    ],

    sidebar: [
      {
        text: 'Task Board System',
        items: [
          { text: 'Introduction', link: '/task-board-documentation#introduction' },
          { text: 'Functional Requirements', link: '/task-board-documentation#functional-requirements-what-users-can-do' },
          { text: 'Hidden UI Features', link: '/task-board-documentation#hidden-ui-features-the-task-boards-secret-sauce' },
          { text: 'CAP Theorem Trade-offs', link: '/task-board-documentation#cap-theorem-trade-offs-theory-meets-reality' },
          { text: 'Implementation Strategies', link: '/task-board-documentation#implementation-strategies-from-theory-to-code' },
          { text: 'Caching Layer', link: '/task-board-documentation#deep-dive-caching-layer' },
          { text: 'Concurrency Control', link: '/task-board-documentation#concurrency-control-when-to-lock-vs-when-to-flow' },
          { text: 'Performance & Monitoring', link: '/task-board-documentation#performance-targets-monitoring' },
          { text: 'Lessons Learned', link: '/task-board-documentation#real-world-impact-lessons-learned' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/collabspace' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2024 Imane Idrissi'
    }
  },

  // Enable copy images from docs to dist
  assetsDir: 'assets',
  
  // Custom head for better SEO
  head: [
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:title', content: 'CollabSpace Documentation' }],
    ['meta', { name: 'og:site_name', content: 'CollabSpace Docs' }],
  ]
}