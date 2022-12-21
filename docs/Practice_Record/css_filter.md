---
sidebar_position: 3
---

# 一个属性实现前端页面置灰

## 主流网站的实现

我们可以看到这些网站实现前端页面置灰方式都是大同小异的，但核心都是通过 css 的 filter 属性去实现的

> CSS 属性 filter 将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像、背景和边框的渲染。

![这是图片](/img/juejin.png "Magic Gardens")

![这是图片](/img/taobao.png "Magic Gardens")

## filter 属性

filter 属性有以下可选函数：

- grayscale // 灰度
- sepia // 褐色
- saturate //饱和度
- hue-rotate // 色相旋转
- invert // 反色
- opacity // 透明度
- brightness //亮度
- contrast // 对比度
- blur //模糊，毛玻璃特效
- drop-shadow //阴影

前端页面的置灰就是通过 filter 的 grayscale 函数来实现的，grayscale 函数将改变输入图像灰度，该函数有一个参数，表示转换为灰度的比例， 将filter属性加到html元素上即可实现整个页面的置灰

```css
html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  -webkit-filter: gray;
  filter: gray;
  -webkit-filter: progid:dximagetransform.microsoft.basicimage(grayscale=1);
  filter: progid:dximagetransform.microsoft.basicimage(grayscale=1);
}
```
:::note
这里之所以要添加到html而不是body,是因为添加到body会导致某些下级元素的定位失效，而添加到html则不会出现这个问题
:::
:::note
- -webkit-filter： 带有 webkit 前缀可以在 webkit 内核的浏览器中生效；
- -moz-filter：带有 moz  前缀可以在 Firefox 浏览器中生效；
- -ms-filter：带有 ms 前缀可以在 IE 浏览器生效；
- -o-filter：带有 o 前缀可以在 Opera 浏览器生效；
:::

此外，使用这个属性需要注意浏览器的兼容性：

![这是图片](/img/css_filter.png "Magic Gardens")


