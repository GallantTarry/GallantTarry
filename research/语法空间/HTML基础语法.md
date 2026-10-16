# HTML基础语法

HTML（HyperText Markup Language，超文本标记语言，现行标准为 **HTML5**）是构建网页结构的基石。它不是一门具有逻辑控制流（如循环、判断）的编程语言，而是一门**声明式标记语言**——通过嵌套的标签（Tags）将纯文本转化为浏览器可解析的 **DOM 树（文档对象模型，Document Object Model）**，从而定义网页的内容层级与语义含义。

---

## 1. 标准文档骨架与 `<head>` 核心配置

一个符合现代工程规范的 HTML5 文档由文档类型声明（`DOCTYPE`）、根元素 `<html>`、头部元数据区 `<head>` 和可见内容区 `<body>` 四部分组成：

```html
<!DOCTYPE html>
<!-- lang 属性声明页面主语言，辅助搜索引擎与屏幕阅读器识别 -->
<html lang="zh-CN">
<head>
  <!-- 1. 字符编码声明：必须放在 head 最顶部，防止中文乱码 -->
  <meta charset="UTF-8" />
  
  <!-- 2. 移动端响应式视口设置：宽度自适应设备屏幕，初始缩放比例为 1.0 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- 3. 页面描述与关键词（用于 SEO 搜索引擎优化） -->
  <meta name="description" content="HTML5 基础语法与语义化标签指南" />
  
  <!-- 4. 浏览器标签页标题与图标 -->
  <title>HTML5 核心语法指南</title>
  <link rel="icon" href="/favicon.ico" />
  
  <!-- 5. 引入外部 CSS 样式表 -->
  <link rel="stylesheet" href="./style.css" />
  
  <!-- 6. 引入外部 JS 脚本：defer 表示异步下载并等 DOM 解析完毕后再按序执行 -->
  <script src="./main.js" defer></script>
</head>
<body>
  <!-- 所有在浏览器窗口中可见的内容均写在此处 -->
  <h1>Hello, HTML5!</h1>
</body>
</html>

```

* **`<script>` 加载策略对比**：
* **默认（无属性）**：会阻塞 HTML 解析，下载并立即执行脚本，容易导致首屏白屏。
* **`defer`（推荐首选）**：脚本在后台并行下载，不阻塞 HTML 解析，且严格保证在 **DOM 树构建完成之后、`DOMContentLoaded` 事件之前**按声明顺序执行。
* **`async`**：并行下载，下载完成后**立即中断 HTML 解析**并执行，不保证多个脚本的执行顺序（适合完全独立的第三方统计脚本）。



---

## 2. 元素解构、空元素与全局属性

### 双标签与空元素（自闭合标签）

* **常规容器元素（双标签）**：由起始标签、内容与闭合标签组成，如 `<a href="[https://example.com](https://example.com)">链接文本</a>`。
* **空元素（Void Elements / 单标签）**：不包含任何子节点或文本内容，仅靠自身属性发挥作用。常见空元素包括：
* `<br>`（换行）、`<hr>`（水平分割线）
* `<img>`（图像）、`<input>`（表单输入框）
* `<meta>`（元信息）、`<link>`（外部资源链接）



### 通用全局属性（Global Attributes）

以下属性可用于**几乎所有** HTML 标签上：

| 全局属性名 | 核心作用与工程规范 | 代码示例 |
| --- | --- | --- |
| `id` | 文档内**全局唯一**标识符，用于锚点跳转、JS 精准获取或 `<label>` 关联 | `<section id="about-me">` |
| `class` | 样式类名（可指定多个，用空格分隔），供 CSS 选择器或 JS 批量操作 | `<div class="card card-dark">` |
| `style` | 内联 CSS 样式（优先级极高，工程中建议优先使用外部 class 维护） | `<p style="color: #38bdf8;">` |
| `data-*` | **自定义数据属性**，用于在 DOM 节点上安全挂载业务数据，JS 通过 `el.dataset` 读取 | `<li data-user-id="1024" data-role="admin">` |
| `title` | 鼠标悬停在元素上时显示的原生提示文本（Tooltip） | `<abbr title="超文本标记语言">HTML</abbr>` |
| `hidden` | 布尔属性，写上即隐藏该元素（类似 `display: none`） | `<div hidden>暂不显示的内容</div>` |

---

## 3. 块级元素（Block）与内联元素（Inline）

在默认文档流（Normal Flow）中，HTML 元素按视觉排版特性分为两大阵营：

