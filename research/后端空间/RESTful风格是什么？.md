# RESTful风格是什么？

RESTful 风格其实是一场“从混乱走向秩序”的接口革命。

要理解它为什么会出现，我们就得先穿越回它诞生之前的“远古时代”，看看当年程序员们是怎么受苦的。

### 一、 RESTful 之前：野蛮生长的“动词时代”

在 RESTful 流行之前，大家写接口主要用的是一种叫 **RPC（远程过程调用）** 的风格，或者干脆就是完全没有风格、随心所欲地乱写。

那个时候，开发者把 URL 当成了“函数名”**。URL 里通常写满了**“动词 + 名词”。我们拿你的《拯救公猪》游戏来举例，如果按以前的写法，接口会长这样：

- **新增公猪：** `http://localhost:8080/api/createPig` (方法：POST)
    
- **查询某只公猪：** `http://localhost:8080/api/getPigById?id=1` (方法：GET 或 POST)
    
- **查询所有公猪：** `http://localhost:8080/api/getAllPigs` (方法：GET)
    
- **修改公猪血量：** `http://localhost:8080/api/updatePigHp` (方法：POST)
    
- **删除公猪：** `http://localhost:8080/api/deletePig?id=1` (方法：GET 或 POST)
    

**当时的痛点（为什么不用这种方式了）：**

1. **URL 数量爆炸，极度混乱：** 每一项操作都要新造一个 URL。今天叫 `createPig`，明天换个程序员可能就叫 `addPig`，后天又变成 `insertPig`，前端查接口文档能查到崩溃。
    
2. **完全无视了 HTTP 协议的自带武器：** 那时候大家基本只会用 GET 和 POST。管你是删除、修改还是查询，只要遇到传参数多一点的情况，无脑用 POST；遇到简单的，无脑用 GET。HTTP 协议里本来就有的 PUT、DELETE 全被晾在一边当摆设。
    

### 二、 大厂的重型武器：SOAP（另一种极端）

除了上面那种“草台班子”写法，当年企业级开发（比如银行、大系统）流行过一种叫 SOAP 的协议。

它的规矩极度森严，数据必须包成一层又一层的 XML 格式，甚至还要写一个又臭又长的契约文件（WSDL）。每次发个请求，光是报文外壳就比你要传的真实数据还要大。对于越来越轻量级的 Web 和移动端来说，它实在太笨重了。

### 三、 RESTful 的诞生：大道至简的“资源时代”

到了 2000 年，HTTP 协议的主要设计者之一 Roy Fielding 实在看不下去了。他提出了 REST（Representational State Transfer，表现层状态转化）架构风格。

他提出的核心理念就一句话：**网络上的所有东西都是“资源（名词）”，对资源的操作请用 HTTP 自带的“方法（动词）”来表达！**

于是，画风突变，URL 从“动词”变成了“名词”。前端只需要记住“公猪”这个资源的唯一地址 `/api/pigs`，剩下的事，靠更换 HTTP 的“印章”来解决：

|**业务动作**|**以前的旧式写法 (URL=动词+名词)**|**现代 RESTful 风格 (URL=名词，Method=动词)**|
|---|---|---|
|**新增**|POST `/api/createPig`|**POST** `/api/pigs`|
|**查询(单个)**|GET `/api/getPigById?id=1`|**GET** `/api/pigs/1`|
|**查询(全部)**|GET `/api/getAllPigs`|**GET** `/api/pigs`|
|**修改**|POST `/api/updatePigHp`|**PUT** `/api/pigs/1`|
|**删除**|GET `/api/deletePig?id=1`|**DELETE** `/api/pigs/1`|

### 四、 RESTful 为什么能一统江湖？

1. **接口极度精简：** 以前 5 个不同的 URL，现在全合并成了 1 到 2 个 URL（`/api/pigs` 和 `/api/pigs/{id}`）。前端闭着眼睛都能猜到接口路径。
    
2. **语义清晰，见名知意：** 后端看到前端发来一个 `DELETE /api/pigs/99`，不用看代码就知道这是要干掉 99 号公猪，分工极其明确。
    
3. **完美契合 JSON：** 抛弃了臃肿的 XML，配合轻量级的 JSON 格式，传输速度极快。
    

简而言之，少侠，RESTful 风格就是**给当年杂乱无章的后端接口制定了一套“普通话”**。它强迫大家把业务动作收敛到 HTTP 自带的四个动词里，让整个网络请求变得优雅又干净。

既然你已经打通了 `DELETE` 的任督二脉，那咱们干脆一口气把 Spring Boot 里最核心的“四大金刚”全部拿下！

