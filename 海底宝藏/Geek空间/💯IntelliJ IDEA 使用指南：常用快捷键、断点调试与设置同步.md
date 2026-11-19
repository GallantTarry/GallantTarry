# 💯IntelliJ IDEA 使用指南：常用快捷键、断点调试与设置同步

**平时写代码，先记住三个入口：双击 `Shift` 找东西，`Alt + Enter` 看当前代码能怎么改，`Shift + F9` 启动调试。** 快捷键记不清时，按 `Ctrl + Shift + A`，输入动作名就能执行。下面用一个“满 100 打九折”的小程序，把找代码、改代码和定位错误连起来。

文中按键以 **Windows / Linux 的默认键位方案（Keymap）** 为准。macOS、自定义键位或系统快捷键冲突时，到 `Settings → Keymap` 搜索表中的英文动作名，看这台电脑实际绑定的按键。

## 一、找代码：先找到文件，再顺着调用往下走

| 你现在知道什么 | 最快的入口 |
| --- | --- |
| 只记得名字里有个 `Price` | 双击 `Shift`，可以找类、文件、符号和动作。想改字体，也可以搜 `font` |
| 已知类名或配置文件名 | 类名用 `Ctrl + N`，普通文件用 `Ctrl + Shift + N`。刚才看过的文件用 `Ctrl + E` |
| 光标已经停在一个方法名上 | `Ctrl + B` 看声明。如果跳到了接口，再按 `Ctrl + Alt + B` 找具体实现 |
| 准备改一个方法，担心影响调用方 | 光标放在方法名上按 `Alt + F7`，查看当前搜索范围内有哪些地方用到它 |

例如，看到 `afterDiscount(price)` 时，按 `Ctrl + B` 可以直接读它的计算规则。要知道这段折扣逻辑会影响哪几处结账，就在 `afterDiscount` 上按 `Alt + F7`。

## 二、写代码：让 IDEA 帮你补全、重构和找回误改

**补全和模板。** `Ctrl + Space` 列出当前位置能用的名字，`Ctrl + Shift + Space` 按所需类型缩小候选范围。调用方法时忘了参数顺序，把光标放进括号按 `Ctrl + P`。Java 里有两种容易混淆的省力写法：

- **先有表达式，再补操作。** 假设 `price` 已经是一个整数变量，在方法体的语句位置输入 `price.sout`，接受后缀模板，就会展开成 `System.out.println(price);`。展开键可以在 `Settings → Editor → General → Postfix Completion` 查看。
- **先写缩写，再填空。** 在 Java 方法体里输入 `fori`，按默认的 `Tab` 展开带下标的 `for` 循环，再填写循环上限。想把团队常用的几行代码做成自己的缩写，在 `Settings → Editor → Live Templates` 添加模板，并选好适用的语言和位置。

**重构。** 想把 `afterDiscount` 改成 `discountedPrice`，在方法名上按 `Shift + F6`。IDEA 能更新它识别到的代码引用。改公共方法前先预览影响范围；反射里拼出的名称、外部配置和其他项目的调用方仍需单独检查。长表达式可以提取为变量，重复的代码段可以提取为方法，按键见第四节。

**找回误改。** 刚才删掉了一段代码，可以右键文件，打开 `Local History → Show History`，对照差异后恢复需要的内容。整个文件被删时，从原来的父目录打开 Local History。本地历史有保留期限，长期保存和多人协作仍应使用 Git。

## 三、断点调试：为什么刚好 100 没打折？

在已配置 JDK 的 Java 项目中新建 `PriceDemo.java`，粘贴下面的代码。约定是“满 100 打九折”，其中 100 应该变成 90。先保留示例里的判断符号，亲自找一次错误。

```java
public class PriceDemo {
    public static void main(String[] args) {
        int[] prices = {80, 100, 120};
        for (int price : prices) {
            int billed = afterDiscount(price);
            System.out.println(billed);
        }
    }

    static int afterDiscount(int price) {
        return price > 100 ? price * 9 / 10 : price;
    }
}
```

