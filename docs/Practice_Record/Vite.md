---
sidebar_position: 10
---

# Vite 学习笔记

## 一、Vite 核心特性与优势
### 1.1 核心特性
- **极速启动与 HMR**  
  - 利用原生 ES 模块（ESM）实现按需编译，无需打包，开发服务器启动速度比传统工具快 **10-100 倍**。
  - 热模块替换（HMR）基于 ESM 原生 API，响应速度达 **毫秒级**，修改代码后页面无需全局刷新。

- **生产构建优化**  
  - 使用 Rollup 进行预配置打包，支持代码分割（Code Splitting）、Tree Shaking、CSS 提取与压缩，生成高效静态资源。
  - 预构建依赖：通过 esbuild 将 CommonJS/UMD 模块转换为 ESM，减少网络请求次数。

- **框架支持与扩展性**  
  - 开箱即用支持 Vue、React、Svelte 等主流框架，通过插件系统兼容 Webpack 生态。
  - 内置 TypeScript、JSX、CSS 预处理器（SASS/LESS/Stylus）支持，无需额外配置。

- **依赖预构建**  
  - 使用 esbuild 预编译依赖，解决 ESM 与 CommonJS 兼容性问题，提升加载速度。

### 1.2 对比 Webpack 的优势
| **维度**       | **Vite**                                  | **Webpack**                              |
|----------------|------------------------------------------|------------------------------------------|
| **启动速度**   | 冷启动快 10-100 倍（按需编译）           | 需预打包所有模块，复杂度线性增长          |
| **HMR 速度**   | 毫秒级响应（ESM 原生 API）               | 依赖链重建，时间与模块数量正相关          |
| **配置复杂度** | 20 行配置覆盖主流需求                    | 典型配置超百行，需手动配置 loader/plugin  |
| **生态兼容性** | 兼容 Webpack 插件（通过 Rollup 适配）    | 插件生态超 2000 个，定制化能力强         |
| **适用场景**   | 敏捷开发、现代技术栈、微前端子应用        | 遗留系统维护、超大规模单体应用            |

## 二、安装与基础配置
### 2.1 快速上手
```bash
# 创建项目
npm create vite@latest my-project -- --template vanilla
cd my-project
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

### 2.2 基础配置（`vite.config.js`）
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,      // 开发服务器端口
    open: true,       // 自动打开浏览器
    proxy: {         // API 代理配置
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',   // 构建输出目录
    sourcemap: false, // 禁用 sourcemap
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'; // 第三方依赖分包
          }
        }
      }
    }
  },
  plugins: [
    // 插件列表（如 @vitejs/plugin-vue）
  ]
});
```

### 2.3 环境变量与模式
- **加载环境变量**：  
  ```javascript
  import { defineConfig, loadEnv } from 'vite';

  export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        __APP_ENV__: JSON.stringify(env.APP_ENV)
      }
    };
  });
  ```

- **模式区分配置**：  
  ```javascript
  export default defineConfig(({ command, mode }) => {
    if (command === 'serve') {
      return { // 开发环境配置 }
    } else {
      return { // 生产环境配置 }
    }
  });
  ```

## 三、插件生态与推荐
### 3.1 开发效率提升
- **`vite-plugin-restart`**  
  监听配置文件变化自动重启服务器：  
  ```javascript
  import restart from 'vite-plugin-restart';
  export default defineConfig({
    plugins: [restart({ restart: ['vite.config.js'] })]
  });
  ```

- **`unplugin-auto-import`**  
  自动导入 Vue/React API：  
  ```javascript
  import AutoImport from 'unplugin-auto-import/vite';
  export default defineConfig({
    plugins: [AutoImport({ imports: ['vue', 'react'] })]
  });
  ```

- **`vite-plugin-svg-icons`**  
  集成 SVG 图标：  
  ```javascript
  import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
  export default defineConfig({
    plugins: [
      createSvgIconsPlugin({ iconDirs: [path.resolve(__dirname, 'src/icons')] })
    ]
  });
  ```

### 3.2 生产构建优化
- **`vite-plugin-compression`**  
  启用 Gzip/Brotli 压缩：  
  ```javascript
  import viteCompression from 'vite-plugin-compression';
  export default defineConfig({ plugins: [viteCompression()] });
  ```

- **`rollup-plugin-remove-others-console`**  
  生产环境移除非团队成员的 console 语句：  
  ```javascript
  import removeConsole from 'rollup-plugin-remove-others-console';
  export default defineConfig({ plugins: [removeConsole()] });
  ```

### 3.3 框架集成
- **Vue 项目**：  
  ```javascript
  import vue from '@vitejs/plugin-vue';
  export default defineConfig({ plugins: [vue()] });
  ```

- **React 项目**：  
  ```javascript
  import react from '@vitejs/plugin-react';
  export default defineConfig({ plugins: [react()] });
  ```

## 四、最佳实践与常见问题
### 4.1 代码分割与性能优化
- **手动分包**：  
  ```javascript
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('lodash')) return 'lodash';
        }
      }
    }
  }
  ```

- **CSS 处理**：  
  ```css
  /* 支持 CSS Modules */
  import styles from './style.module.css';
  /* 内联 PostCSS */
  @import 'tailwindcss/base';
  ```

### 4.2 SSR 支持
```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  ssr: {
    noExternal: ['vue'] // 指定不打包的模块
  }
});
```

### 4.3 迁移 Webpack 项目
- **插件替换**：  
  - Webpack 的 `html-webpack-plugin` → Vite 的 `vite-plugin-html`。
  - Webpack 的 `mini-css-extract-plugin` → Vite 内置 CSS 处理。

- **环境变量差异**：  
  Vite 默认不加载 `.env` 文件，需通过 `loadEnv` 显式加载。

## 五、总结与选型建议
### 5.1 适用场景
- **优先 Vite**：  
  - 现代技术栈（Vue3/React18+）  
  - 微前端子应用或中大型项目  
  - 追求极速开发反馈与简洁配置  

- **保留 Webpack**：  
  - 遗留系统维护  
  - 超大规模单体应用（需 SplitChunksPlugin 优化分包）  
  - 深度定制需求（如自定义 loader/plugin）  

### 5.2 未来趋势
Vite 已成为前端构建工具的事实标准，其基于 ESM 的架构设计代表了未来方向。对于新项目，建议优先采用 Vite；对于老项目，可结合 Webpack 的深度能力进行渐进式迁移。