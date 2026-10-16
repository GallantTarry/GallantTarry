# Java基础语法
  
Java 是一门强类型、面向对象的编程语言，语法风格承袭自 C 和 C++，但移除了头文件、指针运算和显式内存释放等复杂特性，强调严谨的结构与跨平台安全性。

## 1. 程序基本结构与入口

Java 中几乎所有代码都必须定义在类（Class）内部。一个标准的源文件结构由包声明、导入语句、类定义和主方法组成：

  



```Java
package com.example.demo; // 1. 包声明（必须在有效代码第一行）

import java.util.Scanner; // 2. 引入外部类（java.lang 包下的类默认自动引入）

/**
 * 3. 类定义：public 类的名称必须与文件名（HelloWorld.java）完全一致
 */
public class HelloWorld {

    // 4. 程序主入口方法，JVM 从这里开始执行
    public static void main(String[] args) {
        System.out.println("Hello, Java!"); // 标准控制台输出并换行
    }
}
```

- **命名规范**：类名使用大驼峰（`UpperCamelCase`），方法名和变量名使用小驼峰（`lowerCamelCase`），常量全大写加下划线（`MAX_VALUE`）。
    
      
    
- **现代化简化（Java 21+）**：在现代 JDK 版本中，支持隐式类和简化的实例主方法，开发小型脚本时可直接写 `void main() { System.out.println("Hello"); }`。
    
      
    

## 2. 数据类型、变量与常量

Java 的数据类型严格分为两大类：**基本数据类型（Primitive Types）**和**引用数据类型（Reference Types）**。

  

### 八大基本数据类型

基本类型直接存储数据值，分配在栈内存（或随对象存储在堆中），没有方法可调用：

  

|**分类**|**类型关键字**|**占用空间**|**默认值（成员变量）**|**字面量书写示例与说明**|
|---|---|---|---|---|
|**整型**|`byte`|1 字节 (8位)|`0`|`byte b = 127;`（范围 -128 到 127）|
|**整型**|`short`|2 字节 (16位)|`0`|`short s = 32000;`|
|**整型**|`int`|4 字节 (32位)|`0`|`int i = 100_000;`（整型默认类型，支持下划线分隔）|
|**整型**|`long`|8 字节 (64位)|`0L`|`long l = 10000000000L;`（末尾必须加 `L`）|
|**浮点型**|`float`|4 字节 (32位)|`0.0f`|`float f = 3.14f;`（末尾必须加 `f`）|
|**浮点型**|`double`|8 字节 (64位)|`0.0d`|`double d = 3.14159;`（浮点默认类型）|
|**字符型**|`char`|2 字节 (16位)|`'\u0000'`|`char c = 'A';`（采用 UTF-16 编码，单引号包裹）|
|**布尔型**|`boolean`|视 JVM 实现|`false`|`boolean flag = true;`（仅限 `true` 或 `false`，不可用 0/1 替代）|

### 变量声明与常量



```Java
// 1. 显式类型声明
int age = 25;
String name = "Java"; // String 属于引用类型（类），用双引号包裹

// 2. 局部变量类型推导（Java 10+ 引入，仅限方法内的局部变量）
var list = new java.util.ArrayList<String>(); 

// 3. 常量声明：使用 final 关键字，赋值后不可修改
final double PI = 3.1415926;
```

### 类型转换

- **隐式转换（自动扩容）**：小范围类型自动转为大范围类型（如 `byte` 转 `short` 转 `int` 转 `long` 转 `float` 转 `double`）。
    
      
    
- **显式转换（强制转型）**：大范围转小范围需要加上括号，可能损失精度或溢出：
    
      
    
    
    
    ```Java
    double price = 99.95;
    int truncatedPrice = (int) price; // 结果为 99，小数部分直接截断
    ```
    

## 3. 运算符与字符串特性

### 核心运算符

- **算术运算**：`+`、`-`、`*`、`/`（整数相除直接舍弃小数）、`%`（取模）、`++`、`--`。
    
      
    
- **关系与逻辑**：`==`、`!=`、大于、小于，以及**短路逻辑运算符** `&&`（与）、`||`（或）、`!`（非）。
    
      
    
- **三元运算符**：`条件表达式 ? 表达式1 : 表达式2`。
    
      
    
- **位运算符**：`&`、`|`、`^`（异或）、`~`（取反）、左移与右移运算符。
    
      
    

### 字符串（`String`）核心准则

Java 中的 `String` 是**不可变对象（Immutable）**，每次拼接都会生成新对象（高频拼接建议使用 `StringBuilder`）：

  



```Java
String s1 = "Hello";
String s2 = new String("Hello");

// 错误做法：== 比较的是两个引用指向的内存地址
boolean isSameRef = (s1 == s2); // false

// 正确做法：使用 equals() 比较字符串的内容值
boolean isSameContent = s1.equals(s2); // true

// 多行文本块（Text Blocks，Java 15+）：无需转义换行和双引号
String json = """
        {
            "language": "Java",
            "version": 21
        }
        """;
```

## 4. 流程控制语句

### 条件分支（`if-else` 与 `switch`）

除了传统的 `if - else if - else`，现代 Java（Java 14+）大幅强化了 `switch`，支持箭头语法并可直接作为表达式返回值，彻底避免了忘写 `break` 导致的穿透问题：

  



