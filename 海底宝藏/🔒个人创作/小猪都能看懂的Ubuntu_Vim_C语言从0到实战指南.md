# 🐷 小猪都能看懂的 Ubuntu + Vim + C语言 从 0 到实战指南

> **写给零基础的你：**
> 如果你以前从没碰过 Linux 黑框框，一打开 Vim 就被困在里面出不来，看 C 语言教材第一页就犯困——恭喜你，这篇指南就是专门为你量身定做的！
> 我们**不说黑话、不跳步骤、连按哪个键都标得清清楚楚**。读完并跟着敲完这篇文档，你不仅能彻底驯服 Ubuntu 和 Vim，还能亲手写出一个**每天都能在 Ubuntu 里真刀真枪用起来的实用工具：《小猪金库（PiggyBank）终端财务与预算管家》**！

---

## 🗺️ 开篇先看全景图：这三样东西到底啥关系？

很多新手一上来就被一堆英文名词吓懵了：`Ubuntu`、`Terminal`、`Vim`、`C语言`、`GCC`……
别怕！把它想象成 **“小猪在厨房烤红薯”**，一秒钟就能全懂：

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        🏡 整间大厨房：Ubuntu 系统                        │
│                                                                         │
│   1. 终端 (Terminal)  ──► 厨房操作台（你敲命令指挥电脑干活的对讲机）      │
│                                                                         │
│   2. Vim 编辑器       ──► 菜谱笔记本（专门用来写 C 语言代码的纯键盘记事本）│
│                                                                         │
│   3. 生红薯 (hello.c) ──► 你用 C 语言写出来的源代码（人类看得懂，电脑不懂）│
│            │                                                            │
│            ▼  放进烤箱：输入 gcc hello.c -o hello                        │
│                                                                         │
│   4. GCC 编译器       ──► 超级大烤箱（把 C 语言翻译成电脑能吃的 0 和 1）  │
│            │                                                            │
│            ▼  叮！烤熟出锅：输入 ./hello                                 │
│                                                                         │
│   5. 熟红薯 (hello)   ──► 真正能跑起来干活的可执行程序！                  │
└─────────────────────────────────────────────────────────────────────────┘
```

**一句话总结全流程：**
> 打开 **Ubuntu 终端** ➡️ 用 **Vim** 写好 `.c` 源代码 ➡️ 用 **GCC** 烤熟（编译） ➡️ 运行你的程序！

---

## 第一章：走进 Ubuntu 厨房——5 分钟学会在终端里散步

### 1.1 怎么打开那个神秘的“黑框框”（终端 Terminal）？
进入 Ubuntu 桌面后，同时按下键盘上的三个键：
- **`Ctrl` + `Alt` + `T`**

唰！屏幕中间会弹出一个黑底白字（或紫底白字）的窗口，这就是**终端（Terminal）**。高手不用鼠标点图标，全靠在这个窗口里敲字跟电脑聊天。

你会看到类似这样的一行字，后面跟着一闪一闪的光标：
```text
piggy@ubuntu:~$
```
别慌，这行字其实在自我介绍：
- `piggy`：你的用户名（我是哪只小猪）
- `@ubuntu`：这台电脑的名字
- `~`（波浪号）：代表你现在所处的位置是**“小猪老家”（主目录 `/home/piggy`）**
- `$`：代表你是普通身份，可以开始敲命令啦！

---

### 1.2 🚨 保命级常识：终端里的“复制粘贴”跟 Windows 不一样！
在 Windows 里，你习惯按 `Ctrl + C` 复制、`Ctrl + V` 粘贴。
**但在 Ubuntu 终端里千万注意：**
- **中断/强行停下正在运行的程序**：`Ctrl + C`（程序卡死了就按它救命！）
- **在终端里复制文字**：**`Ctrl + Shift + C`**（多按一个 `Shift`！）
- **往终端里粘贴文字**：**`Ctrl + Shift + V`**（或者直接点鼠标右键选“粘贴”！）

---

### 1.3 小猪散步必背的 5 个终端口令
在终端里输入下面每一行命令，按回车（`Enter`）就能立刻看到效果，现在就跟着敲一遍：

```bash
# 1. pwd (Print Working Directory) —— “我在哪个猪圈？”
pwd
# 屏幕会显示类似：/home/piggy

# 2. ls (List) —— “看看当前屋里有啥东西？”
ls

# 3. mkdir (Make Directory) —— “盖一间名叫 c_code 的代码小木屋（新建文件夹）”
mkdir c_code

# 4. cd (Change Directory) —— “钻进刚刚建好的 c_code 小木屋里！”
cd c_code

# 5. 再用 pwd 确认一下，是不是已经进屋了？
pwd
# 屏幕显示：/home/piggy/c_code （你看，波浪号后面也变成了 ~/c_code$ ！）
```

> 💡 **顺手记两个回城咒语：**
> - `cd ..`（注意 `cd` 后面有个空格，再跟两个英文点）：退回上一层文件夹。
> - `cd ~`：不管跑多远，一秒瞬移回老家主目录！

---

### 1.4 安装我们的“菜谱本（Vim）”与“大烤箱（GCC）”
Ubuntu 刚装好时，可能还没装全套 C 语言编译器和完整版 Vim。在终端里依次输入下面两行命令：

```bash
sudo apt update
sudo apt install -y build-essential vim
```

> 🛑 **【小猪防坑预警 1：密码隐身术！】**
> 敲下第一行 `sudo apt update` 回车后，终端会弹出 `[sudo] password for piggy:` 让你输开机密码。
> **当你敲键盘输密码时，屏幕上什么都不会显示！连 `***` 星号都不会有！光标纹丝不动！**
> 千万别以为键盘坏了或者电脑死机了！这是 Linux 为了防止别人偷看你密码有几位而设计的“隐身衣”。**你只管闭着眼把密码敲对，然后直接按 `Enter` 回车就行！**

等进度条跑完后，输入下面两行检查装备是否到位：
```bash
gcc --version
vim --version
```
只要分别跳出一大串版本号说明文字，恭喜你！厨房搭建完毕！🎉

---

## 第二章：驯服“上古神兽” Vim——记住 3 个档位，永远不迷路！

### 2.1 为什么全世界新手第一次进 Vim 都会崩溃？
编程界有个著名的笑话：*“怎么生成一串绝对破解不了的随机密码？让一个新手打开 Vim，然后叫他退出来。”*

为什么会这样？因为 Windows 记事本只有一种状态：**打开就能打字**。
而 Vim 是为了“双手完全不碰鼠标也能光速改代码”设计的，它像汽车一样有 **3 个档位（模式）**！你没挂进“打字档”就乱按键盘，等于空档踩油门，当然乱套！

看懂下面这张 **《小猪三档变速箱图》**，你这辈子都不会再被困在 Vim 里：

```text
                      刚在终端输入 vim 文件名 打开时
                                   │
                                   ▼
            ╔══════════════════════════════════════════════╗
            ║        🏠 【普通模式】（安全屋 / 指挥档）      ║ ◄─── 迷路了？慌了？
            ║  刚进门默认在这里！此时按键是“下命令”，不能打字 ║      无脑连按两下左上角
            ╚══════════════════════════════════════════════╝      【 Esc 】键必回这里！
                     │                            │
         按一下字母 i │                            │ 按英文冒号 : （Shift + ;）
       (Insert 插入) │                            │ 看屏幕最左下角会出现 :
                     ▼                            ▼
    ┌──────────────────────────┐        ┌──────────────────────────┐
    │ ✏️ 【插入模式】（打字档）  │        │ 📢 【底行命令模式】（存盘档）│
    │ 左下角显示 -- INSERT --   │        │ 输入 wq 回车 = 保存并退出 │
    │ 现在跟普通记事本一模一样！│        │ 输入 w  回车 = 只保存不退 │
    │ 随便打字、按回车、按退格！│        │ 输入 q! 回车 = 不保存跑路 │
    └──────────────────────────┘        └──────────────────────────┘
                     │
                     └─── 写完字了，按一下左上角【 Esc 】键 ──► 回到上方【安全屋】！
