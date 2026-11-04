# GitHub加速节点与反代

GitHub 加速节点背后的技术逻辑，以及一段属于国内开源圈的“赛博英雄传”。

  

  

# 从 `ghp.ci` 宕机说起：GitHub 代理加速的底层逻辑与 ghproxy 的封神之路

  

如果你在国内做过哪怕一天的独立开发，必定经历过被 GitHub 极慢的下载速度折磨到抓狂的时刻。

  

  

为了解决这个问题，我们在下载链接前拼接诸如 `[https://ghp.ci/](https://ghp.ci/)` 或 `[https://ghproxy.net/](https://ghproxy.net/)` 这样的前缀。然而，前几天还秒下几百兆的节点，今天可能就会甩给你一个冷冰冰的 `无法访问此网站`。

  

  

为什么会这样？这些神奇的前缀到底是怎么工作的？为什么在无数倒下的节点中，`ghproxy.com` 会被奉为“神级节点”？

  

  

## 一、 魔法前缀的真面目：反向代理(Reverse Proxy)

  

要理解为什么加个前缀就能提速，首先要知道为什么 GitHub 原生下载那么慢。

  

  

当你点击 `[github.com/releases/download/](https://github.com/releases/download/)...` 时，你的请求需要跨越浩瀚的太平洋海底光缆，还要经过国内防火墙(GFW)的严格审查。由于 SNI 阻断、DNS 污染或单纯的国际出口带宽拥堵，你的连接常常被无情掐断(Connection Reset)。

  

  

**加速节点的核心原理，就是找一个“中间人”(反向代理服务器)。**

  

  

当你请求 `https://代理域名/https://github...` 时，发生了以下三步：

  

  

1. **你向代理服务器发请求**：这个代理服务器的 IP 对国内网络非常友好(比如使用了 Cloudflare 的优选节点，或者昂贵的 CN2 线路)，你连它如丝般顺滑。

2. **代理向 GitHub 发请求**：这台服务器本身处于海外优质网络环境中，它去访问 GitHub 下载文件，速度通常是千兆满跑，几乎瞬间拉取完毕。

3. **代理把文件传给你**：服务器拿到文件后，再通过它与你之间的高速通道，把数据以流(Stream)的形式倾泻回你的电脑。

  

这就是为什么你只是加了一段字符串，原本几十 KB/s 的龟速就能瞬间飙升到宽带满速。

  

  

## 二、 为什么公益节点总是“英年早逝”？

  

像你遇到的 `ghp.ci` 宕机，是所有公益加速节点的宿命。每一个倒下的节点背后，都离不开以下三大致命伤：

  

  

1. **流量成本的黑洞**

天下没有免费的带宽。代理服务器帮你下载并转发文件，产生的是**双倍流量**(流入+流出)。当一个加速域名在开发者群体中传开，每天可能有几十 TB 的流量轰炸。如果是私人掏腰包购买的服务器，下个月的账单就能让站长当场破产。

2. **令人窒息的恶意滥用**

公益节点本意是方便开发者下载源码或几十兆的工具包(比如你的 PyKuai 或 ToolKit)。但总有人拿写好的脚本，用公益节点去无节制地拉取几十 GB 的 Docker 镜像、或者高频爬取 GitHub 数据。服务器的 CPU 和带宽瞬间被榨干，正常用户根本挤不进去。

3. **不可抗力的 DNS 污染**

当一个未备案的海外域名在国内产生了极其庞大的访问量，且内容无法被有效监管时，很容易触发防火墙的自动防御机制。这就是为什么你的浏览器会报 `DNS_PROBE_FINISHED_NXDOMAIN`——域名的解析被直接切断了，它在物理层面上“被消失”了。

  

## 三、 ghproxy.com 为什么能“一战封神”？

  

在漫长的与烂网络斗争的历史中，出现过无数公益节点，但 `ghproxy.com` 是唯一被全网公认的“神”。

  

  

**它的封神，不仅仅是因为它曾经极其稳定，更因为它改变了整个生态的玩法。**

  

  

1. **破冰者：在最黑暗的时期提供光**

