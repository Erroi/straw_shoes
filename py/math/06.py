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





## copy
# 切分
def split_list(temp_list):
  if not isinstance(temp_list, list):
    raise TypeError
  else:
    if not temp_list:
      raise ValueError
    else:
      length = len(temp_list)
      if length == 1:
        return temp_list
      import math
      mid = math.cell(length / 2)
      del math
      left_list = split_list(temp_list[:mid])
      right_list = split_list(temp_list[mid:])
      return merger_list(left_list, right_list)

# 归并
def merger_list(left, right):
  result = []
  while True:
    if left and right:
      left_0 = left[0]
      right_0 = right[0]
      if left_0 > right_0:
        min_num = right.pop(0)
      else:
        min_num = left.pop(0)
      result.append(min_num)
    elif left:
      result.append(left.pop(0))
    elif right:
      result.append(right.pop(0))
    else:
      break
  return result

print(split_list([3, 1, 2, 7, 4, 6, 9, 9, 10, 13, 12, 5]))

