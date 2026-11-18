# Node.js 与 npm 实战使用手册

如果说理解 Node.js 与 npm 的原理是“内功心法”，那么熟练掌握它们的命令行操作与工程配置就是日常开发的“随身兵器谱”。本手册涵盖从环境初始化、镜像加速、依赖管理、脚本编排到故障排查的全流程高频指令，适合作为日常开发的速查案头书。

---

### 一、 环境检查与镜像加速（起手式）

安装完 Node.js 后，第一步是确认环境就绪，并将 npm 下载源切换为国内镜像（彻底告别 `npm install` 卡死或超时）。

#### 1. 查看版本与路径
```bash
# 查看 Node.js 版本（推荐使用偶数号 LTS 长期支持版，如 v20.x / v22.x）
node -v

# 查看 npm 与 npx 版本
npm -v
npx -v

# 查看全局安装包的存放目录
npm root -g
```

#### 2. 配置国内镜像源（必做）
官方默认源（`https://registry.npmjs.org/`）服务器在海外，国内直接拉取极易超时。

```bash
# 1. 查看当前使用的镜像源
npm config get registry

# 2. 永久切换为淘宝/阿里云官方新镜像源（npmmirror）
npm config set registry [https://registry.npmmirror.com](https://registry.npmmirror.com)

# 3. 还原为官方默认源（当你准备发布自己的 npm 包时必须切回官方源）
npm config set registry [https://registry.npmjs.org/](https://registry.npmjs.org/)
```

> **进阶技巧（使用 `nrm` 一键切源）：**
> 如果你经常需要在“国内镜像源”、“官方源”和“公司内网私有源”之间来回切换，可以全局安装源管理工具 `nrm`：
> ```bash
> npm install -g nrm
> nrm ls               # 列出所有可用源及当前高亮源
> nrm test             # 测试各个源的响应延迟（毫秒）
> nrm use taobao       # 一键切换到国内源
> nrm use npm          # 一键切回官方源
> ```

---

### 二、 项目初始化与 Node.js 基础运行

#### 1. 运行 JS 脚本与交互式终端 (REPL)
```bash
# 直接用 Node 执行本地 JavaScript 文件
node app.js

# Node 18.11+ 原生支持监听模式（修改代码后自动重启，无需安装 nodemon！）
node --watch app.js

# Node 20.6+ 原生支持直接加载 .env 环境变量文件（无需安装 dotenv！）
node --env-file=.env app.js

# 直接输入 node 回车，进入交互式命令行（类似浏览器控制台，按两次 Ctrl+C 退出）
node
```

#### 2. 初始化新项目
```bash
# 交互式创建 package.json（会依次询问项目名、版本、入口文件等）
npm init

# 跳过所有询问，直接按默认配置秒建 package.json（最常用）
npm init -y
```

---

### 三、 依赖包安装、更新与卸载（核心高频）

在 npm 中，装包主要分为 **本地安装（项目级）** 和 **全局安装（系统级）** 两大类。

#### 1. 安装依赖 (`npm install` / 简写 `npm i`)

| 场景说明 | 完整命令 | 常用简写 | 写入 `package.json` 的位置 |
| --- | --- | --- | --- |
| **装全部依赖**（刚克隆别人项目时） | `npm install` | `npm i` | 读取现有配置，生成 `node_modules` |
| **生产环境依赖**（上线运行也需要的库，如 `vue`、`express`） | `npm install express --save` | `npm i express` | `dependencies`（默认项） |
| **开发环境依赖**（仅打包、代码检查用，如 `vite`、`typescript`） | `npm install vite --save-dev` | `npm i -D vite` | `devDependencies` |
| **指定精确版本安装** | `npm install dayjs@1.11.10` | `npm i dayjs@1.11.10` | 安装特定版本或大版本（如 `vue@3`） |
| **锁定精确版本**（不带 `^` 号） | `npm install axios --save-exact` | `npm i -E axios` | 写入 `"axios": "1.7.2"` 而非 `"^1.7.2"` |
| **全局安装命令行工具**（随处可用，如 `pm2`、`nrm`） | `npm install --global pm2` | `npm i -g pm2` | 不写入当前项目，存入系统全局目录 |
| **CI/CD 严格模式安装**（严格按 lock 文件极速安装） | `npm ci` | `npm ci` | 要求必须存在 `package-lock.json` 且不修改它 |

#### 2. 查看、更新与卸载依赖

```bash
# 查看当前项目已安装的顶层依赖树（--depth=0 避免打印几千行子依赖）
npm list --depth=0

# 查看全局安装了哪些工具包
npm list -g --depth=0

# 检查当前项目有哪些包过时了（会对比 Current / Wanted / Latest 三个版本）
npm outdated

# 将过时的包升级到符合 package.json 版本规则的最新版本
npm update

# 卸载本地依赖包（同时会自动从 package.json 中移除记录）
npm uninstall axios
# 简写：npm un axios 或 npm rm axios

# 卸载全局工具包
npm uninstall -g pm2
```

---

### 四、 读懂 `package.json` 与版本号玄学

