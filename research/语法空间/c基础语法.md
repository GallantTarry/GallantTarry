# C基础语法


C 语言是一门通用的、过程式的底层系统编程语言。它诞生于 20 世纪 70 年代，直接影响了后世的 C++、Java、Go 等几乎所有现代主流语言。与 Java 的“一切皆对象”和自动垃圾回收不同，C 语言的核心哲学是**贴近硬件、信任程序员、零运行时开销**——它提供了直接操作内存地址（指针）和手动管理内存的能力。

  

## 1. 程序基本结构与编译预处理

C 语言没有“类”的概念，程序由一个个**函数（Function）**和**变量**组成，且必须有且仅有一个 `main` 函数作为执行入口。

  



```C
#include <stdio.h>   // 预处理指令：引入标准输入输出头文件

#define MAX_COUNT 100 // 预处理指令：定义宏常量（编译前直接文本替换）

// 主函数：C 程序执行的唯一入口，返回 int 类型状态码给操作系统
int main(void) {
    printf("Hello, C World! Max is %d\n", MAX_COUNT);
    return 0; // 返回 0 表示程序正常退出，非 0 通常表示异常
}
```

- **预处理指令（以 `#` 开头）**：在真正编译之前由预处理器执行。尖括号引用系统标准库（如 `stdio.h`），双引号引用自定义头文件（如 `"my_tool.h"`）。
    
      
    
- **编译四阶段**：C 源码（`.c`）需经历 **预处理（Preprocessing）**、**编译（Compilation）**、**汇编（Assembly）** 和 **链接（Linking）** 四个阶段，最终直接生成机器码可执行文件，无需虚拟机即可运行。
    
      
    

## 2. 数据类型、变量与常量

C 语言是静态弱类型语言，所有变量必须先声明后使用。与 Java 固定各类型字节数不同，C 语言标准只规定了基本类型的**最小取值范围**，具体字节大小取决于编译器和操作系统架构（以下以现代主流 64 位系统为例）：

  

### 核心基本数据类型

|**类型分类**|**关键字**|**64位系统典型占用**|**printf 格式化占位符**|**说明与修饰符特性**|
|---|---|---|---|---|
|**字符型**|`char`|1 字节 (8位)|`%c` (字符) / `%d` (整数)|本质是小整数，存储 ASCII 码（如 `'A'` 对应 65）|
|**短整型**|`short`|2 字节 (16位)|`%hd`|等价于 `short int`|
|**整型**|`int`|4 字节 (32位)|`%d`|最常用的整数类型|
|**长整型**|`long`|4 或 8 字节|`%ld`|Windows 64位下为 4 字节，Linux/macOS 64位下为 8 字节|
|**超长整型**|`long long`|8 字节 (64位)|`%lld`|C99 标准引入，保证至少 64 位|
|**无符号整型**|`unsigned int`|4 字节 (32位)|`%u`|整数类型前均可加 `unsigned`，取消符号位使正数范围翻倍|
|**单精度浮点**|`float`|4 字节 (32位)|`%f`|有效数字约 6~7 位|
|**双精度浮点**|`double`|8 字节 (64位)|`%lf` (输入) / `%f` (输出)|浮点字面量默认类型，有效数字约 15~17 位|
|**布尔型**|`bool` (`_Bool`)|1 字节|`%d`|需引入 `stdbool.h` 头文件才可使用 `bool`、`true`、`false`|

> **工程实践提示（跨平台固定宽度整数）**：为消除不同平台下 `int` 和 `long` 长度不一致的问题，现代 C 语言（C99 起）推荐引入 `stdint.h`，直接使用精确宽度的类型：`int8_t`、`int32_t`、`uint64_t` 等。
> 
>   

### 变量声明、未初始化风险与常量



```C
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

int global_var; // 全局变量：位于静态存储区，默认自动初始化为 0

int main(void) {
    // 1. 局部变量必须显式初始化！否则其值是当前栈内存遗留的随机“垃圾值”
    int age = 25;
    uint32_t flags = 0xFF;
    bool is_ready = true;

    // 2. 只读变量（常量）：使用 const 修饰，编译期校验不可修改
    const double PI = 3.1415926;

    // 3. sizeof 运算符：在编译期计算类型或变量占用的字节数（返回 size_t 类型，用 %zu 打印）
    printf("int 占用字节数: %zu\n", sizeof(int));
    return 0;
}
```

