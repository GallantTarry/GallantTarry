# Keanu Reeves

<style>  
.dplayer-menu, .dplayer-full { display: none !important; }  
</style>  
<!-- 顶级播放器外框：深空毛玻璃 + 翠绿环境呼吸光 -->  
<div style="position: relative; padding: 12px; border-radius: 24px; background: rgba(15, 20, 30, 0.55); backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.12); border-top: 1px solid rgba(255, 255, 255, 0.25); box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05); margin: 3rem auto; max-width: 850px; transition: transform 0.4s ease, box-shadow 0.4s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 35px 65px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(16, 185, 129, 0.25), inset 0 0 20px rgba(255, 255, 255, 0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05)';">  
<div style="position: absolute; bottom: -15px; left: 10%; right: 10%; height: 30px; background: #10b981; filter: blur(50px); opacity: 0.35; z-index: 1; pointer-events: none;"></div>  
<div id="tukuai-player" style="border-radius: 14px; overflow: hidden; background-color: #000; position: relative; z-index: 10;"></div>  
</div>  
  
<script>  
setTimeout(() => {  
const dp = new DPlayer({  
container: document.getElementById('tukuai-player'),  
theme: '#10b981',  
screenshot: true,  
video: {  
url: 'media/videos/基努眼中美好的休息日应该做什么？.mp4',  
}  
});  
document.getElementById('tukuai-player').addEventListener('contextmenu', function(e) {  
e.preventDefault();  
});  
const cameraBtn = document.querySelector('#tukuai-player .dplayer-camera-icon');  
if(cameraBtn) {  
cameraBtn.addEventListener('click', function(e) {  
e.stopPropagation();  
e.preventDefault();  
const canvas = document.createElement('canvas');  
canvas.width = dp.video.videoWidth;  
canvas.height = dp.video.videoHeight;  
canvas.getContext('2d').drawImage(dp.video, 0, 0, canvas.width, canvas.height);  
const a = document.createElement('a');  
a.href = canvas.toDataURL('image/png');  
a.download = '少侠的截图.png';  
a.click();  
}, true);  
}  
}, 300);  
</script>

**主持人 (Interviewer):**

If you have a day off, do you have some perfect day off, some things that you like to do when you have not work, not being on stage?

如果你有一天休息...你会有过很完美的休息日吗？就是当你不用工作、不用在舞台上的时候，你有什么喜欢做的事情吗？

  

**基努·里维斯 (Keanu Reeves):**

Yeah, yeah, yeah there's lots of great stuff to do, yeah.

有的，有的，还真有不少很棒的事情可以做呢。

  

**主持人 (Interviewer):**

But you're like what?

但你想说啥...？

  

**基努·里维斯 (Keanu Reeves):**

I don't know, well okay, first of all, hopefully, you know, you finish a great job, you've done some great work.

我不知道怎么说...好吧，举个例子，首先，你希望你完成了工作，你很好的完成了工作。

  

You're coming home, you see some friends and family. You know, hopefully, you're in a relationship.

然后回到家，然后和朋友还有家人见见面。如果你在谈恋爱的话。

  

You have some morning sex. Eat a great breakfast. Go for a motorcycle ride.

在早上做一做什么的。吃一顿很好的早饭，然后去骑摩托车兜风。

  

Come back, swim, have more sex.

回来游个泳。再做一次。

  

Eat some more. Um, hang out for a little bit. Maybe do some reading. You know, go see a movie. Have more sex.

再吃点东西。出门玩一会。可能读一会书。或者看部电影什么的。再做一次。

  

Go to the bar, have a couple of drinks, see some friends, take a motorcycle ride.

去酒吧喝几杯。和朋友见面，骑摩托兜风。

  

Get home, hang out a little bit, have more sex. Um, that's a pretty good day.

回家，再出门玩会，再做一次。那真的是挺好的一天。

  

**主持人 (Interviewer):**

I love your life.

我爱你的生活。

  

**基努·里维斯 (Keanu Reeves):**

Oh, I'm not saying I get that, but you know I can hope for that.

噢，我没说我真的这么过的。但你知道的，这是种期望的生活。

  

**主持人 (Interviewer):**

Thank you so much for it.

感谢你的回答。