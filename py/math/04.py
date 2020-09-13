# 数学归纳法
## * 1.证明基本情况（n = 1）时成立。2. 假设 n = k -1 成立，再证明 n = k 也是成立的
# 递归
## 假设第二步转为函数的递归（嵌套）调用，直到被调用的函数回退到 n = 1 的情况，然后，被调用的函数逐步返回k-1时命题成立。
## 只要数学归纳证明的逻辑时对的，递归调用的逻辑就是对的，没有必要纠结递归函数是如何嵌套调用和返回的！！

class result(object):
  wheatNum = 0
  wheatTotalNum = 0

class getWheatTotalNum(object):
  # 使用递归嵌套，进行数学归纳法证明
  # param: k -表示放到第几格  result -表示当前格子的麦粒数
  # return: boolean -放到第k格时，是否成立
  def prove(self, k, result):
    if k == 1:
      if (2 ** 1 - 1) == 1:
        result.wheatNum = 1
        result.wheatTotalNum = 1
        return True
      else:
        return False

    else:
      proveOfPreviousOne = self.prove(k-1, result)
      result.wheatNum *= 2
      result.wheatTotalNum += result.wheatNum
      proveOfCurrentOne = False
      if result.wheatTotalNum == (2 ** k -1):
        proveOfCurrentOne = True
        if (proveOfCurrentOne & proveOfPreviousOne):
          return True
        else:
          return False

if __name__ == '__main__':
  grid = 64
  result = result()
  g = getWheatTotalNum()
  print(g.prove(grid, result))
