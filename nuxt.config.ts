// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.scss', // Adjust the path as necessary
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt', 'vuetify-nuxt-module', '@pinia/nuxt'],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      }
      /* vuetify options */
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ["**/*.*"],
      inlineWorkboxRuntime: false,
      disableDevLogs: false,
      runtimeCaching: [{
          urlPattern: /.*\..*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'assets-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
      ],
    },
    manifest: {
      id: 'mobile.bunkerclock.org',
      start_url: '/',
      name: 'Your App Name',
      short_name: 'App',
      description: 'Your app description',
      theme_color: '#ffffff',
      background_color: '#000000',
      display: 'standalone',
      icons: [{
        src: 'icons/bunkerclock.png', // Name of the generated icon file
        sizes: '1024x1024', // Sizes to generate
        purpose: ['maskable'] // Maskable icons for better display on Android
      }],
      screenshots: [{
        sizes: '1024x1024', // Sizes to generate
        form_factor: 'narrow',
        src: 'icons/bunkerclock.png', // Name of the generated icon file
      }]
    },
  },
})