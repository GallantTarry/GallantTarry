# JavaScript基础语法

JavaScript（简称 **JS**，标准规范为 **ECMAScript / ES6+**）是一门动态弱类型、基于原型（Prototype-based）、支持多范式（函数式、面向对象、事件驱动）的脚本语言。它最初为浏览器交互而生，如今借助 V8 等引擎与 Node.js，已成为贯穿前端视图、桌面应用（Electron/Tauri）与云端 Serverless（如 Cloudflare Workers）的全栈核心语言。

JavaScript 最独特的运行机制在于其**单线程非阻塞事件循环（Event Loop）**与**词法作用域闭包（Closure）**。

---

## 1. 变量声明与块级作用域（`const`、`let` 与 `var`）

现代 JavaScript（ES6+）全面推行块级作用域，工程实践中遵循“默认使用 `const`，需要重新赋值时才用 `let`，彻底弃用 `var`”的准则：

| 特性维度 | `const`（常量引用 · 首选） | `let`（块级变量） | `var`（ES5 历史遗留 · 不推荐） |
| --- | --- | --- | --- |
| **作用域范围** | **块级作用域**（`{ }` 内部有效） | **块级作用域**（`{ }` 内部有效） | **函数级作用域**（在 `if`/`for` 块内声明会泄漏到外部） |
| **重新赋值** | **禁止重新赋值**（但若绑定的是对象/数组，其**内部属性/元素可以修改**） | 允许重新赋值 | 允许重新赋值 |
| **重复声明** | 同一作用域内禁止重复声明 | 同一作用域内禁止重复声明 | 允许重复声明（易导致静默覆盖 Bug） |
| **变量提升与死区** | 存在**暂时性死区（TDZ）**，声明前访问直接抛 `ReferenceError` | 存在**暂时性死区（TDZ）**，声明前不可访问 | 声明会被提升（Hoisting）至函数顶部并初始化为 `undefined` |
| **全局对象挂载** | 不会挂载到 `window` 属性上 | 不会挂载到 `window` 属性上 | 顶层声明会自动变成 `window.xxx` 属性 |

```javascript
// 1. const 声明基本类型：值不可改
const MAX_RETRY = 3;

// 2. const 声明引用类型（对象/数组）：内存地址不可改，但内部属性可原地修改
const config = { host: "127.0.0.1", port: 8080 };
config.port = 9000; // 合法！若需彻底冻结对象内部属性，可使用 Object.freeze(config)

// 3. let 声明需要变化的循环变量或状态计数器
let currentStep = 1;
currentStep += 1;

```

---

## 2. 数据类型体系（原始值 vs 引用类型）

JavaScript 的数据类型分为**七大原始类型（Primitive Types）**与**引用类型（Object / Reference Types）**。

### 核心数据类型速查

| 分类 | 类型名称 | `typeof` 返回值 | 存储位置与特性说明 | 字面量与典型示例 |
| --- | --- | --- | --- | --- |
| **原始类型** | `Number` | `"number"` | 栈内存；基于 IEEE 754 双精度 64 位浮点，包含特殊值 `Infinity` 和 `NaN` | `42`, `3.14`, `0xff`（注意 `0.1 + 0.2 !== 0.3` 浮点精度问题） |
| **原始类型** | `String` | `"string"` | 栈/常量池；不可变的 UTF-16 字符序列，支持单引号、双引号与反引号模板字符串 | `'hello'`, `"world"`, ``Port: ${port}`` |
| **原始类型** | `Boolean` | `"boolean"` | 栈内存；逻辑真假值 | `true`, `false` |
| **原始类型** | `Undefined` | `"undefined"` | 变量已声明但尚未赋值时的默认缺省值 | `let x; // x 的值为 undefined` |
| **原始类型** | `Null` | **`"object"`** | 表示**有意设置为空的对象引用**（`typeof null` 返回 `"object"` 是 JS 初版历史遗留 Bug） | `let user = null;` |
| **原始类型** | `Symbol` | `"symbol"` | ES6 引入，生成全局绝对唯一、不可变的标识符（常用于对象私有属性键） | `const id = Symbol("id");` |
| **原始类型** | `BigInt` | `"bigint"` | ES2020 引入，用于安全表示超越 $2^{53} - 1$ 的任意精度大整数（字面量末尾加 `n`） | `const big = 9007199254740993n;` |
| **引用类型** | `Object` | `"object"` 或 `"function"` | **堆内存分配**，栈中仅保存指向堆地址的引用指针；包括普通对象 `{}`、数组 `[]`、函数、`Map`、`Set`、`RegExp` 等 | `{ id: 1 }`, `[1, 2, 3]`, `() => {}` |

> **精准类型判断法则**：
> * 判断原始类型用 `typeof x`（注意先用 `x === null` 单独排除 `null`）。
> * 判断是否为数组用 **`Array.isArray(arr)`**（因为 `typeof []` 也是 `"object"`）。
> * 万能精准类型检测：调用 `Object.prototype.toString.call(val)`（例如返回 `"[object Null]"`、`"[object Array]"`）。
>
>

---