```

**大声朗读三遍《小猪保命口诀》：**
1. **想打字，先按 `i`**（左下角看见 `INSERT` 或 `插入` 才能打字！）。
2. **打完字，先按 `Esc`**（左下角的 `INSERT` 消失了，才算回到安全屋！）。
3. **回安全屋后，切换成英文输入法，输入 `:wq` 回车 = 保存退出；写乱了想毁尸灭迹，输入 `:q!` 回车 = 不保存强行跑路！**

---

### 2.2 第一次实战演练：用 Vim 写一张《小猪纸条》
确保你还在 `~/c_code` 目录里（不在的话敲 `cd ~/c_code`），跟着下面 **6 步**慢动作操作一遍：

1. **开门进屋**：在终端输入 `vim note.txt` 并按回车。
   - 此时屏幕变黑，左边有一列蓝色的波浪号 `~`（代表空行）。你现在正处于 **【普通模式（安全屋）】**，先别乱敲字！
2. **挂入打字档**：切换成英文输入法，轻按一下键盘上的字母 **`i`**。
   - 盯着屏幕**最左下角**看！是不是出现了 **`-- INSERT --`**（中文系统可能显示 `-- 插入 --`）？太棒了！
3. **开心打字**：现在随便输入两行字，比如：
   ```text
   哼哼！今天是本小猪第一天学 Vim！
   原来只要认识 Esc 和 i，一点都不难嘛！
   ```
4. **退回安全屋**：按下键盘最左上角的 **`Esc`** 键。
   - 再看最左下角，`-- INSERT --` 消失了！
5. **存盘出门**：确保输入法是**英文状态**，按住 `Shift` 不放再按分号键 `;` 打出英文冒号 **`:`**（你会看见左下角跳出一个 `:`），接着敲入 **`wq`**（左下角显示 `:wq`），按 **`Enter` 回车**！
6. **验收成果**：你已经回到终端啦！输入 `cat note.txt` 回车（`cat` 是把文件内容打印出来瞄一眼），是不是看到了你刚刚写的两行字？！🎉

---

### 2.3 🎁 送小猪一件“黄金甲”：花 1 分钟把简陋 Vim 变成高颜值代码神器
刚装好的默认 Vim 没有行号、没有彩色高亮、按一下 `Tab` 缩进宽得像太平洋。
我们在老家目录建一个名叫 `.vimrc` 的专属配置文件，以后每次打开 Vim 它都会自动穿上这件黄金甲！

直接把下面这一整段命令**复制**，用 **`Ctrl + Shift + V`** 粘贴到 Ubuntu 终端里回车执行（当然你也可以用 `vim ~/.vimrc` 自己敲进去练手！）：

```bash
cat << 'EOF' > ~/.vimrc
syntax on               " 开启代码彩色语法高亮
set number              " 在左边显示行号（找报错行号超方便！）
set tabstop=4           " 按一下 Tab 键等于 4 个空格宽度
set shiftwidth=4        " 自动缩进也是 4 个空格宽度
set expandtab           " 把 Tab 自动转成整齐的空格
set autoindent          " 按回车换行时，自动对齐上一行的缩进
set cursorline          " 给光标所在的那一行画一条淡淡的下划线
set showmatch           " 输入右括号 ) 或 } 时，自动闪烁配对左括号
set encoding=utf-8      " 支持中文不乱码
EOF
```

装好黄金甲啦！接下来，我们要正式烤第一块“C 语言红薯”了！

---

## 第三章：第一声猪叫——写出并运行人生第一个 C 程序 (`hello.c`)

### 3.1 第一步：用 Vim 编写 `hello.c`
在终端进入我们的代码屋，用 Vim 创建 `hello.c`（注意 C 语言源代码文件必须以 **`.c`** 结尾）：

```bash
cd ~/c_code
vim hello.c
```

进门后：
1. 按一下 **`i`** 进入插入模式（确认左下角有 `-- INSERT --`）。
2. **严格切换成英文输入法**（除了双引号里面的中文汉字，外面所有括号、分号、双引号**全都要是英文半角符号**！），敲入下面 7 行代码：

```c
#include <stdio.h>

int main(void) {
    printf("🐷 哼哼！本小猪成功写出第一个 C 语言程序啦！\n");
    printf("1 + 1 等于 %d，简单得像吃白菜！\n", 1 + 1);
    return 0;
}
```

> ✨ 你会惊喜地发现：因为刚才配了 `.vimrc`，左边自动标出了 `1~7` 行号，`#include`、`int`、`return` 全变成了漂亮的彩色！

3. 敲完检查一遍，按 **`Esc`** 键回到安全屋，输入 **`:wq`** 回车保存退出！

---

### 3.2 第二步：放进烤箱编译 (`gcc`) + 端上桌运行 (`./`)
回到终端后，输入这两行命令：

```bash
# 第一行：呼叫 GCC 大烤箱，把 hello.c 烤熟，成品起名叫 hello
gcc -Wall hello.c -o hello

# 第二行：运行刚刚烤熟的 hello 程序！
./hello
```

如果一切顺利，终端会立刻蹦出：
```text
🐷 哼哼！本小猪成功写出第一个 C 语言程序啦！
1 + 1 等于 2，简单得像吃白菜！
```

🎊 **停下来给自己鼓个掌！你已经打通了“编辑 ➡️ 编译 ➡️ 运行”的任督二脉！**

#### 🤔 小猪十万个为什么：刚刚那两行命令每个词啥意思？
- **`gcc`**：调用 C 语言编译器。
- **`-Wall`**（注意 `W` 大写，意思是 *Warning All*）：**强烈建议永远加上它！** 它相当于给烤箱装上“全自动抓虫雷达”，代码里有任何小隐患它都会提前提醒你。
- **`hello.c`**：放进烤箱的原材料（源代码）。
- **`-o hello`**：`-o` 是 *output*（输出成品名字）。如果不写 `-o hello`，GCC 会默认把烤熟的程序统一叫成一个土里土气的名字 `a.out`。
- **为什么要敲 `./hello` 而不是直接敲 `hello`？**
  - 在 Linux 里，直接敲命令名（比如 `ls`、`vim`），系统只会去“官方系统工具箱”里找。
  - 加上 **`./`**（一个点加一个斜杠），意思是明确告诉 Ubuntu：**“别去别处找，就运行我脚下这个文件夹里的 `hello`！”**

---

### 3.3 庖丁解猪：这 7 行 C 语言到底写了啥？（拒绝死记硬背！）

把刚才的代码端出来，我们一句一句翻译成大白话：

