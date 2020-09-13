# 迭代法
## 就是不断用旧的变量值，递推计算新的变量值。

# 64格麦子数是前一格的一倍
def getNumberOfWheat(grid):
  sum = 0
  numberOfWheatInGrid = 0

  numberOfWheatInGrid = 1
  sum += numberOfWheatInGrid

  for i in range(2, grid):
    numberOfWheatInGrid *= 2
    sum += numberOfWheatInGrid
  
  return sum

def getSquareRoot(n, deltaThreshold, maxTry):
  if not isinstance(n, int):
    print('TypeError')
  if n <= 1:
    return -1.0
  min, max = 1.0, n
  for i in range(1, maxTry):
    middle = min + (max - min)/2
    square = middle * middle
    delta = abs((square/n) - 1)
    if delta <= deltaThreshold:
      return middle
    else:
      if square > n:
        max = middle
      else:
        min = middle
    return -2.0

if __name__ == '__main__':
  num = 10
  squareRoot = getSquareRoot(num, 0.0000001, 100)

  if squareRoot == -1.0:
    print('please input number greater 1')
  elif squareRoot == -2.0:
    print('cannot find square root')
  else:
    print('{} square root is {}'.format(num, squareRoot))
