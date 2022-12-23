---
sidebar_position: 6
---

# 初试 WebAssembly

汇编语言（Assembly Language）是任何一种用于电子计算机、微处理器、微控制器或其他可编程器件的低级语言。那么 WebAssembly 又是什么呢？WebAssembly 不是一种编程语言，简单来说它是一种将用一种编程语言编写的代码转换为浏览器可理解的机器代码的技术。

## WebAssembly 基础概念

相对于 JavaScript，WebAssembly 带来了哪些优势：

- 更快的启动时间。在服务器上，Wasm 可以实现比 Docker 容器快 10-100 倍的冷启动时间，因为它不需要为每个容器创建一个 OS 进程。在浏览器中，解码 Wasm 比解析、解释和优化 JavaScript 更快，因此 Wasm 代码在浏览器中的执行速度比 JavaScript 更快。
- 近乎原生的性能。关于 Wasm 的性能细节存在一些争议，但它的优势在于允许用户将其应用程序的计算密集型部分封装到较低级别的语言。 Wasm 的许多性能优势来自于它（它是 Wasm 代码）被构建为尽可能接近本机机器代码这一事实。
- 轻量级。Wasm 二进制文件体积小，因此只使用少量带宽，通常比浏览器中的交叉编译 JavaScript 花费更少的时间通过网络传输。
- 便捷通用。任何 Wasm 运行时都可以运行任何 Wasm 代码（尽管并非所有运行时都支持所有 Wasm 扩展，即不同的 WASI 接口类型）。大多数浏览器都支持 WebAssembly，并且在服务器端（WasmEdge、Wasmtime 等）有许多运行 Wasm 代码的运行时。鉴于浏览器和服务器（以及硬件）对 Wasm 的广泛支持，它是具有可移植的，并且也非常通用，大约 30 种语言可以编译或在其中执行（C、C++、Rust、Python、Go、AssemblyScript、JavaScript 等等）。
- 安全。WebAssembly 安全模型的两个目标是：（1）保护用户免受错误和或恶意模块的侵害；（2）为开发人员提供开发安全应用程序所需的原语。在这个程度上，Wasm 的范围是有限的，在 Wasm 运行时中运行的代码是内存沙盒和功能受限的。

WebAssembly 为什么能更快呢？因为它是基于堆栈的虚拟机的二进制指令格式，一种低级汇编语言，旨在非常接近已编译的机器代码，并且非常接近本机性能。WebAssembly 的具体文件如下所示，可以看到它的形式十分的近似机器码。

```
Offset: 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
00000000: 00 61 73 6D 01 00 00 00 01 11 04 60 00 01 7F 60    .asm.......`...`
00000010: 01 7F 01 7F 60 00 00 60 01 7F 00 03 07 06 02 01    ....`..`........
00000020: 00 03 01 00 04 05 01 70 01 02 02 05 06 01 01 80    .......p........
00000030: 02 80 02 06 0F 02 7F 01 41 90 88 C0 02 0B 7F 00    ........A..@....
00000040: 41 84 08 0B 07 88 01 09 06 6D 65 6D 6F 72 79 02    A........memory.
00000050: 00 19 5F 5F 69 6E 64 69 72 65 63 74 5F 66 75 6E    ..__indirect_fun
00000060: 63 74 69 6F 6E 5F 74 61 62 6C 65 01 00 09 66 69    ction_table...fi
00000070: 62 6F 6E 61 63 63 69 00 01 0B 5F 69 6E 69 74 69    bonacci..._initi
00000080: 61 6C 69 7A 65 00 00 10 5F 5F 65 72 72 6E 6F 5F    alize...__errno_
00000090: 6C 6F 63 61 74 69 6F 6E 00 05 09 73 74 61 63 6B    location...stack
000000a0: 53 61 76 65 00 02 0C 73 74 61 63 6B 52 65 73 74    Save...stackRest
000000b0: 6F 72 65 00 03 0A 73 74 61 63 6B 41 6C 6C 6F 63    ore...stackAlloc
000000c0: 00 04 0A 5F 5F 64 61 74 61 5F 65 6E 64 03 01 09    ...__data_end...
000000d0: 07 01 00 41 01 0B 01 00 0A 66 06 03 00 01 0B 3D    ...A.....f.....=
000000e0: 01 02 7F 41 01 21 01 20 00 41 02 4E 04 7F 41 00    ...A.!...A.N..A.
000000f0: 21 01 03 40 20 00 41 7F 6A 10 01 20 01 6A 21 01    !..@..A.j....j!.
00000100: 20 00 41 03 4A 21 02 20 00 41 7E 6A 21 00 20 02    ..A.J!...A~j!...
00000110: 0D 00 0B 20 01 41 01 6A 05 41 01 0B 0B 04 00 23    .....A.j.A.....#
00000120: 00 0B 06 00 20 00 24 00 0B 10 00 23 00 20 00 6B    ......$....#...k
00000130: 41 70 71 22 00 24 00 20 00 0B 05 00 41 80 08 0B    Apq".$......A...
```