## 3. 核心运算符与现代语法糖（ES6+ 必知必会）

### 严格相等（`===`）vs 宽松相等（`==`）

* **`==`（宽松相等 · 严禁在工程中使用）**：会在比较前进行复杂的**隐式类型转换**，导致大量反直觉结果（例如 `0 == ""` 为 `true`，`false == "0"` 为 `true`，`null == undefined` 为 `true`）。
* **`===`（严格相等 · 唯一推荐）**：同时检查**数据类型**和**值**（或引用地址），类型不同直接返回 `false`，不做任何隐式转换。

### 可选链（`?.`）与空值合并（`??`）

处理后端接口返回的深层嵌套 JSON 或缺省配置时，这两个现代运算符能彻底消灭繁琐的判空代码：

```javascript
const response = {
  data: {
    user: { name: "Gallant", timeout: 0 }
  }
};

// 1. 可选链运算符 ?. (Optional Chaining)
// 若链路中遇到 null 或 undefined，立即短路返回 undefined，绝不抛出 TypeError 崩溃！
const city = response?.data?.user?.address?.city; // undefined（安全返回）
const firstItem = response.list?.[0];             // 数组安全下标访问
response.onComplete?.();                          // 函数存在时才安全调用

// 2. 空值合并运算符 ?? (Nullish Coalescing) vs 逻辑或 ||
// || 会把 0、""、false 全部当成假值覆盖掉；而 ?? 【仅在左侧为 null 或 undefined 时】才取右侧默认值！
const timeout1 = response.data.user.timeout || 5000; // 错误：0 被当成假值，结果变成了 5000！
const timeout2 = response.data.user.timeout ?? 5000; // 正确：0 不是 null/undefined，精准保留 0！

```

### 解构赋值（Destructuring）与展开运算符（`...`）

```javascript
// 1. 对象解构：支持重命名 (host: serverHost) 与默认值 (port = 8080)
const { host: serverHost, port = 8080 } = { host: "localhost" };

// 2. 数组解构与剩余元素收集 (...rest)
const [first, second, ...others] = [10, 20, 30, 40]; // first=10, second=20, others=[30, 40]

// 3. 展开运算符 (Spread ...)：浅拷贝合并数组或对象（同名属性后者覆盖前者）
const mergedArr = [...others, 50];
const updatedConfig = { ...config, port: 3000, debug: true };

```

---

## 4. 流程控制与迭代语法

### 真假值判定（Truthy & Falsy）

JavaScript 中只有 **6 个核心假值（Falsy）**：`false`、`0`（含 `-0` 和 `0n`）、`""`（空字符串）、`null`、`undefined`、`NaN`。

> **注意与 Python 的区别**：在 JavaScript 中，**空数组 `[]` 和空对象 `{}` 在 `if` 判断中均为 `true`（真值）**！判断数组为空必须写 `if (arr.length === 0)`。

### 循环与遍历对比（`for...of` vs `for...in`）

```javascript
const list = ["Go", "Java", "JS"];
const userObj = { id: 101, role: "admin" };

// 1. for...of（推荐首选）：直接遍历可迭代对象（Array、String、Map、Set）的【元素值】
// 支持随时使用 break、continue 或 return 中断循环（注意数组的 forEach 无法用 break 中断！）
for (const item of list) {
  if (item === "Java") continue;
  console.log(item);
}

// 2. Object.entries() 配合 for...of：优雅遍历普通对象的【键值对】
for (const [key, val] of Object.entries(userObj)) {
  console.log(`${key}: ${val}`);
}

// 3. for...in（慎用）：遍历对象及其原型链上的所有可枚举【属性名 Key】（切勿用于遍历数组）

```

---

## 5. 函数、箭头函数与 `this` 绑定规则

### 函数声明 vs 箭头函数（Arrow Function）

```javascript
// 1. 标准函数声明（支持默认参数与剩余参数 ...args）
function sum(base = 0, ...nums) {
  return nums.reduce((acc, cur) => acc + cur, base);
}

// 2. 箭头函数（ES6）：语法极简，单行表达式自动隐式 return
const double = (n) => n * 2;
// 若单行直接返回对象字面量，必须用圆括号 () 包裹大括号，否则 {} 会被解析为函数体块：
const createNode = (id) => ({ id, status: "active" });

```

### 普通函数与箭头函数的本质区别（`this` 指向）

1. **普通函数（`function`）**：拥有动态绑定的 `this`，**谁调用它，`this` 就指向谁**（作为对象方法调用时指向该对象，普通独立调用在严格模式下为 `undefined`，也可通过 `.call()` / `.apply()` / `.bind()` 强制改变指向）。
2. **箭头函数（`() => {}`）**：**没有自己的 `this**`，也没有 `arguments` 对象，更不能用 `new` 实例化。它的 `this` 在定义时就已经永久确定——**直接继承外层词法作用域（Lexical Scope）的 `this**`。这使其成为定时器回调（`setTimeout`）和事件处理器的绝佳搭档。

---

## 6. 数组函数式高阶方法与内置数据结构

### 数组高频纯函数三剑客（不修改原数组，返回新结果）

