# 递归下：分而治之，从归并排序到 MapReduce
# 归并排序算法：每次把数列进行二等分，直到唯一的数字，也就是最基本的有序数列。然后从这些最基本的有序数列开始，
# 亮亮合并有序的数列，直到所有的数字都参与了归并排序。
rawList = {7,6,2,4,1,9,3,8,0,5}

import math

def merge_sort(to_sort):
  if to_sort == null:
    return;
  if len(to_sort) == 1:
    return to_sort
  mid = math.floor(len(to_sort) / 2)
  left = to_sort[:mid]
  right = to_sort[mid:]

  left = merge_sort(left)
  right = merge_sort(right)

  merged = merge(left, right)
  return merged

#*
# 合并两个已经排序完毕的数组
# *#
def merge(a, b):
  if a == null or b == null:
    return 0
  c = []
  ai = 0
  bi = 0
  mi = 0
  while(ai < len(a) and bi < len(b)):
    if a[ai] <= b[bi]:
      c[mi] = a[ai]
      ai += ai
    else:
      c[mi] = b[bi]
      bi += bi
    mi += mi
  
  if ai < len(a):
    for i in a:
      c.append(a[ai:])
    #*
    # 将某个数组内剩余的数字放入合并后的数组中
    # for (int i = ai; i < a.length; i++) {
    #   c[mi] = a[i]
    #   mi ++;
    # }
    # #
  else:
    for i in b:
      c.append(b[bi:])
  return c


##
# 田忌赛马 找出所有可能出战的马匹顺序
# horses 目前还剩多少马没有出战，
# result 保存当前已经出战的马匹顺序
# ##
def permutate(horses, result):
  if (len(horses) == 0):
    return result
  for i in horses:
    new_result = result.copy()
    new_result.append(i)
    rest_horses = horses.copy()
    rest_horses.remove(i)
    permutate(rest_horses, new_result)


##
# 排列：每次传入嵌套函数的剩余元素，不再是所有未选择元素，而是出现在当前被选元素之后的那些。
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