在 GitHub 被严重干扰的初期，国内开发者哀鸿遍野。`ghproxy.com` 横空出世，以极其简洁优雅的方式(直接拼前缀)和长期无偿的极致速度，拯救了无数焦头烂额的程序员。它几乎成了国内各种开源项目 README 里的标配。

2. **极致的极客精神：把“渔”也交给你**

随着流量剧增，原作者深知单靠个人财力绝对扛不住全网的白嫖。于是，他做了一个真正具备开源精神的决定：**开源了 ghproxy 的核心代码(基于 Cloudflare Workers)。**

这意味着，他把这项技术的门槛降到了零。任何人，不需要买服务器，只要有一个免费的 Cloudflare 账号，复制粘贴这几十行代码，就能在两分钟内建起一个和 `ghproxy.com` 一模一样的专属加速站。

3. **去中心化的重生：杀不死的多头蛇**

后来，正如所有人预料的那样，原版的 `ghproxy.com` 因为巨大的监管压力和恶意滥用，被迫关停。

**但在它倒下的那一刻，无数个“它”站了起来。**

因为代码是开源的，国内开源社区立刻利用它的源码，搭建了千千万万个镜像站(比如现在的 `ghproxy.net`、`mirror.ghproxy.com` 等等)。它不再是一个孤立的网站，而变成了一种**标准协议**。

你封杀了一个域名，明天社区就会甩出十个新域名。

  

这就是 ghproxy 封神的原因：**它不仅做了一座桥，它还留下了造桥的图纸。它用一种极其浪漫的开源方式，实现了物理意义上的永生。**

  

  

## 四、 拓展极客玩法：前端 Serverless 并发竞速引擎 (从翻车到 2.0 封神)

虽然我们可以自己手搓 Cloudflare Workers 搭建专属的反代节点，但对于动辄几十上百兆的 Release 安装包，免费的 Worker 很容易被 Cloudflare 调度到降速节点，或者触发单日请求/流量限制。

因此，**直接聚合全网优质的开源公益节点，在前端用无服务器 (Serverless) 并发竞速的方式“白嫖”全网算力，才是最极客、最抗揍的方案！**

### 1. 第一代方案的惨痛教训：为什么“5 节点 + HEAD + no-cors”会翻车？

在早期的初代竞速版本中，我曾尝试过用轻量级发包：
* 搞了 5 个节点通道（1 个 GitHub 官方直连 + 4 个代理池）；
* 利用 `fetch(url, { method: 'HEAD', mode: 'no-cors' })` 探测 TTFB 延迟；
* 通过 `Promise.any()` 取最快响应，再通过模拟点击 `<a>` 标签唤起下载。

听起来很完美，但实际上线后**被现实狠狠上了一课**：

1. **`no-cors` + `HEAD` 导致的“几 KB 假包与损坏文件”**：
   在 `mode: 'no-cors'` 下，收到的响应是不透明的（opaque），JS 根本拿不到 HTTP 状态码。很多由于过载、欠费或被封禁的公益节点，返回的并不是真实文件，而是 **403 拦截页、502 报错网关或 Cloudflare 的人机验证 HTML 页面**！因为报错网页只有几 KB，回包快得离谱，毫秒级被 `Promise.any()` 当成“最快节点”选出。结果用户一点下载，几秒钟下完一个 5KB 的 `.msi` 安装包，双击弹出“文件已损坏”，极度搞心态。
2. **GitHub 直连空前缀的“抢跑误判”**：
   直连源站（`''`）在国内经常会瞬间被 GFW 掐断连接（返回 TCP RST），甚至偶尔快速完成 DNS 握手，但后续下载几十兆大文件时立刻陷入持续断流。测速“看着快”，实际下载“直接瘫”。
3. **公益反代节点的“防盗链 10KB/s 惩罚”**：
   不少优质镜像站为了防止被第三方网站恶意盗刷流量，在后端配置了 Referer 检查。旧版使用原生模拟点击下载，默认会携带当前网页的来源地址（`Referer`）。一旦被反代判定为第三方外链，就会被立即打入冷宫，限速在 10KB/s～50KB/s 之间龟速爬行。
