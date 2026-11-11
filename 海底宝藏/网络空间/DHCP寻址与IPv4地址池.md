# DHCP寻址与IPv4地址池


**DHCP(动态主机配置协议)本身只是一个“自动发号器”，它并不强制规定必须分配 `192` 开头的地址——网络管理员在路由器或核心交换机的“地址池(Address Pool)”里配置了什么网段，DHCP 就会给接入的设备下发什么网段。**

  

平时在家里或小型办公室经常看到 `192.168.x.x`，是因为许多家用路由器默认采用 RFC 1918 中的这个私有地址段。当你看到 **`20` 开头**（或包含 `20`）的 IP 地址时，可以从以下四个角度排查。

  

## 一、 为什么常见的是 `192`，而你会遇到 `20`？

### 1. 内网地址池使用了公网地址空间

RFC 1918 划出了以下三块**标准私有 IPv4 地址**，供各个局域网重复使用。

  

|**私网地址块**|**标准地址范围**|**CIDR 表示**|**典型应用环境**|
|---|---|---|---|
|**10 段**|`10.0.0.0` – `10.255.255.255`|`10.0.0.0/8`|大型企业、政务内网、云厂商 VPC|
|**172.16–31 段**|`172.16.0.0` – `172.31.255.255`|`172.16.0.0/12`|中型企业、高校校园网、Docker / WSL2 虚拟网桥、手机热点|
|**192.168 段**|`192.168.0.0` – `192.168.255.255`|`192.168.0.0/16`|家用路由器、小型办公室局域网（常用的 `/24` 子网有 254 个普通主机地址）|

**那为什么内网会出现 `20.x.x.x`？**

一种可能是单位把公网地址空间中的某个子网用作办公网。先核对分给这个单位的地址范围和实际路由配置，才能判断这个地址在内网出现的原因。

例如，网管若把办公室的子网设为 `20.10.1.0/24`，又把 `20.10.1.50` 放进 DHCP 地址池，接入的电脑就可能拿到这个地址。

  