打开任何一个现代 Node.js 项目的 `package.json`，你都会看到类似下面的配置：

```json
{
  "name": "tukuai-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js",
    "build": "vite build"
  },
  "dependencies": {
    "express": "^4.21.0",
    "dayjs": "~1.11.10"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

#### 1. 关键字段速解
- **`"type": "module"`**：声明项目默认使用现代 ES Module 语法（即 `import / export`）。如果不写或设为 `"commonjs"`，则默认使用传统的 `require() / module.exports`。
- **`"scripts"`**：自定义快捷指令。配置后即可在终端运行 `npm run <指令名>`。

#### 2. 语义化版本 (SemVer) 与符号含义
npm 遵循 **`主版本号.次版本号.修订号` (`Major.Minor.Patch`)** 规范，例如 `4.21.0`：
- **主版本号 (Major)**：做了不兼容的 API 破坏性更新（如 Vue 2 升 Vue 3）。
- **次版本号 (Minor)**：向下兼容的新功能迭代。
- **修订号 (Patch)**：向下兼容的 Bug 修复与安全补丁。

版本号前面的符号决定了别人执行 `npm install` 时允许自动升级的范围：
- **`^4.21.0`（插入符，npm 默认）**：**锁定第一位非零主版本号**。允许升级次版本和修订号（即允许安装 `>=4.21.0` 且 `<5.0.0` 的最新版本）。
- **`~1.11.10`（波浪号）**：**锁定主版本与次版本**。只允许升级最后的补丁号（即允许安装 `>=1.11.10` 且 `<1.12.0` 的版本）。
- **`1.11.10`（无符号）**：**死锁版本**，必须一字不差地安装 `1.11.10`。
- **`*` 或 `latest`**：永远安装最新版（极易因大版本更新导致项目崩溃，生产环境严禁使用）。

---

### 五、 脚本运行 (`npm run`) 与神器 `npx`

#### 1. `npm run` 执行脚本与钩子
```bash
# 列出当前项目 package.json 中配置的所有可用脚本
npm run

# 运行自定义脚本（如 dev、build、lint）
npm run dev
npm run build

# 特殊内置脚本：start 和 test 可以省略 run！
npm start    # 等同于 npm run start
npm test     # 等同于 npm run test
```

> **自动生命周期钩子 (`pre` 与 `post`)：**
> 如果你在 `scripts` 里同时定义了 `"prebuild"`、`"build"` 和 `"postbuild"`，当你执行 `npm run build` 时，npm 会自动按 **`prebuild` → `build` → `postbuild`** 的顺序依次执行（常用于打包前自动清理旧目录 `rimraf dist`）。

#### 2. `npx`：用完即走的免安装执行器
以前想用脚手架创建项目，必须先 `npm i -g create-vue` 污染全局环境，过几个月版本还过期了。现在直接用 `npx`：

```bash
# 1. 临时下载并执行最新版的脚手架（不污染全局，用完即走）
npx create-vue@latest
npx create-next-app@latest

# 2. 直接调用当前项目 node_modules/.bin 下的局部工具
npx vite --port 8080
npx eslint ./src

# 3. 随手把当前文件夹变成一个本地静态网页服务器（前端调试神技！）
npx serve .
```

---

### 六、 进阶技能：本地调试与发布自己的 npm 包

当你自己封装了一个好用的工具库（比如轻量请求库或 CLI 工具），想在本地其他项目测试，或者发布到全球 npm 仓库时：

#### 1. 本地跨项目软链接调试 (`npm link`)
```bash
# 第一步：进入你正在开发的工具库目录，将其注册到全局软链接
cd ./my-utils-lib
npm link

