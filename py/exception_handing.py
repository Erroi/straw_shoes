try:
  year = int(input('input year:'))
except ValueError as e:
  print('青输入数字 %s'%e)

a=123
try:
  a.append()
except (ValueError, AttributeError, KeyError, ZeroDivisionError):
  print('no attribute append')

try:
  print(1/'a')
except Exception as e:    # Exception包含所以的错误类型
  print(e)
finally:
  print('done')

