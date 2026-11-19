# PowerShell 高频命令速查手册

> **核心主线就 5 步：进项目目录 → 建虚拟环境 → 激活环境 → 装依赖包 → 跑代码。**  
> 掌握下面这十几条高频命令，足以覆盖 95% 的 Windows 日常 Python 开发场景。

---

## 一、先认清两种提示符（新手第一大坑）

打开终端后，先看最左边的符号，千万别在错的地方输命令：

* **`PS C:\...>`**：你在 **PowerShell** 里。`cd`、`pip`、`python` 等命令都在这里输入。
* **`>>>`**：你进了 **Python 交互模式**。这里只能写 Python 代码；想退回 PowerShell，输入 `exit()` 回车即可。

---

## 二、目录切换与必备快捷键

终端默认只在**当前所在目录**找文件，进错目录就会报 `No such file or directory`。

| 想做什么 | 命令 | 备注 |
| :--- | :--- | :--- |
| 进入项目目录 | `cd "D:\projects\demo"` | 路径含空格必须加双引号 |
| 返回上一层 | `cd ..` | `..` 代表上一级，`.` 代表当前目录 |
| 查看当前目录文件 | `ls` | 确认 `main.py` 在不在里面 |
| 查看当前完整路径 | `pwd` | 迷路时看自己在哪 |
| 清屏 | `cls` | 满屏报错时一键清空 |

**3 个必用快捷键（效率翻倍）：**
* **`Tab`**：输前两个字母按 `Tab` 自动补全文件名/路径，彻底告别手打拼错。
* **`↑` / `↓`**：翻找之前敲过的历史命令，不用重复打字。
* **`Ctrl + C`**：程序卡死或进入死循环时，强制停止运行。

---

## 三、虚拟环境：给每个项目配独立“工具箱”

不同项目需要的库版本常常冲突，**每个项目单独建一个 `.venv` 虚拟环境**是最省心的习惯。

在项目根目录下执行：

```powershell
# 1. 创建虚拟环境（每个项目只需做一次）
python -m venv .venv

# 2. 激活环境（以后每次干活前执行）
.\.venv\Scripts\Activate.ps1

# 3. 退出环境（用完可退，不会删包）
deactivate
```

激活成功后，命令行最前面会出现 **`(.venv)`** 标记。

> **高频报错：激活时提示“在此系统上禁止运行脚本”怎么办？**  
> 在 PowerShell 里执行一次下面这句（输入 `Y` 回车），即可永久放行当前用户的本地脚本：
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
> 如果不想改任何设置，也可以不激活，直接指定环境里的 Python 运行：
> ```powershell
> .\.venv\Scripts\python.exe main.py
> ```

---

## 四、管理第三方库：统一用 `python -m pip`

比起直接敲 `pip`，强烈建议写成 **`python -m pip`**——它能保证装包时绝对对应当前这个 Python，避免“明明装了库，运行却说找不到”。

| 想做什么 | 命令 |
| :--- | :--- |
| 安装单个包 | `python -m pip install requests` |
| 升级指定包 | `python -m pip install -U requests` |
| 按清单批量安装 | `python -m pip install -r requirements.txt` |
| 导出依赖清单 | `python -m pip freeze \| Set-Content requirements.txt -Encoding utf8` |
| 查看已安装的包 | `python -m pip list` |
| 卸载指定包 | `python -m pip uninstall requests` |

**2 个实用小技巧：**
* **下载太慢？** 在 `install` 命令后加国内镜像源：
  ```powershell
  python -m pip install requests -i [https://pypi.tuna.tsinghua.edu.cn/simple](https://pypi.tuna.tsinghua.edu.cn/simple)
  ```
* **运行带 `pyproject.toml` 的本地开发项目？** 在项目根目录执行一次可编辑安装，之后改代码无需重装：
  ```powershell
  python -m pip install -e .
  ```

---

## 五、运行代码与排查环境

```powershell
# 1. 查看当前 Python 版本
python --version

# 2. 运行单个脚本文件
python main.py

# 3. 以模块方式运行包（如目录里有 __main__.py 时）
python -m 包名

# 4. 排查当前调用的是哪个 Python（装了多个版本时必查，注意要加 .exe）
where.exe python
```

---

## 六、实战照抄：拿到新项目直接这样跑

### 第一次打开项目（5 步）

```powershell
cd "D:\projects\demo"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

### 以后每天继续开发（只需 3 步）

```powershell
cd "D:\projects\demo"
.\.venv\Scripts\Activate.ps1
python main.py
```