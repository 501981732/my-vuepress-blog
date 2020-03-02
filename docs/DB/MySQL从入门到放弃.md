## MySQL从入门到放弃

##  1初涉mysql
[学习目录](https://github.com/501981732/MySQL)
- mysql默认端口 3306
- mysql超级用户 root
- 创建数据库 CREATE DATABASES
- 修改数据库 ALTERE DATABASE
- 删除数据库 DROP DATABASE

1. 启动服务 mysql -uroot -p123456 -P3306 -h127.0.0.1（账号root密码123456）
2. SHOW DATABASES 
3. use db_name
4. SELECT DATABASE() 显示当前打开的数据库


## 2 数据类型和操作数据表

### 数据类型


---
[学习目录](https://github.com/501981732/MySQL)
- **整型**


数据类型  | 存储范围  | 字节
---|---|---
TINYINT  | 无符号值：-128到127 有符号位0-255  | 1
SMALLINT | 无符号值：-2^15到 2^15 有符号位0-2^16  | 2
MEDIUMINT| 无符号值：-2^23到 2^15 有符号位0-2^23| 3
INT | 无符号值：-2^31到 2^31 有符号位0-2^32  | 4
BIGINT | 无符号值：-2^63到 2^63 有符号位0-2^64  | 8

> 选择合适的类型 例如： 年龄字段（1-100多岁）用TINYINT



- **浮点型**

数据类型  | 存储范围 
---|---
FLOAT[(M,D)]  | -3.4E+38到-3.4E-38 0和1,。175E-38到3.40E+38    M数字总数，D小数点后位数单精度浮点大概精确到7位小数位
DOUBLE[(M,D)] | 近十倍的单精度浮点的大小 

> FLOAT[(7,2)]  总位数7位，小数位2位



- **日期时间类型**

列表型 | 存储需求
---|---
YEAR | 1
TIME | 3
DATE | 3
DATETIME | 8
TIMESTAM | 4

    > DATE  1000年1月1号 9999年12月31号

    > DATE  1000年1月1号0点 9999年12月31号23点59分59秒

    > TIMESTAM 时间戳  1970年1月1号0点 2037年的一个值

    >实际开发中用数字类型取代（用php加密），由于跨时区问题



- **字符型**


列表型 | 存储需求
---|---
CHAR(M) | M个字节   0<=M<=255
VARCHAR(M) | L+1个字节   L<=M 且   0<=M<=65535
TINYTEXT | L+1个字节   L< 2^8
TEXT |L+2个字节   L< 2^16
MEDIUMTEXT |L+3个字节   L< 2^24
ENUM('value','value') | 
SET('value','value') | 

- 行--记录 列--字段

### 数据表


---

- **创建数据表**

    - 数据表（或称呼表）是数据库最重要的组成部分之一，是其他对象的基础
    - 行--记录 列--字段

1. **USE** 数据库名称
2. **SHOW DATABASE**  展示数据库
3. **SELECT DATABASE** 打开数据库
4. **CREATE TABLE [IF NOT EXISTS] table_name(colunm_name data_type,...)** 创建数据库 
    - eg： CREATE TABLE IF NOT EXISTS demo_name( id int,username VARCHAR(20), age TINYINT UNSIGNED,salary FLOAT(8,2) UNSIGNED)  无符号位
    - **NULL** ,字段可为空  **NOT NULL** ,字段可为空
        - eg： CREATE TABLE IF NOT EXISTS demo_name( id int,username VARCHAR(20) NOT NULL,salary FLOAT(8,2) UNSIGNED NULL)
    - **AUTO_INCREMENT** 自动编号，必须和主键结合使用，默认起始为1，每次增1
    - **主键** 每张表只能存在一个，保证记录的唯一性，主键自动为NOT NULL
    - **唯一约束  UNIQUE KEY** 也可以保证记录唯一性，可以为NULL 每张表可以存在多个唯一约束
    - **默认约束 DEFAULT** 若没有明确某字段赋值， 则自动赋值默认值

- **查看数据表**

    - **SHOW TABLES [FROM db_name] [LIKE \`PATTERN` | WHERE expr**]查看某数据库中的数据表 当前数据库不会改变
    - **SHOW COLUMNS FROM tal_name** 查看数据表结构

- **插入与查找**
    - **INSERT [INTO] tab_name [(col_name,...)] VALUES(val,...)** 插入列名的情况下必须全部赋值
    - **SELECT expr,... FROM  tab_name** 查找
        - SELECT * FROM tab_name

## 3. 约束
---
[学习目录](https://github.com/501981732/MySQL)
-   约束保证数据的完整行和一致性
-   约束按数据列的数目划分：
    - 表级约束
    - 列级约束
-   约束按功能划分：
    - **NOT NULL** 非空约束
    - **PRIMARY KEY** 主键约束
    - **UNIQUE KEY** 唯一约束
    - **DEFAULT** 默认约束
    - **FOREIGN KEY** 外键约束
> - ### 外键约束FOREIGN KEY
-  外键约束 保证数据一致性，完整性，实现一对一，一对多的关系
-  外键约束的要求：
    1. 父表和子表必须使用相同的存储引擎，而且尽职使用临时表
        - 具有外键列的表为*子表*，子表所参照的表为*父表*
        - 编辑数据表的默认存储引擎 MySQL配置文件 default-storage-engine=INNODB
    2. 数据表的存储引擎只能为InnoDB
    3. 外键列和参照列必须具有相似的数据类型，其中数字的长度或是否有符号必须相同；而字符的长度则可以不同
        - 具有FOREIGN KEY 的那一列为*外键列*，它所参照的那一列为*参照列*
    4. 外键列和参照列必须创建索引。如果外键列不存在索引的话，MySQL将自动创建索引
        - 参照列没有索引，MySQL才会自动创建，外键列没有的话不会
    
> 省份表

> ```
> CREATE TABLE PROVINCES(
> `id` SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
> pname VARCHAR(20) NOT NULL)
> ```

> users表

> ```
> CREATE TABLE USERS(
> `id` SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
> username VARCHAR(20) NOT NULL，
>pid SNALLINT UNSIGNED，
>FOREIGN KEY(pid) REFERENCES privinces (id) )
> ```

- 关系型数据库，用户表中想存储省份，不用存省份，用省份id， 这里的id就是外键
- 有外键的表users成为子表，参照的表provinces为父表
- 外键pid参照 privinces表中的id，两者必须具有相似的数据类型，其中数字的长度或是否有符号必须相同；而字符的长度则可以不同
- 
> - ### 外键约束的参照操作
- 表关联之后，父表更新，子表是否更新的操作
- 实际开发中不去定义物理的外键，而是逻辑的外键（使用某种结构而不是FOREIGN KEY这个关键字）
1. CASCADE： 从父表删除或更新且自动删除，或个鞥新子表中匹配的行
2. SET NULL：从父表删除或更新行，并设置子表中的外键列为NULL。如果使用该选项，必须保证子表列没有指定NOT NULL
3. RESTRICT: 拒绝对父表的删除或更新操作
4. NO ACTION: 标准SQL的关键字，在MySQL中与RESTRICT相同

## 4.修改数据结构

---
[学习目录](https://github.com/501981732/MySQL)
> 数据表的修改操作：无非就是添加列（ADD），删除列(DROP)，添加约束（ADD），删除约束(DROP)。用的是ALTER，而INSERT是对数据表添加插入记录用的。

> 修改数据表：
> - 针对字段：添加/删除字段，修改列定义，修改列名称等
> - 针对约束：添加/删除各种约束
> - 针对数据表：数据表的更名(两种)
- 添加单列
    - **ALTER TABLE** tbl_name **ADD** [COLUMN] col_name column_definition [FIRST | AFTER col_name] 
- 添加多列
    -  ALTER TABLE tbl_name ADD [COLUMN] (col_name column_definition,...)
- 删除列
    - ALTER TABLE tbl_name DROP [COLUMN] col_name
- 添加/删除主键约束
    - 添加 ALTER TABLE tbl_name ADD [CONSTRAINT[symbol]] PRIMARY KEY [index_type] (index_col_name,...)  
    - 删除 ALTER TABLE tbl_name DROP PRIMARY KEY
- 添加/删除唯一约束
    -  添加 ALTER TABLE tbl_name ADD [CONSTRAINT[symbol]] UNIQUE [INDEX|KEY] [index_name] [index_type] (index_col_name,...)
    -  删除 ALTER TABLE tbl_name DROP {INDEX|KEY} index_name
- 添加外键约束
    -  添加ALTER TABLE tbl_name ADD [CONSTRAINT[symbol]] FOREIGN KEY [index_name] (index_col_name,...) reference_definition
    -  删除 ALTERE TABLE tab_name DROP FOREIGN KEY fk_symbol
- 添加/删除默认约束 
    -  ALTER TABLE tbl_name ALTER [COLUMN] col_name {SET DEFAULT literal | DROP DEFAULT} 
        - 添加：ALTER TABLE users2 ALTER age SET DEFAULT 15;
        - 删除：ALTER TABLE users2 ALTER age DROP DEFAULT;  

---
### 修改列定义和更名数据表
- 修改列定义 **MODIFY**
    - ALTER TABLE tbl_name **MODIFY** [COLUMN] col_name column_definition [FIRST| ATTERE col_name]
        -  ALTER TABLE users MODIFY id SMALLINT UNSIGNED NOT NULL FIRST
- 修改列名称 **CHANGE**
    - ALTER TABLE tbl_name **CHANGE** [COLUMN] old_col_name new_col_name column_definition [FIRST| ATTERE col_name]
        -  ALTER TABLE users CHANGE id ID SMALLINT UNSIGNED NOT NULL FIRST
-  修改数据表名称 **RENAME**
    1. ALTER TABLE tbl_name RENAME [TO|AS] new_tbl_name
    2. RENAME TABLE tbl_name TO new_tbl_name [,tbl_name2 TO new_tbl_name2]

##  5.操作数据表中的记录（增删改查）

---
[学习目录](https://github.com/501981732/MySQL)


- 增
- 删
- 改
- 查

- ### 插入 INSERT
    - **INSERT** [INTO] tbl_name [(col_name,...)] {**VALUES | VALUE**} ({expr | DEFAULT},...),(...)...
        1. 省略col_name则表示要插入所有字段,所有字段都要赋值否则报错
        2. 为自增的字段赋值可用NULL/DEFAULT，他仍遵守递增的规则，此外为有默认值的项赋值DEFAULT代表默认值
        3. 所赋值可以为表达式
        4. 插入id，name，password,score 
            >
                INSERT users_table VALUES(NULL,'wm',123456,DEFAULT)

            >
                INSERT users_table VALUES(NULL,'wm',123456，DEFAULT),VALUES(3*7,'wm',md('123'),DEFAULT)
   - **INSERT** [INTO] tbl_name **SET** col_name={expr | DEFAULT},...(*此方法与第一种方法的区别在于可以使用子查询SubQuery，且只能插入一条数据*)
        >
        **INSERT** users SET username='wm',password='123'
    -   **INSERT** [INTO] tbl_name [(col_name,...)] **SELECT** ...(*将查询结果写入到指定数据表中*)
        > 
            将 user_table 中age大于30的数据中的username写入到test_table表(只有一列)
    
        ~~INSERT test SELECT username WHERE age>=30~~
    
            INSERT test(username) SELECT username WHERE age>=30
       
       
    
- ### 单张表更新 UPDATE
    -  **UPDATE** [LOW_PRIORITY] [IGNORE] table_reference **SET** col_name1={expr1 | DEFAULT} [,col_name2={expr1 | DEFAULT}] ... [WHERE where_condition] (**单张表更新**)
    >
        UPDATE user_table SET age = age + 5 WHERE id % 2 = 0 (偶数位id age加5)

- ### 单张表删除 DELETE
    -  DELETE FROM tbl_name [WHERE where_condition] (**单张表删除**)
    >
        DELETE FROM user_table WHERE id = 6
    

- ### 查找 SELECT
    - SELECT select_expr [,select_expr...] 
    - [FROM tab_references  
    - [WHERE where_condition]
    - [GROUP BY {col_name | position }[ASC| DESC],...] 
    - [HAVING where_condition]
    - [ORDER BY {col_name | expr | position} [ASC | DESC],...]
    - [LIMIT {[offset,] row_count | row_count FOOSET offset}]
    ]
    - select_expr: 查询表达式
        - 每一个表达式表示想要的一列，必须有至少一个
        - 多个列用英文逗号隔开
        - 型号（ * ）表示所有列，tbl_name.* 可以表示命名表的所有列
        - 查询表达式可以使用[AS] alias_name 为其赋予别名
        - 别名可用于 GROUP BY ，ORDER BY 或HAVING子句
        - select字段顺序可影响到查找结果出现的顺序，别名也一样会影响
    >
        SELECT id AD user_id, username AS u_name FROM user_table 
     
    --- 

- ### WHERE
> [WHERE where_condition] 

> 对记录过滤，如果没有指定WHERE子句，则显示所有记录

> 在WHERE表达式中，可以使用MySQL支持的函数或表达式

- ### GROUP BY
> 查询结果分组
> [GROUP BY {col_name | position }[ASC| DESC],...]

    SELECT sex FROM user_table GROUP BY sex (*对性别进行分组*)

- ### HAVING 
>[HAVING where_condition] 分组条件 对某一部分进行分组

~~SELECT sex FROM GROUP BY sex HAVING age > 35~~

    SELECT sex,age FROM user_table GROUP BY sex HAVING age > 35 (*用时必须在select查找字段内中出现*)    
    SELECT sex FROM FROM user_table GROUP BY sex HAVING count(id) > 2 (*或者聚合函数最大值，最小值等，因为只会出现一个值*)

- ### ORDER BY 
>[ORDER BY {col_name | expr | position} [ASC | DESC],...]

    SELECT * FROM user_table ORDERBY id DESC (*降序*) 
    SELECT * FROM user_table ORDERBY age id DESC (*按着age降序排列，当age相同时这些相同的数据再按着id降序排列*) 


- ### LIMIT
>[LIMIT {[offset,] row_count | row_count FOOSET offset}] 限制查询数量

    SELECT * FROM user_table LIMIT 10 (从第一条数据开始返回，一共10条)
    SELECT * FROM user_table LIMIT 2,2 (返回第3,4条，数据从第0开始，从第2+1条开始，返回两条) 

##  6.子查询与连接

---
[学习目录](https://github.com/501981732/MySQL)

1. 启动服务 mysql -uroot -p123456 -P3306 -h127.0.0.1（账号root密码123456）
2. SHOW DATABASES 查看数据库
3. use db_name 选中数据库
4. SELECT DATABASE() 显示当前打开的数据库
5. SHOW TABLES 查看当前数据库下的数据表
6. SHOW COLUMNS FROM tbl_name 查看数据表详情
7. SELECT * FROM tbl_name \G: 在命令行中以网格形式呈现
8. SET NAMES gbk  命令行中显示中文

## **子查询**
- 子查询：是指在另一个查询语句中的SELECT子句
>   SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);其中，SELECT * FROM t1 ...称为Outer Query[外查询](或者Outer Statement),
  SELECT column1 FROM t2 称为Sub Query[子查询]。
  所以，我们说子查询是嵌套在外查询内部。而事实上它有可能在子查询内部再嵌套子查询。
  子查询必须出现在圆括号之间。

> 子查询可以返回标量，一行，一列，或者子查询

- **由比较运算符引发的子查询**
    1. = > <  >=  <= != <=>
    2. 语法结构 operand comparison_operator  ANY 或SOME或 ALL(subquery)
    3. 求平均值，并保留两位小数 **SELECT ROUND(AVG(price),2) FROM tbl_name** 
    4. 求小于平均值的商品 **SELECT * FROM tbl_name WHERE price <= (SELECT ROUND(AVG(price),2) FROM tbl_name)** 
    5. 若子查询返回多个结果的情况下，可以使用ANY SOME ALL修饰

- **由[NOT] IN引发的子查询**
    1. 语法结构  operand comparison_operator  [NOT] IN (subquery)
    2. = ANY 与IN 等效
    3. !=ALL 或<>ALL 与NOT IN 等效

- **由[NOT] IESISTS引发的子查询**
    1. 如果子查询返回任何行，EXISTS 返回TRUE； 否则FALSE

- **使用INSERT ... SELECT 将查询的结果插入记录**
    1. 某表中商品种类保存的是中文名称，查看该商品表中一共有多少种商品（GROUP BY） **SELECT goods_cate FROM tbl_name GROUP BY goods_cate**  
    2. 将某个表中查询的结果插入到另一张表（保存商品表种类）**INSERET tbl_goods_table(cate_name) SELECT goods_cate FROM tbl_name GROUP BY goods_cate** 

- **多表更新**
    - UPDATA table_references SET col_name1=(expr|DEFAULT) [, col_name2=(expr|DEFAULT)] [WHERE where_condition]

- **连接**
- table_reference {[INNER | CROSS] JOIN | {LEFT|RIGHT} [OUTER] JOIN} table_reference ON XX==xx SET XX=XX
    - INNER JOIN,内连接    在MySQL中，JOIN,CROSS JOIN 和INNER JOIN是等价的
    - LEFT [OUTER] JOIN,左外连接
    - RIGHT [OUTER] JOIN,右外连接
    
- 数据表参照
    - 数据表可以使用tbl_name AS alisa_name或者tbl_name alias_name
    
- 内连接
    - INNER JOIN 使用OM关键字来设定连接条件，也可以使用WHERE来代替
    - 使用ON设定连接条件，WHERE来进行结果集记录的过滤
    - 仅显示连接条件的记录
- 外连接
    - 显示坐标中的全部和由表中符合连接条件的记录
    
- 多表链接
    - 操作相同
    
- 无限分类的数据表设计
    ~~~
   CREATE TABLE tdb_goods_types(
     type_id   SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
     type_name VARCHAR(20) NOT NULL,
     parent_id SMALLINT UNSIGNED NOT NULL DEFAULT 0
  ); 

- 多表删除
    - DELETE tbl_name[.*] [,tbl_name[.*]] ... FROM table_references [WHERE where_condition] 
---

## 下面是一个比较完整的例子


```
  -- 1.创建数据表

  CREATE TABLE IF NOT EXISTS tdb_goods(
    goods_id    SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    goods_name  VARCHAR(150) NOT NULL,
    goods_cate  VARCHAR(40)  NOT NULL,
    brand_name  VARCHAR(40)  NOT NULL,
    goods_price DECIMAL(15,3) UNSIGNED NOT NULL DEFAULT 0,
    is_show     BOOLEAN NOT NULL DEFAULT 1,
    is_saleoff  BOOLEAN NOT NULL DEFAULT 0
  );
  --2.插入部分数据
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('R510VC 15.6英寸笔记本','笔记本','华硕','3399',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Y400N 14.0英寸笔记本电脑','笔记本','联想','4899',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('G150TH 15.6英寸游戏本','游戏本','雷神','8499',DEFAULT,DEFAULT);
    
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X550CC 15.6英寸笔记本','笔记本','华硕','2799',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X240(20ALA0EYCD) 12.5英寸超极本','超级本','联想','4999',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('U330P 13.3英寸超极本','超级本','联想','4299',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('SVP13226SCB 13.3英寸触控超极本','超级本','索尼','7999',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad mini MD531CH/A 7.9英寸平板电脑','平板电脑','苹果','1998',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad Air MD788CH/A 9.7英寸平板电脑 （16G WiFi版）','平板电脑','苹果','3388',DEFAULT,DEFAULT);
 
    INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' iPad mini ME279CH/A 配备 Retina 显示屏 7.9英寸平板电脑 （16G WiFi版）','平板电脑','苹果','2788',DEFAULT,DEFAULT);
    
-- 3.求所有电脑产品的平均价格,并且保留两位小数，AVG,MAX,MIN、COUNT、SUM为聚合函数

   SELECT ROUND(AVG(goods_price),2) AS avg_price FROM tdb_goods;

-- 4.查询所有价格大于平均价格的商品，并且按价格降序排序

   SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > 5845.10 ORDER BY goods_price DESC;
  
-- 5.使用子查询来实现

  SELECT goods_id,goods_name,goods_price FROM tdb_goods 


  WHERE goods_price > (SELECT ROUND(AVG(goods_price),2) AS avg_price FROM tdb_goods) 


  ORDER BY goods_price DESC;


-- 6.查询类型为“超记本”的商品价格

 
   SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本';

-- 7.查询价格大于或等于"超级本"价格的商品，并且按价格降序排列

 
   SELECT goods_id,goods_name,goods_price FROM tdb_goods 

   WHERE goods_price = ANY(SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本')

   ORDER BY goods_price DESC;
   
    -- = ANY 或 = SOME 等价于 IN 

   SELECT goods_id,goods_name,goods_price FROM tdb_goods 

   WHERE goods_price IN (SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本')

   ORDER BY goods_price DESC; 


        -- 8.创建“商品分类”表
        
          CREATE TABLE IF NOT EXISTS tdb_goods_cates(
        
            cate_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            
            cate_name VARCHAR(40)
        
          );
        
        -- 9.查询tdb_goods表的所有记录，并且按"类别"分组
        
           SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;
        
        -- 10.将分组结果写入到tdb_goods_cates数据表
        
           INSERT tdb_goods_cates (cate_name) SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;

        -- 11.通过tdb_goods_cates数据表来更新tdb_goods表（连接）多表更新
        
            ---!!!
        
           UPDATE tdb_goods INNER JOIN tdb_goods_cates ON goods_cate = cate_name 
        
           SET goods_cate = cate_id ;
           
           ---!!!

-- 12.通过CREATE...SELECT来创建数据表并且同时写入记录 多表更新一步到位！
 
  -- SELECT brand_name FROM tdb_goods GROUP BY brand_name;

  CREATE TABLE tdb_goods_brands (

    brand_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    brand_name VARCHAR(40) NOT NULL

  ) SELECT brand_name FROM tdb_goods GROUP BY brand_name;


-- 13.通过tdb_goods_brands数据表来更新tdb_goods数据表(错误) 系统不清楚brand_name是哪个表的

  UPDATE tdb_goods  INNER JOIN tdb_goods_brands ON brand_name = brand_name

  SET brand_name = brand_id;

  -- Column 'brand_name' in field list is ambigous

  -- 正确

          UPDATE tdb_goods AS  g  INNER JOIN tdb_goods_brands AS b ON g.brand_name = b.brand_name
        
          SET g.brand_name = b.brand_id;

-- 14.查看tdb_goods的数据表结构

  DESC tdb_goods; / SHOW COLUMNS FROM tdb_goods



-- 15.通过ALTER TABLE语句修改数据表结构 (因为商品名字现在改为字符型，但是主表中仍然为varchar)

   ALTER TABLE tdb_goods  

   CHANGE goods_cate cate_id SMALLINT UNSIGNED NOT NULL,

   CHANGE brand_name brand_id SMALLINT UNSIGNED NOT NULL;
  
-- 16.分别在tdb_goods_cates和tdb_goods_brands表插入记录

   INSERT tdb_goods_cates(cate_name) VALUES('路由器'),('交换机'),('网卡');

   INSERT tdb_goods_brands(brand_name) VALUES('海尔'),('清华同方'),('神舟');

-- 17.在tdb_goods数据表写入任意记录

   INSERT tdb_goods(goods_name,cate_id,brand_id,goods_price) VALUES(' LaserJet Pro P1606dn 黑白激光打印机','12','4','1849');

-- 18.查询所有商品的详细信息(通过内连接实现) 多表连接

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g

   INNER JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id

   INNER JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;

-- 19.查询所有商品的详细信息(通过左外连接实现)

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g

   LEFT JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id

   LEFT JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;

-- 20.查询所有商品的详细信息(通过右外连接实现)

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g

   RIGHT JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id

   RIGHT JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;

-- 21.无限分类的数据表设计

   CREATE TABLE tdb_goods_types(
     type_id   SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
     type_name VARCHAR(20) NOT NULL,
     parent_id SMALLINT UNSIGNED NOT NULL DEFAULT 0
  ); 

  INSERT tdb_goods_types(type_name,parent_id) VALUES('家用电器',DEFAULT);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑、办公',DEFAULT);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('大家电',1);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('生活电器',1);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('平板电视',3);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('空调',3);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电风扇',4);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('饮水机',4);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑整机',2);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑配件',2);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('笔记本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('超级本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('游戏本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('CPU',10);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('主机',10);

-- 22.查找所有分类及其父类

  SELECT s.type_id,s.type_name,p.type_name FROM tdb_goods_types AS s LEFT JOIN tdb_goods_types AS  p ON s.parent_id = p.type_id;
   
-- 23.查找所有分类及其子类

  SELECT p.type_id,p.type_name,s.type_name FROM tdb_goods_types AS p LEFT JOIN tdb_goods_types AS  s ON s.parent_id = p.type_id;

-- 24.查找所有分类及其子类的数目

  SELECT p.type_id,p.type_name,count(s.type_name) AS children_count FROM tdb_goods_types AS p LEFT JOIN tdb_goods_types AS s ON s.parent_id = p.type_id GROUP BY p.type_name ORDER BY p.type_id;

-- 25.为tdb_goods_types添加child_count字段

  ALTER TABLE tdb_goods_types ADD child_count MEDIUMINT UNSIGNED NOT NULL DEFAULT 0;

-- 26.将刚才查询到的子类数量更新到tdb_goods_types数据表

  UPDATE tdb_goods_types AS t1 INNER JOIN ( SELECT p.type_id,p.type_name,count(s.type_name) AS children_count FROM tdb_goods_types AS p 

                                            LEFT JOIN tdb_goods_types AS s ON s.parent_id = p.type_id 
                             
                                            GROUP BY p.type_name 

                                            ORDER BY p.type_id ) AS t2 

  ON  t1.type_id = t2.type_id 

  SET t1.child_count = t2.children_count;


-- 27.复制编号为12,20的两条记录

  SELECT * FROM tdb_goods WHERE goods_id IN (19,20);


-- 28.INSERT ... SELECT实现复制

  INSERT tdb_goods(goods_name,cate_id,brand_id) SELECT goods_name,cate_id,brand_id FROM tdb_goods WHERE goods_id IN (19,20);

-- 29.查找重复记录

  SELECT goods_id,goods_name FROM tdb_goods GROUP BY goods_name HAVING count(goods_name) >= 2;

-- 30.删除重复记录

  DELETE t1 FROM tdb_goods AS t1 LEFT JOIN (SELECT goods_id,goods_name FROM tdb_goods GROUP BY goods_name HAVING count(goods_name) >= 2 ) AS t2  ON t1.goods_name = t2.goods_name  WHERE t1.goods_id > t2.goods_id
```



    






