---
sidebar_position: 5
---

# 发布-订阅模式

在众多的设计模式中最常见应该就是发布-订阅模式。

> 发布-订阅模式定义了一种一对多的关系，让多个订阅者对象同时监听某一个发布者，或者叫主题对象，这个主题对象的状态发生变化时就会通知所有订阅自己的订阅者对象，使得它们能够自动更新自己。

![这是图片](/img/publish_observer.jpg "Magic Gardens")

## 场景

举一个例子来说明发布-订阅模式，一个产品经理拉了企业微信群，把几位开发、测试同学拉到了群里，等待产品经理将需求发布到群里，然后开始操作。在上述的过程中，需求文档（目标对象）的发布者只有一个——产品经理韩梅梅。而需求信息的接受者却有多个——前端、后端、测试同学，这些同学的共性就是他们需要根据需求信息开展自己后续的工作，因此都非常关心这个需求信息，于是不得不时刻关注着这个群的群消息提醒，他们是实打实的订阅者，即观察者对象。

## 基础实现

单纯的从概念描述中去理解发布-订阅模式还是有点，让我们从实践中去理解学习。首先一个发布者需要具备以下能力：

- 能够增加订阅者
- 能够移除订阅者
- 能够给订阅者发送通知

基于以上分析来进行代码实现：

```javascript
// 定义发布者类
class Publisher {
  constructor() {
    this.observers = []
    console.log('Publisher created')
  }
  // 增加订阅者
  add(observer) {
    console.log('Publisher.add invoked')
    this.observers.push(observer)
  }
  // 移除订阅者
  remove(observer) {
    console.log('Publisher.remove invoked')
    this.observers.forEach((item, i) => {
      if (item === observer) {
        this.observers.splice(i, 1)
      }
    })
  }
  // 通知所有订阅者
  notify() {
    console.log('Publisher.notify invoked')
    this.observers.forEach((observer) => {
      observer.update(this)
    })
  }
```

再来看订阅者又该如何去实现，订阅者作为被动的一方，它的行为就只有被通知，然后执行操作：

```javascript
// 定义订阅者类
class Observer {
  constructor() {
    console.log("Observer created");
  }

  update() {
    console.log("Observer.update invoked");
  }
}
```

这就是最简版的发布-订阅模式的实现，实际业务开发中面对的场景肯定远比这个复杂，这里只是希望通过这个例子来对发布-订阅模式做一个清晰的说明。

## 进阶操作：实现一个事件中心

发布订阅模式在实际开发中的最典型应用就是实现一个全局事件中心，实现组件间通讯，众多框架中都是用了这种实现方式

```javascript
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {};
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = [];
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb);
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice();
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args);
      });
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName];
    const index = callbacks.indexOf(cb);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}
```

## 关于发布-订阅模式与观察者模式

发布-订阅模式与观察者模式在很多情况下被画了等号，在上文也没有细分它们之间的区别，但是细究起来两者还是有所差异的。在上文举的两个例子我就有意的分别用了两种不同的模式，第一个例子为观察者模式，第二个例子为发布订阅模式。借用网上的一张图来说明它们的不同点。可以看到两者最大的差异在于是否有事件中心的存在。

- 发布者直接触及到订阅者的就是观察者模式
- 发布者不直接触及到订阅者、而是由统一的第三方来完成实际的通信的操作，叫做发布-订阅模式

![这是图片](/img/qubie_publish.jpg "Magic Gardens")
