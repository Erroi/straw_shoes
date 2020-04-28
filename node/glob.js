// 非阻塞 I/O （异步）
const glob = require('glob');

var result = null;
// console.time('glob')
// result = glob.sync(__dirname + '/**/*')
// console.timeEnd('glob')
// console.log(result)

var result = null;
console.time('glob')
glob(__dirname + '/**/*', function(err, res) {
  result = res;
  // console.log(result)
  console.log('got result')
})
console.timeEnd('glob')


// promise 异步，状态机pending、resolve、reject, 单向转变
//              每个than/catch  返回一个promise,其状态由then内的结果决定resolve/promise
//              如果回掉函数最终return了一个promise， 该promise会和回调函数return的promise状态保持一致
var primise = new Promise(function(resolve, reject) {
  setTimeout(() => {
    resolve();
  }, 500)
})
console.log(primise)  // pending
setTimeout(() => {
  console.log(primise)  // undefined
}, 800)


// 事件循环 event loop
const eventloop = {
  queue: [],
  loop() {
    while(this.queue.length) {
      var callback = this.queue.shift();
      callback();
    }
    setTimeout(this.loop.bind(this), 50)
  },
  add(callback) {
    this.queue.push(callback);
  }
}

eventloop.loop();

setTimeout(() => {
  eventloop.add(function() {
    console.log(1);
  })
}, 500)
setTimeout(() => {
  eventloop.add(function() {
    console.log(2)
  })
}, 800)


// async
console.log(async function() {
  return 4                    // Promise { 4 }
  // throw new Error('4')     // Promise { <rejected> Error: 4 }    
}())                  

console.log(function() {
  return new Promise((resolve, reject) => {
    resolve(4)                // Promise { 4 }
    // throw new Error('4')   // Promise { <rejected> Error: 4 }
  })
}())  
      /**
       * 由上得出 
       * 1. async/await 就是 Promise 的语法糖封装
       * 2。await 以 同步的方式 写 异步
       * 3. try-catch 可以捕获 await 里的错误（如果没有await，异步事件是进入下一个循环，try-catch是捕获不到的）
       */
(function() {
  const result = async function() {
    try {
      var content = await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('8'))
        }, 500)
      })
    } catch(e) {
      console.log('error', e.message);
    }
    console.log(content);
    return 4
  }()
  
  setTimeout(() => {
    console.log(result)
  }, 800)
})()
