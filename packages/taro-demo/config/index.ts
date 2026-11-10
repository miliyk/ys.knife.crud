import { defineConfig } from "@tarojs/cli";

export default defineConfig({
  projectName: "taro-demo",
  date: "2026-10-27",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  compiler: {
    type: "webpack5",
    prebundle: {
      // 依赖预打包（esbuild）会把库编译成 opaque JS，Taro 模板编译器扫不到库模板里的
      // scroll-view / input 等原生组件，导致这些组件不生成 WXML、滚动失效。
      // 排除本库及其工作区依赖，交给 webpack + vue-loader 逐文件编译库的 .vue 源码。
      exclude: ["@ys-knife-crud/taro", "@ys-knife-crud/core"],
    },
  },
  framework: "vue3",
  // 让 Taro 的 babel / vue-loader 处理 node_modules 内本库的 .vue / .ts 源码
  esnextModules: ["@ys-knife-crud/taro"],
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  mini: {},
  h5: {},
});
