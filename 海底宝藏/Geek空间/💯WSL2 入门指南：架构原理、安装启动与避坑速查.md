# 💯WSL2 入门指南：架构原理、安装启动与避坑速查

**WSL 2（Windows Subsystem for Linux 2）通过轻量级 Hyper-V 虚拟机在 Windows 内部运行完整的 Linux 内核，让你无需双系统重启或重型虚拟机，即可使用原生的 Linux 命令行与服务端环境。**

本文涵盖 WSL 2 的核心架构、从零安装与首次初始化、日常启动方式、文件/内存/网络高频避坑，以及 `wsl` 管理命令速查。

## 一、架构原理：分清 WSL、WSL 2 与 Ubuntu

刚接触 WSL 时，容易把“底层虚拟化能力”和“具体 Linux 发行版”混为一谈。按层次拆开只需要记住三层：

- **WSL（子系统框架）**：Windows 提供的集成层，负责管理发行版生命周期、打通终端会话、映射文件系统与网络端口。
- **WSL 2（轻量级虚拟化后端）**：相对 WSL 1 的系统调用翻译层，WSL 2 在受管轻量级虚拟机中运行微软维护的**真实 Linux 内核**，具备完整系统调用兼容性，支持 Docker、systemd 等依赖原生内核特性的工具。
- **Ubuntu（Linux 发行版）**：运行在 Linux 内核之上的用户态系统，提供 Bash、`apt` 软件包管理与标准目录结构。WSL 默认安装 Ubuntu，也可按需并行安装 Debian、Alpine 等其他发行版。

