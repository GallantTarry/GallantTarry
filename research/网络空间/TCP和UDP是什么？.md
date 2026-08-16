# TCP和UDP是什么？

这个问题问到了计算机网络的最核心。为了理清它们的关系，我们需要把这些概念放在一个“上下级”的框架里来看。

  

### 属于什么学问？

TCP 和 UDP 属于计算机网络（Computer Networking）**这门学科。具体来说，它们是网络通信标准中的**传输层（Transport Layer）核心协议。

  

### 是网线协议吗？必须插网线吗？

**不是网线协议，也完全不依赖网线。**

  

网线仅仅是底层数据传输的“物理媒介”之一。TCP 和 UDP 作为更高层的协议，它们**根本不在乎**底层到底是用什么材质连在一起的。不管是插网线、连 Wi-Fi、用 5G 蜂窝网络，还是连蓝牙，只要设备底层的物理信号能通，TCP 和 UDP 就能在上面跑。

  

### HTTPS 和它们又是什么关系？

这里有一个非常严谨的“包工头与打工人”关系。我们可以把整个网络传输想象成一个**庞大的跨国物流系统**：

  

|**网络分层**|**扮演的角色**|**代表事物**|**作用**|
|---|---|---|---|
|**物理层/链路层**|**基础设施（马路、航道）**|网线、Wi-Fi、光纤|提供电信号或光信号跑的物理通道。|
|**网络层**|**导航系统**|IP 地址|决定包裹从 A 电脑怎么通过层层路由器找到 B 电脑。|
|**传输层**|**物流派送员（老干部/莽汉）**|**TCP、UDP**|负责真刀真枪地把数据跨网从 A 搬运到 B。|
|**应用层**|**包裹里的货物与包装**|**HTTPS**、HTTP、SSH|决定这些数据到底是网页、压缩包还是远程指令。|

**总结一下它们的配合过程：**

  

HTTPS 并不是用来替代 TCP 的，而是 TCP 的“大客户”。HTTPS 位于应用层，它的核心作用是**给货物打包并上好密码锁（数据加密与格式化）**，然后它会把打包好的货物交给底层干活的 TCP（老干部）。TCP 骑上摩托车，顺着网线或 Wi-Fi（马路），根据 IP 地址（导航），严丝合缝地把加密货物送达。

  

- **TCP 场景：** 比如你用 Spring Boot 写了一个带界面的 Web 接口或者管理后台，最上层暴露给用户的是 HTTP/HTTPS 协议，但底层真正把数据库里的 JSON 数据跨网传给前端的“苦力”依然是 TCP。
    
      
    
- **UDP 场景：** 反过来，当你打《守望先锋2》或者在一个纯净的 Solo Only Rust 服务器里和别人刚枪时，玩家移动、开火这些需要极速反应的操作，底层就会直接雇佣 UDP 这个“莽汉”来一路狂奔，哪怕偶尔丢包也不会重传，因为游戏画面的实时性大于一切。
    
      
    

所以简单来说：**网线是修好的路，TCP/UDP 是路上跑的物流车，而 HTTPS 只是车厢里装的带密码锁的集装箱。**



我们直接把 **Java 下的 UDP 和 TCP** 放在一起对比展示。

  

这两个协议在 Java 里的核心区别，其实就是“无连接的数据报（UDP）”**与**“基于连接的数据流（TCP）”的区别。我们用最精简的代码，模拟一下局域网工具（比如你的 ToolKit）找设备和传文件的完整逻辑。

  

### 第一阶段：找人（UDP 莽汉）

这个阶段的特点是**广撒网、不求确认**。你把自己的信息扔进局域网，不关心谁没收到，只关心谁回复了。

  

#### 1. 发送广播（找人）

这台电脑拿起大喇叭，往局域网里发“寻呼”。

  

Java

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpSender {
    public static void main(String[] args) throws Exception {
        // 创建 UDP 窗口
        DatagramSocket socket = new DatagramSocket();
        socket.setBroadcast(true); // 允许发广播大喇叭

        String msg = "我是少侠的电脑，寻找局域网设备！";
        byte[] data = msg.getBytes("UTF-8");

        // 目标设为全局广播地址，端口设为 8888 暗号
        InetAddress destIp = InetAddress.getByName("255.255.255.255");
        DatagramPacket packet = new DatagramPacket(data, data.length, destIp, 8888);

        // 扔出数据包（不管对方有没有开机，直接发）
        socket.send(packet);
        System.out.println("UDP广播已发送！");
        
        socket.close();
    }
}
```

#### 2. 接收广播（被找到）

手机（或其他设备）在后台静静监听 8888 端口，听到了就说明有设备在找它。

  

Java

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UdpReceiver {
    public static void main(String[] args) throws Exception {
        // 在 8888 端口蹲守
        DatagramSocket socket = new DatagramSocket(8888);
        System.out.println("正在监听 8888 端口，等待呼叫...");

        // 准备一个空数组，用来接住别人扔过来的数据包
        byte[] buffer = new byte[1024];
        DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

        // 阻塞等待，一旦局域网里有人喊话，这里就会收到
        socket.receive(packet);

        // 拆包查看内容
        String receivedMsg = new String(packet.getData(), 0, packet.getLength(), "UTF-8");
        System.out.println("收到消息：" + receivedMsg);
        System.out.println("发件人 IP 是：" + packet.getAddress().getHostAddress());
        
        socket.close();
    }
}
```

