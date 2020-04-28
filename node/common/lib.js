console.log('hello cat')

// 模块默认会被注入 一个 exports 对象
exports.hello = 'world'

exports.add = function() {
  return 2 + 3
}

exports.all = 4 + 5

exports.geek = {hello: 'world'}

setTimeout(function() {
  console.log(exports, module.exports) // {..., addition: 'test}
},2000)
// 3. commonjs 被模块外的赋值，同时会同步模块内：因为是引用类型

module.exports = function minus(a, b) {
  return a - b;
}
