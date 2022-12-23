---
sidebar_position: 3
---

# Webpack 基础知识

## 安装 webpack

安装本地的 webpack

```bash
webpack webpack -D

yarn init -y

yarn add webpack webpack-cli -D
```

## Webpack 可以进行 0 配置

- 打包工具 -> 输出后的结果(js 模块)
- 打包(支持 js 模块)
  - module.exports 导出
  - require 导入
- 新建 src/index.js
  - npx webpack -> 会打包出 dist/main.js

## 手动配置 Webpack

- 默认配置文件的名字 webpack.config.js

- 打包的文件解析流程: 将所有解析的模块变成一个对象, 通过一个唯一入口, 加载模块, 依次实现递归依赖关系, 通过入口来运行所有的文件

1.  修改配置文件的名字

    - 修改文件名 `webpack.config.my.js`
      - ①: `npx webpack --config webpack.config.my.js`
      - ②: 在 package.json 文件中修改文件名 `scripts.build: "webpack --config webpack.config.my.js"`
        - 通过 npm run build 执行
        - npm run build -- --config webpack.config.my.js 添加--可以传参

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.my.js"
  }
}
```

2.  使用 html 插件(使用开发服务器插件)

    - 安装: yarn add webpack-dev-server -D
      - ①：npx webpack-dev-server
        ②：在 package.json 中添加 `script.dev: "webpack-dev-server"`
        - webpack.config.js 中添加 devServer: { port: 3000, progress: true }
        - npm run dev 执行
    - 配置 devServer 参数

```js
module.exports = {
  // 开发服务器的配置
  devServer: {
    port: 3000, // 端口号, 默认8080
    // progress: true, // 进度条
    // contentBase: "./build", // 代理静态资源路径
    client: {
      progress: true, // 进度条
    },
    static: {
      publicPath: "./build", // 代理静态资源路径
    },
    compress: true, // 开启gzip压缩
  },
};
```

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server"
  }
}
```

## 动态生成 html 入口文件

1. 安装: yarn add html-webpack-plugin
   - 引入:
   - plugins: 使用

```js
// 1. 引入
let HtmlWebpackPlugin = require("html-webpack-plugin");

// 2. 使用
module.exports = {
  // 数组 放着所有的webpack插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.hmtl", // 模板
      filename: "index.html", // 文件名
    }),
  ],
};
```

2. 新建 src/index.html 模板

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack</title>
  </head>
  <body>
    <!-- 模板 -->
  </body>
</html>
```

3. 修改 webpack.config.js

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // 开发服务器的配置
  devServer: {
    port: 3000, // 端口号, 默认8080
    // progress: true, // 进度条
    // contentBase: "./build", // 代理静态资源路径
    client: {
      progress: true, // 进度条
    },
    static: {
      publicPath: "./build", // 代理静态资源路径
    },
    compress: true, // 开启gzip压缩(production)
  },
  mode: "production", // 模式 默认两种 production development
  entry: "./src/index.js", // 入口
  output: {
    filename: "bundle.js", // 打包后的文件名
    path: path.resolve(__dirname, "build"), // 路径必须是一个绝对路径
  },
  // 数组 放着所有的webpack插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 模板
      filename: "index.html", // 文件名
      minify: {
        removeAttributeQuotes: true, // 删除index.html中的双引号
        collapseWhitespace: true, // 压缩成一行
      },
    }),
  ],
};
```

4. 执行`npm run build`, 会生成对应的压缩的`build/bundle.js`和`build/index.html`

## 加载 CSS 样式

**css**

1. 新建 src/index.css

```css
body {
  width: 100vw;
  height: 100vh;
  background: red;
}
```

2. 引入 index.js

```js
require("./index.css");
```

3. 修改 webpack.config.js

```js
module.exports = {
  // 模块
  module: {
    // 规则
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              //   insertAt: 'top', // webpack4
              insert: "top", // webpack5
            },
          },
          "css-loader",
        ],
      },
    ],
  },
};
```

- `css-loader` 是处理@import 这种语法的
- `style-loader` 是把 css 插入到 head 标签中

**less**

1. 安装 less 及 less-loader

```
yarn add less less-loader -D
```

2. 写入 less 编译规则

```js
module.exports = {
  // 模块
  module: {
    // 规则
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
            //   insertAt: 'top', // webpack4
              insert: function insertAtTop(element) { // webpack5
                var parent = document.querySelector("head");
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },,
            }
          },
          "css-loader",
        ],
      },
      {
        // 可以出来less文件 sass stylus node-sass sass-loader stylus stylus-loader
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
            options: {
              //   insert: () => "top", // webpack4
              insert: function insertAtTop(element) { // webpack5
                var parent = document.querySelector("head");
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
};
```

3. 新建 src/index.less, 写 less 样式

```less
body {
  div {
    width: 100px;
    height: 100px;
    background: #000;
    color: #fff;
    border: 1px solid #f600ff;
  }
}
```

4. src/index.js 引入 less

```js
require("./index.less");
```

5. 重新 `npm run dev`

**将 css 打包成统一的文件**

1. 安装插件 `mini-css-extract-plugin`

```
yarn add mini-css-extract-plugin -D
```

2. webpack.config.js 引入插件

