# springboot基本的数据流是什么？

那么之前说到的MP技术，三层架构技术，以及RESTful风格等，现在就要给一个可以运行的后端代码了，从此中感受数据流以及技术的迭代更新有多便捷。

前端发送JSON数据比如  `{username: "土块", age: 25}`

```java
@PostMapping
public Result<String> createUser(@RequestBody User user) {
    userService.save(user); // 注意这一行
    return Result.success();
}
```

那么`@RequestMapping("/api/users")`，这里就是@PostMapping也就是新增，那么他统一返回一个Result字符串类型，方法名为createUser请求体为对象类型User。

那么其实他只调用了一句话也就是    `userService.save(user)`，最奇怪的是根本没写过。
我只有一个UserSrvice的接口，很奇怪这个方法是从哪里来的呢？

让我们回到UserController里

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService; // 👈 秘密就在这一行！

    // ... 下面是你的增删改查方法
}
```

这是最经典的变量声明，也是自动注入，也就是多态，也是控制反转的体现。

那么回到之前学的 A接口 a 是变量声明    遥控器 接口引用a需要指向对象

在 Java 里有一条铁律：**接口（Interface）永远、永远、永远不能用来直接造对象！** 如果你敢在代码里写 `new UserService()`，Java 编译器会直接给你亮红灯报错。


因为接口只是一张“图纸”、一份“说明书”、一个空壳的“遥控器”，它里面没有任何具体的实现逻辑，你怎么可能把一张图纸变成一台真正的机器呢？

  
那么问题来了：既然接口不能造对象，那 `UserController` 里的这个 `userService` 到底是从哪冒出来的？

  

### 幕后黑手是 Spring Boot 的“依赖注入”

你能在 Controller 里直接用 `userService` 干活，并不是接口自己造了对象，而是 **Spring 框架在后台偷偷塞了一个真实的对象给它**。

  

我们把之前你代码里的几个关键线索串起来，看看这出戏是怎么演的：

  

**第一步：大厨在后厨登记（造出真实对象）** 你去看一眼你的 `UserServiceImpl.java` 文件，它的类名正上方写着一个 **`@Service`** 注解。 这个注解就是在向 Spring 框架大喊：“系统启动的时候，请帮我把 `UserServiceImpl` 这个类 **`new`** 出一个真实的实体对象，并保存在你的内存仓库里！” 所以，**真正被造出来的对象，是实现类 `UserServiceImpl`，而不是接口。**

  

**第二步：服务员在前台要人（声明接口变量）** 在你的 `UserController.java` 里，你写了这样两行：

  

Java

```
@Autowired
private UserService userService;
```

这里的 `UserService userService` 仅仅是你拿出了一个**空的万能遥控器（变量声明）**，目前它里面什么都没有。

  

**第三步：Spring 自动牵线搭桥（@Autowired 的魔法）**

你头顶上的 **`@Autowired`** 发挥作用了！它像是一个智能红娘，它的潜台词是：“Spring 大哥，我这里需要一个能满足 `UserService` 接口标准的真实对象，你仓库里有吗？给我拿过来用！”

  

此时，Spring 去仓库里一翻，发现：“哎，正好刚才那个贴着 `@Service` 的 `UserServiceImpl` 对象，就是实现了 `UserService` 接口的！”

于是，Spring 自动把后台造好的 `UserServiceImpl` 真实对象，塞进（赋值）了你前台声明的 `userService` 遥控器里。

  

### 用最原始的 Java 代码还原真相

如果把 Spring Boot 施加的 `@Service` 和 `@Autowired` 魔法全部撤掉，让你自己手写，这几行代码其实等价于咱们最开始聊的“接口引用指向实现类对象”（多态）：

  

Java

```
// 等价于你手写了这行代码：
UserService userService = new UserServiceImpl();
```

看到了吗？

  

- 左边的 `UserService` 是接口声明（遥控器）。
    
      
    
- 右边的 `new UserServiceImpl()` 才是真正造出来的对象（电视机）。
    
      
    

所以，**并不是接口造了对象，而是 Spring 框架默默地帮你造了一个实现类的对象，并自动把它挂在了接口变量的名下！** 这种设计模式在开发中有一个极其著名的名字，叫做 **IoC（控制反转）**，也就是你不再亲自去 `new` 对象了，统统交由 Spring 框架来帮你控制和匹配。

---

好了，又绕了一大圈回来了，这里呢还是要说     `userService.save(user);`
这个到底干了什么呢？


我们继续顺着这根“电线”，把 `createUser` 的这 6 步连环反应完整扒开：

  
### 第 1 步：前端发请求与 JSON 翻译 (Controller 层)

1. 前端（比如一个注册页面）打包了一份包含新用户信息的 JSON 数据发送给后端。
    
      
    
2. 你的 `UserController` 因为头上顶着 `@RequestMapping("/api/users")`，再加上方法上的 `@PostMapping`，精准拦截到了这个代表“新增用户”的请求。
    
      
    
3. 关键的翻译官 `@RequestBody User user` 开始工作，它把前端发来的纯文本 JSON，完美地翻译成了 Java 内存里的 `User` 实体对象。
    
      
    

### 第 2 步：Controller 呼叫业务层

翻译完成后，代码往下走，执行到了最核心的一句：`userService.save(user);`。 这里的 `userService`，是 Spring 框架自动帮你注入进来的、那个带有 `@Service` 标签的 `UserServiceImpl` 真实对象。Controller 像个接线员一样，把装满数据的 `user` 对象直接扔给了业务层。

  

### 第 3 步：进入 MP 父类寻找方法 (ServiceImpl 层)

程序跑到了你的 `UserServiceImpl` 里面，准备执行 `save` 方法。 但是它左看右看，发现你手写的代码里只有 `login` 方法，根本没有 `save`。 于是，程序顺着类定义里的 `extends ServiceImpl<UserMapper, User>`，一头钻进了 MyBatis-Plus 官方写好的 `ServiceImpl` 父类源码中。

  

### 第 4 步：父类将任务移交给 Mapper (Mapper 层)

在 MP 官方的 `ServiceImpl` 源码里，确实存在一个写好的 `save` 方法。这个方法内部大意的逻辑是： `return baseMapper.insert(entity);` 因为它知道自己不负责连数据库，所以它把任务推给了 `baseMapper`。由于你刚才在继承时，把 `UserMapper` 作为泛型传给了它，所以这里的指令就变成了：呼叫 `UserMapper` 去执行 `insert(user)`！

  

### 第 5 步：动态代理与实体类解剖 (核心魔法爆发)

指令来到了 `UserMapper`。因为 `UserMapper` 继承了 `BaseMapper<User>`，Spring 的动态代理机器假人接管了工作，开始疯狂解剖你传过来的 `User` 对象：

  

1. **找表名：** 机器看了看 `User` 类，一眼就看到了类头顶上的 `@TableName("sys_user")`，确定了数据要写进 `sys_user` 表。
    
      
    
2. **处理主键：** 机器看向了 `id` 属性，发现了 `@TableId(type = IdType.AUTO)`。机器立刻明白：“哦！主键是自增的，那我等下生成 SQL 的时候，千万不要把 ID 写进去，让 MySQL 自己去递增就行了！”。
    
      
    
3. **提取数据：** 机器把 `user` 对象肚子里的 `username`、`password`、`nickname`、`age` 的具体值全掏出来。
    
      
    

### 第 6 步：SQL 拼装、执行与统一返回

结合解剖得到的情报，MP 底层在内存里瞬间拼装出了一条完美的 SQL 语句：

`INSERT INTO sys_user (username, password, nickname, age) VALUES (?, ?, ?, ?)`

_(其中的 `?` 会被替换成刚才掏出来的真实数据)_。

  

最后，这条 SQL 通过 JDBC 网络通道发给 MySQL。MySQL 执行成功后，原路返回信号给 Controller，最后一行代码 `return Result.success();` 执行，调用你在 `Result.java` 中写好的无参快捷方法，给前端返回一个状态码为 200、消息为“操作成功”的 JSON 响应。



同理我也展示一下删的操作

```java
// 5. 删 - 删除记录  
@DeleteMapping("/{id}")  
public Result<String> deleteUser(@PathVariable Long id) {  
    userService.removeById(id);  
    return Result.success();  
}
```
  

你之所以在自己的代码里找不到 `removeById(id)` 这个方法到底是怎么实现的，是因为**你把写代码的脏活儿全部“外包”给了 MyBatis-Plus（MP）的官方父类。**

  
  

### 第 1 步：Controller 发起呼叫

当前端发送一个删除请求时，你的 `UserController` 会通过 `@DeleteMapping("/{id}")` 拦截到这个请求。 接着，代码执行到了这一行：`userService.removeById(id);`。 这里的 `userService`，是通过 `@Autowired` 自动注入进来的真实业务对象。

  

### 第 2 步：顺藤摸瓜找到 ServiceImpl

这个 `userService` 到底是个什么对象呢？它实际上就是打了 `@Service` 注解的 `UserServiceImpl` 类的实例。 但是，如果你打开 `UserServiceImpl` 的代码，你会发现里面只有你手写的 `login` 方法，根本没有 `removeById`。

  

**那方法去哪了？** 秘密就在类名后面的这句代码里：`extends ServiceImpl<UserMapper, User>`。 你的 `UserServiceImpl` 直接继承了 MP 官方提供的 `ServiceImpl` 父类。当你调用 `removeById(id)` 时，Java 虚拟机在你的 `UserServiceImpl` 里找不到这个方法，就会**自动跑到它的父类 `ServiceImpl` 的源码包里去执行**。

  

### 第 3 步：MP 父类底层移交任务给 Mapper

在 MP 官方的 `ServiceImpl` 源码里，早就写好了 `removeById` 的实现逻辑。它在底层的真实运行代码大意是这样的：

`return baseMapper.deleteById(id);`

  

那么这个 `baseMapper` 是谁呢？ 回看你的继承代码：`extends ServiceImpl<UserMapper, User>`。你把 `UserMapper` 当作参数交给了父类。所以，父类此时实际上是在调用你的 `UserMapper`。

  

### 第 4 步：Mapper 触发动态代理拼接 SQL

程序现在运行到了 `UserMapper`。 你的 `UserMapper` 接口继承了 `BaseMapper<User>`。当程序要执行 `deleteById` 时，Spring 底层的动态代理机器开始工作了：

  

1. 它看到你要操作的是 `User` 这个实体类。
    
      
    
2. 它跑去检查你的 `User` 类，看到了 `@TableName("sys_user")`，知道了要去删除 `sys_user` 这张表。
    
      
    
3. 它又看到了 `id` 属性上面打了 `@TableId` 注解，确认了 `id` 就是这张表的主键。
    
      
    

### 第 5 步：生成 SQL 并发给 MySQL

结合上面的所有线索，MP 在内存里瞬间自动拼接出了一条原生 SQL 语句： `DELETE FROM sys_user WHERE id = ?` （这里的 `?` 就是你从 Controller 传进来的那个 `id` 值）。

  

最后，底层通过 JDBC 网络连接，把这条 SQL 发送给了 MySQL 数据库去执行。删除成功后，原路返回给你的 Controller，最终执行 `return Result.success();`。

  

**总结：** 你虽然只写了一句 `userService.removeById(id);`，但它实际上是沿着 **“Controller -> MP官方的 ServiceImpl 父类 -> 你的 UserMapper -> MP底层的 SQL 拼接器 -> MySQL 数据库”** 这个链条在狂奔。