### 第二阶段：传文件（TCP 老干部）

当通过上面的 UDP 拿到了对方的 IP 地址后，就可以开始传文件了。这个阶段的特点是**一对一、严丝合缝**。必须双方拉起一条专线（流），哪怕断网也要保证发出去的字节和收到的字节完全一样。

  

#### 1. 服务端（接收文件的手机）

被选中的设备先要变成一个“服务端”，在一个特定端口开门迎客，等待电脑连过来发文件。

  

Java

```
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
    public static void main(String[] args) throws Exception {
        // 在 9999 端口开门迎客
        ServerSocket serverSocket = new ServerSocket(9999);
        System.out.println("TCP 服务端已启动，等待电脑连线传文件...");

        // 阻塞等待，直到电脑（客户端）成功建立连接
        Socket clientSocket = serverSocket.accept();
        System.out.println("连接成功！专线已拉起，开始接收数据...");

        // 获取网络输入流，对方发什么，这里就收到什么
        InputStream in = clientSocket.getInputStream();
        // 获取本地文件输出流，准备把收到的数据写到硬盘里
        FileOutputStream fileOut = new FileOutputStream("D:\\received_file.txt");

        // 一边收网络数据，一边写进硬盘
        byte[] buffer = new byte[1024];
        int len;
        while ((len = in.read(buffer)) != -1) {
            fileOut.write(buffer, 0, len);
        }

        System.out.println("文件接收完毕，一字节不差！");
        fileOut.close();
        in.close();
        clientSocket.close();
        serverSocket.close();
    }
}
```

#### 2. 客户端（发文件的电脑）

电脑拿着刚才 UDP 找到的 IP 地址，主动去连手机的 9999 端口，连上后直接灌文件。

  

Java

```
import java.io.*;
import java.net.Socket;

public class TcpClient {
    public static void main(String[] args) throws Exception {
        // 拿着手机的 IP 和端口，尝试建立 TCP 专线连接
        // 只要不报错，说明三次握手成功
        Socket socket = new Socket("127.0.0.1", 9999); // 实际中填对方真实的 IP
        System.out.println("已连接到手机，准备发送文件...");

        // 获取本地文件输入流，读取要发送的文件
        FileInputStream fileIn = new FileInputStream("D:\\my_video.mp4");
        // 获取网络输出流，准备把文件顺着专线怼过去
        OutputStream out = socket.getOutputStream();

        // 也是一边读硬盘，一边往网线里塞
        byte[] buffer = new byte[1024];
        int len;
        while ((len = fileIn.read(buffer)) != -1) {
            out.write(buffer, 0, len);
        }

        // 发送完成，告诉对方“我发完了”（半关闭）
        socket.shutdownOutput();
        System.out.println("文件发送完毕！");

        fileIn.close();
        out.close();
        socket.close();
    }
}
```

### 核心差别总结表

|**特性**|**Java 中的 UDP (DatagramSocket)**|**Java 中的 TCP (Socket / ServerSocket)**|
|---|---|---|
|**连接机制**|无连接。装进包裹(`DatagramPacket`)直接扔。|有连接。必须 `accept()` 和 `new Socket()` 成功后才能传。|
|**数据形态**|**数据报 (Datagram)**：像信件，一封一封的，独立发送。|**字节流 (Stream)**：像水管，一边开闸放水，一边拿桶接水。|
|**可靠性**|不可靠。丢包不重传，顺序可能乱。|绝对可靠。丢包自动重传，顺序绝对一致。|
|**应用场景**|局域网搜寻、游戏按键同步、视频会议画面。|传大文件、Spring Boot 接口数据、下载器。|

如果你要在 Spring Boot 里面搞这些，TCP 的部分其实已经被 Tomcat 这样的 Web 容器封装成了 HTTP 请求（也就是 HTTPS 那套），你不需要自己写 `Socket` 和 `InputStream`，直接写 `@RestController` 和处理上传下载的接口就行了。但 UDP 找人的逻辑，通常还是得在后台单独开个线程跑 `DatagramSocket`。