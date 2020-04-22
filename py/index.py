# 基本数据类型： int  float   str   bool
type(8)
type('8')
type(True)

# 转换
int('8')
str(123)
bool(123)
bool(0)

# 序列：指它的成员都是有序排列，并且可以通过下标偏移量访问它的一个或几个成员。
#     字符串、列表、元组 都属于序列
# 序列的操作
'a' in 'name'     # True
'a' not in 'name' # False
'a' + 'b'         # ab
'name' * 3        # namenamename
'name'[0:3]       # nam

# 元组：唯一区别，存储的🈯️不可变更
(21) > (20)       # True
a = ((1, 4),(3, 9),(5, 4),(7, 8))
b = (4, 3)
len(list(filter(lambda x: x<b, a))) # list() 转化成序列

# 列表：区别 可增加或删除数据
a_list = ['abc', 'xyz']
a_list.append('X')
a_list.remove('xyz')

zodiac = '猴鸡够住数牛胡图龙设码洋'
year = int(input('请输入出生年份'))
print(zodiac[year % 12])

# if...elif...else...
# 循环语句：
# while...
# for... in...:
for cz in zodiac:
  print(cz)

for i in range(1,13):  # range(1,13) 取1 到 13的数；range(4) 0到4的值
  print(i)

for year in range(2000, 2018):
  print('%s 年的生肖是 %s'%(year, zodiac[year % 12]))

num = 5
while True:
  print(num)
  if num == 10:
    break     # break 终止循环，continue 终止当前等于10的后续代码 之间进入下一个为11的循环
  elif num == 5:
    continue
  num = num + 1

# 映射的类型：字典（包含哈希值和指向的对象）
{'哈希值': '对象'}
dict1 = {'length': 180, 'width': 80}
type(dict1)     # dict
# 增
dict1['z'] = 4
for each_key in dict1.keys():
  print('key为%d'%(each_key))

alist = []
for i in range(1,11):
  if(i % 2 == 0):
    alist.append( i * i)
print(alist)

alist1 = [i * i for i in range(1,11) if i % 2 == 0]
print(alist1)

z_num = {}
for i in zodiac:
  z_num[i] = 0

z_num1 = {i:0 for i in zodiac}


# 函数参数的一些写法
def func(a, b, c):
  print('a= %s' %a)

func(1, c=3)

# *other 表示其他非必须的参数，first为必传参数
def howlong(first, *other):
  print(1 + len(other))

howlong(123, 3,4)

var1 = 123
var2 = 34
def func():
  global var2 # 引用了全局变量 并改变全局变量
  var2 = 4 
  var1 = 456 # 局部变量
  print(var1)

func()


# 迭代器 # next() 取下一个值，也可以用for in 直接遍历下个值
list1 = [1,2,3,4]
it = iter(list1)
print( next(it) )

for i in range(10, 20, 0.5):
  print(i)

# yeild
def frange(start, stop, step):
  x = start
  while x < stop:
    yield x
    x += step

for i in frange(10, 20, 0.5):
  print(i)

# lambda
# def add(x,y): return x+y
lambda x,y: x+y

# 内置函数
list(filter(lambda x: x>2 ,list1))
list(map(lambda x:x+1 , list1))
list(map(lambda x,y: x+y, list1,list1))
from functools import reduce
reduce(lambda x,y: x+y, [2,2,3,4], 1)
# zip() 矩阵转换
for i in zip((1,2,3),(4,5,6)):
  print(i)  # (1,4) (2,5) (3,6)
dicta = {a: 'aa', b: 'bb'}
dictb = zip(dicta.values(), dicta.keys())
dict(print(dictb))  # {aa: 'a', bb: 'a'}

import time
# 装饰器
# 定义一个装饰器
def timmer(func):
  def wrapper():
    start_time = time.time()
    func()
    stop_time = time.time()
    print('runtime:%s s %s'%(stop_time - start_time), func.__name__)
  return wrapper

# 使用装饰器 相当于timmer(sleepfunc())
@timmer
def sleepfunc():
  time.sleep(3)



# 面向**对象**编程： 把一类的东西归类成一个对象 更符合人的思维
class Player():                   # 定义一个类
  def __init__(self, name, hp):
    self.name = name
    self.__hp = hp    # __为私有属性，只能通过自身方法修改
  def print_role(self):           # 定义一个类的方法
    print('%s: %s'%(self.name, self.hp))
  def updateHp(self, hp):
    self.__hp = hp
  
user1 = Player('tom', 100) # 类的实例化
user2 = Player('jerry', 90)
user1.print_role()
user2.print_role()
user2.name = 'aaaa'  # aaaa
user2.__hp = 2      # 90

# class 继承
class Monster():
  def __init__(self, hp=100):
    self.hp = hp
  def run(self):
    print('移动到摸个位置')

class Animals(Monster):
  def __init__(self, hp=10):
    super().__init__(hp)  # 触发父集的 self.hp = hp
  
a1 = Monster(200)
print(a1.hp)
print(a1.run())
a2 = Animals(1)
print(a2.hp)
print(a2.run())
type(a1) # <class '__main__.Monster'>
type(a2)  # <class '__main__.Animals'>
isinstance('123', object)  # True
isinstance(123, object)    # True