# 第二步：进入你的业务项目目录，链接刚才的工具库（修改工具库源码会实时生效！）
cd ../my-web-app
npm link my-utils-lib
```

#### 2. 发布自己的开源包到 npm 官网
```bash
# 1. 确保已切回 npm 官方源（国内镜像源是只读的，无法发包！）
npm config set registry [https://registry.npmjs.org/](https://registry.npmjs.org/)

# 2. 在终端登录你的 npm 账号（会引导在浏览器完成验证）
npm login

# 3. 检查当前登录状态
npm whoami

# 4. 升级版本号（自动修改 package.json 并生成 git tag）
npm version patch   # 补丁升级：1.0.0 -> 1.0.1（另有 minor / major）

# 5. 正式发布到全球注册表（如果是带 @作用域 的公开包，需加 --access public）
npm publish
```

---

### 七、 常见报错急救箱（踩坑速查）

1. **`npm install` 报 `EACCES` 权限拒绝错误**
    - **原因**：在 Linux/macOS 下全局安装包时没有系统目录写入权限，或者 Windows 下终端未以管理员运行。
    - **解决**：Windows 下右键“以管理员身份运行”终端；macOS/Linux 推荐使用 `nvm` 或 `fnm` 管理 Node 版本，避免使用 `sudo npm install`。
2. **`npm ERR! code ERESOLVE unable to resolve dependency tree`（依赖冲突）**
    - **原因**：npm v7+ 默认开启了极其严格的同级依赖（`peerDependencies`）检查，老插件和新版框架版本对不上时直接拒绝安装。
    - **解决**：加上 `--legacy-peer-deps` 参数忽略同级依赖冲突：
      ```bash
      npm install --legacy-peer-deps
      ```
3. **`node_modules` 损坏或玄学报错（终极重启大法）**
    - **症状**：昨天还好好的，今天拉完代码各种莫名其妙找不到模块或缓存校验失败（`EINTEGRITY`）。
    - **解决**：清理缓存并重装依赖：
      ```bash
      # 1. 强制清理 npm 本地缓存
      npm cache clean --force
 
      # 2. 删除 node_modules 与 package-lock.json（可借助 npx rimraf 极速删除）
      npx rimraf node_modules package-lock.json
 
      # 3. 重新安装
      npm install
      ```

---

### 八、 附：一页纸高频指令速查表

| 操作目标 | 速查命令 |
| --- | --- |
| 秒建项目配置 | `npm init -y` |
| 切换国内镜像源 | `npm config set registry https://registry.npmmirror.com` |
| 安装全部依赖 | `npm i` |
| 安装生产依赖 | `npm i <包名>` |
| 安装开发依赖 | `npm i -D <包名>` |
| 全局安装工具 | `npm i -g <包名>` |
| 卸载指定依赖 | `npm un <包名>` |
| 查看已装顶层包 | `npm list --depth=0` |
| 忽略冲突强制安装 | `npm i --legacy-peer-deps` |
| 极速删除 `node_modules` | `npx rimraf node_modules` |
| 启动文件热重载（Node 18+） | `node --watch app.js` |

### 番外篇：形影不离的亲兄弟 —— `npx` 是什么？

当你安装好 Node.js 和 npm（5.2+ 版本）后，电脑里其实还自动附赠了一个神器——**`npx` (Node Package Execute)**。

很多初学者分不清 `npm` 和 `npx` 的区别，如果延续前面“智能手机”的比喻，一句话就能彻底秒懂：

> **`npm` 是去应用商店把 App “下载并永久安装”到手机桌面；而 `npx` 则是直接点开一个“微信小程序”——即点即用、用完即走、不占内存。**

#### 1. 为什么有了 `npm`，还需要 `npx`？

在没有 `npx` 的年代，如果你想用一些命令行工具（比如创建 Vue 项目的脚手架 `create-vue`，或者把当前文件夹变成网页预览服务器的 `serve`），你会遇到两个极其头疼的痛点：

- **痛点一：低频工具占空间且容易过期。** 创建项目的脚手架你可能半年才用一次。如果用 `npm install -g create-vue` 永久装进电脑 C 盘，不仅白占空间，等半年后你想建新项目时，电脑里存的还是半年前的旧版本。
- **痛点二：调用项目内部工具太繁琐。** 如果你把 `vite` 装在了当前项目的 `node_modules` 里（没有全局安装），你在终端直接敲 `vite` 会报错“找不到命令”，你必须痛苦地敲出完整路径 `./node_modules/.bin/vite` 才能运行。

**`npx` 的出现，就是为了专门负责“执行 (Execute)”而非“管理 (Manage)”：**

| 对比维度 | `npm` (Node Package Manager) | `npx` (Node Package Execute) |
| --- | --- | --- |
| **核心职责** | **管包（下载与管理）**：把代码库永久安装到项目或系统里 | **跑包（直接执行）**：直接运行某个包里的可执行命令 |
| **通俗比喻** | 去 App Store **下载安装**软件到电脑硬盘 | 在微信里点开一个**小程序**，用完即走 |
| **适用场景** | 项目天天要引入的核心依赖（如 `npm i express`、`npm i vue`） | 一次性脚手架、临时小工具、直接调用项目内部的局部命令 |

#### 2. `npx` 的底层三步查找逻辑

当你在终端敲下 `npx <命令名>`（例如 `npx vite` 或 `npx serve`）时，它在背后会聪明地按以下顺序执行：

1. **先找当前项目**：去当前目录的 `./node_modules/.bin/` 文件夹里找有没有这个命令，有就直接运行（完美解决局部工具调用难的问题）。
2. **再找系统全局**：如果项目里没有，就去你电脑的全局安装目录（`npm root -g`）里找，有就直接运行。
3. **最后云端临时拉取**：如果本地和全局都没装过，它会**自动从 npm 云端仓库把最新版的包下载到临时缓存里执行，等命令运行结束，再自动清理掉**，绝不污染你的全局环境！

#### 3. 日常开发必背的 4 个 `npx` 神仙用法

```bash
# 用法 1：免安装一键初始化最新项目（永远拉取最新脚手架，用完即走）
npx create-vue@latest
npx create-next-app@latest

# 用法 2：随手把当前文件夹变成一个本地静态网页服务器（前端预览 HTML 神技！）
npx serve .

# 用法 3：极速秒删重达几个 G 的 node_modules 文件夹（比 Windows 右键删除快 10 倍）
npx rimraf node_modules

# 用法 4：直接运行当前项目内部安装的构建或检查工具（无需写成 npm scripts）
npx vite --port 8080
npx eslint ./src --fix
```