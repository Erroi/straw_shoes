# 动态规划
## 和排列组合等穷举法相比，动态规划法关注某种最优解。
## 如果一个问题无需求出所有可能的解，而是要找到满足一定条件的最优解，那么可以使用动态规划降低求解的工作量。

## 假设有三种面额的钱币，2元、3元、7元。为了凑满100元的总金额，有三种选择：
# 第一种，总和98元，加上1枚2元。如果凑到98元的最少币数是x1，那么增加一枚2元后就是 （x1 + 1）枚。
# 第二种，总和97元，加上1枚3元。如果凑到97元的最少币数是x2，那么增加一枚3元后就是 （x2 + 1）枚。
# 第三种，总和93元，加上1枚7元。如果凑到93元的最少币数是x3，那么增加一枚7元后就是（x3 + 1）枚。
# 比较这三种情况的钱币总和，取最小的那个就是最少钱币数。

#？对于总金额固定、找出最少钱币数的题目，用循环或者递归的方式如何编码？
# 递归
import sys

def least_bills_recursion(total):
  if total == 0:
    return 0
  if total < 0:
    return sys.maxsize
  min_bills = min(1 + least_bills_recursion(total-2),1 + least_bills_recursion(total - 3), 1 + least_bills_recursion(total - 7))
  # print(min_bills)
  return min_bills

# 循环：
def least_bills_iteration(total):
  current = 0
  dp = [0] * (total + 1)
  dp[0] = 0
  dp[1] = 0
  dp[2] = 1
  dp[3] = 1
  dp[7] = 1
  for i in range(3, total+1, 1):
    if i >= 7:
      dp[i] = min(dp[i-2], dp[i-3], dp[i-7]) + 1
    elif i >= 3 and i < 7:
      dp[i] = min(dp[i-2], dp[i-3]) + 1
    else:
      dp[i] = dp[i-2] + 1
    print(i, dp[i])
  return dp[total]

# counts = least_bills_recursion(10)
counts_iterator = least_bills_iteration(10)
print(counts_iterator)

  