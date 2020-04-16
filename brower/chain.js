function bar(){
  console.log(myName)
}
function foo(){
  var myName = 'jikebang';
  bar();
}
var myName = 'time';
foo();
// 注： ‘time’
// 分析： 1. 全局执行上下文和foo函数的执行上下文都有myName，bar应该选择是就近父级还是哪个？
// 2.然而在每个执行上下文的变量环境中，都有一个「外部引用 outer」，用来直接指向全局指向上下文。
// 3.如果bar函数内使用了外部变量，那么js引擎会去全局执行上下文中查找。这个查找的链条就称为「作用域链」。

function bar2(){
  var myString = 'wold'
  let test1 = 100
  if(1){
    let myString = 'Chorme'
    console.log(test)
  }
}
function foo2(){
  var myString = 'jikeBane'
  let test = 2
  {
    let test = 3
    bar2()
  }
}
var myString = 'jikeTime'
let myAge = 10
let test = 1
foo2()
// 1
// 调用栈执行顺序： bar函数执行上下文中的 「词法环境let」-->「变量环境var」 ——>「outer」————> 父级作用域foo函数执行上下文的词法环境和变量环境
//            其中bar「outer」就是指「全局执行上下文」的词法环境和变量环境。


/**
 * this
 * 注意：「this」和「作用域链」是两套不同的系统，之间没有直接联系。
 * 执行上下文：「变量环境、词法环境、外部环境、this」，每个执行上下文都有一个this。（全局执行上下文、函数执行上下文）
 */
function foo(){console.log(this)}
foo() // window
// ! 1. 在全局环境中调用一个函数，其执行上下文中的this指向window对象，可以通过call、bind、apply指向其他对象。
let bar3 = {
  myName: 'jikebang',
  test1: 1
}
function foo(){
  this.myName = 'jikeshijian'
}
foo.call(bar3)
console.log(bar3) // bar.myName: jikeshijian
console.log(myName) // undefined

// ! 2. 通过对象调用方法，是this指向当前对象
var myObj = {
  name: 'jikeshijian',
  showThis: function(){
    console.log(this.name)
  }
}
myObj.showThis() // 指向的是myObj  'jikeshijian'
// javascript引擎在执行时转化为了：myObj.showThis.call(myObj)


function CreateObj() {
  this.name = 'jikeshijian'
}
var myObj = new CreateObj();
// 当执行new CreateObj()的时候，javascript引擎做了如下四件事情
// 1. 首先创建了一个空对象 tempObj {};
// 2. 调用CreateObj.call方法，tempObj做call的参数，使CreateObj的执行上下文创建时，this指向了这个空对象tempObj
// 3. 执行CreateObj函数，此时的this指向tempObj对象。
// 4. 最后返回tempObj对象
function new1() {
  var tempObj = {};
  CreateObj.call(tempObj);
  return tempObj;
}



/**
 * 消息队列、事件循环
 */

// 「单线程」运行过程中，要能接受并执行新任务，需采用「事件循环机制」： 同一个线程内
//  如果其他线程发送任务给主线程（如IO线程的资源加载完成事件、鼠标点击事件）如何不等待的及时解析呢
// 「消息队列」：一种数据结构，存放要执行的任务，先进先出，

// 如何处理告优先级的任务？「微任务」由此而来。
// 「消息队列」称为「宏任务」，每个宏任务都有一个「微任务队列」，在执行宏任务的过程中，如果dom有变化，就将该变化加到微任务列表中，就不会影响到宏任务的执行，也解决了执行效率的问题。


// summary:
// 单线程 ---> 事件循环 ----> 消息队列（宏任务） ----> 微任务

/**
 * setTimeout
 */
// 除了正常的消息队列外，还有另外一个消息队列，其中维护了需要延迟执行的任务列表，包括定时器和其他Chromium内部一些需要延迟的任务。
// 当js调用setTimeout设置的回掉函数时：
// 1. 渲染进程将会创建一个回掉任务{回调函数、发起时间、延迟执行时间}}
// 2. 将改创建好的「回掉任务」添加到「延迟执行队列」中
// 3. 处理完「消息队列」中的一个任务后，就开始执行processDelayTask函数「延迟队列」。
// 4. 「延迟队列」内会根据发起时间和延迟时间，计算出到期的任务，执行完这些到期的任务后，再进入下一个循环

// time_id = setTimeout((){}, 0); js引擎会返回一个定时器ID，可根据这个ID取消定时器,
// clearTimeout(time_id), 从延迟队列中找到并删除。

// summary：
// 1. 如果消息队列中的当前任务执行时间过久，会影响延迟到期的定时器的任务执行。
function to1(){
  console.log('bar')
}
function to2() {
  setTimeout(to1, 0);
  for(let i = 0; i < 50; i++){
    // let i = i + 'yes';
    console.log(i)
  }
}
to2()
// 2. 如果setTimeout存在嵌套调用，那么系统会设置的最短时间间隔为4毫秒
function to3(){
  setTimeout(to3, 0);
}
setTimeout(to3, 0);
// 3. 未激活的页面，setTimeout执行最小时间间隔是1000毫秒？？
// 4. 延时执行时间有最大值，大于24.8天，就会溢出，立即执行。
// 5. setTimeout中的this，指向全局环境，如果严格模式，则是undefined

/**
 * 延伸：
 * window.requestAnimationFrame(call(DOMHighResTimeStamp))
 * 下次重绘之前，更新动画帧所调用的函数,被传入DOMHighResTimeStamp（回调函数被触发的时间）
 */
var start = null;
var element = document.getElementById('requestAnimationFrame');

function step(timestamp){
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  console.log(progress, timestamp)
  if (progress < 200){
    window.requestAnimationFrame(step)
  }
}
window.requestAnimationFrame(step)



/**
 * 异步回调函数的执行方式
 */
// 1. 第一种（setTimeout, XMLHttpRequest）是把异步回掉函数（这里指的是主线程发起的一个耗时任务，将任务交给另外一个线程处理，将任务结果加到消息队列中）
//    封装成一个「宏任务」， 添加到消息队列的尾部，当循环系统执行到改任务时执行回调函数。
// 2. 第二种方式的执行时机是在主函数执行结束之后， 当前宏任务结束之前执行回调函数，也就是「微任务」。

/**
 * 微任务
 * 就是一个需要异步执行的函数，执行时机在主函数执行结束之后，当前宏任务结束之前。
 */
// 运行机制： v8引擎在创建一个全局执行上下文时，也会在内部创建一个「微任务队列」，在当前宏任务执行过程种，会产生多个微任务进入这个队列；
// 微任务的产生：1. 使用mutationObserver监控某个DOM节点，通过js修改这个节点（添加、删除）时，会产生DOM变化纪录的微任务
//             2. 使用Promise，当调用Promise.resolve()或Promise.reject()时，产生微任务。
// 微任务的执行时机：在当前宏任务快执行完时，（js引擎在准备退出全局执行上下文并清空调用栈的时候），js引擎会检查全局执行上下文种的微任务队列，


/**
 * promise
 * 解决的是： 异步编程风格的问题。
 * 消灭嵌套调用和多次错误处理。
 */
// promise 在执行resolve或者reject时，触发微任务, 所以在Promise的executor函数中调用xmlhttpRequest会触发宏任务。

