# 💯TCP与UDP

这个问题问到了计算机网络的最核心。为了理清它们的关系，我们需要把这些概念放在一个“上下级”的框架里来看。

### 属于什么学问？

TCP 和 UDP 属于**计算机网络(Computer Networking)**这门学科。具体来说，它们是网络通信标准中的**传输层(Transport Layer)**核心协议。

### 是网线协议吗？必须插网线吗？

**不是网线协议，也完全不依赖网线。**

网线仅仅是底层数据传输的“物理媒介”之一。TCP 和 UDP 可以跑在网线、光纤、Wi-Fi、5G 蜂窝网络等不同链路上。不过光有物理信号还不够（比如两台设备只做了普通的蓝牙配对），前提是两台设备之间**能通过 IP 互通**；对下面我们要写的局域网程序来说，电脑和手机还得连在同一个局域网里。

### HTTPS 和它们又是什么关系？

这里有一个非常严谨的“包工头与打工人”关系。我们可以把整个网络传输想象成一个**庞大的跨国物流系统**：

|**网络分层**|**扮演的角色**|**代表事物**|**作用**|
|---|---|---|---|
|**物理层/链路层**|**基础设施(马路、航道)**|网线、Wi-Fi、光纤|提供电信号或光信号跑的物理通道。|
|**网络层**|**导航系统**|IP 地址|决定包裹从 A 电脑怎么通过层层路由器找到 B 电脑。|
|**传输层**|**物流派送员(老干部/莽汉)**|**TCP、UDP**|负责真刀真枪地把数据跨网从 A 搬运到 B。|
|**应用层**|**包裹里的货物与包装**|**HTTPS**、HTTP、SSH|决定这些数据到底是网页、压缩包还是远程指令。|

**总结一下它们的配合过程：**

HTTPS 并不是用来替代传输层协议的，而是传输层的“大客户”。HTTPS 的核心作用是**给货物打包并上好密码锁(数据格式化与加密)**。在常见的 HTTP/1.1 和 HTTP/2 连接中，HTTPS 通常走 TLS 和 TCP——它会把打包好的加密货物交给底层稳重的 TCP(老干部)，TCP 顺着网线或 Wi-Fi(马路)，根据 IP 地址(导航)，按顺序把货物送达。不过到了新一代的 **HTTP/3**，连接改走 **QUIC** 协议，而 QUIC 的数据包是装在 **UDP** 里的；所以看到 `https://` 也不能直接断定底层一定用了 TCP。

- **TCP 场景：** 比如你用 Spring Boot 写了一个常规的 Web 接口或者管理后台（走 HTTP/1.1 或 HTTP/2），最上层暴露给用户的是 HTTP/HTTPS 协议，底层真正把数据库里的 JSON 数据跨网传给前端的“苦力”依然是 TCP。

- **UDP 场景：** 反过来，当你打《守望先锋2》或者在一个纯净的 Solo Only Rust 服务器里和别人刚枪时，玩家移动、开火这些需要极速反应的操作，底层就会直接雇佣 UDP 这个“莽汉”来一路狂奔，哪怕偶尔丢包也不会重传，因为游戏画面的实时性大于一切。

所以简单来说：**网线/Wi-Fi 是修好的路，IP 是导航，TCP/UDP 是路上跑的物流车，而 HTTPS 只是车厢里装的带密码锁的集装箱。**

---

我们直接把 **Java 下的 UDP 和 TCP** 放在一起对比展示。

这两个协议在 Java 里的核心区别，其实就是**“无连接的数据报(UDP)”**与**“基于连接的数据流(TCP)”**的区别。我们用最精简的代码，模拟一下局域网工具(比如你的 ToolKit)**“先用 UDP 找到手机拿 IP，再用 TCP 连上手机传文件”**的完整逻辑。

### 第一阶段：找人(UDP 莽汉)

这个阶段的特点是**广撒网、轻量快速**。电脑往局域网里喊一嗓子，不关心谁没收到，只等在线的手机回一句“我在”，从而顺藤摸瓜拿到手机的 IP 地址。

*(注：实际运行时，先启动手机端的 `UdpReceiver` 监听，再运行电脑端的 `UdpSender` 发广播。)*

#### 1. 发送广播并等回信(电脑找人)

电脑拿起大喇叭往局域网里发“寻呼”，然后守在原地等手机回话，从回包里读出手机的真实 IP。

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;

