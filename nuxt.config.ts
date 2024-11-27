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
        '**/*.{js,css,html,png,svg,ico,json,webmanifest,mp3,otf}', // Cache specified file types
      ],
      inlineWorkboxRuntime: false,
      disableDevLogs: false,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/, // Cache images
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
          urlPattern: /\.(?:mp3|otf)$/, // Cache MP3 and OTF files
          handler: 'CacheFirst',
          options: {
            cacheName: 'media-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /^https?.*/, // Cache API and external requests
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10, // Fallback to cache if network is slow
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /.*\..*/, // Cache everything else
          handler: 'StaleWhileRevalidate',
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