| 对比维度 | 块级元素（Block-level Elements） | 内联/行内元素（Inline Elements） | 行内块元素（Inline-block） |
| --- | --- | --- | --- |
| **换行特性** | **独占一行**，前后自动换行，自上而下垂直堆叠 | **不换行**，与其他内联元素从左到右并排同行显示 | **不换行**，同行并排显示 |
| **默认宽度** | 默认撑满父容器的 **100% 宽度** | 宽度完全由**内部文本或内容撑开** | 宽度由内容或显式设置的宽高决定 |
| **宽高与边距** | 可自由设置 `width`、`height` 以及上下左右的 `margin` / `padding` | **设置 `width`、`height` 无效**；垂直方向的 `margin-top/bottom` 无效 | **可正常设置** `width`、`height` 及四个方向的内外边距 |
| **典型代表** | `<div>`, `<p>`, `<h1>`~`<h6>`, `<ul>`, `<li>`, `<section>`, `<form>` | `<span>`, `<a>`, `<strong>`, `<em>`, `<code>`, `<label>` | `<img>`, `<input>`, `<button>`, `<select>` |

> **嵌套规范提示**：块级元素可以包含块级元素和内联元素（**特例**：段落标签 `<p>` 内部绝不能嵌套 `<div>` 等块级元素，否则浏览器会自动把 `<p>` 提前截断成两个空标签）；内联元素通常只应包含文本或其他内联元素（HTML5 允许 `<a>` 标签包裹块级元素以实现整卡点击）。

---

## 4. HTML5 语义化布局标签（Semantic HTML）

早期网页排版习惯用满屏的 `<div class="header">`、`<div class="nav">`（俗称“Div 汤”）。HTML5 引入了专用**语义化结构标签**——它们在默认视觉表现上与 `<div>` 完全一样（都是块级容器），但能让搜索引擎爬虫（SEO）、屏幕阅读器（无障碍访问 A11y）以及开发者一眼看懂页面结构：

| 语义化标签 | 结构职责与适用场景 | 使用约束与建议 |
| --- | --- | --- |
| `<header>` | 页面顶部通栏头部，或某个独立文章/区块的头部（通常含 Logo、主标题） | 一个页面可出现多次（如页面级 Header 和文章级 Header） |
| `<nav>` | 核心导航链接区域（顶部菜单栏、侧边目录树、面包屑导航） | 仅包裹核心导航组，无需包裹页脚所有的零散外链 |
| `<main>` | 当前页面**独一无二的核心主体内容区** | **每个页面仅限出现一次**，且不应包含侧边栏或公共导航栏 |
| `<article>` | **可独立分发、自成一体的完整内容块**（如一篇博客文章、一条论坛帖子、一张商品卡片） | 拿出来放到别的网站依然语义完整时，优先用 `<article>` |
| `<section>` | 文档中按主题划分的通用功能章节（通常内部带有一个 `<h2>`/`<h3>` 标题） | 如果仅仅是为了加 CSS 样式而没有任何语义主题，请继续用 `<div>` |
| `<aside>` | 与周边主内容间接相关的辅助区域（如文章侧边栏目录、推荐阅读、广告栏） | 可置于 `<main>` 内部或外部 |
| `<footer>` | 页面底部页脚或某个章节的尾部（通常含版权声明、备案号、作者信息） | 支持页面级或 `<article>` 级使用 |

---

## 5. 常用内容、列表与多媒体标签

### 文本排版与语义内联标签

```html
<!-- 1. 六级标题：h1 权重最高（每个页面建议仅保留一个 h1），h6 最低 -->
<h1>一级主标题</h1>
<h2>二级章节标题</h2>

<!-- 2. 段落与语义化强调 -->
<p>
  这是一段普通文本，其中包含<strong>重要性极高的加粗文本（strong）</strong>，
  以及表示<em>语气重读的斜体文本（em）</em>。
  行内代码使用 <code>const x = 10;</code>，快捷键使用 <kbd>Ctrl + S</kbd>。
</p>

<!-- 3. 保留原始空格与换行的代码块 -->
<pre><code>function hello() {
  console.log("保留缩进与换行");
}</code></pre>

```

### 三大列表结构（`<ul>`、`<ol>`、`<dl>`）

```html
<!-- 1. 无序列表 (Unordered List)：直接子元素只能是 li -->
<ul>
  <li>无序列表项 A</li>
  <li>无序列表项 B</li>
</ul>

<!-- 2. 有序列表 (Ordered List)：自动生成 1, 2, 3 序号 -->
<ol start="1">
  <li>第一步：初始化项目</li>
  <li>第二步：编写结构</li>
</ol>

<!-- 3. 定义/描述列表 (Description List)：常用于名词解释或键值对展示 -->
<dl>
  <dt>HTML</dt>
  <dd>负责网页的结构与语义层。</dd>
  <dt>CSS</dt>
  <dd>负责网页的视觉样式与布局层。</dd>
</dl>

```

### 超链接（`<a>`）与多媒体（`<img>`、`<video>`、`<audio>`）

```html
<!-- 1. 超链接：新窗口打开外部链接时，务必加上 rel="noopener noreferrer" 防止新页面通过 window.opener 劫持原页面 -->
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  访问 MDN 文档（新标签页安全打开）
</a>

<!-- 页面内锚点跳转（跳转到 id="footer-sec" 的元素） -->
<a href="#footer-sec">跳至页脚</a>

<!-- 2. 图像标签：alt 为图片加载失败时的替代文本；loading="lazy" 开启浏览器原生懒加载；显式声明宽高可防止页面布局偏移 (CLS) -->
<img
  src="./cover.webp"
  alt="项目架构示意图"
  width="600"
  height="400"
  loading="lazy"
/>

<!-- 3. 视频与音频：controls 显示播放控件，muted 静音，playsinline 移动端内联播放 -->
<video src="./demo.mp4" controls muted loop width="640">
  您的浏览器不支持 HTML5 video 标签。
</video>

```

