# 组合：
## 组合是不考虑每个元素出现的顺序。
# m取值的组合之全集合，就是全组合
# 例如对于集合{1, 2, 3}而言，全组合就是{空集, {1}, {2}, {3}, {1, 2}, {1,3} {2, 3}, {1, 2, 3}}。
# 1. n个元素里取出m个的组合（n个里取m个的排列数量，除以m个全排列的数量）（n! / (n-m)! / m!）
# 2. 对于全组合而言，可能性为 2^n 种， 如，n=3的时候，全组合包括了 8 种情况。

# 组合：每次传入嵌套函数的剩余元素，不再是所有未选择元素，而是出现在当前被选元素之后的那些。
# teams-目前还剩多少队伍没有参与组合，result-保存当前已经组合的队伍
# m 要挑选的个数
# ##  
def combine(teams, result, m):
  if len(result) == m:
    return result
  for i in teams:
    newResult = result.copy()
    newResult.append(teams[i])
    rest_teams = teams[i:]
    combine(rest_teams, newResult, m)