来看一下 js 运行时发生了什么：

![这是图片](/img/js_runtime.png "Magic Gardens")

而 WebAssembly 又有什么差异：

![这是图片](/img/webassembly.png "Magic Gardens")

## 尝试一下

首先我们需要编译得到一个 wasm 文件，很多语言都有内置的编译器可以实现。 **[WasmExplorer](https://mbebenita.github.io/WasmExplorer/)**可以帮助我们很方便的在线编译生成 wasm 文件。

![这是图片](/img/web_explorer.png "Magic Gardens")

然后用 Node.js 搭建一个简单的 http 服务来返回 wasm 文件

```javascript
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = 8888; // 服务器监听的端口号；

const mime = {
  html: "text/html;charset=UTF-8",
  wasm: "application/wasm", // 当遇到对 ".wasm" 格式文件的请求时，返回特定的 MIME 头；
};

http
  .createServer((req, res) => {
    let realPath = path.join(__dirname, `.${url.parse(req.url).pathname}`);
    // 检查所访问文件是否存在，且是否可读；
    fs.access(realPath, fs.constants.R_OK, (err) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end();
      } else {
        fs.readFile(realPath, "binary", (err, file) => {
          if (err) {
            // 文件读取失败时返回 500；
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end();
          } else {
            // 根据请求的文件返回相应的文件内容；
            let ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : "unknown";
            let contentType = mime[ext] || "text/plain";
            res.writeHead(200, { "Content-Type": contentType });
            res.write(file, "binary");
            res.end();
          }
        });
      }
    });
  })
  .listen(PORT);
console.log("Server is runing at port: " + PORT + ".");
```

建立一个 html 文件来记载使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>斐波纳切数字</title>
  </head>
  <script>
    function fibonacciJS(n) {
      if (n < 2) {
        return 1;
      }
      return fibonacciJS(n - 1) + fibonacciJS(n - 2);
    }
    const response = fetch("fibonacci.wasm");
    const num = [5, 15, 25, 35];
    WebAssembly.instantiateStreaming(response).then(({ instance }) => {
      console.log(instance);
      let { _Z3fibi: fibonacci } = instance.exports;
      for (let n of num) {
        console.log(`斐波纳切数字: ${n}，运行 10 次`);
        let cTime = 0;
        let jsTime = 0;
        for (let time = 0; time < 10; time++) {
          let start = performance.now();
          fibonacci(n);
          cTime += performance.now() - start;

          start = performance.now();
          fibonacciJS(n);
          jsTime += performance.now() - start;
        }
        console.log(`wasm 模块平均调用时间：${cTime / 10}ms`);
        console.log(`js 模块平均调用时间：${jsTime / 10}ms`);
      }
    });
  </script>

  <body></body>
</html>
```

来看一下运行结果，从一个简单的 demo 也可以粗略看出 WebAssembly 确实拥有更快的运行性能。

![这是图片](/img/run_result.png "Magic Gardens")

## 应用场景

JavaScript 发展至今其地位肯定不会被 WebAssembly 所取代，但是一项新技术的出现必然会带来一些变革。WebAssembly 如今也已经在很多场景有了应用：

- 音视频的处理（B 站上的视频封面预览、视频帧处理）
- CAD 与 PS 的 web 版本
- Google 地球应用