public class UdpSender {
    public static void main(String[] args) throws Exception {
        // 创建 UDP 窗口，并设置 5 秒超时（防止没人回信一直干等）
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true); // 允许发广播大喇叭
            socket.setSoTimeout(5000);

            String msg = "我是电脑客户端，寻找局域网设备！";
            byte[] data = msg.getBytes(StandardCharsets.UTF_8);

            // 目标设为广播地址，端口设为 8888 暗号
            InetAddress destIp = InetAddress.getByName("255.255.255.255");
            DatagramPacket packet = new DatagramPacket(data, data.length, destIp, 8888);

            // 1. 扔出广播包(不管对方有没有开机，直接发)
            socket.send(packet);
            System.out.println("UDP 广播已发送，等待手机回信...");

            // 2. 准备空包裹，接收手机的回信
            byte[] replyBuffer = new byte[1024];
            DatagramPacket replyPacket = new DatagramPacket(replyBuffer, replyBuffer.length);
            socket.receive(replyPacket);

            String replyMsg = new String(replyPacket.getData(), 0, replyPacket.getLength(), StandardCharsets.UTF_8);
            String phoneIp = replyPacket.getAddress().getHostAddress();
            System.out.println("收到手机回信：" + replyMsg);
            System.out.println("成功拿到手机 IP：" + phoneIp + "（下一步就连接它的 9999 端口！）");
        }
    }
}
```

#### 2. 接收广播并回信(手机被找到)

手机在后台静静监听 8888 端口，听到电脑呼叫后，顺着来信的地址回一句“我在”，把自己的 IP 暴露给电脑。

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.nio.charset.StandardCharsets;

public class UdpReceiver {
    public static void main(String[] args) throws Exception {
        // 在 8888 端口蹲守
        try (DatagramSocket socket = new DatagramSocket(8888)) {
            System.out.println("手机正在监听 8888 端口，等待呼叫...");

            // 1. 准备一个空数组，用来接住电脑扔过来的广播包
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

            // 阻塞等待，一旦局域网里有人喊话，这里就会收到
            socket.receive(packet);

            String receivedMsg = new String(packet.getData(), 0, packet.getLength(), StandardCharsets.UTF_8);
            System.out.println("收到广播：" + receivedMsg);
            System.out.println("呼叫方(电脑) IP 是：" + packet.getAddress().getHostAddress());

            // 2. 顺着来信的 IP 和端口，给电脑回一句“我在”
            byte[] replyData = "我在！9999 端口随时可传文件".getBytes(StandardCharsets.UTF_8);
            DatagramPacket replyPacket = new DatagramPacket(
                    replyData,
                    replyData.length,
                    packet.getAddress(), // 电脑的 IP
                    packet.getPort()     // 电脑发广播时用的端口
            );
            socket.send(replyPacket);
            System.out.println("已向电脑回复“我在”！");
        }
    }
}
```

### 第二阶段：传文件(TCP 老干部)

当电脑通过上面的 UDP 回信拿到了手机的 IP 地址后，就可以开始传文件了。这个阶段的特点是**一对一连接、丢包重传、按序交付**：传输途中如果丢了包，TCP 会自动重传丢失的数据，并按顺序交给应用程序（当然，如果中途彻底断网且重传超时，TCP 也会报错中断，并不能无视断网硬传）。

同时要注意一个实战细节：接收端读到流结束（`read() == -1`），只说明发送端正常关闭了输出流，**并不自动等于整个文件都发全了**（比如 100 MB 的文件，发送端只写了 60 MB 就提前关闭输出，接收端照样会读到流结束）。因此在下面的代码里，发送端会先告知文件总大小，接收端核对字节数并成功写完硬盘后，再回一句“已收齐”。

#### 1. 服务端(接收文件的手机)

