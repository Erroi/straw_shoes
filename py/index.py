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




