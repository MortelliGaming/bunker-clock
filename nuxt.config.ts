export default defineNuxtConfig({
  css: [
    '@/assets/css/main.scss',
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt', 'vuetify-nuxt-module', '@pinia/nuxt'],
  
  // Vuetify Configuration
  vuetify: {
    moduleOptions: {
      /* Vuetify-specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
    },
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: [
        '**/*.*', // Cache specified file types
      ],
      inlineWorkboxRuntime: false,
      disableDevLogs: false,
    },
    manifest: {
      id: 'mobile.bunkerclock.org',
      start_url: '/',
      name: 'BunkerClock',
      short_name: 'Clock',
      description: 'The ultimate poker clock for your games.',
      theme_color: '#ffffff',
      background_color: '#000000',
      display: 'standalone',
      icons: [
        {
          src: '/icons/bunkerclock.png',
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      screenshots: [
        {
          src: '/icons/bunkerclock.png',
          sizes: '1024x1024',
          type: 'image/png',
          form_factor: 'narrow',
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module', // Ensures proper service worker loading in development
    },
  },
  
  // Additional Nuxt Configurations
  vite: {
    server: {
      fs: {
        strict: false, // To handle file system-related issues
      },
    },
  },

  // Static Assets Optimization
  app: {
    baseURL: '/', // Set base URL for your app
  },

  // Build Configuration
  build: {
    analyze: false, // Set to true for debugging bundle size
  },
});
