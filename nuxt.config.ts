// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      ],
      script: [
        {
          // Restaura o modo dark/light do usuário antes do primeiro render — elimina flash.
          // O padrão da empresa é aplicado depois, ao carregar a personalização.
          innerHTML: `(function(){try{var t=localStorage.getItem('sistema_tema_user');if(t!=='dark'&&t!=='light')return;var r=document.documentElement;r.setAttribute('data-theme',t);r.setAttribute('data-theme-dark',t==='dark'?'true':'false');}catch(e){}})();`,
          type: 'text/javascript',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@400;600;700;800&display=swap',
        },
      ],
    },
  },
  components: {
    dirs: [
      '~/components',
      '~/components/kanban',
    ],
  },
  runtimeConfig: {
    // Server-only (Datafy + Pusher server + Supabase service role)
    supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    datafyApiUrl: process.env.DATAFY_API_URL,
    datafyNumberToken: process.env.DATAFY_NUMBER_TOKEN,
    datafyPhoneNumberId: process.env.DATAFY_PHONE_NUMBER_ID,
    pusherAppId: process.env.PUSHER_APP_ID,
    pusherSecret: process.env.PUSHER_SECRET,
    metaWebhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN,
    metaAppId: process.env.META_APP_ID,
    metaAppSecret: process.env.META_APP_SECRET,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      pusherKey: 'ecd7977ee656805110ef',
      pusherCluster: 'sa1',
    },
  },
})