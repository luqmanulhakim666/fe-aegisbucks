require("dotenv").config();

module.exports = {
  ssr: true,
  target: "server",
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    recaptcha: {
      siteKey: process.env.RECAPTCHA_KEY,
      version: 3,
      size: "compact",
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "Aegisbucks - %s",
    title: "Aegisbucks",
    htmlAttrs: {
      lang: "en",
    },
    script: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4589795486176408",
        async: true,
        crossorigin: "anonymous",
      },
    ],
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/fonts.scss", "@/assets/scss/app.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/api",
    "@/plugins/axios",
    "@/plugins/mixins",
    { src: "@/plugins/tesseract", ssr: false },
    {
      src: "@plugins/nuxt-quill-plugin",
      ssr: false,
    },
    {
      src: "@/plugins/vue-carousel",
      ssr: false,
      mode: "client",
    },
    {
      src: "@/plugins/apex-chart",
      ssr: false,
      mode: "client",
    },
    {
      src: "@plugins/vue-timepicker",
      ssr: false,
    },
    {
      src: "@/plugins/vue-infinite-scroll",
      mode: "client",
    },
    "@/plugins/init.client",
    // always last
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/vuetify"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dayjs",
    "nuxt-user-agent",
    ["@nuxtjs/dotenv", { systemvars: true }],
    "@nuxtjs/recaptcha",
  ],

  vuetify: {
    customVariables: ["@/assets/scss/variables.scss"],
    treeShake: true,
    theme: {
      light: true,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: {
            base: "#DC1F30",
            lighten4: "#9A1919",
            lighten3: "#FFC3C3",
            lighten2: "#FF6060",
            lighten1: "#EF3030",
          },
          secondary: {
            base: "#2962ff",
            lighten5: "#F3F8FF",
            lighten4: "#CFE5F9",
            lighten3: "#A1CAF4",
            lighten2: "#6DA0DE",
            lighten1: "#007bff",
          },
          success: {
            base: "#338A17",
            lighten5: "#21E766",
            lighten4: "#D1F7C4",
            lighten3: "#93E088",
            lighten2: "#20C933",
            lighten1: "#C0ED54",
          },
          error: {
            base: "#DC1F30",
            lighten4: "#9A1919",
            lighten3: "#FFC3C3",
            lighten2: "#FF6060",
            lighten1: "#EF3030",
          },
          info: {
            base: "#2750AE",
            lighten4: "#CFDFFF",
            lighten3: "#9CC7FF",
            lighten2: "#2D7FF9",
            lighten1: "#1283DA",
          },
          warning: {
            base: "#BB4217",
            lighten4: "#FFF3EF",
            lighten3: "#FFE3DA",
            lighten2: "#FFB094",
            lighten1: "#FA622D",
          },
          dark: {
            base: "#585858",
            lighten5: "#757575",
            lighten4: "#FAFAFA",
            lighten3: "#EAEAEA",
            lighten2: "#C1C1C1",
            lighten1: "#464646",
            darken1: "#646D76", // Slightly darker shade
            darken2: "#E3E6E8", // Dark gray-blue
            darken3: "#939EA7", // Very dark gray-blue
            darken4: "#7A8A94",
          },
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["ufo"],
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
