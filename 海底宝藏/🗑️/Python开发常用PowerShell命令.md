# Python开发常用PowerShell命令

> **做 Python 开发，先记住这条主线：进对项目文件夹 → 建独立虚拟环境 → 激活环境 → 安装依赖包 → 运行代码。**  
> 跑通这条主线，再顺手掌握几个常用路径、管道和文件命令，就能轻松应对 Windows 下绝大部分日常开发场景。

---

## 一、先分清三个角色：PowerShell、Python 和 pip

把它们想象成一个木工坊里的三个角色：

- **PowerShell**：你的**工作台**，用来切换文件夹、查看文件、启动各种程序；
- **`python`**：真正的**执行引擎**，负责跑 `.py` 代码；
- **`pip`**：专门给当前 Python **采购第三方库**的管理员。

```powershell
cd "D:\projects\demo"
python main.py
```

第一行由 PowerShell 负责走进项目目录；第二行由 PowerShell 唤醒 `python` 去执行 `main.py`。

> **最常见的新手误区**：  
> 看到提示符是 `PS C:\...>`，说明你正在 **PowerShell** 里；看到变成了 `>>>`，说明已经进入 **Python 交互环境**。`pip install`、`cd` 等命令必须在 `PS >` 里输入；如果误入了 `>>>`，输入 `exit()` 回车即可退回。

---

## 二、目录导航：站对文件夹再干活

很多命令默认只在**当前所在目录**找文件，站错目录就会报错“找不到文件”。

| 想做什么 | 常用写法 | 说明 |
| :--- | :--- | :--- |
| 看现在在哪个目录 | `pwd`（或 `Get-Location`） | 显示当前完整路径 |
| 看当前目录有什么 | `ls`（或 `Get-ChildItem`） | 列出文件与子文件夹 |
| 进入指定项目目录 | `cd "D:\projects\demo"` | 切换工作目录 |
| 返回上一层目录 | `cd ..` | 退回父文件夹 |
| 进入子文件夹 | `cd .\src` | 进入当前目录下的 `src` |

**必认的三个路径符号**：
- **`.`**：当前所在目录（例如 `pip install -e .` 里的 `.` 就代表“安装当前目录的项目”）
- **`..`**：上一层父目录
- **`""`**：路径里只要带空格，就用双引号包起来，如 `cd "D:\My Python Projects\demo"`

---

## 三、查看与运行 Python

```powershell
# 1. 查看默认 Python 版本
python --version

# 2. 运行当前目录下的脚本
python .\main.py

# 3. 查清当前调用的到底是哪个 Python 路径（多版本共存时极有用）
python -c "import sys; print(sys.executable)"
```

- `-c` 表示让 Python 直接执行后面引号里的这小段代码；
- 如果电脑上同时装了多个 Python，或提示找不到 `python`，在 Windows 上也可以试试官方启动器 `py --version`；
- 程序正在运行想强制中断时，按 **`Ctrl + C`**。

---

## 四、虚拟环境：给每个项目配独立的“工具箱”

如果 A 项目需要旧版工具、B 项目需要新版工具，全部装在系统全局环境里就会互相打架。**虚拟环境（`.venv`）** 就是给单个项目单独准备的一套隔离工具箱。

在项目根目录运行：

```powershell
# 1. 创建名为 .venv 的虚拟环境（每个项目只需创建一次）
python -m venv .venv

# 2. 激活环境（以后每次新开终端干活都要先跑这句）
.\.venv\Scripts\Activate.ps1

# 3. 用完退出环境（不会删除已装好的包）
deactivate
```

激活成功后，终端最前面会出现 **`(.venv)`** 标记。这里的 `-m` 意思是“让当前 Python 运行它自带的某个内置模块”。

> **遇到“在此系统上禁止运行脚本”怎么办？**  
> 无需急着改系统执行策略，直接点名使用 `.venv` 里面的 `python.exe` 即可，效果完全一样：
> ```powershell
> .\.venv\Scripts\python.exe .\main.py
> .\.venv\Scripts\python.exe -m pip install requests
> ```

---

## 五、管理第三方库：优先用 `python -m pip`

比起直接敲 `pip`，更推荐写成 **`python -m pip`**——它能确保调用的正是当前这套 Python 对应的装包工具，避免“明明装了库，运行却提示找不到”的多版本错位问题。

