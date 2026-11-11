# JavaScript 压缩与 min.js 制作

**制作 `.min.js`，就是把原始 JavaScript 交给压缩工具，生成体积更小的 JavaScript 文件。最直接的方法是使用 Terser：`npx terser app.js --compress --mangle --output app.min.js`。**

`.min.js` 中的 `min` 是 minified（已压缩）的命名约定。浏览器执行的仍然是 JavaScript；把 `app.js` 直接改名为 `app.min.js`，文件内容和体积不会发生变化。

## 一、压缩工具具体做了什么？

| 处理方式 | 作用 | 示例 |
|---|---|---|
| 紧凑排版 | 减少不必要的空格、换行和注释 | 多行代码变成紧凑代码 |
| 代码优化 | 简化表达式，移除能够判定的无用代码 | 简化可合并的表达式 |
| 变量缩名 | 在允许的作用域内缩短变量名 | 局部变量 `userName` 变为 `n` |
| Source Map | 将压缩代码位置对应到源代码，辅助调试 | 额外生成 `app.min.js.map` |

Terser 使用 `--compress` 开启代码优化，使用 `--mangle` 开启变量缩名；`--output` 指定输出文件。[Terser 命令行文档](https://terser.org/docs/cli-usage/)

例如，原来的 `app.js`：

```javascript
function greet(userName) {
  const message = "你好，" + userName;
  console.log(message);
}

greet("小明");
```

压缩后可能类似下面这样，具体结果随工具版本和配置变化：

```javascript
function greet(o){console.log("你好，"+o)}greet("小明");
```

## 二、用 Terser 生成 `.min.js`

### 1. 检查 Node.js 和 npm

打开终端，运行：

```bash
node --version
npm --version
```

能够显示版本号，就可以继续。如果没有安装 Node.js，可从 [Node.js 官网](https://nodejs.org/)安装 LTS 版本，安装后重新打开终端。以下命令都在存放 `app.js` 的项目目录中执行。

> Windows 的 PowerShell 若提示 `npm.ps1` 无法运行，可把命令中的 `npm` / `npx` 改为 `npm.cmd` / `npx.cmd`，无需修改全局执行策略。

### 2. 初始化项目并安装 Terser

**仅当这是新项目、目录里还没有 `package.json` 时**，先执行：

```bash
npm init -y
```

然后安装压缩工具：

```bash
npm install --save-dev terser
```

这会把 Terser 记录为项目的开发依赖。后续在同一个项目中压缩文件，不需要每次重新安装。

### 3. 生成压缩文件

```bash
npx terser app.js --compress --mangle --output app.min.js
```

执行后，目录中会同时保留：

```text
app.js       ← 日常修改的源文件
app.min.js   ← 生成的压缩文件
```

以后修改 `app.js`，重新运行同一条命令即可更新 `app.min.js`。发布前打开实际网页，检查主要交互和浏览器控制台。

### 4. 在 HTML 页面中引用

如果脚本需要读取页面上的元素，可以在普通 HTML 页面中这样引用：

```html
<script src="./app.min.js" defer></script>
```

`defer` 让这个外部普通脚本在 HTML 解析完成后执行。路径以页面实际位置为准；如果其他脚本依赖它，还需保持依赖顺序。

如果输入本来就是使用 `import` / `export` 的 ES module，可按模块方式压缩和引用：

```bash
npx terser app.js --module --compress --mangle --output app.min.js
```

```html
<script type="module" src="./app.min.js"></script>
```

`--module` 会改变对顶层作用域的处理，因此只用于真正的 ES module。**Terser 不会因为加了 `--module` 就把所有 `import` 依赖合并进一个文件。** [Terser 模块选项](https://terser.org/docs/cli-usage/)

## 三、你给的那种文章，怎么提取脚本再压缩？

你提供的示例同时包含 Markdown 正文、`<style>` 样式、HTML 面板和 `<script>` 脚本。压缩 JavaScript 时，只取 **`<script>` 与 `</script>` 之间的代码**，不要把整篇文章或标签一起放进 `.js` 文件。

例如，原文中的结构是：

```html
<div id="ipv4-dhcp-widget">面板内容……</div>

<script>
(function () {
  const root = document.getElementById("ipv4-dhcp-widget");
  if (!root) return;
  // 这里是原来的交互逻辑。
})();
</script>
```

把标签内部的完整代码保存为 `dhcp-widget.js`。上面的省略注释只是说明结构，实际操作要保留你的全部交互逻辑。然后执行：

```bash
npx terser dhcp-widget.js --compress --mangle --output dhcp-widget.min.js
```

原来的内联脚本可以替换为外部引用：

```html
<script src="./dhcp-widget.min.js"></script>
```

HTML 面板和 CSS 仍放在原来的页面里，外部脚本放在对应面板之后。也可以把压缩后的文件内容重新粘贴到原来的 `<script>` 标签中。

> **文档站需要额外核对加载时机。** Markdown 预览器可能禁用脚本；通过前端路由动态插入文章的文档站，也可能不会自动执行插入的 `<script>`。这时需要使用文档站提供的页面渲染完成钩子来初始化面板。压缩只改变代码体积，不能解决脚本未执行的问题。

## 四、把压缩操作固定成一个 npm 命令

在现有 `package.json` 的 `scripts` 对象中加入 `minify`。下面只展示需要合并的结构，保留文件中的其他字段和已有脚本：

```json
{
  "scripts": {
    "minify": "terser app.js --compress --mangle --output app.min.js"
  }
}
```

以后每次修改源码后运行：

```bash
npm run minify
```

`npm scripts` 可以直接调用项目已安装的工具，因此这里不必再写 `npx`。

## 五、需要调试时，生成 Source Map

```bash
npx terser app.js --compress --mangle --output app.min.js --source-map "url='app.min.js.map'"
```

这会生成 `app.min.js` 和 `app.min.js.map`，并在压缩文件中写入映射文件地址。浏览器开发者工具可据此将压缩代码的位置映射回原始代码。要查看源代码内容，原始文件也需要能被工具找到，或使用 `includeSources` 把源码包含到映射中。[Terser Source Map 文档](https://terser.org/docs/cli-usage/#cli-source-map-options)

Source Map 不参与业务逻辑执行；如果不需要在线调试，可以不发布它。压缩本身也不具备加密效果。

## 六、有多文件依赖时，也可以使用 esbuild

如果需要把入口脚本和依赖一起打包、压缩，可以使用：

```bash
npm install --save-dev --save-exact esbuild
npx esbuild app.js --bundle --minify --sourcemap --outfile=app.min.js
```

其中 `--bundle` 合并可解析的依赖，`--minify` 压缩代码，`--sourcemap` 生成调试映射。这个示例面向浏览器；如需支持特定旧浏览器，应按实际目标设置 `--target`。[esbuild 入门](https://esbuild.github.io/getting-started/)、[压缩与兼容性选项](https://esbuild.github.io/api/#minify)

## 七、制作 `.min.js` 时常见的误区

| 情况 | 正确处理 |
|---|---|
| 直接把文件改名为 `.min.js` | 还需要运行压缩工具；改名不会改变内容 |
| 用正则删掉所有空格和换行 | 使用能解析 JavaScript 的工具，避免破坏字符串、注释和语法 |
| 把整篇 Markdown 交给 Terser | 先提取完整的 JavaScript；CSS 和 HTML 分别处理 |
| 认为 `.min.js` 等于 gzip 或 Brotli | minify 减少代码文本；gzip/Brotli 压缩传输字节，两者可以叠加 |
| 每次都直接编辑 `.min.js` | 维护源文件，重新生成压缩文件 |
| 为了更小，随意开启属性名改写 | 先使用常规参数；属性名可能与 HTML、接口数据和其他脚本有关 |

## 八、交互式工具：生成你的 Terser 命令

选择脚本类型，勾选需要的选项，面板会生成可复制的命令。输入、输出文件固定为 `app.js` 和 `app.min.js`。**这个面板不执行压缩，也不读取或上传你的源码；实际压缩仍在你自己的终端中进行。**

<p id="mjw-static-hint">当前预览未执行脚本时，仍可使用本文的命令示例。下方面板需要在允许 HTML、CSS 和 JavaScript 的页面中打开；它只生成命令，不执行压缩。</p>

<style>
.mjw-root {
  --mjw-text: #f1f5f9;
  --mjw-muted: #b4c2d5;
  --mjw-accent: #67e8f9;
  --mjw-border: rgba(148, 163, 184, .25);
  box-sizing: border-box;
  margin: 18px 0;
  padding: 22px;
  border: 1px solid var(--mjw-border);
  border-radius: 18px;
  color: var(--mjw-text);
  background: radial-gradient(circle at top left, #23354d, #101827 65%, #0a101c);
  box-shadow: 0 14px 36px rgba(0, 0, 0, .25);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.65;
}
.mjw-root *, .mjw-root *::before, .mjw-root *::after { box-sizing: border-box; }
.mjw-root[hidden], #mjw-static-hint[hidden] { display: none !important; }
.mjw-root .mjw-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.mjw-root .mjw-title { margin: 0; color: #fff; font-size: 20px; font-weight: 750; }
.mjw-root .mjw-badge { padding: 3px 10px; color: var(--mjw-accent); border: 1px solid var(--mjw-border); border-radius: 999px; font-size: 12px; }
.mjw-root .mjw-files { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; margin-bottom: 18px; }
.mjw-root .mjw-file { min-width: 0; padding: 12px 14px; border: 1px solid var(--mjw-border); border-radius: 12px; background: rgba(30, 41, 59, .72); }
.mjw-root .mjw-label { display: block; margin: 0 0 4px; color: var(--mjw-muted); font-size: 13px; }
.mjw-root .mjw-filename { display: block; color: var(--mjw-accent); font-family: ui-monospace, Consolas, monospace; font-size: 17px; font-weight: 700; overflow-wrap: anywhere; }
.mjw-root .mjw-arrow { color: var(--mjw-accent); font-size: 24px; }
.mjw-root .mjw-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.mjw-root .mjw-card { min-width: 0; margin: 0; padding: 14px; border: 1px solid var(--mjw-border); border-radius: 12px; background: rgba(30, 41, 59, .55); }
.mjw-root .mjw-select { display: block; width: 100%; min-width: 0; padding: 9px 10px; border: 1px solid #62748c; border-radius: 8px; color: var(--mjw-text); background: #101827; font: inherit; }
.mjw-root .mjw-option { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.mjw-root .mjw-check { flex: 0 0 auto; width: 18px; height: 18px; margin: 4px 0 0; accent-color: #22d3ee; }
.mjw-root .mjw-option strong { display: block; color: #f8fafc; font-size: 15px; }
.mjw-root .mjw-help { display: block; margin-top: 6px; color: var(--mjw-muted); font-size: 13px; }
.mjw-root .mjw-output { margin-top: 18px; }
.mjw-root .mjw-command { display: block; width: 100%; min-height: 108px; margin: 7px 0 10px; padding: 14px; resize: vertical; border: 1px solid #47637d; border-radius: 10px; color: #a5f3fc; background: #080f1a; font: 14px/1.65 ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
.mjw-root .mjw-reference { min-height: 75px; }
.mjw-root .mjw-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.mjw-root .mjw-copy { padding: 9px 16px; border: 1px solid #67e8f9; border-radius: 8px; background: #155e75; color: #fff; font: inherit; font-weight: 650; cursor: pointer; }
.mjw-root .mjw-copy:hover { background: #0e7490; }
.mjw-root .mjw-status { color: var(--mjw-muted); font-size: 13px; }
.mjw-root .mjw-note { margin: 15px 0 0; padding-top: 12px; border-top: 1px solid var(--mjw-border); color: var(--mjw-muted); font-size: 13px; }
.mjw-root select:focus-visible, .mjw-root input:focus-visible, .mjw-root textarea:focus-visible, .mjw-root button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@media (max-width: 560px) {
  .mjw-root { padding: 15px; }
  .mjw-root .mjw-grid { grid-template-columns: 1fr; }
  .mjw-root .mjw-files { gap: 7px; }
  .mjw-root .mjw-file { padding: 10px; }
  .mjw-root .mjw-filename { font-size: 14px; }
  .mjw-root .mjw-command { min-height: 150px; font-size: 13px; }
}
</style>

<section id="minjs-command-widget" class="mjw-root" hidden aria-labelledby="mjw-title">
  <div class="mjw-head">
    <h3 class="mjw-title" id="mjw-title">制作你的压缩命令</h3>
    <span class="mjw-badge">离线 · 仅生成命令</span>
  </div>
  <div class="mjw-files" aria-label="输入与输出文件">
    <div class="mjw-file"><span class="mjw-label">保留原始文件</span><span class="mjw-filename">app.js</span></div>
    <span class="mjw-arrow" aria-hidden="true">→</span>
    <div class="mjw-file"><span class="mjw-label">生成发布文件</span><span class="mjw-filename">app.min.js</span></div>
  </div>
  <div class="mjw-grid">
    <div class="mjw-card">
      <label class="mjw-label" for="mjw-mode">输入文件类型</label>
      <select id="mjw-mode" class="mjw-select">
        <option value="script">普通 JavaScript 脚本</option>
        <option value="module">ES module（import / export）</option>
      </select>
      <span class="mjw-help" id="mjw-mode-help">普通脚本保留顶层对外名称；不要为了更小而随意选模块。</span>
    </div>
    <label class="mjw-card mjw-option" for="mjw-compress">
      <input class="mjw-check" id="mjw-compress" type="checkbox" checked>
      <span><strong>优化代码</strong><span class="mjw-help">启用 --compress，简化表达式并移除可判定的无用代码。</span></span>
    </label>
    <label class="mjw-card mjw-option" for="mjw-mangle">
      <input class="mjw-check" id="mjw-mangle" type="checkbox" checked>
      <span><strong>缩短变量名</strong><span class="mjw-help">启用 --mangle；不会启用属性名改写。</span></span>
    </label>
    <label class="mjw-card mjw-option" for="mjw-map">
      <input class="mjw-check" id="mjw-map" type="checkbox">
      <span><strong>生成 Source Map</strong><span class="mjw-help">另外输出 app.min.js.map，方便定位原始代码。</span></span>
    </label>
  </div>
  <div class="mjw-output">
    <label class="mjw-label" for="mjw-command">在已安装 Terser、且含 app.js 的目录运行</label>
    <textarea class="mjw-command" id="mjw-command" readonly spellcheck="false" rows="3">npx terser app.js --compress --mangle --output app.min.js</textarea>
    <div class="mjw-actions">
      <button class="mjw-copy" id="mjw-copy" type="button">复制命令</button>
      <span class="mjw-status" id="mjw-status" role="status" aria-live="polite">输出：app.min.js</span>
    </div>
  </div>
  <div class="mjw-output">
    <label class="mjw-label" for="mjw-reference">普通 HTML 页面的引用示例</label>
    <textarea class="mjw-command mjw-reference" id="mjw-reference" readonly spellcheck="false" rows="2">&lt;script src="./app.min.js" defer&gt;&lt;/script&gt;</textarea>
  </div>
  <p class="mjw-note" id="mjw-summary">此面板不读取或上传文件。修改源文件后，请重新执行命令，再验证网页功能。</p>
</section>

<script>
(function () {
  const root = document.getElementById("minjs-command-widget");
  if (!root || root.dataset.mjwReady === "true") return;
  const field = name => root.querySelector("#mjw-" + name);
  const mode = field("mode");
  const compress = field("compress");
  const mangle = field("mangle");
  const map = field("map");
  const command = field("command");
  const status = field("status");
  const modeHelp = field("mode-help");
  const summary = field("summary");
  const copy = field("copy");
  const reference = field("reference");
  if (![mode, compress, mangle, map, command, status, modeHelp, summary, copy, reference].every(Boolean)) return;
  function update() {
    const parts = ["npx terser app.js"];
    if (compress.checked) parts.push("--compress");
    if (mangle.checked) parts.push("--mangle");
    if (mode.value === "module") parts.push("--module");
    parts.push("--output app.min.js");
    if (map.checked) parts.push("--source-map \"url='app.min.js.map'\"");
    command.value = parts.join(" ");
    reference.value = mode.value === "module"
      ? '<script type="module" src="./app.min.js"><' + '/script>'
      : '<script src="./app.min.js" defer><' + '/script>';
    status.textContent = map.checked ? "输出：app.min.js + app.min.js.map" : "输出：app.min.js";
    modeHelp.textContent = mode.value === "module"
      ? "--module 按 ES module 处理输入，并在优化或缩名开启时处理顶层名称；它不会合并 import 依赖。"
      : "普通脚本保留顶层对外名称；不要为了更小而随意选模块。";
    summary.textContent = !compress.checked && !mangle.checked
      ? "两项均关闭时，Terser 仍会紧凑排版，通常会去掉非许可注释；并非原样复制。此面板不读取或上传文件。"
      : "此面板不读取或上传文件。修改源文件后，请重新执行命令，再验证网页功能。";
  }
  [mode, compress, mangle, map].forEach(control => control.addEventListener("change", update));
  copy.addEventListener("click", async function () {
    const value = command.value;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      status.textContent = "命令已复制。";
    } catch (_) {
      command.focus();
      command.select();
      status.textContent = "已选中命令，请按 Ctrl+C 或使用系统复制操作。";
    }
  });
  update();
  root.dataset.mjwReady = "true";
  root.hidden = false;
  const hint = document.getElementById("mjw-static-hint");
  if (hint) hint.hidden = true;
})();
</script>