```c
#include <stdio.h>   // ① 借工具箱：向系统借来“标准输入输出工具箱”(STanDard Input Output)
                     //    因为下面的喇叭 printf 就装在这个工具箱里，不借就不能用！

int main(void) {     // ② 程序正大门：所有 C 语言程序，不论有 10 行还是 10 万行，
                     //    电脑永远只认准名叫 main 的这扇大门往里走！
                     //    左花括号 { 代表“进门开始”。

    printf("...%d...\n", 1 + 1);
                     // ③ 喇叭喊话：把双引号里的字打印到屏幕上。
                     //    %d 是个“占座的小板凳”，后面的 1+1 算出来等于 2，就会坐到 %d 的位置上！
                     //    末尾的 \n 代表“换一行”（如果不写 \n，下一句话就会挤在同一行屁股后面）。
                     //    最末尾的分号 ; 就是 C 语言里的句号“。”，每说完一句话必须加分号！

    return 0;        // ④ 平安下班：向 Ubuntu 操作系统老板汇报“0 事故，任务圆满完成！”
}                    // ⑤ 右花括号 } 代表“出门结束”，必须和上面的 { 成双成对！
```

---

### 3.4 🚨 新手 99% 会踩的 4 个编译报错（提前打预防针！）

以后你敲 `gcc` 时，如果弹出了红色的 `error`（错误），**千万别慌，GCC 其实在贴心地告诉你第几行写错了！**

| 报错关键词长啥样 | 罪魁祸首（大白话翻译） | 怎么一秒修好 |
| :--- | :--- | :--- |
| `hello.c:4:45: error: stray '\357' in program` | **混进了中文标点符号！** 比如把英文分号 `;` 敲成了中文 `；`，或用了中文双引号 `“”`、中文括号 `（）`。 | 看报错里的 `:4:` 代表**第 4 行**！进 Vim 把第 4 行的标点删掉，换成英文标点重敲。 |
| `hello.c:5:5: error: expected ';' before 'return'` | 在 `return` 前面期待看到一个分号 `;`——说明 **`return` 的上一行（第 4 行）尾巴忘了加分号 `;`！** | 去上一行末尾补上英文分号 `;`。 |
| `implicit declaration of function 'prinft'` | **单词拼写手滑啦！** 把 `printf` 敲成了 `prinft`。 | 改回正确的 `printf`。 |
| 改完代码保存了，运行 `./hello` 怎么还是旧内容？！ | **忘了重新进烤箱！** 你只改了生红薯 `hello.c`，没重新跑 `gcc`，运行的还是上次烤出来的旧 `hello`！ | 记住铁律：**每次改完 `.c` 保存后，必须先重新 `gcc ...` 编译，再 `./...` 运行！** |

---

## 第四章：C 语言六大乐高积木——20 分钟攒齐写大程序的全部内功

要想写出真正有用的程序，光会 `printf` 喊口号还不够。好消息是：**C 语言最核心的积木其实只有 6 块！** 我们用最直白的方式一口气全拿下。

---

### 🧱 积木 1：变量与数据类型 —— 给不同大小的东西准备“贴标签储物盒”
程序运行时要记住数字和文字，就得造几个盒子装起来：

```c
int count = 3;                // int（整数盒）：只能装没有小数点的整数，比如 3, -5, 100
double price = 18.50;         // double（双精度小数盒）：专门装带小数点的数（算钱必用它！）
char grade = 'A';             // char（单字符小盒）：用【单引号】装 1 个英文字母或符号
char food[50] = "隆江猪脚饭";  // char数组（字符串长条盒）：用【双引号】装一串文字，容量 50 字节
```

当你想用 `printf` 把盒子里的东西喊出来时，不同的盒子要配不同的**“占座暗号（格式占位符）”**：
- **`%d`**：给 `int` 整数占座 ➡️ `printf("买了 %d 碗\n", count);`
- **`%.2f`**：给 `double` 小数占座，且**保留 2 位小数** ➡️ `printf("花了 %.2f 元\n", price);`
- **`%s`**：给 `char[]` 字符串文字占座 ➡️ `printf("吃的是：%s\n", food);`

---

### 🧱 积木 2：跟用户一问一答 —— `scanf` 与那个神秘的 `&` 号
光程序自己自言自语没意思，怎么让用户从键盘输入数据塞进盒子里？用 **`scanf`**：

```c
double weight = 0.0;
printf("小猪请站上体重秤，输入你的体重(斤): ");
scanf("%lf", &weight);   // 注意看！double 在 scanf 里暗号是 %lf，且变量前有个 & 号！
printf("收到！你的体重是 %.1f 斤！\n", weight);
```

> 💡 **千古谜题解答：为什么 `scanf` 里的 `weight` 前面非要加个 `&`（取地址符）？**
> - 把 `scanf` 想象成**顺丰快递员**，把 `weight` 想象成**你家里的储物盒**。
> - `printf` 只是看一眼盒子里装了啥，你把盒子里的数值复印一份递给它就行（不用 `&`）。
> - 但 `scanf` 是要把外面的包裹**真正塞进你的盒子里**！你不告诉快递员**你家的门牌地址（`&weight` 就是“取 `weight` 盒子的内存地址”）**，快递员怎么送货上门？！
> - *（唯一例外：`char food[50]` 这种字符数组本身名字就代表一排房子的首地址门牌号，所以读字符串时不用加 `&`！）*

---

### 🧱 积木 3：分岔路口做决定 —— `if / else` 条件判断
让程序变聪明的秘诀，就是教它看情况办事：

```c
if (weight > 200.0) {
    printf("🔴 警报！再吃就要出栏啦，快去跑步！\n");
} else if (weight >= 100.0) {
    printf("🟢 身材圆润标准，非常健康的小猪！\n");
} else {
    printf("🟡 太瘦啦，今晚加餐两碗猪脚饭！\n");
}
```

> ⚠️ **【C 语言头号刺客警告：`==` 和 `=` 完全是两码事！】**
> - **一个等号 `=`** 叫**赋值（搬运工）**：`a = 5` 意思是“把 5 硬塞进 `a` 盒子里”。
> - **两个等号 `==`** 才叫**判断相等（天平）**：`if (choice == 1)` 意思是“看看 `choice` 是不是等于 1”。
> - 如果你写成了 `if (choice = 1)`，C 语言会先把 1 硬塞进 `choice`，然后永远当成条件成立！切记：**在 `if` 括号里比大小相等，永远写两个等号 `==`！**（比较两个字符串相等则用 `<string.h>` 里的 `strcmp(a, b) == 0`）。

---

### 🧱 积木 4：不知疲倦的推磨机 —— `for` 循环与 `while` 循环
如果要打印 100 条账单，难道写 100 行 `printf`？当然不，派循环小毛驴上场！

```c
// 1. for 循环：适合“明确知道要转几圈”的场景
//    翻译：让 i 从 1 开始；只要 i <= 5 就继续干活；每干完一圈让 i 自动加 1 (i++)
for (int i = 1; i <= 5; i++) {
    printf("小猪正在做第 %d 个俯卧撑！哼哧！\n", i);
}

// 2. while (1) 无限循环 + break 刹车：适合做“一直营业直到客人点退出”的菜单！
while (1) {
    // ... 打印菜单、读取用户输入的选项 choice ...
    if (choice == 0) {
        break; // 一脚急刹车，立刻跳出循环关门下班！
    }
}
```

---

### 🧱 积木 5：打包技能（函数） + 定制专属档案卡（结构体 `struct`）
当程序变大时，把所有代码全塞进 `main` 大门里会乱成一锅粥。我们有两个整理神器：