- **`static` 关键字的双重含义**：
    
      
    1. 修饰**函数内的局部变量**时：将该变量的生命周期延长至整个程序运行期间（存储在静态区而非栈区），且只在第一次进入函数时初始化一次。
        
          
        
    2. 修饰**全局变量或函数**时：将其作用域限制在**当前源文件内部**，对其他 `.c` 文件隐藏（避免命名冲突）。
        
          
        

## 3. 运算符与格式化输入输出

### 常用运算符

- **算术与自增**：`+`、`-`、`*`、`/`（两整数相除直接截断小数）、`%`（取模，仅限整数）、`++`、`--`。
    
      
    
- **关系与逻辑**：`==`、`!=`、大于、小于，短路逻辑与 `&&`、短路逻辑或 `||`、逻辑非 `!`。
    
      
    
- **位运算符（底层开发高频使用）**：按位与 `&`、按位或 `|`、按位异或 `^`、按位取反 `~`、左移与右移。
    
      
    

### 标准输入输出（`printf` 与 `scanf`）

C 语言通过标准库 `stdio.h` 进行控制台交互。调用 `scanf` 读取基本类型变量时，**必须传入变量的内存地址（使用 `&` 取址符）**：

  



```C
int num = 0;
double score = 0.0;

printf("请输入一个整数和一个浮点数（空格分隔）: ");
// 注意：num 和 score 前面必须加 &，告诉 scanf 把数据写入哪块内存地址
if (scanf("%d %lf", &num, &score) == 2) {
    printf("你输入的整数是: %d, 浮点数保留两位小数是: %.2f\n", num, score);
}
```

## 4. 流程控制语句

### 真假判定规则与分支

C 语言在早期没有布尔类型，其底层规则至今保留：**数值 `0`（或空指针 `NULL`）代表“假”，任何非 `0` 值均代表“真”**。

  



```C
int count = 5;

// 1. if-else 分支
if (count) { // count 非 0，判定为真
    printf("count 不为 0\n");
} else {
    printf("count 为 0\n");
}

// 2. switch 分支（表达式必须是整型或字符型/枚举，不支持字符串！）
char grade = 'A';
switch (grade) {
    case 'A':
        printf("优秀\n");
        break; // 必须手动写 break，否则会发生 case 穿透执行下一分支
    case 'B':
    case 'C':
        printf("良好或及格\n");
        break;
    default:
        printf("未知等级\n");
        break;
}
```

### 循环结构（`for`、`while`、`do-while`）



```C
// C99 标准起支持在 for 循环圆括号内直接声明循环变量 i
for (int i = 0; i != 5; i++) {
    if (i == 2) continue; // 跳过本次迭代
    if (i == 4) break;    // 提前终止整个循环
    printf("i = %d\n", i);
}
```

## 5. 数组与字符串的底层本质

### 数组（Array）

C 语言的数组是一块**连续的内存空间**，没有任何内置的属性（没有 `.length`）和越界检查机制。一旦访问越界，会直接读写相邻内存，导致数据污染或段错误（Segmentation Fault）。

  



```C
// 1. 声明并完整初始化
int arr[5] = {10, 20, 30, 40, 50};

// 2. 声明并将所有元素快速清零（第一个元素赋 0，其余未指定元素自动补 0）
int zero_arr[100] = {0};

// 3. 计算数组长度的经典惯用法：总字节数除以单个元素字节数
size_t len = sizeof(arr) / sizeof(arr[0]);
```

### 字符串（C-String）

C 语言**没有原生的 `String` 类型**。C 语言中的字符串本质上是**以空字符 `'\0'`（ASCII 码为 0）结尾的 `char` 数组**。所有字符串函数都依赖寻找 `'\0'` 来判断字符串何时结束。

  



```C
#include <stdio.h>
#include <string.h> // 字符串操作标准库

int main(void) {
    // 编译器会自动在末尾追加 '\0'，因此占用 6 个字节：{'H','e','l','l','o','\0'}
    char str1[] = "Hello"; 
    str1[0] = 'h'; // 合法：str1 在栈上分配了可修改的字符数组副本

    // 注意区分：指针指向字符串字面量（存储在只读代码段/常量区，不可修改内容）
    const char *str2 = "World";

    // 常用 string.h 函数（不能用 == 比较两个字符串内容！）
    printf("有效字符长度（不含 \\0）: %zu\n", strlen(str1)); // 输出 5
    if (strcmp(str1, str2) != 0) {
        printf("两个字符串内容不相同\n");
    }
    return 0;
}
```

