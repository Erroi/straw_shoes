# 函数递归
## 有时虽然迭代法的思想是可行的，但是如果用循环来实现，恐怕要保存好多中间状态、对应的变量。
## 而递归中，每次嵌套调用都会让函数体生成自己的局部变量，正好可以用来保存不同状态下的数值，从而省去了大量的中间变量的操作

## 抽象递推关系：
# 1. 假设 n=k-1 的时候，问题已经解决（已找到解）。那么只要求解 n=k 的时候，问题如何解决。
# 2. 初始状态，就是 n=1 的时候，问题如何解。

import copy

def prod_factors(num, result=[]):
  if num == 1:
    if 1 not in result:
      result.append(1)
    print('x'.join([str(_) for _ in result]))
  elif num < 0:
    return
  else:
    for i in range(1, num +1):
      if (i == 1 and i not in result) or (i != 1 and num % i == 0):
        newResult = copy.copy(result)
        newResult.append(i)
        prod_factors(num/i, newResult)
