---
sidebar_position: 2
---

# URLSearchParams 处理 Url 参数解析

对于前端而言处理 Url 参数是一个很常见的需求，目前有两种常见的处理方式：

## split 字符串分割

```javascript
// 参数转成对象
function queryString(str) {
  let params = str.split("?")[1]; //截取?号后的字符串即name=itclanCoder&study=css
  let param = params.split("&"); // 通过&符号进行分割即["name=itclanCoder", "study=css"]
  let obj = {}; // 用一个对象存储目标值
  for (let i = 0; i < param.length; i++) {
    // 循环遍历截取出来的param数组
    let paramsA = param[i].split("="); // 通过split,=继续对数组params每一项进行分割,生成数组["name", "itclanCoder"]
    let key = paramsA[0]; // 取数组项["name", "itclanCoder"]中第0位,即name
    let value = paramsA[1]; // 取数组项["name", "itclanCoder"]中第1位,即itclanCoder
    obj[key] = value;
  }
  return obj;
}
console.log(queryString(baseUrlStr)); // {name: "itclanCoder", study: "css"]}
```

## 正则表达式

```javascript
let baseUrlStr = "https://coder.itclan.cn?name=itclanCoder&study=css";
const queryURLParameter = (url) => {
  let regx = /([^&?=]+)=([^&?=]+)/g;
  let obj = {};

  url.replace(regx, (...args) => {
    if (obj[args[1]]) {
      obj[args[1]] = Array.isArray(obj[args[1]])
        ? obj[args[1]]
        : [obj[args[1]]];
      obj[args[1]].push(args[2]);
    } else {
      obj[args[1]] = args[2];
    }
  });

  return obj;
};

console.log(queryURLParameter(baseUrlStr)); // {name: "itclanCoder", study: "css"}
```

## URLSearchParams

可以看到上述方法虽然都能实现需求，但是处理起来还是比较麻烦的，Web API 中提供了 URLSearchParams 接口可以帮助我们快速的实现从 Url 中提取 query 参数。
URLSearchParams 是一个构造函数，会生成一个 URLSearchParams 对象， 并且遇到特殊字符它会自动帮我们 encode 和 decode。

```javascript
const paramsString = "a=1&a=2&b=%40&c=@"
const searchParams = new URLSearchParams(paramsString);

//has 返回 [`Boolean`] 判断是否存在此搜索参数
searchParams.has("a") // true

//get 获取指定搜索参数的第一个值，如果是编码过的会自动转码， 比如 b对应的值是 %40，会自动转为 @
searchParams.get('b') // @

//getAll 获取指定搜索参数的所有值，返回是一个数组
searchParams.getAll('a') // ['1','2']
searchParams.getAll('b') // ['@']

//append 插入一个指定的键/值对作为新的搜索参数。
searchParams.append("d", "3")
searchParams.get('d') // '3'

//set 设置一个搜索参数的新值，假如原来有多个值将删除其他所有的值。
searchParams.getAll('a') // ['1','2']
searchParams.set('a', '5')
searchParams.getAll('a') // ['5']

//delete 从搜索参数列表里删除指定的搜索参数及其对应的值。
searchParams.getAll('a') // ['1','2']
searchParams.delete('a')
searchParams.getAll('a') // []

//toString 返回搜索参数组成的字符串，可直接使用在 URL 上, 如果值有特殊字符会自动encode, 比如c 对应的 @ 会自动encode 为 %40
searchParams.toString() // "a=1&a=2&b=%40&c=%40"

//keys 返回一个iterator对象，此对象包含了键/值对的所有键名, 可以用for of 循环这个对象
for (const key of searchParams.keys()) {
     console.log(key); // 循环打印 'a' 'a' 'b' 'c'
}

// values 和 entries 方法 同 keys 方法，都返回一个iterator对象， values会包含了键/值对的所有值， entries会包含了键/值对


```
:::note
你如果使用react-router-dom v6版本的话，有一个 useSearchParamshook，也是基于URLSearchParams
:::