1. **先看现象。** 点击 `main` 左侧运行图标，选择 `Run 'PriceDemo.main()'`。控制台依次显示 `80`、`100`、`108`。出问题的是刚好 100 的那次。
2. **只停在出错那次。** 点击 `int billed = afterDiscount(price);` 行号旁的空白处，出现红点。右键红点，在 `Condition` 中填 `price == 100`。选中刚才的 `PriceDemo` 运行配置，按 `Shift + F9`。程序会在计算第二笔价格之前暂停。
3. **看值，再走进方法。** 在 Debug 窗口的 `Variables` 里确认 `price` 为 100。按 `F7` 进入 `afterDiscount`，再按 `Alt + F8`，分别计算 `price > 100` 和 `price >= 100`。前一个结果是 `false`，后一个是 `true`，正好解释了漏掉的边界。
4. **修复并复跑。** 把 `>` 改为 `>=`，重新运行。控制台应依次显示 **80、90、108**。如果只想看某行执行后的值，暂停时用 `F8` 执行该行；想从当前方法返回调用处，用 `Shift + F8`；想继续运行到下一个有效断点或程序结束，用 `F9`。

**临时试一个值。** 暂停时，在 `Variables` 中选中可修改的变量，用 `Set Value`（默认 `F2`）改变本次运行的值。比如将 `price` 改为 120，可以观察另一个分支。`Evaluate Expression` 里调用的方法也会真实执行，比较数字时直接输入比较表达式就够了。

> **单步走过头怎么办？** 还在被调用的方法中时，可以在 Debug 窗口的调用栈里对相应栈帧使用 `Reset Frame`，有些版本称为 `Drop Frame`，然后重新进入该方法。先前打印的文字、改过的对象或写入数据库的内容都会保留。需要从相同初始状态重来时，重新启动调试并还原测试数据更可靠。

## 四、快捷键速查

按任务、动作名或按键查找。例如输入“重构”查看改代码结构的操作，输入 `F8` 可以并排比较几个容易按混的调试动作。

