# 深入理解RequestBody

在 Spring Boot 后端工程中，处理前端提交的 JSON 请求体时，控制器方法参数上的 **`@RequestBody`** 是使用频次最高的核心注解。

Spring MVC 在底层默认使用 **Jackson (`ObjectMapper`)** 库来完成 JSON 字符串到 Java 对象的反序列化（Deserialization）过程。然而，很多开发者对底层“无参构造”、“Setter 方法”以及 Lombok 注解的协作机制存在认知偏差，甚至在项目中踩入高频的运行时崩溃陷阱。

---

## 一、 `@RequestBody` 与 Jackson 反序列化底层真相

假设前端发起一个 `POST /api/login` 请求，并携带如下 JSON 载荷（Payload）：

```json
{
  "username": "admin",
  "age": 25
}
```

### 1. 传统 JavaBean 规范下的反序列化流程
若使用纯原生 Java 类接收数据，代码与 Jackson 的协作时序如下：

```java
// 接收前端数据的 DTO / Request VO
public class UserRequest {
    private String username;
    private Integer age;

    // 第一步：实例化。Jackson 默认通过反射调用【无参构造方法】在堆内存中创建空对象
    public UserRequest() {
        // 此时内部字段均为默认值：username=null, age=null
    }

    // 第二步：属性注入。Jackson 解析 JSON 键名，优先查找并调用匹配的 setUsername 方法
    public void setUsername(String username) {
        this.username = username;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    // 序列化输出为 JSON 时使用 Getter；反序列化时若存在 Setter 则主要靠 Setter 赋值
    public String getUsername() { return username; }
    public Integer getAge() { return age; }
}
```

```java
@RestController
public class UserController {

    @PostMapping("/login")
    // 请求进入该方法前，Spring 的 RequestResponseBodyMethodProcessor 触发 HttpMessageConverter
    // 调用 Jackson 完成 JSON 解析与对象装配
    public String login(@RequestBody UserRequest request) {
        return "欢迎: " + request.getUsername() + ", 年龄: " + request.getAge();
    }
}
```

---

### 2. 澄清误区：Jackson 真的“必须依赖 Setter 方法”吗？

很多教程断言“没有 Setter 方法 Jackson 就无法注入数据”，**这在现代 Jackson 框架中是不准确的**：

- **反射暴力访问私有字段**：Jackson 默认的可见性检查器（`VisibilityChecker`）具备极高的灵活性。即使你的类中**完全没有写任何 Setter 方法**，Jackson 依然可以通过反射获取字段对象，并调用 `Field.setAccessible(true)` 强行将 JSON 中的数据注入到对象的私有成员变量中；
- **全参构造器直接绑定（不可变对象）**：配合 `@JsonCreator` 和 `@JsonProperty` 注解，或者 Java 14+ 引入的不可变数据载体 `Record`，Jackson 可以直接将 JSON 字段映射到构造参数上，实现**既无需无参构造、也无需任何 Setter 的不可变（Immutable）对象反序列化**。

---

## 二、 致命崩溃陷阱：Lombok `@Data` 到底省略了什么？

为了摆脱冗长重复的模板代码，Java 开发者广泛引入了 Lombok 插件。

### 1. `@Data` 注解的真实内涵
许多初学者误以为加了 `@Data` 就会自动生成无参构造。看一看 Lombok 官方对 `@Data` 的等价拆解：

$$\text{@Data} \iff \text{@Getter} + \text{@Setter} + \text{@ToString} + \text{@EqualsAndHashCode} + \mathbf{\text{@RequiredArgsConstructor}}$$

- 注意：它默认生成的并不是纯粹的无参构造，而是 **`@RequiredArgsConstructor`**！
- 只有当类中**既没有 `final` 属性**、**也没有 `@NonNull` 属性**，且**没有手写任何其他构造函数**时，`@RequiredArgsConstructor` 碰巧表现为一个无参构造。此时 Jackson 可以正常实例化对象。

---

### 2. 生产级高频事故：无参构造被意外“抹除”

这是 Spring Boot 开发者在做重构或联调时最常踩中、且编译期完全不报错的运行时血案：

```java
@Data
@AllArgsConstructor // 💥 危险引线：为了单元测试方便，开发者加了一个全参构造
public class UserRequest {
    private String username;
    private Integer age;
}
```

#### 💥 崩溃现场与报错堆栈：
一旦类中被显式加上了 `@AllArgsConstructor` 或任何自定义构造函数：
1. 根据 Java 编译规则与 Lombok 的设计逻辑，**默认的无参构造函数立刻被彻底撤销**；
2. 当 HTTP 请求到达 Controller，Jackson 试图通过反射寻找默认无参构造器，结果扑空；
3. Jackson 抛出经典致命异常，接口直接向前端返回 500 / 400 错误：

```text
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: 
Cannot construct instance of `com.example.dto.UserRequest` (no Creators, like default constructor, exist): 
cannot deserialize from Object value (no delegate- or property-based Creator)
 at [Source: (PushbackInputStream); line: 2, column: 3]
```

---

## 三、 企业级工程规范与最佳实践

为了在享受 Lombok 清爽代码的同时，彻底规避 Jackson 反序列化崩溃隐患，在编写所有由 `@RequestBody` 接收的 DTO / RequestVO 类时，必须遵循以下标准规范：

### 黄金组合：标配 `@NoArgsConstructor`

```java
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor           // 核心兜底：强制显式生成无参构造，供 Jackson / 反射框架安全实例化
@AllArgsConstructor         // 便于业务代码全参赋值与单元测试构建
@Builder                    // 支持链式流式构建对象
public class UserRequest {
    private String username;
    private Integer age;
}
```

### 核心结论速记
1. `@RequestBody` 核心依赖 Jackson 的**实例化（无参构造）**与**属性赋值（Setter 或反射直接写入）**；
2. Lombok 的 `@Data` **绝不等于安全的无参构造**，一旦配合 `@AllArgsConstructor` 或手写构造函数，无参构造会被隐式抹除；
3. **黄金铁律**：所有用于接口数据传输的实体类，一律显式标注 **`@NoArgsConstructor`**！
