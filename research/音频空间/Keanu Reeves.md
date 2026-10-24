# Keanu Reeves

<!-- 专属定制：极客暗黑 & 温柔幻彩 双主题流光 DPlayer + 访谈对话卡片 (PC & 移动端自适应) -->
<style>
/* 隐藏冗余右键菜单与全屏按钮 */
.dplayer-menu,
.dplayer-full {
  display: none !important;
}
/* ====== 1. 极客暗黑模式 (默认) ：深空毛玻璃与翠绿蓝流光 ====== */
.tukuai-video-wrapper {
  position: relative;
  padding: 12px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(24, 24, 27, 0.75) 0%, rgba(15, 20, 30, 0.85) 100%);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(16, 185, 129, 0.28);
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8),
              0 0 40px rgba(16, 185, 129, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
  margin: 2.5rem auto;
  max-width: 850px;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.tukuai-video-wrapper:hover {
  transform: translateY(-4px);
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 35px 65px -15px rgba(0, 0, 0, 0.9),
              0 0 50px rgba(16, 185, 129, 0.24),
              inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
/* 底部环境呼吸流光 */
.tukuai-video-glow {
  position: absolute;
  bottom: -15px;
  left: 10%;
  right: 10%;
  height: 30px;
  background: linear-gradient(90deg, #10b981, #06b6d4, #3b82f6);
  filter: blur(48px);
  opacity: 0.38;
  z-index: 1;
  pointer-events: none;
  transition: all 0.35s ease;
}
.tukuai-video-wrapper:hover .tukuai-video-glow {
  opacity: 0.55;
  filter: blur(55px);
}
/* 播放器内胆 */
#tukuai-player {
  border-radius: 16px;
  overflow: hidden;
  background-color: #000;
  position: relative;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
/* DPlayer 内部进度条与音量条：翠绿到电光蓝渐变 */
#tukuai-player .dplayer-played,
#tukuai-player .dplayer-volume-bar-inner {
  background: linear-gradient(90deg, #10b981, #06b6d4, #3b82f6) !important;
}
#tukuai-player .dplayer-thumb {
  background: #10b981 !important;
  border: 2px solid #ffffff !important;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.9) !important;
}
/* ====== 2. 温柔幻彩白昼模式 (body.theme-light) 自动适配 ====== */
body.theme-light .tukuai-video-wrapper {
  background: linear-gradient(135deg, rgba(255, 245, 250, 0.85) 0%, rgba(243, 238, 255, 0.85) 50%, rgba(240, 253, 250, 0.85) 100%);
  border: 1px solid rgba(244, 114, 182, 0.38);
  border-top: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 24px 48px -12px rgba(167, 139, 250, 0.22),
              0 8px 24px rgba(236, 72, 153, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
body.theme-light .tukuai-video-wrapper:hover {
  border-color: rgba(236, 72, 153, 0.6);
  box-shadow: 0 30px 56px -12px rgba(236, 72, 153, 0.28),
              0 12px 30px rgba(139, 92, 246, 0.18),
              inset 0 1px 0 #ffffff;
}
body.theme-light .tukuai-video-glow {
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4);
  opacity: 0.32;
}
body.theme-light .tukuai-video-wrapper:hover .tukuai-video-glow {
  opacity: 0.48;
}
body.theme-light #tukuai-player {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}
body.theme-light #tukuai-player .dplayer-played,
body.theme-light #tukuai-player .dplayer-volume-bar-inner {
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4) !important;
}
body.theme-light #tukuai-player .dplayer-thumb {
  background: #ec4899 !important;
  border: 2px solid #ffffff !important;
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.85) !important;
}
/* ====== 3. 访谈对话录双主题样式 ====== */
.tk-dialogue-wrap {
  --dlg-card-bg: rgba(24, 24, 27, 0.45);
  --dlg-card-border: rgba(255, 255, 255, 0.06);
  --dlg-host-accent: #3b82f6;
  --dlg-keanu-accent: #10b981;
  --dlg-speaker-host: #60a5fa;
  --dlg-speaker-keanu: #34d399;
  --dlg-en-color: #f4f4f5;
  --dlg-zh-color: #a1a1aa;
  max-width: 850px;
  margin: 2.5rem auto 1rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
body.theme-light .tk-dialogue-wrap {
  --dlg-card-bg: linear-gradient(135deg, rgba(255, 245, 250, 0.78) 0%, rgba(243, 238, 255, 0.78) 100%);
  --dlg-card-border: rgba(244, 114, 182, 0.28);
  --dlg-host-accent: #8b5cf6;
  --dlg-keanu-accent: #ec4899;
  --dlg-speaker-host: #7c3aed;
  --dlg-speaker-keanu: #db2777;
  --dlg-en-color: #2e1065;
  --dlg-zh-color: #6d597a;
}
.tk-dialogue-card {
  padding: 16px 20px;
  border-radius: 16px;
  background: var(--dlg-card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--dlg-card-border);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.tk-dialogue-card:hover {
  transform: translateX(4px);
}
.tk-dialogue-card.host {
  border-left: 3.5px solid var(--dlg-host-accent);
}
.tk-dialogue-card.keanu {
  border-left: 3.5px solid var(--dlg-keanu-accent);
}
.tk-speaker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tk-dialogue-card.host .tk-speaker {
  color: var(--dlg-speaker-host);
}
.tk-dialogue-card.keanu .tk-speaker {
  color: var(--dlg-speaker-keanu);
}
.tk-line-group {
  margin-bottom: 12px;
}
.tk-line-group:last-child {
  margin-bottom: 0;
}
.tk-en {
  color: var(--dlg-en-color);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.55;
  margin-bottom: 3px;
}
.tk-zh {
  color: var(--dlg-zh-color);
  font-size: 13.5px;
  line-height: 1.55;
}
/* ====== 4. 手机端与小屏设备响应式适配 (≤ 768px) ====== */
@media screen and (max-width: 768px) {
  .tukuai-video-wrapper {
    padding: 6px;
    border-radius: 16px;
    margin: 1.25rem 0;
  }
  .tukuai-video-wrapper:hover {
    transform: none;
  }
  #tukuai-player {
    border-radius: 12px;
  }
  .tukuai-video-glow {
    bottom: -10px;
    height: 20px;
    filter: blur(32px);
  }
  #tukuai-player .dplayer-controller {
    padding: 0 10px !important;
  }
  #tukuai-player .dplayer-bar-wrap {
    padding: 8px 0 !important;
  }
  .tk-dialogue-wrap {
    margin: 1.5rem 0;
    gap: 12px;
  }
  .tk-dialogue-card {
    padding: 12px 14px;
    border-radius: 12px;
  }
  .tk-dialogue-card:hover {
    transform: none;
  }
  .tk-en {
    font-size: 14px;
  }
  .tk-zh {
    font-size: 13px;
  }
}
</style>