> **公网地址重叠时会怎样？** 在上面的例子里，电脑通常会在办公室网络上直接寻找 `20.10.1.60`。如果互联网上另有服务器使用同一地址，流量就可能走错方向。具体受影响的范围取决于子网掩码和路由表。`20.0.0.0/8` 由 ARIN 管理，查询具体地址的登记信息时要看更细的分配记录。[IANA 的 IPv4 地址空间登记表](https://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xhtml)
> 
>   

### 2. VPN 客户端、虚拟专网或代理工具的虚拟网卡

如果你在电脑上安装了企业远程办公 VPN（如深信服 EasyConnect、aTrust、OpenVPN）、异地组网工具，或者开启了代理软件的 **TUN 虚拟网卡模式**，软件可能会创建虚拟网卡。它可以直接配置地址，也可以通过 DHCP 获取地址，具体取决于软件和接入方式。

  

- 若只在连接 VPN 后看到 `20.x.x.x`，先查地址出现在哪张网卡，再对照 VPN 的地址池和路由。隧道与本地网络使用同一段地址时，也可能发生路由冲突。
    
      
    

### 3. 云服务器或专线使用公网 IP

在云平台或运营商专线中，需要区分**设备网卡上的地址**与**外部访问它时使用的地址**。

  

- **微软云（Azure）虚拟机**默认通过 DHCP 获取虚拟网络里的私有 IPv4 地址。绑定的公网 IPv4 地址由 Azure 平台做地址转换，通常在虚拟机内查看网卡时只能看到私有地址。[Azure 虚拟机网络接口文档](https://learn.microsoft.com/zh-cn/azure/virtual-network/ip-services/virtual-network-network-interface-addresses#public)
    
      
    
- **运营商宽带或专线**也可能把获准使用的公网 IPv4 地址直接分配给接入设备。具体通过 DHCP、拨号协商还是手动配置，要看接入方式和网卡记录。即使地址以 `20.`、`202.` 或 `203.` 开头，也需要核对完整地址和接入信息。
    
      
    

### 4. 容易混淆的另外两种“20”地址

在排查网络时，还可以核对一下是否属于以下两种自带“20”的标准地址：

  

- **第二段是 20（`172.20.x.x`）** 的地址处于 `172.16.0.0` – `172.31.255.255` 的标准私网范围内。例如，连接苹果 iPhone 个人热点时可能拿到 `172.20.10.x`，WSL2 或其他虚拟网络也可能使用这个范围。
    
      
    
- **带冒号、以 `2001:` 或 `240e:` 开头的地址**属于 IPv6。`2000::/3` 的首个十六进制数字可以是 `2` 或 `3`。设备可通过路由器通告的前缀自动生成地址（SLAAC），也可通过 DHCPv6 或手动配置获得地址。要区分这些情况，还需查看接口配置。
    
      
    

## 二、 三步排查这个 `20` 开头的 IP 是谁发的

在 Windows 上按下 `Win + R`，输入 `cmd` 打开命令提示符，然后查看各张网卡的配置。

  


```powershell
ipconfig /all
```

在输出中找到带有该 `20` 开头 IPv4 地址的那张网卡，重点看以下三处。

  

1. 先看**描述（Description）**。`Realtek PCIe GbE` 或 `Intel Wi-Fi` 通常表示物理网卡。`TAP-Windows Adapter`、`Wintun` 或 `Hyper-V Virtual Ethernet` 通常表示虚拟网卡。这个字段告诉你地址配置在哪个接口上。
    
      
    
2. 核对**是否启用 DHCP（DHCP Enabled）**、**DHCP 服务器（DHCP Server）**和**租约时间**。若这张网卡使用 DHCP，服务器和租约记录有助于确认分配来源。若缺少租约记录，再核对手动设置或 VPN 客户端配置。
    
      
    
3. 查看**默认网关（Default Gateway）**和**子网掩码（Subnet Mask）**。默认网关和 DHCP 服务器可以是不同的设备。要查某个 `20.x.x.x` 目标走内网、VPN 还是公网出口，可以运行 `route print -4`，核对与该目标匹配的路由及其接口。[DHCP 配置选项（RFC 2132）](https://www.rfc-editor.org/rfc/rfc2132.html)
    
      
    

## 三、 交互式工具：IPv4 地址与 DHCP 配置

选择一个示例，或拖动四个滑块调整 IPv4 地址的每一段（0–255）。面板会显示对应的八位二进制数、登记用途和常见配置方式。登记范围描述的是整块地址的用途。本机的子网掩码、DHCP 服务器和默认网关请按第二节核对。

<div id="idw-open-hint">在静态 Markdown 预览中，请<a href="https://xn--9myv52d.xn--udsye.art/#/海底宝藏/Geek空间/DHCP寻址与IPv4地址池">打开文档站的这篇文章</a>使用交互面板。</div>

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
  background: #0f172a;
  color: var(--idw-accent);
  border: 1px solid var(--idw-border);
  transition: all 0.25s ease;
}
.idw-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
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
.idw-preset-btn[aria-pressed="true"] {
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

.idw-root[hidden], #idw-open-hint[hidden] { display: none; }
.idw-root .idw-p-tag { display: block; }
.idw-root button:focus-visible, .idw-root input:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.idw-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(124px, 100%), 1fr)); gap: 8px; }
.idw-octet, .idw-node, .idw-m-card {
  min-width: 0; padding: 12px; border: 1px solid var(--idw-border);
  border-radius: 10px; background: var(--idw-card);
}
.idw-root .idw-octet { display: grid; gap: 3px; text-align: center; cursor: pointer; }
.idw-label, .idw-octet-bin { color: #adbdcf; font-size: 12px; }
.idw-octet-num, .idw-octet-bin, .idw-ip { font-family: ui-monospace, Consolas, monospace; }
.idw-octet-num { font-size: 24px; font-weight: 700; color: var(--idw-accent); line-height: 1.2; }
.idw-root .idw-slider {
  display: block; width: 100%; min-width: 0; height: 22px; margin: 4px 0 0; padding: 0;
  accent-color: var(--idw-accent); cursor: pointer;
}
.idw-topo-wrap { margin: 16px 0 12px; }
.idw-topo-title { margin-bottom: 6px; color: #cbd5e1; font-size: 13px; }
.idw-flow { display: flex; align-items: stretch; gap: 0; }
.idw-node { flex: 1; text-align: center; overflow-wrap: anywhere; }
.idw-node > span, .idw-node > b { display: block; }
.idw-node > b { margin-top: 4px; color: #f8fafc; font-size: 14px; }
.idw-node.idw-current { border-color: var(--idw-accent); }
.idw-node .idw-ip { color: var(--idw-accent); }
.idw-connector { align-self: center; flex: 0 1 28px; border-top: 2px dashed var(--idw-accent); }
.idw-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(215px, 100%), 1fr)); gap: 8px; }
.idw-m-val { margin: 3px 0; font-weight: 700; color: var(--idw-accent); }
.idw-m-desc { color: #d7e2ee; font-size: 13px; line-height: 1.6; }
@media (max-width: 620px) {
  .idw-root { padding: 12px; }
  .idw-flow { flex-direction: column; }
  .idw-connector { flex: none; height: 12px; border-top: 0; border-left: 2px dashed var(--idw-accent); }
}
</style>

<div id="ipv4-dhcp-widget" class="idw-root" hidden>
  <div class="idw-header">
    <div class="idw-title">IPv4 地址分析</div>
    <span class="idw-badge" id="idw-rfc-badge"></span>
  </div>
  <div class="idw-presets" id="idw-presets" role="group" aria-label="示例地址"></div>
  <div class="idw-controls">
  <label class="idw-octet" for="idw-s1">
    <span class="idw-label">第一段</span>
    <span class="idw-octet-num" id="idw-o1-num">20</span>
    <span class="idw-octet-bin" id="idw-o1-bin">00010100</span>
    <input type="range" class="idw-slider" id="idw-s1" aria-label="IPv4 第1段" min="0" max="255" step="1" value="20">
  </label>
  <label class="idw-octet" for="idw-s2">
    <span class="idw-label">第二段</span>
    <span class="idw-octet-num" id="idw-o2-num">10</span>
    <span class="idw-octet-bin" id="idw-o2-bin">00001010</span>
    <input type="range" class="idw-slider" id="idw-s2" aria-label="IPv4 第2段" min="0" max="255" step="1" value="10">
  </label>
  <label class="idw-octet" for="idw-s3">
    <span class="idw-label">第三段</span>
    <span class="idw-octet-num" id="idw-o3-num">1</span>
    <span class="idw-octet-bin" id="idw-o3-bin">00000001</span>
    <input type="range" class="idw-slider" id="idw-s3" aria-label="IPv4 第3段" min="0" max="255" step="1" value="1">
  </label>
  <label class="idw-octet" for="idw-s4">
    <span class="idw-label">第四段</span>
    <span class="idw-octet-num" id="idw-o4-num">50</span>
    <span class="idw-octet-bin" id="idw-o4-bin">00110010</span>
    <input type="range" class="idw-slider" id="idw-s4" aria-label="IPv4 第4段" min="0" max="255" step="1" value="50">
  </label>
  </div>
  <div class="idw-topo-wrap">
    <div class="idw-topo-title">配置与通信范围示意</div>
    <div class="idw-flow">
      <div class="idw-node"><span class="idw-label">配置方式或用途</span><b id="idw-origin"></b></div>
      <span class="idw-connector" aria-hidden="true"></span>
      <div class="idw-node idw-current"><span class="idw-label">所选 IPv4 地址</span><b class="idw-ip" id="idw-ip"></b></div>
      <span class="idw-connector" aria-hidden="true"></span>
      <div class="idw-node"><span class="idw-label">通信范围</span><b id="idw-scope"></b></div>
    </div>
  </div>
  <div class="idw-metrics">
    <div class="idw-m-card">
      <div class="idw-label">地址类型</div>
      <div class="idw-m-val" id="idw-m-cat" aria-live="polite"></div>
      <div class="idw-m-desc" id="idw-detail"></div>
    </div>
    <div class="idw-m-card">
      <div class="idw-label">如何核实</div>
      <div class="idw-m-desc" id="idw-check"></div>
    </div>
  </div>
</div>

<script>
(function () {
  const root = document.getElementById("ipv4-dhcp-widget");
  if (!root || root.dataset.idwReady) return;
  const field = id => root.querySelector("#idw-" + id);
  const kinds = {
    public: {
      name: "公网单播地址空间", color: "#fbbf24",
      origin: "DHCP、手动或平台配置", scope: "取决于实际路由",
      detail: "具体地址的登记持有人要查更细的分配记录。仅凭这个地址，无法确认它来自运营商、单位内网还是 VPN。",
      check: "若内部网络复用了公网地址，访问重叠范围时可能走错接口。用 route print -4 核对目标匹配的路由。"
    },
    private: {
      name: "RFC 1918 私有地址", color: "#67e8f9",
      origin: "DHCP 或手动配置", scope: "局域网或互联私网",
      detail: "家庭、企业和虚拟网络都可以重复使用这段地址。连接使用相同网段的 VPN 时，路由可能重叠。",
      check: "要确认地址由谁分配，可在对应网卡下核对 DHCP 服务器和租约。要判断能否上网，还需检查网关及出口配置。"
    },
    shared: {
      name: "运营商共享地址空间", color: "#c4b5fd",
      origin: "运营商接入或虚拟网络", scope: "共享地址域内",
      detail: "RFC 6598 为共享地址划出此段。一个典型场景是运营商在宽带用户与公网之间做大规模 NAT（CGNAT）。",
      check: "先看这个地址在路由器的广域网口还是虚拟网卡上。要确认 CGNAT，可核对运营商的接入与地址转换配置。"
    },
    link: {
      name: "IPv4 链路本地地址", color: "#fda4af",
      origin: "常见于主机自动配置", scope: "同一条本地链路",
      detail: "RFC 3927 允许主机在链路上自行选址。仅凭这一段地址，无法确认 DHCP 故障或其他网卡的联网状态。",
      check: "若本应获得 DHCP 租约，请查看该接口的链路、DHCP 服务器与租约记录。链路本地流量只在本链路上传递。"
    },
    loop: {
      name: "回环地址", color: "#86efac", origin: "本机协议栈", scope: "仅本机",
      detail: "发往回环地址的数据留在本机。127.0.0.1 是最常见的例子。",
      check: "排查局域网的 DHCP 时，请选择实际接入该网络的物理或虚拟网卡。"
    },
    docs: {
      name: "文档示例地址", color: "#93c5fd", origin: "文档和教程中的示例", scope: "仅用于举例",
      detail: "RFC 5737 为文档示例保留了三个地址块，可用来展示配置和数据包。",
      check: "若在实际网卡上看到这个地址，请核对是否沿用了教程里的示例配置。"
    },
    bench: {
      name: "网络基准测试地址", color: "#93c5fd", origin: "测试环境配置", scope: "基准测试网络",
      detail: "198.18.0.0/15 用于测试网络设备的性能，覆盖 198.18 和 198.19 开头的地址。",
      check: "如果在虚拟网卡上看到这段地址，可对照测试或代理软件的配置。"
    },
    multicast: {
      name: "IPv4 组播地址", color: "#c4b5fd", origin: "组播组标识", scope: "对应组的接收者",
      detail: "组播地址标识一组接收者。主机可以加入组播组，并保有自己的单播地址。",
      check: "传播范围取决于所选组、协议和组播路由。检查 DHCP 租约时请查看接口的单播地址。"
    },
    broadcast: {
      name: "有限广播地址", color: "#fda4af", origin: "报文目的地址", scope: "本地链路广播",
      detail: "255.255.255.255 用于向本地链路广播。例如，客户端发起 DHCP 发现时可使用这个目的地址。",
      check: "看抓包时要区分报文目的地址和服务器提供给客户端的租用地址。"
    },
    zero: {
      name: "本网络专用地址", color: "#cbd5e1", origin: "协议保留", scope: "特定协议语境",
      detail: "IPv4 为“本网络”保留了 0.0.0.0/8。普通主机单播地址池应避开这段地址。",
      check: "看到 0.0.0.0 时，请先区分接口地址、报文源地址和路由表中的默认路由前缀。"
    },
    unspecified: {
      name: "未指定地址", color: "#cbd5e1", origin: "主机尚未取得地址", scope: "取决于所在字段",
      detail: "DHCP 客户端首次请求地址时可以用 0.0.0.0 作源地址。在套接字和路由表中，这个值有其他含义。",
      check: "如果是在 route print -4 中看到 0.0.0.0/0，它表示默认路由。"
    },
    reserved: {
      name: "IPv4 保留地址", color: "#cbd5e1", origin: "协议保留", scope: "保留空间",
      detail: "IANA 将 240.0.0.0/4 列为保留空间，其中 255.255.255.255 单独定义为有限广播地址。",
      check: "普通 DHCP 单播地址池应避开这段地址。"
    },
    protocol: {
      name: "协议专用地址", color: "#93c5fd", origin: "由相应协议定义", scope: "按具体用途确定",
      detail: "该地址块有专门的协议用途。各条目的允许用途和全球可达属性可在 IANA 登记表中查到。",
      check: "先确认网络是否运行相应协议，再查看本地配置与路由。"
    }
  };
  function addressNumber(octets) {
    return octets.reduce((total, octet) => total * 256 + Number(octet), 0);
  }
  // 从具体地址到大块登记空间均使用 CIDR；重叠时优先匹配更长的前缀。
  const blocks = [
    ["0.0.0.0/8", "zero"], ["0.0.0.0/32", "unspecified"],
    ["10.0.0.0/8", "private"], ["20.0.0.0/8", "public"],
    ["100.64.0.0/10", "shared"], ["127.0.0.0/8", "loop"],
    ["169.254.0.0/16", "link"], ["172.16.0.0/12", "private"],
    ["192.0.0.0/24", "protocol", "IETF 协议分配"],
    ["192.0.0.0/29", "protocol", "IPv4 服务连续性前缀"],
    ["192.0.0.8/32", "protocol", "IPv4 哑地址"],
    ["192.0.0.9/32", "protocol", "PCP 任播地址"],
    ["192.0.0.10/32", "protocol", "TURN 任播地址"],
    ["192.0.0.170/32", "protocol", "NAT64 / DNS64 发现"],
    ["192.0.0.171/32", "protocol", "NAT64 / DNS64 发现"],
    ["192.0.2.0/24", "docs"], ["192.31.196.0/24", "protocol", "AS112 服务"],
    ["192.52.193.0/24", "protocol", "AMT 自动组播隧道"],
    ["192.88.99.0/24", "protocol", "已弃用的 6to4 中继前缀"],
    ["192.88.99.2/32", "protocol", "6a44 中继任播地址"],
    ["192.168.0.0/16", "private"], ["192.175.48.0/24", "protocol", "AS112 直接委派"],
    ["198.18.0.0/15", "bench"], ["198.51.100.0/24", "docs"], ["203.0.113.0/24", "docs"],
    ["224.0.0.0/4", "multicast"], ["240.0.0.0/4", "reserved"], ["255.255.255.255/32", "broadcast"]
  ].map(([cidr, kind, name]) => {
    const [network, length] = cidr.split("/");
    const first = addressNumber(network.split("."));
    const size = Math.pow(2, 32 - Number(length));
    return { cidr, kind, name, first, last: first + size - 1, size };
  }).sort((a, b) => a.size - b.size);
  const presets = [
    ["20.10.1.50", "公网地址示例"], ["192.168.1.100", "家庭局域网示例"],
    ["172.20.10.2", "热点私网示例"], ["10.20.0.15", "企业私网示例"],
    ["100.64.12.8", "共享地址示例"], ["169.254.10.5", "链路本地示例"]
  ];
  const sliders = Array.from(root.querySelectorAll("input[type=range]"));
  const buttons = presets.map(([ip, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "idw-preset-btn";
    for (const [className, text] of [["idw-p-ip", ip], ["idw-p-tag", label]]) {
      const span = document.createElement("span");
      span.className = className;
      span.textContent = text;
      button.appendChild(span);
    }
    button.addEventListener("click", () => {
      ip.split(".").forEach((value, index) => { sliders[index].value = value; });
      update();
    });
    field("presets").appendChild(button);
    return button;
  });
  function update() {
    const octets = sliders.map(input => Number(input.value));
    const ip = octets.join(".");
    const value = addressNumber(octets);
    const block = blocks.find(entry => value >= entry.first && value <= entry.last);
    const info = kinds[block ? block.kind : "public"];
    const name = (block && block.name) || info.name;
    root.style.setProperty("--idw-accent", info.color);
    octets.forEach((octet, index) => {
      field("o" + (index + 1) + "-num").textContent = octet;
      field("o" + (index + 1) + "-bin").textContent = octet.toString(2).padStart(8, "0");
    });
    buttons.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(presets[index][0] === ip));
    });
    field("rfc-badge").textContent = block ? "登记范围 " + block.cidr : "一般公网单播空间";
    field("ip").textContent = ip;
    field("origin").textContent = info.origin;
    field("scope").textContent = info.scope;
    field("m-cat").textContent = name;
    field("detail").textContent = info.detail;
    field("check").textContent = info.check;
    if (info === kinds.link && (octets[2] === 0 || octets[2] === 255)) {
      field("origin").textContent = "链路本地保留子段";
      field("detail").textContent = "RFC 3927 为未来用途保留首尾两个 /24。主机自动选址的范围是 169.254.1.0 至 169.254.254.255。";
    }
  }
  sliders.forEach(input => input.addEventListener("input", update));
  update();
  root.dataset.idwReady = "1";
  root.hidden = false;
  document.getElementById("idw-open-hint").hidden = true;
})();
</script>

地址用途可查 [IANA IPv4 特殊用途地址登记表](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) 和 [IPv4 组播地址登记表](https://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml)。
