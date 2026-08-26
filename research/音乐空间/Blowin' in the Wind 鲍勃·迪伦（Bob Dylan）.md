
# Blowin' in the Wind 鲍勃·迪伦（Bob Dylan）


<!-- 专属定制：极简暗黑毛玻璃 APlayer -->
<style>
  /* 1. 基础质感：暗黑毛玻璃，完美融入主题 */
  .custom-aplayer {
      background: rgba(24, 24, 27, 0.4) !important; 
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 16px !important;
      margin: 30px 0 !important;
  }
  
  /* 2. 封面图片与播放按钮美化 */
  .custom-aplayer .aplayer-pic {
      border-radius: 12px !important;
      margin: 12px !important;
      height: 66px !important;
      width: 66px !important;
  }
  .custom-aplayer .aplayer-pic .aplayer-play {
      border: 2px solid #fff !important;
      background: rgba(0, 0, 0, 0.5) !important;
  }
  .custom-aplayer .aplayer-pic .aplayer-play:hover {
      background: #10b981 !important;
      border-color: #10b981 !important;
  }

  /* 3. 文本与进度条颜色适配 (翠绿主题色) */
  .custom-aplayer .aplayer-info .aplayer-music .aplayer-title { color: #f4f4f5 !important; font-weight: bold !important; }
  .custom-aplayer .aplayer-info .aplayer-music .aplayer-author { color: #a1a1aa !important; }
  .custom-aplayer .aplayer-played { background: #10b981 !important; }
  .custom-aplayer .aplayer-thumb { background: #10b981 !important; border: 2px solid #fff !important; }

  /* 4. 👇 核心精简：隐藏所有不需要的冗余按钮 👇 */
  .custom-aplayer .aplayer-icon-back,     /* 隐藏上一首 */
  .custom-aplayer .aplayer-icon-forward,  /* 隐藏下一首 */
  .custom-aplayer .aplayer-icon-order,    /* 隐藏顺序播放(向右箭头) */
  .custom-aplayer .aplayer-icon-menu,     /* 隐藏列表菜单(三横杠) */
  .custom-aplayer .aplayer-icon-lrc,      /* 隐藏歌词按钮 */
  .custom-aplayer .aplayer-time .aplayer-icon-play { /* 隐藏右侧重复的播放按钮(保留封面那个即可) */
      display: none !important;
  }

  /* 5. 统一保留下来的图标大小（音量、循环） */
  .custom-aplayer .aplayer-icon {
      width: 18px !important;
      height: 18px !important;
      opacity: 0.8;
  }
  .custom-aplayer .aplayer-icon path { fill: #d4d4d8 !important; }
  .custom-aplayer .aplayer-icon:hover { opacity: 1; }
</style>

<!-- 播放器容器 -->
<div id="aplayer-bob" class="custom-aplayer"></div>

<!-- 播放器初始化脚本 -->
<script>
  setTimeout(() => {
    new APlayer({
        container: document.getElementById('aplayer-bob'),
        theme: '#10b981', 
        audio: [{
            name: "Blowin' in the Wind", 
            artist: "Bob Dylan", 
            url: "/media/音乐/Blowin' in the Wind.mp3", 
            cover: "/media/音乐/Blowin' in the Wind.jpg" // 建议放一张同名封面图
        }]
    });
  }, 500);
</script>




How many roads must a man walk down

一个男人要走过多少条路

Before you call him a man?

才能被称为真正的男子汉？

How many seas must a white dove sail

一只白鸽要飞过多少片大海

Before she sleeps in the sand?

才能在沙丘上安眠？

Yes, and how many times must the cannonballs fly

炮弹要掠过天空多少次

Before they're forever banned?

才会被永远禁止？

**The answer, my friend, is blowin' in the wind**

**答案啊，我的朋友，在风中飘荡**

**The answer is blowin' in the wind**

**答案就在风中飘荡**

How many years can a mountain exist

一座山峰要屹立多少年

Before it's washed to the sea?

才会被冲刷入海？

Yes, and how many years can some people exist

一些人要生存多少年

Before they're allowed to be free?

才能获得自由？

Yes, and how many times can a man turn his head

一个人可以多少次转过头去

And pretend that he just doesn't see?

假装他什么都没有看见？

**The answer, my friend, is blowin' in the wind**

**答案啊，我的朋友，在风中飘荡**

**The answer is blowin' in the wind**

**答案就在风中飘荡**

How many times must a man look up

一个人要仰望多少次

Before he can see the sky?

才能真正看到天空？

Yes, and how many ears must one man have

一个人要有多少只耳朵

Before he can hear people cry?

才能听到众生的哭泣？

Yes, and how many deaths will it take 'till he knows

到底要牺牲多少生命他才知道

That too many people have died?

已有太多的人死去？

**The answer, my friend, is blowin' in the wind**

**答案啊，我的朋友，在风中飘荡**

**The answer is blowin' in the wind**

**答案就在风中飘荡**

### 赏析小注

这首歌在1960年代成为了美国民权运动和反战运动的圣歌。它并没有给出具体而僵化的结论，而是通过一系列比喻（如白鸽、炮弹、山脉），将对正义、和平与自由的追求交给了时间与每个人的内心。

就像歌词里说的，有些问题的答案或许并不在书本里，而是在那阵不断吹拂、永不停歇的时代之风中。