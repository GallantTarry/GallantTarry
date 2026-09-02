# Service Worker (服务工作线程)

想要实现“按需缓存”（不点不下载，点过一次后永久保存在本地，下次秒开断网也能玩），最完美的纯前端解决方案就是引入 **Service Worker (服务工作线程)**。

  

你可以把它理解为你网页里的一个“本地代理保安”。当用户点击某首音乐或某个游戏时，网页发出下载请求，保安会先拦截下来：

  

1. **第一次点击**：保安发现本地没有，放行去网络下载。下载回来的同时，保安偷偷复印一份锁在浏览器的 `Cache Storage` 里，然后再给用户播放。
    
      
    
2. **第二次点击（或下次打开网页）**：保安发现本地已经有复印件了，直接掐断网络请求，把本地的文件瞬间甩给用户。
    
      
    

只需两步，即可在你的项目中加入这个黑科技：

  

### 第一步：在根目录创建一个 `sw.js` 文件

在你的 `index.html` 同级目录下，新建一个文本文件，命名为 `sw.js`，然后把下面这段代码原封不动地粘贴进去：

  

JavaScript

```
// 缓存库的名称（你可以随时修改版本号来强制刷新缓存）
const CACHE_NAME = 'tukuai-media-cache-v1';

// 我们只拦截并缓存包含这些关键词的路径（音乐和游戏ROM）
const CACHE_URL_KEYWORDS = ['/music/', '/rom/', '/game/'];

// 1. 安装阶段：立即接管当前网页
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('[Service Worker] 安装成功，已准备好按需缓存。');
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// 2. 拦截请求的核心逻辑
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // 检查这个请求是不是音乐或者游戏 ROM
    const isMediaOrRom = CACHE_URL_KEYWORDS.some(keyword => url.includes(keyword));

    if (isMediaOrRom) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                // 步骤 A：去浏览器的本地金库里找找看有没有这个文件
                const cachedResponse = await cache.match(event.request);
                
                if (cachedResponse) {
                    console.log('[按需缓存] 命中本地文件，秒开！不需要网络下载 🚀:', url);
                    return cachedResponse;
                }

                // 步骤 B：本地没有，走网络下载
                console.log('[按需缓存] 第一次加载，正在从网络下载并存入本地 ⬇️:', url);
                try {
                    const networkResponse = await fetch(event.request);
                    
                    // 确保请求成功才缓存 (状态码 200)
                    if (networkResponse && networkResponse.status === 200) {
                        // 克隆一份数据存入本地缓存，原件返回给页面播放/运行
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    console.error('[按需缓存] 网络请求失败:', error);
                    throw error;
                }
            })
        );
    }
    // 如果不是音乐和游戏，就不做任何拦截，走正常的网络请求
});
```

### 第二步：在你的 `index.html` 中注册它

回到你的 `index.html`，在 `</body>` 标签闭合之前，加上这段注册脚本，让网页一启动就唤醒这个保安：

  

HTML

```
<script>
    // 检查浏览器是否支持 Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // 注册我们刚才写的 sw.js
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('保安(ServiceWorker)已就位，作用域为: ', registration.scope);
                })
                .catch(error => {
                    console.log('保安(ServiceWorker)注册失败: ', error);
                });
        });
    }
</script>
</body>
</html>
```

### 为什么这样做完美契合你的需求？

1. **绝对的按需加载**：只要你的 `<audio>` 标签保持 `preload="none"`，用户不点播放，`sw.js` 就绝不会去乱下载音乐。只有当用户按下播放键或开始游戏的瞬间，拦截机制才会触发。
    
      
    
2. **断网也能嗨**：大体积的 `xxx.mp3` 或 `xxx.gba` 被下载后，会被存放在浏览器自带的 **Cache Storage** 中（它比 localStorage 强大得多，存几百MB甚至几GB都不是问题）。
    
      
    
3. **如何验证是否成功？**
    
      
    - 在电脑浏览器打开你的网页。
        
          
        
    - 按 `F12` 打开开发者工具，点击顶部的 **"Application" (应用)** 标签页。
        
          
        
    - 在左侧找到 **"Cache Storage" (缓存空间)**。
        
          
        
    - 点一首歌或开一个游戏，你会惊奇地发现，对应的 MP3 或 GBA 文件瞬间出现在了这里！下次你甚至可以把电脑断网，刷新页面，游戏和这首歌依然能正常秒开。



![前端缓存F12地址](../../media/前端缓存F12地址.png)

那么其实上面只是给您展示了下载音乐缓存和游戏缓存的技术，其实他完全可以完全离线访问。

要想实现“用户以前登录过，哪怕现在完全没网，再次输入网址也能成功打开并完整浏览整个网页”，目前写的 sw.js 还需要做一点小小的升级。因为你现在的 sw.js 只拦截了 /music/、/rom/ 和 /game/（即音乐和游戏）。如果完全断网，用户虽然能听缓存过的歌，但网页最核心的 index.html 主页面、Vue 框架、CSS 样式、头像图标 如果没有提前离线缓存，浏览器在断网时去请求它们就会直接报错“无法访问此网站（ERR_INTERNET_DISCONNECTED）”。  所以，要达成这个终极目标，你需要让“保安”在用户第一次联网时，把网页的骨架（静态资源）也一起强行打包带走。
