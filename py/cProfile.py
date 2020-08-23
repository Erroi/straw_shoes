# cProfile 性能分析
# python3 -m cProfile xxx.py

def fib(n):
  if n == 0:
    return 0
  elif n == 1:
    return 1
  else:
    return fib(n-1) + fib(n-2)

def fib_seq(n):
  res = []
  if n > 0:
    res.extend(fib_seq(n-1))
  res.append(fib(n))
  return res

fib_seq(30)

# import cProfile
# cProfile.run('fib_seq(30)')

# 7049123/31    2.551    0.000    2.551    0.082 cProfile.py:3(fib)
# 第二行的函数 fib()，它被调用了 700 多万次, 那就可以用字典来保存计算过的结果，防止重复

def memoize(f):
  memo = {}
  def helper(x):
    if x not in memo:
      memo[x] = f(x)
    return memo[x]
  return helper

@memoize
def fib(n):
  if n == 0:
    return 0
  elif n == 1:
    return 1
  else:
    return fib(n-1) + fib(n-2)

def fib_seq(n):
  res = []
  if n > 0:
    res.extend(fib_seq(n-1))
  res.append(fib(n))
  return res

fib_seq(30)

# 31    0.000    0.000    0.000    0.000 cProfile.py:35(fib)
