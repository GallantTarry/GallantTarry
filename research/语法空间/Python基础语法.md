# Python基础语法

Python 是一门解释型、动态强类型、多范式（面向对象、函数式、过程式）的高级编程语言。它的设计哲学浓缩在《Python 之禅》（`import this`）中——**“优雅、明确、简单”**。与 C、Java、Go 使用大括号 `{}` 划分代码块不同，Python 采用强制缩进（Indentation）**来定义语法层级，并建立在**“万物皆对象（Everything is an Object）”的底层引用模型之上。

---

## 1. 程序基本结构、缩进规则与模块入口

Python 源文件以 `.py`（或无控制台窗口的 `.pyw`）为扩展名，无需定义特定类即可从上至下顺序执行，但工程规范通常使用 `if __name__ == "__main__":` 作为脚本主入口。

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模块文档字符串（Docstring）：可通过 __doc__ 属性读取
"""

import os                  # 1. 导入标准库模块
from pathlib import Path   # 2. 从模块中精确导入指定类或函数


def greet(name: str) -> str:
    """函数文档字符串：冒号开启代码块，统一使用 4 个空格缩进"""
    return f"Hello, {name}!"


# 3. 模块主入口保护：仅当直接运行此脚本时执行；被其他文件 import 时不会触发
if __name__ == "__main__":
    current_dir = Path(os.getcwd())
    print(greet("Python"))

```

### 核心语法铁律

* **冒号与 4 空格缩进**：所有代码块（`if`、`for`、`def`、`class`、`try`、`with`）均以英文冒号 `:` 引导，下一行必须统一缩进（PEP 8 官方规范强制推荐 **4 个空格**，严禁将 Tab 与空格混用，否则直接抛出 `IndentationError`）。
* **`__name__` 内置变量机制**：当直接通过 `python main.py` 运行文件时，解释器会将该文件的 `__name__` 设为 `"__main__"`；当该文件作为模块被其他文件 `import` 导入时，`__name__` 则是它自身的文件名。

---

## 2. 变量、对象引用模型与数据类型

Python 是**动态强类型语言**：

* **动态**：变量本身没有固定类型（无需声明类型），变量名只是贴在内存对象上的**标签（Name Binding）**，随时可以改贴到不同类型的对象上。
* **强类型**：不同类型之间不会发生隐式胡乱转换（例如 `"Age: " + 25` 会直接抛出 `TypeError`，必须显式写 `str(25)`）。

### 可变对象（Mutable）vs 不可变对象（Immutable）

这是理解 Python 内存模型与传参行为的灵魂分类：

| 可变性分类 | 核心内置类型 | 字面量与初始化示例 | 内存修改特性与底层说明 |
| --- | --- | --- | --- |
| **不可变类型 (Immutable)** | `int`（任意精度整型） | `x = 100_000_000` | 原地不可修改；对变量执行 `x += 1` 本质是在内存中**创建新对象**并让变量名重新指向新地址 |
| **不可变类型 (Immutable)** | `float`、`bool`、`NoneType` | `pi = 3.14`、`flag = True`、` empty = None` | `bool` 是 `int` 的子类（`True == 1`）；空值统一用单例对象 `None` 表示 |
| **不可变类型 (Immutable)** | `str`（Unicode 字符串） | `s = "Hello"` 或多行 `"""..."""` | 任何字符串拼接、替换都会生成全新的 `str` 对象 |
| **不可变类型 (Immutable)** | `tuple`（元组）、`bytes` | `pt = (10, 20)`、`b = b"raw"` | 一旦创建，元素引用不可增删替换（因此不可变类型均可作为 `dict` 的 Key） |
| **可变类型 (Mutable)** | `list`（列表） | `items = [1, "a", True]` | 动态数组，支持原地增删改（`append`、`pop`），**内存地址 `id()` 保持不变** |
| **可变类型 (Mutable)** | `dict`（字典） | `user = {"id": 1, "name": "Admin"}` | 哈希键值对映射（Python 3.7+ 保证按**插入顺序**有序排列） |
| **可变类型 (Mutable)** | `set`（集合） | `tags = {"go", "python"}`（空集必须用 `set()`） | 无序、自动去重的哈希集合，支持交集 `&`、并集 ` |

### 多重赋值、序列解包与类型注解（Type Hints）

```python
# 1. 链式赋值与一行交换变量（无需临时变量 temp，底层自动元组打包与解包）
a, b = 10, 20
a, b = b, a  # 交换后 a=20, b=10

# 2. 星号 * 扩展解包：自动收集剩余元素为 list
first, *middle, last = [1, 2, 3, 4, 5]  # first=1, middle=[2, 3, 4], last=5

# 3. 现代类型注解（Type Hints，Python 3.10+ 支持直接用 | 表示联合类型）
# 注解不强制影响运行期性能，但能大幅增强 IDE (PyCharm/VS Code) 的智能补全与静态检查
count: int = 0
nickname: str | None = None
scores: list[float] = [98.5, 87.0]

```

---

## 3. 运算符与字符串格式化

### 核心特殊运算符

* **算术运算**：`/` 永远执行**真除法**（返回 `float`，如 `5 / 2` 得 `2.5`）；`**//` 执行向下取整整除（`5 // 2` 得 `2`）；`**` 表示幂运算（`2 ** 10` 得 `1024`）。
* **逻辑运算**：使用英文单词 **`and`**、**`or`**、**`not`**（而非 `&&`、`||`、`!`），支持短路求值并返回实际决定结果的那个操作数（如 `name = input_name or "默认名称"`）。
* **身份 vs 值相等（`is` vs `==`）**：
* **`==`**：调用对象的 `__eq__()` 方法，比较两个对象存储的**内容值是否相等**。
* **`is` / `is not**`：比较两个变量是否指向**同一块内存地址**（即 `id(a) == id(b)`）。**工程规范：判断是否为 `None` 时，必须使用 `if x is None:**`。


* **成员运算符（`in` / `not in`）**：检查元素是否存在于序列、字典 Key 或集合中（在 `set` 和 `dict` 中查找的时间复杂度为 $O(1)$）。
* **海象运算符（`:=`，Python 3.8+）**：在表达式内部同时完成变量赋值与返回值判断：
```python
# 在判断长度的同时将计算结果赋给变量 n，避免调用两次 len(data)
if (n := len(data)) != 0:
    print(f"共处理 {n} 条数据")

```



### 字符串 `f-string` 格式化（Python 3.6+ 标准首选）

```python
name = "TaskEngine"
progress = 0.8567

# 1. 基础插值与格式控制（:.2% 自动转为保留两位小数的百分比）
print(f"[{name}] 当前进度: {progress:.2%}")  # 输出: [TaskEngine] 当前进度: 85.67%

# 2. 自记录调试语法（Python 3.8+）：在变量或表达式后加 =，自动打印“表达式=结果”
x, y = 12, 30
print(f"{x + y = }")  # 输出: x + y = 42

# 3. 原始字符串 r""：忽略反斜杠转义，专用于 Windows 文件路径与正则表达式
win_path = r"C:\Users\Admin\Desktop\config.json"

```

---

## 4. 流程控制与结构化模式匹配

### 真假值判定规则（Truthiness）

Python 中任何对象都可直接用于 `if` 或 `while` 条件判断。以下值会被自动判定为 **`False`**，其余一切对象均为 `True`：

* 常数与空值：`None`、`False`
* 数值零：`0`、`0.0`、`0j`
* **任何长度为 0 的空容器**：`""`、`[]`、`()`、`{}`、`set()`

### 分支判断与 `match-case` 模式匹配（Python 3.10+）

```python
# 1. 标准 if - elif - else（注意 Python 中写作 elif 而非 else if）
status_code = 200
if status_code == 200:
    msg = "OK"
elif status_code == 404:
    msg = "Not Found"
else:
    msg = "Unknown"

# 2. 三元条件表达式：真值结果 if 条件 else 假值结果
label = "已激活" if is_active else "未激活"

# 3. 结构化模式匹配 match-case（远强于传统的 switch，支持直接解构元组、列表与字典结构）
command = ("MOVE", 100, 250)
match command:
    case ("QUIT",):
        print("退出程序")
    case ("MOVE", x, y) if x != 0 and y != 0:  # 支持解包变量并附加 if 守卫条件
        print(f"移动至坐标: ({x}, {y})")
    case ("RESET" | "RESTART",):               # 支持 | 匹配多个模式
        print("重置系统")
    case _:                                    # _ 为通配符，等同于 default
        print("未知指令")

```

### 循环结构与高阶迭代工具（`enumerate`、`zip`、`for-else`）

```python
names = ["Alice", "Bob", "Charlie"]
roles = ["Admin", "Dev", "Tester"]

# 1. enumerate()：同时优雅获取索引与元素值（告别 range(len(names))）
for idx, name in enumerate(names, start=1):
    print(f"{idx}. {name}")

# 2. zip()：并行打包遍历多个序列
for name, role in zip(names, roles):
    print(f"{name} -> {role}")

# 3. Python 独有的 for-else 语法：
# 只有当循环【自然正常结束】（中途没有触发过 break）时，才会执行 else 块！
for item in [2, 4, 6, 8]:
    if item == 5:
        print("找到目标 5")
        break
else:
    print("遍历完毕，未找到目标 5")

```

---

## 5. 切片（Slicing）与推导式（Comprehensions）

### 通用序列切片语法：`seq[start:stop:step]`

适用于 `list`、`str`、`tuple`，遵循**左闭右开**原则（包含 `start`，不包含 `stop`），支持负数索引（`-1` 代表最后一个元素）：

```python
nums = [0, 10, 20, 30, 40, 50]

sub1 = nums[1:4]    # [10, 20, 30]（索引 1 到 3）
sub2 = nums[:3]     # [0, 10, 20]（从头截取前 3 个）
sub3 = nums[-2:]    # [40, 50]（截取最后 2 个）
rev  = nums[::-1]   # [50, 40, 30, 20, 10, 0]（步长为 -1，一行代码优雅反转序列）

```

### 推导式与生成器表达式（Pythonic 精髓）

用一行声明式语法替代繁琐的 `for` 循环加 `append`：

```python
# 1. 列表推导式 (List Comprehension)：过滤出偶数并计算平方
squares = [x ** 2 for x in range(10) if x % 2 == 0]  # [0, 4, 16, 36, 64]

# 2. 字典推导式 (Dict Comprehension)：快速构建或反转键值对
word_lengths = {w: len(w) for w in ["go", "java", "python"]}  # {'go': 2, 'java': 4, 'python': 6}

# 3. 生成器表达式 (Generator Expression)：用圆括号 () 包裹，惰性求值（按需逐个计算，几乎不占内存）
total = sum(x * x for x in range(1_000_000))

```

---

## 6. 函数、参数解包与装饰器

### 参数形态与默认参数大坑

Python 函数支持位置参数、默认参数、可变位置参数（`*args`，打包为元组）与可变关键字参数（`**kwargs`，打包为字典）。

> **高频踩坑警告（切勿使用可变对象作为默认参数！）**：
> Python 函数的默认参数**只在 `def` 语句被加载定义时求值一次**，而非每次调用时重新创建。如果写成 `def add_item(val, items=[]):`，多次调用不传 `items` 会共享并累加同一个列表！正确写法是用 `None` 占位：

```python
def append_task(task: str, task_list: list[str] | None = None) -> list[str]:
    if task_list is None:
        task_list = []  # 每次调用时在函数内部创建全新的空列表
    task_list.append(task)
    return task_list


# 可变参数组合：*args 接收任意数量位置参数，**kwargs 接收任意数量命名参数
def log_event(event_type: str, *args, **kwargs) -> None:
    print(f"类型: {event_type} | 位置参数元组: {args} | 关键字参数字典: {kwargs}")


log_event("CLICK", 102, 240, user="admin", retry=False)

```

### 匿名函数（`lambda`）与装饰器（`@decorator`）

装饰器本质上是一个**接收函数作为参数、并返回增强后新函数的高阶闭包**，常用于日志记录、权限校验、耗时统计与缓存（如标准库自带的 `@functools.lru_cache`）：

```python
import time
from functools import wraps

# 1. lambda 匿名函数：常用于自定义排序 key
users = [{"name": "Bob", "age": 30}, {"name": "Alice", "age": 22}]
users.sort(key=lambda u: u["age"])  # 按 age 字段升序排列


# 2. 自定义计时装饰器
def timer(func):
    @wraps(func)  # 保留原函数的函数名 __name__ 和文档字符串
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        cost = (time.perf_counter() - start) * 1000
        print(f"[Timer] {func.__name__} 耗时: {cost:.2f} ms")
        return result
    return wrapper


@timer
def heavy_compute(n: int) -> int:
    return sum(range(n))

```

---

## 7. 面向对象（OOP）、魔术方法与 `@dataclass`

Python 的类支持多继承（方法解析顺序遵循 C3 线性化 MRO 算法），所有实例方法的第一个参数必须显式声明为 **`self`**（指向当前实例本身）。

### 标准类定义與双下划线魔术方法（Dunder Methods）

```python
class Vector:
    # 1. 构造初始化方法（对应 new 之后的属性绑定）
    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self._y = y  # 单下划线前缀 _y：约定俗成的受保护属性；双下划线 __y 会触发名称改写 (Name Mangling)

    # 2. 使用 @property 将方法伪装成只读属性（优雅替代传统 Java 的 getY()）
    @property
    def y(self) -> float:
        return self._y

    # 3. 魔术方法：定义 print(v) 或 str(v) 时的友好字符串输出
    def __repr__(self) -> str:
        return f"Vector(x={self.x}, y={self._y})"

    # 4. 运算符重载魔术方法：让两个 Vector 实例可以直接用 + 相加！
    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self._y + other._y)

```

### 现代数据类 `@dataclass`（Python 3.7+）

如果一个类主要用于封装数据状态（类似 Java 的 `record` 或 Go 的 `struct`），使用 `@dataclass` 装饰器即可自动生成 `__init__`、`__repr__` 和 `__eq__`：

```python
from dataclasses import dataclass, field

@dataclass
class ServerConfig:
    host: str = "127.0.0.1"
    port: int = 8080
    tags: list[str] = field(default_factory=list)  # 安全初始化可变默认字段

cfg = ServerConfig(port=9000)
print(cfg)  # 自动输出: ServerConfig(host='127.0.0.1', port=9000, tags=[])

```

---

## 8. 异常处理与 `with` 上下文管理器

### 完整异常捕获结构（`try - except - else - finally`）

```python
try:
    res = 100 / int(user_input)
except ValueError as e:
    print(f"输入格式非有效数字: {e}")
except (ZeroDivisionError, OverflowError) as e:  # 元组同时捕获多种异常
    print(f"算术异常: {e}")
else:
    # 仅当 try 块中【没有发生任何异常】时才执行
    print(f"计算成功，结果为: {res}")
finally:
    # 无论是否发生异常、甚至无论是否提前 return，都会执行的清理逻辑
    print("本次计算流程结束")

```

### `with` 上下文管理器（自动资源释放）

读写文件、获取线程锁（`threading.Lock`）或管理数据库连接时，**务必使用 `with` 语句**（底层自动调用对象的 `__enter__` 和 `__exit__` 方法），即便代码块中途抛出异常，也能百分之百保证文件流或锁被安全关闭释放：

```python
# 自动管理文件打开与关闭，无需手动写 f.close()
with open("data.txt", mode="r", encoding="utf-8") as f:
    lines = [line.strip() for line in f]

```

---

## Python “万物皆对象”引用模型与深浅拷贝交互演示

Python 初学者与进阶开发者最容易踩坑的地方，在于混淆了“变量重绑定（Rebinding）”**与**“原地修改（In-place Mutation）”**，以及嵌套容器的**直接赋值、浅拷贝（`copy.copy`）与深拷贝（`copy.deepcopy`）。

在 Python 中，变量本身不存储数据，只存储指向堆内存中 `PyObject` 对象的引用（内存地址 `id()`）。通过下方的交互式状态机，你可以逐步追踪不可变对象与可变嵌套列表在 6 个阶段中的真实内存引用拓扑演变：

<div id="py-demo-root">
<style>
#py-demo-root{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"JetBrains Mono",Consolas,monospace;background:linear-gradient(145deg,#0f172a 0%,#181824 100%);color:#e2e8f0;border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:18px;margin:16px 0;box-shadow:0 12px 32px rgba(0,0,0,0.38);line-height:1.5;}
#py-demo-root *{box-sizing:border-box;}
.py-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,0.16);margin-bottom:12px;}
.py-title{font-size:16px;font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:8px;}
.py-dot{width:10px;height:10px;border-radius:50%;background:#38bdf8;box-shadow:0 0 10px #38bdf8;display:inline-block;}
.py-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.py-btn{background:rgba(30,41,59,0.85);color:#cbd5e1;border:1px solid rgba(148,163,184,0.28);border-radius:7px;padding:5px 10px;font-size:12px;font-family:inherit;cursor:pointer;transition:all 0.18s ease;user-select:none;}
.py-btn:hover{border-color:#38bdf8;color:#fff;background:rgba(56,189,248,0.16);}
.py-btn.py-active{background:#0284c7;color:#fff;border-color:#38bdf8;font-weight:600;box-shadow:0 0 12px rgba(56,189,248,0.35);}
.py-grid{display:grid;grid-template-columns:1.05fr 1fr 1.15fr;gap:14px;margin-bottom:14px;}
@media(max-width:900px){.py-grid{grid-template-columns:1fr;}}
.py-panel{background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.16);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;}
.py-panel-head{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:0.4px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.12);}
.py-tag-code{color:#38bdf8;}
.py-tag-ns{color:#fbbf24;}
.py-tag-heap{color:#34d399;}
.py-sub{font-size:11px;color:#94a3b8;font-weight:400;}
.py-code-list{display:flex;flex-direction:column;gap:3px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;}
.py-code-line{display:flex;align-items:center;padding:4px 7px;border-radius:6px;color:#94a3b8;transition:all 0.18s ease;cursor:pointer;}
.py-code-line:hover{background:rgba(148,163,184,0.08);}
.py-code-line.py-line-active{background:rgba(56,189,248,0.18);color:#e0f2fe;border-left:3px solid #38bdf8;font-weight:600;}
.py-ln{width:20px;color:#64748b;font-size:10.5px;user-select:none;flex-shrink:0;}
.py-arrow{width:15px;color:#38bdf8;font-weight:700;flex-shrink:0;}
.py-ns-list{display:flex;flex-direction:column;gap:7px;}
.py-ns-card{background:rgba(30,41,59,0.78);border:1px solid rgba(148,163,184,0.22);border-left:3px solid #fbbf24;border-radius:7px;padding:7px 9px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;display:flex;justify-content:space-between;align-items:center;transition:all 0.22s ease;}
.py-ns-card.py-ns-hi{border-color:#38bdf8;border-left:3px solid #38bdf8;background:rgba(56,189,248,0.1);box-shadow:0 0 10px rgba(56,189,248,0.2);}
.py-ns-name{color:#f8fafc;font-weight:700;}
.py-ns-val{background:rgba(15,23,42,0.85);color:#38bdf8;padding:2px 7px;border-radius:4px;border:1px solid rgba(56,189,248,0.25);}
.py-heap-list{display:flex;flex-direction:column;gap:8px;}
.py-heap-card{background:rgba(30,41,59,0.75);border:1px solid rgba(148,163,184,0.22);border-left:3px solid #34d399;border-radius:8px;padding:9px 10px;transition:all 0.25s ease;}
.py-heap-card.py-heap-hi{border-color:#fbbf24;border-left:3px solid #fbbf24;background:rgba(251,191,36,0.08);box-shadow:0 0 12px rgba(251,191,36,0.2);}
.py-heap-card.py-heap-warn{border-color:#fb7185;border-left:3px solid #fb7185;background:rgba(244,63,94,0.1);box-shadow:0 0 12px rgba(244,63,94,0.2);}
.py-heap-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:11px;}
.py-h-id{font-family:"JetBrains Mono",Consolas,monospace;color:#94a3b8;background:rgba(15,23,42,0.8);padding:1px 6px;border-radius:4px;}
.py-h-type{font-weight:600;color:#34d399;}
.py-heap-body{display:flex;justify-content:space-between;align-items:center;font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;}
.py-h-k{color:#cbd5e1;}
.py-h-v{color:#fde68a;font-weight:700;background:rgba(15,23,42,0.85);padding:2px 7px;border-radius:4px;border:1px solid rgba(251,191,36,0.3);}
.py-h-note{margin-top:5px;font-size:10.5px;color:#bae6fd;background:rgba(56,189,248,0.12);padding:2px 6px;border-radius:4px;display:inline-block;}
.py-link-bar{background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.py-link-label{color:#94a3b8;font-weight:600;}
.py-link-pill{font-family:"JetBrains Mono",Consolas,monospace;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.32);color:#bae6fd;padding:2px 8px;border-radius:5px;font-size:11.5px;}
.py-footer{background:rgba(30,41,59,0.7);border-left:4px solid #38bdf8;border-radius:8px;padding:11px 14px;font-size:13px;display:flex;flex-direction:column;gap:4px;}
.py-footer-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.py-step-title{font-weight:700;color:#f8fafc;font-size:14px;}
.py-status{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;}
.py-st-blue{background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.35);}
.py-st-amber{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.35);}
.py-st-rose{background:rgba(251,113,133,0.15);color:#fb7185;border:1px solid rgba(251,113,133,0.35);}
.py-st-green{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.35);}
.py-desc{color:#cbd5e1;font-size:12.5px;line-height:1.6;}
</style>
<div class="py-header">
  <div class="py-title"><span class="py-dot"></span><span>Python “万物皆对象”引用模型与深浅拷贝交互演示</span></div>
  <div class="py-controls">
    <button type="button" class="py-btn" onclick="window.__pyGo(window.__pyCur-1)">◀ 上一步</button>
    <button type="button" class="py-btn py-active" id="py-b0" onclick="window.__pyGo(0)">1. 不可变共享</button>
    <button type="button" class="py-btn" id="py-b1" onclick="window.__pyGo(1)">2. 变量重绑定</button>
    <button type="button" class="py-btn" id="py-b2" onclick="window.__pyGo(2)">3. 可变列表别名</button>
    <button type="button" class="py-btn" id="py-b3" onclick="window.__pyGo(3)">4. 浅拷贝触发</button>
    <button type="button" class="py-btn" id="py-b4" onclick="window.__pyGo(4)">5. 连锁污染陷阱</button>
    <button type="button" class="py-btn" id="py-b5" onclick="window.__pyGo(5)">6. 深拷贝隔离</button>
    <button type="button" class="py-btn" onclick="window.__pyGo(window.__pyCur+1)">下一步 ▶</button>
  </div>
</div>
<div class="py-grid">
  <div class="py-panel">
    <div class="py-panel-head"><span class="py-tag-code">Python 源码执行流 (main.py)</span><span class="py-sub">点击代码行可跳转</span></div>
    <div class="py-code-list" id="py-code-box"></div>
  </div>
  <div class="py-panel">
    <div class="py-panel-head"><span class="py-tag-ns">当前命名空间 (Namespace)</span><span class="py-sub">变量名 ➔ 对象内存地址 id()</span></div>
    <div class="py-ns-list" id="py-ns-box"></div>
  </div>
  <div class="py-panel">
    <div class="py-panel-head"><span class="py-tag-heap">堆区 PyObject 内存对象</span><span class="py-sub">类型 · 引用计数 refcnt · 存储值</span></div>
    <div class="py-heap-list" id="py-heap-box"></div>
  </div>
</div>
<div class="py-link-bar" id="py-link-box"></div>
<div class="py-footer">
  <div class="py-footer-top">
    <span class="py-step-title" id="py-st-title"></span>
    <span class="py-status py-st-blue" id="py-st-badge"></span>
  </div>
  <div class="py-desc" id="py-st-desc"></div>
</div>
<script id="py-script-src">
(function(){
  var codeLines = [
    {ln:1, text:"x = 100; y = x  # 不可变对象共享", step:0},
    {ln:2, text:"x += 1        # 不可变对象重绑定", step:1},
    {ln:3, text:"a = [10, [20, 30]] # 可变嵌套列表", step:2},
    {ln:4, text:"b = a         # 直接赋值别名", step:2},
    {ln:5, text:"c = a.copy()  # 浅拷贝触发", step:3},
    {ln:6, text:"c[1].append(40) # 连锁污染陷阱", step:4},
    {ln:7, text:"d = copy.deepcopy(a) # 深拷贝隔离", step:5}
  ];
  var stages = [
    {
      title:"Step 1：执行 x = 100; y = x（不可变对象共享引用）",
      badge:"Immutable · 共享内存地址",
      badgeCls:"py-st-blue",
      desc:"在 Python 中，x = 100 会在堆上创建一个 int 类型的 PyObject 对象（假设地址为 id: 0x10A0，值为 100，引用计数 refcnt: 1）。接着执行 y = x 时，并没有复制数值 100，而是让变量名 y 贴向同一个对象，refcnt 变为 2。此时 x is y 为 True。",
      links:["x ──\x3e 0x10A0 (int: 100)","y ──\x3e 0x10A0 (int: 100)","x is y ➔ True"],
      ns:[
        {name:"x", val:"0x10A0 (int: 100)", hi:true},
        {name:"y", val:"0x10A0 (int: 100)", hi:true}
      ],
      heap:[
        {id:"0x10A0", type:"int", refcnt:"2", val:"100", note:"✔ 共享不可变对象 (refcnt=2)", hi:true, warn:false}
      ]
    },
    {
      title:"Step 2：执行 x += 1（不可变对象的重绑定 Rebinding）",
      badge:"Rebinding · 不可变对象原地不可改",
      badgeCls:"py-st-amber",
      desc:"因为 int 是不可变对象（Immutable），x += 1 无法修改 0x10A0 里面的值。Python 解释器在堆上开辟了一个全新对象 101（地址 id: 0x10A8，refcnt: 1），并将变量名 x 的标签重新绑定到 0x10A8。而变量 y 仍然安静地指向 0x10A0 (100)。",
      links:["x ──\x3e 0x10A8 (int: 101，标签已重绑定)","y ──\x3e 0x10A0 (int: 100，保持不变)"],
      ns:[
        {name:"x", val:"0x10A8 (int: 101)", hi:true},
        {name:"y", val:"0x10A0 (int: 100)", hi:false}
      ],
      heap:[
        {id:"0x10A0", type:"int", refcnt:"1", val:"100", note:"仅剩 y 独占 (refcnt=1)", hi:false, warn:false},
        {id:"0x10A8", type:"int", refcnt:"1", val:"101", note:"⚡ x 重绑定至新对象地址", hi:true, warn:false}
      ]
    },
    {
      title:"Step 3：创建嵌套列表并执行 b = a（可变列表别名 Aliasing）",
      badge:"Mutable Aliasing · 引用复制",
      badgeCls:"py-st-blue",
      desc:"执行 a = [10, [20, 30]] 在堆上创建了外层 list (id: 0x2000) 和嵌套的内层 list (id: 0x2050)。执行 b = a 时，仅仅把外层容器的引用复制了一份给 b。此时 a 和 b 指向完全相同的内存，修改任何一处都会互相影响。",
      links:["a ──\x3e 0x2000 (list外层)","b ──\x3e 0x2000 (list外层，完全别名)","a is b ➔ True"],
      ns:[
        {name:"a", val:"0x2000 (list外层)", hi:true},
        {name:"b", val:"0x2000 (list外层)", hi:true}
      ],
      heap:[
        {id:"0x2000", type:"list", refcnt:"2", val:"[10, ref➔0x2050]", note:"外层列表 (shared by a & b)", hi:true, warn:false},
        {id:"0x2050", type:"list", refcnt:"2", val:"[20, 30]", note:"内层嵌套列表 (shared)", hi:false, warn:false}
      ]
    },
    {
      title:"Step 4：执行 c = a.copy()（浅拷贝触发 Shallow Copy）",
      badge:"Shallow Copy · 仅克隆外层容器",
      badgeCls:"py-st-amber",
      desc:"调用 a.copy() 或 list(a) 会进行浅拷贝：Python 在堆上开辟了一个全新的外层列表对象 (id: 0x3000)，因此 a is c 为 False。但是，浅拷贝【仅仅复制了外层容器的元素引用】，嵌套的内层列表仍然指向同一个旧地址 0x2050！",
      links:["a ──\x3e 0x2000","c ──\x3e 0x3000 (新外层列表)","a[1] is c[1] ──\x3e 0x2050 (内层列表仍被共享！)"],
      ns:[
        {name:"a", val:"0x2000 (list外层)", hi:false},
        {name:"b", val:"0x2000 (list外层)", hi:false},
        {name:"c", val:"0x3000 (list外层 - 浅拷贝)", hi:true}
      ],
      heap:[
        {id:"0x2000", type:"list", refcnt:"1", val:"[10, ref➔0x2050]", note:"a & b 共享的外层", hi:false, warn:false},
        {id:"0x3000", type:"list", refcnt:"1", val:"[10, ref➔0x2050]", note:"⚡ c 的新外层列表", hi:true, warn:false},
        {id:"0x2050", type:"list", refcnt:"3", val:"[20, 30]", note:"⚠️ 危险：内层列表被 a、b、c 同时共享引用", hi:false, warn:true}
      ]
    },
    {
      title:"Step 5：执行 c[1].append(40)（浅拷贝的连锁污染陷阱）",
      badge:"Shallow Copy Trap · 连锁修改污染",
      badgeCls:"py-st-rose",
      desc:"通过 c[1].append(40) 原地修改内层列表时，由于 0x2050 是共享的，内层列表变成了 [20, 30, 40]。结果导致 a[1] 和 b[1] 的内容也莫名其妙地被篡改了！这就是浅拷贝在处理嵌套可变对象时最容易踩的高频大坑。",
      links:["c[1].append(40) ──\x3e 修改共享内层 0x2050","a[1] / b[1] 被连带篡改为 [20, 30, 40]"],
      ns:[
        {name:"a", val:"0x2000", hi:false},
        {name:"b", val:"0x2000", hi:false},
        {name:"c", val:"0x3000 (已受影响)", hi:true}
      ],
      heap:[
        {id:"0x2000", type:"list", refcnt:"1", val:"[10, ref➔0x2050]", note:"a & b 外层", hi:false, warn:false},
        {id:"0x3000", type:"list", refcnt:"1", val:"[10, ref➔0x2050]", note:"c 外层", hi:false, warn:false},
        {id:"0x2050", type:"list", refcnt:"3", val:"[20, 30, 40]", note:"⚡ 内存原地被污染：a[1] 和 b[1] 被连带修改！", hi:true, warn:true}
      ]
    },
    {
      title:"Step 6：执行 d = copy.deepcopy(a)（深拷贝递归克隆彻底隔离）",
      badge:"Deep Copy · 递归克隆完全隔离",
      badgeCls:"py-st-green",
      desc:"调用 copy.deepcopy(a) 会启动递归遍历：不仅克隆外层列表 (id: 0x4000)，还会把所有嵌套的内层可变对象在堆上逐层完整复制出一份全新对象 (id: 0x4050)。此时对 d 的任何修改都与 a、b、c 毫无关系，实现了 100% 的内存隔离安全。",
      links:["d ──\x3e 0x4000 (全新外层列表)","d[1] ──\x3e 0x4050 (全新内层列表，独立隔离)"],
      ns:[
        {name:"a, b, c", val:"旧内存簇 (0x2000 / 0x3000 / 0x2050)", hi:false},
        {name:"d", val:"0x4000 (list外层 - 深拷贝)", hi:true}
      ],
      heap:[
        {id:"0x2050", type:"list", refcnt:"3", val:"[20, 30, 40]", note:"旧共享内层 (a/b/c 仍在共享)", hi:false, warn:true},
        {id:"0x4000", type:"list", refcnt:"1", val:"[10, ref➔0x4050]", note:"⚡ d 的全新克隆外层列表", hi:true, warn:false},
        {id:"0x4050", type:"list", refcnt:"1", val:"[20, 30, 40]", note:"✔ d 的全新克隆内层列表 (100% 独立隔离)", hi:true, warn:false}
      ]
    }
  ];
  window.__pyCur = 0;
  window.__pyGo = function(idx){
    if(idx !== 0 && idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4 && idx !== 5){return;}
    window.__pyCur = idx;
    var st = stages[idx];
    for(var b=0; b!==6; b++){
      var btn = document.getElementById("py-b"+b);
      if(btn){btn.className = (b===idx) ? "py-btn py-active" : "py-btn";}
    }
    var codeHtml = "";
    for(var i=0; i!==codeLines.length; i++){
      var cl = codeLines[i];
      var isAct = (cl.step === idx);
      var clickAttr = (cl.step !== -1) ? " onclick=\"window.__pyGo("+cl.step+")\"" : "";
      codeHtml += "\x3cdiv class=\"py-code-line"+(isAct?" py-line-active":"")+"\""+clickAttr+"\x3e";
      codeHtml += "\x3cspan class=\"py-ln\"\x3e"+cl.ln+"\x3c/span\x3e";
      codeHtml += "\x3cspan class=\"py-arrow\"\x3e"+(isAct?"➔":"")+"\x3c/span\x3e";
      codeHtml += "\x3cspan\x3e"+cl.text+"\x3c/span\x3e\x3c/div\x3e";
    }
    document.getElementById("py-code-box").innerHTML = codeHtml;
    var nsHtml = "";
    for(var n=0; n!==st.ns.length; n++){
      var ns = st.ns[n];
      var nCls = "py-ns-card" + (ns.hi?" py-ns-hi":"");
      nsHtml += "\x3cdiv class=\""+nCls+"\"\x3e";
      nsHtml += "\x3cspan class=\"py-ns-name\"\x3e"+ns.name+"\x3c/span\x3e";
      nsHtml += "\x3cspan class=\"py-ns-val\"\x3e"+ns.val+"\x3c/span\x3e";
      nsHtml += "\x3c/div\x3e";
    }
    document.getElementById("py-ns-box").innerHTML = nsHtml;
    var heapHtml = "";
    for(var h=0; h!==st.heap.length; h++){
      var hp = st.heap[h];
      var hCls = "py-heap-card" + (hp.hi?" py-heap-hi":"") + (hp.warn?" py-heap-warn":"");
      heapHtml += "\x3cdiv class=\""+hCls+"\"\x3e";
      heapHtml += "\x3cdiv class=\"py-heap-top\"\x3e\x3cspan class=\"py-h-id\"\x3e"+hp.id+"\x3c/span\x3e\x3cspan class=\"py-h-type\"\x3e"+hp.type+" (refcnt="+hp.refcnt+")\x3c/span\x3e\x3c/div\x3e";
      heapHtml += "\x3cdiv class=\"py-heap-body\"\x3e\x3cspan class=\"py-h-k\"\x3e存储值:\x3c/span\x3e\x3cspan class=\"py-h-v\"\x3e"+hp.val+"\x3c/span\x3e\x3c/div\x3e";
      if(hp.note){heapHtml += "\x3cdiv class=\"py-h-note\"\x3e"+hp.note+"\x3c/div\x3e";}
      heapHtml += "\x3c/div\x3e";
    }
    document.getElementById("py-heap-box").innerHTML = heapHtml;
    var linkHtml = "\x3cspan class=\"py-link-label\"\x3e对象引用拓扑：\x3c/span\x3e";
    for(var l=0; l!==st.links.length; l++){
      linkHtml += "\x3cspan class=\"py-link-pill\"\x3e"+st.links[l]+"\x3c/span\x3e";
    }
    document.getElementById("py-link-box").innerHTML = linkHtml;
    document.getElementById("py-st-title").textContent = st.title;
    var badgeEl = document.getElementById("py-st-badge");
    badgeEl.textContent = st.badge;
    badgeEl.className = "py-status " + st.badgeCls;
    document.getElementById("py-st-desc").textContent = st.desc;
  };
  window.__pyGo(0);
})();
</script>
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" style="display:none!important;" onload="if(!window.__pyGo){var s=document.createElement('script');s.text=document.getElementById('py-script-src').textContent;document.body.appendChild(s);}" />
</div>