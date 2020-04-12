##### 
> SQL 数据查询语言
> DBMS（ 数据库管理软件 DataBase management system）： Oracle、MySQL、SQL server、PostgreSQL、DB2、MongoDB

* RDBMS 关系型数据库
> 建立在关系模型基础上的数据库，SQL 就是关系型数据库的查询语言。

* NoSQL 泛指非关系型数据库，包括 键值型数据库（Redis）、文档型（MongoDB）

> 关键字的查询顺序不能颠倒：
`SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY...`
> SELECT语句的执行顺序
`FROM > WHERE > GROUP BY > HAVING > ORDER BY > LIMIT`

  ```
SELECT DISTINCT player_id, player_name, count(*) as num #顺序5
FROM player JOIN team ON player.team_id = team.team_id #顺序1
WHERE height > 1.80 #顺序2
GROUP BY player.team_id #顺序3
HAVING num > 2 #顺序4
ORDER BY num DESC #顺序6
LIMIT 2 #顺序7
  ```

> 筛选
* 比较运算符
    = 、
    不等于：<> 或 !=、 
    <  
    小于等于：<= 或 !> 
    大于： >  `SELECT name, hp_max FROM heros WHERE hp_max > 6000;`
    大于等于：>= 或 !<  
    不小于：!<  
    在两者之间：BETWEEN ... AND ...  `SELECT name,hp_max FROM heros WHERE hp_max BETWEEN 5399 AND 6811;`
    为空值：IS NULL  `SELECT name, hp_max FROM heros WHERE hp_max IS NULL;`

* 逻辑运算符
> 优先级 () > AND > OR

    并且：AND  `SELECT name, hp_max,mp_max FROM heros WHERE hp_max > 6000 AND mp_max > 1700 ORDER BY (hp_max+mp_max) DESC;`
    或者：OR
    在指定条件范围内：IN
    非（否定）：NOT

```
SQL：
SELECT name, role_main, role_assist, hp_max, mp_max, birthdate
FROM heros 
WHERE (role_main IN ('法师', '射手') OR role_assist IN ('法师', '射手')) 
AND DATE(birthdate) NOT BETWEEN '2016-01-01' AND '2017-01-01'
ORDER BY (hp_max + mp_max) DESC
```

* 通配符过滤 LIKE

  零个或多个：%   `SELECT name FROM heros WHERE name LIKE '%太%'`
  一个字符：_     `SELECT name FROM heros WHERE name LIKE '_%太%'`

