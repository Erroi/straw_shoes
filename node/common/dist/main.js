// commonjs 模块规范 webpack --devtool none --mode development --target node index.js --output-file ./dist/main.js

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
            console.log('module:', module)
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

console.log('0:', __webpack_require__(0))
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
([
 function(module, exports, __webpack_require__) {

	console.log('start require')
	var lib = __webpack_require__(1)
	console.log('end require', lib)

	lib.addition = 'test outer'

	// 1、commonjs 当一个模块初始状态时被引用，默认为空对象 {}
	// 2. commonjs 在引用时就执行，所以 {all: 9}

	console.log('加入module.exports = 后：lib.add', lib.add) // undefined
	// 4. commonjs 模块内导出写了 module.exports 后，会直接覆盖exports={..., add:''}。
	//    addition挂在了module.exports上


},
function(module, exports) {
console.log('been:', module, exports)
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


}
]);