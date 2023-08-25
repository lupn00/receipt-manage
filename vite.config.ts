import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
// import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";

export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      visualizer({ open: false }),
      // importToCDN({
      //   prodUrl: "https://unpkg.com/{name}@{version}/{path}",
      //   modules: [
      //     autoComplete("vue"),
      //     autoComplete("axios"),
      //     // 以下报错： 已屏蔽 MIME 类型为 text/html 的跨域响应 https://unpkg.com
      //     // {
      //     //   name: "element-plus",
      //     //   var: "ElementPlus", //根据main.js中定义的来
      //     //   // 根据自己的版本号找到对应的CDN网址
      //     //   path: "https://unpkg.com/element-plus@2.2.4/dist/index.full.js",
      //     //   // 根据自己的版本号找到对应的CDN网址
      //     //   css: "https://unpkg.com/browse/element-plus@2.2.4/dist/index.css",
      //     // }, 
      //   ],
      // }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: "less", // css in js
          }),
        ],
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
    ],
    resolve: {
      alias: {
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "",
    build: {
      cssCodeSplit: true,
      minify: "terser",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        input: "index.html",
        output: {
          // 静态资源打包做处理
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import '@/assets/less/ant-design.less';`,
          },
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(loadEnv(mode, process.cwd()).VITE_FRONT_PORT),
    },
  });
