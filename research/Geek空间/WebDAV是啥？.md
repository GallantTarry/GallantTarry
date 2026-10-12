# WebDAV是啥？

WebDAV（Web-based Distributed Authoring and Versioning）是一种基于 HTTP 的通信协议扩展。简单来说，它能把远程服务器变成你电脑上的一个“网络硬盘”，让你像操作本地文件一样直接读写、修改和管理云端文件。

  

常规的 HTTP 协议像是一个**橱窗**：你主要向服务器请求“看”里面的网页和图片（GET），或者提交表单（POST）。而 WebDAV 给这个橱窗加了一扇**门**和一把**锁**，允许你直接进去重新摆放货物（上传、移动、修改、删除文件）。

<!-- WebDAV 交互组件 UI -->
<div id="webdav-widget">
<style>
#webdav-widget { background: #1a1a1a; padding: 20px; border-radius: 12px; color: #e5e7eb; font-family: -apple-system, sans-serif; user-select: none; margin: 20px 0; }
#webdav-widget * { box-sizing: border-box; }
#webdav-widget .glass { background: #222; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
#webdav-widget .header { display: flex; justify-content: space-between; margin-bottom: 24px; padding: 0 10%; }
#webdav-widget .node { border: 1px solid #444; padding: 6px 20px; border-radius: 20px; font-size: 14px; background: #2a2a2a; }
#webdav-widget .step-row { display: flex; align-items: center; margin-bottom: 16px; opacity: 0.3; transition: opacity 0.3s; position: relative; }
#webdav-widget .step-row.active { opacity: 1; }
#webdav-widget .step-num { width: 24px; height: 24px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 16px; flex-shrink: 0; }
#webdav-widget .step-row.active .step-num { background: #3b82f6; color: #fff; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
#webdav-widget .arrow-wrap { flex: 1; display: flex; align-items: center; position: relative; }
#webdav-widget .line { height: 2px; background: #444; flex: 1; }
#webdav-widget .step-row.active .line { background: #3b82f6; }
#webdav-widget .arrow { width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 8px solid #444; }
#webdav-widget .step-row.active .arrow { border-left-color: #3b82f6; }
#webdav-widget .badge { position: absolute; left: 50%; transform: translateX(-50%); background: #222; border: 1px solid #444; padding: 4px 16px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap; }
#webdav-widget .step-row.active .badge { background: #1e3a8a; border-color: #3b82f6; color: #fff; }
#webdav-widget .info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
#webdav-widget .info-title { font-size: 16px; font-weight: bold; display: flex; align-items: center; gap: 12px; }
#webdav-widget .type-tag { font-size: 12px; padding: 2px 8px; border-radius: 6px; border: 1px solid #444; color: #aaa; }
#webdav-widget .desc { color: #aaa; font-size: 14px; margin-bottom: 12px; line-height: 1.6; }
#webdav-widget .code { background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #a5b4fc; white-space: pre-wrap; word-break: break-all; margin: 0; }
#webdav-widget .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
#webdav-widget .btn { background: transparent; border: 1px solid #444; color: #eee; padding: 6px 16px; border-radius: 16px; cursor: pointer; font-size: 13px; outline: none; }
#webdav-widget .btn:hover { background: #333; }
</style>
<div class="glass">
<div class="header"><div class="node">客户端 (Client)</div><div class="node">WebDAV 服务器</div></div>
<div id="webdav-timeline"></div>
</div>
<div class="glass">
<div class="info-top">
<div class="info-title"><span id="wd-method" class="node" style="background:#1e3a8a;border-color:#3b82f6;color:#fff;">GET</span><span id="wd-name">读取网页内容</span></div>
<span id="wd-type" class="type-tag">HTTP 标准方法</span>
</div>
<div id="wd-desc" class="desc">描述加载中...</div>
<pre id="wd-code" class="code">代码加载中...</pre>
</div>
<div class="glass controls">
<div><button class="btn" onclick="window.wdPrev()">上一步</button><button class="btn" onclick="window.wdNext()" style="margin-left:8px;">下一步</button></div>
<div id="wd-counter" style="font-size:13px;color:#aaa;font-variant-numeric:tabular-nums;">1 / 6</div>
<button id="wd-play" class="btn" onclick="window.wdTogglePlay()">自动播放</button>
</div>
</div>