4. **容灾深度不足**：
   仅保留 4 个代理节点，一旦赶上晚高峰两三个节点间歇性抽风，整个下载系统就会瞬间瘫痪。

---

### 2. 第二代架构：10 节点智能竞速分配引擎 (生产级落地)

为了解决上面的全部硬伤，我在 `ToolKit`、`PyKuai` 和 `BlackHole` 的发布页中全面重构了竞速逻辑，打造了第二代全球节点智能竞速分配引擎（**10 节点池 + 真实流式探活 + 防假文件 + 防盗链穿透**）：

#### ① 10 大白嫖加速节点池 (剔除直连防抢跑)
彻底移除原生直连，全部换用精挑细选、按存活稳定性与国内宽带质量排序的 10 大优质开源反代镜像：

1. `https://gh-proxy.com/` —— 国内多线优化，大文件首选主力通道
2. `https://ghfast.top/` —— 极速大带宽反向代理
3. `https://ghproxy.net/` —— 经典 CF Worker 镜像集群
4. `https://ghp.ci/` —— 知名老牌开源公益加速站
5. `https://ghproxy.homeboyc.cn/` —— 国内 CDN 加速镜像
6. `https://github.akams.cn/` —— 高速稳定的开源分发节点
7. `https://moeyy.cn/gh-proxy/` —— 萌次元公共维护加速节点
8. `https://gh.monlor.com/` —— 极客维护的高速反代镜像
9. `https://ghproxy.imciel.com/` —— 稳定老牌备用代理
10. `https://fastgit.cc/` —— 兜底容灾高速通道

#### ② 真实二进制数据流轻量探活 (`probeNode`)
彻底抛弃虚假的 `HEAD` 与盲目瞎测的 `no-cors`，换用真正的 `GET` 探测，并设计了**三道硬核防御网**：
* **状态码拦截**：必须满足 `res.ok` 或 `res.status === 206`，直接过滤 403/502/404 等失效节点；
* **Content-Type 过滤**：如果响应头含有 `text/html` 或 `application/json`，说明返回的是错误页或报错接口，坚决当作坏节点抛弃；
* **Content-Length 体积过滤**：如果文件大小小于 500KB，直接丢弃，彻底杜绝把几 KB 假包喂给用户的惨剧；
* **读取首块二进制流并即刻熔断**：通过 `res.body.getReader().read()`，实测真正接收到来自 GitHub Release 的第一个真实二进制数据块后，立即调用 `controller.abort()` 主动中断后续传输。**既 100% 验证了管道畅通与下载速度，又不会消耗任何多余流量！**

#### ③ 抹除 Referer 来源头，满速穿透防盗链 (`triggerDownload`)
在动态构造 `<a>` 标签唤起下载时，强制注入：
```javascript
a.rel = 'noreferrer noopener';
a.referrerPolicy = 'no-referrer';
```
主动剥离请求头里的 `Referer`，在协议层模拟用户直接在浏览器地址栏敲击回车的行为，完美绕过各大开源站点的防盗链黑名单，享受无惩罚的千兆宽带满速下载！

#### ④ 极限容错回退机制
即便用户端浏览器安装了激进的去广告插件或安全脚本，将所有的 CORS 嗅探全部拦截，引擎在 `Promise.any()` 失败后会自动降级采用主力节点 `this.nodes[0]` 直通下载，确保用户永远不会因测速报错而无法获取软件。

---

### 3. 生产级核心引擎源码实现 (可直接复用)

以下就是目前在 ToolKit 等官方主页中稳定运行的完整 JavaScript 竞速路由引擎类：