被找到的手机在 `9999` 端口开门迎客，先记下文件总大小，收完核对无误后再回复确认。

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
    public static void main(String[] args) throws Exception {
        // 在 9999 端口开门迎客
        try (ServerSocket serverSocket = new ServerSocket(9999)) {
            System.out.println("TCP 服务端已启动，等待电脑连线传文件...");

            // 阻塞等待，直到电脑(客户端)成功建立连接
            try (Socket clientSocket = serverSocket.accept();
                 DataInputStream in = new DataInputStream(clientSocket.getInputStream());
                 DataOutputStream out = new DataOutputStream(clientSocket.getOutputStream())) {

                System.out.println("连接成功！专线已拉起，开始接收数据...");

                // 1. 先读取电脑发来的文件总字节数
                long expectedSize = in.readLong();
                long receivedBytes = 0;

                // 2. 一边收网络数据，一边写进硬盘
                try (FileOutputStream fileOut = new FileOutputStream("D:\\received_video.mp4")) {
                    byte[] buffer = new byte[8192];
                    int len;
                    while ((len = in.read(buffer)) != -1) {
                        fileOut.write(buffer, 0, len);
                        receivedBytes += len;
                    }
                    fileOut.flush();
                }

                // 3. 核对字节数，确认完整写盘后再回复电脑
                if (receivedBytes == expectedSize) {
                    System.out.println("文件接收完毕，核对无误，共 " + receivedBytes + " 字节！");
                    out.writeUTF("已收齐（共 " + receivedBytes + " 字节）");
                } else {
                    System.out.println("文件不完整！预期 " + expectedSize + " 字节，实收 " + receivedBytes + " 字节");
                    out.writeUTF("文件未收齐，请重传");
                }
                out.flush();
            }
        }
    }
}
```

#### 2. 客户端(发文件的电脑)

电脑填入刚才 `UdpSender` 拿到的手机 IP，主动连接手机的 `9999` 端口，先报文件大小、再传内容，最后等待手机回复“已收齐”。

```java
import java.io.*;
import java.net.Socket;

public class TcpClient {
    public static void main(String[] args) throws Exception {
        // 填入第一阶段 UdpSender 打印出的手机 IP（如果只在一台电脑上自测，填本机局域网 IP 或 127.0.0.1 均可）
        String phoneIp = "192.168.1.23";
        File file = new File("D:\\my_video.mp4");

        // 拿着手机的 IP 和端口，尝试建立 TCP 专线连接（三次握手）
        try (Socket socket = new Socket(phoneIp, 9999);
             FileInputStream fileIn = new FileInputStream(file);
             DataOutputStream out = new DataOutputStream(socket.getOutputStream());
             DataInputStream in = new DataInputStream(socket.getInputStream())) {

            System.out.println("已连接到手机，准备发送文件，总大小：" + file.length() + " 字节");

            // 1. 先告诉手机文件有多大
            out.writeLong(file.length());

            // 2. 一边读硬盘，一边往网络流里塞
            byte[] buffer = new byte[8192];
            int len;
            while ((len = fileIn.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
            out.flush();

            // 3. 半关闭输出：告诉手机“文件流发完了”，但保留输入流等待回信
            socket.shutdownOutput();

            // 4. 读取手机核对字节数后的确认回执
            String reply = in.readUTF();
            System.out.println("收到手机确认：" + reply);
        }
    }
}
```

### 核心差别总结表

|**特性**|**Java 中的 UDP (DatagramSocket)**|**Java 中的 TCP (Socket / ServerSocket)**|
|---|---|---|
|**连接机制**|无连接。装进包裹(`DatagramPacket`)直接扔。|面向连接。必须 `accept()` 和 `new Socket()` 握手成功后才能传。|
|**数据形态**|**数据报 (Datagram)**：像信件，一封一封的，独立发送。|**字节流 (Stream)**：像水管，无消息边界，按字节连续收发。|
|**可靠性**|不保证可靠交付。丢包不重传，顺序可能乱。|可靠字节流。自动重传丢失的数据，并按顺序交给应用（文件是否传全仍需应用层核对）。|
|**应用场景**|局域网设备发现、游戏实时同步、音视频通话、QUIC(HTTP/3)底层承载。|传大文件、常规 Web 接口数据(HTTP/1.1、HTTP/2)、数据库连接。|

如果你要在 Spring Boot 里面搞这些，常规 HTTP/1.1 或 HTTP/2 请求底层的 TCP 读写其实已经被 Tomcat 这样的 Web 容器封装好了，你不需要自己写 `Socket` 和 `InputStream`，直接写 `@RestController` 处理上传下载接口就行。但局域网 UDP 广播找人的逻辑，通常还是得在后台单独开个线程跑 `DatagramSocket`。

### 参考规范

- [RFC 768《用户数据报协议 (UDP)》](https://www.rfc-editor.org/rfc/rfc768.html)
- [RFC 9293《传输控制协议 (TCP)》](https://www.rfc-editor.org/rfc/rfc9293.html#section-2.2)
- [RFC 9114《HTTP/3》](https://www.rfc-editor.org/rfc/rfc9114.html#section-1.2)