```Java
String day = "MONDAY";

// 现代 Switch 表达式（自带阻断，无需写 break）
String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "工作日";
    case "SATURDAY", "SUNDAY" -> "周末";
    default -> {
        System.out.println("未知输入: " + day);
        yield "无效日期"; // 多行代码块中使用 yield 返回值
    }
};
```

### 循环结构（`for`、`while`、`do-while`）



```Java
int[] nums = {10, 20, 30, 40};

// 1. 标准索引循环
for (int i = 0; i < nums.length; i++) {
    if (nums[i] == 20) continue; // 跳过本次循环
    System.out.println(nums[i]);
}

// 2. 增强型 for-each 循环（遍历数组或集合首选）
for (int num : nums) {
    System.out.println(num);
}

// 3. while 循环
int count = 3;
while (count > 0) {
    count--;
}
```

## 5. 数组（Arrays）

Java 的数组是固定长度的容器，一旦创建长度不可更改，分配在堆内存中，通过 `.length` 属性获取长度：

  



```Java
// 1. 静态初始化（声明同时赋值）
int[] scores = {95, 88, 76, 100};

// 2. 动态初始化（指定长度，元素初始化为对应类型的默认值）
String[] names = new String[5]; // 默认全是 null
names[0] = "Alice";

// 3. 二维数组
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};
```

## 6. 方法定义与重载

Java 中的函数统称为**方法（Method）**，必须定义在类内部。Java 参数传递只有**值传递**（基本类型传递值的副本，引用类型传递内存地址引用的副本）。

  



```Java
public class Calculator {

    // 标准方法：[修饰符] 返回值类型 方法名(参数列表)
    public int add(int a, int b) {
        return a + b;
    }

    // 方法重载（Overloading）：方法名相同，但参数个数或类型不同（与返回值无关）
    public double add(double a, double b) {
        return a + b;
    }

    // 可变参数（Varargs）：本质是数组，必须放在参数列表最后一位
    public int sumAll(int... numbers) {
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }
}
```

## 7. 面向对象核心语法（OOP）

### 类、构造器与封装

通过访问控制修饰符保护内部状态，对外暴露方法来操作数据：

  

|**修饰符**|**当前类内部**|**同一个包（Package）**|**不同包的子类**|**全局任意位置**|
|---|---|---|---|---|
|`private`|可访问|不可|不可|不可|
|缺省（不写）|可访问|可访问|不可|不可|
|`protected`|可访问|可访问|可访问|不可|
|`public`|可访问|可访问|可访问|可访问|



```Java
public class User {
    // 成员变量私有化
    private String username;
    private int age;

    // 构造方法（Constructor）：方法名与类名相同，无返回值类型
    public User(String username, int age) {
        this.username = username; // this 指向当前实例对象
        this.age = age;
    }

    // Getter 与 Setter 方法
    public String getUsername() {
        return username;
    }

    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
}
```


> **数据载体类（`record`，Java 16+）**：如果一个类仅用于保存不可变数据，一行代码即可自动生成构造器、`getter`、`equals()`、`hashCode()` 和 `toString()`：
> 
>   
> 
> ``` Java
> public record Point(int x, int y) {}
> // 调用方式：Point p = new Point(10, 20); int x = p.x();
> ```


### 继承、接口与多态

Java 的类只支持**单继承**（`extends`），但支持实现**多个接口**（`implements`）。

  



```Java
// 定义接口（规范契约）
public interface Flyable {
    void fly(); // 默认是 public abstract
    
    // Java 8+ 允许接口定义带有默认实现的方法
    default void checkStatus() {
        System.out.println("状态正常");
    }
}

// 抽象父类
public abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public abstract void makeSound(); // 抽象方法，强制子类实现
}

// 子类：继承抽象类并实现接口
public class Bird extends Animal implements Flyable {

    public Bird(String name) {
        super(name); // 调用父类构造器，必须在第一行
    }

    @Override // 注解：编译器校验是否准确重写了父类/接口方法
    public void makeSound() {
        System.out.println(name + " 叽叽喳喳");
    }

    @Override
    public void fly() {
        System.out.println(name + " 正在扇动翅膀飞行");
    }
}
```

## 8. 异常处理机制

Java 将异常视为对象（全部继承自 `Throwable`），分为必须显式处理的**受检异常（Checked Exception，如 `IOException`）**和运行期才暴露的**运行时异常（RuntimeException，如 `NullPointerException`）**。



```Java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ExceptionDemo {
    
    // throws 声明该方法可能向外抛出的受检异常
    public void checkAge(int age) throws IllegalArgumentException {
        if (age < 0) {
            // throw 手动在方法内部抛出一个异常实例
            throw new IllegalArgumentException("年龄不能为负数");
        }
    }

    public void readFile(String path) {
        // try-with-resources 语法（Java 7+）：括号内的资源会在代码块结束时自动关闭，无需手写 finally 关闭流
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            // 捕获并处理异常（支持用 | 同时捕获多种异常）
            System.err.println("文件读取失败: " + e.getMessage());
        } finally {
            // 无论是否发生异常都会执行的收尾逻辑（除非 JVM 退出）
            System.out.println("读取流程结束");
        }
    }
}
```