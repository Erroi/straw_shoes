##### controllerAs
> 使用

    ```
    .directive('countCard', function() {
        return {
            restrict: 'E',
            scope:{
                icon: '@'
            },
            bindToController: true, // 将icon属性绑定到自身而不是scope时
            templateUrl: '',
            controllerAs: 'card',
            controller: ['$scope', function($scope) {
                var vm = this;  // 相当于 vm = $scope.card
            }]
        }
    })
    ```

> 做什么的

    angular把 控制器的实例(controller function) 作为 $scope上以 card为名称的对象属性上了： $scope.card = 此func实例

> 源码
`locals.$scope[state.controllerAs] = controllerInstance`

> why
scope 是基于原型进行继承的，比如说当我们查找一个user对象时，ang会先查找当前scope有没有user，没有则继续向上，直到rootscope。
而当设置了 controllerAs，则控制器作为[card]挂载到scope时，user也就是 ctrl.user, 就不会一直向上查找。
