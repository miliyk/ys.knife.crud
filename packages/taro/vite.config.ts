import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

/**
 * 注意：本包运行时**发布的是 .vue 源码**（package.json 的 exports/main 指向 src/index.ts），
 * 由宿主 Taro 应用用 webpack + vue-loader 编译——这样库模板里的 scroll-view / input 等
 * 原生组件才会随宿主编译一同生成 WXML。若改成消费 vite 预编译的 dist/index.js，
 * 宿主的 Taro 模板编译器扫不到库内原生组件，scroll-view 会渲染成惰性节点、滚动失效。
 *
 * 因此这里的 vite build 仅用于产出 dist/*.d.ts 类型声明（types 入口），产物 JS 不再作为运行时入口。
 *
 * 下方 MINI_TAGS 把小程序内置标签按「原生元素」编译为字符串标签 vnode：仅为类型/构建期
 * 兼容保留，不影响源码消费路径。
 */
const MINI_TAGS = new Set([
  "view",
  "text",
  "scroll-view",
  "image",
  "block",
  "button",
  "input",
  "label",
  "checkbox",
  "checkbox-group",
  "picker",
  "navigator",
  "cover-view",
  "cover-image",
  "rich-text",
  "progress",
  "icon",
  "form",
  "textarea",
  "map",
  "canvas",
  "video",
  "camera",
  "swiper",
  "swiper-item",
  "slot",
]);

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("-") || MINI_TAGS.has(tag),
        },
      },
    }),
    // 把 SFC 编译产出的 style.css 以 import 形式注入产物入口，
    // 消费方（Taro 应用）import 组件即自动带样式
    libInjectCss(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      // vue、@tarojs/taro 及工作区依赖由消费方（Taro 应用）安装，避免被打包进库
      external: ["vue", "@tarojs/taro", "@ys-knife-crud/core"],
    },
    sourcemap: true,
  },
});
