**做 Python 开发，先掌握这条路线：找到项目文件夹 → 给项目准备独立的工具箱 → 装好需要的工具 → 运行代码。接着再学变量、管道和简单判断，就能应付很多日常操作。**

本文面向 Windows 下使用 PowerShell 的初学者。下面是供学习的命令示例，没有在你的电脑上执行安装或修改项目。

**一、先分清：PowerShell 和 Python 各自做什么**

你可以把 PowerShell 当成工作台：在这里切换文件夹、找文件、启动其他工具。

```powershell
cd "D:\projects\demo"
python main.py
```

第一行让 PowerShell 进入项目文件夹；第二行让它启动 Python，由 Python 执行 `main.py`。

`cd` 属于 PowerShell 的命令；`python` 是被启动的程序；`pip` 则是 Python 用来安装第三方工具的包管理工具。

> 看到 `PS C:\...>`，通常是在 PowerShell；看到 Python 的 `>>>`，已经进入 Python 的交互窗口。`pip install ...` 这类终端命令应该在 PowerShell 中输入。如果误入 `>>>`，输入 `exit()` 返回。

**二、找位置、看文件、进文件夹**

先把“当前目录”理解成：**你现在站在哪个文件夹里。** 很多命令都会从这里找文件。

| 想做什么 | 常用写法 | 解释 |
|---|---|---|
| 看现在在哪 | `Get-Location` 或 `pwd` | 显示当前位置 |
| 看当前目录有什么 | `Get-ChildItem` 或 `ls` | 列出文件和文件夹 |
| 进入项目 | `cd "D:\projects\demo"` | 切换到指定文件夹 |
| 返回上一层 | `cd ..` | 从当前文件夹退回父文件夹 |
| 进入当前目录下的子文件夹 | `cd .\src` | 进入当前目录里的 `src` |

这三个符号必须认识：

```text
.          当前目录
..         上一层目录
.\main.py  当前目录里的 main.py
```

例如 `pip install -e .` 中的点，就是“安装我现在所在目录里的项目”。如果站错文件夹，命令就会找错地方。

路径带空格时用引号包住：

```powershell
cd "D:\My Python Projects\demo"
```

**三、找到 Python，并运行程序**

```powershell
# 看 Python 版本
python --version

# 运行当前文件夹里的程序
python .\main.py

# 看这次运行的 Python 实际放在哪里
python -c "import sys; print(sys.executable)"
```

第三条很实用：电脑上可能有好几套 Python，它能告诉你现在真正用的是哪一套。`-c` 表示“执行后面这小段 Python 代码”。