<!-- 顶级播放器外框：双主题毛玻璃 + 环境呼吸流光 -->
<div class="tukuai-video-wrapper">
  <div class="tukuai-video-glow"></div>
  <div id="tukuai-player"></div>
</div>

<!-- 中英对照访谈录 -->
<div class="tk-dialogue-wrap">
  <div class="tk-dialogue-card host">
    <div class="tk-speaker">🎙️ 主持人 (Interviewer)</div>
    <div class="tk-line-group">
      <div class="tk-en">If you have a day off, do you have some perfect day off, some things that you like to do when you have not work, not being on stage?</div>
      <div class="tk-zh">如果你有一天休息...你会有过很完美的休息日吗？就是当你不用工作、不用在舞台上的时候，你有什么喜欢做的事情吗？</div>
    </div>
  </div>
  <div class="tk-dialogue-card keanu">
    <div class="tk-speaker">🕶️ 基努·里维斯 (Keanu Reeves)</div>
    <div class="tk-line-group">
      <div class="tk-en">Yeah, yeah, yeah there's lots of great stuff to do, yeah.</div>
      <div class="tk-zh">有的，有的，还真有不少很棒的事情可以做呢。</div>
    </div>
  </div>
  <div class="tk-dialogue-card host">
    <div class="tk-speaker">🎙️ 主持人 (Interviewer)</div>
    <div class="tk-line-group">
      <div class="tk-en">But you're like what?</div>
      <div class="tk-zh">但你想说啥...？</div>
    </div>
  </div>
  <div class="tk-dialogue-card keanu">
    <div class="tk-speaker">🕶️ 基努·里维斯 (Keanu Reeves)</div>
    <div class="tk-line-group">
      <div class="tk-en">I don't know, well okay, first of all, hopefully, you know, you finish a great job, you've done some great work.</div>
      <div class="tk-zh">我不知道怎么说...好吧，举个例子，首先，你希望你完成了工作，你很好的完成了工作。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">You're coming home, you see some friends and family. You know, hopefully, you're in a relationship.</div>
      <div class="tk-zh">然后回到家，然后和朋友还有家人见见面。如果你在谈恋爱的话。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">You have some morning sex. Eat a great breakfast. Go for a motorcycle ride.</div>
      <div class="tk-zh">在早上做一做什么的。吃一顿很好的早饭，然后去骑摩托车兜风。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">Come back, swim, have more sex.</div>
      <div class="tk-zh">回来游个泳。再做一次。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">Eat some more. Um, hang out for a little bit. Maybe do some reading. You know, go see a movie. Have more sex.</div>
      <div class="tk-zh">再吃点东西。出门玩一会。可能读一会书。或者看部电影什么的。再做一次。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">Go to the bar, have a couple of drinks, see some friends, take a motorcycle ride.</div>
      <div class="tk-zh">去酒吧喝几杯。和朋友见面，骑摩托兜风。</div>
    </div>
    <div class="tk-line-group">
      <div class="tk-en">Get home, hang out a little bit, have more sex. Um, that's a pretty good day.</div>
      <div class="tk-zh">回家，再出门玩会，再做一次。那真的是挺好的一天。</div>
    </div>
  </div>
  <div class="tk-dialogue-card host">
    <div class="tk-speaker">🎙️ 主持人 (Interviewer)</div>
    <div class="tk-line-group">
      <div class="tk-en">I love your life.</div>
      <div class="tk-zh">我爱你的生活。</div>
    </div>
  </div>
  <div class="tk-dialogue-card keanu">
    <div class="tk-speaker">🕶️ 基努·里维斯 (Keanu Reeves)</div>
    <div class="tk-line-group">
      <div class="tk-en">Oh, I'm not saying I get that, but you know I can hope for that.</div>
      <div class="tk-zh">噢，我没说我真的这么过的。但你知道的，这是种期望的生活。</div>
    </div>
  </div>
  <div class="tk-dialogue-card host">
    <div class="tk-speaker">🎙️ 主持人 (Interviewer)</div>
    <div class="tk-line-group">
      <div class="tk-en">Thank you so much for it.</div>
      <div class="tk-zh">感谢你的回答。</div>
    </div>
  </div>
</div>

<script>
setTimeout(() => {
  if (window.currentDPlayer) {
    try { window.currentDPlayer.destroy(); } catch (e) {}
    window.currentDPlayer = null;
  }
  if (window.currentDPlayerObserver) {
    window.currentDPlayerObserver.disconnect();
    window.currentDPlayerObserver = null;
  }

  const container = document.getElementById('tukuai-player');
  if (!container) return;

  const dp = new DPlayer({
    container: container,
    theme: '#10b981',
    screenshot: true,
    video: {
      url: 'media/videos/基努眼中美好的休息日应该做什么？.mp4'
    }
  });
  window.currentDPlayer = dp;

  if (dp.video) {
    dp.video.setAttribute('playsinline', 'true');
    dp.video.setAttribute('webkit-playsinline', 'true');
    dp.video.setAttribute('x5-playsinline', 'true');
  }

  container.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  const cameraBtn = container.querySelector('.dplayer-camera-icon');
  if (cameraBtn) {
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

  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      try { dp.destroy(); } catch (e) {}
      if (window.currentDPlayer === dp) {
        window.currentDPlayer = null;
      }
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.currentDPlayerObserver = observer;
}, 300);
</script>