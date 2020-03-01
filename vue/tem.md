#### VUE
> vue 使用了基于HTML的模板语法，声明试的将DOM绑定至底层VUE实例的数据。
> 在底层的实现上，VUE将模板编译成虚拟DOM渲染函数。结合响应系统，Vue能够智能的计算出最少需要重新渲染多少组件，并把DOM操作次数减到最小。

> 渲染函数

      ```
      Vue.component('anchored-heading', {
        render: function (createElement) {
          return createElement(
            'h' + this.level,  // 标签名称
            this.$slots.default  //子节点数组, 如‘hello world’...这些都被存储在组件实例中的 $slots.default中
          )
        },
        props: {
          level: {
            type: Number,
            required: true
          }
        }
      })
      ```

> 虚拟DOM
> VUE 通过创建一个**虚拟DOM**追踪如何改变真实DOM
  `return createElement('h1', this.blogTitle)`
  > createElement返回的不是一个实际的DOM，返回的是一段描述信息，告诉vue页面上需要渲染什么样的节点，这段节点描述则称之为虚拟节点（virtual node）。vue建立起来的整个VNode树 称为虚拟Dom。


> VUE实例
> 每个vue应用都是通过用 Vue函数创建一个新的Vue实例开始的,由 根Vue实例，以及可选的可嵌套的组件树组成。
  `var vm = new Vue({})`


#### 模板语法
* 单向绑定：{{}} v-bind
* v-once
* v-html
* attribute应该使用v-bind
  `<div v-bind:id="'list' + id" v-bind:disabled=''></div>`
* js表达式 单个表达式
  `{{ok ? 'yes' : 'no‘}}{{message.split(' ').reverse().json()}}`
* 指令
  `<div v-if="seen"></div>`
* 参数 href是参数，告知v-bind指令将href与表达式url的值绑定。
  `<a v-bind:href="url">...</a> 缩写：<a :href="url"></a>`
* v-on指令用于监听dom事件
  `<a v-on:click="doSomething">...</a> 缩写：<a @click="doSomething"></a>`
* 动态指令
  `<a v-on:[eventName]="doSomething">...</a>`
* 修饰符 . 指出一个指令应该以特殊的方式绑定, 对于触发的事件调用 event.preventDefault()
  `<form v-on:submit.prevent="doSomething"></form>`
* 计算属性缓存 vs 方法： 计算属性是基于它们的响应式依赖进行缓存的；每当触发重新渲染时，调用方法将总会再次执行函数
  `compute:{reversedFn:function(){}}`
  `methods:{reversedFn:function(){}}`

* 监听属性 watch
  `watch:{firstName: function(val){}}`
* 计算属性默认只有getter，but也可以提供setter
  `compute:{fullname:{get: function(){}, set: function(){}}}`

* v-model 双向数据绑定,及修饰符 .lazy .number .trim
  `<input v-model.lazy='msg'>`

* 子组件
  > 组件通信： props
  ```
  Vue.component('button-counter', {
    props: ['title'],       // 通过prop向子组件传递数据
    data: function() {      // data 必须是一个函数，因为每个实例可以维护一份被返回的数据
      return {
        count: 0
      }
    },
    template: '<button v-on:click="count++">{{title}}</button>'
  })
  ```
  > 组件通信： v-on监听子事件 子组件$emit('eventName')
  ```
  <button-counter v-on:enlarge-text="postFontSize += $event">
  ```
  ```
  <button v-on:click="$emit('enlarge-text', 0.2)">
  Enlarge text
  </button>
  ```
* slot插槽<slot></slot>


##### 响应式原理
* VUE最独特的特性之一：响应式系统。
> 数据模型仅仅是普通的 Js对象，当修改它时，视图会自动更新
当一个普通的js对象传入VUE实例作为data选项，Vue将遍历此对象的所有属性，使用**Object.defineProperty**把这些数据属性全部转换为**getter/setter**。
  ```
  Object.defineProperty(o, 'b', {
    get: function() {return bValue},
    set: function(newValue) {bValue = newValue}
  })
  ```
这些getter/setter在内部可以让 VUE 能够追踪依赖，在属性被访问和修改时通知变更。
每个组件实例对应一个watch实例，把接触过的数据属性记录为依赖，当依赖项的setter触发时，会通知watcher，从而使他关联的组件重新渲染。

data[getter,setter]  ----collect as dependency--->  Watcher  ---re-render-->   Component Render Function  ----render---> virtual DOM Tree

> 对于已经创建的实例，Vue可以使用.set或.$set方法嵌套对象添加响应式属性。
`Vue.set(vm.someData, 'b', 2)` 

* vue更新DOM是**异步**执行的。使用promise.then\MutationObserver 和setImmediate或setTimeout(,0).
当侦听到数据变化，Vue将开启一个队列，缓冲所有数据变更，再下一个事件循环tick中，vue刷新队列并执行实际工作。

既然是异步的，那怎么确保取到变化后的值呢？
`vm.$nextTick(function(){this.$el.textContext})`