## 6. 函数与参数传递

C 编译器自上而下按顺序单遍扫描源码。如果被调用的函数定义在调用者之后，必须先在文件顶部提供**函数声明（函数原型，Function Prototype）**。

  

C 语言所有参数传递本质上都是**值传递（Pass by Value）**。若要在函数内部修改外部变量的值，或者避免拷贝体积庞大的数据，必须传递**指针（变量的内存地址）**：

  



```C
#include <stdio.h>

// 1. 函数原型声明（末尾带分号）
void swap(int *a, int *b);

int main(void) {
    int x = 10, y = 20;
    swap(&x, &y); // 传入 x 和 y 的内存地址
    printf("交换后: x = %d, y = %d\n", x, y); // x = 20, y = 10
    return 0;
}

// 2. 函数定义：接收两个整型指针
void swap(int *a, int *b) {
    int temp = *a; // *a 解引用：读取指针 a 所指向内存中的值
    *a = *b;       // 将 b 指向的值写入 a 指向的内存
    *b = temp;
}
```

## 7. 指针与动态内存管理（核心灵魂）

### 指针基础

**指针（Pointer）**是一个专门用来存储**内存地址**的变量。

  

- **`&`（取地址运算符）**：获取一个变量在内存中的首地址。
    
      
    
- **`*`（解引用运算符）**：声明时表示该变量是指针类型；使用时表示访问或修改该地址中存储的实际数据。
    
      
    



```C
int val = 42;
int *ptr = &val; // ptr 存储了 val 的地址

printf("val 的地址: %p\n", (void *)ptr);
printf("ptr 指向的值: %d\n", *ptr); // 输出 42

*ptr = 99; // 通过指针直接修改原内存，此时 val 的值变成了 99
```

### 动态内存分配（栈与堆）

普通局部变量分配在栈（Stack）**上，函数执行完毕后自动销毁；若需要动态决定内存大小或让数据跨函数存活，需引入 `stdlib.h` 在**堆（Heap）上手动申请和释放内存：

  

|**函数名**|**作用说明**|**原型与特点**|
|---|---|---|
|`malloc`|分配指定字节数的堆内存|`void* malloc(size_t size)`，**内存未初始化**（含随机垃圾值）|
|`calloc`|为数组分配堆内存并**自动清零**|`void* calloc(size_t num, size_t size)`，每一位均初始化为 `0`|
|`realloc`|调整已分配堆内存的大小|`void* realloc(void *ptr, size_t new_size)`，用于动态扩容或缩容|
|`free`|释放堆内存归还给系统|`void free(void *ptr)`，不释放会导致**内存泄漏（Memory Leak）**|



```C
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    // 1. 在堆上动态申请存放 5 个 int 的连续空间
    int *arr = (int *)malloc(n * sizeof(int));

    // 2. 必须检查内存是否申请成功（内存耗尽时返回 NULL）
    if (arr == NULL) {
        perror("内存分配失败");
        return 1;
    }

    // 3. 指针可以直接使用数组下标语法访问连续内存（arr[i] 等价于 *(arr + i)）
    for (int i = 0; i != n; i++) {
        arr[i] = (i + 1) * 10;
    }

    // 4. 使用完毕后必须手动释放，并将指针置为 NULL 防止产生“悬空指针”
    free(arr);
    arr = NULL; 

    return 0;
}
```

## 8. 复合数据类型（结构体、联合体与枚举）

虽然 C 语言没有类和对象，但提供了结构体（`struct`）来将不同类型的数据打包成一个整体，常配合 `typedef` 简化类型名称：

  



```C
#include <stdio.h>

// 使用 typedef 将 struct Point 定义为类型别名 Point
typedef struct {
    int x;
    int y;
    char label[16];
} Point;

// 传入结构体指针，避免整个结构体值拷贝带来的性能开销
void move_point(Point *p, int dx, int dy) {
    // 通过指针访问结构体成员使用箭头运算符 ->（等价于 (*p).x）
    p->x += dx;
    p->y += dy;
}

int main(void) {
    // C99 指定初始化器（Designated Initializers）：按成员名清晰赋值
    Point pt = {.x = 10, .y = 20, .label = "Start"};

    // 普通结构体变量使用点号 . 访问成员
    printf("初始坐标: (%d, %d)\n", pt.x, pt.y);

    move_point(&pt, 5, -5);
    printf("移动后坐标: (%d, %d)\n", pt.x, pt.y);
    return 0;
}
```

