# Mysql数据库是怎么完整导出的呢？

相信很多人已经放弃了古老的cmd来直接写语句，建数据库，建表。
很多人用navicat，直观简单，但我用的是DataGrip，这样会保持我开发的一体性。

首先要说明Database在DataGrip或者Idea里的mysql里被翻译成了架构，你需要去架构里新建表，右键新建表，您就可以得到一个视化界面创建。


DataGrip 和你刚才在 IDEA 里使用的 Database 数据库面板其实使用的是同一套底层工具，因此它们新建表的操作逻辑是完全互通的。在 DataGrip 中新建表，主要有以下两种常用方式：

### 方法一：使用可视化界面创建（推荐，直观且不容易出错）

1. **定位数据库**：在左侧的 Database 资源管理器中，展开你的数据库连接，右键点击目标架构（例如你的 `shaoxia_db`）或者它下方的 **表 (Tables)** 文件夹。
    
2. **选择新建**：在弹出的右键菜单中，选择 **New (新建)** -> **Table (表)**。
    
3. **配置表结构**：此时会弹出一个可视化的建表窗口：
    
    - **Name (名称)**：在顶部输入你要创建的表名。
        
    - **Columns (列)**：点击中间区域的 **`+`** 号（或按 `Alt+Insert`），可以逐个添加字段。
        
    - **字段属性**：直接在表格中设置字段名、Type (数据类型)、PK (是否主键)、NN (是否非空)、AI (是否自增) 以及 Default (默认值)。
        
4. **预览与执行**：在该窗口的下半部分，DataGrip 会根据你的界面配置实时生成对应的 **DDL (SQL 建表语句)**。确认无误后，点击右下角的 **Execute (执行)** 或 **OK (确定)**，表就建好了。
    

### 方法二：使用 SQL 控制台通过代码创建（适合习惯手写 SQL 的情况）

1. **打开控制台**：右键点击目标数据库，选择 **New (新建)** -> **Query Console (查询控制台)**，或者直接按快捷键 `Ctrl+Shift+Q` 打开一个新的 SQL 编写窗口。
    
2. **编写语句**：在控制台中直接编写标准的 `CREATE TABLE` 语句。例如：
    
    SQL
    
    ```
    CREATE TABLE sys_role (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
        role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
    ) COMMENT '系统角色表';
    ```
    
3. **执行代码**：将光标停留在该段 SQL 上，点击左上角的绿色运行三角形（或者按 `Ctrl+Enter` / `Cmd+Enter`），选择在当前数据库执行即可。建表完成后，记得在左侧的数据库树状图上点击一下 **刷新按钮** 才能看到新表。


我是很推荐使用第二种的，因为当你需要导出初始化文件，仍然在控制台输入是最好的，而且有一个很棒的优点是，你可以直接让Ai帮你写😄复制粘贴难道不好吗？
下面介绍怎么用DataGrip导出我的名为shaoxia_db在数据库也就是架构下的数据库表文件。```C:\Program Files\MySQL\MySQL Server 8.4\bin ```  推荐使用**LTS 版本（长期支持版）**：比如 8.4，这里延展到推荐使用的springboot版本是

### 方法一：使用 MySQL 原生工具导出（推荐，包含完整结构与数据）

这是导出整个数据库（建表语句 + 初始数据）最标准的方式。

1. 在你截图中的 Database 树状视图中，**右键点击**高亮的 `shaoxia_db` 节点。
    
2. 在弹出的菜单中选择 **Import/Export (导入/导出)**，然后点击 **Export with 'mysqldump' (使用 'mysqldump' 导出)**。
    
3. 在弹出的配置窗口中完成以下设置：
    
    - **Path to mysqldump (mysqldump 路径)**：选择你本地 MySQL 安装目录 `bin` 文件夹下的 `mysqldump.exe`（如果 IDEA 尚未自动识别）。
        
    - **Output path (输出路径)**：设置你想保存 `.sql` 文件的本地文件夹和文件名。
        
4. 点击 **Run (运行)**，IDEA 就会在后台调用该工具为你生成完整的 SQL 脚本。
    

### 方法二：使用 IDEA 内置提取器导出（只想单独导出表结构/单表数据）

如果你当前没有配置 MySQL 环境路径，或者只想单独导出表结构/单表数据，可以使用内置功能：

- **仅导出数据库结构 (DDL)**：
    
    1. 右键点击 `shaoxia_db` 架构。
        
    2. 选择 **SQL Scripts (SQL 脚本)** -> **SQL Generator... (SQL 生成器...)**。
        
    3. 在弹出的窗口右侧会自动生成所有表的建表语句，你可以直接点击右面复制或保存图标存为 `.sql` 文件。
        
- **仅导出表初始数据 (Insert 语句)**：
    
    1. 展开你的数据库找到 `表` 文件夹，选中你需要导出的表（例如 `sys_user`，按住 `Ctrl` 可以多选）。
        
    2. 右键选择 **Export Data to File (将数据导出至文件)**。
        
    3. 在弹出的窗口中，将第一项的 **Extractor (提取器)** 更改为 **SQL Inserts**也就是中文的**SQL 插入**下拉还有**SQL-Insert-Statements**（这会为每一行数据生成一条单独的 Insert 语句）。如果你希望多行数据合并在一条 Insert 语句中以提高执行效率，也可以选择 **SQL-Insert-Multirow**。。
        
    4. 指定 Output file (输出路径) 并点击 **Export (导出)** 即可。


