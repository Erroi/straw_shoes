/**
 * 工厂模式
 * 一个工厂提供一个创建对象的公共接口，通过一个工厂索要一个新的组件，而不是使用构造函数
 * 参考：http://huangtengfei.com/2015/09/factory-pattern/
 *  */

var vehicleFactory = (function(){
    var types = {};
    return {
        getVehicle: function(type, options) {
            var Vehicle = types[type];
            return (Vehicle && new Vehicle(options))
        },
        registerVehicle: function(type, Vehicle) {
            var proto = Vehicle.prototype;
            if (proto.drive && proto.breakDown){
                types[type] = Vehicle; // 注册
            }
        }
    }
})();

vehicleFactory.registerVehicle('car', Car)
vehicleFactory.registerVehicle('truck', Truck)

var car = vehicleFactory.getVehicle('car', {
    color: 'lime green',
    state: 'like new'
});

var truck = vehicleFactory.getVehicle('truck', {
    wheelSize: 'medium',
    color: 'yellow'
})
