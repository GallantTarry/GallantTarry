# @RequestBody在Springboot中到底干了什么？

在 Spring Boot 开发中，`@RequestBody` 默认就是使用 **Jackson** 这个强大的库来将前端传来的 JSON 字符串反序列化（转换）为 Java 对象的。

在这个转换过程中，Jackson 底层确实**非常依赖** Java 对象的**无参构造方法**和 **Setter 方法**。

下面为你简单直白地展示一下这个过程，以及 Lombok 到底帮我们省略了什么。

### 一、 `@RequestBody` 和 Jackson 的工作流程演示

假设前端传来这样一段 JSON 数据：

JSON

```
{
  "username": "admin",
  "age": 25
}
```

如果你不使用 Lombok，你的接收类（DTO 或 Entity）以及 Controller 大概是这样的。看代码里的注释，这就是 Jackson 默默为你做的事情：

Java

```
// 接收前端数据的 DTO
public class UserRequest {
    private String username;
    private Integer age;

    // Jackson 第一步：利用反射调用【无参构造方法】创建一个空的实例
    public UserRequest() {
        // 对象被创建，此时 username 和 age 都是 null
    }

    // Jackson 第二步：解析 JSON 发现有 "username" 字段，于是自动调用 setUsername 方法赋值
    public void setUsername(String username) {
        this.username = username;
    }

    // Jackson 第三步：解析 JSON 发现有 "age" 字段，于是自动调用 setAge 方法赋值
    public void setAge(Integer age) {
        this.age = age;
    }
    
    // (Getter 方法在反序列化时通常用不到，但如果要把对象转换回 JSON 传给前端，Jackson 就会调用 Getter)
    public String getUsername() { return username; }
    public Integer getAge() { return age; }
}
```

Java

```
@RestController
public class UserController {

    @PostMapping("/login")
    // 当请求到达这里时，Jackson 已经通过上面的【无参构造】和【Setter】帮你把数据填充好了
    public String login(@RequestBody UserRequest request) {
        return "欢迎: " + request.getUsername();
    }
}
```

### 二、 实体类用 Lombok 到底省略了什么？

Lombok 实际上是一个编译期的代码生成工具。当你加上 `@Data` 注解时，它会在你编译代码的时候，**自动帮你把上面那一堆繁琐的代码“塞”进 class 文件里**。

#### 1. 使用 Lombok 之前的实体类（又臭又长）

如果没有 Lombok，哪怕只有两个字段，你的类也要写这么长：

Java

```
public class UserEntity {
    private String username;
    private Integer age;

    // 1. 省略了无参构造
    public UserEntity() {}

    // 2. 省略了全参构造
    public UserEntity(String username, Integer age) {
        this.username = username;
        this.age = age;
    }

    // 3. 省略了所有的 Getter
    public String getUsername() { return this.username; }
    public Integer getAge() { return this.age; }

    // 4. 省略了所有的 Setter
    public void setUsername(String username) { this.username = username; }
    public void setAge(Integer age) { this.age = age; }

    // 5. 省略了 equals() 和 hashCode() 方法 (用于对象比较)
    @Override
    public boolean equals(Object o) { /* 默认的一大段比较逻辑 */ }
    @Override
    public int hashCode() { /* 默认的哈希计算逻辑 */ }

    // 6. 省略了 toString() 方法 (用于日志打印，不然打印出来是内存地址)
    @Override
    public String toString() {
        return "UserEntity(username=" + this.username + ", age=" + this.age + ")";
    }
}
```

#### 2. 使用 Lombok 之后的实体类（清爽干净）

只需要一个 `@Data` 注解，上面那几十行代码在编译后都会自动生成：

Java

```
import lombok.Data;

@Data // 这个注解相当于同时加上了 @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
public class UserEntity {
    private String username;
    private Integer age;
}
```

**总结来说：**

`@RequestBody` 背后的 Jackson 需要标准的 JavaBean 规范（也就是要靠无参构造创建对象，靠 Setter 填入数据）。而 Lombok 的 `@Data` 就是用来帮你自动生成这些符合规范的、重复枯燥的 Getter/Setter 模板代码，让你的精力集中在业务和数据结构设计上。