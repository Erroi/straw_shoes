let hello: string = 'Hello haha'

// 原始类型
let bool: boolean = true
let num: number | undefined | null = 123
let str: string = 'abc'

// 数组
let arr1: number[] = [1,2,3]
let arr2: Array<number | string> = [1,2,3, '4']

// 元组: 一种特殊的数组，限定了 类型 和 个数
let tuple: [number, string] = [0, '1']

// 函数
let add = (x: number, y: number): number => x + y
let compute: (x: number, y: number) => number
compute = (a, b) => a + b

// 对象
let obj: {x: number, y: number} = {x: 1, y: 2}
obj.x = 4

// Symbol
let s1: symbol = Symbol()
let s2 = Symbol()
console.log(s1 === s2) // false

// undefined null
let un: undefined = undefined
let nu: null = null
num = undefined

// void 是一种操作符，可以让任何表达式返回 undefined
void 0;
// 没有任何返回值得函数
let noReturn = () => {}


// any
let x
x = 2
x = []

// never 永远不会有返回值的类型
let errFun = () => {
  throw new Error('error')
}


// 枚举：一组具有常量的集合
// 数字枚举
enum Role {
  Reporter = 1,
  Developer,
  Maintainer,
  Owner,
  Guest
}
console.log(Role.Reporter) // 1
console.log(Role[1]) // Reporter 反向映射

// 字符传枚举
enum Message {
  Success = '恭喜',
  Fail = '抱歉'
}

// 异构枚举
enum Answer {
  N,
  Y = 'Yes'
}
// 枚举成员的值定义后不可修改
// Role.Reporter = 5

// 枚举成员类型
enum Char {
  // const 常量枚举成员，在编译阶段计算出结果，以常量形式出现在运行环境
  a,
  b = Char.a,
  c = 1 +3,     // 0 0 4
  // computed 表达式枚举成员，不会计算会保留到执行阶段
  d = Math.random(),
  e = '234'.length
}

// 常量枚举： 编译后即被移除，没有值。
const enum Month {
  Jan,
  Feb,
  Mar
}
// 应用：枚举直接替换成常量，简洁代码
let month = [Month.Jan, Month.Feb, Month.Mar]

// 应用：做枚举类型使用
enum E {a, b}
enum F {a = 0, b = 1}
enum G {a = 'apple', b = 'banana'}

let e: E = 3
let f: F = 3

let e1: E.a = 1
let e2: E.b
let e3: E.a = 1
e1 === e3 // 相同的枚举成员才可以进行比较

let g1: G
let g2: G.a


// 接口：用来约束 对象、函数、类的结构和类型
interface List {
  id: number;
  name: string;
}
interface Result {
  data: List[]
}
function render(result: Result) {
  result.data.forEach((value) => {
    console.log(value)
  })
}
let result = {
  data: [
    {id: 1, name: 'A', sex: 'male'},
    {id: 2, name: 'B'}
  ]
}
render(result)  // 1. 使用变量
render({
  data: [
    {id: 1, name: 'A', sex: 'male'},
    {id: 2, name: 'B'}
  ]
} as Result)  // 2. 使用类型断言，告诉编译器这个就是 Result，来绕过类型检查
render(<Result>{  // 断言的另一种写法
  data: [
    {id: 1, name: 'A', sex: 'male'},
    {id: 2, name: 'B'}
  ]
})

// 3. 使用 字符串索引签名,使List1支持多个属性
interface List1 {
  readonly id: number; // 只读
  name: string;
  age?: number;   // 可选
  [x: string]: any;
}

interface StringArray {
  [index: number]: string;
}
let chars1: StringArray = ['A', 'B']


// 定义函数
let add1: (x: number, y: number) => number

interface Add {
  (x: number, y: number): number
}

type add2 = (x: number, y: number) => number

let addfun: add2 = (a, b) => a + b // 使用

interface Lib {
  (): void;
  version: string;
  doSomething(): void;
}
function getLib() {
  let lib: Lib = (() => {}) as Lib;
  lib.version = '1.0'
  lib.doSomething = () => {}
  return lib;
}

function add3(x: number,z = 0, y?: number, ...rest: number[]): number {
  rest.reduce((a,b) => a + b)
  return y ? x + y : x;
}


// 类
class Dog {
  constructor(name: string) {
    this.name = name
  }
  name: string
  run() {}
  private pri() {}
  protected pro() {}
  readonly legs: number = 4
  static food: string = 'bones'
}
// 类成员的属性 都是实例属性，而不是原型属性；
// 类成员的方法 都是‘原型’方法；
console.log(Dog.prototype)  // {run: f, constructor: f}