---

## 6. 数据表格（`<table>`）与表单交互（`<form>`）

### 结构化表格

现代 HTML 表格强调将表头（`<thead>`）、表体（`<tbody>`）和表尾汇总（`<tfoot>`）显式分离，支持通过 `colspan`（跨列合并）和 `rowspan`（跨行合并）处理复杂报表：

```html
<table>
  <caption>2026 年度服务器资源清单</caption>
  <thead>
    <tr>
      <th scope="col">节点名称</th>
      <th scope="col">核心配置</th>
      <th scope="col">状态</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nanjing-Node-01</td>
      <td>8C 16G</td>
      <td>运行中</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <!-- colspan="2" 表示横跨合并 2 列 -->
      <td colspan="2">在线节点总计</td>
      <td>1 台</td>
    </tr>
  </tfoot>
</table>

```

### 表单与原生表单验证

表单 `<form>` 是收集用户输入并提交给后端的核心容器。**每个表单控件都必须指定 `name` 属性**（作为提交数据时的键名 Key），并推荐搭配 `<label>` 提升点击热区与可访问性：

```html
<form action="/api/login" method="POST">
  <!-- 1. 通过 label 的 for 属性绑定 input 的 id，点击文字即可自动聚焦输入框 -->
  <div>
    <label for="user-email">电子邮箱：</label>
    <input
      type="email"
      id="user-email"
      name="email"
      placeholder="请输入邮箱地址"
      required
      autocomplete="email"
    />
  </div>

  <!-- 2. 密码框与最小长度原生校验 -->
  <div>
    <label for="user-pwd">登录密码：</label>
    <input
      type="password"
      id="user-pwd"
      name="password"
      minlength="8"
      required
    />
  </div>

  <!-- 3. 单选框 (radio)：同一组单选框的 name 值必须完全相同 -->
  <div>
    <span>环境选择：</span>
    <label><input type="radio" name="env" value="prod" checked /> 生产环境</label>
    <label><input type="radio" name="env" value="dev" /> 测试环境</label>
  </div>

  <!-- 4. 下拉选择框 (select) 与多行文本框 (textarea) -->
  <div>
    <label for="role-select">角色权限：</label>
    <select id="role-select" name="role">
      <option value="admin">管理员</option>
      <option value="guest">访客</option>
    </select>
  </div>

  <!-- 5. 按钮：表单内注意区分 type="submit"（默认，触发表单提交）与 type="button"（普通按钮，不刷新页面） -->
  <button type="submit">立即提交</button>
  <button type="reset">重置表单</button>
</form>

```

---

## 7. HTML 字符实体（Character Entities）

由于 `<`、`>`、`&` 等符号在 HTML 中具有特殊语法解析含义，若要在网页正文中原样显示这些符号，必须使用**转义字符实体**：

| 显示结果 | 实体名称（推荐） | 实体编号 | 常见用途说明 |
| --- | --- | --- | --- |
| `<` | `&lt;` | `&#60;` | 小于号（Less than，防止被解析为标签左尖括号） |
| `>` | `&gt;` | `&#62;` | 大于号（Greater than） |
| `&` | `&amp;` | `&#38;` | 与符号（Ampersand，转义实体起始符本身） |
| `"` | `&quot;` | `&#34;` | 双引号（常用于属性值内部转义） |
| 空格 | `&nbsp;` | `&#160;` | 不换行空格（HTML 默认会将连续多个普通空格折叠为 1 个） |
| `©` | `&copy;` | `&#169;` | 版权所有符号 |

---

## HTML5 语义化标签与 DOM 树层级映射交互演示

浏览器解析 HTML 源码的过程，本质上是将**平面嵌套的标签文本**构建为一棵**层级分明的 DOM 树（Document Object Model）**，并进一步映射为页面上的**视觉布局区块**。通过下方交互工具，你可以逐步切换并检视 HTML5 语义化标签在“源码结构 ➔ DOM 节点树 ➔ 视觉区块”三者之间的实时对应关系：

