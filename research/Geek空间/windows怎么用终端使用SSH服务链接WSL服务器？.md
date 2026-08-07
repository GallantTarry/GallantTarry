# windows怎么用终端使用SSH服务链接WSL服务器？

针对 WSL (Ubuntu) 环境，从零开始配置 SSH 并最终在 IntelliJ IDEA 中完成连接，主要分为“服务端配置”、“本地验证”和“IDE 接入”三个阶段。

那么我已经有了一个WSL Ubuntu系统，`gallanttarry@AK47:~$`


这行提示符在 Linux 系统中被称为 `PS1` (Prompt String 1)，它的标准格式是 `用户名@主机名:当前路径$` 。具体拆解如下：

- **`gallanttarry`**：代表您**当前登录的用户名**。
    
- **`@`**：英文中 "at" 的缩写，意为“在...之上”。
    
- **`AK47`**：代表**主机名**。也就是明确告诉您，当前这位用户是登录在哪一台设备上的。
    
- **`:`**：单纯的分隔符，用来把设备信息和路径信息隔开。
    
- **`~`**：代表**当前所在的目录路径**。在 Linux 中，波浪号 `~` 是一个特殊的缩写，特指当前用户的“家目录”（Home Directory）。它的真实绝对路径其实是 `/home/gallanttarry`。当您进入其他文件夹时（比如 `/etc`），这个波浪号就会变成对应的文件夹名称。
    
- **`$`**：代表**当前用户的权限身份**。美元符号 `$` 表示您当前是一个**普通权限用户**。如果您在未来看到提示符变成了井号 `#` （例如 `root@AK47:~#`），那说明您当前正以超级管理员（root）的身份操作，拥有系统的最高生杀大权。



### 一、 Ubuntu 端准备工作（启动 SSH 隧道）

新安装的 WSL Ubuntu 系统默认通常没有启动或安装完整的 SSH 服务端，我们需要先在您的 Linux 终端（即截图中显示 `gallanttarry@AK47:~$` 的界面）中进行配置。

  

**1. 更新软件源并安装 SSH 服务**

在终端中依次输入以下命令，确保安装了 OpenSSH Server：

  

Bash

```
sudo apt update
sudo apt install openssh-server -y
```

_(在此过程中可能需要输入您的 Ubuntu 用户 `gallanttarry` 的登录密码)_

  

**2. 启动 SSH 服务**

安装完成后，启动该服务让其开始监听 22 端口：

  

Bash

```
sudo service ssh start
```

如果终端输出 `* Starting OpenBSD Secure Shell server sshd` 或没有任何报错，说明服务已成功启动。

  

**3. 获取连接所需的核心信息**

要从外部（Windows 端或 IDEA）连接，我们需要锁定目标地址和身份验证信息：

  

- **用户名：** `gallanttarry`
    
      
    
- **IP 地址：** 在终端中输入命令 `ip a`。找到名称类似 `eth0` 的网段，查看 `inet` 后面的 IP 地址（通常是 `172.x.x.x` 格式）。记下这个局域网 IP。
    
    _(注：在 WSL2 的 NAT 网络模式下，通常也可以直接使用 `localhost` 或 `127.0.0.1` 进行穿透连接)_
    
      


```
gallanttarry@AK47:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet 10.255.255.254/32 brd 10.255.255.254 scope global lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host proto kernel_lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:fe:ac:24 brd ff:ff:ff:ff:ff:ff
    altname enx00155dfeac24
    inet 172.20.217.216/20 brd 172.20.223.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fefe:ac24/64 scope link proto kernel_ll
       valid_lft forever preferred_lft forever
```


针对您输出的这段信息，我为您逐行进行专业的“解剖”，并拓展其中的关键网络概念。

  

#### 1. 本地回环接口 (`lo`)

这一段描述的是您的第一块网卡 **`lo` (Loopback)**。这块网卡并不是真实存在的硬件，而是 Linux 内核虚拟出来的一个“内部通道”，专门用于系统内部的网络通信测试。

  

