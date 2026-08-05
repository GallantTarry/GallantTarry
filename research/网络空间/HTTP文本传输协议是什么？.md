# HTTP文本传输协议是什么？

**HTTP (HyperText Transfer Protocol)** 是互联网的数据快递系统。它本质上是一个**基于“请求-响应”模式、无状态的文本传输协议**。

当前端代码发出一个请求，在网线的底层，它其实是一段纯文本。一个完整的 HTTP 请求报文长这样：

HTTP

```
POST /api/users HTTP/1.1
Host: www.example.com
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Authorization: Bearer token123
Content-Length: 33

{"name": "shaoxia", "level": 99}
```

**原样式拆解：**

> `POST /api/users HTTP/1.1`

这是整个包裹的“灵魂”，决定了包裹的命运。

- **`POST`**：动作指令。告诉服务器，“我是来提交新数据的”。当它到达 Spring Boot 时，框架会全网搜寻标有 `@PostMapping` 的方法。
    
- **`/api/users`**：目标路径。RESTful 风格的标准写法，表示操作的资源是“用户列表”。在 Spring Boot 中，它对应 `@RequestMapping("/api/users")`。
    
- **`HTTP/1.1`**：协议版本。告诉服务器：“我是按 1.1 版本的规矩打包的，请按 1.1 的规矩拆”。（现在也有 HTTP/2 和 HTTP/3，但 1.1 依然是文本报文里最经典的格式）。
    

### 2. 路由与定位层（请求头）

> `Host: [www.example.com](https://www.example.com)`

- **为什么要这行？** 你可能会问，既然包裹已经发到服务器的 IP 地址了，干嘛还要写域名？
    
- **底层真相：** 因为一台物理服务器（同一个 IP）上，可能会同时运行成百上千个不同的网站。`Host` 就像是这栋大楼里的“门牌号”，Nginx 或 Tomcat 这样的网关软件看到它，才知道要把包裹准确地丢给哪个网站程序。
    

### 3. 数据解析说明书（请求头）

> `Content-Type: application/json`
> 
> `Content-Length: 33`

这两行是紧密配合的“拆包指南”。

- **`Content-Type`**：极其重要！它告诉后端的 Jackson 解析器：“嘿，底下的正文是 JSON 格式，请用 JSON 的规则去解析它”。如果这里写错了（比如写成 `text/plain`），你的 `@RequestBody` 就会直接报错或者接到 `null`。
    
- **`Content-Length`**：告诉服务器底下的正文**精确到字节的长度**（33 个字节）。因为底层网络传输是“水流”一样的字节流（TCP 协议），服务器依靠这个数字，数到第 33 个字节就立刻“咔嚓”剪断，防止把下一个请求的数据给粘连进来。
    

### 4. 身份与安全层（请求头）

> `Authorization: Bearer token123`

这是现代互联网保持登录状态的“VIP 通行证”。

- **背景：** HTTP 协议是个“脸盲（无状态）”，你刚才登录成功了，紧接着发这个 POST 请求，它是不认识你的。
    
- **运作机制：** 你登录成功时，后端会给你颁发一串加密字符串（也就是 Token，比如最流行的 JWT）。之后你每次发请求，前端代码（axios）都会自动把这串 Token 塞进 `Authorization` 头里。
    
- **`Bearer` 是什么？** 这是一个行业规范的单词（意思是“持票人”）。翻译过来就是：“我持有这张叫 token123 的门票”。
    
- **后端如何处理：** 请求还没到你的 Controller，就会被 Spring Boot 的“保安（拦截器/过滤器）”拦下。保安检查这串 Token 是真的、且没过期，才会放行让你的代码执行。
    

### 5. 客户端画像（请求头）

> `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...`

- 这是客户端在“自报家门”。告诉服务器你是用 Windows 10 系统、64 位架构、基于火狐/Chrome 内核的浏览器发出的请求。
    
- **实际用途：** 后端可以根据这个决定给你返回 PC 版还是手机版的页面；或者用来做大数据统计（统计咱们游戏有多少 PC 端玩家）；很多反爬虫机制也是靠识别这个字段来判断你是真人还是机器脚本的。
    

### 6. 物理结界（空行）

> `(这里有一个看不见的回车换行 \r\n)`

- 绝对不能少的一行。服务器底层是用一个 `while` 循环在逐行读文本，当它读到一个**完全空白的行**时，循环就会打破，服务器就知道：“面单读完了，下面全是实体物品了！”
    

### 7. 业务核心数据（请求体 Body）

> `{"name": "shaoxia", "level": 99}`

- 这就是你要提交的真金白银的数据。
    
- 经历了前面所有步骤的重重关卡（路由分发、Token 校验、读取长度），这串 JSON 最终交到了 `@RequestBody` 手里，被完美地转换成了少侠你手写的 `UserRegisterDTO` 对象！