1. **函数（Function）—— 把重复干的活打包成“一键技能”**：
   ```c
   // 定义一个算两个数加法的技能包：左边 int 是返回值类型，括号里是原料
   int add(int a, int b) {
       return a + b;
   }
   // 在 main 里随时呼叫：int total = add(10, 20);
   ```

2. **结构体（`struct`）—— 把零散信息钉成一张“专属档案卡”**：
   一笔账单里既有编号（`int`）、又有金额（`double`）、还有分类和备注（`char[]`）。用 `typedef struct` 就能发明一种名叫 `Record` 的新卡片类型：
   ```c
   typedef struct {
       int    id;           // 账单编号
       double amount;       // 金额
       char   category[32]; // 分类
   } Record;

   // 用起来极其清爽，用英文点号 . 就能拿到卡片上的每一项：
   Record r1;
   r1.id = 1;
   r1.amount = 18.5;
   ```

---

### 🧱 积木 6：永久记忆水晶 —— 文件读写 (`FILE *`)
普通变量都住在**内存**里，就像写在黑板上的粉笔字——**程序一关，数据全没了！**
要想做一个**真正有价值的程序**，必须把数据存进硬盘文件里：

```c
// 写入硬盘：打开（没有就自动新建）一个叫 data.txt 的文件，"w" 代表写入(Write)
FILE *fp = fopen("data.txt", "w");
if (fp != NULL) {
    fprintf(fp, "第1笔支出: %.2f 元\n", 18.5); // 用法跟 printf 一模一样，只是写进文件里！
    fclose(fp);                               // 写完记得合上笔记本盖子！
}
```

---

### 🎯 中场热身小实战：用 25 行代码做个《小猪健康体检仪》(`bmi.c`)
在挑战终极大项目前，我们花 3 分钟把前面几块积木拼起来练练手！
在终端输入 `vim bmi.c`，按 `i` 输入以下代码：

```c
#include <stdio.h>

int main(void) {
    double height = 0.0;
    double weight = 0.0;

    printf("=== 🐷 小猪体质指数 (BMI) 体检仪 ===\n");
    printf("请输入你的身高（米，例如 1.75）: ");
    scanf("%lf", &height);

    printf("请输入你的体重（公斤，例如 65）: ");
    scanf("%lf", &weight);

    if (height <= 0 || weight <= 0) {
        printf("⚠️ 身高和体重必须是正数哦！\n");
        return 1;
    }

    double bmi = weight / (height * height);
    printf("\n📊 你的 BMI 指数为：%.2f —— ", bmi);

    if (bmi < 18.5) {
        printf("偏瘦！小猪营养不良，快去加餐！🍜\n");
    } else if (bmi < 24.0) {
        printf("完美标准身材！健康有活力！✨\n");
    } else {
        printf("营养过剩啦！迈开小短腿去运动吧！🏃\n");
    }

    return 0;
}
```
按 `Esc` ➡️ 输入 `:wq` 回车 ➡️ 编译运行：
```bash
gcc -Wall bmi.c -o bmi
./bmi
```
试着输入你的身高体重玩一下！是不是已经感觉到 C 语言在手底下活起来了？

---

## 第五章：写大程序前的 Vim 提速秘籍——多会这 8 招，手指飞起来！

马上我们要在 Vim 里编写 200 多行的真正实用工具了。只靠方向键一格一格挪太累啦！
记住：**先按 `Esc` 回到【普通模式（安全屋）】**，下面这 **8 个黄金快捷键**能让你效率暴涨 10 倍：

| 在普通模式按什么键 | 神奇效果（小猪记忆法） | 什么时候最救命？ |
| :--- | :--- | :--- |
| **`u`** | **后悔药（Undo 撤销）**！按一次退回上一步，连按一直退！ | 手滑删错了一大片代码时，淡定按一下 `u`，瞬间恢复！ |
| **`dd`** | **咔嚓删掉整行**（连按两下 `d`，Delete） | 某一行写废了，不用按几十下退格键，`dd` 一秒清空整行！ |
| **`yy` 然后按 `p`** | **复制整行 + 粘贴到下一行**（Yank + Paste） | 写好了一行 `printf`，下一行很像？`yy` 再按 `p` 直接克隆一行改几个字！ |
| **`gg`** / **`G`** | 连按两下小 `g` **飞回第 1 行**；按一下大 `G`（`Shift+g`）**飞到最后一行** | 代码长了不用狂滚滚轮，一秒直达头尾！ |
| **`:85` 回车** | **空降到第 85 行**（冒号 + 任意行号） | GCC 报错说 `piggy.c:85: error`？进 Vim 敲 `:85` 回车直接骑在 Bug 脸上！ |
| **`/main` 回车** | **全文搜索 `main` 这个词**（按 `n` 跳下一个匹配项） | 函数多了想立刻找到某个函数在哪，一搜即达！ |
| **`o`**（小写字母 o） | **在当前行下面新开一行，并自动进入打字模式！** | 比“挪到行尾 ➡️ 按 `i` ➡️ 按回车”快了整整三步！ |
| **`gg=G`** | **全篇代码一键自动对齐缩进！**（先按 `gg` 到头，按 `=`，再按大 `G`） | 代码花括号缩进敲得歪七扭八？在普通模式连敲 `gg=G`，全篇瞬间整整齐齐！ |

---

## 第六章：终极实战——编写一个真正有价值的程序：《小猪金库 PiggyBank》

玩具程序写完就扔，今天我们要写一个**真正能留在你的 Ubuntu 电脑里每天为你服务的生产力工具**！

### 6.1 我们的目标作品：《小猪金库 (PiggyBank CLI) 终端财务与预算管家》
它具备以下 **5 大硬核实用价值**：
1. **双模驱动（新手 + 极客通吃）**：
   - 直接敲 `./piggy`：进入高颜值的**彩色交互式数字菜单**，看着提示一步步点选。
   - 带参数敲 `./piggy out 18.5 餐饮 隆江猪脚饭`：**0.01 秒闪电记账**，连菜单都不用进！这正是 Linux 命令行工具最迷人的效率美学！
2. **自动时间戳 + 跨目录永久存储**：调用 `<time.h>` 自动抓取当前精确时间，所有账单永久保存在主目录 `~/piggy_ledger.csv` 中，关机重启绝不丢失。
3. **原生兼容 Excel / LibreOffice**：底层采用标准 CSV 表格格式存储，随时可以用表格软件双击打开画饼图！
4. **可视化财务体检仪表盘**：自动汇总总收入、总支出、净结余，绘制 **ASCII 彩色预算进度条**（绿/黄/红三级超支预警），并自动揪出你的“单笔败家之最”！
5. **模糊搜索汇总 & 错账删除**：敲一句 `./piggy find 奶茶`，立刻列出你所有喝奶茶的记录并算出你一共在奶茶上花了多少钱！

---

### 6.2 动手前先看懂架构蓝图（大程序其实只是小积木的组合！）
别被 200 多行吓到，拆开来看，它只有清清爽爽的 **7 个小房间**：

```text
piggy.c 整体结构图
├── 1. 顶部工具箱与颜色宏 (#include & #define) ──► 定义红绿青黄终端配色和常量
├── 2. 账单结构体 (typedef struct Record)       ──► 一张卡片含：编号、时间、收支类型、金额、分类、备注
├── 3. 四个贴心小助手函数                       ──► 找存档路径、取系统时间、安全读一行输入、清理逗号
├── 4. 硬盘存取引擎 (load_records / save_all)   ──► 负责把 CSV 文件读进数组、把数组存回 CSV 文件
├── 5. 四大核心业务函数                         ──► ①记一笔账 ②打印明细表(含搜索) ③财务仪表盘 ④按编号删除
├── 6. 交互菜单循环 (run_interactive_menu)      ──► while(1) 循环显示 [0-6] 菜单跟用户互动
└── 7. 程序大门 (int main(int argc, char *argv[])) ► 没带参数就进菜单；带了参数就直接闪电执行！
```