```javascript
const tasks = [
  { id: 1, title: "编写接口", done: true, hours: 3 },
  { id: 2, title: "联调测试", done: false, hours: 5 },
  { id: 3, title: "部署上线", done: true, hours: 2 }
];

// 1. filter()：按条件筛选，返回满足条件的新数组
const doneTasks = tasks.filter((t) => t.done);

// 2. map()：一对一映射转换，提取字段或重构结构返回等长新数组
const titles = tasks.map((t) => t.title); // ["编写接口", "联调测试", "部署上线"]

// 3. reduce()：归约汇总，将数组浓缩为单个值（如累加总工时或按字段分组）
const totalHours = tasks.reduce((acc, cur) => acc + cur.hours, 0); // 10

// 其他高频检索方法：
const target = tasks.find((t) => t.id === 2);      // 查找首个匹配项对象
const hasUndone = tasks.some((t) => !t.done);      // 是否至少有一项满足条件 (true)
const allDone = tasks.every((t) => t.done);        // 是否全部满足条件 (false)

```

### 现代集合容器：`Map` 与 `Set`

* **`Set`（集合）**：存储唯一值的集合，最常用于**一行代码数组去重**：`const unique = [...new Set([1, 2, 2, 3])];`。
* **`Map`（字典映射）**：普通对象 `{}` 的 Key 只能是字符串或 Symbol；而 `Map` 允许用**任意类型（包括对象、DOM 节点、函数）作为 Key**，且通过 `.size` 直接获取长度、`.get(k)` / `.set(k, v)` 高效读写。

---

## 7. 面向对象（`class`）与 ES Modules 模块化

### `class` 类语法与私有属性

JavaScript 的 `class` 本质上是基于原型链继承（Prototype Chain）的语法糖，ES2022 起原生支持以 `#` 开头的真私有属性与方法：

```javascript
class BaseService {
  #apiKey; // # 前缀声明私有字段，类外部直接访问会报语法错误

  constructor(endpoint, apiKey) {
    this.endpoint = endpoint;
    this.#apiKey = apiKey;
  }

  getHeaders() {
    return { Authorization: `Bearer ${this.#apiKey}` };
  }
}

// extends 继承父类
class UserService extends BaseService {
  constructor(apiKey) {
    super("/api/users", apiKey); // 必须先调用 super() 初始化父类 this
  }
}

```

### ES Modules（`import` / `export` 标准模块化）

```javascript
// --- utils.js（导出模块） ---
export const VERSION = "2.0.0";               // 命名导出（Named Export，可多个）
export function formatTime(ts) { return ts; }
export default class Logger {}                // 默认导出（Default Export，每个文件最多一个）

// --- main.js（导入模块） ---
import Logger, { VERSION, formatTime as fmt } from "./utils.js";

