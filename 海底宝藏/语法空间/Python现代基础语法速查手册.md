# Python现代基础语法速查手册

> **Python** 是一门以“可读性第一、开箱即用”为核心哲学的高级动态强类型解释型语言。  
> 简单来说，C/Java 更像手握精密游标卡尺从零雕琢零件，**而 Python 像一套高度标准化的乐高积木——用极简的缩进语法粘合底层 C/C++ 高性能库，让你把 90% 的精力花在业务逻辑而非繁琐的样板代码上。**

本手册面向日常开发速查与零基础系统入门，基于 **Python 3.10+** 现代语法标准编写，涵盖变量类型、流程控制、四大容器、函数与面向对象、异常处理以及最容易踩坑的 Pythonic 实战规范。

---

## 一、变量、数据类型与可变性

Python 无需提前声明变量类型，变量本质上是**指向内存中某个对象的引用标签**。理解“可变（Mutable）”与“不可变（Immutable）”是避开 80% 隐蔽 Bug 的关键：

| 数据类型 | 示例 | 是否可变 | 核心特性与常见用途 |
| :--- | :--- | :--- | :--- |
| **`int` / `float`** | `42`, `3.14`, `1_000_000` | 不可变 | `int` 支持任意大整数不溢出；支持下划线增强数字可读性 |
| **`bool`** | `True`, `False` | 不可变 | 本质是 `int` 的子类（`True == 1`, `False == 0`） |
| **`str`** | `"Hello"`, `f"Hi {name}"` | 不可变 | Unicode 字符串，支持切片、三引号多行文本与 f-string 格式化 |
| **`NoneType`** | `None` | 不可变 | 表示“空值/无返回值”，判断时**永远用 `is None`** 而非 `== None` |
| **`list`** | `[1, "a", True]` | **可变** | 有序动态数组，支持任意位置增删改与切片 |
| **`tuple`** | `(10, 20)`, `(42,)` | 不可变 | 有序只读序列，性能略高于列表，可作为字典的键（注意单元素需加逗号） |
| **`dict`** | `{"name": "TuKuai", "age": 25}` | **可变** | 哈希键值对映射，Python 3.7+ 起严格保持插入顺序，查找复杂度 $O(1)$ |
| **`set`** | `{1, 2, 3}`, `set()` | **可变** | 无序不重复集合，极速去重与集合交并差运算（空集合必须用 `set()`） |

### 字符串格式化（首选 f-string）

```python
name, score, pi = "TuKuai", 98.5, 3.1415926
print(f"玩家 {name} 得分: {score:.1f}, 圆周率: {pi:.2f}")
print(f"{score=}")  # 调试神技，直接输出: score=98.5
```

---

## 二、运算符与流程控制

Python 摒弃了大括号 `{}`，强制使用 **4 个空格缩进** 划分代码块。

### 1. 常用运算符速查

- **算术**：`+`、`-`、`*`、`/`（浮点除，如 `5 / 2 == 2.5`）、`//`（整除，`5 // 2 == 2`）、`%`（取余）、`**`（幂运算，`2 ** 10 == 1024`）
- **逻辑**：`and`、`or`、`not`（支持短路求值）
- **成员与身份**：`in` / `not in`（判断元素是否存在于容器中）、`is` / `is not`（判断是否为同一内存对象）
- **海象运算符（Python 3.8+）**：`:=`，允许在表达式内部直接赋值并复用

### 2. 条件分支与模式匹配

```python
# 1. 常规条件判断与链式比较
score = 88
if 90 <= score <= 100:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "C"

# 2. 三元表达式（单行条件赋值）
status = "及格" if score >= 60 else "不及格"

# 3. 结构化模式匹配（Python 3.10+，比传统 switch 更强大）
command = ("move", 10, 20)
match command:
    case ("quit",):
        print("退出程序")
    case ("move", x, y):
        print(f"移动到坐标 ({x}, {y})")
    case _:
        print("未知指令")
```

### 3. 循环与优雅迭代

```python
# range(起始, 结束不含, 步长)
for i in range(0, 10, 2):
    print(i, end=" ")  # 0 2 4 6 8

# enumerate：同时拿到索引和元素（告别手写 i += 1）
tools = ["ToolKit", "PyKuai", "BlackHole"]
for idx, name in enumerate(tools, start=1):
    print(f"{idx}. {name}")

# zip：并行遍历多个序列
versions = ["2.0", "1.2.7", "1.2.3"]
for name, ver in zip(tools, versions):
    print(f"{name} v{ver}")
```

