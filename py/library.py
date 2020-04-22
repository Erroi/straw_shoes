# 日常应用比较广泛的模块：
# 1. 文字处理的 re
# 2. 日期类型的time datetime
# 3. 数字和数字类型的 math、random
# 4. 文件和目录访问的 pathlib os.path
# 5. 数据压缩和归档的 tarfile
# 6. 通用操作系统的os logging argparse
# 7. 多线程 threading queue
# 8. Internet数据处理的 base64 json urllib
# 9. 结构化标记处理工具的 html xml
# 10. 开发工具的unitest
# 11. 调试工具的 timeit
# 12. 软件包发布的 venv
# 13. 运行服务的 __main__

import re
p = re.compile('ca*t')
print(p.match('caaaat'))

p1 = re.compile('(\d+)-(\d+)-(\d+)')
print(p1.match('2018-05-10').group(2))  # 05
print(p1.match('2018-05-10').groups())   # ('2015', '05', '10')

print(p1.search('aa2018-05-10bb')) # re.Match object; span=(2, 12), match='2018-05-10'>
phone = '123-456-789 # 这是电话号码'
re.sub(r'#.*$', '', phone)  # 替换 123-456-789

import time
time.time()
time.localtime()
time.strftime('%y-%m-%d %H:%m:')

import os
print(os.path.abspath('.'))


