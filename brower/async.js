async function foo() {
  console.log(1);
  let a = await 100  // 返回 resolve(100)， promise.then被执行，so执行微任务
  console.log(a)
  console.log(2)
}
console.log(0)
foo()
console.log(3)

// 0 1 3 100 2


/**
 * async/await
 * 解决问题：promise的then，虽然解决了回调地域，但有太多then函数，async/await 实现用同步代码风格编写异步代码。
 * 原理：其实背后就是generator和Promise
 */
// 1. async是一个通过「异步执行」并「隐式返回Promise」作为结果的函数。
// 2. a = await 100；解析：主线程构建resolve(100)，将控制权交给父协程触发promise_.then((value) => {})

