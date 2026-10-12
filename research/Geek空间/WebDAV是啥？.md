# WebDAV是啥？

WebDAV（Web-based Distributed Authoring and Versioning）是一种基于 HTTP 的通信协议扩展。简单来说，它能把远程服务器变成你电脑上的一个“网络硬盘”，让你像操作本地文件一样直接读写、修改和管理云端文件。

  

常规的 HTTP 协议像是一个**橱窗**：你主要向服务器请求“看”里面的网页和图片（GET），或者提交表单（POST）。而 WebDAV 给这个橱窗加了一扇**门**和一把**锁**，允许你直接进去重新摆放货物（上传、移动、修改、删除文件）。

<style>
.tk_wd_wrap{--tk-bg:#1a1a1a;--tk-panel:#222;--tk-border:#333;--tk-text:#e5e7eb;--tk-hl:#3b82f6;background:var(--tk-bg);padding:20px;border-radius:12px;color:var(--tk-text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;user-select:none;margin:20px 0;width:100%;max-width:900px;box-sizing:border-box;}
.tk_wd_wrap *{box-sizing:border-box;}
.tk_wd_glass{background:var(--tk-panel);border:1px solid var(--tk-border);border-radius:12px;padding:20px;margin-bottom:16px;}
.tk_wd_header{display:flex;justify-content:space-between;margin-bottom:24px;padding:0 5%;}
.tk_wd_node{border:1px solid #444;padding:6px 20px;border-radius:20px;font-size:14px;background:#2a2a2a;}
.tk_wd_row{display:flex;align-items:center;margin-bottom:16px;opacity:0.3;transition:opacity 0.3s;position:relative;}
.tk_wd_row.tk_wd_act{opacity:1;}
.tk_wd_num{width:24px;height:24px;border-radius:50%;background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;margin-right:16px;flex-shrink:0;}
.tk_wd_row.tk_wd_act .tk_wd_num{background:var(--tk-hl);color:#fff;box-shadow:0 0 10px rgba(59,130,246,0.4);}
.tk_wd_arr_w{flex:1;display:flex;align-items:center;position:relative;}
.tk_wd_line{height:2px;background:#444;flex:1;}
.tk_wd_row.tk_wd_act .tk_wd_line{background:var(--tk-hl);}
.tk_wd_arr{width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:8px solid #444;}
.tk_wd_row.tk_wd_act .tk_wd_arr{border-left-color:var(--tk-hl);}
.tk_wd_badge{position:absolute;left:50%;transform:translateX(-50%);background:#222;border:1px solid #444;padding:4px 16px;border-radius:12px;font-size:12px;font-weight:bold;white-space:nowrap;}
.tk_wd_row.tk_wd_act .tk_wd_badge{background:#1e3a8a;border-color:var(--tk-hl);color:#fff;}
.tk_wd_top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;}
.tk_wd_title{font-size:16px;font-weight:bold;display:flex;align-items:center;gap:12px;}
.tk_wd_tag{font-size:12px;padding:2px 8px;border-radius:6px;border:1px solid #444;color:#aaa;}
.tk_wd_desc{color:#aaa;font-size:14px;margin-bottom:12px;line-height:1.6;}
.tk_wd_code{background:#000;border:1px solid var(--tk-border);padding:12px;border-radius:8px;font-family:monospace;font-size:13px;color:#a5b4fc;white-space:pre-wrap;word-break:break-all;margin:0;}
.tk_wd_ctrl{display:flex;justify-content:space-between;align-items:center;}
.tk_wd_btn{background:transparent;border:1px solid #444;color:#eee;padding:6px 16px;border-radius:16px;cursor:pointer;font-size:13px;outline:none;transition:all 0.3s;}
.tk_wd_btn:hover{background:#333;}
@media(max-width:600px){.tk_wd_header{padding:0;}.tk_wd_node{padding:4px 10px;font-size:12px;}.tk_wd_badge{padding:2px 8px;font-size:10px;}.tk_wd_code{font-size:11px;}}
</style>
<div class="tk_wd_wrap">
<div class="tk_wd_glass">
<div class="tk_wd_header"><div class="tk_wd_node">客户端 (Client)</div><div class="tk_wd_node">WebDAV 服务器</div></div>
<div id="tk_wd_tl"></div>
</div>
<div class="tk_wd_glass">
<div class="tk_wd_top">
<div class="tk_wd_title"><span id="tk_wd_m_btn" class="tk_wd_node" style="background:#1e3a8a;border-color:#3b82f6;color:#fff;">...</span><span id="tk_wd_name">...</span></div>
<span id="tk_wd_type" class="tk_wd_tag">...</span>
</div>
<div id="tk_wd_desc" class="tk_wd_desc">...</div>
<pre id="tk_wd_code" class="tk_wd_code">...</pre>
</div>
<div class="tk_wd_glass tk_wd_ctrl">
<div><button class="tk_wd_btn" onclick="tk_wd_state.pr()">上一步</button><button class="tk_wd_btn" onclick="tk_wd_state.nx()" style="margin-left:8px;">下一步</button></div>
<div id="tk_wd_counter" style="font-size:13px;color:#aaa;font-variant-numeric:tabular-nums;"></div>
<button id="tk_wd_play" class="tk_wd_btn" onclick="tk_wd_state.pl()">自动播放</button>
</div>
</div>
<script id="tk_wd_data" type="text/plain">[{"m":"GET","n":"读取网页 / 文件内容","t":"HTTP 标准方法","d":"客户端使用标准 HTTP GET 方法发起读取请求。用于直接下载文件或浏览 WebDAV 根目录的资源表示。","c":"GET /files/document.docx HTTP/1.1\nHost: dav.example.com\nAccept: */*"},{"m":"PROPFIND","n":"获取文件属性与目录结构","t":"WebDAV 扩展","d":"不仅查询文件是否存在，还一次性获取文件的作者、大小、最后修改时间等元数据，如果是文件夹还能带出内部层级。","c":"PROPFIND /files/ HTTP/1.1\nDepth: 1\nContent-Type: application/xml\n\n<propfind>\n  <prop><displayname/><getcontentlength/></prop>\n</propfind>"},{"m":"MKCOL","n":"创建新文件夹 (集合)","t":"WebDAV 扩展","d":"Make Collection。直接在远程服务器的指定路径下新建一个目录，而无需网页管理后台干预。","c":"MKCOL /files/new_folder/ HTTP/1.1\nHost: dav.example.com"},{"m":"LOCK","n":"锁定文件防止并发","t":"WebDAV 扩展","d":"独占锁。在本地开始编辑云端文档前发出，防止其他协作者同时修改导致数据覆盖。服务器会返回一个锁令牌。","c":"LOCK /files/document.docx HTTP/1.1\nTimeout: Second-3600\n\n<lockinfo>\n  <lockscope><exclusive/></lockscope>\n  <locktype><write/></locktype>\n</lockinfo>"},{"m":"PUT","n":"上传 / 覆盖文件内容","t":"HTTP 标准方法","d":"将本地修改后的文件实体数据覆盖回服务器。如果是被锁定的文件，必须在请求头中带上正确的 Lock-Token。","c":"PUT /files/document.docx HTTP/1.1\nIf: <urn:uuid:lock-token>\nContent-Type: application/vnd.openxmlformats...\n\n[二进制文件数据...]"},{"m":"UNLOCK","n":"释放文件锁","t":"WebDAV 扩展","d":"文件保存并上传成功后，释放该文件的独占锁，让其他协作者可以继续获取和修改。","c":"UNLOCK /files/document.docx HTTP/1.1\nLock-Token: <urn:uuid:lock-token>"}]</script>
<img src="tk_wd_trigger" style="display:none" onerror="window.tk_wd_state=window.tk_wd_state||{c:0,tm:null,d:JSON.parse(document.getElementById('tk_wd_data').innerHTML),up:function(){var d=document;var q=function(i){return d.getElementById(i)};for(var i=0;i<this.d.length;i++){var el=q('tk_wd_step_'+i);if(el)el.className=i===this.c?'tk_wd_row tk_wd_act':'tk_wd_row'}var s=this.d[this.c];if(q('tk_wd_m_btn')){q('tk_wd_m_btn').innerText=s.m;q('tk_wd_name').innerText=s.n;q('tk_wd_type').innerText=s.t;q('tk_wd_desc').innerText=s.d;q('tk_wd_code').innerText=s.c;q('tk_wd_counter').innerText=(this.c+1)+' / '+this.d.length;}},nx:function(){this.c=(this.c+1)%this.d.length;this.up()},pr:function(){this.c=(this.c-1+this.d.length)%this.d.length;this.up()},pl:function(){var b=document.getElementById('tk_wd_play');if(this.tm){clearInterval(this.tm);this.tm=null;b.innerText='自动播放';b.style.color='#eee';b.style.borderColor='#444'}else{this.nx();var t=this;this.tm=setInterval(function(){t.nx()},2500);b.innerText='暂停播放';b.style.color='#3b82f6';b.style.borderColor='#3b82f6'}}};var th=window.tk_wd_state;var tl=document.getElementById('tk_wd_tl');if(tl&&tl.innerHTML===''){var h='';for(var i=0;i<th.d.length;i++){h+=`<div class='tk_wd_row' id='tk_wd_step_${i}'><div class='tk_wd_num'>${i+1}</div><div class='tk_wd_arr_w'><div class='tk_wd_line'></div><div class='tk_wd_badge'>${th.d[i].m}</div><div class='tk_wd_arr'></div></div></div>`;}tl.innerHTML=h;th.up();}this.remove();">




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