---

## 三、四大容器核心操作与推导式

### 1. 序列切片（Slicing）黄金公式

格式为 **`seq[start : stop : step]`**（左闭右开，包含 `start`，不包含 `stop`）：

```python
nums = [10, 20, 30, 40, 50, 60]
nums[1:4]      # [20, 30, 40]
nums[:3]       # [10, 20, 30]（从头开始）
nums[-2:]      # [50, 60]（取最后两个）
nums[::2]      # [10, 30, 50]（隔一个取一个）
nums[::-1]     # [60, 50, 40, 30, 20, 10]（一键反转）
```

### 2. 字典与集合高频用法

```python
# 字典安全取值与合并
user = {"name": "TuKuai", "role": "dev"}
lang = user.get("lang", "Python")      # 键不存在时返回默认值，不抛 KeyError
merged = user | {"level": 99}          # Python 3.9+ 字典合并运算符

# 遍历键值对
for k, v in user.items():
    print(f"{k} -> {v}")

# 集合去重与交并差
a, b = {1, 2, 3}, {2, 3, 4}
print(a & b)   # 交集 {2, 3}
print(a | b)   # 并集 {1, 2, 3, 4}
print(a - b)   # 差集 {1}
```

### 3. 推导式（Comprehensions）

用一行可读性极高的表达式替代繁琐的 `for` + `append`：

```python
# 列表推导式：筛选偶数并求平方
squares = [x ** 2 for x in range(10) if x % 2 == 0]  # [0, 4, 16, 36, 64]

# 字典推导式：键值互换
rev = {v: k for k, v in user.items()}

# 生成器表达式（圆括号）：惰性求值，处理百万级数据几乎不占内存
total = sum(x * x for x in range(1_000_000))
```

---

## 四、交互实验室：Python 切片与推导式可视化沙盒

切片的负数索引、步长方向以及左闭右开边界是新手最容易绕晕的地方。你可以直接在下方实验室调整 `start`、`stop`、`step` 或切换推导式规则，实时查看每个索引格子的命中状态与生成结果：

