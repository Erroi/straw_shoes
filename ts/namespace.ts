// 命名空间 适用于全局中，不适用于模块中
// 命名空间的实现原理：编译成了一个立即执行函数，闭包,挂到一个全局变量上
namespace Shape {
  const pi = Math.PI
  export function circle(r: number){
    return pi * r ** 2
  }
}

/**
 * 编译为js
 * 
 * var Shape;
(function(Shape) {
  var pi = Math.PI;
  function circle(r) {
    return pi * Math.pow(r, 2);
  }
  Shape.circle = circle;
})(Shape || (Shape = {}));
 *  */ 
