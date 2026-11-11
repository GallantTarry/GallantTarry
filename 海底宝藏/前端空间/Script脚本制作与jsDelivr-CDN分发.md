# Script 脚本制作与 jsDelivr CDN 分发

**你说的服务叫 jsDelivr。常见流程是：编写 JavaScript → 保存为 `.js` 文件 → 按需打包、压缩 → 发布到 GitHub 公开仓库或 npm 公开包 → 在网页里用 `<script src="CDN地址">` 引用。通常不需要再把文件上传到 jsDelivr，也不需要先创建 Cloudflare KV。**

jsDelivr 提供公开资源分发入口；浏览器下载脚本后，代码在访问者的浏览器中执行。[jsDelivr 官方文档](https://github.com/jsdelivr/jsdelivr#usage-documentation)、[HTML script 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

## 一、`script`、`.js`、`.min.js` 和 CDN 分别是什么？

| 名称 | 示例 | 作用 |
|---|---|---|
| JavaScript 代码 | `button.addEventListener(...)` | 定义网页交互逻辑 |
| `.js` 文件 | `hello.js` | 保存 JavaScript 源代码的文本文件 |
| `.min.js` 文件 | `hello.min.js` | 压缩后的 JavaScript，仍然可以被浏览器执行 |
| HTML 的 `<script>` 标签 | `<script src="./hello.js"></script>` | 告诉浏览器加载和执行哪个脚本 |
| GitHub / npm | 公开仓库或公开软件包 | 保存和发布脚本版本 |
| jsDelivr CDN | `https://cdn.jsdelivr.net/...` | 获取、缓存并分发公开文件 |

**制作脚本本身不一定需要 Node.js。** 用编辑器写代码，保存成 UTF-8 的 `.js` 文件就可以。Terser、esbuild 等工具通常才需要 Node.js 环境。

```text
你编写 hello.js
        ↓
生成 dist/hello.min.js
        ↓
发布到 GitHub / npm
        ↓
网页引用 jsDelivr URL
        ↓
浏览器下载 JavaScript → 执行代码 → 页面产生交互
```

这里有两个阶段：开发者先发布文件；访问者打开网页时，浏览器再请求 CDN 地址。CDN 的缓存可以减少对原始发布源的重复获取。[jsDelivr 的分发与缓存设计](https://github.com/jsdelivr/jsdelivr#ready-for-production)

## 二、从零制作一个可以运行的脚本

### 1. 创建 `hello.js`

下面这个脚本让按钮每点一次，计数增加一次：

```javascript
(function () {
  function init() {
    const root = document.getElementById("hello-widget");
    if (!root || root.dataset.ready === "1") return;

    const button = root.querySelector("button");
    const output = root.querySelector("output");
    if (!button || !output) return;

    let count = 0;
    button.addEventListener("click", function () {
      count += 1;
      output.textContent = "已点击 " + count + " 次";
    });

    root.dataset.ready = "1";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
```

注意，`.js` 文件里面只保存 JavaScript，**不要把 `<script>` 和 `</script>` 标签也放进去**。Windows 中还要检查实际文件名没有变成 `hello.js.txt`。

### 2. 创建 `index.html`，先测试本地脚本

把下面文件和 `hello.js` 放在同一个文件夹：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>我的第一个脚本</title>
  <script src="./hello.js" defer></script>
</head>
<body>
  <section id="hello-widget">
    <button type="button">点一下</button>
    <output aria-live="polite">已点击 0 次</output>
  </section>
</body>
</html>
```

这个不含网络请求或模块导入的小示例可以直接用浏览器打开 `index.html`。按钮点击后，文字应该更新；刷新页面会重新从 0 开始，因为计数只保存在本次页面的内存中。

`defer` 适用于这里的外部普通脚本，使其在 HTML 解析完成后执行。它不会让脚本自动拥有后端能力。[script 的加载规则](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#defer)

### 3. 如果你已有一篇带交互的 Markdown 文章

像你之前提供的 DHCP 文章，可以把 `<script>…</script>` **内部的完整逻辑**提取到 `dhcp-widget.js`。页面中的 HTML 结构和 CSS 样式继续保留，再把原脚本位置替换为外部引用。

> **外链脚本不会自动补齐它需要的 HTML 和 CSS。** 本文 `hello.js` 需要页面存在 `id="hello-widget"` 的元素。若改成动态文档站，文章内容可能在脚本运行之后才插入，需要在文档站的页面渲染完成钩子中初始化；仅加 `defer` 不能解决所有动态路由问题。

## 三、生成用于发布的 `.min.js`

在项目文件夹中打开终端。只有新目录还没有 `package.json` 时，先运行：

```bash
npm init -y
```

安装 Terser：

```bash
npm install --save-dev terser
```

先在项目中建立 `dist` 文件夹，然后压缩：

```bash
npx terser hello.js --compress --mangle --output dist/hello.min.js --source-map "url='hello.min.js.map',includeSources"
```

结果包含源文件、压缩文件和调试映射：

```text
my-scripts/
├─ hello.js
├─ index.html
├─ package.json
└─ dist/
   ├─ hello.min.js
   └─ hello.min.js.map
```

先把测试页面的引用改为 `./dist/hello.min.js`，重新检查按钮行为。以后维护 `hello.js`，再重新生成发布文件。[Terser 压缩与 Source Map 参数](https://terser.org/docs/cli-usage/)

**压缩和打包是两回事。** 上面这个脚本没有其他依赖，可以直接压缩。若你的入口使用多个模块，想让普通 `<script>` 加载一个独立文件，可在评估依赖能否运行于浏览器后，用 esbuild 打包，例如：

```bash
npm install --save-dev --save-exact esbuild
npx esbuild src/index.js --bundle --minify --platform=browser --format=iife --outfile=dist/app.min.js
```

这个命令针对自动执行的浏览器入口；如果要向外提供库 API，还需设计导出方式。将 Node.js 专用代码搬到 CDN，并不会使文件系统等 Node API 自动可用于浏览器。[esbuild 打包与输出格式](https://esbuild.github.io/api/#bundle)

## 四、使用 GitHub + jsDelivr 分发自己的脚本

对这个独立脚本，可以先用 GitHub 路线。

### 1. 将文件提交到公开仓库

假设你创建了公开仓库 `my-scripts`，把源文件和 `dist` 里的发布文件提交进去。`node_modules` 不需要上传。

仓库里必须真的存在 `dist/hello.min.js`。**只把它作为 Release 的下载附件上传，不等于仓库的这个路径里存在该文件。**

### 2. 为当前代码创建版本 tag

例如创建 tag `v1.0.0`，指向已经包含 `dist/hello.min.js` 的提交。可在 GitHub 的 Releases 页面创建发布并选择或新建 tag；页面标题并不是 CDN 使用的版本标识，URL 中使用实际 tag 名。[GitHub 发布与 tag 操作](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)

### 3. 按规则拼出 CDN 地址

GitHub 文件地址的结构是：

```text
https://cdn.jsdelivr.net/gh/用户名/仓库名@版本/文件路径
```

对应这个例子：

```text
https://cdn.jsdelivr.net/gh/YOUR_GITHUB_NAME/my-scripts@v1.0.0/dist/hello.min.js
```

`YOUR_GITHUB_NAME` 是占位符，必须换成你自己的用户名。版本处可使用 tag、commit 或分支；发布页面适合使用固定 tag 或 commit。[jsDelivr GitHub URL 规则](https://github.com/jsdelivr/jsdelivr#github)

### 4. 在网页里使用 CDN 地址

保留网页里的按钮和 output，将原来的脚本标签替换为：

```html
<script
  src="https://cdn.jsdelivr.net/gh/YOUR_GITHUB_NAME/my-scripts@v1.0.0/dist/hello.min.js"
  defer>
</script>
```

不要同时保留本地和 CDN 两个引用，以免同一个脚本执行两次。最终你提供给别人的是这段引用方法，以及脚本所需要的页面结构。

### 5. 核实分发结果

1. 先直接访问生成的 CDN 地址，检查返回的是目标 JavaScript，而不是错误文本。
2. 在实际网页按 `F12`，查看 Network，确认脚本请求成功。
3. 查看 Console 是否有语法、加载或元素不存在等错误。
4. 点击按钮，验证实际功能。

jsDelivr 有自动压缩功能：在支持的 JS 文件路径中请求 `.min.js`，若对应压缩文件不存在，可以生成压缩版本。不过自行构建并检查发布产物，更容易明确你实际分发的内容。[自动压缩说明](https://github.com/jsdelivr/jsdelivr#github)

## 五、npm + jsDelivr 是另一条发布路线

如果你希望把脚本作为可复用软件包发布，可使用 npm。比如你的公开包名是 `@YOUR_NPM_NAME/hello-widget`，版本为 `1.0.0`，包内包含 `dist/hello.min.js`，地址就为：

```text
https://cdn.jsdelivr.net/npm/@YOUR_NPM_NAME/hello-widget@1.0.0/dist/hello.min.js
```

在项目 `package.json` 中可以按实际情况合并这些字段：

```json
{
  "name": "@YOUR_NPM_NAME/hello-widget",
  "version": "1.0.0",
  "files": ["dist"],
  "jsdelivr": "dist/hello.min.js"
}
```

其中 `YOUR_NPM_NAME` 要换成你拥有发布权限的 npm scope；`files` 表示要发布的文件范围；`jsdelivr` 指定简短 CDN 地址默认使用的文件。完整路径地址仍可以直接指定文件。[jsDelivr 软件包入口说明](https://github.com/jsdelivr/jsdelivr#publishing-packages)

先检查打包清单，再登录并发布：

```bash
npm pack --dry-run
npm login
npm publish --access public
```

发布需要 npm 账户和当前要求的发布认证；检查清单中确实包含 `dist`，并确认没有 `"private": true` 阻止发布。上面的发布命令会真正公开软件包，应在文件和版本准备好后由你执行。[npm 公开 scope 包发布](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)

> **普通文件分发与 ESM 服务要区分。** `/npm/.../file.js` 直接提供该文件；它不会仅因扩展名是 `.js` 就自动变成适合普通 script 的浏览器包。jsDelivr 另有 `/+esm` 转换与打包服务，属于另一种加载方式。[jsDelivr ESM 说明](https://www.jsdelivr.com/blog/making-more-npm-packages-work-with-jsdelivr-esm/)

## 六、更新脚本时，为什么改完还没生效？

**推荐把一个发布版本视为固定内容：修复代码后发布 `v1.0.1`，网页地址也改成 `@v1.0.1`。**

例如：

```text
旧版本：.../my-scripts@v1.0.0/dist/hello.min.js
新版本：.../my-scripts@v1.0.1/dist/hello.min.js
```

不要指望修改原来的 tag 后，旧版本 URL 一定会变成新内容。jsDelivr 对固定版本和 commit 有长期保存机制；分支和 `latest` 等动态地址也有缓存。[jsDelivr 缓存机制](https://github.com/jsdelivr/jsdelivr#caching)

官方清缓存工具主要用于 `latest` 或版本别名的更新，**不会改变固定版本链接，也不会删除永久存储中的文件**。[jsDelivr 清缓存工具](https://www.jsdelivr.com/tools/purge)

## 七、它和刚才的 Cloudflare KV 有什么关系？

| 工具 | 在这个例子里的职责 |
|---|---|
| jsDelivr | 把公开的 JavaScript 文件分发给浏览器 |
| 浏览器 | 执行脚本、响应点击、修改页面 |
| Cloudflare Workers | 运行后端请求处理逻辑，按需提供 API |
| Cloudflare KV | 给后端保存和读取键值数据 |

本文点击计数只需要浏览器脚本，不需要 KV。如果希望刷新页面、换设备后仍能读取同一份数据，就需要进一步设计持久化方案。浏览器中的脚本也不能直接使用 Worker 的 `env.SITE_CONFIG`；通常由 Worker 提供 API，再由页面脚本调用。

如果以后要把点击次数做成精确的共享计数器，还需选择支持所需一致性和并发更新的存储，不能仅用普通 KV 的 `get()` 加 `put()` 代替原子加一。[KV 的一致性边界](https://developers.cloudflare.com/kv/concepts/how-kv-works/#consistency)

## 八、常见问题

| 现象 | 优先检查 |
|---|---|
| CDN 地址返回找不到文件 | 用户名、仓库、tag 和路径是否正确；文件是否已提交到该版本 |
| 地址返回代码，但页面不运行 | 页面是否允许脚本，是否被 CSP 拦截；Console 是否报错 |
| `Unexpected token '<'` | `.js` 中是否混入 HTML，或 URL 实际返回 HTML 错误页 |
| `require is not defined` | 是否误把 CommonJS / Node 入口直接当浏览器脚本加载 |
| `Cannot use import statement outside a module` | 是否应使用 `type="module"`，或先构建普通脚本产物 |
| 按钮无反应 | 目标 HTML 是否存在，初始化是否发生在页面内容出现之后 |
| 改完代码仍是旧功能 | 是否仍引用旧版本 URL，或动态地址尚未刷新 |

CDN 分发的浏览器脚本对访问者可见，压缩不提供保密能力；后端密钥应留在后端。实际加载效果也受访问者网络影响，应在你的目标环境检查。

## 九、交互式工具：生成 jsDelivr 引用地址

选择发布源，填写你的真实仓库或包、版本与文件路径，即可查看 URL 和 script 标签。**面板只生成文本，不会替你上传文件、发布软件包或验证链接已存在。**

<p id="jdw-static-hint">下方是 jsDelivr URL 关系演示。普通 Markdown 预览若不执行脚本，请使用正文中的示例；交互需要允许 HTML、CSS 和 JavaScript 的页面。</p>

<style>
.jdw-root {
  --jdw-text: #edf4fc;
  --jdw-muted: #bdcadd;
  --jdw-accent: #67e8f9;
  --jdw-border: rgba(148, 163, 184, .28);
  box-sizing: border-box;
  margin: 18px 0;
  padding: 22px;
  border: 1px solid var(--jdw-border);
  border-radius: 16px;
  background: radial-gradient(circle at top left, #243650, #0f172a 68%);
  color: var(--jdw-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.65;
}
.jdw-root *, .jdw-root *::before, .jdw-root *::after { box-sizing: border-box; }
.jdw-root[hidden], .jdw-root [hidden], #jdw-static-hint[hidden] { display: none !important; }
.jdw-root .jdw-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 9px; margin-bottom: 16px; }
.jdw-root .jdw-title { margin: 0; color: #fff; font-size: 19px; font-weight: 700; }
.jdw-root .jdw-badge { padding: 3px 10px; border: 1px solid var(--jdw-border); border-radius: 999px; color: var(--jdw-accent); font-size: 12px; }
.jdw-root .jdw-controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.jdw-root .jdw-control { display: block; min-width: 0; }
.jdw-root .jdw-label { display: block; margin-bottom: 5px; color: var(--jdw-muted); font-size: 13px; }
.jdw-root .jdw-input, .jdw-root .jdw-select { display: block; width: 100%; min-width: 0; min-height: 44px; padding: 9px 10px; border: 1px solid #64758c; border-radius: 8px; background: #111d30; color: var(--jdw-text); font: inherit; }
.jdw-root .jdw-help { margin: 10px 0 0; color: var(--jdw-muted); font-size: 13px; }
.jdw-root .jdw-error { min-height: 1.6em; margin: 6px 0 0; color: #fecaca; font-size: 13px; }
.jdw-root .jdw-output { margin-top: 13px; }
.jdw-root .jdw-code { margin: 6px 0 0; padding: 14px; border: 1px solid var(--jdw-border); border-radius: 10px; background: #080f1b; color: #d9f5ff; white-space: pre-wrap; overflow-wrap: anywhere; font: 13px/1.7 ui-monospace, Consolas, monospace; }
.jdw-root .jdw-note { margin: 15px 0 0; padding-top: 12px; border-top: 1px solid var(--jdw-border); color: var(--jdw-muted); font-size: 13px; }
.jdw-root input:focus-visible, .jdw-root select:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@media (max-width: 560px) {
  .jdw-root { padding: 15px; }
  .jdw-root .jdw-controls { grid-template-columns: 1fr; }
}
</style>

<section id="jsdelivr-url-widget" class="jdw-root" hidden aria-labelledby="jdw-title">
  <div class="jdw-head">
    <h3 id="jdw-title" class="jdw-title">拼出你的 jsDelivr 地址</h3>
    <span class="jdw-badge">本地生成 · 不访问链接</span>
  </div>
  <div class="jdw-controls">
    <label class="jdw-control" for="jdw-source">
      <span class="jdw-label">源文件发布在哪里？</span>
      <select id="jdw-source" class="jdw-select">
        <option value="github">GitHub 公开仓库</option>
        <option value="npm">npm 公开软件包</option>
      </select>
    </label>
    <label id="jdw-owner-control" class="jdw-control" for="jdw-owner">
      <span class="jdw-label">GitHub 用户名 / 组织名</span>
      <input id="jdw-owner" class="jdw-input" type="text" value="your-name" spellcheck="false" autocomplete="off" maxlength="100">
    </label>
    <label class="jdw-control" for="jdw-package">
      <span id="jdw-package-label" class="jdw-label">GitHub 仓库名</span>
      <input id="jdw-package" class="jdw-input" type="text" value="your-widget" spellcheck="false" autocomplete="off" maxlength="220">
    </label>
    <label class="jdw-control" for="jdw-version">
      <span id="jdw-version-label" class="jdw-label">版本标签 / 提交哈希</span>
      <input id="jdw-version" class="jdw-input" type="text" value="v1.0.0" spellcheck="false" autocomplete="off" maxlength="100">
    </label>
    <label class="jdw-control" for="jdw-file">
      <span class="jdw-label">该版本中的文件路径</span>
      <input id="jdw-file" class="jdw-input" type="text" value="dist/hello.min.js" spellcheck="false" autocomplete="off" maxlength="300">
    </label>
    <label class="jdw-control" for="jdw-mode">
      <span class="jdw-label">脚本类型</span>
      <select id="jdw-mode" class="jdw-select">
        <option value="classic">普通脚本（defer）</option>
        <option value="module">ES module（type="module"）</option>
      </select>
    </label>
  </div>
  <p id="jdw-help" class="jdw-help">建议指定已发布的固定版本或提交哈希。选择模块只会改变引用标签，不会把普通脚本转换成模块。</p>
  <p id="jdw-error" class="jdw-error" role="status" aria-live="polite"></p>
  <div class="jdw-output">
    <span class="jdw-label">CDN URL（只读文本，未验证是否存在）</span>
    <pre class="jdw-code"><code id="jdw-url"></code></pre>
  </div>
  <div class="jdw-output">
    <span class="jdw-label">页面中的引用代码</span>
    <pre class="jdw-code"><code id="jdw-script"></code></pre>
  </div>
  <p class="jdw-note">your-name、your-widget 是占位示例。请替换为已公开发布的真实仓库或 npm 包，并确认该版本包含目标文件。脚本类型选项只改变引用标签，不会转换文件格式。本面板只拼接文本，不上传文件、不发布软件包、不请求 CDN，也不会执行输入的脚本。</p>
</section>

<script>
(function () {
  const root = document.getElementById("jsdelivr-url-widget");
  if (!root || root.dataset.jdwReady === "true") return;
  const field = name => root.querySelector("#jdw-" + name);
  const source = field("source");
  const ownerControl = field("owner-control");
  const owner = field("owner");
  const packageName = field("package");
  const packageLabel = field("package-label");
  const version = field("version");
  const versionLabel = field("version-label");
  const file = field("file");
  const mode = field("mode");
  const help = field("help");
  const error = field("error");
  const urlOutput = field("url");
  const scriptOutput = field("script");
  if (![source, ownerControl, owner, packageName, packageLabel, version, versionLabel, file, mode, help, error, urlOutput, scriptOutput].every(Boolean)) return;
  function update() {
    const isGitHub = source.value === "github";
    ownerControl.hidden = !isGitHub;
    owner.disabled = !isGitHub;
    packageLabel.textContent = isGitHub ? "GitHub 仓库名" : "npm 包名（支持 @scope/package）";
    versionLabel.textContent = isGitHub ? "版本标签 / 分支 / 提交哈希" : "npm 版本号 / 标签";
    help.textContent = isGitHub
      ? "建议指定已发布的固定版本标签或提交哈希；main 等分支会变化。本示例版本字段不接受斜杠。"
      : "npm 示例支持 @scope/package；建议填写固定版本号。latest 等标签会变化。";
    const ownerName = owner.value.trim();
    const name = packageName.value.trim();
    const revision = version.value.trim();
    const filePath = file.value.trim();
    const ownerValid = !isGitHub || /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(ownerName);
    const nameValid = isGitHub
      ? /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)
      : /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name);
    const versionValid = /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(revision);
    const segments = filePath.split("/");
    const fileValid = /^[A-Za-z0-9._/-]+$/.test(filePath)
      && segments.every(segment => segment !== "" && segment !== "." && segment !== "..");
    owner.setAttribute("aria-invalid", String(!ownerValid));
    packageName.setAttribute("aria-invalid", String(!nameValid));
    version.setAttribute("aria-invalid", String(!versionValid));
    file.setAttribute("aria-invalid", String(!fileValid));
    let issue = "";
    if (!ownerValid) issue = "GitHub 用户名请使用英文字母、数字或连字符，首位不能是连字符。";
    else if (!nameValid) issue = isGitHub
      ? "仓库名请使用英文字母、数字、点、下划线或连字符。"
      : "npm 包名请使用小写名称，例如 your-widget 或 @your-scope/your-widget。";
    else if (!versionValid) issue = "请输入版本号、标签或提交哈希；本示例接受英文字母、数字、点、下划线和连字符。";
    else if (!fileValid) issue = "文件路径请使用英文字母、数字、点、下划线、连字符和 /；不能有空段或 .、.. 路径段。";
    error.textContent = issue;
    if (issue) {
      urlOutput.textContent = "修正输入后显示 URL。";
      scriptOutput.textContent = "修正输入后显示引用代码。";
      return;
    }
    const path = segments.map(segment => encodeURIComponent(segment)).join("/");
    const address = isGitHub
      ? "https://cdn.jsdelivr.net/gh/" + ownerName + "/" + name + "@" + revision + "/" + path
      : "https://cdn.jsdelivr.net/npm/" + name + "@" + revision + "/" + path;
    urlOutput.textContent = address;
    scriptOutput.textContent = mode.value === "module"
      ? '<script type="module" src="' + address + '"><' + '/script>'
      : '<script src="' + address + '" defer><' + '/script>';
  }
  source.addEventListener("change", function () {
    if (source.value === "npm" && version.value === "v1.0.0") version.value = "1.0.0";
    if (source.value === "github" && version.value === "1.0.0") version.value = "v1.0.0";
    update();
  });
  [owner, packageName, version, file].forEach(input => input.addEventListener("input", update));
  mode.addEventListener("change", update);
  update();
  root.dataset.jdwReady = "true";
  root.hidden = false;
  const hint = document.getElementById("jdw-static-hint");
  if (hint) hint.hidden = true;
})();
</script>
