# youtube链接如何在前端使用？

比如YouTube 链接（包含 4303 秒的时间戳）适配到这个模块里，需要进行两步处理：

### 1. 转换链接格式

- **原始链接**：`[https://www.youtube.com/watch?v=wZOcZ1IfJQ4&t=4303s](https://www.youtube.com/watch?v=wZOcZ1IfJQ4&t=4303s)`
    
- **提取参数**：视频 ID 是 `wZOcZ1IfJQ4`，时间戳是 `4303` 秒。
    
- **转换为嵌入格式**：将 `watch?v=` 换成 `embed/`，并将时间参数 `t=4303s` 转换为 YouTube 嵌入专属的 `start=4303` 参数：
    
    `[https://www.youtube.com/embed/wZOcZ1IfJQ4?start=4303](https://www.youtube.com/embed/wZOcZ1IfJQ4?start=4303)`
    

### 2. 修改你的 HTML 模块代码

那我我的前端项目视频代码是这样的：
```html
<div class="glass-card p-3 md:p-4 flex justify-between items-center hover:bg-white/10 group transition-all">  
    <div class="flex items-center space-x-4 overflow-hidden">  
        <div class="w-10 h-10 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center shrink-0">  
            <span class="text-xl">🎥</span>  
        </div>        <div class="flex flex-col truncate">  
            <span class="text-white font-bold text-[11px] md:text-sm tracking-wide truncate">算命</span>  
            <span class="text-gray-400 text-[9px] md:text-[10px] mt-1 truncate">徐童 2009 纪录片</span>  
        </div>    </div>    <button @click="openGame('算命', 'https://www.youtube.com/embed/0rIjJW_kTV4?start=522')"  
            class="cursor-pointer text-[#fb7299] hover:text-[#050505] text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 font-mono font-bold shrink-0 whitespace-nowrap bg-transparent hover:bg-[#fb7299] border border-[#fb7299]/50 hover:border-[#fb7299] rounded-full px-4 py-1.5 ml-3 shadow-[0_0_10px_rgba(251,114,153,0)] hover:shadow-[0_0_15px_rgba(251,114,153,0.4)]">  
        PLAY  
    </button>  
</div>
```