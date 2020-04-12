import mysql.connector
import traceback

db = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="09090909",
  database="wz",
  auth_plugin="caching_sha2_password"
)

cursor = db.cursor()

# 删除
sql4 = "DELETE FROM player WHERE player_name = %s;"
val4 = ('约翰-科林斯',)
cursor.execute(sql4, val4)
db.commit()
print(cursor.rowcount, '记录删除成功')

# 插入新成员
sql = "INSERT INTO player(team_id, player_name, height) VALUES (%s, %s, %s);"
val = (1003, '约翰-科林斯', 2.08)
cursor.execute(sql, val)
db.commit()
print(cursor.rowcount, '记录插入成功。')

# 查询身高大于等于2.08的球员
sql2 = 'SELECT player_id,player_name, height FROM player WHERE height>=2.08;'
cursor.execute(sql2)
data = cursor.fetchall()
for each_player in data:
  print(each_player)

# 修改
try:
  sql3 = "UPDATE player SET height = %s WHERE player_name = %s;"
  val3 = (2.09, "约翰-科林斯")
  cursor.execute(sql3, val3)
  db.commit()
  print(cursor.rowcount, '记录被修改')
except Exception as e:
  traceback.print_exc() # 打印异常信息
  db.rollback() # 回滚
finally:
  db.close()


cursor.close()
db.close()
