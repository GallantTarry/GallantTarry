# DHCP分配的IPv4开头不一样是为什么？


**DHCP（动态主机配置协议）本身只是一个“自动发号器”，它并不强制规定必须分配 `192` 开头的地址——网络管理员在路由器或核心交换机的“地址池（Address Pool）”里配置了什么网段，DHCP 就会给接入的设备下发什么网段。**

  

平时在家里或小型办公室看到的几乎都是 `192.168.x.x`，是因为家用路由器出厂默认采用了国际标准（RFC 1918）中的 **C 类私有地址**。而当你看到 DHCP 分配了 **`20` 开头**（或包含 `20`）的 IP 地址时，通常源于以下 **4 种真实场景**：

  

## 一、 为什么常见的是 `192`，而你会遇到 `20`？

### 1. 大型企业 / 国企内网的“自定义征用”（最常见原因）

在国际互联网规范（RFC 1918）中，专门划拨给局域网内部免费使用、不会在公网上路由的**标准私有 IPv4 地址**只有三大块：

  

|**私网级别**|**标准地址范围**|**CIDR 掩码表示**|**典型应用环境**|
|---|---|---|---|
|**A 类私网**|`10.0.0.0` – `10.255.255.255`|`10.0.0.0/8`|大型企业、政务内网、云厂商 VPC（可容纳 1677 万台主机）|
|**B 类私网**|`172.16.0.0` – `172.31.255.255`|`172.16.0.0/12`|中型企业、高校校园网、Docker / WSL2 虚拟网桥、手机热点|
|**C 类私网**|`192.168.0.0` – `192.168.255.255`|`192.168.0.0/16`|家用路由器、小型办公室局域网（单个子网常容纳 254 台主机）|

**那为什么内网会出现 `20.x.x.x`？**

在很多大型国企（如电力、电网、能源院所）、金融机构或高校的内部办公网中，内网与互联网要么物理隔离，要么在总出口部署了严格的 NAT（网络地址转换）和防火墙。

为了方便对不同楼宇、事业部或业务专网进行直观编号，网管往往会打破 RFC 1918 的限制，在核心三层交换机的 DHCP 服务里**人为划分出 `10.x.x.x`（一区/一部）、`20.x.x.x`（二区/专网）、`30.x.x.x`（三区）**。只要数据包不出单位大门（或者出大门时统一被防火墙转换成单位的公网 IP），在内网里使用 `20.x.x.x` 完全可以正常通信。

  

> **技术冷知识（征用公网段的副作用）：** 在真实的国际互联网上，`20.0.0.0/8` 其实是合法的**公网 IP 段**（目前绝大部分归属于 **Microsoft Azure 微软云**）。如果单位内网私自把 `20.x.x.x` 当作局域网 DHCP 下发，且这台电脑同时能上外网，那么当你想访问某台恰好是 `20.x.x.x` 的微软海外云服务器时，电脑会误以为目标在你们单位内网，导致无法访问该公网服务。
> 
>   

### 2. VPN 客户端、虚拟专网或代理工具的虚拟网卡

如果你在电脑上安装了企业远程办公 VPN（如深信服 EasyConnect、aTrust、OpenVPN）、异地组网工具，或者开启了代理软件的 **TUN 虚拟网卡模式**，软件会在系统中生成一张虚拟网卡，并由内置的虚拟 DHCP 服务下发一个 IP。

  

- 为了**防止与你本地真实的 `192.168.x.x` 或 `10.x.x.x` 局域网发生网段冲突**，许多企业 VPN 管理员或虚拟组网软件会专门将虚拟地址池设为 `20.x.x.x`、`26.x.x.x` 或 `198.18.x.x`。
    
      
    

### 3. 云服务器或专线直接下发了真实公网 IP

如果你的运行环境不是普通家庭宽带，而是以下场景，DHCP 分配的可能就是货真价实的**公网 IP**：

  

- **微软云（Azure）虚拟机或特定云主机**：由于微软持有整个 `20.0.0.0/8` 公网段，部分云环境或跨国企业专线会直接把 `20.x.x.x` 段下发给实例网卡。
    
      
    
- **以 `202.` / `203.` / `218.` 开头的公网地址**：中国电信、联通和教育网早期分到的大量真实公网 IPv4 地址以 `202.x.x.x`（如南京电信/教育网常见网段）或 `203.x.x.x` 开头。如果光猫处于桥接模式或接入了高校/政企固定公网端口，DHCP 下发的就是此类地址。
    
      
    

