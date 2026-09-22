# donut.c 旋转甜甜圈

2006 年，程序员 Andy Sloane（网名 a1k0n）写下了一段在编程界被称为“神级操作”的 C 语言代码。这段仅有几十行的代码，没有任何外部图形库（如 OpenGL 或 DirectX）依赖，却在黑框终端里渲染出了一个带有透视、光影和深度计算的 3D 旋转甜甜圈（Torus）。

  

更极致的浪漫是：**这段代码本身的排版，也是一个甜甜圈。**

  

它将底层的 C 语言内存操作、数学物理逻辑与骇客美学完美融合，是一场脱离了现代臃肿框架的“算力狂舞”。

  

## 源代码 (1996 字节的奇迹)

在你的环境里直接编译运行这段代码，就能在终端里看到奇迹：

```c
             k;double sin()
         ,cos();main(){float A=
       0,B=0,i,j,z[1760];char b[
     1760];printf("\x1b[2J");for(;;
  ){memset(b,32,1760);memset(z,0,7040)
  ;for(j=0;6.28>j;j+=0.07)for(i=0;6.28
 >i;i+=0.02){float c=sin(i),d=cos(j),e=
 sin(A),f=sin(j),g=cos(A),h=d+2,D=1/(c*
 h*e+f*g+5),l=cos      (i),m=cos(B),n=s\
in(B),t=c*h*g-f*        e;int x=40+30*D*
(l*h*m-t*n),y=            12+15*D*(l*h*n
+t*m),o=x+80*y,          N=8*((f*e-c*d*g
 )*m-c*d*e-f*g-l        *d*n);if(22>y&&
 y>0&&x>0&&80>x&&D>z[o]){z[o]=D;b[o]=
 ".,-~:;=!*#$@"[N>0?N:0];}}/*#****!!-*/
  printf("\x1b[H");for(k=0;1761>k;k++)
   putchar(k%80?b[k]:10);A+=0.04;B+=
     0.02;}}/*****####*******!!=;:~
       ~::==!!!**********!!!==::-
         .,~~;;;========;;;:~-.
             ..,--------,*/
```
<iframe style="width: 100%; height: 380px; background-color: #0d0d0f; border: 1px solid #27272a; border-radius: 12px; margin: 24px 0; display: block; box-sizing: border-box;" srcdoc='<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:transparent;display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden;}button{background:#10b981;color:#fff;border:1px solid rgba(255,255,255,0.1);padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.2);transition:0.3s;}button:hover{background:#059669;transform:scale(0.98);}pre{display:none;font-family:monospace;font-size:13.5px;line-height:13.5px;color:#10b981;margin:0;letter-spacing:1px;text-shadow:0 0 8px rgba(16,185,129,0.4);}</style></head><body><button id="b">▶ 运行甜甜圈 (donut.c)</button><pre id="s"></pre><script>document.getElementById("b").onclick=function(){this.style.display="none";document.getElementById("s").style.display="block";let A=1,B=1,p=document.getElementById("s");setInterval(()=>{let b=[],z=[];A+=0.07;B+=0.03;let cA=Math.cos(A),sA=Math.sin(A),cB=Math.cos(B),sB=Math.sin(B);for(let k=0;k<1760;k++){b[k]=k%80===79?"\n":" ";z[k]=0}for(let j=0;j<6.28;j+=0.07){let ct=Math.cos(j),st=Math.sin(j);for(let i=0;i<6.28;i+=0.02){let sp=Math.sin(i),cp=Math.cos(i),h=ct+2,D=1/(sp*h*sA+st*cA+5),t=sp*h*cA-st*sA,x=Math.floor(40+30*D*(cp*h*cB-t*sB)),y=Math.floor(12+15*D*(cp*h*sB+t*cB)),o=x+80*y,N=Math.floor(8*((st*sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct*sB));if(y<22&&y>=0&&x>=0&&x<79&&D>z[o]){z[o]=D;b[o]=".,-~:;=!*#$@"[N>0?N:0]}}}p.innerHTML=b.join("");},50)};</script></body></html>'></iframe>






## 核心原理解析

在受限的 80x22 字符终端里，这段代码徒手实现了现代 3D 渲染引擎的四大基石。

  

### 1. 3D 几何建模（Torus Geometry）

甜甜圈在数学上被称为**圆环面**。代码并没有导入任何 3D 模型文件，而是通过纯粹的三角函数在内存中“画”出来的。

它使用两个嵌套的循环控制两个角度：

  

- 角度 $i$（代码中从 $0$ 到 $6.28$，即 $2\pi$）：负责在三维空间中画一个二维的小圆截面。
    
      
    
- 角度 $j$（同样从 $0$ 到 $2\pi$）：负责带着这个小圆，围绕中心 Y 轴旋转扫掠。
    
      
    
- 当这两个角度遍历完毕，一个由无数离散点构成的 3D 圆环面就诞生了。
    
      
    

### 2. 矩阵旋转（Rotation Matrices）

为了让甜甜圈转起来，必须对空间中的每个点进行动态旋转。

变量 $A$ 和 $B$ 分别代表甜甜圈围绕 X 轴和 Z 轴旋转的当前角度。代码中密密麻麻的 `sin()` 和 `cos()` 乘法计算，实质上是作者在没有现成矩阵库的情况下，纯手工将三维欧拉角旋转矩阵（Euler angles）展开成了扁平的代数公式。

  

### 3. Z-Buffer 深度缓冲（解决空间透视）

在 2D 屏幕上画 3D 物体，最大的难点是**透视投影**和**空间遮挡**（前面的部分必须遮住后面的部分）。

  

- **投影：** 代码计算出 3D 坐标 $(x, y, z)$ 后，通过 $D = 1 / z$ 来计算透视比例。离观察者越远的点，$z$ 越大，$D$ 越小，映射到 2D 屏幕上的 $x$ 和 $y$ 偏移就越小，从而实现了“近大远小”的真实透视。
    
      
    
- **遮挡：** 数组 `z[1760]` 是一个深度缓冲池（1760 等于 80 列 × 22 行的终端面积）。每次计算出一个屏幕像素 $(x, y)$ 时，只有当新点的深度 $D$ 大于当前该位置记录的 `z[o]`（说明新点比老点更靠近观察者）时，才会覆盖并更新该像素。
    
      
    

### 4. 光照与字符着色（ASCII Shading）

这是整段代码最惊艳的魔法。没有像素颜色的渐变，终端只有单色字符，如何表现出 3D 的体积感？

代码通过计算**表面法向量**与**光源方向**的“点乘积”，得出一个光照强度 $N$。

然后，将强度 $N$ 作为一个索引，直接映射到由 12 个 ASCII 字符组成的渐变字符串中：

`".,-~:;=!*#$@"`

  

- 背光处（$N$ 极小）：渲染为空白或散落的 `.` 与 `,`
    
      
    
- 受光面（$N$ 变大）：逐渐加深为 `:`、`=`、`*`
    
      
    
- 高光区（$N$ 最大）：使用最密集的 `#` 或 `@`
    
      
    

> 剥开现代 3D 引擎华丽的外衣，所有的图形学底层，不过是内存数组（Framebuffer）、三角函数、矩阵运算与光影逻辑的狂舞。donut.c 让我们看到，当程序员对底层有了绝对的掌控力，几十行 C 语言就能在字符终端里创造一个宇宙。