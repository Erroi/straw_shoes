> http://c.biancheng.net/view/5700.html
##### js的4中函数调用

* 一般形式的函数调用
    默认情况下，函数不会被执行。使用 () 可以激活并执行函数

      ```
      function f(x,y) {
        return function(){
          return x * y
        }
      }
      f(1,2)()
      ```
* 作为对象的方法调用
    函数作为对象的属性时，作为方法，使用**点**语法可以调用一个方法

      ```
      var obj = {
        value: 0,
        increment: function(inc) {
          this.value = inc
        }
      }
      obj.increment(3)
      obj.value // 3
      ```

* 使用call、apply的**动态**调用
    call、apply是Function的原型方法，**能够将一个函数当一个方法绑定到指定对象上，同时调用**

      ```
      function max() {
        var m = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] > m) {
            m = arguments[i];
          }
          return m;
        }
      }
      var a = [2,3,4,2,33,9]
      var m = max.apply(Object, a)  // 动态调用max，绑定为Object的方法
      ```
    **call、apply可以把一个函数转换为指定对象的方法，并在这个对象上调用该方法。当动态调用完成后，这个对象的临时方法也就不存在了**
    ```
    function f(){
      return '函数f'
    }
    var obj = {};
    f.call(obj);
    obj.f() // 编译错误
    ```
* 使用new间接调用
    new可以**实例化对象**，但在创建对象的过程中会激活并运行函数。因此使用new可以**间接调用函数**
    ```
    function f(x,y) {
      console.log(x + y)
    }
    new f(3,4)
    ```
    new调用函数时，返回的是对象，而不是return的值
