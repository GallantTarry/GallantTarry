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
    // 【补丁3提示】如果你更新了同名游戏ROM，记得在HTML里把文件名改一下(如 xx_v2.gba)    // =========================================================================    if (url.pathname.match(/\.(mp3|gba|sfc|smc|ttf|woff2|wasm|zip)$/i) || url.pathname.includes('/emulator_data/')) {  
        event.respondWith(  
            caches.match(req).then(cachedRes => {  
                if (cachedRes) return cachedRes; // 硬盘有，直接秒开  
  
                return fetch(req).then(networkRes => {  
                    const clone = networkRes.clone();  
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));  
                    return networkRes;  
                });  
            })  
        );  
        return;  
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

