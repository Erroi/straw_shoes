console.log('start require')
var lib = require('./lib.js')
console.log('end require', lib)

lib.addition = 'test outer'

// 1、commonjs 当一个模块初始状态时被引用，默认为空对象 {}
// 2. commonjs 在引用时就执行，所以 {all: 9}

console.log('加入module.exports = 后：lib.add', lib.add) // undefined
// 4. commonjs 模块内导出写了 module.exports 后，会直接覆盖exports={..., add:''}。
//    addition挂在了module.exports上
