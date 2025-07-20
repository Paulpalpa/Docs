---
sidebar_position: 7
---

# Vite 打包差异检测

## 一、核心步骤概述
1. **生成不同环境的打包文件**
2. **对比文件结构与内容差异**
3. **使用可视化工具分析打包结果**
4. **验证环境变量与配置差异**
5. **测试关键功能与资源加载**

## 二、详细操作指南

### 1. 生成不同环境的打包文件
#### 生产模式打包
```bash
# 默认使用 .env.production 配置
vite build
```
- 输出目录：`dist`（默认）
- 特性：代码压缩、资源优化、哈希命名、分割 chunks

#### 开发模式模拟打包
```bash
# 强制使用开发环境配置生成构建文件
vite build --mode development
```
- 输出目录：`dist_dev`（需手动指定或重命名）
- 特性：未压缩代码、保留调试信息、开发环境配置

### 2. 对比文件差异
#### 使用 `diff` 命令对比目录
```bash
# 比较生产与开发构建结果
diff -r dist dist_dev
```
- **关键差异点**：
  - 资源路径（如 `base` 配置）
  - 压缩后的代码体积
  - 环境变量替换（如 `VITE_API_URL`）
  - 依赖模块分割方式

### 3. 可视化打包分析
#### 安装分析工具
```bash
npm install rollup-plugin-visualizer --save-dev
```

#### 配置 Vite
```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'stats.html', // 生成分析文件
      open: true,            // 自动打开浏览器
      gzipSize: true,        // 显示 gzip 压缩后大小
      brotliSize: true       // 显示 brotli 压缩后大小
    })
  ]
});
```

#### 生成分析报告
```bash
# 生产模式分析
vite build

# 开发模式分析
vite build --mode development
```
- **分析重点**：
  - 模块依赖树结构
  - 重复依赖引入
  - 未压缩/压缩后的体积对比
  - 第三方库影响（如 `lodash`、`moment`）

### 4. 环境变量与配置验证
#### 环境文件配置示例
```plaintext
# .env.development
VITE_API_URL=/dev-api
VITE_ENV=development

# .env.production
VITE_API_URL=https://api.prod.com
VITE_ENV=production
```

#### 验证环境变量加载
```javascript
// 在代码中检查环境变量
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENV);
```

### 5. 功能与资源加载测试
#### 模拟线上环境运行
```bash
npx serve dist -p 3000
```
- **测试项**：
  - 路由跳转（确保 404 页面配置正确）
  - 图片/字体资源加载（相对路径验证）
  - API 请求地址（生产环境是否指向正确域名）
  - 控制台错误（生产模式是否隐藏源码）

### 6. 高级场景处理
#### 多环境配置示例
```plaintext
# .env.test
VITE_API_URL=https://api.test.com
VITE_ENV=test
```

#### 自定义构建命令
```json
// package.json
{
  "scripts": {
    "build:test": "vite build --mode test",
    "build:prod": "vite build --mode production"
  }
}
```

## 三、预期结果与差异点总结
| **差异维度**       | **开发模式**                  | **生产模式**                  |
|--------------------|-------------------------------|-------------------------------|
| **代码压缩**       | 未压缩，保留注释与空格        | 压缩（Terser/esbuild）        |
| **资源路径**       | 绝对路径（开发服务器修正）    | 相对路径或 `base` 配置路径    |
| **环境变量**       | 加载 `.env.development`       | 加载 `.env.production`        |
| **错误提示**       | 详细源码与堆栈信息            | 压缩后的错误信息              |
| **模块分割**       | 按需加载，未优化              | 自动代码分割，公共依赖提取    |
| **资源处理**       | 未压缩图片/字体               | 压缩图片，字体子集化          |

## 四、常见问题解决
1. **生产环境资源 404**  
   - 检查 `base` 配置是否与部署路径一致（如子目录部署需设置 `base: '/subdir/'`）

2. **环境变量未加载**  
   - 确保变量名以 `VITE_` 开头，且在对应 `.env` 文件中定义

3. **构建体积过大**  
   - 使用分析工具定位大文件，按需引入依赖（如 `lodash-es` 替代 `lodash`）

通过以上步骤，可系统化检测并解决 Vite 在不同环境下的打包差异问题，确保线上部署的稳定性和性能优化。