# pdb 调试
# python3 -m pdb xxx.py
# https://docs.python.org/3/library/pdb.html#module-pdb
a = 1
b = 2
import pdb
pdb.set_trace()
c = 3
print(a+b+c)