如果提示找不到 `python`，先检查 Python 是否安装、命令是否配置好；Windows 上也可以检查 `py --version` 是否可用。[Python Windows 使用说明](https://docs.python.org/3/using/windows.html)

运行后想中断当前程序，通常按 **Ctrl+C**。

**四、每个项目准备自己的“工具箱”**

假设 A 项目需要旧版工具，B 项目需要新版工具。如果全塞进同一个箱子，就容易互相影响。

给每个项目单独准备一套 Python 工具和第三方库，通常就能避免这种冲突。这个项目专用的工具箱，叫作**虚拟环境**。

在项目目录运行：

```powershell
# 1. 创建名为 .venv 的环境目录
python -m venv .venv

# 2. 让当前终端优先使用它
.\.venv\Scripts\Activate.ps1
```

创建通常做一次；以后重新开终端、继续做这个项目时，再执行激活命令。激活后，终端开头通常会出现 `(.venv)`。

这里的 `-m` 可以理解为：“请这套 Python 运行它里面的某个工具。”因此 `python -m venv` 是运行创建环境的工具，后面的 `python -m pip` 是运行装包工具。

项目源码放在项目文件夹里，`.venv` 专门存放环境。用完后退出：

```powershell
deactivate
```

退出不会删除环境。虚拟环境和激活方式见 [Python 官方文档](https://docs.python.org/3/library/venv.html)。

> 如果激活脚本提示“禁止运行脚本”，可以直接点名使用环境里的 Python，无需先修改系统策略：
>
> ```powershell
> .\.venv\Scripts\python.exe .\main.py
> .\.venv\Scripts\python.exe -m pip install requests
> ```

**五、装工具：优先记住 `python -m pip`**

把 `pip` 想成负责给 Python 领工具的人。使用 `python -m pip`，就是明确让“这套 Python 自己的采购员”办事，减少把东西装进另一套 Python 的情况。

以下命令在你打算使用的环境中运行：

| 想做什么 | 命令 | 解释 |
|---|---|---|
| 装一个第三方包 | `python -m pip install requests` | 安装 HTTP 请求工具 requests |
| 按清单装包 | `python -m pip install -r requirements.txt` | 读取项目提供的依赖清单 |
| 看装了哪些包 | `python -m pip list` | 列出当前环境中的包 |
| 查看一个包的详情 | `python -m pip show requests` | 看版本、安装位置等 |
| 卸载一个包 | `python -m pip uninstall requests` | 移除指定包 |
| 检查声明的依赖是否满足 | `python -m pip check` | 找出缺失或版本不匹配的依赖 |

这里的“依赖”，就是**你的项目运行时还需要借用的其他工具**。例如程序用了 `requests`，环境里就需要装上它。

`requirements.txt` 像购物清单。例如里面写着 `requests`、`numpy`，`-r` 就表示“照着这个文件去装”。它不是 Python 项目的强制标准文件名，也不是每个项目都有；实际以项目说明为准。[pip 安装参数说明](https://pip.pypa.io/en/stable/cli/pip_install/)

**六、安装当前项目，以及记录已经装好的工具**

先看你刚问过的命令：

```powershell
python -m pip install -e .
```

普通安装可以想成给环境一份代码复印件；`-e` 则让环境使用项目目录里的源码。你修改普通 Python 代码后，通常重新运行程序就能用到修改，不必每次重新安装。这叫**可编辑安装**。

它应该用于配置好了 Python 包安装信息的项目，通常在根目录能看到相应的 `pyproject.toml` 或 `setup.py`；一个随便放了几个 `.py` 文件的目录，不一定可以这样安装。[pip 可编辑安装说明](https://pip.pypa.io/en/stable/topics/local-project-installs/)

加上 `--no-deps`：

```powershell
python -m pip install -e . --no-deps
```

意思是“安装当前项目，项目需要的其他包由我自己准备”。通常在依赖已经单独装好时使用；它仍可能需要获取构建工具，不保证完全离线。

> `install -r requirements.txt` 是“照清单装工具”；`install -e .` 是“把当前项目接入这个 Python 环境”。后者不会因为目录里存在 `requirements.txt`，就自动读取它。元数据或命令入口改变时可能要重装，编译扩展改变时可能要重新编译；已运行程序也不会自动热更新。

如果想把当前环境装了什么记录下来：

```powershell
python -m pip freeze | Set-Content -Path .\requirements.txt -Encoding utf8
```

它相当于给工具箱拍一张清单快照。**这条命令会覆盖已有的 `requirements.txt`**；它记录当前环境里的包和版本，不会分析哪些包才是源码真正需要的。

**七、最常见的 PowerShell 符号和语法**

**1. `$变量`：先把一个值记下来**

就像给盒子贴标签，以后可以用标签找到里面的东西：

```powershell
$projectName = 'demo'
$projectName
```

第一行保存名字，第二行查看保存的内容。

**2. 单引号和双引号：要不要替换变量**

```powershell
"项目名字是 $projectName"
'项目名字是 $projectName'
```

上例设置变量后，第一行显示“项目名字是 demo”；第二行保留原样，显示“项目名字是 $projectName”。

**3. `&`：启动被引号包住的程序路径**

```powershell
& "D:\My Python\python.exe" .\main.py
```

把示例路径替换成实际 Python 路径。引号让带空格的路径作为整体，前面的 `&` 表示“执行它”。只写一个带引号的路径，PowerShell 通常会把它当作文字。

**4. `$env:名称`：给后面启动的程序留一张配置便条**

```powershell
$env:APP_MODE = 'dev'
python -c "import os; print(os.environ.get('APP_MODE'))"
```

后面启动的 Python 可以读到 `dev`。这类值叫**环境变量**；这样设置主要影响当前终端和它之后启动的子进程，不是永久修改系统。

**5. `|`：把结果交给下一道工序**

把管道想成传送带：前面送出文件信息，后面把符合条件的留下：

```powershell
Get-ChildItem -File | Where-Object { $_.Extension -eq '.py' }
```

这句读作：“列出当前目录的文件，只留下扩展名是 `.py` 的。”

- `Get-ChildItem -File`：列出文件，不包含文件夹。
- `Where-Object`：按条件筛选。
- `$_`：当前正在检查的那个文件。
- `.Extension`：它的扩展名。
- `-eq`：是否相等。

这些文件信息还带着名称、大小等属性。PowerShell 命令之间传递的常常是带属性的数据，而不只是显示出来的文字。

**八、判断和循环：让电脑替你重复做事**

判断，就像“先看有没有钥匙，有了再开门”：

```powershell
if (Test-Path .\main.py) {
    python .\main.py
} else {
    Write-Output '当前文件夹没有 main.py'
}
```

`Test-Path` 检查文件是否存在；`if` 表示“如果”；`else` 表示“否则”。

循环，就是把同一个动作逐个做一遍：

```powershell
foreach ($file in Get-ChildItem -File -Filter *.py) {
    Write-Output $file.Name
}
```

这段代码逐个打印当前目录里的 Python 文件名，不会执行这些文件。

判断时最常见的三个写法：`-eq` 表示相等，`-ne` 表示不相等，`-gt` 表示大于。

> PowerShell 使用花括号 `{ }` 包住判断或循环的代码；Python 则主要使用缩进。Windows PowerShell 5.1 不支持 `&&`，PowerShell 7 才支持；刚开始学习时，把命令分行写即可。分号 `;` 只是分开命令，不表示“前一步成功才做下一步”。

**九、读文件、改文件和查看帮助**

下面是独立示例，文件名按实际情况替换：

| 想做什么 | 命令 |
|---|---|
| 查看文件内容 | `Get-Content .\requirements.txt` |
| 创建文件夹 | `New-Item -ItemType Directory -Path .\data` |
| 写入一段文本 | `Set-Content .\note.txt '学习 Python' -Encoding utf8` |
| 在文件末尾追加文本 | `Add-Content .\note.txt '今天学会了创建环境' -Encoding utf8` |
| 复制文件 | `Copy-Item .\note.txt .\note-backup.txt` |
| 重命名文件 | `Rename-Item .\note-backup.txt note-old.txt` |
| 预览删除操作 | `Remove-Item .\note-old.txt -WhatIf` |
| 查看命令示例 | `Get-Help Get-ChildItem -Examples` |
| 看系统找到的 Python 命令 | `Get-Command python` |

`Set-Content` 会覆盖目标文件；`Add-Content` 会追加。`-WhatIf` 是“只告诉我准备做什么”，不会真的删除文件。

**十、把常用命令串成一次实际工作**

假设你已经有一个项目，目录是 `D:\projects\demo`，其中确实包含 `requirements.txt` 和 `main.py`：

```powershell
# 进入项目
cd "D:\projects\demo"

# 第一次使用时，创建项目自己的环境
python -m venv .venv

# 本次终端使用这个环境
.\.venv\Scripts\Activate.ps1

# 照项目提供的清单安装依赖
python -m pip install -r requirements.txt

# 运行程序
python .\main.py

# 用完后退出环境
deactivate
```

下次继续开发时，通常只需进入目录、激活环境、运行程序；依赖变化时再安装相应依赖。项目如果另有启动文件或安装步骤，以它自己的说明为准。

优先练熟上面这套流程，再练 `$变量`、`|`、`if`、`foreach`。掌握这些以后，你就能看懂并完成相当一部分 Python 项目的日常终端操作。
