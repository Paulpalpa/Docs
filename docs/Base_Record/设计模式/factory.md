---
sidebar_position: 4
---

# 工厂模式

工厂模式根据不同的输入返回不同类的实例，一般用来创建同一类对象。工厂方式的主要思想是**将对象的创建与对象的实现分离**。工厂模式具备以下的特点：

- 访问者只需要知道参数，就可以从工厂获得对应实例；
- 访问者不关心实例创建过程；

## 简单工厂模式的实现

以最简单的方式实现一个工厂模式，因为这种实现比较简单，也不符合工厂模式设计时的本意，所以叫做简单工厂模式。

![这是图片](/img/factory.png "Magic Gardens")

```javascript
/* 工厂类 */
class Factory {
  static getInstance(type) {
    switch (type) {
      case "Product1":
        return new Product1();
      case "Product2":
        return new Product2();
      default:
        throw new Error("当前没有这个产品");
    }
  }
}

/* 产品类1 */
class Product1 {
  constructor() {
    this.type = "Product1";
  }

  operate() {
    console.log(this.type);
  }
}

/* 产品类2 */
class Product2 {
  constructor() {
    this.type = "Product2";
  }

  operate() {
    console.log(this.type);
  }
}

const prod1 = Factory.getInstance("Product1");
prod1.operate(); // 输出: Product1
const prod2 = Factory.getInstance("Product3");
```

## 抽象工厂模式

工厂模式的本意是将实际创建对象的过程推迟到子类中，一般用抽象类来作为父类，创建过程由抽象类的子类来具体实现。JavaScript 中没有抽象类，但是我们可以模拟一个抽象类。

![这是图片](/img/abstract_factory.png "Magic Gardens")

抽象类的主要作用主要对于最终生成的实例进行约束，以制造手机为例我现在并不知道我下一个生产线到底具体想生产一台什么样的手机，我只知道手机必须有这两部分组成，所以我先来一个抽象类来约定住这台手机的基本组成：

```javascript
class MobilePhoneFactory {
  // 提供操作系统的接口
  createOS() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
  // 提供硬件的接口
  createHardWare() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
}
```

抽象工厂不干活，具体工厂（ConcreteFactory）来干活！当我们明确了生产方案，明确某一条手机生产流水线具体要生产什么样的手机了之后，就可以化抽象为具体，比如我现在想要一个专门生产 Android 系统 + 高通硬件的手机的生产线，我给这类手机型号起名叫 FakeStar，那我就可以为 FakeStar 定制一个具体工厂：

```javascript
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
  createOS(type) {
    switch (type) {
      case "Android":
        return new AndroidOS();
      case "Apple":
        return new AppleOS();
      default:
        throw new Error("当前没有这个产品 -。-");
    }
  }
  createHardWare(type) {
    switch (type) {
      case "Qualcomm":
        return new QualcommHardWare();
      case "Mi":
        return new MiWare();
      default:
        throw new Error("当前没有这个产品 -。-");
    }
    // 提供高通硬件实例
  }
}
```

两个构造函数：AndroidOS 和 QualcommHardWare，它们分别用于生成具体的操作系统和硬件实例。像这种被我们拿来用于 new 出具体对象的类，叫做具体产品类（ConcreteProduct）。具体产品类往往不会孤立存在，不同的具体产品类往往有着共同的功能，比如安卓系统类和苹果系统类，它们都是操作系统，都有着可以操控手机硬件系统这样一个最基本的功能。因此我们可以用一个抽象产品（AbstractProduct）类来声明这一类产品应该具有的基本功能,以软件为例，硬件同理：

```javascript
// 定义操作系统这类产品的抽象产品类
class OS {
  controlHardWare() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！");
  }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
  controlHardWare() {
    console.log("我会用安卓的方式去操作硬件");
  }
}

class AppleOS extends OS {
  controlHardWare() {
    console.log("我会用🍎的方式去操作硬件");
  }
}

// 定义手机硬件这类产品的抽象产品类
class HardWare {
  // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
  operateByOrder() {
    throw new Error("抽象产品方法不允许直接调用，你需要将我重写！");
  }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
  operateByOrder() {
    console.log("我会用高通的方式去运转");
  }
}

class MiWare extends HardWare {
  operateByOrder() {
    console.log("我会用小米的方式去运转");
  }
}
```

如此一来，当我们需要一台 FakeStar 手机时：

```javascript
// 这是我的手机
const myPhone = new FakeStarFactory();
// 让它拥有操作系统
const myOS = myPhone.createOS("Android");
// 让它拥有硬件
const myHardWare = myPhone.createHardWare("Qualcomm");
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare();
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder();
```