> 💡 **提前解锁一个高级知识点：`int main(int argc, char *argv[])` 是啥？**
> 以前我们写 `int main(void)` 代表大门不收纸条。现在改成接收两个参数：
> - **`argc`**（Argument Count）：你在终端敲命令时一共敲了几个词？
> - **`argv`**（Argument Vector）：这几个词具体分别是什么？
> - 举个例子：当你在终端敲 `./piggy out 18.5 餐饮` 时：
>   `argc` 等于 `4`；其中 `argv[0]` 是 `"./piggy"`，`argv[1]` 是 `"out"`，`argv[2]` 是 `"18.5"`，`argv[3]` 是 `"餐饮"`！
> - **真相大白：** 原来平时你敲的 `gcc -Wall hello.c`、`sudo apt install vim`，全都是靠 `argc` 和 `argv` 实现的！今天你的程序也拥有了同样的超能力！

---

### 6.3 完整源码编写 (`piggy.c`)

现在回到终端，进入代码目录并打开 Vim：
```bash
cd ~/c_code
vim piggy.c
```

> **💡 录入小贴士：**
> - **强烈推荐新手自己动手分块敲一遍**（哪怕不用敲全注释，把代码敲一遍手感会突飞猛进）！
> - 如果你想先跑起来体验效果再慢慢研读，也可以先在 Vim 里输入 `:set paste` 回车（开启纯粘贴防错乱模式），再按 **`i`** 进入插入模式，复制下面的完整源码，在 Ubuntu 终端按 **`Ctrl + Shift + V`** 粘贴进去，最后按 **`Esc`** 输入 **`:wq`** 回车保存！

以下是经过 `gcc -Wall -Wextra -Werror -std=c11` 严格零警告验证的完整代码：

