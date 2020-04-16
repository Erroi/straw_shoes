function* genDemo() {
  console.log('start 1');
  yield 'generator 1';

  console.log('steep2');
  yield 'generator 2'

  console.log('steep3');
  yield 'generator 3';

  console.log('steep4');
  yield 'generator 4';
  
}

console.log('main 0')

let gen = genDemo()

console.log(gen.next().value)

console.log('main1')
console.log(gen.next().value)

console.log('main2')
console.log(gen.next().value)

console.log('main3')
console.log(gen.next().value)

console.log('main4')

// main0 start1 generator1  main1 steep2 generator2  main2 steep3 generator3 main3 steep4 generator4 main4




/**
 * 生成器 generator VS 协程 coroutine
 */
// 经./generator.js 结果得知：
// 1. 在生成器函数内部执行一段代码，如果遇到yield关键字， 那么JavaScript引擎将返回关键字后面的内容给外部， 并暂停该函数的执行。
// 2. 外部函数可以通过next方法恢复函数的执行。

// v8是如何实现一个函数的暂停和恢复的？
// 协程： 是一种比线程更加轻快的存在，一个线程可以存在多个协程（正如一个进程可以有多个线程一样），但是一个线程只能同时执行一个协程。
// 1. 当调用.next时，JavaScript引擎会保存当前的「调用栈信息」，并将切换到「gen协程」调用栈
// 2. 当调用yield是， js引擎会保存「当前协程」的调用栈信息，并切换到「父协程的调用栈」。