- **`union`（联合体/共用体）**：语法与 `struct` 相似，但**所有成员共享同一块内存空间**（大小由最大的成员决定），同一时刻只能有效存储其中一个成员，常用于底层协议解析和节省内存。
    
      
    
- **`enum`（枚举）**：定义一组命名的整型常量（如 `enum Status { OK = 0, ERROR = 1 };`），提升代码可读性。
    
      
    

## 栈内存、堆内存与指针生命周期交互演示

理解 C 语言最关键的一步，是看清变量和指针在栈（Stack）**与**堆（Heap）中的真实内存布局。通过下方的交互式步骤演示，你可以逐步追踪指针声明、取址、解引用、`malloc` 堆分配以及 `free` 释放全过程的内存状态变化：


<div id="cmem-demo-root">
<style>
#cmem-demo-root{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"JetBrains Mono",Consolas,monospace;background:linear-gradient(145deg,#0f172a 0%,#1e293b 100%);color:#e2e8f0;border:1px solid rgba(148,163,184,0.22);border-radius:14px;padding:18px;margin:16px 0;box-shadow:0 12px 32px rgba(0,0,0,0.35);line-height:1.5;}
#cmem-demo-root *{box-sizing:border-box;}
.cmem-header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,0.16);margin-bottom:14px;}
.cmem-title{font-size:16px;font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:8px;}
.cmem-dot{width:10px;height:10px;border-radius:50%;background:#38bdf8;box-shadow:0 0 10px #38bdf8;display:inline-block;}
.cmem-controls{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.cmem-btn{background:rgba(30,41,59,0.85);color:#cbd5e1;border:1px solid rgba(148,163,184,0.28);border-radius:7px;padding:5px 11px;font-size:12px;font-family:inherit;cursor:pointer;transition:all 0.18s ease;user-select:none;}
.cmem-btn:hover{border-color:#38bdf8;color:#fff;background:rgba(56,189,248,0.15);}
.cmem-btn.cmem-active{background:#0284c7;color:#fff;border-color:#38bdf8;font-weight:600;box-shadow:0 0 12px rgba(56,189,248,0.35);}
.cmem-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:14px;margin-bottom:14px;}
@media(max-width:860px){.cmem-grid{grid-template-columns:1fr;}}
.cmem-panel{background:rgba(15,23,42,0.65);border:1px solid rgba(148,163,184,0.16);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;}
.cmem-panel-head{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;letter-spacing:0.5px;padding-bottom:8px;border-bottom:1px solid rgba(148,163,184,0.12);}
.cmem-tag-code{color:#a78bfa;}
.cmem-tag-stack{color:#38bdf8;}
.cmem-tag-heap{color:#34d399;}
.cmem-sub{font-size:11px;color:#94a3b8;font-weight:400;}
.cmem-code-list{display:flex;flex-direction:column;gap:3px;font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;}
.cmem-code-line{display:flex;align-items:center;padding:4px 8px;border-radius:6px;color:#94a3b8;transition:all 0.2s ease;cursor:pointer;}
.cmem-code-line:hover{background:rgba(148,163,184,0.08);}
.cmem-code-line.cmem-line-active{background:rgba(251,191,36,0.16);color:#fef08a;border-left:3px solid #fbbf24;font-weight:600;}
.cmem-ln{width:22px;color:#64748b;font-size:11px;user-select:none;flex-shrink:0;}
.cmem-arrow{width:18px;color:#fbbf24;font-weight:700;flex-shrink:0;}
.cmem-mem-list{display:flex;flex-direction:column;gap:8px;}
.cmem-cell{background:rgba(30,41,59,0.75);border:1px solid rgba(148,163,184,0.2);border-radius:8px;padding:8px 10px;transition:all 0.25s ease;position:relative;}
.cmem-cell.cmem-cell-stack{border-left:3px solid #38bdf8;}
.cmem-cell.cmem-cell-heap{border-left:3px solid #34d399;}
.cmem-cell.cmem-cell-highlight{border-color:#fbbf24;box-shadow:0 0 14px rgba(251,191,36,0.22);background:rgba(251,191,36,0.08);}
.cmem-cell.cmem-cell-freed{border-left-color:#fb7185;opacity:0.55;background:rgba(244,63,94,0.08);}
.cmem-cell-top{display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:4px;}
.cmem-addr{font-family:"JetBrains Mono",Consolas,monospace;color:#94a3b8;background:rgba(15,23,42,0.7);padding:1px 6px;border-radius:4px;}
.cmem-type{color:#cbd5e1;font-weight:600;}
.cmem-cell-body{display:flex;justify-content:space-between;align-items:center;font-family:"JetBrains Mono",Consolas,monospace;font-size:13px;}
.cmem-var{color:#f8fafc;font-weight:700;}
.cmem-val{padding:2px 8px;border-radius:5px;background:rgba(15,23,42,0.85);color:#38bdf8;font-weight:700;border:1px solid rgba(56,189,248,0.25);}
.cmem-val-ptr{color:#fbbf24;border-color:rgba(251,191,36,0.35);}
.cmem-val-heap{color:#34d399;border-color:rgba(52,211,153,0.35);}
.cmem-val-warn{color:#fb7185;border-color:rgba(251,113,133,0.35);}
.cmem-ptr-badge{margin-top:5px;font-size:11px;color:#fbbf24;background:rgba(251,191,36,0.1);padding:2px 7px;border-radius:4px;display:inline-block;}
.cmem-empty{color:#64748b;font-size:12px;text-align:center;padding:24px 8px;border:1px dashed rgba(148,163,184,0.2);border-radius:8px;}
.cmem-link-bar{background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.18);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cmem-link-label{color:#94a3b8;font-weight:600;}
.cmem-link-pill{font-family:"JetBrains Mono",Consolas,monospace;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fde68a;padding:3px 9px;border-radius:6px;}
.cmem-footer{background:rgba(30,41,59,0.7);border-left:4px solid #38bdf8;border-radius:8px;padding:11px 14px;font-size:13px;display:flex;flex-direction:column;gap:4px;}
.cmem-footer-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.cmem-step-title{font-weight:700;color:#f8fafc;font-size:14px;}
.cmem-status{font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;}
.cmem-st-ok{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);}
.cmem-st-warn{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);}
.cmem-st-safe{background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);}
.cmem-desc{color:#cbd5e1;font-size:12.5px;line-height:1.6;}
</style>
<div class="cmem-header">
  <div class="cmem-title"><span class="cmem-dot"></span><span>C 语言栈内存、堆内存与指针生命周期演示</span></div>
  <div class="cmem-controls">
    <button type="button" class="cmem-btn" onclick="window.__cmemGo(window.__cmemCur-1)">◀ 上一步</button>
    <button type="button" class="cmem-btn cmem-active" id="cmem-b0" onclick="window.__cmemGo(0)">Step 1</button>
    <button type="button" class="cmem-btn" id="cmem-b1" onclick="window.__cmemGo(1)">Step 2</button>
    <button type="button" class="cmem-btn" id="cmem-b2" onclick="window.__cmemGo(2)">Step 3</button>
    <button type="button" class="cmem-btn" id="cmem-b3" onclick="window.__cmemGo(3)">Step 4</button>
    <button type="button" class="cmem-btn" id="cmem-b4" onclick="window.__cmemGo(4)">Step 5</button>
    <button type="button" class="cmem-btn" id="cmem-b5" onclick="window.__cmemGo(5)">Step 6</button>
    <button type="button" class="cmem-btn" onclick="window.__cmemGo(window.__cmemCur+1)">下一步 ▶</button>
  </div>
</div>
<div class="cmem-grid">
  <div class="cmem-panel">
    <div class="cmem-panel-head"><span class="cmem-tag-code">C 源码执行流 (main)</span><span class="cmem-sub">点击代码行可跳转</span></div>
    <div class="cmem-code-list" id="cmem-code-box"></div>
  </div>
  <div class="cmem-panel">
    <div class="cmem-panel-head"><span class="cmem-tag-stack">栈内存 (Stack)</span><span class="cmem-sub">系统自动管理 · 高地址 ➔ 低地址</span></div>
    <div class="cmem-mem-list" id="cmem-stack-box"></div>
  </div>
  <div class="cmem-panel">
    <div class="cmem-panel-head"><span class="cmem-tag-heap">堆内存 (Heap)</span><span class="cmem-sub">手动 malloc/free · 低地址 ➔ 高地址</span></div>
    <div class="cmem-mem-list" id="cmem-heap-box"></div>
  </div>
</div>
<div class="cmem-link-bar" id="cmem-link-box"></div>
<div class="cmem-footer">
  <div class="cmem-footer-top">
    <span class="cmem-step-title" id="cmem-st-title"></span>
    <span class="cmem-status cmem-st-ok" id="cmem-st-badge"></span>
  </div>
  <div class="cmem-desc" id="cmem-st-desc"></div>
</div>
<script id="cmem-script-src">
(function(){
  var codeLines = [
    {ln:1, text:"int main(void) {", step:-1},
    {ln:2, text:"  int a = 42;", step:0},
    {ln:3, text:"  int *p = &a;", step:1},
    {ln:4, text:"  *p = 99;", step:2},
    {ln:5, text:"  int *arr = malloc(3 * sizeof(int));", step:3},
    {ln:6, text:"  arr[0]=10; arr[1]=20; arr[2]=30;", step:4},
    {ln:7, text:"  free(arr); arr = NULL;", step:5},
    {ln:8, text:"  return 0;", step:-1},
    {ln:9, text:"}", step:-1}
  ];
  var stages = [
    {
      title:"Step 1：在栈上分配局部变量 a",
      badge:"栈帧分配 · 内存安全",
      badgeCls:"cmem-st-ok",
      desc:"执行 int a = 42; 时，系统在 main 函数栈帧中自动划分 4 字节空间（地址 0x7FFF0004），直接将整数值 42 写入该栈内存单元。此时堆内存尚未被使用。",
      links:["当前无活跃指针引用"],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"42", valCls:"", hi:true, note:""}
      ],
      heap:[]
    },
    {
      title:"Step 2：声明指针变量 p 并取地址 (&a)",
      badge:"建立指针引用 · 内存安全",
      badgeCls:"cmem-st-ok",
      desc:"执行 int *p = &a; 时，栈上新增 8 字节指针变量 p（地址 0x7FFF0008），& 运算符取出变量 a 的首地址 0x7FFF0004 并存入 p 中。此时 p 指向栈上的 a。",
      links:["栈指针 p (0x7FFF0008) ──[存储地址 0x7FFF0004]──► 栈变量 a (0x7FFF0004)"],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"42", valCls:"", hi:false, note:""},
        {addr:"0x7FFF0008", name:"p", type:"int * (8 Bytes)", val:"0x7FFF0004", valCls:"cmem-val-ptr", hi:true, note:"➔ 指向栈地址 0x7FFF0004 (变量 a)"}
      ],
      heap:[]
    },
    {
      title:"Step 3：解引用指针 (*p = 99) 间接修改目标内存",
      badge:"解引用写入 · 内存安全",
      badgeCls:"cmem-st-ok",
      desc:"执行 *p = 99; 时，CPU 先读取 p 中保存的地址 0x7FFF0004，再通过解引用运算符 * 顺藤摸瓜找到变量 a 所在的内存单元，将其值从 42 改写为 99。",
      links:["解引用 *p ──[寻址 0x7FFF0004 写入 99]──► 变量 a 的值更新为 99"],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"99", valCls:"", hi:true, note:"⚡ 经由 *p 间接修改 (原值 42)"},
        {addr:"0x7FFF0008", name:"p", type:"int * (8 Bytes)", val:"0x7FFF0004", valCls:"cmem-val-ptr", hi:false, note:"➔ 指向栈地址 0x7FFF0004 (变量 a)"}
      ],
      heap:[]
    },
    {
      title:"Step 4：调用 malloc 在堆上动态分配连续内存",
      badge:"注意：堆内存未初始化含随机垃圾值",
      badgeCls:"cmem-st-warn",
      desc:"malloc(3 * sizeof(int)) 在堆区开辟连续 12 字节（3 个 int 单元），并返回首地址 0x55A01000 存入栈指针 arr。注意 malloc 不会清零内存，此时堆单元内是随机垃圾值（?）。",
      links:[
        "栈指针 p (0x7FFF0008) ──► 栈变量 a (0x7FFF0004)",
        "栈指针 arr (0x7FFF0010) ──[指向堆首地址]──► 堆块首地址 0x55A01000"
      ],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"99", valCls:"", hi:false, note:""},
        {addr:"0x7FFF0008", name:"p", type:"int * (8 Bytes)", val:"0x7FFF0004", valCls:"cmem-val-ptr", hi:false, note:"➔ 指向 a (0x7FFF0004)"},
        {addr:"0x7FFF0010", name:"arr", type:"int * (8 Bytes)", val:"0x55A01000", valCls:"cmem-val-ptr", hi:true, note:"➔ 指向堆首地址 0x55A01000"}
      ],
      heap:[
        {addr:"0x55A01000", name:"arr[0] (*arr)", type:"Heap int (+0B)", val:"? (垃圾值)", valCls:"cmem-val-warn", hi:true, freed:false},
        {addr:"0x55A01004", name:"arr[1] (*(arr+1))", type:"Heap int (+4B)", val:"? (垃圾值)", valCls:"cmem-val-warn", hi:true, freed:false},
        {addr:"0x55A01008", name:"arr[2] (*(arr+2))", type:"Heap int (+8B)", val:"? (垃圾值)", valCls:"cmem-val-warn", hi:true, freed:false}
      ]
    },
    {
      title:"Step 5：通过指针偏移下标向堆内存写入数据",
      badge:"堆内存读写正常 · 内存安全",
      badgeCls:"cmem-st-ok",
      desc:"执行 arr[i] 赋值，底层等价于 *(arr + i)：以栈指针 arr 存储的 0x55A01000 为基址，按 sizeof(int)=4 字节步长计算偏移量，依次将 10、20、30 写入堆内存。",
      links:[
        "arr + 0 ──► 0x55A01000 (10)",
        "arr + 1 ──► 0x55A01004 (20)",
        "arr + 2 ──► 0x55A01008 (30)"
      ],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"99", valCls:"", hi:false, note:""},
        {addr:"0x7FFF0008", name:"p", type:"int * (8 Bytes)", val:"0x7FFF0004", valCls:"cmem-val-ptr", hi:false, note:"➔ 指向 a (0x7FFF0004)"},
        {addr:"0x7FFF0010", name:"arr", type:"int * (8 Bytes)", val:"0x55A01000", valCls:"cmem-val-ptr", hi:false, note:"➔ 指向堆首地址 0x55A01000"}
      ],
      heap:[
        {addr:"0x55A01000", name:"arr[0]", type:"Heap int (+0B)", val:"10", valCls:"cmem-val-heap", hi:true, freed:false},
        {addr:"0x55A01004", name:"arr[1]", type:"Heap int (+4B)", val:"20", valCls:"cmem-val-heap", hi:true, freed:false},
        {addr:"0x55A01008", name:"arr[2]", type:"Heap int (+8B)", val:"30", valCls:"cmem-val-heap", hi:true, freed:false}
      ]
    },
    {
      title:"Step 6：调用 free(arr) 释放堆内存并将指针置为 NULL",
      badge:"已归还堆内存并消除野指针",
      badgeCls:"cmem-st-safe",
      desc:"free(arr) 将 0x55A01000 起始的 12 字节堆空间归还给操作系统；紧接着执行 arr = NULL (0x0) 切断栈指针与已释放堆块的关联，彻底防止后续误用悬空指针（野指针）。",
      links:[
        "栈指针 p (0x7FFF0008) ──► 栈变量 a (0x7FFF0004)",
        "栈指针 arr (0x7FFF0010) ──► 0x0 (NULL，已安全断开堆引用)"
      ],
      stack:[
        {addr:"0x7FFF0004", name:"a", type:"int (4 Bytes)", val:"99", valCls:"", hi:false, note:""},
        {addr:"0x7FFF0008", name:"p", type:"int * (8 Bytes)", val:"0x7FFF0004", valCls:"cmem-val-ptr", hi:false, note:"➔ 指向 a (0x7FFF0004)"},
        {addr:"0x7FFF0010", name:"arr", type:"int * (8 Bytes)", val:"0x0 (NULL)", valCls:"cmem-val-warn", hi:true, note:"✔ 已置空，防止悬空指针"}
      ],
      heap:[
        {addr:"0x55A01000", name:"[已释放 Freed]", type:"12 Bytes Reclaimed", val:"不可访问", valCls:"cmem-val-warn", hi:false, freed:true}
      ]
    }
  ];
  window.__cmemCur = 0;
  window.__cmemGo = function(idx){
    if(idx !== 0 && idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4 && idx !== 5){return;}
    window.__cmemCur = idx;
    var st = stages[idx];
    for(var b=0; b!==6; b++){
      var btn = document.getElementById("cmem-b"+b);
      if(btn){btn.className = (b===idx) ? "cmem-btn cmem-active" : "cmem-btn";}
    }
    var codeHtml = "";
    for(var i=0; i!==codeLines.length; i++){
      var cl = codeLines[i];
      var isAct = (cl.step === idx);
      var clickAttr = (cl.step !== -1) ? " onclick=\"window.__cmemGo("+cl.step+")\"" : "";
      codeHtml += "<div class=\"cmem-code-line"+(isAct?" cmem-line-active":"")+"\""+clickAttr+">";
      codeHtml += "<span class=\"cmem-ln\">"+cl.ln+"</span>";
      codeHtml += "<span class=\"cmem-arrow\">"+(isAct?"➔":"")+"</span>";
      codeHtml += "<span>"+cl.text+"</span></div>";
    }
    document.getElementById("cmem-code-box").innerHTML = codeHtml;
    var stackHtml = "";
    for(var s=0; s!==st.stack.length; s++){
      var sc = st.stack[s];
      stackHtml += "<div class=\"cmem-cell cmem-cell-stack"+(sc.hi?" cmem-cell-highlight":"")+"\">";
      stackHtml += "<div class=\"cmem-cell-top\"><span class=\"cmem-addr\">"+sc.addr+"</span><span class=\"cmem-type\">"+sc.type+"</span></div>";
      stackHtml += "<div class=\"cmem-cell-body\"><span class=\"cmem-var\">"+sc.name+"</span><span class=\"cmem-val "+sc.valCls+"\">"+sc.val+"</span></div>";
      if(sc.note){stackHtml += "<div class=\"cmem-ptr-badge\">"+sc.note+"</div>";}
      stackHtml += "</div>";
    }
    document.getElementById("cmem-stack-box").innerHTML = stackHtml;
    var heapHtml = "";
    if(st.heap.length === 0){
      heapHtml = "<div class=\"cmem-empty\">当前尚未调用 malloc<br>堆区无活跃分配块</div>";
    } else {
      for(var h=0; h!==st.heap.length; h++){
        var hc = st.heap[h];
        var hCls = "cmem-cell cmem-cell-heap" + (hc.hi?" cmem-cell-highlight":"") + (hc.freed?" cmem-cell-freed":"");
        heapHtml += "<div class=\""+hCls+"\">";
        heapHtml += "<div class=\"cmem-cell-top\"><span class=\"cmem-addr\">"+hc.addr+"</span><span class=\"cmem-type\">"+hc.type+"</span></div>";
        heapHtml += "<div class=\"cmem-cell-body\"><span class=\"cmem-var\">"+hc.name+"</span><span class=\"cmem-val "+hc.valCls+"\">"+hc.val+"</span></div>";
        heapHtml += "</div>";
      }
    }
    document.getElementById("cmem-heap-box").innerHTML = heapHtml;
    var linkHtml = "<span class=\"cmem-link-label\">指针寻址链路：</span>";
    for(var l=0; l!==st.links.length; l++){
      linkHtml += "<span class=\"cmem-link-pill\">"+st.links[l]+"</span>";
    }
    document.getElementById("cmem-link-box").innerHTML = linkHtml;
    document.getElementById("cmem-st-title").textContent = st.title;
    var badgeEl = document.getElementById("cmem-st-badge");
    badgeEl.textContent = st.badge;
    badgeEl.className = "cmem-status " + st.badgeCls;
    document.getElementById("cmem-st-desc").textContent = st.desc;
  };
  window.__cmemGo(0);
})();
</script>
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" style="display:none!important;" onload="if(!window.__cmemGo){var s=document.createElement('script');s.text=document.getElementById('cmem-script-src').textContent;document.body.appendChild(s);}" />
</div>




  

> **C 语言内存安全铁律**：凡是栈上的局部变量，切勿在函数返回时将它的地址（`return &local_var;`）返回给外部，因为函数一旦结束栈帧即被销毁；凡是通过 `malloc` 在堆上申请的内存，必须遵循“谁申请、谁释放”或明确所有权移交，并在 `free(p)` 之后立即执行 `p = NULL;`。