<style>
.idea-shortcut-lookup { box-sizing: border-box; padding: .9rem 1rem; margin: 1rem 0; border-radius: .6rem; color: #edf3fa; background: #1c2a3a; }
.idea-shortcut-lookup label { display: block; color: #edf3fa; font-weight: 600; }
.idea-shortcut-lookup input { box-sizing: border-box; display: block; width: 100%; max-width: 35rem; min-width: 0; margin-top: .35rem; padding: .5rem .65rem; font: inherit; color: #172331; background: white; border: 1px solid #91a5b8; border-radius: .35rem; }
.idea-shortcut-lookup input:focus-visible { outline: 3px solid #ffd276; outline-offset: 2px; }
.idea-shortcut-lookup [role="status"] { margin: .5rem 0 0; color: #e4edf6; }
table.idea-shortcut-results tr[hidden] { display: none !important; }
</style>

<div class="idea-shortcut-lookup" data-idea-lookup>
  <label>筛选快捷键
    <input data-idea-filter type="search" placeholder="例如：重命名、Step Over、Ctrl+N" disabled>
  </label>
  <p role="status">静态预览显示完整速查表。Markdown 宿主允许执行脚本时，可在此输入关键词筛选。</p>
</div>

<script>
(() => {
  document.querySelectorAll("[data-idea-lookup]").forEach(panel => {
    if (panel.dataset.ready) return;
    let next = panel.nextElementSibling;
    let table;
    while (next && !table && !/^H[1-6]$/.test(next.tagName)) {
      table = next.matches("table") ? next : next.querySelector("table");
      next = next.nextElementSibling;
    }
    if (!table || !table.tBodies.length) return;
    const input = panel.querySelector("[data-idea-filter]");
    const status = panel.querySelector('[role="status"]');
    const normalize = text => text.toLowerCase().replace(/\s+/g, "");
    const entries = Array.from(table.tBodies[0].rows, row => ({
      row, text: normalize(row.textContent)
    }));
    function filter() {
      const query = normalize(input.value);
      let count = 0;
      for (const entry of entries) {
        entry.row.hidden = !entry.text.includes(query);
        if (!entry.row.hidden) count++;
      }
      status.textContent = count ? "显示 " + count + " / " + entries.length + " 项。" : "找到 0 项。换一个动作名、按键，或清空搜索框。";
    }
    table.classList.add("idea-shortcut-results");
    input.addEventListener("input", filter);
    input.disabled = false;
    panel.dataset.ready = "true";
    filter();
  });
})();
</script>

| 类别 | 操作（英文动作名） | 默认按键 |
| --- | --- | --- |
| 导航 | 全局搜索 Search Everywhere | 双击 `Shift` |
| 导航 | 按名称查命令 Find Action | `Ctrl + Shift + A` |
| 导航 | 找类 Go to Class | `Ctrl + N` |
| 导航 | 找文件 Go to File | `Ctrl + Shift + N` |
| 导航 | 最近文件 Recent Files | `Ctrl + E` |
| 导航 | 跳到声明 Go to Declaration | `Ctrl + B` 或 `Ctrl + 单击` |
| 导航 | 找实现 Go to Implementation | `Ctrl + Alt + B` |
| 导航 | 查找用法 Find Usages | `Alt + F7` |
| 导航 | 跳到行号 Go to Line | `Ctrl + G` |
| 导航 | 上一个 / 下一个编辑标签页 Previous / Next Tab | `Alt + ←` / `Alt + →` |
| 编辑 | 基础补全 Basic Completion | `Ctrl + Space` |
| 编辑 | 按类型补全 Type-Matching Completion | `Ctrl + Shift + Space` |
| 编辑 | 快速修复与建议 Show Context Actions | `Alt + Enter` |
| 编辑 | 复制当前行或选区 Duplicate Line or Selection | `Ctrl + D` |
| 编辑 | 删除当前行 Delete Line | `Ctrl + Y` |
| 编辑 | 生成构造器、Getter 等 Generate | `Alt + Insert` |
| 编辑 | 格式化文件或选区 Reformat Code | `Ctrl + Alt + L` |
| 编辑 | 扩大 / 缩小选区 Extend / Shrink Selection | `Ctrl + W` / `Ctrl + Shift + W` |
| 编辑 | 查看方法参数 Parameter Info | `Ctrl + P` |
| 编辑 | 切换行注释 Comment with Line Comment | `Ctrl + /` |
| 编辑 | 切换块注释 Comment with Block Comment | `Ctrl + Shift + /` |
| 编辑 | 从当前位置到下一行开始输入 Start New Line | `Shift + Enter` |
| 编辑 | 向上 / 向下移动语句 Move Statement Up / Down | `Ctrl + Shift + ↑` / `Ctrl + Shift + ↓` |
| 重构 | 重命名 Rename | `Shift + F6` |
| 重构 | 提取变量 Extract Variable | `Ctrl + Alt + V` |
| 重构 | 提取方法 Extract Method | `Ctrl + Alt + M` |
| 重构 | 提取常量 Extract Constant | `Ctrl + Alt + C` |
| 运行 | 运行当前配置 Run | `Shift + F10` |
| 调试 | 调试当前配置 Debug | `Shift + F9` |
| 调试 | 添加或取消行断点 Toggle Line Breakpoint | `Ctrl + F8` |
| 调试 | 管理全部断点 View Breakpoints | `Ctrl + Shift + F8` |
| 调试 | 步过，执行当前行 Step Over | `F8` |
| 调试 | 步入当前调用 Step Into | `F7` |
| 调试 | 同一行有多个调用时选择要进入的目标 Smart Step Into | `Shift + F7` |
| 调试 | 强制步入通常被过滤的方法 Force Step Into | `Alt + Shift + F7` |
| 调试 | 执行到当前方法返回 Step Out | `Shift + F8` |
| 调试 | 恢复运行 Resume Program | `F9` |
| 调试 | 计算当前上下文中的表达式 Evaluate Expression | `Alt + F8` |
| 调试 | 在变量面板修改所选变量 Set Value | `F2` |

## 五、换电脑：一次性迁移用 ZIP，长期多机使用可启用账号同步

### 1. 一次迁移，先导出再导入

1. 在**原电脑**打开 `File → Manage IDE Settings → Export Settings`，选择要带走的项目，如自定义键位、配色、代码风格和 Live Templates。选好保存位置，生成 `.zip` 文件。
2. 把 ZIP 传到**目标电脑**。在该机 IDEA 打开 `File → Manage IDE Settings → Import Settings`，选中 ZIP，再勾选要应用的配置，确认并按界面提示操作。已有重要自定义设置时，可先导出该机的一份 ZIP，方便恢复。
3. 用一个熟悉的改动验证，例如到 `Settings → Keymap` 查自己的快捷键，或在 Java 方法体里展开一个迁移过来的模板。

ZIP 保存所选的 **IDE 级偏好**。项目源码和项目级配置要随项目迁移。归档可以记录已启用的第三方插件 ID，目标机仍需有可用的插件程序。

### 2. 两台电脑持续同步，第一次先看方向

在两台 IDEA 的 Settings 里搜索 `Backup and Sync`（有些旧版叫 `Settings Sync`），登录同一 JetBrains 账号，分别启用同步，并选择需要的类别。若首次启用时让你选方向，可以把它读成两句话：

| 界面操作 | 设置从哪来，到哪去 |
| --- | --- |
| `Push Settings to Account` | **本机 → 账号。** 当这台电脑保存着你想沿用的配置时使用，留意覆盖云端配置的提示 |
| `Get Settings from Account` | **账号 → 本机。** 在希望接收既有配置的电脑上使用 |

例如办公室电脑已经调好键位，新笔记本刚装 IDEA，先在办公室电脑把设置存到账号，再让新机采用账号中的设置。不同版本的按钮可能写作 `Enable` 或 `Apply`，按界面显示的来源、去向和覆盖提示确认。

### 3. 用 SSH 远程开发时，先看设置属于哪一端

如果只是通过终端 SSH 登录 Ubuntu，那里运行的是命令行程序，把 IDEA 的 ZIP 复制过去不会改变终端快捷键。使用 JetBrains Remote Development 时，本地的 JetBrains Client 负责显示界面，远端后端打开项目并运行相关工具。键位和外观先查客户端，项目设置查远端项目；插件按远程会话标明的安装位置核对。Windows 上用的 `powershell.exe` 路径也要按目标环境重新选择。

## 六、按需配置终端、数据库和内存

| 你想做什么 | 去哪里，怎么判断 |
| --- | --- |
| 在 IDEA 里执行构建命令 | 打开 Terminal 工具窗口。在 `Settings → Tools → Terminal → Shell path` 选择本机可用的 PowerShell、`cmd.exe` 或其他 shell |
| 查看表结构、运行 SQL | 打开 `View → Tool Windows → Database`，添加数据源并测试连接。在数据库控制台可查看表和执行查询。可用能力取决于 Database Tools and SQL 插件与订阅，未订阅 Ultimate 时部分功能受限 |
| 用鼠标操作时顺带学快捷键 | 可选装 `Key Promoter X`。当点到有快捷键的动作时，插件可显示对应按键，便于先记最常用的几个 |
| 大项目编辑时收到内存不足提示 | 打开 `Help → Change Memory Settings`，结合机器可用内存调整 IDE 最大堆并重启。这会改变 IDE 自身的 `-Xmx`。若慢在 Gradle 构建或应用运行，应分别检查构建进程和运行配置 |

参考依据为 JetBrains《IntelliJ IDEA Keyboard Shortcuts》《Windows & Linux Keymap》《Postfix completion》《Rename refactorings》《Local History》《Breakpoints》《Step through the program》《Examine suspended program》《IDE settings backup and sync》，以及远程开发、数据库工具和 IDE 内存设置的官方说明。
