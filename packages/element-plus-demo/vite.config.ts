import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 开发期将工作区依赖也指向源码，避免解析尚未构建的 dist 入口
      "@ys-knife-crud/core": fileURLToPath(
        new URL("../core/src/index.ts", import.meta.url)
      ),
      "@ys-knife-crud/vue": fileURLToPath(
        new URL("../vue/src/index.ts", import.meta.url)
      ),
      "@ys-knife-crud/export-exceljs": fileURLToPath(
        new URL("../export-exceljs/src/index.ts", import.meta.url)
      ),
      "@ys-knife-crud/import-exceljs": fileURLToPath(
        new URL("../import-exceljs/src/index.ts", import.meta.url)
      ),
      // 开发期直接指向组件库源码，免去先 build 组件库（tsup 对 .vue 支持有限）
      "@ys-knife-crud/element-plus": fileURLToPath(
        new URL("../element-plus/src/index.ts", import.meta.url)
      ),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