```c
/*
 * ============================================================================
 * 程序名称：小猪金库 (PiggyBank CLI) —— Ubuntu 终端个人收支与预算管家
 * 文件名称：piggy.c
 * 编译命令：gcc -Wall -Wextra -std=c11 piggy.c -o piggy
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

/* ---------- 1. 常量与终端彩色宏定义 ---------- */
#define MAX_RECORDS    2000     /* 最多支持加载的账单条数 */
#define DEFAULT_BUDGET 2000.0   /* 默认月度预算参考线（元） */

/* Ubuntu 终端 ANSI 颜色代码，让黑框框瞬间变漂亮 */
#define CLR_RESET  "\033[0m"
#define CLR_RED    "\033[1;31m" /* 红色：支出 / 警告 */
#define CLR_GREEN  "\033[1;32m" /* 绿色：收入 / 健康 */
#define CLR_YELLOW "\033[1;33m" /* 黄色：提醒 / 标题 */
#define CLR_CYAN   "\033[1;36m" /* 青色：边框 / 菜单 */
#define CLR_BOLD   "\033[1m"    /* 加粗文字 */

/* ---------- 2. 定制“账单档案卡”（结构体） ---------- */
typedef struct {
    int    id;            /* 账单编号：1, 2, 3... */
    char   date[20];      /* 记账时间：YYYY-MM-DD HH:MM */
    char   type[8];       /* 收支类型："IN"(收入) 或 "OUT"(支出) */
    double amount;        /* 金额（元） */
    char   category[32];  /* 分类：餐饮、交通、数码、学习、工资等 */
    char   note[100];     /* 备注说明 */
} Record;

/* ---------- 3. 贴心小工具函数 ---------- */

/* 获取账本文件的保存路径：自动存在用户主目录 ~/piggy_ledger.csv */
void get_ledger_path(char *path_buf, size_t buf_size) {
    const char *home = getenv("HOME");
    if (home == NULL) {
        home = getenv("USERPROFILE");
    }
    if (home != NULL) {
        snprintf(path_buf, buf_size, "%s/piggy_ledger.csv", home);
    } else {
        snprintf(path_buf, buf_size, "piggy_ledger.csv");
    }
}

/* 获取当前系统时间，格式如 "2026-11-26 16:30" */
void get_now_time(char *time_buf, size_t buf_size) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    strftime(time_buf, buf_size, "%Y-%m-%d %H:%M", t);
}

/* 安全读取一整行键盘输入，并自动剪掉末尾的回车换行符（比 scanf 更安全防卡死！） */
void read_line(char *buf, int size) {
    if (fgets(buf, size, stdin) == NULL) {
        buf[0] = '\0';
        return;
    }
    buf[strcspn(buf, "\r\n")] = '\0';
}

/* 把字符串里的英文逗号替换为空格，防止破坏 CSV 表格结构 */
void clean_csv_field(char *str) {
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] == ',') {
            str[i] = ' ';
        }
    }
}

/* ---------- 4. 硬盘存取引擎（记忆水晶） ---------- */

/* 从硬盘 CSV 文件加载所有账单到内存数组，返回实际加载的条数 */
int load_records(Record list[], int max_count) {
    char path[512];
    get_ledger_path(path, sizeof(path));

    FILE *fp = fopen(path, "r");
    if (fp == NULL) {
        return 0; /* 第一次使用还没有账本文件，属于正常情况，返回 0 条 */
    }

    char line[256];
    int count = 0;

    while (fgets(line, sizeof(line), fp) != NULL && count < max_count) {
        /* 跳过第一行 CSV 表头或空行 */
        if (strncmp(line, "ID,", 3) == 0 || line[0] == '\n' || line[0] == '\r') {
            continue;
        }

        Record r;
        int matched = sscanf(line, "%d,%19[^,],%7[^,],%lf,%31[^,],%99[^\r\n]",
                             &r.id, r.date, r.type, &r.amount, r.category, r.note);
        if (matched == 6) {
            list[count] = r;
            count++;
        }
    }

    fclose(fp);
    return count;
}

/* 把内存中的所有账单整整齐齐重新写入硬盘 CSV 文件 */
int save_all_records(const Record list[], int count) {
    char path[512];
    get_ledger_path(path, sizeof(path));

    FILE *fp = fopen(path, "w");
    if (fp == NULL) {
        printf(CLR_RED "❌ 糟糕！无法写入账本文件：%s\n" CLR_RESET, path);
        return 0;
    }

    /* 写入 CSV 表头，方便以后直接用 Excel / LibreOffice 打开 */
    fprintf(fp, "ID,Date,Type,Amount,Category,Note\n");

    for (int i = 0; i < count; i++) {
        fprintf(fp, "%d,%s,%s,%.2f,%s,%s\n",
                i + 1, /* 保存时自动按 1, 2, 3... 重新顺排编号 */
                list[i].date,
                list[i].type,
                list[i].amount,
                list[i].category,
                list[i].note);
    }

    fclose(fp);
    return 1;
}

/* ---------- 5. 四大核心业务功能 ---------- */

/* 功能 A：新增一笔收支记录 */
void add_record_direct(const char *type, double amount,
                       const char *category, const char *note) {
    if (amount <= 0) {
        printf(CLR_RED "⚠️ 金额必须大于 0 元哦！小猪不记空气账～\n" CLR_RESET);
        return;
    }

    Record list[MAX_RECORDS];
    int count = load_records(list, MAX_RECORDS);
    if (count >= MAX_RECORDS) {
        printf(CLR_RED "⚠️ 账本已满（上限 %d 条）！\n" CLR_RESET, MAX_RECORDS);
        return;
    }

    Record r;
    r.id = count + 1;
    get_now_time(r.date, sizeof(r.date));
    snprintf(r.type, sizeof(r.type), "%s", type);
    r.amount = amount;
    snprintf(r.category, sizeof(r.category), "%s",
             (category[0] != '\0') ? category : "未分类");
    snprintf(r.note, sizeof(r.note), "%s",
             (note[0] != '\0') ? note : "无备注");

    clean_csv_field(r.category);
    clean_csv_field(r.note);

    list[count] = r;
    if (save_all_records(list, count + 1)) {
        const char *color = (strcmp(r.type, "IN") == 0) ? CLR_GREEN : CLR_RED;
        const char *label = (strcmp(r.type, "IN") == 0) ? "+收入" : "-支出";
        printf("%s✅ 记账成功！[#%d] %s | %s %.2f 元 | [%s] %s\n" CLR_RESET,
               color, r.id, r.date, label, r.amount, r.category, r.note);
    }
}

/* 功能 B：打印漂亮的彩色账单明细表（支持可选关键词过滤） */
void show_records(const char *keyword) {
    Record list[MAX_RECORDS];
    int count = load_records(list, MAX_RECORDS);

    if (count == 0) {
        printf(CLR_YELLOW "\n📭 小猪金库目前空空如也，快去记下第一笔账吧！\n" CLR_RESET);
        return;
    }

    printf("\n" CLR_CYAN "==========================================================================\n" CLR_RESET);
    if (keyword != NULL && keyword[0] != '\0') {
        printf(CLR_BOLD " 🔍 搜索关键词：「%s」的匹配账单\n" CLR_RESET, keyword);
    } else {
        printf(CLR_BOLD " 📜 小猪金库 · 全部收支明细表（共 %d 笔）\n" CLR_RESET, count);
    }
    printf(CLR_CYAN "--------------------------------------------------------------------------\n" CLR_RESET);
    printf(" ID   | 记账时间         | 类型  |   金额(元) | [分类] 备注说明\n");
    printf(CLR_CYAN "--------------------------------------------------------------------------\n" CLR_RESET);

    int matched_count = 0;
    double sum_in = 0.0;
    double sum_out = 0.0;

    for (int i = 0; i < count; i++) {
        /* 如果传了关键词，就在分类、备注、日期里模糊查找 */
        if (keyword != NULL && keyword[0] != '\0') {
            if (strstr(list[i].category, keyword) == NULL &&
                strstr(list[i].note, keyword) == NULL &&
                strstr(list[i].date, keyword) == NULL) {
                continue;
            }
        }

        int is_in = (strcmp(list[i].type, "IN") == 0);
        const char *color = is_in ? CLR_GREEN : CLR_RED;
        const char *tag   = is_in ? "收入+" : "支出-";

        printf(" #%-3d | %-16s | %s%s" CLR_RESET " | %s%10.2f" CLR_RESET " | [%s] %s\n",
               list[i].id, list[i].date, color, tag, color, list[i].amount,
               list[i].category, list[i].note);

        if (is_in) {
            sum_in += list[i].amount;
        } else {
            sum_out += list[i].amount;
        }
        matched_count++;
    }

    printf(CLR_CYAN "--------------------------------------------------------------------------\n" CLR_RESET);
    if (matched_count == 0) {
        printf(CLR_YELLOW " 🙈 没有找到包含「%s」的记录哦。\n" CLR_RESET, keyword);
    } else {
        printf(" 本页合计 %d 笔  |  " CLR_GREEN "总收入: +%.2f 元" CLR_RESET
               "  |  " CLR_RED "总支出: -%.2f 元" CLR_RESET
               "  |  净结余: %.2f 元\n",
               matched_count, sum_in, sum_out, sum_in - sum_out);
    }
    printf(CLR_CYAN "==========================================================================\n" CLR_RESET);
}

/* 功能 C：生成财务体检报告与 ASCII 预算进度条 */
void show_statistics(double budget) {
    Record list[MAX_RECORDS];
    int count = load_records(list, MAX_RECORDS);

    if (count == 0) {
        printf(CLR_YELLOW "\n📭 还没有任何记账数据，先记几笔再来做财务体检吧！\n" CLR_RESET);
        return;
    }

    double total_in = 0.0;
    double total_out = 0.0;
    int max_out_idx = -1;

    for (int i = 0; i < count; i++) {
        if (strcmp(list[i].type, "IN") == 0) {
            total_in += list[i].amount;
        } else {
            total_out += list[i].amount;
            if (max_out_idx == -1 || list[i].amount > list[max_out_idx].amount) {
                max_out_idx = i;
            }
        }
    }

    double balance = total_in - total_out;
    double ratio = (budget > 0) ? (total_out / budget) : 0.0;
    int bar_width = 24;
    int filled = (int)(ratio * bar_width);
    if (filled > bar_width) {
        filled = bar_width;
    }

    printf("\n" CLR_CYAN "================ 🐷 小猪金库 · 财务体检仪表盘 ================\n" CLR_RESET);
    printf(" 📊 累计记账笔数 ：%d 笔\n", count);
    printf(" 💰 累计总收入   ：" CLR_GREEN "+%.2f 元\n" CLR_RESET, total_in);
    printf(" 💸 累计总支出   ：" CLR_RED "-%.2f 元\n" CLR_RESET, total_out);
    printf(" 🏦 当前金库结余 ：%s%.2f 元\n" CLR_RESET,
           (balance >= 0) ? CLR_GREEN : CLR_RED, balance);

    /* 绘制可视化预算进度条 */
    const char *bar_color = (ratio < 0.7) ? CLR_GREEN :
                            (ratio <= 1.0 ? CLR_YELLOW : CLR_RED);
    printf("\n 🎯 预算使用进度（参考线 %.2f 元）：\n    [", budget);
    printf("%s", bar_color);
    for (int i = 0; i < bar_width; i++) {
        printf(i < filled ? "#" : "-");
    }
    printf(CLR_RESET "] %.1f%%\n", ratio * 100.0);

    if (ratio < 0.7) {
        printf(CLR_GREEN "    🟢 状态极佳：小猪理财有道，继续保持！\n" CLR_RESET);
    } else if (ratio <= 1.0) {
        printf(CLR_YELLOW "    🟡 温馨提醒：预算已用大半，点外卖前先摸摸良心～\n" CLR_RESET);
    } else {
        printf(CLR_RED "    🔴 警报拉响：预算已超支！本小猪即将进入吃土模式！\n" CLR_RESET);
    }

    if (max_out_idx != -1) {
        printf("\n 🏆 单笔最大支出 ：" CLR_RED "%.2f 元" CLR_RESET
               "（%s · [%s] %s）\n",
               list[max_out_idx].amount,
               list[max_out_idx].date,
               list[max_out_idx].category,
               list[max_out_idx].note);
    }

    char path[512];
    get_ledger_path(path, sizeof(path));
    printf(" 📁 数据文件位置 ：%s\n", path);
    printf(CLR_CYAN "==============================================================\n" CLR_RESET);
}

/* 功能 D：按编号删除错记的账单 */
void delete_record_by_id(int target_id) {
    Record list[MAX_RECORDS];
    int count = load_records(list, MAX_RECORDS);

    int found_index = -1;
    for (int i = 0; i < count; i++) {
        if (list[i].id == target_id) {
            found_index = i;
            break;
        }
    }

    if (found_index == -1) {
        printf(CLR_RED "⚠️ 没找到编号为 #%d 的账单，请先输入 list 查看编号。\n" CLR_RESET, target_id);
        return;
    }

    printf(CLR_YELLOW "🗑️ 已删除 [#%d] %s %.2f 元 (%s - %s)\n" CLR_RESET,
           list[found_index].id, list[found_index].date,
           list[found_index].amount, list[found_index].category,
           list[found_index].note);

    /* 把后面的元素往前挪一位，覆盖掉被删除的记录 */
    for (int i = found_index; i < count - 1; i++) {
        list[i] = list[i + 1];
    }

    save_all_records(list, count - 1);
}

/* ---------- 6. 交互式菜单向导（新手友好模式） ---------- */
void run_interactive_menu(void) {
    char input[128];

    while (1) {
        printf("\n" CLR_CYAN "┌──────────────────────────────────────────────┐\n" CLR_RESET);
        printf(CLR_CYAN "│" CLR_RESET CLR_BOLD "    🐷 小猪金库 (PiggyBank) 终端财务管家      " CLR_RESET CLR_CYAN "│\n" CLR_RESET);
        printf(CLR_CYAN "├──────────────────────────────────────────────┤\n" CLR_RESET);
        printf(CLR_CYAN "│" CLR_RESET "  [1] 💸 记一笔支出     [2] 💰 记一笔收入     " CLR_CYAN "│\n" CLR_RESET);
        printf(CLR_CYAN "│" CLR_RESET "  [3] 📜 查看全部账单   [4] 📊 财务体检仪表盘 " CLR_CYAN "│\n" CLR_RESET);
        printf(CLR_CYAN "│" CLR_RESET "  [5] 🔍 按关键词搜索   [6] 🗑️ 删除某条记录   " CLR_CYAN "│\n" CLR_RESET);
        printf(CLR_CYAN "│" CLR_RESET "  [0] 👋 退出程序                             " CLR_CYAN "│\n" CLR_RESET);
        printf(CLR_CYAN "└──────────────────────────────────────────────┘\n" CLR_RESET);
        printf("👉 请输入数字选择功能 [0-6]: ");

        read_line(input, sizeof(input));
        if (input[0] == '\0') {
            continue;
        }

        int choice = -1;
        if (sscanf(input, "%d", &choice) != 1) {
            printf(CLR_RED "⚠️ 请输入数字 0 到 6 哦！\n" CLR_RESET);
            continue;
        }

        if (choice == 0) {
            printf(CLR_GREEN "🐷 哼哼！账本已妥善保存，下次见啦！\n" CLR_RESET);
            break;
        } else if (choice == 1 || choice == 2) {
            const char *type = (choice == 1) ? "OUT" : "IN";
            char amt_str[64], category[32], note[100];
            double amount = 0.0;

            printf("请输入金额（元）: ");
            read_line(amt_str, sizeof(amt_str));
            if (sscanf(amt_str, "%lf", &amount) != 1 || amount <= 0) {
                printf(CLR_RED "⚠️ 金额格式不对，请输入大于 0 的数字（如 18.5）！\n" CLR_RESET);
                continue;
            }

            printf("请输入分类（如 餐饮/数码/学习/工资）: ");
            read_line(category, sizeof(category));

            printf("请输入备注（直接按回车可留空）: ");
            read_line(note, sizeof(note));

            add_record_direct(type, amount, category, note);
        } else if (choice == 3) {
            show_records(NULL);
        } else if (choice == 4) {
            show_statistics(DEFAULT_BUDGET);
        } else if (choice == 5) {
            char kw[64];
            printf("请输入要搜索的关键词（如 奶茶 / 餐饮 / 2026-11）: ");
            read_line(kw, sizeof(kw));
            show_records(kw);
        } else if (choice == 6) {
            char id_str[32];
            int del_id = 0;
            show_records(NULL);
            printf("请输入要删除的账单 ID 编号（输入 0 取消）: ");
            read_line(id_str, sizeof(id_str));
            if (sscanf(id_str, "%d", &del_id) == 1 && del_id > 0) {
                delete_record_by_id(del_id);
            }
        } else {
            printf(CLR_RED "⚠️ 没有这个选项，请输入 0 到 6 之间的数字～\n" CLR_RESET);
        }
    }
}

/* 打印命令行极客用法提示 */
void print_help(const char *prog_name) {
    printf(CLR_BOLD "\n🐷 小猪金库 (PiggyBank) 命令行闪电用法：\n" CLR_RESET);
    printf("  %s                           进入彩色交互菜单（新手推荐）\n", prog_name);
    printf("  %s out <金额> <分类> [备注]  一秒记支出（例: %s out 18.5 餐饮 猪脚饭）\n", prog_name, prog_name);
    printf("  %s in  <金额> <分类> [备注]  一秒记收入（例: %s in 800 兼职 翻译稿费）\n", prog_name, prog_name);
    printf("  %s list                      查看全部账单明细\n", prog_name);
    printf("  %s stat [预算金额]           查看财务体检仪表盘（默认预算 %.0f 元）\n", prog_name, DEFAULT_BUDGET);
    printf("  %s find <关键词>             搜索包含关键词的账单并汇总\n", prog_name);
    printf("  %s del  <编号>               按 ID 删除某条账单\n\n", prog_name);
}

/* ---------- 7. 程序总大门 main（双模驱动） ---------- */
int main(int argc, char *argv[]) {
    /* 模式一：不带额外参数运行 ./piggy ，直接进入交互菜单 */
    if (argc == 1) {
        run_interactive_menu();
        return 0;
    }

    /* 模式二：带命令行参数运行，极客闪电操作 */
    const char *cmd = argv[1];

    if (strcmp(cmd, "out") == 0 || strcmp(cmd, "in") == 0) {
        if (argc < 4) {
            printf(CLR_RED "⚠️ 参数不够哦！用法示例：%s %s 18.5 餐饮 猪脚饭\n" CLR_RESET,
                   argv[0], cmd);
            return 1;
        }
        double amount = atof(argv[2]);
        const char *category = argv[3];
        char note[100] = "无备注";
        if (argc >= 5) {
            note[0] = '\0';
            for (int i = 4; i < argc; i++) {
                if (i > 4) {
                    strncat(note, " ", sizeof(note) - strlen(note) - 1);
                }
                strncat(note, argv[i], sizeof(note) - strlen(note) - 1);
            }
        }
        const char *type = (strcmp(cmd, "in") == 0) ? "IN" : "OUT";
        add_record_direct(type, amount, category, note);
    } else if (strcmp(cmd, "list") == 0) {
        show_records(NULL);
    } else if (strcmp(cmd, "stat") == 0) {
        double budget = (argc >= 3 && atof(argv[2]) > 0) ? atof(argv[2]) : DEFAULT_BUDGET;
        show_statistics(budget);
    } else if (strcmp(cmd, "find") == 0 && argc >= 3) {
        show_records(argv[2]);
    } else if (strcmp(cmd, "del") == 0 && argc >= 3) {
        delete_record_by_id(atoi(argv[2]));
    } else {
        print_help(argv[0]);
    }

    return 0;
}
```

