---
sidebar_position: 4
---


# Webpack 基础配置

## 打包多页应用

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
  },
  output: {
    filename: "[name].js", // [name] home,about
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 模板
      filename: "home.html", // 文件名
      chunks: ["home"], // home.html里只加载home.js
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 模板
      filename: "about.html", // 文件名
      chunks: ["about"], // about.html里只加载about.js
    }),
  ],
};
```

## 配置 source-map

- 当错误语法, 通过打包 ES6 转 ES5 后(如生产环境), 报错需要溯源,

1. 方式一: source-map

源码映射, 会单独生成一个 sourcemap 文件, 出错了会标记 当前报错的列和行,大而全, 方便帮我们调试源代码,

```js
module.exports = {
  devtool: "source-map",
};
```

2. 方式二: eval-source-map

不会产生单独的文件, 但是可以显示行和列

```js
module.exports = {
  devtool: "eval-source-map",
};
```

3. 方式三: cheap-module-source-map

不会产生列, 但是是一个单独的映射文件, 产生后可以保留起来

```js
module.exports = {
  devtool: "cheap-module-source-map",
};
```

4. 方式四: eval-cheap-module-source-map

不会产生文件, 集成在打包后的文件中,不会产生列

```js
module.exports = {
  devtool: "eval-cheap-module-source-map",
};
```

## watch 监听文件

1. 配置 watch

```js
module.exports = {
  watch: true, // 开启热更新
  watchOptions: {
    // 监控的选项
    poll: 1000, // 每秒
    aggregateTimeout: 500, // 防抖 持续输入不更新
    ignored: /node_modules/, // 不需要监控的文件
  },
};
```

## webpack 小插件应用

**清除文件**

为了在每次打包发布时自动清理掉 dist 目录中的旧文件

1. 安装 CleanWebpackPlugin

```
yarn add clean-webpack-plugin -D
```

2. webpack5 引入及使用

```js
let { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

**复制文件**

1. 安装 CopyWebpackPlugin

```js
yarn add copy-webpack-plugin -D
```

2. 引入及使用

```js
let path = require("path");
let CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // "README.md" // 将README.md拷贝到dist下
        // { from:"README.md", to: './' }, // 将README.md拷贝到dist下
        // path.resolve(__dirname, "src", "file.ext"), // 将src/file.ext拷贝到dist下
        { from: "source", to: "dest" }, // 将source目录下文件拷贝到dist/dest目录下
      ],
    }),
  ],
};
```

**插入版本信息**

1. bannerPlugin 是 webpack 内置插件

```js
let webpack = require("webpack");
```

2. 使用

```js
module.exports = {
  plugins: [
    new webpack.BannerPlugin(
      "Copyright 2002-2022 the original author or authors.Licensed under the Apache License, Version 2.0 (the 'License');"
    ),
  ],
};
```

## webpack 跨域问题

1. 编写一个服务器 server.js

```js
let express = require("express");

let app = express();

app.get("/use", (req, res) => {
  res.json({ name: "paul" });
});

app.listen(3000);
```

2. 请求接口 index.js

```js
let xhr = new XMLHttpRequest();

xhr.open("GET", "/user", true);

xhr.onload = function () {
  console.log(xhr.response);
};

xhr.send();
```

3. 此时出现了跨域, 设置跨域

```js
module.exports = {
  devServer: {
    // 重写的方式, 把请求代理到express服务器上
    proxy: {
      // '/api': 'http://localhost:3001', // 配置一个代理
      "/api": {
        target: "http://localhost:3001",
        pathRewrite: { "/api": "" }, // 将/api去掉
      },
    },
  },
};
```

- 此时已经在开发环境已经解决了跨域

4. 如果前端只想单纯来模拟数据

```js
module.exports = {
  devServer: {
    // 提供的钩子函数
    onBeforeSetupMiddleware({ app }) {
      app.get("/user", (req, res) => {
        res.json({ name: "paul -- 模拟数据" });
      });
    },
  },
};
```

5. 使用中间件将打包的页面挂载到服务器上(在服务端启动 webpack)

安装

```
yarn add webpack-dev-middleware -D
```

```js
let express = require("express");

let app = express();
let webpack = require("webpack");

//中间件
let middle = require("webpack-dev-middleware");
let config = require("./webpack.config.js");
console.log(config);
let compiler = webpack(config);

app.use(middle(compiler));

app.get("/user", (req, res) => {
  res.json({ name: "paul" });
});

app.listen(3001, () => {
  console.log("3000已启动");
});
```

- 这样在 3000 端口就可以看到页面了, 也能正常使用接口

## resolve 属性的配置

```js
module.exports = {
  // 解析, 第三方包 common
  resolve: {
    modules: [path.resolve("node_modules")],
    // 别名 vue -> vue.runtime
    alias: {
      bootstrap: "bootstrap/dist/css/bootstrap.css",
    },
    extensions: [".js", ".css", ".json", ".vue"], // 不写后缀, 匹配规则
    mainFields: ["style", "main"], // 先去style,再去main文件
    mainFiles: [], // 入口文件的名字 index.js
  },
};
```

## 定义环境变量

1. webpack 内置插件

```js
let webpack = require("webpack");
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // ENV: "'development'", // 需要双层
      ENV: JSON.stringify("development"),
      FLAG: "true",
      ADD: "1+1",
    }),
  ],
};
```

2. index.js 使用

```js
console.log(ENV, ENV === "development"); // development true
console.log(typeof FLAG); // boolean
console.log(ADD); // 2
```

## 区分不同环境

1. 基础环境 webpack.base.js

```js
let path = require("path");

module.exports = {
  entry: "./src/index.js", // 入口
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"), // 路径必须是一个绝对路径
  },
};
```

2. 开发环境 webpack.dev.js

```js
let { merge } = require("webpack-merge");
let base = require("./webpack.base.js");

module.exports = merge(base, {
  mode: "development",
  devServer: {},
  devtool: "source-map",
});
```

3. 生产环境 webpack.prod.js

```js
let { merge } = require("webpack-merge");
let base = require("./webpack.base.js");

let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
let TerserJSPlugin = require("terser-webpack-plugin");
module.exports = merge(base, {
  mode: "production",
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin(), new TerserJSPlugin()],
  },
});
```
