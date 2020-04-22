import re
def find_item(hero):
  with open('saguo.txt', encoding='GB18030') as f:
    data = f.read().replace('\n', '')
    name_num = re.findall(hero, data)

  return len(name_num)

name_dict = {}
with open('name.txt') as f:
  for line in f:
    names = line.split('|')
    for n in names:
      name_num = find_item(n)
      name_dict[n] = name_num

name_sorted = sorted(name_dict.items(), key=lambda item: item[1], reverse=True)
print(name_sorted[0:10])

# with 上下文管理器
# 异常会自动捕获 