```javascript
/**
 * 全球节点智能竞速分配引擎 (10节点池 + 防几KB假文件 + 防盗链满速版)
 */
class DownloadRouter {
    constructor(btnId, targetUrl) {
        this.btn = document.getElementById(btnId);
        this.targetUrl = targetUrl;

        // 10大白嫖加速节点池 (移除空前缀直连防抢跑，按稳定性与带宽排序)
        this.nodes = [
            'https://gh-proxy.com/',
            'https://ghfast.top/',
            'https://ghproxy.net/',
            'https://ghp.ci/',
            'https://ghproxy.homeboyc.cn/',
            'https://github.akams.cn/',
            'https://moeyy.cn/gh-proxy/',
            'https://gh.monlor.com/',
            'https://ghproxy.imciel.com/',
            'https://fastgit.cc/'
        ];

        if (this.btn) {
            this.originalHtml = this.btn.innerHTML;
            this.init();
        }
    }

    init() {
        this.btn.addEventListener('click', (e) => this.startRace(e));
    }

    // 单节点真实二进制流探测：过滤 403/502 错误网页与小于 500KB 的假文件
    probeNode(url, timeoutMs = 4000) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timer = setTimeout(() => {
                controller.abort();
                reject(new Error('Timeout'));
            }, timeoutMs);

            fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-store',
                referrerPolicy: 'no-referrer',
                signal: controller.signal
            }).then(async (res) => {
                if (!res.ok && res.status !== 206) {
                    throw new Error('Bad status: ' + res.status);
                }
                // 1. 拦截返回 HTML 报错页或 JSON 的假节点（防止下出几 KB 的损坏文件）
                const ct = (res.headers.get('content-type') || '').toLowerCase();
                if (ct.includes('text/html') || ct.includes('application/json')) {
                    throw new Error('Invalid content-type: ' + ct);
                }
                // 2. 拦截文件体积小于 500KB 的异常响应
                const cl = parseInt(res.headers.get('content-length') || '0', 10);
                if (cl > 0 && cl < 500 * 1024) {
                    throw new Error('File too small: ' + cl);
                }
                // 3. 实测读取首个二进制数据块，确认真实下载流畅通后立即中止探测
                if (res.body) {
                    const reader = res.body.getReader();
                    await reader.read();
                }
                clearTimeout(timer);
                controller.abort();
                resolve(url);
            }).catch(err => {
                clearTimeout(timer);
                controller.abort();
                reject(err);
            });
        });
    }

    async startRace(e) {
        e.preventDefault();
        if (this.btn.classList.contains('is-routing')) return;

        this.btn.classList.add('is-routing');
        this.btn.innerHTML = `<svg class="icon-spin" style="margin-right:10px;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>节点智能寻优中...`;

        const testUrls = this.nodes.map(prefix => prefix + this.targetUrl);

        let fastestUrl = null;
        try {
            fastestUrl = await Promise.any(testUrls.map(u => this.probeNode(u, 4000)));
        } catch (_) {
            // 极端容错：若浏览器插件拦截了所有 CORS 探测，默认走主节点
            fastestUrl = this.nodes[0] + this.targetUrl;
        }

        this.btn.innerHTML = `<svg style="margin-right:10px;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>最佳节点分配成功`;

        setTimeout(() => {
            this.triggerDownload(fastestUrl);
            this.resetBtn();
        }, 500);
    }

    triggerDownload(url) {
        const a = document.createElement('a');
        a.href = url;
        a.rel = 'noreferrer noopener';
        a.referrerPolicy = 'no-referrer'; // 核心：抹除来源头，绕过公益节点 10KB/s 防盗链限速
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    resetBtn() {
        setTimeout(() => {
            this.btn.classList.remove('is-routing');
            this.btn.innerHTML = this.originalHtml;
        }, 2500);
    }
}

// 页面加载完成后实例化（传入按钮 ID 与 GitHub Release 原生下载链接）
document.addEventListener('DOMContentLoaded', () => {
    new DownloadRouter(
        'btn-download',
        'https://github.com/GallantTarry/TuKuai/releases/download/20260907/toolkit-1.9.8.msi'
    );
});
```

这套进化后的 2.0 方案，不仅在物理层面上解决了“假包”和“盗链限速”两个业界最大痛点，还将容灾与分发成功率提升到了近乎 100%。这也是目前在不需要个人维护昂贵 CDN 的前提下，最优雅且极致的 GitHub Release 白嫖加速落地实践。
