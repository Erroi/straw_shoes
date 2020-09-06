import math
import copy

def dichotomous(dictionary, wordToFind):
  if len(dictionary) == 0:
    return False;
  # if wordToFind:
  #   return False;

  left = 0;
  right = len(dictionary) - 1;
  while(left <= right):
    middle = math.floor((right + left) / 2);
    if (dictionary[middle] == wordToFind):
      print(middle)
    if (dictionary[middle] > wordToFind):
      right = middle - 1;
    else:
      left = middle + 1;
  return False

list = [1,3,5,7,9,24,26,39,48,52]
dichotomous(list, 3)


# 归纳法
# 证明 k=1时成立；如果n=k-1时成立，那么n为k的时候也成立
def prove(k, result):
  if k == 1:
    if math.pow(2, 1) - 1 == 1:
      result.wheatNum = 1;
      result.totalNum = 1;
      return True
    else:
      return False
  else:
    boolk = prove(k -1, result)
    result.wheatNum *= 2
    result.totalNum += result.wheatNum
    if math.pow(2, k) - 1 == result.totalNum:
      return True
    return boolk


# 总额10元，有多少中组合，1，2，5，10
# num = [1,2,5,10]
# def pay(total, result = [], allResult=[]):
#   if (total == 10):
#     allResult.append(result)
#   else:
#     for i in num:
#       newResult = copy.copy(result)
#       newResult.append(i)
#       pay(total + i, newResult, allResult)
#   return allResult

# pay(0)

rewards = [1,2,5,10];
def get(totalReward, result, allResult=[]):
  if (totalReward == 0):
    # print(result)
    allResult.append(result)
    return
  elif totalReward < 0:
    return
  else:
    for i in rewards:
      newResult = copy.copy(result)
      newResult.append(i)
      get(totalReward - i, newResult, allResult)
  return allResult

r = get(10, [], [])
print(r)

def decrypt(char, password=None, all_results=[]):
  if password is None:
    password = []
  if len(password) == 4:
    all_results.append(password)
    return
  for i in range(len(char)):
    new_password = copy.copy(password)
    new_password.append(char[i])
    rest_char = copy.copy(char)
    decrypt(rest_char, new_password)

  return all_results

pwd_char = ['a', 'b', 'c', 'd', 'e']
allPwd = decrypt(pwd_char)
print(allPwd)

# 一个整数可以被分解多个整数乘积。为整数n，找到所有可能的解
def prod_factors(num, result=[]):
  if num == 1:
    print('x'.join([str(_) for _ in result]))
    if 1 not in result:
      result.append(1)
      print('x'.join([str(_) for _ in result]))
    return
  elif num < 0:
    return
  else:
    for i in range(1, num+1):
      if (i == 1 and i not in result) or (i != 1 and num % i == 0):
        newresult = copy.copy(result)
        newresult.append(i)
        prod_factors(round(num/i), newresult)

prod_factors(8)