```

---

## 8. 异步编程与事件循环（Promise、`async/await` 与 Event Loop）

JavaScript 在浏览器和 Node.js 中都是**单线程执行**的。为了防止网络请求、文件读写或定时器阻塞页面渲染，JS 引擎采用事件循环（Event Loop）将任务划分为三个层级：

1. **同步调用栈（Call Stack）**：主线程从上到下立即执行的同步代码。
2. **微任务队列（Microtask Queue · 高优先级）**：包括 **`Promise.then / catch / finally`**、`await` 恢复后的后续代码、`MutationObserver`、`queueMicrotask`。
3. **宏任务队列（Macrotask / Task Queue · 普通优先级）**：包括 **`setTimeout` / `setInterval**`、DOM 事件回调、`MessageChannel`、I/O 回调。

> **Event Loop 执行铁律**：
> 主线程每执行完一个宏任务（包括初始的整段 `<script>` 同步代码），**必须立即把当前微任务队列中的所有微任务全部清空（包含微任务执行期间新追加的微任务）**，然后才允许浏览器进行 UI 渲染，接着再去宏任务队列取出下一个宏任务执行！

### `Promise` 与 `async / await` 现代异步范式

`async / await`（ES2017）是构建在 `Promise` 之上的语法糖，让你用同步代码的线性逻辑编写异步非阻塞请求：

```javascript
// 声明 async 函数（返回值会自动包装为一个 Promise 对象）
async function fetchUserData(userId) {
  try {
    // 1. await 会暂停当前 async 函数的执行（将后续代码注册为微任务），让出主线程而不阻塞页面
    const res = await fetch(`https://api.example.com/users/${userId}`);
    if (!res.ok) {
      throw new Error(`HTTP 状态异常: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // 2. 统一捕获网络错误或 JSON 解析异常（等价于 Promise.catch）
    console.error("请求失败:", err.message);
    return null;
  } finally {
    console.log("请求生命周期结束");
  }
}

// 并发请求优化：若多个异步请求互不依赖，切勿串行写多个 await，应使用 Promise.all 并行发起！
async function loadDashboard() {
  const [profile, orders] = await Promise.all([
    fetchUserData(101),
    fetchUserData(102)
  ]);
}

```

---

## JavaScript 事件循环（Event Loop）、调用栈与微任务/宏任务调度交互演示

为什么 `setTimeout(..., 0)` 写在 `Promise.resolve().then(...)` 前面，却总是最后才打印？`await` 后面的代码又是如何被切分进微任务队列的？

通过下方的交互式状态机，你可以逐步追踪一段混合了**同步代码**、**`setTimeout` 宏任务**、**`Promise.then` 微任务**与 **`async/await`** 的经典代码在 **调用栈（Call Stack）**、**微任务队列（Microtasks）**、**宏任务队列（Macrotasks）** 和 **控制台输出（Console）** 之间的完整流转过程：

<div id="jsel-demo-root">
<style>
#jsel-demo-root{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"JetBrains Mono",Consolas,monospace;background:linear-gradient(145deg,#0f172a 0%,#1a1829 100%);color:#e2e8f0;border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:18px;margin:16px 0;box-shadow:0 12px 32px rgba(0,0,0,0.38);line-height:1.5;}
#jsel-demo-root *{box-sizing:border-box;}
.jsel-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,0.16);margin-bottom:12px;}
.jsel-title{font-size:16px;font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:8px;}
.jsel-dot{width:10px;height:10px;border-radius:50%;background:#facc15;box-shadow:0 0 10px #facc15;display:inline-block;}
.jsel-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.jsel-btn{background:rgba(30,41,59,0.85);color:#cbd5e1;border:1px solid rgba(148,163,184,0.28);border-radius:7px;padding:5px 10px;font-size:12px;font-family:inherit;cursor:pointer;transition:all 0.18s ease;user-select:none;}
.jsel-btn:hover{border-color:#facc15;color:#fff;background:rgba(250,204,21,0.15);}
.jsel-btn.jsel-active{background:#ca8a04;color:#fff;border-color:#facc15;font-weight:600;box-shadow:0 0 12px rgba(250,204,21,0.35);}
.jsel-phase-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.16);border-radius:9px;padding:8px 12px;margin-bottom:14px;font-size:12px;}
.jsel-phase-left{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.jsel-phase-label{color:#94a3b8;font-weight:600;}
.jsel-phase-val{font-family:"JetBrains Mono",Consolas,monospace;color:#fef08a;background:rgba(250,204,21,0.14);border:1px solid rgba(250,204,21,0.35);padding:2px 9px;border-radius:6px;font-weight:700;}
.jsel-rule-tip{font-size:11px;color:#34d399;font-family:"JetBrains Mono",Consolas,monospace;}
.jsel-grid{display:grid;grid-template-columns:1.15fr 0.95fr 1.1fr;gap:14px;margin-bottom:14px;}
@media(max-width:900px){.jsel-grid{grid-template-columns:1fr;}}
.jsel-panel{background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.16);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;}
.jsel-panel-head{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:0.4px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.12);}
.jsel-tag-code{color:#facc15;}
.jsel-tag-stack{color:#38bdf8;}
.jsel-tag-queue{color:#34d399;}
.jsel-sub{font-size:11px;color:#94a3b8;font-weight:400;}
.jsel-code-list{display:flex;flex-direction:column;gap:2.5px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;}
.jsel-code-line{display:flex;align-items:center;padding:3px 7px;border-radius:6px;color:#94a3b8;transition:all 0.18s ease;cursor:pointer;}
.jsel-code-line:hover{background:rgba(148,163,184,0.08);}
.jsel-code-line.jsel-line-active{background:rgba(250,204,21,0.18);color:#fef9c3;border-left:3px solid #facc15;font-weight:600;}
.jsel-ln{width:20px;color:#64748b;font-size:10.5px;user-select:none;flex-shrink:0;}
.jsel-arrow{width:15px;color:#facc15;font-weight:700;flex-shrink:0;}
.jsel-console-box{margin-top:4px;background:#090d16;border:1px solid rgba(148,163,184,0.22);border-radius:8px;padding:8px 10px;font-family:"JetBrains Mono",Consolas,monospace;}
.jsel-console-head{font-size:10.5px;color:#64748b;margin-bottom:5px;display:flex;justify-content:space-between;}
.jsel-console-list{display:flex;flex-direction:column;gap:3px;font-size:11.5px;}
.jsel-log-item{color:#cbd5e1;padding:2px 6px;border-radius:4px;background:rgba(30,41,59,0.5);}
.jsel-log-item.jsel-log-new{color:#fef08a;background:rgba(250,204,21,0.16);border-left:2px solid #facc15;font-weight:700;}
.jsel-stack-wrap{display:flex;flex-direction:column;gap:7px;}
.jsel-frame{background:rgba(30,41,59,0.8);border:1px solid rgba(56,189,248,0.35);border-left:3px solid #38bdf8;border-radius:7px;padding:8px 10px;font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;color:#e0f2fe;display:flex;justify-content:space-between;align-items:center;}
.jsel-frame.jsel-frame-top{background:rgba(56,189,248,0.16);border-color:#38bdf8;box-shadow:0 0 12px rgba(56,189,248,0.22);font-weight:700;color:#fff;}
.jsel-frame-tag{font-size:10px;padding:1px 6px;border-radius:4px;background:rgba(15,23,42,0.8);color:#38bdf8;}
.jsel-empty{color:#64748b;font-size:11.5px;text-align:center;padding:14px 8px;border:1px dashed rgba(148,163,184,0.2);border-radius:7px;font-family:"JetBrains Mono",Consolas,monospace;}
.jsel-q-section{background:rgba(30,41,59,0.55);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 10px;display:flex;flex-direction:column;gap:6px;}
.jsel-q-head{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;font-weight:700;}
.jsel-q-micro-title{color:#34d399;}
.jsel-q-macro-title{color:#fb923c;}
.jsel-q-badge{font-size:10px;padding:1px 6px;border-radius:4px;font-family:"JetBrains Mono",Consolas,monospace;}
.jsel-qb-vip{background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);}
.jsel-qb-norm{background:rgba(249,115,22,0.15);color:#fb923c;border:1px solid rgba(251,146,60,0.3);}
.jsel-q-item{padding:7px 9px;border-radius:6px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;background:rgba(15,23,42,0.85);display:flex;justify-content:space-between;align-items:center;gap:6px;}
.jsel-qi-micro{border:1px solid rgba(52,211,153,0.35);border-left:3px solid #34d399;color:#a7f3d0;}
.jsel-qi-macro{border:1px solid rgba(251,146,60,0.35);border-left:3px solid #fb923c;color:#fed7aa;}
.jsel-qi-hi{box-shadow:0 0 12px rgba(250,204,21,0.25);border-color:#facc15;}
.jsel-link-bar{background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.jsel-link-label{color:#94a3b8;font-weight:600;}
.jsel-link-pill{font-family:"JetBrains Mono",Consolas,monospace;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.32);color:#bae6fd;padding:2px 8px;border-radius:5px;font-size:11.5px;}
.jsel-footer{background:rgba(30,41,59,0.7);border-left:4px solid #facc15;border-radius:8px;padding:11px 14px;font-size:13px;display:flex;flex-direction:column;gap:4px;}
.jsel-footer-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.jsel-step-title{font-weight:700;color:#f8fafc;font-size:14px;}
.jsel-status{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;}
.jsel-st-cyan{background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.35);}
.jsel-st-green{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.35);}
.jsel-st-amber{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.35);}
.jsel-desc{color:#cbd5e1;font-size:12.5px;line-height:1.6;}
</style>
<div class="jsel-header">
  <div class="jsel-title"><span class="jsel-dot"></span><span>JavaScript 事件循环 (Event Loop)、调用栈与微/宏任务调度演示</span></div>
  <div class="jsel-controls">
    <button type="button" class="jsel-btn" onclick="window.__jselGo(window.__jselCur-1)">◀ 上一步</button>
    <button type="button" class="jsel-btn jsel-active" id="jsel-b0" onclick="window.__jselGo(0)">1. 同步与Timer</button>
    <button type="button" class="jsel-btn" id="jsel-b1" onclick="window.__jselGo(1)">2. Promise微任务</button>
    <button type="button" class="jsel-btn" id="jsel-b2" onclick="window.__jselGo(2)">3. await挂起收尾</button>
    <button type="button" class="jsel-btn" id="jsel-b3" onclick="window.__jselGo(3)">4. 抢占微任务#1</button>
    <button type="button" class="jsel-btn" id="jsel-b4" onclick="window.__jselGo(4)">5. 清空微任务#2</button>
    <button type="button" class="jsel-btn" id="jsel-b5" onclick="window.__jselGo(5)">6. 宏任务执行</button>
    <button type="button" class="jsel-btn" onclick="window.__jselGo(window.__jselCur+1)">下一步 ▶</button>
  </div>
</div>
<div class="jsel-phase-bar">
  <div class="jsel-phase-left">
    <span class="jsel-phase-label">Event Loop 引擎状态：</span>
    <span class="jsel-phase-val" id="jsel-phase-txt"></span>
  </div>
  <span class="jsel-rule-tip">调度铁律：同步调用栈清空 ➔ 100% 清空微任务队列 ➔ 取出 1 个宏任务</span>
</div>
<div class="jsel-grid">
  <div class="jsel-panel">
    <div class="jsel-panel-head"><span class="jsel-tag-code">JS 异步源码 (index.js)</span><span class="jsel-sub">点击代码行可跳转</span></div>
    <div class="jsel-code-list" id="jsel-code-box"></div>
    <div class="jsel-console-box">
      <div class="jsel-console-head"><span>Console 控制台输出序列</span><span>顺序对比</span></div>
      <div class="jsel-console-list" id="jsel-console-list"></div>
    </div>
  </div>
  <div class="jsel-panel">
    <div class="jsel-panel-head"><span class="jsel-tag-stack">调用栈 (Call Stack)</span><span class="jsel-sub">LIFO 后进先出 · 单线程主栈</span></div>
    <div class="jsel-stack-wrap" id="jsel-stack-box"></div>
  </div>
  <div class="jsel-panel">
    <div class="jsel-panel-head"><span class="jsel-tag-queue">异步任务队列 (Task Queues)</span><span class="jsel-sub">FIFO 先进先出 · 优先级分层</span></div>
    <div class="jsel-q-section">
      <div class="jsel-q-head"><span class="jsel-q-micro-title">⚡ 微任务队列 (Microtask Queue)</span><span class="jsel-q-badge jsel-qb-vip">VIP 高优 · 本轮全部清空</span></div>
      <div class="jsel-stack-wrap" id="jsel-micro-box"></div>
    </div>
    <div class="jsel-q-section">
      <div class="jsel-q-head"><span class="jsel-q-macro-title">⏱️ 宏任务队列 (Macrotask Queue)</span><span class="jsel-q-badge jsel-qb-norm">普通 · 每轮仅执行 1 个</span></div>
      <div class="jsel-stack-wrap" id="jsel-macro-box"></div>
    </div>
  </div>
</div>
<div class="jsel-link-bar" id="jsel-link-box"></div>
<div class="jsel-footer">
  <div class="jsel-footer-top">
    <span class="jsel-step-title" id="jsel-st-title"></span>
    <span class="jsel-status jsel-st-cyan" id="jsel-st-badge"></span>
  </div>
  <div class="jsel-desc" id="jsel-st-desc"></div>
</div>
<script id="jsel-script-src">
(function(){
  var codeLines = [
    {ln:1, text:"console.log('1. 同步开始');", step:0},
    {ln:2, text:"setTimeout(() =\x3e console.log('5. setTimeout宏任务'), 0);", step:0},
    {ln:3, text:"Promise.resolve().then(() =\x3e console.log('3. Promise微任务'));", step:1},
    {ln:4, text:"async function asyncTask() {", step:2},
    {ln:5, text:"  console.log('A. async同步段');", step:2},
    {ln:6, text:"  await Promise.resolve(); // 挂起后续代码", step:2},
    {ln:7, text:"  console.log('4. await微任务恢复');", step:4},
    {ln:8, text:"}", step:-1},
    {ln:9, text:"asyncTask();", step:2},
    {ln:10, text:"console.log('2. 同步结束');", step:2}
  ];
  var stages = [
    {
      title:"Step 1：执行同步代码并注册 setTimeout 宏任务",
      badge:"Call Stack · 初始宏任务执行中",
      badgeCls:"jsel-st-cyan",
      phase:"阶段 1：执行主线程同步脚本 (Initial Macrotask)",
      desc:"整段 script 脚本作为第一个宏任务进入调用栈执行。第 1 行立即打印 '1. 同步开始'；第 2 行调用 setTimeout(..., 0)，浏览器 Web API 定时器在 0ms 到期后，将回调函数 timerCb 推入【宏任务队列】等待（注意：即使延时设为 0，也绝不会立即执行，必须等调用栈与微任务全部清空）。",
      links:["console.log('1. 同步开始') 立即输出","setTimeout(timerCb, 0) ──\x3e Web API ──\x3e 推入宏任务队列"],
      stack:[
        {name:"setTimeout(timerCb, 0)", tag:"栈顶执行", top:true},
        {name:"\x3cscript\x3e 全局同步上下文", tag:"栈底帧", top:false}
      ],
      micro:[],
      macro:[
        {name:"timerCb: () =\x3e log('5. setTimeout宏任务')", status:"排队等待", hi:true}
      ],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:true}
      ]
    },
    {
      title:"Step 2：执行 Promise.resolve().then() 注册微任务",
      badge:"Microtask Enqueue · 入队高优微任务",
      badgeCls:"jsel-st-green",
      phase:"阶段 2：同步执行并收集 Promise 微任务",
      desc:"执行第 3 行时，由于 Promise.resolve() 已经处于 fulfilled（已敲定）状态，.then() 注册的回调函数 promiseCb 会被立即推入【微任务队列（Microtask Queue）】。此时主线程同步脚本尚未走完，微任务在队列中待命。",
      links:["Promise.resolve().then(promiseCb) ──\x3e 推入微任务队列 (排在第 1 位)"],
      stack:[
        {name:"Promise.prototype.then(promiseCb)", tag:"栈顶执行", top:true},
        {name:"\x3cscript\x3e 全局同步上下文", tag:"栈底帧", top:false}
      ],
      micro:[
        {name:"promiseCb: () =\x3e log('3. Promise微任务')", status:"VIP 队首 #1", hi:true}
      ],
      macro:[
        {name:"timerCb: () =\x3e log('5. setTimeout宏任务')", status:"等待微任务", hi:false}
      ],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:false}
      ]
    },
    {
      title:"Step 3：调用 asyncTask 遇到 await 挂起，同步脚本收尾清空调用栈",
      badge:"await 切分微任务 · 调用栈清空",
      badgeCls:"jsel-st-amber",
      phase:"阶段 3：await 之前同步执行 ➔ 挂起后续代码 ➔ 同步栈清空",
      desc:"调用 asyncTask() 时，await 之前的第 5 行属于纯同步代码，立即打印 'A. async同步段'！执行到第 6 行 await 时，当前函数暂停并让出主线程，第 7 行恢复逻辑被包装成微任务 awaitResume 推入【微任务队列】（排在第 2 位）。随后主线程打印第 10 行 '2. 同步结束'，全局上下文出栈，调用栈彻底清空！",
      links:["打印 'A. async同步段' (同步)","遇到 await ──\x3e 第 7 行包装为微任务入队 #2","打印 '2. 同步结束' ──\x3e 调用栈清空"],
      stack:[],
      micro:[
        {name:"promiseCb: () =\x3e log('3. Promise微任务')", status:"VIP 队首 #1", hi:false},
        {name:"awaitResume: () =\x3e log('4. await微任务恢复')", status:"VIP 队尾 #2", hi:true}
      ],
      macro:[
        {name:"timerCb: () =\x3e log('5. setTimeout宏任务')", status:"被微任务阻塞", hi:false}
      ],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:false},
        {txt:"\x3e A. async同步段", isNew:true},
        {txt:"\x3e 2. 同步结束", isNew:true}
      ]
    },
    {
      title:"Step 4：Event Loop 优先检查并抢占执行微任务 #1 (Promise.then)",
      badge:"Microtask #1 · 绝对优先于宏任务",
      badgeCls:"jsel-st-green",
      phase:"阶段 4：Event Loop 清空微任务队列 (1/2)",
      desc:"一旦调用栈为空，Event Loop 绝不会先去看 setTimeout 所在的宏任务队列，而是第一时间扫描【微任务队列】！队首的 promiseCb 出队并压入调用栈执行，控制台输出 '3. Promise微任务'。",
      links:["调用栈为空 ──\x3e 优先扫描微任务队列","promiseCb 出队压入 Call Stack","打印 '3. Promise微任务'"],
      stack:[
        {name:"promiseCb() ➔ log('3. Promise微任务')", tag:"微任务执行中", top:true}
      ],
      micro:[
        {name:"awaitResume: () =\x3e log('4. await微任务恢复')", status:"待执行 #2", hi:false}
      ],
      macro:[
        {name:"timerCb: () =\x3e log('5. setTimeout宏任务')", status:"继续等待", hi:false}
      ],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:false},
        {txt:"\x3e A. async同步段", isNew:false},
        {txt:"\x3e 2. 同步结束", isNew:false},
        {txt:"\x3e 3. Promise微任务", isNew:true}
      ]
    },
    {
      title:"Step 5：继续清空微任务 #2 (await 后续代码恢复执行)",
      badge:"Microtask #2 · 微任务队列 100% 清空",
      badgeCls:"jsel-st-green",
      phase:"阶段 5：Event Loop 清空微任务队列 (2/2 · 队列归零)",
      desc:"Event Loop 的铁律是：只要微任务队列还有任务（哪怕是微任务执行期间又新产生的微任务），就必须一口气全部执行完！因此紧接着将 awaitResume 压入调用栈恢复 asyncTask 的下半段，打印 '4. await微任务恢复'。至此微任务队列彻底清空。",
      links:["继续清空微任务队列 ──\x3e awaitResume 出队入栈","恢复执行第 7 行打印 '4. await微任务恢复'","微任务队列彻底归零"],
      stack:[
        {name:"awaitResume() ➔ log('4. await微任务恢复')", tag:"async 恢复执行", top:true}
      ],
      micro:[],
      macro:[
        {name:"timerCb: () =\x3e log('5. setTimeout宏任务')", status:"即将出队执行", hi:true}
      ],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:false},
        {txt:"\x3e A. async同步段", isNew:false},
        {txt:"\x3e 2. 同步结束", isNew:false},
        {txt:"\x3e 3. Promise微任务", isNew:false},
        {txt:"\x3e 4. await微任务恢复", isNew:true}
      ]
    },
    {
      title:"Step 6：微任务清空完毕，Event Loop 取出 setTimeout 宏任务执行",
      badge:"Macrotask Dequeue · 最终触发定时器回调",
      badgeCls:"jsel-st-amber",
      phase:"阶段 6：开启新一轮 Tick ── 执行宏任务 (setTimeout)",
      desc:"只有当调用栈和微任务队列都 100% 为空（且浏览器完成必要的 UI 重绘）后，Event Loop 才会从【宏任务队列】头部取出 1 个宏任务 timerCb 压入调用栈执行，最终打印 '5. setTimeout宏任务'。这就是为什么 0ms 定时器总是排在 Promise 和 await 之后执行的原因。",
      links:["微任务已空 ──\x3e 从宏任务队列取出 timerCb 入栈","执行打印 '5. setTimeout宏任务'","本轮事件循环全部完成"],
      stack:[
        {name:"timerCb() ➔ log('5. setTimeout宏任务')", tag:"宏任务执行中", top:true}
      ],
      micro:[],
      macro:[],
      logs:[
        {txt:"\x3e 1. 同步开始", isNew:false},
        {txt:"\x3e A. async同步段", isNew:false},
        {txt:"\x3e 2. 同步结束", isNew:false},
        {txt:"\x3e 3. Promise微任务", isNew:false},
        {txt:"\x3e 4. await微任务恢复", isNew:false},
        {txt:"\x3e 5. setTimeout宏任务", isNew:true}
      ]
    }
  ];
  window.__jselCur = 0;
  window.__jselGo = function(idx){
    if(idx !== 0 && idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4 && idx !== 5){return;}
    window.__jselCur = idx;
    var st = stages[idx];
    for(var b=0; b!==6; b++){
      var btn = document.getElementById("jsel-b"+b);
      if(btn){btn.className = (b===idx) ? "jsel-btn jsel-active" : "jsel-btn";}
    }
    document.getElementById("jsel-phase-txt").textContent = st.phase;
    var codeHtml = "";
    for(var i=0; i!==codeLines.length; i++){
      var cl = codeLines[i];
      var isAct = (cl.step === idx);
      var clickAttr = (cl.step !== -1) ? " onclick=\"window.__jselGo("+cl.step+")\"" : "";
      codeHtml += "\x3cdiv class=\"jsel-code-line"+(isAct?" jsel-line-active":"")+"\""+clickAttr+"\x3e";
      codeHtml += "\x3cspan class=\"jsel-ln\"\x3e"+cl.ln+"\x3c/span\x3e";
      codeHtml += "\x3cspan class=\"jsel-arrow\"\x3e"+(isAct?"➔":"")+"\x3c/span\x3e";
      codeHtml += "\x3cspan\x3e"+cl.text+"\x3c/span\x3e\x3c/div\x3e";
    }
    document.getElementById("jsel-code-box").innerHTML = codeHtml;
    var logHtml = "";
    for(var g=0; g!==st.logs.length; g++){
      var lg = st.logs[g];
      logHtml += "\x3cdiv class=\"jsel-log-item"+(lg.isNew?" jsel-log-new":"")+"\"\x3e"+lg.txt+"\x3c/div\x3e";
    }
    document.getElementById("jsel-console-list").innerHTML = logHtml;
    var stackHtml = "";
    if(st.stack.length === 0){
      stackHtml = "\x3cdiv class=\"jsel-empty\"\x3e[ Call Stack 已清空 ]\x3cbr\x3eEvent Loop 正在调度队列任务...\x3c/div\x3e";
    } else {
      for(var s=0; s!==st.stack.length; s++){
        var sf = st.stack[s];
        stackHtml += "\x3cdiv class=\"jsel-frame"+(sf.top?" jsel-frame-top":"")+"\"\x3e";
        stackHtml += "\x3cspan\x3e"+sf.name+"\x3c/span\x3e\x3cspan class=\"jsel-frame-tag\"\x3e"+sf.tag+"\x3c/span\x3e\x3c/div\x3e";
      }
    }
    document.getElementById("jsel-stack-box").innerHTML = stackHtml;
    var microHtml = "";
    if(st.micro.length === 0){
      microHtml = "\x3cdiv class=\"jsel-empty\"\x3e微任务队列为空 (0 Pending)\x3c/div\x3e";
    } else {
      for(var m=0; m!==st.micro.length; m++){
        var mi = st.micro[m];
        microHtml += "\x3cdiv class=\"jsel-q-item jsel-qi-micro"+(mi.hi?" jsel-qi-hi":"")+"\"\x3e";
        microHtml += "\x3cspan\x3e"+mi.name+"\x3c/span\x3e\x3cspan class=\"jsel-frame-tag\"\x3e"+mi.status+"\x3c/span\x3e\x3c/div\x3e";
      }
    }
    document.getElementById("jsel-micro-box").innerHTML = microHtml;
    var macroHtml = "";
    if(st.macro.length === 0){
      macroHtml = "\x3cdiv class=\"jsel-empty\"\x3e宏任务队列为空 (0 Pending)\x3c/div\x3e";
    } else {
      for(var a=0; a!==st.macro.length; a++){
        var ma = st.macro[a];
        macroHtml += "\x3cdiv class=\"jsel-q-item jsel-qi-macro"+(ma.hi?" jsel-qi-hi":"")+"\"\x3e";
        macroHtml += "\x3cspan\x3e"+ma.name+"\x3c/span\x3e\x3cspan class=\"jsel-frame-tag\"\x3e"+ma.status+"\x3c/span\x3e\x3c/div\x3e";
      }
    }
    document.getElementById("jsel-macro-box").innerHTML = macroHtml;
    var linkHtml = "\x3cspan class=\"jsel-link-label\"\x3e本步调度轨迹：\x3c/span\x3e";
    for(var l=0; l!==st.links.length; l++){
      linkHtml += "\x3cspan class=\"jsel-link-pill\"\x3e"+st.links[l]+"\x3c/span\x3e";
    }
    document.getElementById("jsel-link-box").innerHTML = linkHtml;
    document.getElementById("jsel-st-title").textContent = st.title;
    var badgeEl = document.getElementById("jsel-st-badge");
    badgeEl.textContent = st.badge;
    badgeEl.className = "jsel-status " + st.badgeCls;
    document.getElementById("jsel-st-desc").textContent = st.desc;
  };
  window.__jselGo(0);
})();
</script>
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" style="display:none!important;" onload="if(!window.__jselGo){var s=document.createElement('script');s.text=document.getElementById('jsel-script-src').textContent;document.body.appendChild(s);}" />
</div>