# 文件相关操作
file1 = open('name.txt', 'w')  # 写入
file1.write('诸葛孔明')
file1.close()

file2 = open('name.txt')
context = file2.read()
print(context)
file2.close()

file3 = open('name.txt','a')  # a 追加写入
file3.write('\n刘备')
file3.close()

file4 = open('name.txt')
print(file4.readline())

file5 = open('name.txt')
for line in file5.readlines():
  print(line)
  print('=====')

file6 = open('name.txt')
print(file6.tell()) # 读取指针所在当前位置 0
file6.read(1)
print(file6.tell()) # 1
file6.seek(0) # 返回到指针0位置
print(file6.tell())


# open() 打开文件
# read() 输入
# readline() 输入一行
# readlines() 逐行输入
# seek(a,b) 文件内移动 两个参数 第一个参数a代表偏移位置，第二个参数b为‘0’表示从文件开头偏移 ‘1’表示从当前位置偏移 ‘2’从文件结尾
# write() 输出
# tell() 指针
# close() 关闭文件


