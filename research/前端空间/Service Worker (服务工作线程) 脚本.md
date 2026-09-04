# Service Worker (服务工作线程) 脚本

```sw.js
const CACHE_NAME = 'tukuai-smart-cache';

// 1. 安装时立即接管
self.addEventListener('install', event => {
    self.skipWaiting();
});

// 2. 激活时立即控制所有页面
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// 3. 核心智能路由
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // 【补丁2】排除跨域、浏览器插件、以及统计探针（谷歌分析、不蒜子等），让它们直接走网络
    if (req.method !== 'GET' ||
        url.protocol.startsWith('chrome-extension') ||
        url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('busuanzi')
    ) {
        return; // 直接 return，大管家不插手
    }

    // =========================================================================
    // 策略 A：网页框架 (HTML) -> 【网络优先，缓存兜底】
    // 效果：永远展示 GitHub 最新页面。彻底断网时才用旧页面。
    // =========================================================================
    if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(req).then(networkRes => {
                const clone = networkRes.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                return networkRes;
            }).catch(() => {
                return caches.match(req);
            })
        );
        return;
    }

    // =========================================================================
    // 策略 B：大体积资产 (ROM、音乐、字体、模拟器内核) -> 【绝对缓存优先】
    // 效果：下载一次，终身秒进。
    // 【补丁1】加入了 .wasm 以及 /emulator_data/ 目录的拦截，防止后台疯狂重复下载！
    // 【补丁3提示】如果你更新了同名游戏ROM，记得在HTML里把文件名改一下(如 xx_v2.gba)
    // =========================================================================
    if (url.pathname.match(/\.(mp3|gba|sfc|smc|ttf|woff2|wasm|zip)$/i) || url.pathname.includes('/emulator_data/')) { //
        event.respondWith(
            caches.match(req).then(cachedRes => {
                if (cachedRes) return cachedRes; // 硬盘有，直接秒开[cite: 1]

                return fetch(req).then(networkRes => {
                    // 【修复核心】：只有在完整响应 (200) 的情况下才写入缓存，忽略 206 Partial Content
                    if (networkRes && networkRes.status === 200) {
                        const clone = networkRes.clone(); //[cite: 1]
                        caches.open(CACHE_NAME).then(cache => cache.put(req, clone)); //[cite: 1]
                    }
                    return networkRes; //[cite: 1]
                });
            })
        );
        return; //[cite: 1]
    }

    // =========================================================================
    // 策略 C：普通静态资源 (JS代码, CSS, 图片) -> 【异步热更新】
    // 效果：瞬间展示旧缓存，后台默默下载新版本并替换。下次打开生效。
    // =========================================================================
    event.respondWith(
        caches.match(req).then(cachedRes => {
            const networkFetch = fetch(req).then(networkRes => {
                if (networkRes && networkRes.status === 200) {
                    const clone = networkRes.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                }
                return networkRes;
            }).catch(() => { /* 断网时静默失败 */ });

            return cachedRes || networkFetch;
        })
    );
});
```


```前端index唤醒
<script>  
    if ('serviceWorker' in navigator) {  
        window.addEventListener('load', () => {  
            navigator.serviceWorker.register('./sw.js')  
                .then(registration => {  
                    console.log('Tukuai OS 核心管家已接管系统. 作用域:', registration.scope);  
  
                    // 监听后台版本更新，如果发现新版本，自动强制刷新页面  
                    registration.addEventListener('updatefound', () => {  
                        const newWorker = registration.installing;  
                        newWorker.addEventListener('statechange', () => {  
                            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {  
                                console.log('检测到核心引擎更新，系统正在热重载...');  
                                window.location.reload();  
                            }  
                        });  
                    });  
                })  
                .catch(error => {  
                    console.error('核心管家唤醒失败:', error);  
                });  
        });  
    }  
</script>
```

F12可见Tukuai OS 核心管家已接管系统. 作用域: https://gallanttarry.github.io/TuKuai/

![前端缓存F12地址](../../media/前端缓存F12地址.png)


这是一个 **Service Worker (服务工作线程)** 脚本，相当于在你的浏览器和服务器之间设立了一个运行在后台的“智能网络代理”。它的核心作用是**接管网站的所有网络请求，通过定制化的缓存策略来极大提升网页的加载速度，降低流量消耗，并赋予网页断网离线使用的能力**。

  

结合代码中的具体逻辑，它的功能被精细划分为了以下几个机制：

  

- **无缝接管页面：** 代码在 `install` 和 `activate` 阶段使用了 `skipWaiting()` 和 `clients.claim()`，强制要求浏览器在加载该脚本后立即生效并接管当前页面的网络请求，无需用户二次刷新或等待。
    
      
    
- **探针与跨域放行：** 脚本会识别并放行所有非 `GET` 请求，以及谷歌分析（Google Analytics）、不蒜子（busuanzi）和浏览器插件的请求。这意味着网站的访问量统计数据会直接走真实网络，保证统计的准确性，不被本地缓存干扰。
    
      
    
- **策略 A（针对 HTML 网页）：网络优先，缓存兜底**
    
      
    
      
    - 每次访问都会优先向服务器端拉取最新的 HTML 页面。
        
          
        
    - 作用：确保用户永远能看到最新部署的网页结构，只有在设备彻底断网请求失败时，才会调取本地缓存的旧页面作为保底。
        
          
        
- **策略 B（针对 游戏 ROM、音乐、字体、模拟器内核）：绝对缓存优先**
    
      
    
      
    - 针对带有 `.mp3`, `.gba`, `.sfc`, `.wasm` 后缀的大文件，以及 `/emulator_data/` 目录下的模拟器底层文件，只要本地硬盘曾经下载过，就直接从本地瞬间读取，完全阻断网络请求。
        
          
        
    - 作用：实现了“下载一次，终身秒进”。极大地节省了服务器带宽，这也是为什么你的复古游戏引擎和电子音乐终端能够在断网状态下依然流畅运行的底层原因。
        
          
        
- **策略 C（针对 普通 JS、CSS、图片）：异步热更新**
    
      
    
      
    - 当请求普通静态资源时，会立刻返回本地的缓存文件以实现页面的“秒开”，与此同时，它会在后台静默向服务器发起请求，拉取最新版本并偷偷替换掉本地的旧缓存。
        
          
        
    - 作用：用户在当前能享受到极致的加载速度，而当他们下次再打开该网页时，就会自动应用后台刚刚静默更新好的新版本内容。
        
          
        

这段代码（`tukuai-smart-cache`）本质上是为了将普通的静态网页升级为具备极速响应和弱网/无网生存能力的现代化 PWA (Progressive Web App)。