在 RESTful 风格里，后端的接口就是一个完整的 **CRUD（增删改查）** 套装。为了让你一次性看全，我们直接写一个完整的《拯救公猪》后端的 `PigController`。

这四大注解分别是：`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`。

### 完整的 Spring Boot 接口模板

少侠，请直接看这段代码，这是后端开发每天都要写无数遍的“标准起手式”：

Java

```
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pigs") // 统一前缀，所有接口都以 /api/pigs 开头
public class PigController {

    // ==========================================
    // 1. GET (查全部)：获取所有公猪列表
    // 对应前端: axios.get('/api/pigs')
    // ==========================================
    @GetMapping
    public List<Pig> getAllPigs() {
        System.out.println("前端正在查询所有公猪数据...");
        // 实际开发中：return pigService.list();
        return null;
    }

    // ==========================================
    // 2. GET (查单个)：获取某一只具体公猪的信息
    // 对应前端: axios.get('/api/pigs/99')
    // ==========================================
    @GetMapping("/{id}")
    public Pig getPigById(@PathVariable("id") Long id) {
        System.out.println("前端正在查询 ID 为 " + id + " 的公猪...");
        // 实际开发中：return pigService.getById(id);
        return null;
    }

    // ==========================================
    // 3. POST (增)：新增一只公猪
    // 对应前端: axios.post('/api/pigs', { name: '战斗猪', hp: 100 })
    // ==========================================
    @PostMapping
    public String createPig(@RequestBody Pig newPig) {
        // @RequestBody 的作用是把前端传过来的 JSON 数据，自动变成 Java 的 Pig 对象
        System.out.println("前端发来了一只新猪，名字叫：" + newPig.getName());
        // 实际开发中：pigService.save(newPig);
        return "新增成功！";
    }

    // ==========================================
    // 4. PUT (改)：修改某一只公猪的数据（比如升级加血）
    // 对应前端: axios.put('/api/pigs/99', { hp: 200 })
    // ==========================================
    @PutMapping("/{id}")
    public String updatePig(@PathVariable("id") Long id, @RequestBody Pig updatedPig) {
        // PUT 是最特殊的，它既需要知道“改哪只猪”（用 @PathVariable 拿 ID），
        // 又需要知道“改成什么样”（用 @RequestBody 拿 JSON 数据）
        System.out.println("准备把 ID 为 " + id + " 的公猪，血量修改为：" + updatedPig.getHp());
        // 实际开发中：pigService.updateById(id, updatedPig);
        return "修改成功！";
    }

    // ==========================================
    // 5. DELETE (删)：删除某一只公猪
    // 对应前端: axios.delete('/api/pigs/99')
    // ==========================================
    @DeleteMapping("/{id}")
    public String deletePig(@PathVariable("id") Long id) {
        System.out.println("准备删除 ID 为 " + id + " 的公猪");
        // 实际开发中：pigService.removeById(id);
        return "删除成功！";
    }
}
```

### 少侠必背：Spring Boot 接参“三板斧”

看完了上面的代码，你会发现 HTTP 动作虽然有 4 种，但后端去抠前端传来的数据，用的武器其实只有 3 把。少侠务必把这三把武器分清：

|**注解名称**|**数据长什么样？(URL / Body)**|**适用场景**|
|---|---|---|
|**`@PathVariable`**|`/api/pigs/`**`99`**|前端把参数直接写在路径里。专门用来**定位某一个**具体的资源（查单个、修改、删除）。|
|**`@RequestParam`**|`/api/pigs/search?`**`keyword=战斗猪`**|前端用问号 `?` 拼接在 URL 后面。专门用来做**搜索、筛选、分页**。|
|**`@RequestBody`**|`{"name":"战斗猪", "hp":100}`|前端把一大坨复杂数据塞在 HTTP 包的**身体（Body）**里发过来，绝对不会出现在 URL 里。专门用于 **POST (新增)** 和 **PUT (修改)**。|

> **核心心法总结：**
> 
> 前端用 Axios 发出 `GET` / `POST` / `PUT` / `DELETE`。
> 
> 后端在类上挂 `@RequestMapping` 定基调，在方法上挂 `@GetMapping` / `@PostMapping` 等注解精准接客。



当然这些还是仅仅不够的，有一天你会发现，前端传进来的东西和entity实体类的根本对不上，很多变量名不一致或数据结构不匹配，那么就需要新建一个全新的java类**DTO** 全称是 **Data Transfer Object（数据传输对象）**。在另一篇文章会再详细讲述这个科班方法。