---

### 6.4 编译出炉 & 爽快试玩！

保存退出 Vim 后，在终端开启最高规格的编译检查烤熟它：

```bash
gcc -Wall -Wextra -std=c11 piggy.c -o piggy
```
如果没有任何红字报错，说明一次烤熟成功！（如果有报错，看看行号，进 `vim piggy.c` 输入 `:行号` 核对修改即可）。

现在来体验一下**极客闪电模式**，在终端连敲这几行试试：

```bash
# 闪电记几笔收入和支出
./piggy in 1500 兼职 帮学长配置Ubuntu服务器
./piggy out 18.5 餐饮 隆江猪脚饭加卤蛋
./piggy out 16 餐饮 霸王茶姬伯牙绝弦奶茶
./piggy out 68 学习 C程序设计语言教材

# 查看彩色对齐账单表
./piggy list

# 搜索自己在“奶茶”上花了多少钱
./piggy find 奶茶

# 生成月度预算 500 元的财务体检仪表盘！
./piggy stat 500

# 或者不带任何参数，直接进入新手最爱的交互式菜单！
./piggy
```

你会在终端看到整整齐齐的彩色报表与进度条：
```text
==========================================================================
 📜 小猪金库 · 全部收支明细表（共 4 笔）
--------------------------------------------------------------------------
 ID   | 记账时间         | 类型  |   金额(元) | [分类] 备注说明
--------------------------------------------------------------------------
 #1   | 2026-11-26 16:20 | 收入+ |    1500.00 | [兼职] 帮学长配置Ubuntu服务器
 #2   | 2026-11-26 16:20 | 支出- |      18.50 | [餐饮] 隆江猪脚饭加卤蛋
 #3   | 2026-11-26 16:20 | 支出- |      16.00 | [餐饮] 霸王茶姬伯牙绝弦奶茶
 #4   | 2026-11-26 16:20 | 支出- |      68.00 | [学习] C程序设计语言教材
--------------------------------------------------------------------------
 本页合计 4 笔  |  总收入: +1500.00 元  |  总支出: -102.50 元  |  净结余: 1397.50 元
==========================================================================

================ 🐷 小猪金库 · 财务体检仪表盘 ================
 📊 累计记账笔数 ：4 笔
 💰 累计总收入   ：+1500.00 元
 💸 累计总支出   ：-102.50 元
 🏦 当前金库结余 ：1397.50 元

 🎯 预算使用进度（参考线 500.00 元）：
    [####--------------------] 20.5%
    🟢 状态极佳：小猪理财有道，继续保持！

 🏆 单笔最大支出 ：68.00 元（2026-11-26 16:20 · [学习] C程序设计语言教材）
 📁 数据文件位置 ：/home/piggy/piggy_ledger.csv
==============================================================
```

