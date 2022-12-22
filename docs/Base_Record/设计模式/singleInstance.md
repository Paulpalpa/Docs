---
sidebar_position: 2
---

# 单例模式

单例模式为创建型设计模式中最基础的一种，单例模式顾名思义就是一个类仅会有一个实例，无论重复创建多少次都只会返回第一次创建的那个唯一的实例。例如浏览器中的 window 和 document 都是单例的。当项目中需要一个公共的状态，那么需要使用单例模式来保证访问一致性，例如 Antv X6 实现流程图编辑时就可以将画布 graph 采用单例模式。

## 单例模式的实现需求点

- 访问时始终返回的是同一个实例
- 自行实例化，无论是一开始加载的时候就创建好，还是在第一次被访问时
- 一般还会提供一个 getInstance 方法用来获取它的实例

![这是图片](/img/single.png "Magic Gardens")

## 单例模式的最简实现

分解了单例模式的需求点之后我们可以知道单例模式的核心点就在于**具备判断自己是否已经创建过一个实例的能力**。我们就可以进行一个单例模式的最简实现

```javascript
class Person {
  static _instance = null;

  static getInstance() {
    if (Person._instance) {
      // 判断是否已经有单例了
      return Person._instance;
    }
    return (Person._instance = new Person());
  }

  constructor() {
    if (Person._instance) {
      // 判断是否已经有单例了
      return Person._instance;
    }
    Person._instance = this;
  }
}

const instance1 = new Person();
const instance2 = Person.getInstance();

console.log(schedule1 === schedule2); // true
```

## 进阶用法：单例模式的赋能

在上述的例子中，单例模式的创建会与功能类原有的逻辑混杂在一起，这违背了我们在一开始提到的单一功能原则。所以我们还可以进行一点改造，将功能逻辑与单例模式的创建逻辑解耦。

```javascript
/* 功能类 */
class Person {
  constructor(name) {
    this.name = name;
    this.init();
  }

  init() {
    this.age = 10;
  }
}

/* 单例模式的赋能类 */
const Singleton = (function () {
  let _instance = null; // 存储单例

  const ProxySingleton = function (name) {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = new Person(name);
    return _instance;
  };

  ProxySingleton.getInstance = function (name) {
    if (_instance) return _instance;
    _instance = new Singleton(name);
    return _instance;
  };

  return ProxySingleton;
})();
```

## 还能更秀：Proxy 实现单例赋能

单例模式的赋能其实就是代理了功能类的创建，说到代理类的创建那么 ES6 中的 proxy 不是最为合适么，尝试用 proxy 实现单例模式的赋能。

```javascript
/* Person 类 */
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

/* 单例模式的赋能方法 */
function Singleton(FuncClass) {
  let _instance;
  return new Proxy(FuncClass, {
    construct(target, args) {
      return _instance || (_instance = Reflect.construct(FuncClass, args)); // 使用 new FuncClass(...args) 也可以
    },
  });
}
```
