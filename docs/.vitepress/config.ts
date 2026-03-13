import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: '每日简报',
  description: '每日摘要 + 今日历史/节气',
  // 部署在自定义域名 mlqk.me 上，base 设为 '/'
  // 如需部署在 GitHub Pages 子路径，改为 '/ai-daily-site/'
  base: '/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/daily/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mlqk-claw/ai-daily-site' }
    ]
  }
})