### 4. 容易混淆的另外两种“20”地址

在排查网络时，还可以核对一下是否属于以下两种自带“20”的标准地址：

  

- **第二节是 20（`172.20.x.x`）**：这是纯正的 **B 类标准私网地址**（处于 `172.16.0.0` – `172.31.255.255` 范围内）。例如**苹果 iPhone 开启个人热点**时，DHCP 固定给电脑分配 `172.20.10.x`；Windows 上的 **WSL2 / Hyper-V 虚拟交换机**也经常自动分配 `172.20.x.x`。
    
      
    
- **带冒号的 `2001:` 或 `240e:` 开头（IPv6 地址）**：如果看到的是类似 `240e:3a1:...` 或 `2001:da8:...` 的地址，这是路由器通过 DHCPv6 下发的**全球公网 IPv6 地址**。国际标准规定全球单播 IPv6 地址统一以二进制 `001` 开头，换算成十六进制正好全部以 **`2`** 开头（如教育网 `2001:`、中国电信 `240e:`、中国联通 `2408:`、中国移动 `2409:`）。
    
      
    

## 二、 三步快速查清这个 `20` 开头的 IP 是谁发的

按下 `Win + R` 输入 `cmd` 打开命令提示符，执行以下命令即可瞬间破案：

  


```powershell
ipconfig /all
```

在输出的信息中找到带有该 `20` 开头 IP 的那张网卡，重点看三行：

  

1. **描述 (Description)**：如果是 `Realtek PCIe GbE` 或 `Intel Wi-Fi`，说明是物理网线或无线路由器发的；如果是 `TAP-Windows Adapter`、`Sangfor`、`Wintun`、`Hyper-V Virtual Ethernet`，说明是 VPN、代理或虚拟机生成的虚拟网卡。
    
      
    
2. **DHCP 服务器 (DHCP Server)**：这里显示的就是给你发号的“源头设备” IP（通常就是你的默认网关，如 `20.x.x.1`）。
    
      
    
3. **默认网关 (Default Gateway)**：如果该网卡有默认网关，可以在命令行输入 `arp -a` 查看该网关 IP 对应的物理 MAC 地址，前三位厂商代码就能暴露它是华为/华三企业级交换机，还是普通家用路由器。
    
      
    

## 三、 交互式工具：IPv4 网段属性与 DHCP 来源鉴别器

在下方交互面板中，你可以直接点击常见的预设 IP（如 `192.168.1.100`、`20.10.1.50`、`172.20.10.2`、`100.64.1.1`），或拖动滑块调整 IP 的四个字节，实时查看该地址在 RFC 标准中的真实身份、DHCP 下发原因及路由行为：



<div id="ipv4-dhcp-widget" class="idw-root">
<style>
.idw-root {
  --idw-bg: #0f172a;
  --idw-card: rgba(30, 41, 59, 0.75);
  --idw-border: rgba(148, 163, 184, 0.18);
  --idw-text: #f8fafc;
  --idw-muted: #94a3b8;
  --idw-accent: #38bdf8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 65%, #090d16 100%);
  color: var(--idw-text);
  border: 1px solid var(--idw-border);
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}
.idw-root * {
  box-sizing: border-box;
}
.idw-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--idw-border);
}
.idw-title {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.idw-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
  transition: all 0.25s ease;
}
.idw-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}
.idw-preset-btn {
  background: var(--idw-card);
  border: 1px solid var(--idw-border);
  border-radius: 10px;
  padding: 8px 10px;
  color: var(--idw-text);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}
.idw-preset-btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}
.idw-preset-btn.active {
  background: rgba(56, 189, 248, 0.14);
  border-color: var(--idw-accent);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}