<style>
.wsl-arch-card { box-sizing: border-box; margin: 1.1rem 0; padding: 1rem; border-radius: 0.65rem; background: #141e2b; border: 1px solid #2a3c52; color: #e8f0f8; }
.wsl-arch-card svg { display: block; width: 100%; height: auto; }
.wsl-arch-caption { margin: 0.65rem 0 0; font-size: 0.88rem; color: #b5c7da; }
.wsl-cmd-lookup { box-sizing: border-box; padding: 0.9rem 1rem; margin: 1rem 0; border-radius: 0.6rem; color: #edf3fa; background: #172331; border: 1px solid #2a3c52; }
.wsl-cmd-lookup label { display: block; color: #edf3fa; font-weight: 600; }
.wsl-cmd-lookup input { box-sizing: border-box; display: block; width: 100%; max-width: 34rem; min-width: 0; margin-top: 0.4rem; padding: 0.5rem 0.65rem; font: inherit; color: #172331; background: #ffffff; border: 1px solid #8da2b9; border-radius: 0.35rem; }
.wsl-cmd-lookup input:focus-visible { outline: 3px solid #ffd179; outline-offset: 2px; }
.wsl-cmd-lookup [role="status"] { margin: 0.55rem 0 0; font-size: 0.9rem; color: #dce7f3; }
table.wsl-cmd-results tr[hidden] { display: none !important; }
</style>

<figure class="wsl-arch-card">
  <svg viewBox="0 0 760 280" role="img" aria-label="WSL 2 与 Windows 宿主机架构及文件系统边界示意图" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="wsl-arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 1 1 L 9 5 L 1 9 z" fill="#4fd1c5"/>
      </marker>
      <marker id="wsl-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 1 1 L 9 5 L 1 9 z" fill="#f6ad55"/>
      </marker>
    </defs>
    <rect x="20" y="20" width="244" height="240" rx="10" fill="#1c2a3a" stroke="#3b536e" stroke-width="1.5"/>
    <text x="38" y="48" fill="#f4f8fc" font-size="15" font-weight="700" font-family="system-ui,-apple-system,sans-serif">Windows 宿主机</text>
    <rect x="38" y="64" width="208" height="72" rx="7" fill="#24364a" stroke="#476382" stroke-width="1"/>
    <text x="52" y="88" fill="#e8f0f8" font-size="13" font-weight="600" font-family="system-ui,-apple-system,sans-serif">前端入口与工具</text>
    <text x="52" y="108" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">Windows Terminal · IDE</text>
    <text x="52" y="125" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">资源管理器 · WSLg 窗口</text>
    <rect x="38" y="152" width="208" height="90" rx="7" fill="#24364a" stroke="#476382" stroke-width="1"/>
    <text x="52" y="176" fill="#e8f0f8" font-size="13" font-weight="600" font-family="system-ui,-apple-system,sans-serif">NTFS 磁盘（C:\ / D:\）</text>
    <text x="52" y="198" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">Windows 原生文件与文档</text>
    <text x="52" y="218" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">适合：Windows 原生开发</text>
    <rect x="464" y="20" width="276" height="240" rx="10" fill="#1c2a3a" stroke="#4fd1c5" stroke-width="1.5"/>
    <text x="482" y="48" fill="#f4f8fc" font-size="15" font-weight="700" font-family="system-ui,-apple-system,sans-serif">WSL 2 轻量级虚拟机（Hyper-V）</text>
    <rect x="482" y="64" width="240" height="72" rx="7" fill="#24364a" stroke="#476382" stroke-width="1"/>
    <text x="496" y="88" fill="#e8f0f8" font-size="13" font-weight="600" font-family="system-ui,-apple-system,sans-serif">Ubuntu 用户态 + Linux 内核</text>
    <text x="496" y="108" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">Bash · apt · Docker · 后端服务</text>
    <text x="496" y="125" fill="#b7cade" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">systemd · 完整 Linux 系统调用</text>
    <rect x="482" y="152" width="240" height="90" rx="7" fill="#1d353a" stroke="#4fd1c5" stroke-width="1"/>
    <text x="496" y="176" fill="#e8f8f5" font-size="13" font-weight="600" font-family="system-ui,-apple-system,sans-serif">ext4 虚拟磁盘（~ /home）</text>
    <text x="496" y="198" fill="#a8e6df" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">原生 Linux 文件 I/O（高速）</text>
    <text x="496" y="218" fill="#a8e6df" font-size="11.5" font-family="system-ui,-apple-system,sans-serif">推荐：存放 WSL 侧项目源码</text>
    <line x1="272" y1="100" x2="456" y2="100" stroke="#4fd1c5" stroke-width="1.8" marker-start="url(#wsl-arrow-teal)" marker-end="url(#wsl-arrow-teal)"/>
    <text x="364" y="88" text-anchor="middle" fill="#e8f0f8" font-size="11.5" font-weight="600" font-family="system-ui,-apple-system,sans-serif">终端会话与端口互通</text>
    <text x="364" y="117" text-anchor="middle" fill="#9fc5d6" font-size="11" font-family="ui-monospace,Consolas,monospace">wsl · localhost / mirrored</text>
    <line x1="272" y1="170" x2="456" y2="170" stroke="#4fd1c5" stroke-width="1.8" marker-end="url(#wsl-arrow-teal)"/>
    <text x="364" y="159" text-anchor="middle" fill="#a8e6df" font-size="11" font-family="ui-monospace,Consolas,monospace">\\wsl.localhost\Ubuntu</text>
    <text x="364" y="186" text-anchor="middle" fill="#9fc5d6" font-size="11" font-family="ui-monospace,Consolas,monospace">explorer.exe .</text>
    <line x1="456" y1="224" x2="272" y2="224" stroke="#f6ad55" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#wsl-arrow-amber)"/>
    <text x="364" y="213" text-anchor="middle" fill="#fbd38d" font-size="11" font-family="ui-monospace,Consolas,monospace">/mnt/c/（9P 跨系统协议）</text>
    <text x="364" y="240" text-anchor="middle" fill="#f6ad55" font-size="11" font-family="system-ui,-apple-system,sans-serif">高频小文件读写较慢，勿放源码</text>
  </svg>
  <figcaption class="wsl-arch-caption">WSL 2 架构与跨系统通道示意：日常在 Linux 中编译或运行的项目应留在右侧 ext4 虚拟磁盘（<code>~</code>），减少跨 <code>/mnt/c/</code> 的高并发 I/O。</figcaption>
</figure>

### 与传统虚拟机、双系统的取舍

| 维度 | WSL 2 | 传统虚拟机（VMware / VirtualBox） | 双系统 |
| --- | --- | --- | --- |
| **启动与切换** | 秒级启动，与 Windows 同屏并行 | 需完整引导系统，耗时数十秒 | 需重启电脑切换，无法同时使用 |
| **资源占用** | 内存动态分配（闲置缓存需配置自动回收或手动释放） | 需预先切分固定内存与大块磁盘 | 独占整机硬件，无虚拟化损耗 |
| **跨系统互通** | 终端、剪贴板、文件系统与端口原生互通 | 需配置共享文件夹与端口映射 | 互通不便，通常需中转分区 |
| **典型定位** | 日常后端开发、命令行工具链、Docker 与 Linux 构建 | 需要完整桌面隔离、快照回滚或非 WSL 内核测试 | 重度原生 Linux 桌面、底层驱动或硬件直通场景 |

## 二、安装与首次初始化

### 1. 前置条件

- **操作系统**：Windows 11，或 Windows 10 版本 2004 及以上（内部版本 `19041` 及以上）。
- **硬件虚拟化**：主板 UEFI/BIOS 中需开启虚拟化（Intel VT-x / AMD-V）。可在任务管理器「性能 → CPU」右下角确认「虚拟化：已启用」。

### 2. 一键安装

1. 以**管理员身份**打开 **Windows Terminal**（PowerShell 或命令提示符），运行：

```powershell
wsl --install
```

该命令会自动启用「适用于 Linux 的 Windows 子系统」与「虚拟机平台」两个可选组件，拉取最新 WSL 内核，将默认版本设为 WSL 2，并安装默认发行版 **Ubuntu**。

2. 如遇下载长期停在 `0.0%` 或设备无法访问 Microsoft Store，改用直接网页下载模式：

```powershell
wsl --install --web-download -d Ubuntu
```

想安装其他发行版时，先执行 `wsl --list --online` 查看官方发行版名称，再替换 `-d` 后的名称。

3. 安装完成后**重启电脑**，让底层虚拟化组件正式生效。

### 3. 创建默认 Unix 账户

重启后系统会自动弹出 Ubuntu 终端完成解包，并依次提示创建默认账户和设置密码（`Enter new UNIX username:` / `New password:`）：

- **输入密码时屏幕无回显**：Linux 终端输入密码不会显示字符或星号，光标也不会移动。直接盲打密码后回车，再输入一次确认即可。
- **账户独立**：该账户与 Windows 登录账户相互独立，默认拥有 `sudo` 管理员权限，用户名与密码可按需自行设定。

### 4. 两步验收

1. 终端出现类似 `dev@host:~$` 的提示符，说明 Ubuntu 初始化完成。其中 `~` 表示当前用户家目录（`/home/<用户名>`），`$` 表示普通用户身份（切换为超级管理员时会变为 `#`）。
2. 在 Windows PowerShell 中检查已安装发行版及内核版本，确认 `VERSION` 为 `2`：

```powershell
wsl -l -v
```

## 三、日常启动与终端集成

| 启动方式 | 操作步骤 | 适用场景 |
| --- | --- | --- |
| **Windows Terminal 下拉菜单**（推荐） | 打开终端，点击标签栏右侧下拉箭头 `v`，选择 `Ubuntu` | 与 PowerShell 多标签并行工作，体验最流畅 |
| **命令行直接进入** | 在 PowerShell / CMD 中输入 `wsl ~` 回车；退出输入 `exit` | 键盘流快速切入并直接落到 Linux 家目录 |
| **开始菜单启动** | 按 `Win` 键搜索并打开 `Ubuntu` | 需要独立终端窗口时使用 |

> **设为默认入口与路径习惯**：如果主要在 Linux 环境工作，可在 Windows Terminal 的「设置 → 启动 → 默认配置文件」中将 `Ubuntu` 设为默认。命令行直接输入不带参数的 `wsl` 会停留在当前 Windows 目录对应的 `/mnt/...` 路径；加上波浪号 `wsl ~` 会直接进入 Linux 家目录 `~`，能减少误在 Windows 盘符下克隆或构建项目的概率。

## 四、高频避坑指南：文件、内存、网络与边界

### 1. 文件互通与性能红线

- **从 Linux 访问 Windows 文件**：Windows 各盘符自动挂载在 `/mnt/c/`、`/mnt/d/` 下，可直接读写。
- **从 Windows 访问 Linux 文件**：在资源管理器地址栏输入 `\\wsl.localhost\Ubuntu`（旧写法 `\\wsl$\Ubuntu` 仍保持兼容），或在 Ubuntu 终端的任意目录下直接执行以下命令用资源管理器打开当前目录：

```bash
explorer.exe .
```

- **性能原则（工具在哪边，源码放哪边）**：WSL 2 的 Linux 根目录位于原生 ext4 虚拟磁盘，文件读写接近原生 Linux；但通过 `/mnt/c/` 读写 Windows 盘符需要经过 9P 跨系统协议转换，面对 `git status`、`npm install`、Maven/Cargo 编译等大量小文件操作时，耗时可能变慢数倍甚至一个数量级。
  - **在 WSL 2 中构建和运行的项目**：源码一律放在 Linux 文件系统内（如 `~/projects`）。VS Code（搭配 WSL 扩展）和现代 IntelliJ IDEA 均可直接打开 Linux 侧目录，无需把代码迁就放回 C 盘。
  - **在 Windows 原生工具链中开发的项目**：源码继续留在 NTFS 磁盘（如 `D:\projects`）。

### 2. 内存占用与 `.wslconfig` 回收配置

WSL 2 按需申请内存，但 Linux 内核会将空闲内存用作文件页面缓存（Page Cache），默认不会立刻归还给 Windows，长时间使用后任务管理器中的 `VmmemWSL` 进程往往会常驻占用数 GB 内存。

在 Windows 用户根目录 `%UserProfile%\.wslconfig`（例如 `C:\Users\<Windows用户名>\.wslconfig`）中新建或编辑全局配置，可同时设置内存上限与空闲自动回收：

```ini
[wsl2]
memory=8GB
swap=2GB

[experimental]
autoMemoryReclaim=gradual
```

- `memory`：限制 WSL 2 虚拟机可使用的最大内存（可按本机总内存的 1/3～1/2 设定）。
- `autoMemoryReclaim`：`gradual` 会在空闲后逐步将缓存内存归还给 Windows；也可设为 `dropCache` 立即释放，或 `disabled` 关闭。
- **生效方式**：保存 `.wslconfig` 后，在 PowerShell 执行 `wsl --shutdown` 彻底关闭轻量虚拟机，等待约 8 秒再重新启动 Ubuntu 即可生效。日常需要一次性释放全部 WSL 内存时，同样执行 `wsl --shutdown`。

### 3. 本地代理提示与镜像网络模式

当 Windows 开启代理软件时，默认 NAT 模式下的 WSL 2 启动常会出现提示：`检测到 localhost 代理配置，但未镜像到 WSL。NAT 模式下的 WSL 不支持 localhost 代理。`

- **仅做本地脚本或无需代理访问外网**：该提示不影响 Linux 基础功能，可直接忽略。
- **需要 WSL 自动复用 Windows 代理或改善 VPN 兼容性**（要求 **Windows 11 22H2 及以上**）：在 `%UserProfile%\.wslconfig` 的 `[wsl2]` 下追加以下两项，随后运行 `wsl --shutdown` 重启 WSL：

```ini
[wsl2]
networkingMode=mirrored
autoProxy=true
```

启用镜像网络模式（`networkingMode=mirrored`）后，WSL 2 会镜像 Windows 宿主机的网络接口，不仅代理与 VPN 兼容性明显提升，也能在 Linux 中直接通过 `localhost` 访问宿主机监听的服务。

### 4. 适用场景与工程边界

| 使用场景 | 推荐环境 | 原因与边界 |
| --- | --- | --- |
| 后端服务与容器（Docker、Redis、MySQL、Nginx） | **WSL 2** | 与 Linux 生产环境一致，运行效率和生态完整度优于 Windows 移植版 |
| 命令行开发（Python / Node.js / Go / Rust / Shell） | **WSL 2** | 源码放在 `~` 下性能高，避免 Windows 路径与行尾符（CRLF）差异 |
| 跨平台编译与构建验证 | **WSL 2** | 无需远程云服务器，本地即可验证 Linux 平台构建产物 |
| 轻量 Linux 图形应用 | **WSL 2（Windows 11）** | Windows 11 内置 **WSLg**，可直接运行 X11/Wayland 图形程序；建议更新显卡驱动以启用硬件加速 |
| Windows 原生桌面端软件、游戏渲染与外设调试 | **Windows 原生环境** | 重度依赖 Windows 窗口消息循环、原生图形管线与本机外设时，直接在 Windows 下调试更稳定 |

## 五、常用 `wsl` 管理命令速查

除 `exit` 和 `explorer.exe .` 在 Linux 终端内执行外，下表其余 `wsl` 命令均在 **Windows PowerShell 或命令提示符**中运行。

<div class="wsl-cmd-lookup" data-wsl-lookup>
  <label>筛选命令
    <input data-wsl-filter type="search" placeholder="例如：内存、关闭、版本、备份、shutdown" disabled>
  </label>
  <p role="status">静态预览显示完整速查表。Markdown 宿主允许执行脚本时，可在此输入关键词筛选。</p>
</div>

<script>
(() => {
  document.querySelectorAll("[data-wsl-lookup]").forEach(panel => {
    if (panel.dataset.ready) return;
    let next = panel.nextElementSibling;
    let table;
    while (next && !table && !/^H[1-6]$/.test(next.tagName)) {
      table = next.matches("table") ? next : next.querySelector("table");
      next = next.nextElementSibling;
    }
    if (!table || !table.tBodies.length) return;
    const input = panel.querySelector("[data-wsl-filter]");
    const status = panel.querySelector('[role="status"]');
    const normalize = text => text.toLowerCase().replace(/\s+/g, "");
    const entries = Array.from(table.tBodies[0].rows, row => ({
      row,
      text: normalize(row.textContent)
    }));
    function filter() {
      const query = normalize(input.value);
      let count = 0;
      for (const entry of entries) {
        entry.row.hidden = !entry.text.includes(query);
        if (!entry.row.hidden) count++;
      }
      status.textContent = count
        ? "显示 " + count + " / " + entries.length + " 条命令。"
        : "找到 0 条匹配命令，请换一个关键词或清空搜索框。";
    }
    table.classList.add("wsl-cmd-results");
    input.addEventListener("input", filter);
    input.disabled = false;
    panel.dataset.ready = "true";
    filter();
  });
})();
</script>

| 类别 | 命令 | 作用说明 |
| --- | --- | --- |
| 安装与更新 | `wsl --install` | 启用必需组件并安装默认发行版（Ubuntu） |
| 安装与更新 | `wsl --install --web-download -d Ubuntu` | 绕过 Microsoft Store 直接下载安装，用于卡在 `0.0%` 时兜底 |
| 安装与更新 | `wsl --list --online`（简写 `wsl -l -o`） | 列出官方支持在线安装的全部 Linux 发行版 |
| 安装与更新 | `wsl --update` | 更新 WSL 核心与内置 Linux 内核至最新版本 |
| 状态查看 | `wsl --list --verbose`（简写 `wsl -l -v`） | 查看已安装发行版、当前运行状态及版本（1 或 2） |
| 状态查看 | `wsl --status` | 查看默认发行版、默认 WSL 版本与内核状态 |
| 状态查看 | `wsl --version` | 查看 WSL、内核、WSLg 等各组件的具体版本号 |
| 启动与切换 | `wsl ~` | 启动默认发行版并直接进入 Linux 家目录 `~` |
| 启动与切换 | `wsl -d <发行版>` | 启动指定名称的发行版 |
| 启动与切换 | `wsl -u root` | 以 `root` 身份进入默认发行版（用于忘记普通用户密码时用 `passwd <用户名>` 重置） |
| 启动与切换 | `exit`（在 Linux 内执行） | 退出当前 Linux 会话返回 Windows 终端 |
| 文件互通 | `explorer.exe .`（在 Linux 内执行） | 用 Windows 资源管理器打开当前所在的 Linux 目录 |
| 停止与内存 | `wsl --terminate <发行版>`（简写 `wsl -t <发行版>`） | 强制停止某一个指定发行版 |
| 停止与内存 | `wsl --shutdown` | 彻底关闭全部发行版与 WSL 2 轻量虚拟机，释放内存并使 `.wslconfig` 生效 |
| 默认配置 | `wsl --set-default <发行版>`（简写 `wsl -s <发行版>`） | 设置直接运行 `wsl` 时默认启动的发行版 |
| 默认配置 | `wsl --set-version <发行版> 2` | 将旧的 WSL 1 发行版转换为 WSL 2 |
| 备份与卸载 | `wsl --export <发行版> <路径.tar>` | 将整个发行版打包导出为 `.tar` 归档用于备份或迁移 |
| 备份与卸载 | `wsl --import <新名称> <安装目录> <路径.tar>` | 从 `.tar` 归档导入发行版到指定目录（可用于迁移出 C 盘） |
| 备份与卸载 | `wsl --unregister <发行版>` | 注销并**不可逆删除**该发行版及其虚拟磁盘内的全部文件 |

参考依据：微软《Install Linux on Windows with WSL》《Comparing WSL versions》《Basic commands for WSL》《Advanced settings configuration in WSL》《Run Linux GUI apps on WSL》《Accessing network applications with WSL》。
