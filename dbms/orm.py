# python 另一种方式与 Mysql 进行交互： ORM框架
# 持久化层：在业务逻辑层和数据库层起到了衔接作用，他可以将内存中的数据模型转化为存储模型，或者将存储模型转化为内存中的数据模型。
# 业务逻辑层：业务对象（对象、属性、继承）--》 持久化层（ORM--》ODBC/JDBC）--》 数据库层（RDBMS：表、字段、索引））
# ORM(Object Relation Mapping) 对象关系映射:她是RDBMS和业务实体对象之间的一个映射，可以吧底层的RDBMS封装成业务实体对象，提供给业务逻辑使用。
from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import or_
from sqlalchemy import func


# 创建对象的基类：
Base = declarative_base()
# 定义Player对象：
class Player(Base):
  # 表名
  __tablename__ = 'player'

  # 表的结构：
  player_id = Column(Integer, primary_key=True, autoincrement=True)
  team_id = Column(Integer)
  player_name = Column(String(255))
  height = Column(Float(3,2))

# 初始化数据库连接
engine = create_engine('mysql+mysqlconnector://root:09090909@localhost:3306/wz')
# 创建 DBSession 类型：
DBSession = sessionmaker(bind=engine)

# 创建 session 对象：
session = DBSession()
# 创建Player对象：
new_player = Player(team_id=1003, player_name="约翰-科林斯", height=2.08)
# 增
# 添加 到session
session.add(new_player)
# 提交即保存到数据库
session.commit()

# 查
# to_dict() 方法到Base类中
def to_dict(self):
  return {
    c.name: getattr(self, c.name, None) for c in self.__table__.columns
  }
Base.to_dict = to_dict
# 查询身高 >= 2.08m 的球员
rows = session.query(Player).filter(Player.height >= 2.08).all()
# rows = session.query(Player).filter(Player.height >= 2.08, Player.height <= 2.10).all()
# rows = session.query(Player).filter(or_(Player.height >= 2.08, Player.height <= 2.10)).all()
# rows = session.query(Player.team_id, func.count(Player.player_id)).group_by(Player.team_id).having(func.count(Player.player_id) > 5).order_by(func.count(Player.player_id).asc()).all()
print([row.to_dict() for row in rows])

# 改
row = session.query(Player).filter(Player.player_name=='索恩-马克').first()
row.height = 2.17
session.commit()


# 删
row = session.query(Player).filter(Player.player_name=='约翰-科林斯').first()
session.delete(row)
session.commit()

# 关闭session
session.close()



# SQLAlchemy中，采用 Column 对字段进行定义，常用的数据类型：
#   Integer 整数型
#   Float   浮点类型
#   Decimal 定点类型
#   Boolean 布尔类型
#   Date    datetime.date 日期类型
#   Time    datetime.time 时间类型
#   String  字符串类型，使用时需要指定长度，区别于 Text 类型
#   Text    文本类型

#   除了指定 Column 的数据类型外，也可以指定 Column 的参数，对对象创建列约束
#   default       默认值
#   primary_key   是否为主键
#   unique        是否唯一
#   autoincrement 是否自动增长