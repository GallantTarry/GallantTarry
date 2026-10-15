# vue基础语法


Vue（目前主流标准为 **Vue 3 组合式 API / Composition API**）是一套用于构建用户界面的渐进式前端框架。它的核心设计理念是**声明式渲染（Declarative Rendering）**与**细粒度响应式系统（Reactivity System）**——开发者只需维护数据状态（State），视图（DOM）会在数据变化时自动同步更新。

  

## 1. 单文件组件结构（SFC 与 `<script setup>`）

Vue 工程化开发采用 `.vue` 单文件组件（Single-File Component），将一个组件的**逻辑（Script）**、模板（Template）**和**样式（Style）封装在同一个文件中。现代 Vue 3 默认推荐使用 `<script setup>` 语法糖，无需手动 `return` 变量即可在模板中直接使用：

  



```
<script setup>
// 1. 逻辑层：引入 API、定义响应式数据与函数（顶层变量自动暴露给模板）
import { ref } from 'vue'

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<template>
  <!-- 2. 视图层：声明式 HTML 模板 -->
  <div class="card">
    <p>当前计数：{{ count }}</p>
    <button @click="increment">点击 +1</button>
  </div>
</template>

<style scoped>
/* 3. 样式层：加上 scoped 属性后，CSS 仅对当前组件生效，防止全局样式污染 */
.card {
  padding: 16px;
  border-radius: 8px;
}
</style>
```

## 2. 响应式状态核心（`ref` 与 `reactive`）

在 Vue 3 中，普通的 JavaScript 变量修改后不会触发界面重绘，必须使用响应式 API 包装数据（底层基于 ES6 `Proxy` 实现拦截）。

  

### `ref` 与 `reactive` 对比

|**特性维度**|**ref()（推荐首选）**|**reactive()**|
|---|---|---|
|**适用数据类型**|**任意类型**（基本类型 `number`/`string`/`boolean` 及对象、数组）|**仅限引用类型**（`Object`、`Array`、`Map`、`Set`）|
|**JS 中读写方式**|必须通过 **`.value`** 属性读写（如 `count.value++`）|直接读写属性（如 `state.count++`），无需 `.value`|
|**模板中读取方式**|**自动解包**，直接写 `{{ count }}`（无需写 `.value`）|直接写 `{{ state.count }}`|
|**重新赋整个值**|支持（`userRef.value = newUser` 仍保持响应性）|**不支持直接替换引用**（`state = newState` 会丢失响应性）|
|**解构赋值影响**|配合 `toRefs` 使用|直接 ES6 解构（`const { a } = state`）会**丢失响应性**|



```
<script setup>
import { ref, reactive, toRefs } from 'vue'

// 1. ref：处理基本类型或需要整体替换的对象/数组
const message = ref('Hello Vue 3')
const updateMsg = () => {
  message.value = '状态已更新' // JS 内必须带 .value
}

// 2. reactive：处理聚合表单或复杂状态对象
const form = reactive({
  username: 'admin',
  rememberMe: true
})

// 若需解构 reactive 对象且保留响应性，需使用 toRefs 转换为一组 ref
const { username, rememberMe } = toRefs(form)
</script>
```

## 3. 模板语法与核心指令（Directives）

Vue 指令是带有 `v-` 前缀的特殊 HTML 属性，用于将数据状态响应式地作用于 DOM。

  

### 常用指令速查表

|**指令全称**|**简写形式**|**核心用途**|**代码示例**|
|---|---|---|---|
|**文本插值**|`{{ }}`|将数据作为纯文本渲染到标签内部（支持简单 JS 表达式）|`<span>{{ price * 0.8 }}</span>`|
|`v-bind`|**`:`**|动态绑定 HTML 属性（如 `src`、`class`、`style`、`disabled`）|`<img :src="avatarUrl" :alt="name" />`|
|`v-on`|**`@`**|绑定 DOM 事件监听器|`<button @click="handleSave">保存</button>`|
|`v-model`|无|表单元素或自定义组件的**双向数据绑定**|`<input v-model.trim="keyword" />`|
|`v-html`|无|渲染原始 HTML 字符串（注意防范 XSS 注入）|`<div v-html="rawHtmlContent"></div>`|

### 动态 Class 与 Style 绑定以及修饰符



```
<template>
  <!-- 1. 对象语法绑定动态 class：isActive 为真时自动添加 active 类名 -->
  <div :class="{ active: isActive, 'text-danger': hasError }">状态指示</div>

  <!-- 2. 事件修饰符：.prevent 阻止默认行为，.stop 阻止事件冒泡 -->
  <form @submit.prevent="onSubmit">
    <!-- 3. v-model 修饰符：.trim 自动去首尾空格，.number 自动转为数字，.lazy 失焦时才同步 -->
    <input v-model.trim="username" @keyup.enter="onSubmit" />
    <input v-model.number="age" type="number" />
  </form>
</template>
```

## 4. 条件渲染与列表渲染

### 条件渲染：`v-if` vs `v-show`