再敲一句 `cat ~/piggy_ledger.csv`，你会看到底层干干净净的 CSV 数据文件已经躺在你家目录里了！

---

### 6.5 🚀 仪式感拉满的最后一步：把它转正成 Ubuntu 全局系统命令！
现在你每次用它还得先 `cd ~/c_code` 再敲 `./piggy`。怎么让它像 `ls`、`vim` 一样，**不管你在哪个文件夹，随时打开终端直接敲 `piggy` 就能呼唤出来**？

在终端执行这三行命令：
```bash
# 1. 在主目录创建一个存放个人专属软件的工具箱目录
mkdir -p ~/.local/bin

# 2. 把我们烤熟的 piggy 复制进去
cp ~/c_code/piggy ~/.local/bin/

# 3. 把这个目录加入系统寻路名单（PATH），并立即生效
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**见证奇迹的时刻到了：**
先敲 `cd ~` 回到老家，然后直接敲：
```bash
piggy stat
```
不用加 `./`！不用找文件夹！**从这一刻起，Ubuntu 系统里多了一个完全由你亲手用 C 语言编写的原生命令！** 🥳

---

## 第七章：小猪进阶升级路线 & 一页纸随身速查小抄

### 7.1 接下来怎么继续进化成“飞天猪”？
当你能看懂并改写 `piggy.c`（比如试着给它加一个功能：*“按分类汇总餐饮一共花了多少钱”*），你已经跨过了 C 语言最难的入门门槛！接下来推荐按这三步稳扎稳打：

1. **配合经典教材深挖内功**：现在再去翻看经典的 **《C程序设计语言（第2版·中文版）》（K&R）**，你会发现以前像天书一样的章节突然变得亲切无比！重点攻克 **指针与动态内存（`malloc` / `free`）**——这样我们的账本就不再受限于固定的 `MAX_RECORDS 2000` 条，而是想装多少万条就动态申请多少内存！
2. **学会拆分成多文件工程（`.h` + `.c` + `Makefile`）**：当程序长到 1000 行时，可以把存取功能拆成 `storage.c`，界面拆成 `ui.c`，再用 `make` 命令一键自动编译。
3. **解锁 GDB 调试器**：用 `gcc -g` 编译后配合 `gdb`，可以让程序像看电影按暂停键一样，一行一行慢放运行，看清每个盒子里的数字是怎么变的！

---

### 📋 附录：贴在桌边的《小猪随身一页纸速查卡》

```text
╔══════════════════════════════════════════════════════════════════════════╗
║                    🐷 Ubuntu + Vim + C语言 救命速查卡                    ║
╠══════════════════════════════════════════════════════════════════════════╣
║ 【Ubuntu 终端散步】                                                      ║
║   Ctrl+Alt+T : 打开终端            Ctrl+Shift+C / V : 终端内复制 / 粘贴  ║
║   Ctrl+C     : 强行终止卡死程序    pwd / ls         : 我在哪 / 看文件    ║
║   mkdir 名字 : 新建文件夹          cd 名字 / cd ..  : 进文件夹 / 退上一层║
╠══════════════════════════════════════════════════════════════════════════╣
║ 【Vim 保命与提速】（切记：按命令前先按 Esc 回安全屋，且用英文输入法！）  ║
║   i          : 进入打字模式        Esc              : 退回普通安全屋模式 ║
║   :wq 回车   : 保存并退出          :q! 回车         : 不保存强行退出     ║
║   u          : 撤销上一步(后悔药)  dd               : 删掉当前整行       ║
║   yy  和  p  : 复制整行 / 粘贴     gg  /  G         : 飞到第1行 / 最后行 ║
║   :行号 回车 : 直接跳到指定行      gg=G             : 全篇代码自动对齐   ║
╠══════════════════════════════════════════════════════════════════════════╣
║ 【GCC 烤箱与运行】                                                       ║
║   编译源码   : gcc -Wall -Wextra 代码名.c -o 程序名                      ║
║   运行程序   : ./程序名            （每次改完 .c 记得重新 gcc 再运行！） ║
╠══════════════════════════════════════════════════════════════════════════╣
║ 【C语言常用占位符】                                                      ║
║   int 整数   : printf 用 %d    | scanf 用 %d  (变量前加 &)               ║
║   double小数 : printf 用 %.2f  | scanf 用 %lf (变量前加 &)               ║
║   char[]文字 : printf 用 %s    | 推荐用 fgets(buf, sizeof(buf), stdin)   ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> 🐷 **最后送给你的话：**
> 每一个写出 Linux 内核和顶尖软件的大神，当年也是从敲错第一个分号、被困在第一个 Vim 窗口里开始的。去打开 Ubuntu 敲下你的第一行 `vim hello.c` 吧，祝你玩得开心！