- **`1: lo:`**
    
    代表这是系统编号为 1 的网络接口，名称为 `lo`。
    
      
    
- **`<LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN...`**
    
      
    - `UP` 和 `LOWER_UP`：表示这个接口目前是启动且正常连接的状态。
        
          
        
    - `mtu 65536`：最大传输单元（Maximum Transmission Unit）。标准的物理网卡 MTU 通常是 1500 字节，而 `lo` 因为纯粹在内存中进行数据交换，不需要经过物理网线，所以系统分配了极大的 65536 字节，以实现极高的数据传输效率。
        
          
        
- **`link/loopback 00:00...`**
    
    这是它的 MAC（硬件）地址。因为是虚拟的内部网卡，所以全是 0。
    
      
    
- **`inet 127.0.0.1/8 scope host lo`**
    
    这是最经典的 IPv4 `localhost` 地址。当您在本地开发 Java 或前端项目时，访问 `127.0.0.1`，数据包就是通过这块虚拟网卡进行自我循环的。
    
      
    
- **`inet 10.255.255.254/32 brd 10.255.255.254 scope global lo`**
    
    **【专业拓展】**：这是一个非常特殊的 IP 地址，通常只有在 WSL2（Windows Subsystem for Linux）环境下才会出现。这是微软为了解决 WSL2 虚拟机与外部 Windows 宿主机之间的 DNS 解析（域名解析）问题，强行在内部注入的一个路由地址。
    
      
    
- **`inet6 ::1/128...`**
    
    这是 IPv6 版本的本地回环地址（等同于 IPv4 的 `127.0.0.1`）。
    
      
    

#### 2. 主以太网接口 (`eth0`)

这一段描述的是您的第二块网卡 **`eth0` (Ethernet 0)**。在 WSL 环境中，这是由底层 Hyper-V 虚拟机为您分配的主力网卡，负责与外部世界（如您的 Windows 系统、互联网）进行数据交互。

  

- **`2: eth0:`**
    
    代表编号为 2 的网卡，`eth` 是以太网的缩写。
    
      
    
- **`<BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450...`**
    
      
    - `BROADCAST,MULTICAST`：表示这块网卡支持广播和组播功能。
        
          
        
    - `mtu 1450`：这里的最大传输单元被限制在了 1450 字节。通常物理网卡是 1500，WSL 减小这个值是为了预留数据包封装的头部空间，防止在通过宿主机 NAT 转发时发生网络数据包的切片碎片化。
        
          
        
- **`link/ether 00:15:5d:fe:ac:24 brd ff:ff:ff:ff:ff:ff`**
    
    这是网卡的 MAC 地址（全球唯一的硬件身份证）。**【专业拓展】**：MAC 地址的前六位 `00:15:5d` 是全球硬件制造商的 OUI 代码，查询可知，这个代码专门隶属于 Microsoft Corporation，这再次印证了您的 Ubuntu 是运行在微软的虚拟化平台之上的。`ff:ff...` 是底层的广播硬件地址。
    
      
    
- **`inet 172.20.217.216/20 brd 172.20.223.255 scope global eth0`**
    
    这是整段输出中最核心的信息——您的真实局域网 IPv4 配置：
    
      
    - **IP 地址**：`172.20.217.216` （您之前通过 SSH 连接服务器用的就是这个）。
        
          
        
    - **子网掩码**：`/20`。它代表子网掩码的二进制中有 20 个 1，换算成十进制就是 `255.255.240.0`。这意味着您的局域网非常庞大，最多可以容纳 4094 台设备。
        
          
        
    - **广播地址 (`brd`)**：`172.20.223.255`。如果您的 Ubuntu 向这个地址发送一条消息，当前子网内的所有设备都会收到。
        
          
        
