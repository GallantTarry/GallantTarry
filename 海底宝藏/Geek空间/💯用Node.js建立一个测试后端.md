# 💯用Node.js建立一个测试后端

在编写前端网络层代码（例如将原生 `fetch` 的 `GET`、`POST` 请求与异常状态处理封装为通用工具函数）时，仅依靠静态数据往往难以完整检验真实的 HTTP 交互链路：请求头是否正确传递、JSON 载荷是否成功序列化、跨域响应头是否生效，以及服务端返回 `4xx` 客户端错误时调用方能否准确捕获。

相比接入结构复杂的第三方公共接口，在本地使用 **Node.js** 与 **Express** 构建一个受控的最小测试后端，是成本最低、因果关系最清晰的验证方式。本文将从零搭建这一本地服务，并通过浏览器实证检验数据读取、写入留存、参数校验与进程内存生命周期。

---

## 一、环境确认与项目目录

动手之前，请先打开系统终端执行以下命令，确认本机已安装 **Node.js**：

```powershell
node -v
```

请确认输出的主版本号**至少为 `18`**（例如 `v18.x`、`v20.x` 或 `v22.x`）。下文通过 `npm install express` 默认安装的是 **Express 5**，这也是其官方运行环境的最低版本要求（详见 [Express 官方安装文档](https://expressjs.com/en/starter/installing/)）。若本机未安装或版本过旧，请先前往 [Node.js 官网](https://nodejs.org/) 安装当前 LTS（长期支持）版本。

确认环境合格后，在桌面或工作区新建一个独立文件夹，命名为 `test-server`，用于存放服务端源码与依赖配置。

---

## 二、初始化工程与安装依赖

打开新建的 `test-server` 文件夹，在文件夹空白处**按住 `Shift` 键并点击鼠标右键**，选择“在终端中打开”（或“在此处打开 PowerShell 窗口”），依次运行以下两行命令：

```powershell
npm init -y
npm install express cors
```

- `npm init -y`：按默认参数在当前目录生成工程清单文件 `package.json`。
- `npm install express cors`：下载 `express` 与 `cors` 两个依赖包至本地 `node_modules` 目录，并将版本约束写入 `package.json`。

> **Windows PowerShell 执行策略排障说明**
>
> 若运行 `npm` 时终端提示无法加载 `npm.ps1`（`因为在此系统上禁止运行脚本`），原因在于 Windows 客户端版 PowerShell 默认采用 `Restricted` 执行策略，拦截了 `.ps1` 脚本。此时**无需修改当前系统账户的执行策略**，直接将上述两行命令开头的 `npm` 替换为批处理入口 `npm.cmd` 即可正常运行：
>
> ```powershell
> npm.cmd init -y
> npm.cmd install express cors
> ```
>
> `npm.cmd` 由传统命令处理器执行，不受 PowerShell 脚本策略限制，也不会持续改变后续 PowerShell 窗口的安全配置（关于各执行策略与作用域的边界，可参阅 [Microsoft PowerShell 执行策略文档](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies)）。

### 为什么需要这两个依赖？

1. **`express`**：Node.js 生态中最经典的轻量级 Web 框架，负责监听本地端口、按路径与方法分发路由（如 `GET /api/posts` 与 `POST /api/posts`）、解析请求体并构造标准 HTTP 响应。
2. **`cors`**：跨域资源共享（Cross-Origin Resource Sharing）中间件（详见 [Express CORS 中间件文档](https://expressjs.com/en/resources/middleware/cors/)）。
   浏览器的**同源策略**规定，只有当前端页面与目标接口的**协议、主机名、端口号**三者完全一致时才属于同源；一旦任一要素不同，浏览器就会检查服务端响应中是否带有 `Access-Control-Allow-Origin` 等许可头。直接对比本文涉及的具体地址最容易看清它的用处：

| 发起 `fetch` 请求的页面位置 | 请求的目标接口 | 同源判定 | 是否依赖 `cors()` |
| :--- | :--- | :---: | :--- |
| 浏览器已打开 `http://localhost:3000/api/posts`，在该页面的控制台发请求 | `http://localhost:3000/api/posts` | **同源** | **不需要**（下文第五节的控制台演示即便去掉 `app.use(cors())` 也能完成） |
| 以后将前端运行在 `http://localhost:5173` 等开发服务器上 | `http://localhost:3000/api/posts` | **跨域**（端口 `5173` ≠ `3000`） | **需要**（两个端口不同，此时 `cors()` 下发的响应头就派上用场了） |
| 直接双击打开本地独立的 `index.html`（协议为 `file://`，源为 `null`） | `http://localhost:3000/api/posts` | **跨域**（协议与源不同） | **需要** |

换言之，本文第五节直接在 `localhost:3000` 页面内做收发实验属于同源请求；之所以在服务端预先挂载 `app.use(cors())`，是为了当你下一步把前端代码放到 `localhost:5173` 或独立 HTML 页面中去读取 `localhost:3000` 的接口时，无需改动后端代码即可直接跨域联调。

---

## 三、编写服务端代码（`server.js`）

在 `test-server` 文件夹内新建一个文本文件，命名为 `server.js`。

> **文件扩展名检查**：Windows 资源管理器默认可能隐藏已知文件类型的扩展名。重命名时请在文件夹顶部菜单勾选**“查看/显示 -> 文件扩展名”**，确保文件全名为 `server.js`，而非 `server.js.txt`。

用代码编辑器（或记事本）打开 `server.js`，写入以下完整代码并保存：

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 挂载中间件：允许跨域访问，并将 Content-Type: application/json 的请求体解析至 req.body
app.use(cors());
app.use(express.json());

// 存放在进程内存中的模拟数据集（初始包含 1 条记录）
const posts = [
    { id: 1, title: '初始留言', body: '本地测试后端已就绪，可用于验证 GET 与 POST 请求。' }
];

// 接口 1：处理 GET 请求 —— 返回当前全部记录（状态码 200 OK）
app.get('/api/posts', (req, res) => {
    console.log(`[GET /api/posts] 已下发当前数据集，共 ${posts.length} 条记录`);
    res.json(posts);
});

// 接口 2：处理 POST 请求 —— 校验参数合法性并新增记录
app.post('/api/posts', (req, res) => {
    // 若客户端未携带 JSON 请求体，Express 5 中 req.body 为 undefined，此处用空对象兜底
    const { title, body } = req.body || {};

    // 入参校验：漏传 title 或 body（或并非非空字符串）时返回 400 Bad Request
    if (typeof title !== 'string' || !title.trim() || typeof body !== 'string' || !body.trim()) {
        console.log('[POST /api/posts] 参数校验未通过，拒绝入库:', req.body);
        return res.status(400).json({
            error: '请求参数不完整：请以 JSON 格式同时提供非空的 title 与 body 字符串。'
        });
    }

    const newPost = {
        id: posts.length + 1,
        title: title.trim(),
        body: body.trim()
    };
    posts.push(newPost);

    console.log(`[POST /api/posts] 已新增记录 id=${newPost.id}:`, newPost);
    res.status(201).json({
        message: '记录已创建',
        data: newPost
    });
});

app.listen(PORT, () => {
    console.log(`测试后端已启动，正在监听端口 ${PORT}`);
    console.log(`接口地址: http://localhost:${PORT}/api/posts`);
});
```

阅读上述代码时，有两个关键设计细节值得留意：

- **`app.use(express.json())` 的解析机制**：网络层传来的原始请求体只是字节流；该中间件会识别带有 `Content-Type: application/json` 请求头的报文，自动完成 JSON 反序列化并将结果挂载到 `req.body` 上。
- **为什么要显式补充 `400` 校验逻辑**：如果不校验入参，即便前端由于拼写失误只发了一个空对象 `{}` 或把字段名写成了 `content`，服务端也会新增一条只有 `id` 的残缺记录并返回 `201`（创建成功）。加上对 `title` 和 `body` 的非空校验并返回 `400 Bad Request` 后，前端一旦漏带请求头或写错字段名，一测便知；同时也为你封装的 `fetch` 函数提供了验证异常分支（`!res.ok`）的标准用例。

---

## 四、启动本地服务

回到刚才停留在 `test-server` 目录的终端窗口，执行启动命令：

```powershell
node server.js
```

若环境与代码无误，终端会输出以下监听信息并保持运行状态（测试期间请勿关闭该窗口）：

```text
测试后端已启动，正在监听端口 3000
接口地址: http://localhost:3000/api/posts
```

---

## 五、闭环实证：读取、写入与异常校验

下面在浏览器中分三步验证该后端的完整行为闭环：

### 1. 验证 `GET` 请求：读取初始记录

打开浏览器，在地址栏输入 `http://localhost:3000/api/posts` 并回车。浏览器地址栏访问默认发起 `GET` 请求，页面上会直接显示出初始的那 **1 条**“初始留言” JSON 记录；同时终端窗口会打印 `[GET /api/posts] 已下发当前数据集，共 1 条记录`。

### 2. 验证合法 `POST` 请求：写入新记录并刷新核验

保持在当前的浏览器页面，按下 `F12` 打开开发者工具，切换到 **Console（控制台）** 面板，粘贴以下代码并回车：

```javascript
fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '第二条留言', body: '验证 POST JSON 载荷解析与服务端状态留存。' })
}).then(async r => console.log('状态码:', r.status, '响应体:', await r.json()));
```

回车后，控制台会立即打印出 `状态码: 201` 以及包含 `id: 2` 的响应对象，终端窗口也会同步打印新增日志。**此时刷新一下浏览器页面**（再次发起 `GET` 请求），可以看到页面上的 JSON 数组已经从 1 条变成了 **2 条**——这直接证实服务端不仅收到了前端提交的数据，而且将其留存在了状态中供后续请求读取。

### 3. 验证非法 `POST` 请求：触发 `400` 参数拦截

继续在控制台粘贴一段故意漏传 `body` 字段（或把字段名写错）的请求代码：

```javascript
fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '漏传正文字段的测试' })
}).then(async r => console.log('状态码:', r.status, '响应体:', await r.json()));
```

控制台会返回 `状态码: 400` 与明确的错误提示（`请求参数不完整：请以 JSON 格式同时提供非空的 title 与 body 字符串。`）。再次刷新浏览器页面，记录数依然保持为 **2 条**，残缺数据未被写入。

---

## 六、状态生命周期：为什么重启服务后只剩回初始的一条？

如果在终端窗口按下 `Ctrl + C` 停止服务（或直接关掉终端窗口），随后重新执行 `node server.js` 并刷新浏览器页面，你会发现刚才新增的第 2 条留言消失了，接口返回的数据又回到了最初的 **1 条**。

原因在于**易失性内存与持久化存储的边界**：代码中的 `posts` 数组变量只分配在当前 `node` 进程的**系统内存（RAM）**中，并未写入磁盘文件或外部数据库。一旦进程终止，操作系统内核会立即回收该进程占用的全部内存空间；下次重新运行 `node server.js` 时启动的是一个全新的进程，`posts` 数组会按源码重新初始化。

对于日常测试前端请求组件而言，“重启即干净复位”恰好提供了可重复的受控实验环境；若后续希望跨重启长期保留数据，只需将对内存数组的读写替换为本地文件存储（如 Node.js 内置的 `node:fs`、`node:sqlite`）或独立的数据库服务即可。
