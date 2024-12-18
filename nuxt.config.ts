export default defineNuxtConfig({
  css: [
    '@/assets/css/main.scss',
  ],
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
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
        '**/*.{js,css,html,png,svg,ico,json,webmanifest,mp3,ttf,otf}', // Including all necessary files
        '/index.html', // Ensure the root HTML file is explicitly precached
        '/', // Explicitly add the root URL to the cache
      ],
      inlineWorkboxRuntime: false,
      disableDevLogs: false,
      runtimeCaching: [{
        urlPattern: '/',
          handler: 'NetworkFirst', // Fallback for the root URL
          options: {
            cacheName: 'root-cache',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
          },
        },
        {
          urlPattern: /.*\.html$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'html-cache',
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /.*\..*/, // Cache all other resources
          handler: 'CacheFirst',
          options: {
            cacheName: 'general-cache',
          },
        },
      ],
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
      installPrompt: false,
    },
    devOptions: {
      enabled: false,
      type: 'module',
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
