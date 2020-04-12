_强类型语言_
> 从调用函数传递，到被调用函数，其类型必须与被调用函数中声明的类型兼容，不予许改变类型，除非强制类型转换

_静态类型语言_
> 在编译阶段确定所有变量的类型

* 对类型极度严格
* 立即发现错误
* 运行时性能好

_动态类型语言_
> 在执行阶段确定所有变量的类型

* 对类型非常宽松
* Bug可能隐藏很多年
* 运行时性能差
1. 性能是可以改善的 V8引擎，而语言的灵活性更重要
2. 隐藏的错误可以通过单元测试发现
				强
 	python |   java C#
动态——————|———c—c++——静态
	js、php	|
				弱

`$ tsc xxx.ts`

##### 数据类型
> ES6 的6种基本数据类型：Boolean  Number  String  Symbel  undefined    null   、3种引用类型：Array  Function  Object
> TS增加的类型：void  any  never  元组、枚举、高级类型、


##### module
> TS 支持ES6模块和commonJs
> ES6 export \ export default \ import
  `export default xxx` 相当于 `export['default'] = xxx`导入相当于`c3.default()`
> commonJs  不能同时存在，顶级导出会覆盖 分导出
顶级导出：
  `module.exports = {} ` 
分导出：
  `exports.c = 3`
  `exports.d = 4`
> amd  define(['xxx','yyy'],function(x,y){})
> umd  (function(x){})(function(req,exp){})



* TypeScript
  类型检查、语言转换、语法错误
  1. 编译能力（语言转换）: ts|js -> es3/4/5/6...
  2. 类型检查：有
  3. 无（插件）
  4. 代码检查工具：eslint + typescript-eslint
  5. 单元测试工具：ts-jest
  如：ts-loader

* babel
  1. 编译能力（语言转换）: ts|js -> es3/4/5/6...
  2. 无（类型检查）
  3. 插件丰富
  4. 代码检查工具：babel-eslint
  5. 单元测试工具：babel-jest
  如：@babel/cli  @babel/core  @babel/preset-env  @babel/preset-typescript：做语言转换（配合tsc做类型检查）
    @babel/plugin-proposal-class-properties   @babel/plugin-proposal-object-rest-spread
    
  **ts-loader 和 @babel/preset-typescript 不要混用**

* ESLint
  代码风格、语法错误


  webpack 的 optimization:{splitChunk: {chunks: 'all'}} 自动将业务代码和引用包代码分开，便于浏览器缓存