<style>
.tk-py {
  --py-bg: rgba(24, 24, 27, 0.72);
  --py-panel: rgba(39, 39, 42, 0.55);
  --py-sub: #0d0d10;
  --py-border: rgba(255, 255, 255, 0.1);
  --py-accent: #10b981;
  --py-blue: #38bdf8;
  --py-amber: #f59e0b;
  --py-purple: #a78bfa;
  --py-text: #f4f4f5;
  --py-muted: #a1a1aa;
  box-sizing: border-box;
  margin: 20px 0 24px;
  padding: 18px;
  border: 1px solid var(--py-border);
  border-radius: 16px;
  background: var(--py-bg);
  color: var(--py-text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
body.theme-light .tk-py {
  --py-bg: rgba(255, 250, 253, 0.85);
  --py-panel: rgba(243, 232, 255, 0.52);
  --py-sub: rgba(255, 255, 255, 0.92);
  --py-border: rgba(236, 72, 153, 0.22);
  --py-accent: #ec4899;
  --py-blue: #0284c7;
  --py-amber: #d97706;
  --py-purple: #7c3aed;
  --py-text: #2e1065;
  --py-muted: #6d597a;
  box-shadow: 0 12px 32px rgba(167, 139, 250, 0.16);
}
.tk-py, .tk-py *, .tk-py *::before, .tk-py *::after { box-sizing: border-box; }
.tk-py-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--py-border);
}
.tk-py-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--py-text);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tk-py-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--py-accent);
  box-shadow: 0 0 10px var(--py-accent);
}
.tk-py-legend { font-size: 12px; color: var(--py-muted); }
.tk-py-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 12px;
}
.tk-py-btn {
  appearance: none;
  border: 1px solid var(--py-border);
  background: var(--py-panel);
  color: var(--py-text);
  padding: 6px 11px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
  font-family: inherit;
}
.tk-py-btn:hover {
  border-color: var(--py-accent);
  color: var(--py-accent);
  transform: translateY(-1px);
}
.tk-py-form {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}
.tk-py-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tk-py-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--py-muted);
}
.tk-py-input, .tk-py-select {
  width: 100%;
  padding: 7px 10px;
  border-radius: 9px;
  border: 1px solid var(--py-border);
  background: var(--py-sub);
  color: var(--py-text);
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12.5px;
  outline: none;
}
.tk-py-input:focus, .tk-py-select:focus { border-color: var(--py-accent); }
.tk-py-cells {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 12px;
}
.tk-py-cell {
  background: var(--py-sub);
  border: 1px solid var(--py-border);
  border-radius: 10px;
  padding: 8px 4px;
  text-align: center;
  font-family: 'JetBrains Mono', Consolas, monospace;
  transition: all 0.18s ease;
}
.tk-py-cell.is-hit {
  border-color: var(--py-accent);
  background: rgba(16, 185, 129, 0.16);
  transform: translateY(-2px);
}
body.theme-light .tk-py-cell.is-hit { background: rgba(236, 72, 153, 0.14); }
.tk-py-idx-pos { font-size: 10.5px; color: var(--py-blue); }
.tk-py-val { font-size: 15px; font-weight: 700; color: var(--py-text); margin: 3px 0; }
.tk-py-idx-neg { font-size: 10.5px; color: var(--py-amber); }
.tk-py-out {
  background: var(--py-panel);
  border: 1px solid var(--py-border);
  border-radius: 12px;
  padding: 12px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.75;
}
.tk-py-expr { color: var(--py-blue); font-weight: 700; }
.tk-py-res { color: var(--py-accent); font-weight: 700; }
@media (max-width: 760px) {
  .tk-py { padding: 14px; }
  .tk-py-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tk-py-cells { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>

<section id="tk-py-lab" class="tk-py" aria-label="Python 切片与推导式可视化沙盒">
  <div class="tk-py-head">
    <div class="tk-py-title"><span class="tk-py-dot"></span><span>Python 切片索引与列表推导式可视化沙盒</span></div>
    <span class="tk-py-legend">蓝字 = 正向索引 (0..7) ｜ 橙字 = 负向索引 (-8..-1) ｜ 绿框 = 切片命中元素</span>
  </div>
  <div class="tk-py-presets">
    <button type="button" class="tk-py-btn" id="tk-py-p0">基础切片 [1:5]</button>
    <button type="button" class="tk-py-btn" id="tk-py-p1">后三位 [-3:]</button>
    <button type="button" class="tk-py-btn" id="tk-py-p2">隔位采样 [::2]</button>
    <button type="button" class="tk-py-btn" id="tk-py-p3">一键反转 [::-1]</button>
    <button type="button" class="tk-py-btn" id="tk-py-p4">逆序截取 [6:1:-2]</button>
  </div>
  <div class="tk-py-form">
    <div class="tk-py-field">
      <span class="tk-py-label">start（留空=默认）</span>
      <input id="tk-py-start" class="tk-py-input" type="text" value="1" placeholder="如 1 或 -3">
    </div>
    <div class="tk-py-field">
      <span class="tk-py-label">stop（不含，留空=默认）</span>
      <input id="tk-py-stop" class="tk-py-input" type="text" value="5" placeholder="如 5 或 -1">
    </div>
    <div class="tk-py-field">
      <span class="tk-py-label">step（步长，不能为 0）</span>
      <input id="tk-py-step" class="tk-py-input" type="text" value="1" placeholder="如 1, 2, -1">
    </div>
    <div class="tk-py-field">
      <span class="tk-py-label">追加列表推导式变换</span>
      <select id="tk-py-comp" class="tk-py-select">
        <option value="none" selected>无（仅观察纯切片）</option>
        <option value="sq">[x ** 2 for x in sliced]</option>
        <option value="even">[x for x in sliced if x % 2 == 0]</option>
        <option value="str">[f"#{x}" for x in sliced]</option>
      </select>
    </div>
  </div>
  <div class="tk-py-cells" id="tk-py-cells"></div>
  <div class="tk-py-out">
    <div>执行表达式：<span id="tk-py-expr" class="tk-py-expr"></span></div>
    <div>最终返回值：<span id="tk-py-res" class="tk-py-res"></span></div>
  </div>
</section>

<script>
(function () {
  var lab = document.getElementById('tk-py-lab');
  if (!lab || lab.dataset.ready === '1') return;
  lab.dataset.ready = '1';

  var data = [10, 15, 20, 25, 30, 35, 40, 45];
  var elStart = document.getElementById('tk-py-start');
  var elStop = document.getElementById('tk-py-stop');
  var elStep = document.getElementById('tk-py-step');
  var elComp = document.getElementById('tk-py-comp');
  var elCells = document.getElementById('tk-py-cells');
  var elExpr = document.getElementById('tk-py-expr');
  var elRes = document.getElementById('tk-py-res');

  function parseOptInt(s) {
    var t = (s || '').trim();
    if (t === '') return null;
    if (!/^-?\d+$/.test(t)) return NaN;
    return parseInt(t, 10);
  }

  function pySliceIndices(len, start, stop, step) {
    var st = step === null ? 1 : step;
    if (st === 0) return null;
    var s, e;
    if (st > 0) {
      s = start === null ? 0 : (start < 0 ? Math.max(len + start, 0) : Math.min(start, len));
      e = stop === null ? len : (stop < 0 ? Math.max(len + stop, 0) : Math.min(stop, len));
    } else {
      s = start === null ? len - 1 : (start < 0 ? Math.max(len + start, -1) : Math.min(start, len - 1));
      e = stop === null ? -1 : (stop < 0 ? Math.max(len + stop, -1) : Math.min(stop, len - 1));
    }
    var idxs = [];
    if (st > 0) {
      for (var i = s; i < e; i += st) idxs.push(i);
    } else {
      for (var j = s; j > e; j += st) idxs.push(j);
    }
    return idxs;
  }

  function render() {
    var start = parseOptInt(elStart.value);
    var stop = parseOptInt(elStop.value);
    var step = parseOptInt(elStep.value);
    var comp = elComp.value;

    var invalid = isNaN(start) || isNaN(stop) || isNaN(step) || step === 0;
    var hitIdxs = invalid ? [] : pySliceIndices(data.length, start, stop, step);

    while (elCells.firstChild) elCells.removeChild(elCells.firstChild);
    data.forEach(function (val, idx) {
      var cell = document.createElement('div');
      cell.className = 'tk-py-cell' + (hitIdxs && hitIdxs.indexOf(idx) !== -1 ? ' is-hit' : '');
      var p = document.createElement('div'); p.className = 'tk-py-idx-pos'; p.textContent = String(idx);
      var v = document.createElement('div'); v.className = 'tk-py-val'; v.textContent = String(val);
      var n = document.createElement('div'); n.className = 'tk-py-idx-neg'; n.textContent = String(idx - data.length);
      cell.appendChild(p); cell.appendChild(v); cell.appendChild(n);
      elCells.appendChild(cell);
    });

    if (invalid) {
      elExpr.textContent = 'ValueError: slice step cannot be zero (或输入了非整数)';
      elRes.textContent = '请修正参数';
      return;
    }

    var sStr = start === null ? '' : String(start);
    var eStr = stop === null ? '' : String(stop);
    var stepStr = (step === null || step === 1) ? '' : (':' + step);
    var sliceExpr = 'nums[' + sStr + ':' + eStr + stepStr + ']';
    var sliced = hitIdxs.map(function (i) { return data[i]; });

    if (comp === 'none') {
      elExpr.textContent = sliceExpr;
      elRes.textContent = '[' + sliced.join(', ') + ']';
    } else if (comp === 'sq') {
      elExpr.textContent = '[x ** 2 for x in ' + sliceExpr + ']';
      elRes.textContent = '[' + sliced.map(function (x) { return x * x; }).join(', ') + ']';
    } else if (comp === 'even') {
      elExpr.textContent = '[x for x in ' + sliceExpr + ' if x % 2 == 0]';
      elRes.textContent = '[' + sliced.filter(function (x) { return x % 2 === 0; }).join(', ') + ']';
    } else {
      elExpr.textContent = '[f"#{x}" for x in ' + sliceExpr + ']';
      elRes.textContent = '[' + sliced.map(function (x) { return '"#' + x + '"'; }).join(', ') + ']';
    }
  }

  function setPreset(s, e, st) {
    elStart.value = s; elStop.value = e; elStep.value = st;
    render();
  }

  document.getElementById('tk-py-p0').addEventListener('click', function () { setPreset('1', '5', '1'); });
  document.getElementById('tk-py-p1').addEventListener('click', function () { setPreset('-3', '', '1'); });
  document.getElementById('tk-py-p2').addEventListener('click', function () { setPreset('', '', '2'); });
  document.getElementById('tk-py-p3').addEventListener('click', function () { setPreset('', '', '-1'); });
  document.getElementById('tk-py-p4').addEventListener('click', function () { setPreset('6', '1', '-2'); });

  [elStart, elStop, elStep].forEach(function (el) { el.addEventListener('input', render); });
  elComp.addEventListener('change', render);
  render();
})();
</script>

---

## 五、函数、类型注解与装饰器

现代 Python 强烈建议为函数参数和返回值加上**类型注解（Type Hints）**——它不影响运行速度，但能让 IDE 自动补全与静态检查（mypy / Pyright）精准度翻倍：

```python
# 1. 标准函数：默认参数 + 类型注解 + 多返回值（本质返回元组）
def calc_stats(nums: list[int], scale: float = 1.0) -> tuple[int, float]:
    total = sum(nums)
    avg = (total / len(nums)) * scale if nums else 0.0
    return total, avg

# 2. 可变参数：*args 接收多余位置参数（元组），**kwargs 接收关键字参数（字典）
def log_event(event: str, *tags: str, **meta: str | int) -> None:
    print(f"[{event}] tags={tags}, meta={meta}")

# 3. 匿名函数 lambda（适合作为排序 key）
users = [{"name": "A", "score": 80}, {"name": "B", "score": 95}]
users.sort(key=lambda u: u["score"], reverse=True)
```

---

## 六、面向对象、Dataclass 与资源安全管理

### 1. 现代数据类 `@dataclass`（告别手写冗长 `__init__`）

```python
from dataclasses import dataclass, field

@dataclass
class Player:
    name: str
    level: int = 1
    skills: list[str] = field(default_factory=list)  # 可变默认值必须用 default_factory

    def level_up(self) -> None:
        self.level += 1

p = Player("TuKuai", level=10)
p.level_up()
print(p)  # 自动生成美观的 __repr__：Player(name='TuKuai', level=11, skills=[])
```

### 2. 异常处理与 `with` 上下文管理器

读写文件、操作数据库连接或网络 Socket 时，**永远使用 `with` 语句**，确保即使中途抛出异常也能自动关闭资源，防止句柄泄漏：

```python
from pathlib import Path

config_path = Path("config.json")
try:
    with config_path.open("r", encoding="utf-8") as f:
        content = f.read()
except FileNotFoundError:
    print("配置文件不存在，启用默认配置")
except UnicodeDecodeError as e:
    print(f"文件编码错误: {e}")
else:
    print("读取成功，长度:", len(content))  # 仅在无异常时执行
finally:
    print("清理收尾逻辑")                   # 无论是否异常都必然执行
```

---

## 七、新手必看的 5 个经典避坑清单

| 常见翻车写法 | 踩坑原因 | 正确 Pythonic 写法 |
| :--- | :--- | :--- |
| `def add(item, box=[]):` | **可变默认参数陷阱**：`box=[]` 只在函数定义时创建一次，所有调用会共享同一个列表 | `def add(item, box=None):` 函数内写 `box = [] if box is None else box` |
| `if x == None:` | 可能被自定义 `__eq__` 误导且不符合 PEP 8 | `if x is None:` |
| `b = a`（当 `a` 是列表/字典） | 仅仅复制了引用，修改 `b` 会同步改坏 `a` | 浅拷贝 `b = a.copy()`；嵌套结构用 `copy.deepcopy(a)` |
| `s = ""` 后循环 `s += chunk` | 字符串不可变，每次拼接都会重新申请内存拷贝 | `"".join(chunks)` 一次性合并 |
| `except:` 裸捕获所有异常 | 会把 `Ctrl+C`（`KeyboardInterrupt`）和系统退出也吞掉 | `except Exception as e:`（尽量捕获具体异常类型） |

---

## 八、总结

写好 Python 的秘诀不在于死记硬背所有标准库，而在于掌握它最核心的四根支柱：

- **理解对象与可变性**：分清 `list`/`dict`/`set` 与 `tuple`/`str` 的边界，就能避开绝大多数引用污染和默认参数陷阱；
- **善用内置原语**：用 `enumerate`、`zip`、切片和推导式替代繁琐的下标循环，让代码既短又快；
- **拥抱现代特性**：养成使用 `f-string`、`pathlib.Path`、`with` 上下文管理器、`@dataclass` 和类型注解的习惯，你的脚本就能无缝平滑演进为可维护的大型工程。