- **`v-if` / `v-else-if` / `v-else`**：**真正的条件挂载与销毁**。条件为假时，DOM 节点根本不会存在于页面中；切换开销高，适合运行期很少改变的条件。
    
      
    
- **`v-show`**：无论条件真假，元素始终被渲染，仅通过切换 CSS 的 `display: none` 控制显隐；初始渲染开销高，适合需要**高频切换**显隐的场景（如悬浮窗、Tab 面板）。
    
      
    

### 列表渲染：`v-for` 与 `:key`

使用 `v-for` 遍历数组或对象时，**必须绑定唯一且稳定的 `:key` 属性**（通常使用数据项的唯一 `id`，尽量避免使用可能会发生增删移位的数组索引 `index`），以便 Vue 的虚拟 DOM Diff 算法精准复用节点。

  

> **语法红线**：永远不要在同一个元素上同时使用 `v-if` 和 `v-for`（在 Vue 3 中 `v-if` 的优先级高于 `v-for`，会导致 `v-if` 无法访问 `v-for` 的循环变量而报错）。应在外层包裹一层 `<template v-for="...">` 或提前用计算属性过滤数组。
> 
>   



```
<template>
  <ul>
    <!-- 遍历数组：(元素, 索引) in 数组 -->
    <li v-for="(item, index) in todoList" :key="item.id">
      {{ index + 1 }}. {{ item.title }}
    </li>
  </ul>
</template>
```

## 5. 计算属性（`computed`）与侦听器（`watch`）

### 计算属性 `computed`

当一个数据依赖于其他响应式数据计算得出时，应使用 `computed`。它具备**缓存机制**：只有当其依赖的响应式状态发生改变时才会重新计算，否则多次访问直接返回缓存结果。

  



```
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 只读计算属性（返回值为一个计算 ref）
const fullName = computed(() => `${firstName.value}${lastName.value}`)
</script>
```

### 侦听器 `watch` 与 `watchEffect`

当需要在**数据变化时执行“副作用”操作**（如发起异步网络请求、操作本地存储 `localStorage`、防抖搜索）时，使用侦听器：

  



```
<script setup>
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const page = ref(1)

// 1. watch：显式指定要侦听的数据源，可以同时拿到【新值】和【旧值】
watch(searchQuery, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
})

// 2. watchEffect：立即执行一次函数，并自动追踪函数内部用到的所有响应式变量（如此处的 searchQuery 和 page）
watchEffect(() => {
  console.log(`自动触发请求：搜索=${searchQuery.value}, 页码=${page.value}`)
})
</script>
```

## 6. 组件通信（Props、Emits 与 `defineModel`）

Vue 组件树遵循**单向数据流**原则：父组件通过 **Props** 向下传递数据，子组件通过 **Emits** 向上触发事件通知父组件修改数据；或者使用 Vue 3.4+ 引入的 **`defineModel`** 直接实现父子双向绑定。

  



```
<!-- 子组件：UserCard.vue -->
<script setup>
// 1. 接收父组件传入的 Props（编译宏无需 import）
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 }
})

// 2. 声明向父组件抛出的自定义事件
const emit = defineEmits(['reset'])
const notifyParent = () => {
  emit('reset', 0) // 触发 reset 事件并附带参数 0
}

// 3. Vue 3.4+ 双向绑定宏：一行代码打通父组件的 v-model
const keyword = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <h3>{{ props.title }} ({{ props.count }})</h3>
    <input v-model="keyword" placeholder="子组件内直接修改将同步至父组件" />
    <button @click="notifyParent">重置计数</button>
  </div>
</template>
```

父组件调用该子组件时：

  


```
<template>
  <UserCard
    title="用户面板"
    :count="totalCount"
    v-model="searchKey"
    @reset="(val) => (totalCount = val)"
  />
</template>
```

## 7. 组件生命周期钩子（Lifecycle Hooks）

每个 Vue 组件实例从创建、挂载到 DOM、更新再到销毁，都会经历一系列生命周期阶段。在 `<script setup>` 中，生命周期钩子以 `onXxx` 函数的形式按需引入调用：

  

|**生命周期阶段**|**组合式 API 钩子函数**|**触发时机与典型工程用途**|
|---|---|---|
|**创建阶段**|`<script setup>` 顶层代码|组件实例初始化即执行（替代了 Vue 2 的 `beforeCreate` 和 `created`）|
|**挂载前**|`onBeforeMount()`|模板已完成编译，但尚未挂载到真实 DOM 树上|
|**挂载完成**|**`onMounted()`**|**最常用**：真实 DOM 已渲染完毕，可在此发起首屏接口请求、操作 DOM 引用或初始化图表（如 D3/ECharts）|
|**更新前**|`onBeforeUpdate()`|响应式状态已改变，即将重新渲染虚拟 DOM 之前|
|**更新完成**|`onUpdated()`|数据变化导致的真实 DOM 重新渲染已完成（切勿在此无条件修改响应式数据，否则会导致死循环）|
|**卸载前**|`onBeforeUnmount()`|组件实例即将被销毁前，组件依然完全可用|
|**卸载完成**|**`onUnmounted()`**|**最常用**：组件已从 DOM 移除，必须在此**清理定时器（`clearInterval`）、解绑全局事件监听器或断开 WebSocket**，防止内存泄漏|