let dog = new Dog('wangwang')
console.log(dog)  // {name: 'wangwang'}

// 类的继承
class Husky extends Dog {
  // 派生类的构造函数，必须包含 super 调用，
  constructor(name: string, color: string, public age: number) {
    super(name)  // 代表父类的实例,且要包含父类的参数
    this.color = color // 初始化的this，要在super之后调用
    // this.pri() 私有成员不能被子类调用
    this.pro()
  }
  color: string
}

// 类的修饰符，默认都是public
// 私有成员 只能被类的本身调用，不能被实例、子类调用
//      dog.pri()   private私有成员不能被实例调用
// 受保护成员只能在类或子类中调用，而不能在实例中调用
//      dog.pro()   protecte成员 不能实例中调用
// 只读属性 readonly 一定要初始化
// 静态成员 static 只能通过类名调用，不能子类中调用，不允许实例调用
console.log(Dog.food)
// dog.food 不予许实例调用
Husky.food // static 成员可以继承，子类类名可调用

// ***构造函数的参数也可以添加修饰符，作用是 将参数直接变成了实例的属性，就可以省略在类中的定义

// 抽象类 abstract：只能被继承，而不能被实例化的类
//                可以用于抽离出事务的共性，利于代码的复用和扩展，
abstract class Animal {
  eat() {
    console.log('eat')
  }
  // 抽象方法，知道会在子类中实现，就可以直接父类中定义，而不用实现
  abstract sleep(): void
}
// let animal = new Animal()  abstract class 不能被实例化
class Dog1 extends Animal {
  constructor(name: string) {
    super()
    this.name = name
  }
  name: string
  sleep(){}
}
let dog1 = new Dog1('wang')

// 抽象类 abstract：也可以用于多态：在父类中定义一个抽象方法，子类根据自身需要有不同的实现
class Cat extends Animal{
  sleep() {
    console.log('Cat sleep')
  }
}
let cat = new Cat();
let animals: Animal[] = [dog1, cat]
animals.forEach(i => i.sleep())

// 方法的链式调用
class WorkFlow {
  step1() {
    return this;
  }
  step2() {
    return this;
  }
}
new WorkFlow().step1().step2()

// 类与接口 接口：约束类的结构和类型
interface Human {
  // new (name: string): void 接口只能约束共有成员
  name: string;
  eat(): void;
}
// 类实现接口时用implements，必须实现接口的所有属性
class Asian implements Human {
  constructor(name: string) {
    this.name = name;
  }
  name: string
  eat() {}
}

// 接口的继承 （接口继承接口）
interface Man extends Human {
  run(): void
}
interface Child {
  cry(): void
}
interface Boy extends Man, Child {}
let boy: Boy = {    // 实例必须有 Man Child Boy的所有属性
  name: 'maodou',
  eat(){},
  run(){},
  cry(){}
}

// 接口继承类
class Auto {
  state = 1
}
interface AutoInterface extends Auto {

}
class C implements AutoInterface {
  state = 1
}
class Bus extends Auto implements AutoInterface {}




// 泛型：不预先确定的数据类型，具体的类型在使用的时候才能确定
// 用泛型定义函数 使得传入的参数 与 返回数据 具有相同类型
function log<T>(value: T): T{
  console.log(value);
  return value;
}
log<string[]>(['a'])
log(['a'])

// 用泛型定义函数类型
type Log = <T>(value: T) => T
let myLog: Log = log

interface Log1 {
  <T>(value: T): T
}

class Logd<T> {
  run(value: T) {
    return value
  }
}
let log1 = new Logd<number>()
log1.run(1)
let log2 = new Logd()
log2.run('1')

interface Length {
  length: number
}
function log4<T extends Length>(value: T): T {
  console.log(value, value.length)
  return value
}
log4([1])
log4('123')
log({length: 1})

let d = [1, null]

// 交叉类型 & 必须要包含所有属性
interface DogInterface{
  run(): void
}
interface CatInterface{
  jump(): void
}
let pet: DogInterface & CatInterface = {
  run() {},
  jump() {},
}

// 联合类型
let d1: string | number = 'j'

// keyof 任意一个
interface Obj {
  a: number,
  b: string
}
let key: keyof Obj
let value: Obj['a']

let obj5 = {
  a: 1,
  b: 2,
  c: 3
}
function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}

// 映射类型
interface Obj6 {
  a: string;
  b: number;
  c: boolean;
}
type ReadonlyObj = Readonly<Obj6>
// 内置接口
// typeof Readonly<T> = {
//   readonly [p in keyof T]: T[p]
// }
type PartialObj = Partial<Obj6>
type PickObj = Pick<Obj6, 'a' | 'b'>




