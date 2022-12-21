---
sidebar_position: 4
---

# Three 实践

通过对 Three 基础概念的了解，来实现一个基础的 demo。[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)是最近很热门的库，提供了 React 中使用 Three.js 的能力，并且提供了丰富的 hook 支持，使得我们能快速建立 Three.js 场景。

## 一个炫酷的首页

这是最初根据 Docusaurus 模板修改得到的文档首页，略显平淡，尝试用 Three.js 为页面添加一点炫酷的特效

![这是图片](/img/web.png "Magic Gardens")

首先，引入 React Three Fiber:

```javascript
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
```

定义初始画布，Canvas 就是搭建 3D 场景的画布。

```javascript
export default function BackGround() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Stars />
    </Canvas>
  );
}
```

定义星光元素，随机生成点：

```javascript
function Stars(props) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
```

普通的 React 组件，定义一些文字和操作按钮：

```javascript
import React from "react";
import Link from "@docusaurus/Link";
import "./styles.css";

export default function Overlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "500px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "50%",
          transform: "translate3d(-50%,-50%,0)",
        }}
        className="title"
      >
        <h1
          style={{
            margin: 0,
            padding: 0,
            fontSize: "8em",
            fontWeight: 500,
            letterSpacing: "-0.05em",
          }}
        >
          前端记录小站
        </h1>
      </div>
      <div className="buttons">
        <Link className="button button--secondary button--lg" to="/docs/intro">
          开始浏览 ⏱️
        </Link>
      </div>
    </div>
  );
}
```

相关的 css 样式：

```css
@import url("https://rsms.me/inter/inter.css");

* {
  box-sizing: border-box;
}

.custom-header {
  width: 100%;
  height: 500px;
  overscroll-behavior-y: none;
  font-family: "Inter var", sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  color: #ddd;
  background: #12071f;
}

.custom-header > a {
  pointer-events: all;
  color: #ddd;
  text-decoration: none;
}

.custom-header > svg {
  fill: #ddd;
}

.title > h1 {
  background: linear-gradient(30deg, #c850c0, #ffcc70);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.custom-header .buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 420px;
  left: 50%;
  z-index: 999;
  transform: translateX(-86px);
}
```

把两者组合利用绝对定位组合起来：

```javascript
import React from "react";
import BackGround from "./BackGround";
import Overlay from "./Overlay";

export default function Headers() {
  return (
    <div className="custom-header">
      <BackGround />
      <Overlay />
    </div>
  );
}
```

看看改造后首页, 加上星空背景后是不是炫酷了很多：
![这是图片](/img/video.gif "Magic Gardens")

想要真正把Three.js用好还是很难的，不仅是其本身的操作比较复杂，而且还需要丰富的图形学知识储备，但是我们可以逐渐学习用其做一些简单的特效，让我们的页面变得更炫酷。