```js
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

3. 添加到插件里

```js
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
  ],
};
```

4. 使用

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

**注意:** 使用`mini-css-extract-plugin` webpack5 默认将 style 样式插入到下面了, index 页面写的重复样式会不生效

**样式添加游览器内核**

1. 添加 index.less 测试样式

```css
body {
  div {
    width: 100px;
    height: 100px;
    background: #000;
    color: #fff;
    border: 1px solid #f600ff;
    transform: rotate(45deg);
  }
}
```

2. 安装 postcss-loader autoprefixer

```
yarn add postcss-loader autoprefixer -D
```

3. 新建 postcss.config.js

```js
module.exports = {
  plugins: [require("autoprefixer")],
};
```

4. 使用 "postcss-loader"

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
};
```

**压缩 css 样式**

1. 安装 optimize-css-assets-webpack-plugin

```
yarn add optimize-css-assets-webpack-plugin -D
```

2. webpack.config.js 引入及使用

```js
// 1. 引入
let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// 2. 使用
module.exports = {
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin()],
  },
};
```

3. 打包 `npm run build`, css 已经压缩, 但 js 却出了问题

**压缩 js**

1. 安装 terser-webpack-plugin 或 uglifyjs-webpack-plugin

```
yarn add terser-webpack-plugin -D
```

2. webpack.config.js 引入及使用

```js
// 1. 引入
let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
let TerserJSPlugin = require("terser-webpack-plugin");
// 2. 使用
module.exports = {
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin(), new TerserJSPlugin()],],
  },
};
```

或

```
yarn add uglifyjs-webpack-plugin -D
```

```js
// 1. 引入
let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
let UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
// 2. 使用
module.exports = {
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin(), new UglifyjsWebpackPlugin({
        cache: true, // 开启缓存
        parallel: true, // 并发打包,一次打多包
        sourceMap: true, // es6转es5源码调试映射
    })],],
  },
};
```

## 转化 ES6 语法

**ES6 转 ES5**

1. 安装 babel 插件

```
yarn add babel-loader @babel/core @babel/preset-env -D
```

2. webpack.config.js 使用

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // babel-loader 将ES6转ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

3. 如果不支持 class 语法(webpack5 已经内置)

```
yarn add @babel/plugin-proposal-class-properties -D
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // babel-loader 将ES6转ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],,
            plugins: [
                '@babel/plugin-proposal-class-properties'
            ]
          },
        },
      },
    ],
  },
};
```

**装饰器**

1. index.js 添加装饰器

```js
@log
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const p = new Person("paul", 26);
console.log(p.name + "------------" + p.age);

function log(target) {
  console.log(target, "123");
}
```

2. 安装支持插件

```
yarn add @babel/plugin-proposal-decorators -D
```

3. 使用 html

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // babel-loader 将ES6转ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],,
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      },
    ],
  },
};
```

## 处理 js 语法及校验

**处理打包方法不共用及内置 api 无法转化问题**

1. 安装

```
yarn add @babel/plugin-transform-runtime
```

2. 加入插件中

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // babel-loader 将ES6转ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],,
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-transform-runtime",
            ],
          },
        },
        include: path.resolve(__dirname, "src"), // 解析src下js文件
        exclude: /node_modules/, // 排除node_modules的js文件
      },
    ],
  },
};
```

3. npm run build

**转化 includes 等 api**

1. 安装

```
yarn add @babel/polyfill
```

2. 在需要的文件中添加 index.j

```js
require("@babel/polyfill");
let inA = "test1111".includes("test");
console.log(inA);
```

**代码校验**

1. 安装

```
yarn add eslint eslint-loader -D
```

2. 定制 eslint 规范, 并下载对应.eslintrc.json 文件,加入到项目里

https://eslint.org/play/

3. 添加到 webpack.config.js 解析规则中

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "eslint-loader",
          options: {
            enforce: "pre", // 放到前面
          },
        },
      },
    ],
  },
};
```

## 全局变量引入

**使用 jquery**

1. 安装

```
yarn add jquery -D
```

2. 引入

```
import $ from "jquery";
console.log($);
```

**全局使用 window.$ expose-loader**

1. 安装 expose-loader 插件,暴露全局的 loader

```
yarn add expose-loader -D
```

2. 使用方式一 index.js

```js
import $ from "expose-loader?exposes=$,jQuery!jquery";
```

3. 使用方式二

```js
// index.js
import $ from "jquery";
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
    ],
  },
};
```

- 相当于按需加载, 但一处加载后, window.$ 就可以访问

**全局使用 $ webpack**

1. webpack.config.js 引入使用

```js
let webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
    }),
  ],
};
```

- 全局使用 $ 可以取到 jquery 实例
- 但不能使用 window.$ 获取 jquery 实例

**CDN 方式**

1. 在 template 里 index.html 引入 jquery

```html
<script
  src="https://code.jquery.com/jquery-3.6.0.js"
  integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
  crossorigin="anonymous"
></script>
```

2. 配置打包忽略依赖的 jquery

```js
// webpack.config.js
new webpack.ProvidePlugin({
  $: "jquery",
}),
```

**全局变量引入**

1. expose-loader 暴露到 window 上
2. providePlugin 给每一个模块提供一个 $
3. cdn 等引入, 忽略打包

**loader 类型**

1. pre 前面执行的 loader
2. normal 普通的 loader
3. 内联的 loader
4. postloader 后置

## 打包文件分类

**css 分类**

1. plugins 中设置路径

```js
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/main.css",
    }),
  ],
};
```

**图片分类**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024, // 200kb以下打包成base64, 以上产生原文件
            outputPath: "img/", // 打包分类
            publicPath: "http://www.xiaoxi.work", // 追加前缀
            esModule: false, // 不使用esmodel
          },
        },
      },
    ],
  },
};
```
