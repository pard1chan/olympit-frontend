import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// Auto imports
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import webfontDownload from 'vite-plugin-webfont-dl';
import Icons from 'unplugin-icons/vite'

const VITE_IMAGE_OPTIMAZER_OPTIONS = {
  logStats: true,
  ansiColors: true,
  test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
  exclude: undefined,
  include: undefined,
  includePublic: true,
  svg: {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupNumericValues: false,
            cleanupIds: {
              minify: false,
              remove: false,
            },
            convertPathData: false,
          },
        },
      },
      "sortAttrs",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
        },
      },
    ],
  },
  png: {
    // https://sharp.pixelplumbing.com/api-output#png
    quality: 100,
  },
  jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 50,
  },
  jpg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 50,
  },
  tiff: {
    // https://sharp.pixelplumbing.com/api-output#tiff
    quality: 100,
  },
  // gif does not support lossless compression
  // https://sharp.pixelplumbing.com/api-output#gif
  gif: {},
  webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
    lossless: true,
  },
  avif: {
    quality: 40,
    // https://sharp.pixelplumbing.com/api-output#avif
    lossless: false,
  },
  cache: false,
  cacheLocation: undefined,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    
    Icons({ compiler: 'vue3' }),
    // Автоимпорт Composition API и других
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          axios: [["default", "axios"]],
        },
      ],
    }),
    // Автоимпорт компонентов
    Components({
      dts: false,
      dirs: [
        "src/features", // Добавляем вашу папку
      ],
      deep: true,
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    }),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'
    ])
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
      "@/features": resolve(__dirname, "src/features"),
      "@/entities": resolve(__dirname, "src/entities"),
      "@/shared": resolve(__dirname, "src/shared"),
      "@/widgets": resolve(__dirname, "src/widgets"),
      "@/pages": resolve(__dirname, "src/pages"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/app/styles/helpers" as *;
        `,
      },
    },
  },


  server: {
    port: 5173,
    open: true,
  },
});