| 常见需求 | 推荐命令 | 说明 |
| :--- | :--- | :--- |
| 安装单个包 | `python -m pip install requests` | 安装指定第三方库 |
| 按清单批量安装 | `python -m pip install -r requirements.txt` | 读取项目依赖清单安装 |
| 导出当前环境清单 | <code>python -m pip freeze &#124; Set-Content .\requirements.txt -Encoding utf8</code> | 备份已安装的包与版本号为 UTF-8 清单（会覆盖原文件） |
| 查看已安装的包 | `python -m pip list` | 列出当前环境所有包 |
| 查看某个包详情 | `python -m pip show requests` | 查看版本与安装位置 |
| 检查依赖冲突 | `python -m pip check` | 检查是否有缺失或版本不兼容 |
| 卸载指定包 | `python -m pip uninstall requests` | 移除不再需要的包 |

### 顺便看懂两个常见参数：`-e .` 与 `--no-deps`

- **`python -m pip install -e .`**（可编辑安装）：适合带 `pyproject.toml` 或 `setup.py` 的本地工程。它会把当前源码目录直接链接进环境，改完源码后不用反复重新安装。
- **`python -m pip install -e . --no-deps`**：只安装当前项目本身，**不自动连带安装依赖包**（常用于依赖已提前手工装好、或需避开某些依赖重装的场景）。

---

## 六、看懂常见 PowerShell 符号与语法

在项目脚本或技术文档里，经常会见到下面几种写法：

### 1. 变量与单双引号

```powershell
$project = "demo"
"项目名称：$project"   # 双引号会替换变量 -> 输出：项目名称：demo
'项目名称：$project'   # 单引号原样输出 -> 输出：项目名称：$project
```

### 2. 执行带空格的程序路径（`&` 调用符）

```powershell
& "D:\My Python\python.exe" .\main.py
```

在 PowerShell 里，单独写一个带引号的路径只会被当成普通字符串，前面加上 **`&`** 才会真正去运行它。

### 3. 临时环境变量（`$env:`）

```powershell
$env:APP_MODE = "dev"
python -c "import os; print(os.environ.get('APP_MODE'))"
```

`$env:` 设置的变量只对**当前终端窗口及它启动的程序**生效，关闭窗口就会恢复，不会污染系统全局设置。

### 4. 管道筛选（`|`）

管道 `|` 就像流水线传送带，把上一条命令找出来的对象交给下一条筛选：

```powershell
# 列出当前目录下所有扩展名为 .py 的文件
Get-ChildItem -File | Where-Object { $_.Extension -eq ".py" }
```

其中 `$_` 代表流水线上正在检查的“当前那一项”，`-eq` 表示“等于”（同理 `-ne` 为不等于，`-gt` 为大于）。

### 5. 条件判断与批量循环

```powershell
# 判断文件是否存在后再运行
if (Test-Path .\main.py) {
    python .\main.py
} else {
    Write-Output "当前目录找不到 main.py"
}

# 遍历打印所有 .py 文件名
foreach ($file in Get-ChildItem -File -Filter *.py) {
    Write-Output $file.Name
}
```

> **版本小坑**：Windows 自带的旧版 **PowerShell 5.1 不支持 `&&`**，只有新版 **PowerShell 7+** 才支持。平时写多条命令直接**换行写**最稳妥；另外分号 `;` 只代表顺序分隔，不会因为前一条失败就停下。

---

## 七、日常文件操作与帮助速查

| 想做什么 | 常用命令 |
| :--- | :--- |
| 查看文本内容 | `Get-Content .\requirements.txt` |
| 新建文件夹 | `New-Item -ItemType Directory -Path .\data` |
| 覆盖写入文本 | `Set-Content .\note.txt "内容" -Encoding utf8` |
| 在末尾追加文本 | `Add-Content .\note.txt "追加一行" -Encoding utf8` |
| 复制 / 重命名 | `Copy-Item a.txt b.txt` / `Rename-Item b.txt c.txt` |
| **安全预览删除** | `Remove-Item .\old.txt -WhatIf`（加 `-WhatIf` 只演示不真删） |
| 查命令指向哪个文件 | `Get-Command python` |
| 看命令官方示例 | `Get-Help Get-ChildItem -Examples` |

---

## 八、把流程串起来：接手一个新项目的标准 6 步

拿到一个现成的 Python 项目（如 `D:\projects\demo`）时，按顺序走完下面 6 步即可开跑：

```powershell
# 1. 进入项目目录
cd "D:\projects\demo"

# 2. 创建独立虚拟环境（首次需要）
python -m venv .venv

# 3. 激活环境
.\.venv\Scripts\Activate.ps1

# 4. 安装项目依赖
python -m pip install -r requirements.txt

# 5. 运行主程序
python .\main.py

# 6. 结束工作，退出虚拟环境
deactivate
```

以后再次打开电脑继续开发这个项目时，通常只需执行 **第 1 步（进目录）→ 第 3 步（激活）→ 第 5 步（运行）** 三条命令即可。
