  #### 使用 Python 对 DBMS 进行操作：
  # 1. 引入 API 模块；
  # 2. 与数据库建立连接；
  # 3. 执行 SQL 语句；
  # 4. 关闭数据库连接。

  # pip3 install mysql-connector-python

import mysql.connector
db = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="09090909",
  database='wz',
  auth_plugin='caching_sha2_password'
)

cursor = db.cursor()  # 创建游标，操作数据库中的数据
cursor.execute('SELECT VERSION()')
data = cursor.fetchone()
print('MySQL版本：%s ' % data)  # MySQL版本：8.0.19
cursor.close()
db.close()  # 关闭数据库连接

# db.begin() 开启事务
# db.commit() 对事务进行提交
# db.rollback() 对事务进行回滚

# 创建游标后，对数据库中的数据进行操作：
# cursor.execute(query_sql)  执行数据库查询
# cursor.fetchone() 读取数据集中的一条数据
# cursor.fetchall() 取数据集中的所有行，返回一个元祖 tuples 类型
# cursor.fetchmany(n) 取数据集中的多条数据，同样返回一个元祖 tuples；
# cursor.rowcount 返回查询结果集中的行数，未查询到或未开始返回 -1；
# cursor.close()  关闭游标


