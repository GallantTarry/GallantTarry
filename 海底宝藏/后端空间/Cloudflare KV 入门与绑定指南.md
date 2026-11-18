# Cloudflare KV 入门与绑定指南

**Cloudflare Workers KV 是一种托管的键值存储服务：你用一个 key 找到对应的 value。Namespace 是存放这些数据的独立空间；namespace 名称用于管理时识别，ID 用于确定具体空间，binding 则把这个空间接到 Worker 代码里的变量上。**

例如：你创建一个叫 `my-site-data` 的空间，把它绑定为 `SITE_CONFIG`，然后通过 `await env.SITE_CONFIG.get("site:title")` 读取里面的网站标题。**空间名、绑定名和数据 key 不需要相同。** [KV 绑定说明](https://developers.cloudflare.com/kv/concepts/kv-bindings/)

本文按常见 Workers KV 配置讲解，关于缓存和一致性的说明针对普通 Workers KV（classic）。

---

## 一、`kvname`、`binding`、namespace 和 key 分别是什么？

### 1. 把每个名称放回它的位置

假设你要保存网站标题：

| 名称 | 示例 | 作用 |
| --- | --- | --- |
| KV namespace | 一整个键值存储空间 | 隔离和组织一组数据 |
| Namespace 名称 / title | `my-site-data` | 在控制台里方便人识别 |
| Namespace ID | 创建时 Cloudflare 返回的真实 ID | 标识具体存储空间；配置中的 `id` 填它 |
| Binding 名称 | `SITE_CONFIG` | Worker 用这个名称访问已绑定的资源 |
| Key（键） | `site:title` | 定位空间中的某条数据 |
| Value（值） | `我的知识库` | 该条数据保存的内容 |

Namespace ID 本身不是访问密钥；知道 ID 不等于获得读写权限。[Namespace 官方说明](https://developers.cloudflare.com/kv/concepts/kv-namespaces/)

可以把 namespace 想成一个资料柜，key 是资料标签，value 是内容。Binding 是程序连接这个资料柜的访问入口。这个类比描述的是使用方式，不代表 KV 底层是一张普通 JavaScript 哈希表。

### 2. `binding` 不只是给字符串起个名字

在 `wrangler.jsonc` 中，KV 的典型配置是：

```json
{
  "kv_namespaces": [
    {
      "binding": "SITE_CONFIG",
      "id": "替换成创建后返回的真实Namespace_ID"
    }
  ]
}
```

这段配置表示：**把 `id` 指定的空间，以 `SITE_CONFIG` 这个名称提供给当前 Worker。** 运行时，Cloudflare 会让代码通过 `env.SITE_CONFIG` 调用 `get()`、`put()` 等方法。它不是保存 ID 的普通字符串，也不是一段你需要自己填写的 API Token；binding 同时提供操作接口和访问该资源的能力。[Bindings 的权限与 API 模型](https://developers.cloudflare.com/workers/runtime-apis/bindings/)

```text
Worker 代码：env.SITE_CONFIG
           │
           │ binding = "SITE_CONFIG"
           ▼
配置中的 namespace ID
           │
           ▼
KV 空间：my-site-data
           │
           └── key: site:title → value: 我的知识库
```

这里的 `env` 是 Worker 处理函数收到的运行环境参数，KV binding 位于它的属性上。网页浏览器里的普通 JavaScript 不会自动得到这个 `env` 对象。

### 3. 那 `kvname` 是什么？

`kvname` 不是 Wrangler KV 配置中必须出现的固定字段。常见情况是教程作者自己选择了这个 binding 名：

```json
{
  "kv_namespaces": [
    {
      "binding": "kvname",
      "id": "替换成真实Namespace_ID"
    }
  ]
}
```

于是代码要对应写成：

```javascript
const title = await env.kvname.get("site:title");
```

如果配置里改成 `SITE_CONFIG`，代码就应使用 `env.SITE_CONFIG`。大小写要一致。`99.kvname` 不是标准配置要求的写法；如果把它整串当作 binding 名，它也不符合 JavaScript 标识符规则。可以使用 `KV99`、`MY_KV`、`kvname` 这样的名称。[KV binding 命名要求](https://developers.cloudflare.com/kv/concepts/kv-bindings/)

> **改哪个名称，会影响什么？** 只改变控制台展示名称、仍保留同一个 namespace ID，现有绑定仍指向同一空间；改变 binding 名，要同步修改代码；把 binding 指向另一个 ID，则会访问另一个空间，而不是自动把原来的数据搬过去。

---

## 二、KV 和 `Map`、`kvmap` 有什么关系？

**KV 是 Key–Value（键—值）这种存储方式；JavaScript `Map` 是程序内存里的数据结构。** Workers KV 把这种按 key 存取的能力做成可持久保存、供 Worker 访问的云服务。

| 对比 | JavaScript `Map` | Cloudflare Workers KV |
| --- | --- | --- |
| 存放位置 | 当前运行实例的内存 | Cloudflare 管理的存储系统 |
| 典型写法 | `map.set(key, value)` | `await env.MY_KV.put(key, value)` |
| 生命周期 | 不能依赖实例内存长期存在 | 数据可保留到删除或设置的过期时间 |
| 多实例共享 | 不会自动同步到其他实例 | 通过同一 namespace 访问数据，但普通 KV 是最终一致的 |
| 访问形式 | 对本地对象的同步操作 | 对服务的异步操作，通常需要 `await` |

Worker 实例可能被回收，请不要把模块顶层的 `new Map()` 当作可靠持久数据库。[Workers 实例与全局状态](https://developers.cloudflare.com/workers/reference/how-workers-works/)

`kvmap` 可以只是一个自定义变量名。例如，当前 KV API 支持批量读取，返回结果就是一个 JavaScript `Map`：

```javascript
// 这些语句放在能够访问 env 的 Worker 函数中
const kvmap = await env.SITE_CONFIG.get(["site:title", "site:theme"]);
const title = kvmap.get("site:title");
```

这里 `env.SITE_CONFIG` 是云端 KV 的访问入口，`kvmap` 是这一次读取返回的内存结果。对 `kvmap` 调用 `.set()` 只会改变本地结果对象；需要保存到云端时，应调用 binding 的 `.put()`。[KV 单键与批量读取 API](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)

---

## 三、Cloudflare 在这里实现了什么技术？

### 1. 区分网络、计算和存储

| 层次 | 相关服务或技术 | 帮你完成什么 |
| --- | --- | --- |
| 网络访问 | DNS、反向代理、CDN、安全防护 | 解析域名，在代理流量路径上提供缓存和防护 |
| 程序执行 | Cloudflare Workers、V8 isolates | 在 Cloudflare 的网络上运行请求处理代码 |
| 数据保存 | Workers KV | 为程序保存和读取键值数据 |
| 资源接入 | Bindings | 将存储等资源提供给指定的 Worker 使用 |

Cloudflare 的代理模式可以让请求先经过它的网络，再访问源站；仅使用 DNS 解析并不意味着所有网站流量都经过代理。[Cloudflare DNS 与代理机制](https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/)

Workers 使用 V8 引擎及 isolate 执行环境运行代码，并由平台管理分布式执行。开发者主要编写处理请求的逻辑。[Workers 工作原理](https://developers.cloudflare.com/workers/reference/how-workers-works/)

### 2. 普通 KV：持久存储加上多层缓存

普通 KV 将数据写入中心存储，并在访问时利用区域、中心层及边缘缓存。**写入一次，并不会立即向全球每个边缘节点推送完整副本。** 已缓存的热点读取通常更快；冷读可能需要向上层或中心存储取数据。[KV 工作原理](https://developers.cloudflare.com/kv/concepts/how-kv-works/)

```text
访问者 → Worker → 附近可用的 KV 缓存
                         │
                         └── 未命中 → 上层缓存 / 中心存储
```

这种设计适合读多写少。代价是普通 KV 采用**最终一致性**：一次更新后，其他位置短时间内可能仍读到旧数据。官方说明传播可能需要约 60 秒或更久；不能把 60 秒当作严格的全局生效上限，也不要依赖写入地点一定立即读到新值。[KV 一致性说明](https://developers.cloudflare.com/kv/concepts/how-kv-works/#consistency)

> **一个常见现象：** 某处先读取不存在的 key 得到 `null`，随后你创建了这个 key，该处仍可能暂时返回 `null`。因为“没有这条数据”也可能被缓存。

---

## 四、如何创建 KV 并绑定到 Worker？

### 方法 A：通过 Cloudflare 控制台

1. 登录 Cloudflare，在账户中进入 **Workers KV**，创建一个 namespace，名称例如 `my-site-data`。
2. 进入目标 **Worker → Bindings → Add binding**，选择 **KV namespace**。
3. 在变量名处填写 `SITE_CONFIG`，选择刚创建的 `my-site-data`，保存并按界面提示部署绑定。
4. 返回这个 namespace 的 **KV Pairs** 页面，添加 key `site:title`，value 填 `我的知识库`。
5. 在 Worker 中通过 `env.SITE_CONFIG.get("site:title")` 读取。

不同界面版本可能把入口放在 Settings 下；要找的是 Worker 的绑定设置，而不是普通文本环境变量。[控制台创建与绑定流程](https://developers.cloudflare.com/kv/get-started/)

### 方法 B：通过 Wrangler 命令行

先准备 Node.js 与 Cloudflare 账户。新建 Worker 项目，选择基础 Worker 模板与 JavaScript；如果已有项目，直接进入它的目录：

```bash
npm create cloudflare@latest -- kv-demo
cd kv-demo
npx wrangler login
```

创建 namespace：

```bash
npx wrangler kv namespace create SITE_CONFIG
```

把命令返回的真实 namespace ID 配置到 `wrangler.jsonc` 的 `kv_namespaces` 中，结构见第一节。**只合并这一部分，保留项目已有的 `name`、`main`、`compatibility_date` 等字段。** 若工具已自动写入配置，就检查现有项，不要重复添加。

然后向远端 KV 写入并读取一条记录：

```bash
npx wrangler kv key put "site:title" "我的知识库" --binding=SITE_CONFIG --remote
npx wrangler kv key get "site:title" --binding=SITE_CONFIG --remote --text
```

`--binding` 选择配置里的绑定；`--remote` 指定远端数据；`--text` 将读取结果按文本显示。[Wrangler KV 命令](https://developers.cloudflare.com/workers/wrangler/commands/kv/)

> **本地与远端不是同一份数据。** `wrangler dev` 默认使用本地模拟 KV。你用 `--remote` 写入云端，并不意味着本地模拟也会有这条记录。需要在本地开发中使用远端 namespace 时，可在对应 binding 配置里添加 `"remote": true`；此时开发代码会实际访问远端数据。[本地 KV binding](https://developers.cloudflare.com/kv/concepts/kv-bindings/#use-kv-bindings-when-developing-locally)

Windows PowerShell 若拦截 `npm.ps1` 或 `npx.ps1`，可分别使用 `npm.cmd`、`npx.cmd` 执行这些命令。

---

## 五、一个完整应用：读取网站标题

将下面代码放入项目配置所指向的 JavaScript 入口，例如 `src/index.js`：

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/title") {
      return new Response("请访问 /title 查看网站标题", { status: 404 });
    }

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET" }
      });
    }

    const title = await env.SITE_CONFIG.get("site:title");

    if (title === null) {
      return Response.json({ error: "当前 KV 中未读到 site:title" }, {
        status: 404
      });
    }

    return Response.json({ title });
  }
};
```

用 `npx wrangler dev` 本地运行。若采用默认本地 KV，可先执行下面这条命令添加本地示例，再访问终端显示地址下的 `/title`：

```bash
npx wrangler kv key put "site:title" "我的本地知识库" --binding=SITE_CONFIG --local
```

准备发布时运行：

```bash
npx wrangler deploy
```

访问部署输出的地址并追加 `/title`。当远端 KV 读取到前面写入的值时，响应类似：

```json
{
  "title": "我的知识库"
}
```

这条请求的链路是：**浏览器发请求 → Worker 运行代码 → 经 binding 读取 KV → Worker 返回结果。** 单键 `get()` 返回 Promise；key 不存在时得到 `null`，因此示例使用 `await` 并检查 `null`。[读取 API](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)

### 其他常用操作

以下语句供拥有 `env` 参数的 Worker 函数使用，不是直接放进浏览器控制台的命令：

```javascript
// 1. 写入或覆盖一条字符串记录
await env.SITE_CONFIG.put("site:theme", "dark");

// 2. JSON 先序列化保存，读取时指定 json 类型自动解析
await env.SITE_CONFIG.put("site:settings", JSON.stringify({ theme: "dark" }));
const settings = await env.SITE_CONFIG.get("site:settings", "json");

// 3. 让这条记录在 300 秒后过期
await env.SITE_CONFIG.put("cache:message", "示例缓存内容", {
  expirationTtl: 300
});

// 4. 删除指定记录
await env.SITE_CONFIG.delete("site:theme");
```

`put()` 会新建或覆盖对应 key；`expirationTtl` 控制数据何时过期，最小值为 60 秒。它与读取时控制缓存保留时间的 `cacheTtl` 含义不同。[写入与过期参数](https://developers.cloudflare.com/kv/api/write-key-value-pairs/)、[删除 API](https://developers.cloudflare.com/kv/api/delete-key-value-pairs/)

---

## 六、KV 的作用与应用场景

对你的网站而言，KV 的作用是**把需要持久保存、按 key 读取的数据放在程序代码之外**。例如修改网站标题时，可以更新 KV 中的值，无需仅为这个标题重新修改并部署 Worker 代码。它也能缓存计算或外部接口的结果，减少重复获取。[使用 KV 缓存数据](https://developers.cloudflare.com/kv/examples/cache-data-with-workers-kv/)

| 场景 | 示例 key → value | 使用条件 |
| --- | --- | --- |
| 网站配置 | `site:title` → `我的知识库` | 能接受配置短暂延迟生效 |
| 用户显示偏好 | `user:42:theme` → `dark` | 无需每次修改都立刻全球可见 |
| 短链接映射 | `short:abc` → 目标 URL | 主要读取；更改和撤销可接受传播延迟 |
| 功能开关 / A/B 配置 | `feature:new-ui` → `enabled` | 不用于必须立即关闭的安全控制 |
| 路由映射 | `route:docs` → 目标服务地址 | 不是要求瞬时切换的协调系统 |
| 外部 API 结果缓存 | `weather:city-id` → JSON | 数据允许陈旧，并设置合适的过期策略 |

### 不宜直接交给普通 KV 的工作

- **库存扣减、账户余额与精确计数器：** `get()` 后再 `put()` 不是一个原子事务；多个请求可能读到相同旧值并相互覆盖。
- **需要立即生效的权限撤销：** 某个位置的缓存可能仍保留旧数据。
- **高频更新同一个 key：** 当前普通 KV 对同一个 key 的写入限制是每秒 1 次，不能把它当作同键高频写入的 Redis 替代品。[并发写入说明](https://developers.cloudflare.com/kv/api/write-key-value-pairs/#concurrent-writes-to-the-same-key)、[KV 限制](https://developers.cloudflare.com/kv/platform/limits/)

需要协调状态和更强一致性时，可评估 **Durable Objects**；需要关系型表和 SQL 查询时，可评估 **D1**；图片、视频、备份等文件存储通常评估 **R2**。[Cloudflare 存储产品选择](https://developers.cloudflare.com/workers/platform/storage-options/)

---

## 七、排查“明明建了 KV，为什么读不到？”

| 现象 | 优先检查 |
| --- | --- |
| `env.SITE_CONFIG` 是 `undefined` | binding 是否存在、是否部署、名称及大小写是否对应 |
| `.get()` 返回 `null` | key 是否存在、ID 是否指向目标空间、本地和远端是否混用 |
| 刚改完还读到旧值 | KV 缓存及最终一致性；不要据此立即认定绑定失效 |
| 测试数据出现在正式环境 | 不同环境是否误绑定到了同一个 namespace ID |
| 改了 namespace 名称却没改变读取内容 | 名称只是展示标识，实际绑定仍由 ID 确定 |

普通 KV 当前单个 key 最大 512 字节，单个 value 最大 25 MiB；实际使用还受套餐读写配额等约束。[当前限制与 Instant 说明](https://developers.cloudflare.com/kv/platform/limits/)

---

## 八、速查对照：名称、Binding 与数据如何对应

当你修改不同环节的名称或 ID 时，配置与代码的联动关系如下：

| 环境示例 | Namespace 展示名 | 配置中的 `id` | 配置中的 `binding` | Worker 读取代码 | 读取 `"site:title"` 的结果 |
| --- | --- | --- | --- | --- | --- |
| **生产环境** | `网站设置` | `<生产命名空间ID>` | `SITE_CONFIG` | `await env.SITE_CONFIG.get("site:title")` | `"我的知识库"` |
| **测试环境** | `测试设置` | `<测试命名空间ID>` | `SITE_CONFIG` | `await env.SITE_CONFIG.get("site:title")` | `"知识库测试站"` |
| **自定义绑定名** | `网站设置` | `<生产命名空间ID>` | `kvname` | `await env.kvname.get("site:title")` | `"我的知识库"` |

- **改 `binding` 名称**：只会改变 Worker 代码里 `env.<binding>` 的变量名，不改变指向的数据库。
- **改 `id`（切换绑定目标）**：Worker 代码不用改，但读取到的数据会切换到新 ID 对应的 KV 空间。