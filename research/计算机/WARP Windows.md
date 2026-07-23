少侠，用 **Cloudflare WARP + 优选 IP** 来跑满 Google Drive 上传，核心原理是用本地工具测出对你当前宽带最快的 Cloudflare WARP 节点（Endpoint），然后强行指定 WARP 客户端连接这个节点。

整个配置过程分为 **4 个步骤**，全程使用 CMD 或 PowerShell 即可完成：

**1.安装官方 WARP 客户端：**奠定网络连接基础。

1. 前往 Cloudflare 官网（1.1.1.1）下载并安装 **WARP Windows 客户端**。
    
2. 安装完成后，任务栏右下角会出现一个小橘黄色的网桥图标。**先不要点击开启连接**。
    

**2.获取高速 WARP Endpoint IP：**下载并运行优选工具。

1. 在 GitHub 搜索并下载 **CloudflareSpeedTest**（或专门针对 WARP 的 `warp-yx` 优选脚本）。
    
2. 解压后，双击运行优选脚本（如 `CloudflareST.exe` 或配套的 WARP 测速批处理文件）。
    
3. 工具会自动对数百个 WARP 节点（形式如 `162.159.192.X:2408`）进行延迟和下载/上传测速。
    
4. 测速完成后，记录下结果里**延迟最低、速度最快**的 IP 和端口，例如：`162.159.193.10:2408`。
    

**3.向 WARP 写入优选 Endpoint：**通过终端强行指定节点。

1. 按下 `Win + R` 输入 `powershell` 或 `cmd` 打开终端（如提示权限不足，请右键选择“以管理员身份运行”）。
    
2. 执行以下命令，将刚才测出的优选 IP 绑定到 WARP 客户端：
    

DOS

```
warp-cli set-custom-endpoint 162.159.193.10:2408
```

3. 终端提示 `Success` 即表示设置成功。
    

**4.启动连接并上传文件：**测试全速直连 Google Drive。

1. 在任务栏点击 WARP 图标，切换开关为 **连接（Connected）**。
    
2. 打开浏览器访问 Google Drive，尝试拖拽大文件上传。
    
3. 此时所有谷歌流量都会通过 Cloudflare 免费通道传输，既不消耗机场流量，也能跑满本地上行带宽。
    

### 💡 少侠需注意的小细节：

- **还原默认节点**：如果未来网络环境改变（比如更换了宽带），想重置节点，只需在终端运行 `warp-cli clear-custom-endpoint` 即可。
    
- **WireGuard 替代方案**：如果官方 WARP 客户端在部分地区连接不稳定，可以使用开源工具（如 `warp-reg`）导出 WARP 的 WireGuard 配置文件（`.conf`），直接导入 **WireGuard 官方客户端** 或 **NekoBox** 中使用，同样填入优选 IP 即可。