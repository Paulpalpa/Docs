---
sidebar_position: 3
---

# 策略模式

策略模式，其定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换，封装的策略算法一般是独立的，策略模式根据输入来调整采用哪个算法。关键是**策略的实现和使用分离**。策略模式其实比较简单，但是对于培养良好的编码习惯和重构意识却大有裨益，我在进行项目重构的过程中就在大量使用这种设计模式。

## 应用场景

有一天产品经理给你一个需求的逻辑如下：

- 当价格类型为“预售价”时，满 100 - 20，不满 100 打 9 折
- 当价格类型为“大促价”时，满 100 - 30，不满 100 打 8 折
- 当价格类型为“返场价”时，满 200 - 50，不叠加
- 当价格类型为“尝鲜价”时，直接打 5 折

扫了一眼 prd，首先定义四种价格：

- 预售价 - pre
- 大促价 - onSale
- 返场价 - back
- 尝鲜价 - fresh

然后直接开写：

```javascript
// 询价方法，接受价格标签和原价为入参
function askPrice(tag, originPrice) {
  // 处理预热价
  if (tag === "pre") {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  }

  // 处理大促价
  if (tag === "onSale") {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  }

  // 处理返场价
  if (tag === "back") {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  }

  // 处理尝鲜价
  if (tag === "fresh") {
    return originPrice * 0.5;
  }
}
```

从功能事件角度来说这代码有毛病吗？一点毛病没有。但是代码确实不够优雅，存在以下几个问题：

- 违反函数单一功能设计原则，一个函数做了太多的事情，出现问题难以定位。
- 违反了开放与封闭原则，如果继续增加判断逻辑怎么办，需求判断逻辑变更怎么办，只能继续 if-else，代码只会越来越臃肿。

## 策略模式的实现

如何去实现策略模式呢？我们基于上述代码进行一些改造。上文中提到策略模式的核心是策略的实现与使用分离，首先我们需要把各种处理逻辑提取成一个函数，实现一个函数只做一件事。

```javascript
// 处理预热价
function prePrice(originPrice) {
  if (originPrice >= 100) {
    return originPrice - 20;
  }
  return originPrice * 0.9;
}

// 处理大促价
function onSalePrice(originPrice) {
  if (originPrice >= 100) {
    return originPrice - 30;
  }
  return originPrice * 0.8;
}

// 处理返场价
function backPrice(originPrice) {
  if (originPrice >= 200) {
    return originPrice - 50;
  }
  return originPrice;
}

// 处理尝鲜价
function freshPrice(originPrice) {
  return originPrice * 0.5;
}

function askPrice(tag, originPrice) {
  // 处理预热价
  if (tag === "pre") {
    return prePrice(originPrice);
  }
  // 处理大促价
  if (tag === "onSale") {
    return onSalePrice(originPrice);
  }

  // 处理返场价
  if (tag === "back") {
    return backPrice(originPrice);
  }

  // 处理尝鲜价
  if (tag === "fresh") {
    return freshPrice(originPrice);
  }
}

// prePrice - 处理预热价
// onSalePrice - 处理大促价
// backPrice - 处理返场价
// freshPrice - 处理尝鲜价
// askPrice - 分发询价逻辑
```

然后就是如何去除 if-else 并明确类型与处理函数之间的映射关系，我们可以用采用**对象映射**

```javascript
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh(originPrice) {
    return originPrice * 0.5;
  },
};
```

如何使用：

```javascript
// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice);
}
```

如此一来，整个处理逻辑的分发就变得清爽而明晰，如何定位 bug 与逻辑变更都变得简单，这就是策略模式。
