# Steve Jobs Secrets of Life

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
url: 'media/videos/生活的秘密.mp4',
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





这段著名的独白出自1994年圣克拉拉谷历史协会（Santa Clara Valley Historical Association）对乔布斯的一次采访。在这一分多钟里，他分享了他对“生活真相”的顿悟，这也是他一生中最常被引用的核心哲学之一。

  

以下是完整的英文原话与中文翻译：

  

**英文原话 (English Transcript):**

  

"When you grow up, you tend to get told that the world is the way it is and your life is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money.

  

That's a very limited life. Life can be much broader once you discover one simple fact: Everything around you that you call life was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use.

  

The minute that you understand that you can poke life and actually something will, you know, if you push in, something will pop out the other side, that you can change it, you can mold it.

  

That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it.

  

I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again."

  

**中文翻译：**

  

“当你慢慢长大，人们通常会告诉你，世界就是这个样子的，你的人生就是在这个既定的世界里好好过日子。尽量别去四处碰壁。试着拥有一个美好的家庭，寻欢作乐，攒点小钱。

  

但那是一种极其局限的生活。一旦你发现一个简单的事实，你的生活就可以变得无比广阔。那就是：**你周围所有被称为‘生活’的事物，都是由那些并不比你更聪明的人创造出来的。** 而且你可以改变它，你可以影响它，你可以创造出属于你自己的东西供他人使用。

  

当你明白你可以去‘戳一戳’生活——如果你在这边推一下，另一边就会有东西弹出来——那一刻你就会知道，你可以改变它，塑造它。

  

这也许是最重要的事情。那就是摆脱‘生活就在那里，你只能被动地去适应它’这种错误的观念；相反，你要去拥抱它，改变它，改善它，并在它上面留下你的印记。

  

我认为这非常重要。无论你是如何领悟到这一点的，一旦你明白了，你就会想要去改变生活，让它变得更好，因为这世界在很多方面其实是一团糟的。一旦你学会了这一点，你的人生将永远不同。”