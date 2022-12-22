---
sidebar_position: 5
---

# CSS3 画一个旋转的球体

如何用 CSS3 实现一个 3D 场景，核心在于 CSS3 支持的 preserve-3d 属性。

## 简单示例：旋转的球体

首先定义 Html 所需的元素：

```html
<div class="star">
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
  <div class="star-line"></div>
</div>
```

然后是 css 部分：

```css
<style>
        * {
            margin: 0;
            padding: 0
        }

        html,
        body {
            height: 100%;
            padding: 0;
            margin: 0;
            background: black;
            perspective: 1000px;
            overflow: hidden;
            background-size: 100% auto;
        }

        .box {
            transform-style: preserve-3d;
            height: 100%;
            transform: rotateX(60deg) rotateY(-30deg);
        }

        .star {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 300px;
            height: 300px;
            transform-style: preserve-3d;
            animation: starRotate 10s linear;
            animation-iteration-count: infinite;
        }

        .star-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 100%;
            height: 100%;
            border: 1px solid #FFD700;
            border-radius: 50%;
        }

        .star-line:nth-child(1) {
            transform: rotateY(36deg);
        }

        .star-line:nth-child(2) {
            transform: rotateY(72deg);
        }

        .star-line:nth-child(3) {
            transform: rotateY(108deg);
        }

        .star-line:nth-child(4) {
            transform: rotateY(144deg);
        }

        .star-line:nth-child(5) {
            transform: rotateY(180deg);
        }

        .star-line:nth-child(6) {
            transform: rotateY(216deg);
        }

        .star-line:nth-child(7) {
            transform: rotateY(252deg);
        }

        .star-line:nth-child(8) {
            transform: rotateY(288deg);
        }

        .star-line:nth-child(9) {
            transform: rotateY(324deg);
        }

        .star-line:nth-child(10) {
            transform: rotateY(360deg);
        }

        @keyframes starRotate {
            from {
                transform: rotateZ(0deg);
            }

            to {
                transform: rotateZ(360deg);
            }
        }
</style>
```

看下效果：

![这是图片](/img/sphere.gif "Magic Gardens")

demo 比较简单，主要是为了感受一下 preserve-3d 这个属性的使用