* SQL内置函数

  1. 算术函数

    ABS() : 取绝对值；`SELECT ABS(-2);`
    MOD() : 取余；    `SELECT MOD(101, 3)`
    ROUND() : 四舍五入为指定的小数位数，需要两个参数，分别为字段名称、小数位数；`SELECT ROUND(37.25, 1);`

    `SELECT * FROM heros WHERE DATE(birthdate)>'2016-10-01'`

  2. 字符串函数

    CONCAT() : 拼接
    LENGTH() : 长度，一个汉字为三个字符，一个数字或字母为一个字符 `SELECT LENGTH('你好');  6`
    CHAR_LENGTH() : 汉字、字母、数字为一个字符  `SELECT CHAR_LENGTH('你好');  2`
    LOWER() : 转化为小写  `SELECT LOWER('ABC'); abc`
    UPPER() : 转为大写  `SELECT UPPER('abc');  ABC`
    REPLACE() : 替换 `SELECT REPLACE('fabcd', 'abc', 123);  f123d`
    SUBSTRING() : 截取 `SELECT SUBSTRING('fabcd', 1, 3);  fab`

  3. 日期函数

    CURRENT_DATE(): `SELECT CURRENT_DATE();  2019-04-03`
    CURRENT_TIME(): `SELECT CURRENT_TIME();  21:26:34`
    CURRENT_TIMESTAMP(): `SELECT CURRENT_TIMESTAMP();  2019-04-03 21:26:34`
    EXTRACT():   `SELECT EXTRACT(YEAR FROM '2019-04-03');  2019`
    DATE():   `SELECT DATE('2019-04-01 12:00:05')`
    YEAR():
    MONTH():
    DAY():
    HOUR():
    MINUTE():
    SECOND():

  4. 转换函数: 转换数据之间的类型

    CAST():   `SELECT CAST(123.123 AS DECIMAL(8,2));  123.12`
    COALESCE(): 返回第一个非空值   `SELECT COALESCE(null, 1,2);   1`

    > CAST 函数在转换数据类型的时候，不会四舍五入，如果原数值有小数，那么转换为整数类型的时候就会报错。不过你可以指定转化的小数类型，在 MySQL 和 SQL Server 中，你可以用DECIMAL(a,b)来指定，其中 a 代表整数部分和小数部分加起来最大的位数，b 代表小数位数，比如DECIMAL(8,2)代表的是精度为 8 位（整数加小数位数最多为 8 位），小数位数为 2 位的数据类型。所以SELECT CAST(123.123 AS DECIMAL(8,2))的转换结果为 123.12。

    `SELECT name, EXTRACT(YEAR FROM birthdate) AS birthdate FROM heros WHERE birthdate is NOT NULL;`
    `SELECT name, YEAR(birthdate) AS birthdate FROM heros WHERE birthdate is NOT NULL;`
    `SELECT CHAR_LENGTH(name), name FROM heros;`
    `SELECT MAX(hp_max) FROM heros`
    `SELECT name, ROUND(attack_growth,1) FROM heros;`

  5. 聚集函数
  > 对一组数据进行汇总的函数
      COUNT() : 总行数
      MAX() : 最大值
      MIN() : 最小值
      SUM() : 求和
      AVG() : 平均值

      DISTINCT(): 取不同的数据（去重）`SELECT COUNT(DISTINCT hp_max) FROM heros;`

  `SELECT COUNT(*), AVG(hp_max), MAX(mp_max), MIN(attack_max), SUM(defense_max) FROM heros WHERE role_main = '射手' or role_assist = '射手';`
  `SELECT MIN(CONVERT(name USING gbk)), MAX(CONVERT(name USING gbk)) FROM heros;`
  > AVG、MAX、MIN 等聚集函数会自动忽略值为 NULL 的数据行，MAX 和 MIN 函数也可以用于字符串类型数据的统计，如果是英文字母，则按照 A—Z 的顺序排列，越往后，数值越大。如果是汉字则按照全拼拼音进行排列

  6. 对数据进行分组
    GROUP BY: `SELECT COUNT(*), role_main FROM heros GROUP BY role_main;`

  7. 过滤分组
  > 过滤可以使用WHERE和HAVING： WHERE 用于数据行，HAVING 用于分组。
    HAVING : `SELECT COUNT(*), as num, role_main, role_assist FROM heros GROUP BY role_main, role_assist HAVING num > 5 ORDER BY num DESC;`
    `SELECT COUNT(*) as num, role_main, role_assist FROM heros WHERE hp_max > 6000 GROUP BY role_main, role_assist HAVING num > 5 ORDER BY num DESC;`

    **关键字的顺序不能颠倒**
    `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ...`

* 子查询
  > 子查询虽然是一种嵌套查询的形式,
  > 子查询从数据表中查询了数据结果，如果这个数据结果只执行一次，然后这个数据结果作为主查询的条件进行执行，那么这样的子查询叫做非关联子查询。
  > 如果子查询需要执行多次，即采用循环的方式，先从外部查询开始，每次都传入子查询进行查询，然后再将结果反馈给外部，这种嵌套的执行方式就称为关联子查询。
  `SELECT player_name, height FROM player WHERE height = (SELECT max(height) FROM player);`
  `SELECT player_name, height, team_id FROM player AS a WHERE height > (SELECT avg(height) FROM player AS b WHERE a.team_id = b.team_id);`

* 集合比较子查询
  IN : 是否在集合中  `SELECT player_id, team_id, player_name FROM player WHERE player_id in (SELECT player_id FROM player_score WHERE player.player_id = player_score.player_id);`
  EXISTS : 判断条件是否满足 `SELECT player_id, team_id, player_name FROM player WHERE EXISTS (SELECT player_id FROM player_score WHERE player.player_id = player_score.player_id);`
  ANY : 与子查询返回的任何值做比较 `SELECT player_id, player_name, height FROM player WHERE height > ANY (SELECT height FROM player WHERE team_id = 1002);`
  ALL : 与子查询返回的所有值做比较  `SELECT player_id, player_name, height FROM player WHERE height > ALL (SELECT height FROM player WHERE team_id = 1002);`
  SOME : 同ANY

  `SELECT * FROM A WHERE cc IN (SELECT cc FROM B)`
  `SELECT * FROM A WHERE EXIST (SELECT cc FROM B WHERE B.cc=A.cc)`

  `SELECT team_name, (SELECT count(*) FROM player WHERE player.team_id = team.team_id) AS player_num FROM team;`


