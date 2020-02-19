##### how the $digest loop works、how to use the $apply() method

$digest loop:
> 一般digest周期都是自动触发的，也可以使用$apply进行手动触发
* $watch list

    {{name}} ang need to track the change, by adding a watch function to the $watch list.
    remember: For all UI elements that are bound to a $scope object, a $watch is added to the $watch list.
    *$watch lists* are resolved in the *$digest loop* through a process called *dirty checking*

    * dirty checking
    it checks whether a value has changed that hasn't yet been synchronized across the app,ang walks down the $watch lists.
    脏检查：无论值变不变，都会继续进入$digest loop

* $watch
    the $watch method on the $scope object sets up a dirty check on every call to $digest inside the ang event loop.
    The $watch function returns a deregistration function for the listener that we can call to *cancel Angular’s watch* on the value.

            ```
            var unregisterWatch =
            $scope.$watch('newUser.email', 
                function(newVal, oldVal) {
                if (newVal === oldVal) return; // on init
            }, true); // 第三个参数 true，表示检测的newUser.email是个对象，比较的是对象的值而不是引用
            // ... 
            // *如何停掉一个$watch?----调用 unregisterWatch，因为$scope.$watch会返回一个停止注册的函数*
            // later, we can unregister this watcher 
            // by calling
            unregisterWatch();
            ```

* $apply()
    $scope的函数，表示强制执行一次 $digest loop,除非正在循环 抛出异常，表示不需要在此使用apply
    当调用$digest的时候，只触发当前作用域和其子作用域上的监控
    当调用$apply的时候，会触发作用域树上的所有监控


* 有哪些措施可以改善Angular 性能
    1. 官方提倡的，关闭debug,$compileProvider
        `myApp.config(function ($compileProvider) { $compileProvider.debugInfoEnabled(false);})`
    2. 使用一次绑定表达式即{{::yourModel}}
    3. angular-bindonce 例如：bo-text代替ng-text,前者只计算一次，不加watch
    3. 减少watcher数量

        `ng-repeat="person in Persons track by $id"`

* filter
    * `<p>{{now | date : 'yyyy-MM-dd'}}</p>`
    * `$filter('过滤器名称')(需要过滤的对象, 参数1, 参数2,...)$filter('date')(now, 'yyyy-MM-dd hh:mm:ss')`

* factory: 把 service 的方法和数据放在一个对象里，并返回这个对象
    ```
    app.factory('FooService', function(){
        return {
            target: 'factory',
            sayHello: function(){
                return 'hello ' + this.target;
            }
        }
    });
    ```
* service: 通过构造函数方式创建 service，返回一个实例化对象
    ```
    app.service('FooService', function(){
        var self = this;
        this.target = 'service';
        this.sayHello = function(){
            return 'hello ' + self.target;
        }
    });
    ```
* provider: 创建一个可通过 config 配置的 service，$get 中返回的，就是用 factory 创建 service 的内容

* ui.router: 基于 state （状态）的
    > 使用 ui.router 能够定义有明确父子关系的路由，并通过 ui-view 指令将子路由模版插入到父路由模板的 <div ui-view></div> 中去，从而实现视图嵌套

> 单向数据绑定 $scope -> view : {{}} 或 <span ng-bind="val"></span>
> 双向数据绑定 $scope -> view -> $scopw : <input type='text' ng-model='val'/>


* controller 之间的通信
    1. 作用域继承（如dialog）
    2. 注入服务。将需要的数据注册为一个service或factor，需要的时候inject
    3. 事件机制。ang提供了冒泡和隧道机制
        `$scope.$emit('someEvent', {})` 从作用域往上发送事件
        `$rootScope.$broadcast('someEvent',{})` 从作用域往下
        `$rootScope.$on('someEvent',function(event, data){})` 监听