<div id="h5-demo-root">
<style>
#h5-demo-root{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"JetBrains Mono",Consolas,monospace;background:linear-gradient(145deg,#0f172a 0%,#172033 100%);color:#e2e8f0;border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:18px;margin:16px 0;box-shadow:0 12px 32px rgba(0,0,0,0.38);line-height:1.5;}
#h5-demo-root *{box-sizing:border-box;}
.h5-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,0.16);margin-bottom:12px;}
.h5-title{font-size:16px;font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:8px;}
.h5-dot{width:10px;height:10px;border-radius:50%;background:#f97316;box-shadow:0 0 10px #f97316;display:inline-block;}
.h5-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.h5-btn{background:rgba(30,41,59,0.85);color:#cbd5e1;border:1px solid rgba(148,163,184,0.28);border-radius:7px;padding:5px 10px;font-size:12px;font-family:inherit;cursor:pointer;transition:all 0.18s ease;user-select:none;}
.h5-btn:hover{border-color:#f97316;color:#fff;background:rgba(249,115,22,0.15);}
.h5-btn.h5-active{background:#ea580c;color:#fff;border-color:#fb923c;font-weight:600;box-shadow:0 0 12px rgba(249,115,22,0.35);}
.h5-path-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:rgba(15,23,42,0.75);border:1px solid rgba(148,163,184,0.15);border-radius:9px;padding:8px 12px;margin-bottom:14px;font-size:11.5px;}
.h5-path-label{color:#94a3b8;font-weight:600;margin-right:4px;}
.h5-path-node{font-family:"JetBrains Mono",Consolas,monospace;padding:2px 8px;border-radius:5px;background:rgba(30,41,59,0.9);color:#cbd5e1;border:1px solid rgba(148,163,184,0.22);}
.h5-path-node.h5-path-hi{color:#fed7aa;border-color:#fb923c;background:rgba(249,115,22,0.2);font-weight:700;}
.h5-path-sep{color:#64748b;font-size:11px;user-select:none;}
.h5-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:14px;margin-bottom:14px;}
@media(max-width:860px){.h5-grid{grid-template-columns:1fr;}}
.h5-panel{background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.16);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;}
.h5-panel-head{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:0.4px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.12);}
.h5-tag-code{color:#fb923c;}
.h5-tag-tree{color:#38bdf8;}
.h5-tag-wire{color:#34d399;}
.h5-sub{font-size:11px;color:#94a3b8;font-weight:400;}
.h5-code-list{display:flex;flex-direction:column;gap:2.5px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;overflow-x:auto;}
.h5-code-line{display:flex;align-items:center;padding:3px 7px;border-radius:6px;color:#94a3b8;transition:all 0.18s ease;cursor:pointer;white-space:pre;}
.h5-code-line:hover{background:rgba(148,163,184,0.08);}
.h5-code-line.h5-line-active{background:rgba(249,115,22,0.18);color:#ffedd5;border-left:3px solid #f97316;font-weight:600;}
.h5-ln{width:20px;color:#64748b;font-size:10.5px;user-select:none;flex-shrink:0;}
.h5-arrow{width:15px;color:#fb923c;font-weight:700;flex-shrink:0;}
.h5-tree-list{display:flex;flex-direction:column;gap:6px;}
.h5-tnode{background:rgba(30,41,59,0.75);border:1px solid rgba(148,163,184,0.2);border-left:3px solid #38bdf8;border-radius:7px;padding:7px 9px;font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;transition:all 0.22s ease;cursor:pointer;}
.h5-tnode:hover{border-color:#38bdf8;}
.h5-tnode.h5-tnode-hi{border-color:#fbbf24;border-left:3px solid #fbbf24;background:rgba(251,191,36,0.1);box-shadow:0 0 12px rgba(251,191,36,0.2);}
.h5-tnode-row{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;}
.h5-tnode-name{color:#f8fafc;font-weight:700;}
.h5-tnode-badge{font-size:10.5px;padding:1px 6px;border-radius:4px;background:rgba(15,23,42,0.8);color:#38bdf8;border:1px solid rgba(56,189,248,0.25);}
.h5-tnode-badge.h5-b-meta{color:#a78bfa;border-color:rgba(167,139,250,0.3);}
.h5-tnode-badge.h5-b-leaf{color:#34d399;border-color:rgba(52,211,153,0.3);}
.h5-tnode-desc{font-size:11px;color:#94a3b8;margin-top:3px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
.h5-wire-wrap{display:flex;flex-direction:column;gap:7px;background:rgba(15,23,42,0.9);border:1px dashed rgba(148,163,184,0.25);border-radius:8px;padding:9px;}
.h5-w-box{border:1px solid rgba(148,163,184,0.25);background:rgba(30,41,59,0.7);border-radius:6px;padding:7px 9px;cursor:pointer;transition:all 0.2s ease;position:relative;}
.h5-w-box:hover{border-color:#34d399;background:rgba(52,211,153,0.08);}
.h5-w-box.h5-w-active{border:1.5px solid #fbbf24;background:rgba(251,191,36,0.12);box-shadow:0 0 14px rgba(251,191,36,0.22);}
.h5-w-head{display:flex;justify-content:space-between;align-items:center;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;font-weight:700;color:#e2e8f0;gap:4px;flex-wrap:wrap;}
.h5-w-role{font-size:10px;font-weight:400;color:#94a3b8;background:rgba(15,23,42,0.75);padding:1px 5px;border-radius:4px;}
.h5-w-sub{font-size:11px;color:#94a3b8;margin-top:3px;}
.h5-w-main-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:6px;margin-top:6px;}
.h5-w-sec{margin-top:5px;padding:4px 6px;border-radius:4px;background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.18);font-size:10.5px;color:#cbd5e1;font-family:"JetBrains Mono",Consolas,monospace;}
.h5-meta-bar{background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.h5-meta-label{color:#94a3b8;font-weight:600;}
.h5-meta-pill{font-family:"JetBrains Mono",Consolas,monospace;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);color:#bae6fd;padding:2px 8px;border-radius:5px;font-size:11.5px;}
.h5-footer{background:rgba(30,41,59,0.7);border-left:4px solid #f97316;border-radius:8px;padding:11px 14px;font-size:13px;display:flex;flex-direction:column;gap:4px;}
.h5-footer-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.h5-step-title{font-weight:700;color:#f8fafc;font-size:14px;}
.h5-status{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;background:rgba(249,115,22,0.15);color:#fb923c;border:1px solid rgba(249,115,22,0.35);}
.h5-desc{color:#cbd5e1;font-size:12.5px;line-height:1.6;}
</style>
<div class="h5-header">
  <div class="h5-title"><span class="h5-dot"></span><span>HTML5 语义化标签与 DOM 树层级映射交互演示</span></div>
  <div class="h5-controls">
    <button type="button" class="h5-btn" onclick="window.__h5Go(window.__h5Cur-1)">◀ 上一节点</button>
    <button type="button" class="h5-btn h5-active" id="h5-b0" onclick="window.__h5Go(0)">1. html/head</button>
    <button type="button" class="h5-btn" id="h5-b1" onclick="window.__h5Go(1)">2. header/nav</button>
    <button type="button" class="h5-btn" id="h5-b2" onclick="window.__h5Go(2)">3. main主体</button>
    <button type="button" class="h5-btn" id="h5-b3" onclick="window.__h5Go(3)">4. article/section</button>
    <button type="button" class="h5-btn" id="h5-b4" onclick="window.__h5Go(4)">5. aside侧栏</button>
    <button type="button" class="h5-btn" id="h5-b5" onclick="window.__h5Go(5)">6. footer页脚</button>
    <button type="button" class="h5-btn" onclick="window.__h5Go(window.__h5Cur+1)">下一节点 ▶</button>
  </div>
</div>
<div class="h5-path-bar" id="h5-path-box"></div>
<div class="h5-grid">
  <div class="h5-panel">
    <div class="h5-panel-head"><span class="h5-tag-code">HTML5 语义化源码</span><span class="h5-sub">点击代码行可定位</span></div>
    <div class="h5-code-list" id="h5-code-box"></div>
  </div>
  <div class="h5-panel">
    <div class="h5-panel-head"><span class="h5-tag-tree">DOM 节点树层级 (DOM Tree)</span><span class="h5-sub">父子与兄弟引用关系</span></div>
    <div class="h5-tree-list" id="h5-tree-box"></div>
  </div>
  <div class="h5-panel">
    <div class="h5-panel-head"><span class="h5-tag-wire">视觉线框映射 (Wireframe)</span><span class="h5-sub">点击区块可反向联动</span></div>
    <div class="h5-wire-wrap" id="h5-wire-box"></div>
  </div>
</div>
<div class="h5-meta-bar" id="h5-meta-box"></div>
<div class="h5-footer">
  <div class="h5-footer-top">
    <span class="h5-step-title" id="h5-st-title"></span>
    <span class="h5-status" id="h5-st-badge"></span>
  </div>
  <div class="h5-desc" id="h5-st-desc"></div>
</div>
<script id="h5-script-src">
(function(){
  var codeLines = [
    {ln:1, text:"&lt;!DOCTYPE html&gt;", step:0},
    {ln:2, text:"&lt;html lang=\"zh-CN\"&gt;", step:0},
    {ln:3, text:"&lt;head&gt;&lt;meta charset=\"UTF-8\"&gt;&lt;title&gt;站点&lt;/title&gt;&lt;/head&gt;", step:0},
    {ln:4, text:"&lt;body&gt;", step:0},
    {ln:5, text:"  &lt;header&gt;", step:1},
    {ln:6, text:"    &lt;h1&gt;Logo&lt;/h1&gt; &lt;nav&gt;&lt;a href=\"#\"&gt;首页&lt;/a&gt;&lt;/nav&gt;", step:1},
    {ln:7, text:"  &lt;/header&gt;", step:1},
    {ln:8, text:"  &lt;main&gt;", step:2},
    {ln:9, text:"    &lt;article&gt;", step:3},
    {ln:10, text:"      &lt;h2&gt;文章标题&lt;/h2&gt;&lt;section&gt;&lt;p&gt;正文...&lt;/p&gt;&lt;/section&gt;", step:3},
    {ln:11, text:"    &lt;/article&gt;", step:3},
    {ln:12, text:"    &lt;aside&gt;&lt;h3&gt;目录与标签&lt;/h3&gt;&lt;/aside&gt;", step:4},
    {ln:13, text:"  &lt;/main&gt;", step:2},
    {ln:14, text:"  &lt;footer&gt;&lt;p&gt;&amp;copy; 2026 版权信息&lt;/p&gt;&lt;/footer&gt;", step:5},
    {ln:15, text:"&lt;/body&gt;&lt;/html&gt;", step:0}
  ];
  var stages = [
    {
      title:"1. 文档根节点与元数据区 (<html> / <head> / <body>)",
      badge:"Document Root · 元数据与容器",
      path:["Document","html (lang=zh-CN)","head + body"],
      metas:["DOM 接口: HTMLHtmlElement / HTMLHeadElement","head 默认样式: display: none (不可见)","body 默认样式: display: block"],
      desc:"浏览器解析 HTML 时首先识别 !DOCTYPE html 以启用标准渲染模式。html 是整棵 DOM 树的根元素（document.documentElement），其下分出两个直接子节点：head 负责提供给浏览器和搜索引擎的字符集、视口与标题元数据（不在页面渲染）；body 则承载所有可见视图节点。",
      tree:[
        {indent:0, name:"Document", badge:"Root Node", bCls:"", desc:"浏览器文档对象模型顶层入口", hi:false, step:0},
        {indent:1, name:"&lt;html lang=\"zh-CN\"&gt;", badge:"Element", bCls:"", desc:"根元素 · 包含 head 与 body 两个子分支", hi:true, step:0},
        {indent:2, name:"&lt;head&gt;", badge:"Metadata (display:none)", bCls:"h5-b-meta", desc:"子节点: &lt;meta charset=\"UTF-8\"&gt;, &lt;title&gt;", hi:true, step:0},
        {indent:2, name:"&lt;body&gt;", badge:"Viewport Root (block)", bCls:"h5-b-leaf", desc:"可见视图根节点 · 挂载 header / main / footer", hi:true, step:0}
      ]
    },
    {
      title:"2. 顶部通栏与核心导航 (<header> + <nav>)",
      badge:"ARIA Landmark: banner / navigation",
      path:["Document","html","body","header","h1 + nav"],
      metas:["盒模型: display: block (独占一行)","无障碍角色: role=\"banner\" & role=\"navigation\"","SEO 权重: h1 主标题 + 核心站点内链"],
      desc:"<header> 用于定义页面或章节的引导性头部区域，通常包含站点主标题 <h1> 与主导航 <nav>。<nav> 专用于包裹核心导航链接组（如顶部菜单、侧边目录），屏幕阅读器可据此直接提取页面导航快捷跳转列表。",
      tree:[
        {indent:0, name:"&lt;body&gt;", badge:"Parent", bCls:"", desc:"包含 3 个顶层语义子区块", hi:false, step:0},
        {indent:1, name:"&lt;header&gt;", badge:"Landmark: banner", bCls:"", desc:"页面顶部区域 (body 的第 1 个子元素)", hi:true, step:1},
        {indent:2, name:"&lt;h1&gt;\"Logo\"&lt;/h1&gt;", badge:"Heading Level 1", bCls:"h5-b-leaf", desc:"包含 TextNode 文本节点 · 页面最高权重标题", hi:true, step:1},
        {indent:2, name:"&lt;nav&gt; ➔ &lt;a href=\"#\"&gt;", badge:"Landmark: navigation", bCls:"h5-b-leaf", desc:"导航容器与行内超链接节点 (inline)", hi:true, step:1}
      ]
    },
    {
      title:"3. 页面唯一核心主体区 (<main>)",
      badge:"ARIA Landmark: main (全局唯一)",
      path:["Document","html","body","main","article + aside"],
      metas:["盒模型: display: block","无障碍角色: role=\"main\" (Skip-to-content 锚点)","语法约束: 每个页面仅限出现 1 个可见 main"],
      desc:"<main> 代表当前文档独一无二的核心主体内容（排除跨页面重复的顶部导航栏、版权页脚等）。一个 HTML 文档中绝不能出现多个可见的 <main> 标签，它是无障碍辅助技术“跳过导航直达正文”的核心定位点。",
      tree:[
        {indent:0, name:"&lt;body&gt;", badge:"Parent", bCls:"", desc:"父级容器", hi:false, step:0},
        {indent:1, name:"&lt;header&gt; ... &lt;/header&gt;", badge:"prevElementSibling", bCls:"h5-b-meta", desc:"前一个兄弟节点", hi:false, step:1},
        {indent:1, name:"&lt;main&gt;", badge:"Landmark: main", bCls:"", desc:"核心内容容器 · 统筹正文 article 与侧栏 aside", hi:true, step:2},
        {indent:2, name:"Children: [&lt;article&gt;, &lt;aside&gt;]", badge:"2 Child Elements", bCls:"h5-b-leaf", desc:"点击下方子区块可继续向下钻取 DOM 树", hi:true, step:3}
      ]
    },
    {
      title:"4. 独立文章与主题章节 (<article> + <section>)",
      badge:"ARIA Role: article / region",
      path:["Document","html","body","main","article","h2 + section"],
      metas:["盒模型: display: block","核心区别: article 可独立分发，section 按主题分节","嵌套禁忌: &lt;p&gt; 段落内严禁嵌套 &lt;div&gt; 或 &lt;section&gt;"],
      desc:"<article> 表示一段独立完整、可单独抽离分发的内容块（如博客正文、新闻报道、论坛帖子）；<section> 则用于将内容按主题划分为多个章节（通常内部包含 <h2>/<h3> 标题）。若仅为了挂载 CSS 样式而无语义主题，应使用 <div>。",
      tree:[
        {indent:0, name:"&lt;main&gt;", badge:"Parent", bCls:"", desc:"主体容器", hi:false, step:2},
        {indent:1, name:"&lt;article&gt;", badge:"Self-contained", bCls:"", desc:"独立完整文章节点 (main.firstElementChild)", hi:true, step:3},
        {indent:2, name:"&lt;h2&gt;\"文章标题\"&lt;/h2&gt;", badge:"Heading Level 2", bCls:"h5-b-meta", desc:"文章主标题节点", hi:true, step:3},
        {indent:2, name:"&lt;section&gt; ➔ &lt;p&gt;\"正文...\"&lt;/p&gt;", badge:"Thematic Section", bCls:"h5-b-leaf", desc:"主题章节容器与段落叶子节点", hi:true, step:3}
      ]
    },
    {
      title:"5. 侧边辅助信息栏 (<aside>)",
      badge:"ARIA Landmark: complementary",
      path:["Document","html","body","main","aside","h3"],
      metas:["盒模型: display: block (常配合 Flex/Grid 并排)","无障碍角色: role=\"complementary\"","典型用途: 文章目录树 (TOC)、标签云、相关推荐"],
      desc:"<aside> 用于承载与主内容间接相关的辅助信息。在 DOM 树中它与 <article> 互为兄弟节点（Sibling），在视觉布局上通常借助 CSS Flexbox 或 Grid 排布在主文章的右侧或左侧。",
      tree:[
        {indent:0, name:"&lt;main&gt;", badge:"Parent", bCls:"", desc:"主体容器", hi:false, step:2},
        {indent:1, name:"&lt;article&gt; ... &lt;/article&gt;", badge:"prevElementSibling", bCls:"h5-b-meta", desc:"左侧主文章兄弟节点", hi:false, step:3},
        {indent:1, name:"&lt;aside&gt;", badge:"Landmark: complementary", bCls:"", desc:"侧边辅助栏节点 (main.lastElementChild)", hi:true, step:4},
        {indent:2, name:"&lt;h3&gt;\"目录与标签\"&lt;/h3&gt;", badge:"Heading Level 3", bCls:"h5-b-leaf", desc:"侧边栏小标题与目录列表节点", hi:true, step:4}
      ]
    },
    {
      title:"6. 页面底部版权与备案区 (<footer>)",
      badge:"ARIA Landmark: contentinfo",
      path:["Document","html","body","footer","p (&copy;)"],
      metas:["盒模型: display: block","无障碍角色: role=\"contentinfo\"","字符实体: &amp;copy; 渲染为 © 版权符号"],
      desc:"<footer> 位于 <body> 末尾（或某个 <article> 底部），用于存放版权声明（使用字符实体 &copy;）、开源协议、备案号及联系方式。它与 <header>、<main> 共同构成清晰的三段式文档大纲。",
      tree:[
        {indent:0, name:"&lt;body&gt;", badge:"Parent", bCls:"", desc:"可见视图根节点", hi:false, step:0},
        {indent:1, name:"&lt;main&gt; ... &lt;/main&gt;", badge:"prevElementSibling", bCls:"h5-b-meta", desc:"上方主体区域兄弟节点", hi:false, step:2},
        {indent:1, name:"&lt;footer&gt;", badge:"Landmark: contentinfo", bCls:"", desc:"页面尾部节点 (body.lastElementChild)", hi:true, step:5},
        {indent:2, name:"&lt;p&gt;\"© 2026 版权信息\"&lt;/p&gt;", badge:"Text + Entity", bCls:"h5-b-leaf", desc:"解析字符实体 &amp;copy; 为文本节点", hi:true, step:5}
      ]
    }
  ];
  window.__h5Cur = 0;
  window.__h5Go = function(idx, ev){
    if(ev && ev.stopPropagation){ev.stopPropagation();}
    if(idx !== 0 && idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4 && idx !== 5){return;}
    window.__h5Cur = idx;
    var st = stages[idx];
    for(var b=0; b!==6; b++){
      var btn = document.getElementById("h5-b"+b);
      if(btn){btn.className = (b===idx) ? "h5-btn h5-active" : "h5-btn";}
    }
    var pathHtml = "\x3cspan class=\"h5-path-label\"\x3eDOM 树寻址路径：\x3c/span\x3e";
    for(var p=0; p!==st.path.length; p++){
      var isLast = (p === st.path.length - 1);
      pathHtml += "\x3cspan class=\"h5-path-node"+(isLast?" h5-path-hi":"")+"\"\x3e"+st.path[p]+"\x3c/span\x3e";
      if(!isLast){pathHtml += "\x3cspan class=\"h5-path-sep\"\x3e➔\x3c/span\x3e";}
    }
    document.getElementById("h5-path-box").innerHTML = pathHtml;
    var codeHtml = "";
    for(var i=0; i!==codeLines.length; i++){
      var cl = codeLines[i];
      var isAct = (cl.step === idx);
      codeHtml += "\x3cdiv class=\"h5-code-line"+(isAct?" h5-line-active":"")+"\" onclick=\"window.__h5Go("+cl.step+")\"\x3e";
      codeHtml += "\x3cspan class=\"h5-ln\"\x3e"+cl.ln+"\x3c/span\x3e";
      codeHtml += "\x3cspan class=\"h5-arrow\"\x3e"+(isAct?"➔":"")+"\x3c/span\x3e";
      codeHtml += "\x3cspan\x3e"+cl.text+"\x3c/span\x3e\x3c/div\x3e";
    }
    document.getElementById("h5-code-box").innerHTML = codeHtml;
    var treeHtml = "";
    for(var t=0; t!==st.tree.length; t++){
      var tn = st.tree[t];
      var padLeft = 10 + tn.indent * 16;
      treeHtml += "\x3cdiv class=\"h5-tnode"+(tn.hi?" h5-tnode-hi":"")+"\" style=\"margin-left:"+padLeft+"px\" onclick=\"window.__h5Go("+tn.step+")\"\x3e";
      treeHtml += "\x3cdiv class=\"h5-tnode-row\"\x3e\x3cspan class=\"h5-tnode-name\"\x3e"+(tn.indent!==0?"└─ ":"")+tn.name+"\x3c/span\x3e\x3cspan class=\"h5-tnode-badge "+tn.bCls+"\"\x3e"+tn.badge+"\x3c/span\x3e\x3c/div\x3e";
      treeHtml += "\x3cdiv class=\"h5-tnode-desc\"\x3e"+tn.desc+"\x3c/div\x3e\x3c/div\x3e";
    }
    document.getElementById("h5-tree-box").innerHTML = treeHtml;
    var wireHtml = "";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===0?" h5-w-active":"")+"\" onclick=\"window.__h5Go(0,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;html&gt; ➔ &lt;body&gt; 文档视口容器\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3e&lt;head&gt; 元数据已隐藏\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===1?" h5-w-active":"")+"\" onclick=\"window.__h5Go(1,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;header&gt; 顶部通栏\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3ebanner + &lt;nav&gt;\x3c/span\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-sub\"\x3e[&lt;h1&gt; Logo] ── [&lt;nav&gt; 首页 | 归档 | 关于]\x3c/div\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===2?" h5-w-active":"")+"\" onclick=\"window.__h5Go(2,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;main&gt; 核心主体容器\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3erole=\"main\"\x3c/span\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-main-grid\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===3?" h5-w-active":"")+"\" onclick=\"window.__h5Go(3,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;article&gt;\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3e独立文章\x3c/span\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-sec\"\x3e&lt;h2&gt; 标题 + &lt;section&gt; 章节段落\x3c/div\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===4?" h5-w-active":"")+"\" onclick=\"window.__h5Go(4,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;aside&gt;\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3e侧边栏\x3c/span\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-sec\"\x3eTOC 目录 / 标签云\x3c/div\x3e\x3c/div\x3e";
    wireHtml += "\x3c/div\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-box"+(idx===5?" h5-w-active":"")+"\" onclick=\"window.__h5Go(5,event)\"\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-head\"\x3e\x3cspan\x3e&lt;footer&gt; 页面底部页脚\x3c/span\x3e\x3cspan class=\"h5-w-role\"\x3econtentinfo\x3c/span\x3e\x3c/div\x3e";
    wireHtml += "\x3cdiv class=\"h5-w-sub\"\x3e&lt;p&gt; © 2026 版权信息与备案号\x3c/div\x3e\x3c/div\x3e";
    document.getElementById("h5-wire-box").innerHTML = wireHtml;
    var metaHtml = "\x3cspan class=\"h5-meta-label\"\x3e节点属性与规范：\x3c/span\x3e";
    for(var m=0; m!==st.metas.length; m++){
      metaHtml += "\x3cspan class=\"h5-meta-pill\"\x3e"+st.metas[m]+"\x3c/span\x3e";
    }
    document.getElementById("h5-meta-box").innerHTML = metaHtml;
    document.getElementById("h5-st-title").textContent = st.title;
    document.getElementById("h5-st-badge").textContent = st.badge;
    document.getElementById("h5-st-desc").textContent = st.desc;
  };
  window.__h5Go(0);
})();
</script>
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" style="display:none!important;" onload="if(!window.__h5Go){var s=document.createElement('script');s.text=document.getElementById('h5-script-src').textContent;document.body.appendChild(s);}" />
</div>