.idw-p-ip {
  font-size: 13px;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.idw-p-tag {
  font-size: 11px;
  color: var(--idw-muted);
}
.idw-ctrl-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--idw-border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.idw-ip-readout {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.idw-octet-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 8px;
  padding: 6px 10px;
  text-align: center;
  min-width: 68px;
}
.idw-octet-num {
  font-size: 20px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  color: #38bdf8;
  line-height: 1.1;
}
.idw-octet-bin {
  font-size: 9px;
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  margin-top: 3px;
  letter-spacing: 0.5px;
}
.idw-dot-sep {
  font-size: 20px;
  font-weight: 800;
  color: #64748b;
}
.idw-sliders {
  flex: 1 1 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.idw-slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.idw-slider-lbl {
  min-width: 115px;
  color: #cbd5e1;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.idw-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.idw-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #38bdf8;
  border: 2px solid #fff;
  cursor: pointer;
}
.idw-topo-wrap {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid var(--idw-border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
}
.idw-topo-title {
  font-size: 12px;
  color: var(--idw-muted);
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.idw-svg {
  width: 100%;
  height: 145px;
  display: block;
}
@keyframes idwDashFlow {
  to { stroke-dashoffset: -24; }
}
.idw-flow-line {
  animation: idwDashFlow 0.9s linear infinite;
}
.idw-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 10px;
}
.idw-m-card {
  background: var(--idw-card);
  border: 1px solid var(--idw-border);
  border-radius: 10px;
  padding: 11px 14px;
  backdrop-filter: blur(8px);
}
.idw-m-lbl {
  font-size: 11px;
  color: var(--idw-muted);
  margin-bottom: 4px;
}
.idw-m-val {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}
.idw-m-desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.45;
  margin-top: 4px;
}
</style>
<div class="idw-header">
  <div class="idw-title">
    <span>🌐 IPv4 地址属性与 DHCP 拓扑诊断器</span>
  </div>
  <span class="idw-badge" id="idw-rfc-badge">IANA Public (20.0.0.0/8)</span>
</div>
<div class="idw-presets" id="idw-presets"></div>
<div class="idw-ctrl-box">
  <div class="idw-ip-readout">
    <div class="idw-octet-card">
      <div class="idw-octet-num" id="idw-o1-num">20</div>
      <div class="idw-octet-bin" id="idw-o1-bin">00010100</div>
    </div>
    <span class="idw-dot-sep">.</span>
    <div class="idw-octet-card">
      <div class="idw-octet-num" id="idw-o2-num">10</div>
      <div class="idw-octet-bin" id="idw-o2-bin">00001010</div>
    </div>
    <span class="idw-dot-sep">.</span>
    <div class="idw-octet-card">
      <div class="idw-octet-num" id="idw-o3-num">1</div>
      <div class="idw-octet-bin" id="idw-o3-bin">00000001</div>
    </div>
    <span class="idw-dot-sep">.</span>
    <div class="idw-octet-card">
      <div class="idw-octet-num" id="idw-o4-num">50</div>
      <div class="idw-octet-bin" id="idw-o4-bin">00110010</div>
    </div>
  </div>
  <div class="idw-sliders">
    <div class="idw-slider-row">
      <span class="idw-slider-lbl">第一段 (Octet 1): <b id="idw-s1-val" style="color:#38bdf8;">20</b></span>
      <input type="range" class="idw-slider" id="idw-s1" min="1" max="223" step="1" value="20" />
    </div>
    <div class="idw-slider-row">
      <span class="idw-slider-lbl">第二段 (Octet 2): <b id="idw-s2-val" style="color:#38bdf8;">10</b></span>
      <input type="range" class="idw-slider" id="idw-s2" min="0" max="255" step="1" value="10" />
    </div>
  </div>
</div>
<div class="idw-topo-wrap">
  <div class="idw-topo-title">
    <span>📡 实时 DHCP 下发路径与公网出口路由仿真</span>
    <span id="idw-topo-status" style="font-family:monospace;color:#f59e0b;">⚠️ 内网征用公网段 · 存在同段公网遮蔽风险</span>
  </div>
  <svg class="idw-svg" id="idw-svg" viewBox="0 0 720 145" preserveAspectRatio="xMidYMid meet"></svg>
</div>
<div class="idw-metrics">
  <div class="idw-m-card">
    <div class="idw-m-lbl">网段真实身份判定</div>
    <div class="idw-m-val" id="idw-m-cat" style="color:#f59e0b;">公网段被政企内网/VPN私自征用</div>
    <div class="idw-m-desc" id="idw-m-rfc">国际登记归属 Microsoft Azure 公网段，非 RFC 1918 标准私网。</div>
  </div>
  <div class="idw-m-card">
    <div class="idw-m-lbl">典型 DHCP 下发源头</div>
    <div class="idw-m-val" id="idw-m-src" style="color:#38bdf8;">单位核心交换机 / VPN 虚拟网卡</div>
    <div class="idw-m-desc" id="idw-m-src-desc">国企/院所常按 10/20/30 划分部门专网，或由 EasyConnect/TUN 虚拟网卡分配。</div>
  </div>
  <div class="idw-m-card">
    <div class="idw-m-lbl">公网路由与冲突诊断</div>
    <div class="idw-m-val" id="idw-m-risk" style="color:#f43f5e;">存在外网路由遮蔽 (Route Hijack)</div>
    <div class="idw-m-desc" id="idw-m-advice">内网通信正常，但访问真实 20.x.x.x 的微软云海外服务时会被误判为内网而无法连接。</div>
  </div>
</div>
<script>
(function() {
  function initIDW() {
    var root = document.getElementById("ipv4-dhcp-widget");
    if (!root || root.dataset.idwReady === "1") return;
    root.dataset.idwReady = "1";
    var presets = [
      { id: "p20", ip: [20, 10, 1, 50], tag: "政企内网/VPN征用", dot: "#f59e0b" },
      { id: "p192", ip: [192, 168, 1, 100], tag: "C类家用默认私网", dot: "#38bdf8" },
      { id: "p172", ip: [172, 20, 10, 2], tag: "B类私网/热点/WSL", dot: "#06b6d4" },
      { id: "p10", ip: [10, 20, 0, 15], tag: "A类大型企业内网", dot: "#10b981" },
      { id: "p100", ip: [100, 64, 12, 8], tag: "运营商大内网CGNAT", dot: "#a855f7" },
      { id: "p169", ip: [169, 254, 10, 5], tag: "DHCP失败自封地址", dot: "#ef4444" }
    ];
    var state = { o1: 20, o2: 10, o3: 1, o4: 50, activePreset: "p20" };
    var presetWrap = root.querySelector("#idw-presets");
    var s1 = root.querySelector("#idw-s1");
    var s2 = root.querySelector("#idw-s2");
    var s1Val = root.querySelector("#idw-s1-val");
    var s2Val = root.querySelector("#idw-s2-val");
    var o1Num = root.querySelector("#idw-o1-num");
    var o2Num = root.querySelector("#idw-o2-num");
    var o3Num = root.querySelector("#idw-o3-num");
    var o4Num = root.querySelector("#idw-o4-num");
    var o1Bin = root.querySelector("#idw-o1-bin");
    var o2Bin = root.querySelector("#idw-o2-bin");
    var o3Bin = root.querySelector("#idw-o3-bin");
    var o4Bin = root.querySelector("#idw-o4-bin");
    var badge = root.querySelector("#idw-rfc-badge");
    var topoStatus = root.querySelector("#idw-topo-status");
    var svg = root.querySelector("#idw-svg");
    var mCat = root.querySelector("#idw-m-cat");
    var mRfc = root.querySelector("#idw-m-rfc");
    var mSrc = root.querySelector("#idw-m-src");
    var mSrcDesc = root.querySelector("#idw-m-src-desc");
    var mRisk = root.querySelector("#idw-m-risk");
    var mAdvice = root.querySelector("#idw-m-advice");
    function toBin(n) {
      var s = (n >>> 0).toString(2);
      while (s.length < 8) s = "0" + s;
      return s;
    }
    function classify(o1, o2) {
      if (o1 === 10) {
        return {
          badge: "RFC 1918 · Class A Private (10.0.0.0/8)",
          color: "#10b981",
          cat: "A 类标准私有地址 (RFC 1918)",
          rfc: "专供大型局域网内部使用，单网段可容纳约 1,677 万台终端。",
          src: "大型政企核心交换机 / 云厂商 VPC",
          srcDesc: "大型企业总部、政务内网及阿里云/腾讯云 VPC 最主流的默认内网段。",
          risk: "安全无冲突 · 经 NAT 正常出网",
          riskColor: "#10b981",
          advice: "完全符合国际标准，数据包在出口防火墙自动转换为公网 IP 访问互联网。",
          n1Title: "企业核心交换机 DHCP",
          n1Sub: "下发 10.0.0.0/8 池",
          n3Title: "企业出口 NAT 网关",
          n3Sub: "正常转发至公网",
          statusText: "✅ 标准 A 类私网 · 内外网路由完全正常",
          flowOk: true
        };
      }
      if (o1 === 172 && o2 >= 16 && o2 <= 31) {
        return {
          badge: "RFC 1918 · Class B Private (172.16.0.0/12)",
          color: "#06b6d4",
          cat: "B 类标准私有地址 (RFC 1918)",
          rfc: "标准私网范围严格限定在 172.16.0.0 至 172.31.255.255 之间。",
          src: "iPhone 热点 / WSL2 / Docker 虚拟网桥",
          srcDesc: "苹果手机热点固定分配 172.20.10.x，Hyper-V 与 Docker 也常使用该段。",
          risk: "安全无冲突 · 虚拟/热点 NAT 转发",
          riskColor: "#06b6d4",
          advice: "若看到“第二节为 20”的 172.20.x.x，它是纯正的标准私网，并非公网冲突。",
          n1Title: "手机热点 / 虚拟交换机",
          n1Sub: "下发 172.16~31 私网池",
          n3Title: "宿主设备 NAT 路由",
          n3Sub: "共享宿主网络上网",
          statusText: "✅ 标准 B 类私网 · 常见于热点与容器虚拟网络",
          flowOk: true
        };
      }
      if (o1 === 192 && o2 === 168) {
        return {
          badge: "RFC 1918 · Class C Private (192.168.0.0/16)",
          color: "#38bdf8",
          cat: "C 类标准私有地址 (RFC 1918)",
          rfc: "全球最普及的局域网网段，每个 /24 子网可分配 254 台设备。",
          src: "家用路由器 / 办公 Wi-Fi / 光猫",
          srcDesc: "几乎所有消费级路由器出厂默认的 DHCP 地址池（如 192.168.1.x）。",
          risk: "零冲突风险 · 标准家庭/办公局域网",
          riskColor: "#10b981",
          advice: "最标准的局域网环境，路由器通过 NAPT 端口复用让全屋设备共享宽带。",
          n1Title: "家用路由器 / 光猫 DHCP",
          n1Sub: "默认 192.168.x.1",
          n3Title: "宽带出口 NAT 转换",
          n3Sub: "正常连接互联网",
          statusText: "✅ 标准 C 类私网 · 家用与小型办公默认配置",
          flowOk: true
        };
      }
      if (o1 === 100 && o2 >= 64 && o2 <= 127) {
        return {
          badge: "RFC 6598 · Carrier-Grade NAT (100.64.0.0/10)",
          color: "#a855f7",
          cat: "运营商级 NAT 共享地址 (CGNAT)",
          rfc: "专为电信运营商设计的“大内网”缓冲池，避免与家用 192.168 冲突。",
          src: "宽带运营商局端 BRAS 设备",
          srcDesc: "光猫拨号或企业宽带接入时，由电信/联通/移动机房直接下发。",
          risk: "上网正常 · 但无公网 IPv4 入站权限",
          riskColor: "#f59e0b",
          advice: "处于运营商大内网中，传统端口映射无法从外网连回，建议使用 IPv6 或 Tailscale。",
          n1Title: "运营商机房 BRAS",
          n1Sub: "下发 100.64.0.0/10",
          n3Title: "运营商级 CGNAT 网关",
          n3Sub: "多户共享公网出口",
          statusText: "🟣 运营商级大内网 (CGNAT) · 出网正常但无独立公网 IPv4",
          flowOk: true
        };
      }
      if (o1 === 169 && o2 === 254) {
        return {
          badge: "RFC 3927 · Link-Local APIPA (169.254.0.0/16)",
          color: "#ef4444",
          cat: "链路本地自封地址 (DHCP 失败!)",
          rfc: "当网卡开启 DHCP 却迟迟收不到任何路由器应答时，系统自动生成的临时地址。",
          src: "本机操作系统内核兜底生成",
          srcDesc: "并非由路由器分配，而是 Windows/macOS 在寻找 DHCP 服务器超时后的自救行为。",
          risk: "网络中断 · 无法获取默认网关",
          riskColor: "#ef4444",
          advice: "请检查网线是否松动、上级交换机 VLAN 是否配置错误，或手动指定静态 IP。",
          n1Title: "DHCP 广播请求超时",
          n1Sub: "无服务器响应 Offer",
          n3Title: "默认网关缺失",
          n3Sub: "❌ 外网路由完全阻断",
          statusText: "❌ DHCP 寻址失败 · 系统自封 169.254.x.x 无法上网",
          flowOk: false
        };
      }
      if (o1 === 127) {
        return {
          badge: "RFC 1122 · Loopback (127.0.0.0/8)",
          color: "#eab308",
          cat: "本地环回测试地址 (Loopback)",
          rfc: "代表本机虚拟回环接口（如 127.0.0.1），数据包不会经过物理网卡。",
          src: "操作系统网络协议栈内置",
          srcDesc: "用于本机前后端服务自测通信，任何外部 DHCP 均不应下发此网段。",
          risk: "仅限本机内部闭环通信",
          riskColor: "#eab308",
          advice: "仅在本地进程间生效，无法用于局域网或互联网通信。",
          n1Title: "本机 OS 协议栈",
          n1Sub: "Loopback 环回接口",
          n3Title: "内部内存闭环",
          n3Sub: "不经过外部路由器",
          statusText: "🔄 本地环回地址 · 仅用于本机内部服务调用",
          flowOk: false
        };
      }
      if (o1 === 20) {
        return {
          badge: "IANA Public · Microsoft Azure (20.0.0.0/8)",
          color: "#f59e0b",
          cat: "公网段被政企内网/VPN私自征用",
          rfc: "20.0.0.0/8 在国际公网上合法归属于微软云 (Azure)，并非标准私有地址。",
          src: "国企/院所内网交换机 或 VPN虚拟网卡",
          srcDesc: "大型单位常按 10/20/30 编号划分内部专网，或由 VPN/代理 TUN 网卡下发以防冲突。",
          risk: "同网段公网遮蔽 (遮蔽 20.x 海外云服务)",
          riskColor: "#f43f5e",
          advice: "可执行 ipconfig /all 查看该 IP 挂在物理网卡还是 VPN 虚拟网卡上。",
          n1Title: "政企交换机 / VPN网卡",
          n1Sub: "自定义 20.x.x.x 地址池",
          n3Title: "内网专网路由 / 出口NAT",
          n3Sub: "⚠️ 劫持同段 20.x 公网流量",
          statusText: "⚠️ 20.x.x.x 属公网段被内网/VPN征用 · 谨防同段公网路由冲突",
          flowOk: true
        };
      }
      return {
        badge: "IANA Global Public Unicast (" + o1 + ".0.0.0/8)",
        color: "#f59e0b",
        cat: "全球公网单播地址 / 非标内网池",
        rfc: "该网段属于 IANA 分配的全球公网可路由空间，不属于 RFC 1918 私网。",
        src: "云主机/专线直发 或 单位非标内网DHCP",
        srcDesc: "若非云服务器或政企固定公网专线，则是单位网管在交换机里自定义了非标地址池。",
        risk: "若在内网使用，将遮蔽同网段真实公网 IP",
        riskColor: "#f59e0b",
        advice: "内网自定义征用公网段会导致电脑把该段公网网站误认为内网邻居而无法打开。",
        n1Title: "专线网关 / 非标内网DHCP",
        n1Sub: "下发 " + o1 + "." + o2 + ".x.x",
        n3Title: "公网直连 或 内网NAT",
        n3Sub: "非标内网存在冲突隐患",
        statusText: "⚠️ 全球公网地址段 · 若在局域网出现则系网管非标配置",
        flowOk: true
      };
    }
    function renderPresets() {
      presetWrap.innerHTML = "";
      presets.forEach(function(p) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "idw-preset-btn" + (state.activePreset === p.id ? " active" : "");
        var ipStr = p.ip.join(".");
        btn.innerHTML = '<div class="idw-p-ip"><span>' + ipStr + '</span><span style="width:8px;height:8px;border-radius:50%;background:' + p.dot + '"></span></div><div class="idw-p-tag">' + p.tag + '</div>';
        btn.addEventListener("click", function() {
          state.activePreset = p.id;
          state.o1 = p.ip[0];
          state.o2 = p.ip[1];
          state.o3 = p.ip[2];
          state.o4 = p.ip[3];
          s1.value = state.o1;
          s2.value = state.o2;
          renderPresets();
          updateUI();
        });
        presetWrap.appendChild(btn);
      });
    }
    function drawTopo(info, ipStr) {
      var c = info.color;
      var line2Color = info.flowOk ? c : "#ef4444";
      var dashClass = info.flowOk ? "idw-flow-line" : "";
      var svgHtml = [];
      svgHtml.push('<line x1="190" y1="72" x2="275" y2="72" stroke="rgba(148,163,184,0.25)" stroke-width="3" />');
      svgHtml.push('<line x1="190" y1="72" x2="275" y2="72" stroke="' + c + '" stroke-width="3" stroke-dasharray="6 6" class="' + dashClass + '" />');
      svgHtml.push('<line x1="445" y1="72" x2="530" y2="72" stroke="rgba(148,163,184,0.25)" stroke-width="3" />');
      svgHtml.push('<line x1="445" y1="72" x2="530" y2="72" stroke="' + line2Color + '" stroke-width="3" stroke-dasharray="6 6" class="' + dashClass + '" />');
      svgHtml.push('<rect x="16" y="28" width="174" height="88" rx="12" fill="rgba(30,41,59,0.9)" stroke="' + c + '" stroke-width="1.6" />');
      svgHtml.push('<text x="103" y="55" fill="#94a3b8" font-size="11" text-anchor="middle">① DHCP 分配源头</text>');
      svgHtml.push('<text x="103" y="77" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">' + info.n1Title + '</text>');
      svgHtml.push('<text x="103" y="98" fill="' + c + '" font-size="11" font-family="monospace" text-anchor="middle">' + info.n1Sub + '</text>');
      svgHtml.push('<rect x="275" y="22" width="170" height="100" rx="12" fill="rgba(15,23,42,0.95)" stroke="#38bdf8" stroke-width="2" />');
      svgHtml.push('<text x="360" y="48" fill="#94a3b8" font-size="11" text-anchor="middle">② 本机网卡 (DHCP Client)</text>');
      svgHtml.push('<text x="360" y="74" fill="#38bdf8" font-size="16" font-weight="bold" font-family="monospace" text-anchor="middle">' + ipStr + '</text>');
      svgHtml.push('<text x="360" y="98" fill="#cbd5e1" font-size="11" font-family="monospace" text-anchor="middle">网关: ' + state.o1 + '.' + state.o2 + '.' + state.o3 + '.1</text>');
      svgHtml.push('<rect x="530" y="28" width="174" height="88" rx="12" fill="rgba(30,41,59,0.9)" stroke="' + line2Color + '" stroke-width="1.6" />');
      svgHtml.push('<text x="617" y="55" fill="#94a3b8" font-size="11" text-anchor="middle">③ 出口网关与公网路由</text>');
      svgHtml.push('<text x="617" y="77" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">' + info.n3Title + '</text>');
      svgHtml.push('<text x="617" y="98" fill="' + line2Color + '" font-size="11" font-family="monospace" text-anchor="middle">' + info.n3Sub + '</text>');
      svg.innerHTML = svgHtml.join("");
    }
    function updateUI() {
      var ipStr = state.o1 + "." + state.o2 + "." + state.o3 + "." + state.o4;
      s1Val.textContent = state.o1;
      s2Val.textContent = state.o2;
      o1Num.textContent = state.o1;
      o2Num.textContent = state.o2;
      o3Num.textContent = state.o3;
      o4Num.textContent = state.o4;
      o1Bin.textContent = toBin(state.o1);
      o2Bin.textContent = toBin(state.o2);
      o3Bin.textContent = toBin(state.o3);
      o4Bin.textContent = toBin(state.o4);
      var info = classify(state.o1, state.o2);
      o1Num.style.color = info.color;
      o2Num.style.color = info.color;
      badge.textContent = info.badge;
      badge.style.color = info.color;
      badge.style.borderColor = info.color;
      badge.style.background = "rgba(15, 23, 42, 0.8)";
      topoStatus.textContent = info.statusText;
      topoStatus.style.color = info.color;
      mCat.textContent = info.cat;
      mCat.style.color = info.color;
      mRfc.textContent = info.rfc;
      mSrc.textContent = info.src;
      mSrcDesc.textContent = info.srcDesc;
      mRisk.textContent = info.risk;
      mRisk.style.color = info.riskColor;
      mAdvice.textContent = info.advice;
      drawTopo(info, ipStr);
    }
    s1.addEventListener("input", function() {
      state.o1 = parseInt(s1.value, 10);
      state.activePreset = "";
      renderPresets();
      updateUI();
    });
    s2.addEventListener("input", function() {
      state.o2 = parseInt(s2.value, 10);
      state.activePreset = "";
      renderPresets();
      updateUI();
    });
    renderPresets();
    updateUI();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIDW);
  } else {
    initIDW();
  }
  setTimeout(initIDW, 120);
  if (window.$docsify && Array.isArray(window.$docsify.plugins)) {
    window.$docsify.plugins.push(function(hook) {
      hook.doneEach(function() { initIDW(); });
    });
  }
})();
</script>
</div>