- **`inet6 fe80::215:5dff:fefe:ac24/64 scope link proto kernel_ll`**
    
    这是自动生成的 IPv6 链路本地地址（Link-local address）。注意看中间的 `215:5dff:fefe:ac24`，它实际上是根据上面提到的微软 MAC 地址 `00:15:5d:fe:ac:24` 通过特定算法（EUI-64）直接变形转换过来的，用于局域网内的 IPv6 设备自动发现与通信。
    
      
    

总结来说，当您排查网络或者需要部署后端服务供外部访问时，您只需要重点关注 `eth0` 下的 `inet` 后面的地址（`172.20.217.216`）即可，其余的配置均是底层网络协议运行的基础支撑。





### 二、 Windows 端验证连接（排错测试）

在去 IDEA 里配置之前，最稳妥的做法是先在 Windows 环境下测试通道是否畅通。

  

请在 Windows 系统中打开 **cmd** 或 **powershell**，输入以下标准 SSH 连接命令：

  

Bash

```
ssh gallanttarry@127.0.0.1
```


```
 ssh gallanttarry@172.20.217.216
```

_(如果 127.0.0.1 提示连接拒绝，请替换为您刚才通过 `ip a` 查到的 172 开头的具体 IP)_

  

- 首次连接时，系统会提示 `Are you sure you want to continue connecting (yes/no)?`，请输入 `yes` 并回车。
    
      
    
- 接着输入您的 Ubuntu 密码（输入时屏幕不会显示字符，直接盲打回车即可）。
    
      
    
- 如果成功看到 `gallanttarry@AK47:~$` 的提示符，说明网络和 SSH 服务已完全畅通，输入 `exit` 退出即可。
    
      
    

### 三、 IntelliJ IDEA 连接配置（接入 IDE）

通道验证无误后，我们就可以将其接入 IDEA 了。

  

**1. 进入 SSH 配置面板**

  

- 打开 IntelliJ IDEA。
    
      
    
- 点击顶部菜单栏的 **File** -> **Settings** (或快捷键 `Ctrl + Alt + S`)。
    
      
    
- 在左侧菜单依次展开 **Tools** -> **SSH Configurations**。
    
      
    

**2. 新建并填写连接参数**

  

- 点击左上角的 **`+`** 号，新建一个配置。
    
      
    
- **Host（主机）:** 填入 `127.0.0.1`（或您查到的 WSL IP）。
    
      
    
- **Port（端口）:** 保持默认的 `22`。
    
      
    
- **User name（用户名）:** 填入 `gallanttarry`。
    
      
    
- **Authentication type（认证方式）:** 下拉选择 `Password`，并在下方填入对应的 Ubuntu 密码。
    
      
    

**3. 测试与保存**

点击下方的 **Test Connection** 按钮。如果弹窗显示 `Successfully connected`，则点击 **Apply** 和 **OK** 保存。此时，IDEA 已经成功与您的 Ubuntu 系统建立了安全的 SSH 桥梁。

  

### 四、 专业拓展（针对 WSL 环境的特殊性）

考虑到您使用的是 Windows 下的 WSL 虚拟化环境，这里有两点高阶拓展需要注意：

  

- **SSH 服务的非持久性：** WSL 的设计类似于轻量级容器。每次您彻底重启 Windows 电脑或关闭 WSL 后，Ubuntu 里的 SSH 服务**不会自动启动**。下次需要连接 IDEA 时，必须先在终端里再次手动执行 `sudo service ssh start`。
    
      
    
- **IDEA 的原生 WSL 支持：** 如果您连接 Ubuntu 的最终目的是为了在里面使用 Maven 编译 Java 项目或运行后端代码，现代版本的 IDEA 其实支持**跳过 SSH**，直接读取本地的 WSL 子系统。您可以在 IDEA 的项目 JDK 设置或 Maven 设置中，直接将路径指向 `\\wsl$\Ubuntu\...\` 目录下的环境，这往往比通过 SSH 进行远程开发的性能损耗更低。这也是IDEA主界面远程开发的SSH链接右面的那只小企鹅。
    
      
    