```
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const inputRef = ref(null) // 模板引用（Template Ref）：变量名需与模板中的 ref="inputRef" 一致
let timer = null

onMounted(() => {
  // 挂载完成后自动聚焦输入框
  inputRef.value?.focus()
  timer = setInterval(() => console.log('心跳检测'), 5000)
})

onUnmounted(() => {
  // 组件销毁时清除定时器
  clearInterval(timer)
})
</script>

<template>
  <input ref="inputRef" placeholder="页面加载后自动聚焦" />
</template>
```

## Vue 3 响应式依赖追踪与生命周期流转交互演示

为了直观理解 Vue 3 是如何将 **`<script setup>` 初始化**、**Proxy 依赖收集（Track）**、**状态变更派发更新（Trigger）**、**虚拟 DOM 比对（Patch）** 与 **生命周期钩子** 串联起来的，你可以通过下方交互式状态机逐步查看组件从挂载到更新再到卸载的完整底层链路：


<div id="v3-demo-root">
<style>
#v3-demo-root{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"JetBrains Mono",Consolas,monospace;background:linear-gradient(145deg,#0f172a 0%,#131c31 100%);color:#e2e8f0;border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:18px;margin:16px 0;box-shadow:0 12px 32px rgba(0,0,0,0.38);line-height:1.5;}
#v3-demo-root *{box-sizing:border-box;}
.v3-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,0.16);margin-bottom:12px;}
.v3-title{font-size:16px;font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:8px;}
.v3-dot{width:10px;height:10px;border-radius:50%;background:#42b883;box-shadow:0 0 10px #42b883;display:inline-block;}
.v3-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.v3-btn{background:rgba(30,41,59,0.85);color:#cbd5e1;border:1px solid rgba(148,163,184,0.28);border-radius:7px;padding:5px 11px;font-size:12px;font-family:inherit;cursor:pointer;transition:all 0.18s ease;user-select:none;}
.v3-btn:hover{border-color:#42b883;color:#fff;background:rgba(66,184,131,0.15);}
.v3-btn.v3-active{background:#059669;color:#fff;border-color:#34d399;font-weight:600;box-shadow:0 0 12px rgba(52,211,153,0.35);}
.v3-hooks-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:rgba(15,23,42,0.75);border:1px solid rgba(148,163,184,0.15);border-radius:9px;padding:8px 12px;margin-bottom:14px;font-size:11.5px;}
.v3-hook-label{color:#94a3b8;font-weight:600;margin-right:4px;}
.v3-hook-node{font-family:"JetBrains Mono",Consolas,monospace;padding:3px 9px;border-radius:6px;background:rgba(30,41,59,0.8);color:#64748b;border:1px solid rgba(148,163,184,0.18);cursor:pointer;transition:all 0.2s ease;}
.v3-hook-node:hover{color:#cbd5e1;border-color:rgba(148,163,184,0.4);}
.v3-hook-node.v3-hook-done{color:#34d399;border-color:rgba(52,211,153,0.3);background:rgba(16,185,129,0.08);}
.v3-hook-node.v3-hook-curr{color:#fef08a;border-color:#fbbf24;background:rgba(251,191,36,0.18);font-weight:700;box-shadow:0 0 10px rgba(251,191,36,0.25);}
.v3-hook-sep{color:#475569;font-size:11px;user-select:none;}
.v3-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:14px;margin-bottom:14px;}
@media(max-width:860px){.v3-grid{grid-template-columns:1fr;}}
.v3-panel{background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.16);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;}
.v3-panel-head{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:0.4px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.12);}
.v3-tag-sfc{color:#42b883;}
.v3-tag-react{color:#38bdf8;}
.v3-tag-dom{color:#c084fc;}
.v3-sub{font-size:11px;color:#94a3b8;font-weight:400;}
.v3-code-list{display:flex;flex-direction:column;gap:3px;font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;}
.v3-code-line{display:flex;align-items:center;padding:3.5px 7px;border-radius:6px;color:#94a3b8;transition:all 0.2s ease;cursor:pointer;}
.v3-code-line:hover{background:rgba(148,163,184,0.08);}
.v3-code-line.v3-line-active{background:rgba(66,184,131,0.18);color:#a7f3d0;border-left:3px solid #42b883;font-weight:600;}
.v3-ln{width:20px;color:#64748b;font-size:10.5px;user-select:none;flex-shrink:0;}
.v3-arrow{width:16px;color:#34d399;font-weight:700;flex-shrink:0;}
.v3-box-list{display:flex;flex-direction:column;gap:8px;}
.v3-card{background:rgba(30,41,59,0.75);border:1px solid rgba(148,163,184,0.2);border-radius:8px;padding:9px 10px;transition:all 0.25s ease;}
.v3-card-react{border-left:3px solid #38bdf8;}
.v3-card-dom{border-left:3px solid #c084fc;}
.v3-card-hi{border-color:#fbbf24;box-shadow:0 0 14px rgba(251,191,36,0.2);background:rgba(251,191,36,0.07);}
.v3-card-warn{border-left-color:#fb7185;opacity:0.75;background:rgba(244,63,94,0.08);}
.v3-card-top{display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:5px;}
.v3-badge-sm{font-family:"JetBrains Mono",Consolas,monospace;color:#94a3b8;background:rgba(15,23,42,0.75);padding:1px 6px;border-radius:4px;}
.v3-card-title{color:#cbd5e1;font-weight:600;}
.v3-card-body{display:flex;justify-content:space-between;align-items:center;font-family:"JetBrains Mono",Consolas,monospace;font-size:12.5px;gap:6px;flex-wrap:wrap;}
.v3-key{color:#f8fafc;font-weight:700;}
.v3-pill{padding:2px 8px;border-radius:5px;background:rgba(15,23,42,0.85);color:#38bdf8;font-weight:700;border:1px solid rgba(56,189,248,0.3);font-size:12px;}
.v3-pill-green{color:#34d399;border-color:rgba(52,211,153,0.35);}
.v3-pill-amber{color:#fbbf24;border-color:rgba(251,191,36,0.35);}
.v3-pill-purple{color:#c084fc;border-color:rgba(192,132,252,0.35);}
.v3-pill-rose{color:#fb7185;border-color:rgba(251,113,133,0.35);}
.v3-note{margin-top:6px;font-size:11px;color:#fde68a;background:rgba(251,191,36,0.1);padding:3px 7px;border-radius:4px;display:inline-block;}
.v3-dom-preview{background:rgba(15,23,42,0.9);border:1px dashed rgba(192,132,252,0.35);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;}
.v3-dom-head{font-size:11px;color:#c084fc;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
.v3-browser-box{background:#1e293b;border:1px solid rgba(148,163,184,0.25);border-radius:6px;padding:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}
.v3-browser-text{font-family:"JetBrains Mono",Consolas,monospace;font-size:13px;color:#f8fafc;font-weight:700;}
.v3-sim-btn{background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.18s ease;}
.v3-sim-btn:hover{filter:brightness(1.12);box-shadow:0 0 10px rgba(16,185,129,0.4);}
.v3-sim-btn:disabled{background:#334155;color:#64748b;cursor:not-allowed;box-shadow:none;}
.v3-link-bar{background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.v3-link-label{color:#94a3b8;font-weight:600;}
.v3-link-pill{font-family:"JetBrains Mono",Consolas,monospace;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);color:#bae6fd;padding:3px 9px;border-radius:6px;}
.v3-footer{background:rgba(30,41,59,0.7);border-left:4px solid #42b883;border-radius:8px;padding:11px 14px;font-size:13px;display:flex;flex-direction:column;gap:4px;}
.v3-footer-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.v3-step-title{font-weight:700;color:#f8fafc;font-size:14px;}
.v3-status{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;}
.v3-st-green{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);}
.v3-st-blue{background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);}
.v3-st-amber{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);}
.v3-st-rose{background:rgba(251,113,133,0.15);color:#fb7185;border:1px solid rgba(251,113,133,0.3);}
.v3-desc{color:#cbd5e1;font-size:12.5px;line-height:1.6;}
</style>
<div class="v3-header">
  <div class="v3-title"><span class="v3-dot"></span><span>Vue 3 组件生命周期与响应式引擎状态机</span></div>
  <div class="v3-controls">
    <button type="button" class="v3-btn" onclick="window.__v3Go(window.__v3Cur-1)">◀ 上一阶段</button>
    <button type="button" class="v3-btn v3-active" id="v3-b0" onclick="window.__v3Go(0)">1. setup初始化</button>
    <button type="button" class="v3-btn" id="v3-b1" onclick="window.__v3Go(1)">2. 依赖收集</button>
    <button type="button" class="v3-btn" id="v3-b2" onclick="window.__v3Go(2)">3. onMounted</button>
    <button type="button" class="v3-btn" id="v3-b3" onclick="window.__v3Go(3)">4. trigger派发</button>
    <button type="button" class="v3-btn" id="v3-b4" onclick="window.__v3Go(4)">5. Diff与更新</button>
    <button type="button" class="v3-btn" id="v3-b5" onclick="window.__v3Go(5)">6. onUnmounted</button>
    <button type="button" class="v3-btn" onclick="window.__v3Go(window.__v3Cur+1)">下一阶段 ▶</button>
  </div>
</div>
<div class="v3-hooks-bar" id="v3-hooks-box"></div>
<div class="v3-grid">
  <div class="v3-panel">
    <div class="v3-panel-head"><span class="v3-tag-sfc">单文件组件 (Counter.vue)</span><span class="v3-sub">点击代码行可切换阶段</span></div>
    <div class="v3-code-list" id="v3-code-box"></div>
  </div>
  <div class="v3-panel">
    <div class="v3-panel-head"><span class="v3-tag-react">响应式引擎 (Reactivity &amp; Scheduler)</span><span class="v3-sub">RefImpl · Track · Trigger</span></div>
    <div class="v3-box-list" id="v3-react-box"></div>
  </div>
  <div class="v3-panel">
    <div class="v3-panel-head"><span class="v3-tag-dom">虚拟 DOM 与真实视图 (VNode &amp; DOM)</span><span class="v3-sub">PatchFlag 靶向更新</span></div>
    <div class="v3-box-list" id="v3-dom-box"></div>
  </div>
</div>
<div class="v3-link-bar" id="v3-link-box"></div>
<div class="v3-footer">
  <div class="v3-footer-top">
    <span class="v3-step-title" id="v3-st-title"></span>
    <span class="v3-status v3-st-green" id="v3-st-badge"></span>
  </div>
  <div class="v3-desc" id="v3-st-desc"></div>
</div>
<script id="v3-script-src">
(function(){
  var codeLines = [
    {ln:1, text:"\x3cscript setup\x3e", step:0},
    {ln:2, text:"import { ref, onMounted, onUpdated, onUnmounted } from 'vue'", step:0},
    {ln:3, text:"const count = ref(0) // 创建 RefImpl 响应式容器", step:0},
    {ln:4, text:"const add = () =\x3e { count.value++ } // 触发 setter 拦截", step:3},
    {ln:5, text:"onMounted(() =\x3e console.log('DOM 挂载完成'))", step:2},
    {ln:6, text:"onUpdated(() =\x3e console.log('DOM 补丁更新完成'))", step:4},
    {ln:7, text:"onUnmounted(() =\x3e clearInterval(timer))", step:5},
    {ln:8, text:"\x3c/script\x3e", step:-1},
    {ln:9, text:"\x3ctemplate\x3e", step:1},
    {ln:10, text:"  \x3cbutton @click=\"add\"\x3e计数: {{ count }}\x3c/button\x3e", step:1},
    {ln:11, text:"\x3c/template\x3e", step:-1}
  ];
  var hookNodes = [
    {name:"setup()", step:0},
    {name:"onBeforeMount", step:1},
    {name:"onMounted", step:2},
    {name:"onBeforeUpdate", step:3},
    {name:"onUpdated", step:4},
    {name:"onUnmounted", step:5}
  ];
  window.__v3CountVal = 0;
  var getStages = function(cVal){
    var nextVal = (cVal === 0) ? 1 : cVal;
    return [
      {
        title:"阶段 1：执行 \x3cscript setup\x3e 初始化响应式状态",
        badge:"Creation · 响应式包装",
        badgeCls:"v3-st-blue",
        desc:"组件实例创建后立即执行 \x3cscript setup\x3e 顶层代码。调用 ref(0) 会实例化一个 RefImpl 对象，内部包含 _value: 0 以及一个空的依赖集合 dep (Set)。此时模板尚未编译挂载，真实 DOM 还不存在（值为 null）。",
        links:["ref(0) ──\x3e 实例化 RefImpl { _value: 0, dep: Set(0) }","注册生命周期回调函数 (onMounted / onUpdated / onUnmounted)"],
        react:[
          {tag:"RefImpl 实例", title:"count", key:"count.value", val:"0", pillCls:"v3-pill", hi:true, warn:false, note:"⚡ 已包装 getter / setter 响应式拦截器"},
          {tag:"依赖集合 (Dep)", title:"count.dep", key:"Subscribers", val:"Set(0) [ 空 ]", pillCls:"v3-pill-amber", hi:false, warn:false, note:""},
          {tag:"异步调度队列", title:"Scheduler", key:"nextTick Queue", val:"Idle (空闲)", pillCls:"v3-pill", hi:false, warn:false, note:""}
        ],
        vnode:{tag:"VNode 树状态", title:"Compiler", key:"Render Effect", val:"未创建 (等待挂载)", pillCls:"v3-pill-purple", hi:false, warn:false, note:""},
        domMounted:false,
        domDestroyed:false,
        domText:"[ 尚未挂载到浏览器真实 DOM ]"
      },
      {
        title:"阶段 2：onBeforeMount 与首次渲染依赖收集 (track)",
        badge:"Track · 建立依赖订阅",
        badgeCls:"v3-st-amber",
        desc:"触发 onBeforeMount 后，Vue 启动组件的 ReactiveEffect（渲染副作用函数）执行首次模板渲染。当读取 {{ count }} 时触发 RefImpl 的 getter，底层调用 track(count, 'value')，将当前组件的渲染 Effect 精确存入 count.dep 集合中。",
        links:["执行 render() 读取 count.value","触发 getter ──\x3e 调用 track()","count.dep.add(componentRenderEffect)"],
        react:[
          {tag:"RefImpl 实例", title:"count (Getter 触发)", key:"count.value", val:"0", pillCls:"v3-pill-green", hi:false, warn:false, note:""},
          {tag:"依赖收集 (Track)", title:"count.dep", key:"Subscribers", val:"Set(1) [ RenderEffect ]", pillCls:"v3-pill-amber", hi:true, note:"✔ 已记录：count 变化时需通知当前组件重绘"},
          {tag:"异步调度队列", title:"Scheduler", key:"nextTick Queue", val:"Idle (空闲)", pillCls:"v3-pill", hi:false, warn:false, note:""}
        ],
        vnode:{tag:"初始 VNode 树", title:"createVNode", key:"button VNode", val:"children: \"计数: 0\" (PatchFlag: 1)", pillCls:"v3-pill-purple", hi:true, warn:false, note:"⚡ 编译器标记 PatchFlag=1 (动态文本节点)"},
        domMounted:false,
        domDestroyed:false,
        domText:"[ VNode 已就绪，正在执行 patch 挂载... ]"
      },
      {
        title:"阶段 3：真实 DOM 挂载完成并触发 onMounted",
        badge:"Mounted · 视图可交互",
        badgeCls:"v3-st-green",
        desc:"虚拟 DOM (VNode) 已通过宿主环境 API (document.createElement / insertBefore) 渲染为浏览器真实 DOM 节点。紧接着执行 onMounted 钩子——这是获取模板引用 (ref=\"el\")、初始化第三方图表（如 D3 / ECharts）或发起首屏接口请求的最佳时机。",
        links:["patch(null, initialVNode) ──\x3e 挂载真实 DOM","触发 onMounted() 钩子 ──\x3e 组件进入稳定交互态"],
        react:[
          {tag:"RefImpl 实例", title:"count", key:"count.value", val:String(cVal), pillCls:"v3-pill-green", hi:false, warn:false, note:""},
          {tag:"依赖集合 (Dep)", title:"count.dep", key:"Subscribers", val:"Set(1) [ RenderEffect ]", pillCls:"v3-pill", hi:false, warn:false, note:""},
          {tag:"生命周期状态", title:"Hook Fired", key:"当前激活钩子", val:"onMounted()", pillCls:"v3-pill-green", hi:true, note:"✔ 此时可安全操作真实 DOM 节点"}
        ],
        vnode:{tag:"当前 VNode 树", title:"Mounted VNode", key:"el 绑定", val:"vnode.el ──\x3e HTMLButtonElement", pillCls:"v3-pill-purple", hi:false, warn:false, note:""},
        domMounted:true,
        domDestroyed:false,
        domText:"计数: " + cVal
      },
      {
        title:"阶段 4：状态变更触发 setter 拦截与派发更新 (trigger)",
        badge:"Trigger · 异步缓冲队列",
        badgeCls:"v3-st-amber",
        desc:"用户点击按钮执行 count.value++，触发 RefImpl 的 setter 拦截器。Vue 将新值写入 _value 后调用 trigger(count, 'value')，从 count.dep 中取出订阅的 RenderEffect 推入 Scheduler 的 nextTick 微任务队列（多次同步修改会被合并去重，只渲染一次）。",
        links:["count.value++ 触发 setter","调用 trigger(count) 通知 count.dep","queueJob(RenderEffect) 推入微任务队列","触发 onBeforeUpdate()"],
        react:[
          {tag:"RefImpl 实例", title:"count (Setter 触发)", key:"count.value", val:String(nextVal), pillCls:"v3-pill-amber", hi:true, note:"⚡ 值已更新，触发 trigger() 广播"},
          {tag:"派发通知 (Trigger)", title:"count.dep", key:"Notify", val:"唤醒 RenderEffect", pillCls:"v3-pill-amber", hi:true, note:""},
          {tag:"异步调度队列", title:"Scheduler", key:"nextTick 微任务", val:"Queued [ RenderEffect ]", pillCls:"v3-pill-green", hi:true, note:"⚡ 批量异步缓冲：避免同步多次操作 DOM"}
        ],
        vnode:{tag:"更新前状态", title:"onBeforeUpdate", key:"旧 VNode", val:"仍保持 \"计数: " + (nextVal - 1) + "\"", pillCls:"v3-pill-purple", hi:false, warn:false, note:"此时真实 DOM 尚未更新，即将生成新 VNode"},
        domMounted:true,
        domDestroyed:false,
        domText:"计数: " + (nextVal - 1) + " (待微任务刷新)"
      },
      {
        title:"阶段 5：Virtual DOM Diff 比对、靶向补丁与 onUpdated",
        badge:"Patch · 靶向更新完成",
        badgeCls:"v3-st-green",
        desc:"微任务队列执行组件重渲染，生成新的 VNode 树。借助编译期注入的 PatchFlag (1 /* TEXT */)，Vue 跳过静态属性比对，直接定位到动态文本节点修改 textContent，随后触发 onUpdated 钩子（切勿在 onUpdated 中无条件修改状态，否则会引发无限更新死循环）。",
        links:["执行新 render() 生成 New VNode","patch(oldVNode, newVNode) 识别 PatchFlag: 1","el.textContent = \"计数: " + nextVal + "\"","触发 onUpdated()"],
        react:[
          {tag:"RefImpl 实例", title:"count", key:"count.value", val:String(nextVal), pillCls:"v3-pill-green", hi:false, warn:false, note:""},
          {tag:"异步调度队列", title:"Scheduler", key:"nextTick Queue", val:"Flushed (已清空)", pillCls:"v3-pill", hi:false, warn:false, note:""},
          {tag:"生命周期状态", title:"Hook Fired", key:"当前激活钩子", val:"onUpdated()", pillCls:"v3-pill-green", hi:true, note:"✔ 视图已与最新响应式数据完全同步"}
        ],
        vnode:{tag:"靶向 Diff 算法", title:"patchElement", key:"PatchFlag: 1", val:"仅更新文本: \"" + (nextVal - 1) + "\" ➔ \"" + nextVal + "\"", pillCls:"v3-pill-purple", hi:true, warn:false, note:"⚡ 无需遍历整棵 DOM 树，O(1) 靶向直达动态节点"},
        domMounted:true,
        domDestroyed:false,
        domText:"计数: " + nextVal
      },
      {
        title:"阶段 6：组件卸载 (onUnmounted) 与副作用清理",
        badge:"Unmounted · 内存回收",
        badgeCls:"v3-st-rose",
        desc:"当组件因 v-if=\"false\" 或路由切换被移除时，依次触发 onBeforeUnmount 与 onUnmounted。Vue 会自动停止组件内部的 ReactiveEffect、computed 与 watch 依赖订阅（effect.stop()），移除真实 DOM，并执行开发者在 onUnmounted 中注册的定时器/全局事件清理逻辑。",
        links:["触发 onBeforeUnmount()","effect.stop() 清空 count.dep 订阅引用","移除真实 DOM 节点","触发 onUnmounted() 清理定时器"],
        react:[
          {tag:"RefImpl 实例", title:"count", key:"Status", val:"等待 GC 垃圾回收", pillCls:"v3-pill-rose", hi:false, warn:true, note:""},
          {tag:"依赖解绑 (Cleanup)", title:"count.dep", key:"Subscribers", val:"Set(0) [ 已清空解除订阅 ]", pillCls:"v3-pill-rose", hi:true, warn:true, note:"✔ 防止组件销毁后残留引用导致内存泄漏"},
          {tag:"生命周期状态", title:"Hook Fired", key:"当前激活钩子", val:"onUnmounted()", pillCls:"v3-pill-rose", hi:true, warn:false, note:"✔ clearInterval(timer) 已执行"}
        ],
        vnode:{tag:"VNode 树销毁", title:"unmount()", key:"DOM 引用", val:"vnode.el = null", pillCls:"v3-pill-rose", hi:false, warn:true, note:""},
        domMounted:false,
        domDestroyed:true,
        domText:"[ 组件已卸载，DOM 节点已从文档树移除 ]"
      }
    ];
  };
  window.__v3Cur = 0;
  window.__v3SimClick = function(){
    window.__v3CountVal = (window.__v3CountVal === 0) ? 2 : window.__v3CountVal + 1;
    if(window.__v3Cur === 3){
      window.__v3Go(4);
    } else {
      window.__v3Go(3);
    }
  };
  window.__v3Go = function(idx){
    if(idx !== 0 && idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4 && idx !== 5){return;}
    if(idx === 0 || idx === 1){window.__v3CountVal = 0;}
    if(idx === 2 && window.__v3CountVal === 0){window.__v3CountVal = 0;}
    if((idx === 3 || idx === 4) && window.__v3CountVal === 0){window.__v3CountVal = 1;}
    window.__v3Cur = idx;
    var stages = getStages(window.__v3CountVal);
    var st = stages[idx];
    for(var b=0; b!==6; b++){
      var btn = document.getElementById("v3-b"+b);
      if(btn){btn.className = (b===idx) ? "v3-btn v3-active" : "v3-btn";}
    }
    var hooksHtml = "\x3cspan class=\"v3-hook-label\"\x3e生命周期轨迹：\x3c/span\x3e";
    for(var h=0; h!==hookNodes.length; h++){
      var hn = hookNodes[h];
      var hCls = "v3-hook-node";
      if(hn.step === idx){
        hCls += " v3-hook-curr";
      } else if(hn.step === 0 || (idx === 2 && hn.step === 1) || (idx === 3 && (hn.step === 1 || hn.step === 2)) || (idx === 4 && hn.step !== 4 && hn.step !== 5) || (idx === 5 && hn.step !== 5)){
        hCls += " v3-hook-done";
      }
      hooksHtml += "\x3cspan class=\""+hCls+"\" onclick=\"window.__v3Go("+hn.step+")\"\x3e"+hn.name+"\x3c/span\x3e";
      if(h !== hookNodes.length - 1){
        hooksHtml += "\x3cspan class=\"v3-hook-sep\"\x3e➔\x3c/span\x3e";
      }
    }
    document.getElementById("v3-hooks-box").innerHTML = hooksHtml;
    var codeHtml = "";
    for(var i=0; i!==codeLines.length; i++){
      var cl = codeLines[i];
      var isAct = (cl.step === idx);
      var clickAttr = (cl.step !== -1) ? " onclick=\"window.__v3Go("+cl.step+")\"" : "";
      codeHtml += "\x3cdiv class=\"v3-code-line"+(isAct?" v3-line-active":"")+"\""+clickAttr+"\x3e";
      codeHtml += "\x3cspan class=\"v3-ln\"\x3e"+cl.ln+"\x3c/span\x3e";
      codeHtml += "\x3cspan class=\"v3-arrow\"\x3e"+(isAct?"➔":"")+"\x3c/span\x3e";
      codeHtml += "\x3cspan\x3e"+cl.text+"\x3c/span\x3e\x3c/div\x3e";
    }
    document.getElementById("v3-code-box").innerHTML = codeHtml;
    var reactHtml = "";
    for(var r=0; r!==st.react.length; r++){
      var rc = st.react[r];
      var rCls = "v3-card v3-card-react" + (rc.hi?" v3-card-hi":"") + (rc.warn?" v3-card-warn":"");
      reactHtml += "\x3cdiv class=\""+rCls+"\"\x3e";
      reactHtml += "\x3cdiv class=\"v3-card-top\"\x3e\x3cspan class=\"v3-badge-sm\"\x3e"+rc.tag+"\x3c/span\x3e\x3cspan class=\"v3-card-title\"\x3e"+rc.title+"\x3c/span\x3e\x3c/div\x3e";
      reactHtml += "\x3cdiv class=\"v3-card-body\"\x3e\x3cspan class=\"v3-key\"\x3e"+rc.key+"\x3c/span\x3e\x3cspan class=\"v3-pill "+rc.pillCls+"\"\x3e"+rc.val+"\x3c/span\x3e\x3c/div\x3e";
      if(rc.note){reactHtml += "\x3cdiv class=\"v3-note\"\x3e"+rc.note+"\x3c/div\x3e";}
      reactHtml += "\x3c/div\x3e";
    }
    document.getElementById("v3-react-box").innerHTML = reactHtml;
    var vn = st.vnode;
    var vCls = "v3-card v3-card-dom" + (vn.hi?" v3-card-hi":"") + (vn.warn?" v3-card-warn":"");
    var domHtml = "\x3cdiv class=\""+vCls+"\"\x3e";
    domHtml += "\x3cdiv class=\"v3-card-top\"\x3e\x3cspan class=\"v3-badge-sm\"\x3e"+vn.tag+"\x3c/span\x3e\x3cspan class=\"v3-card-title\"\x3e"+vn.title+"\x3c/span\x3e\x3c/div\x3e";
    domHtml += "\x3cdiv class=\"v3-card-body\"\x3e\x3cspan class=\"v3-key\"\x3e"+vn.key+"\x3c/span\x3e\x3cspan class=\"v3-pill "+vn.pillCls+"\"\x3e"+vn.val+"\x3c/span\x3e\x3c/div\x3e";
    if(vn.note){domHtml += "\x3cdiv class=\"v3-note\"\x3e"+vn.note+"\x3c/div\x3e";}
    domHtml += "\x3c/div\x3e";
    domHtml += "\x3cdiv class=\"v3-dom-preview\"\x3e";
    domHtml += "\x3cdiv class=\"v3-dom-head\"\x3e\x3cspan\x3e浏览器真实 DOM 渲染预览\x3c/span\x3e\x3cspan\x3e"+(st.domMounted?"🟢 已挂载":"⚪ 未挂载")+"\x3c/span\x3e\x3c/div\x3e";
    domHtml += "\x3cdiv class=\"v3-browser-box\"\x3e";
    domHtml += "\x3cspan class=\"v3-browser-text\"\x3e"+st.domText+"\x3c/span\x3e";
    var btnDis = st.domMounted ? "" : " disabled=\"disabled\"";
    var btnTxt = st.domMounted ? "点击触发 count++ (@click)" : "等待挂载...";
    domHtml += "\x3cbutton type=\"button\" class=\"v3-sim-btn\""+btnDis+" onclick=\"window.__v3SimClick()\"\x3e"+btnTxt+"\x3c/button\x3e";
    domHtml += "\x3c/div\x3e\x3c/div\x3e";
    document.getElementById("v3-dom-box").innerHTML = domHtml;
    var linkHtml = "\x3cspan class=\"v3-link-label\"\x3e底层执行链路：\x3c/span\x3e";
    for(var l=0; l!==st.links.length; l++){
      linkHtml += "\x3cspan class=\"v3-link-pill\"\x3e"+st.links[l]+"\x3c/span\x3e";
    }
    document.getElementById("v3-link-box").innerHTML = linkHtml;
    document.getElementById("v3-st-title").textContent = st.title;
    var badgeEl = document.getElementById("v3-st-badge");
    badgeEl.textContent = st.badge;
    badgeEl.className = "v3-status " + st.badgeCls;
    document.getElementById("v3-st-desc").textContent = st.desc;
  };
  window.__v3Go(0);
})();
</script>
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" style="display:none!important;" onload="if(!window.__v3Go){var s=document.createElement('script');s.text=document.getElementById('v3-script-src').textContent;document.body.appendChild(s);}" />
</div>