<!-- 脚本容器：类型设为 text/plain 防止直接执行 -->
<script id="wd-logic" type="text/plain">
(function(){
var steps = [
{m:"GET",n:"读取网页 / 文件内容",t:"HTTP 标准方法",d:"客户端使用标准 HTTP GET 方法发起读取请求。用于直接下载文件或浏览 WebDAV 根目录的资源表示。",c:"GET /files/document.docx HTTP/1.1\nHost: dav.example.com\nAccept: */*"},
{m:"PROPFIND",n:"获取文件属性与目录结构",t:"WebDAV 扩展",d:"不仅查询文件是否存在，还一次性获取文件的作者、大小、最后修改时间等元数据，如果是文件夹还能带出内部层级。",c:"PROPFIND /files/ HTTP/1.1\nDepth: 1\nContent-Type: application/xml\n\n<propfind>\n  <prop><displayname/><getcontentlength/></prop>\n</propfind>"},
{m:"MKCOL",n:"创建新文件夹 (集合)",t:"WebDAV 扩展",d:"Make Collection。直接在远程服务器的指定路径下新建一个目录，而无需网页管理后台干预。",c:"MKCOL /files/new_folder/ HTTP/1.1\nHost: dav.example.com"},
{m:"LOCK",n:"锁定文件防止并发",t:"WebDAV 扩展",d:"独占锁。在本地开始编辑云端文档前发出，防止其他协作者同时修改导致数据覆盖。服务器会返回一个锁令牌。",c:"LOCK /files/document.docx HTTP/1.1\nTimeout: Second-3600\n\n<lockinfo>\n  <lockscope><exclusive/></lockscope>\n  <locktype><write/></locktype>\n</lockinfo>"},
{m:"PUT",n:"上传 / 覆盖文件内容",t:"HTTP 标准方法",d:"将本地修改后的文件实体数据覆盖回服务器。如果是被锁定的文件，必须在请求头中带上正确的 Lock-Token。",c:"PUT /files/document.docx HTTP/1.1\nIf: <urn:uuid:lock-token>\nContent-Type: application/vnd.openxmlformats...\n\n[二进制文件数据...]"},
{m:"UNLOCK",n:"释放文件锁",t:"WebDAV 扩展",d:"文件保存并上传成功后，释放该文件的独占锁，让其他协作者可以继续获取和修改。",c:"UNLOCK /files/document.docx HTTP/1.1\nLock-Token: <urn:uuid:lock-token>"}
];
var curr = 0;
if(window.wdTimer){clearInterval(window.wdTimer);window.wdTimer=null;}
function update(){
for(var i=0;i<steps.length;i++){
var el = document.getElementById('wd-step-'+i);
if(el) el.className = (i===curr) ? 'step-row active' : 'step-row';
}
var s = steps[curr];
var elMethod = document.getElementById('wd-method');
if(elMethod) {
elMethod.innerText = s.m;
document.getElementById('wd-name').innerText = s.n;
document.getElementById('wd-type').innerText = s.t;
document.getElementById('wd-desc').innerText = s.d;
document.getElementById('wd-code').innerText = s.c;
document.getElementById('wd-counter').innerText = (curr+1)+' / '+steps.length;
}
}
window.wdNext = function(){curr=(curr+1)%steps.length;update();};
window.wdPrev = function(){curr=(curr-1+steps.length)%steps.length;update();};
window.wdTogglePlay = function(){
var btn = document.getElementById('wd-play');
if(window.wdTimer){clearInterval(window.wdTimer);window.wdTimer=null;btn.innerText="自动播放";btn.style.color="#eee";btn.style.borderColor="#444";}
else{window.wdNext();window.wdTimer=setInterval(window.wdNext,2500);btn.innerText="暂停播放";btn.style.color="#3b82f6";btn.style.borderColor="#3b82f6";}
};
var tl = document.getElementById('webdav-timeline');
if(tl){
var html = '';
for(var i=0;i<steps.length;i++){
html+='<div class="step-row" id="wd-step-'+i+'"><div class="step-num">'+(i+1)+'</div><div class="arrow-wrap"><div class="line"></div><div class="badge">'+steps[i].m+'</div><div class="arrow"></div></div></div>';
}
tl.innerHTML = html;
update();
}
})();
</script>

<!-- 黑魔法注入器：利用图片加载失败事件强制执行上述 JS 代码 -->
<img src="x" onerror="var s=document.createElement('script');s.innerHTML=document.getElementById('wd-logic').innerHTML;document.body.appendChild(s);this.remove();" style="display:none;">

### 核心能力扩展

为了实现“把网页当硬盘用”，WebDAV 在标准 HTTP 的基础上增加了几个专属的核心命令：

  

- **属性管理 (PROPFIND / PROPPATCH)**：不仅能读取文件内容，还能查询和修改文件的元数据（如文件大小、创建时间、作者），或者获取整个文件夹的目录结构。
    
      
    
- **文件锁 (LOCK / UNLOCK)**：当你在云端直接编辑一个 Office 文档时，WebDAV 可以把该文件锁住，防止其他用户同时修改导致数据冲突。
    
      
    
- **集合管理 (MKCOL)**：允许在服务器上直接创建新的文件夹（集合）。
    
      
    
- **直接操作 (COPY / MOVE)**：直接在服务器端复制或移动文件，而不需要像传统方式那样“先下载到本地，再上传到新位置”。
    
      
    

### 常见应用场景

- **挂载网络驱动器**：将 NAS（如群晖、威联通）或支持该协议的网盘（如 Nextcloud、坚果云）直接映射为 Windows 的本地磁盘（如 `Z:` 盘）或 Mac 的 Finder 位置。
    
      
    
- **软件跨端同步**：很多注重隐私和本地化的软件（如 Obsidian、Joplin、Zotero）都原生支持通过 WebDAV 将数据同步到你自己的云服务器上。
    
      
    
- **日历与通讯录同步**：苹果和安卓系统中广泛使用的 CalDAV（日历）和 CardDAV（联系人）协议，底层就是基于 WebDAV 衍生出来的。

