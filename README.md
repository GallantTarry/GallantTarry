<!-- 专属定制：云端艺术字库 + 极客暗黑 & 温柔幻彩双主题 + PC/移动端响应式主页 -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@1,400;1,600&display=swap');
/* ====== 1. 极客暗黑模式 (默认) ：深空毛玻璃与翠绿流光 ====== */
.tk-home {
  --tk-title-grad: linear-gradient(135deg, #f4f4f5 0%, #10b981 100%);
  --tk-title-shadow: 0px 4px 30px rgba(16, 185, 129, 0.4);
  --tk-sub-color: #8a8a93;
  --tk-h3-color: #f4f4f5;
  --tk-h3-border: #27272a;
  --tk-quote-grad: linear-gradient(120deg, #d4d4d8 0%, #10b981 100%);
  --tk-quote-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
  --tk-text-bold: #e4e4e7;
  --tk-text-muted: #a1a1aa;
  --tk-divider: #3f3f46;
  --tk-quest-bg: rgba(39, 39, 42, 0.45);
  --tk-quest-border: rgba(255, 255, 255, 0.05);
  --tk-quest-hover-border: rgba(16, 185, 129, 0.4);
  --tk-quest-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --tk-quest-num: #10b981;
  --tk-quest-arrow: #52525b;
}
/* ====== 2. 温柔幻彩白昼模式 (body.theme-light) 自动适配 ====== */
body.theme-light .tk-home {
  --tk-title-grad: linear-gradient(135deg, #2e1065 0%, #db2777 55%, #7c3aed 100%);
  --tk-title-shadow: 0px 4px 24px rgba(236, 72, 153, 0.25);
  --tk-sub-color: #6d597a;
  --tk-h3-color: #2e1065;
  --tk-h3-border: rgba(236, 72, 153, 0.25);
  --tk-quote-grad: linear-gradient(120deg, #4c1d95 0%, #ec4899 100%);
  --tk-quote-shadow: 0 4px 15px rgba(236, 72, 153, 0.15);
  --tk-text-bold: #2e1065;
  --tk-text-muted: #5b4b6c;
  --tk-divider: rgba(236, 72, 153, 0.35);
  --tk-quest-bg: linear-gradient(135deg, rgba(255, 245, 250, 0.85) 0%, rgba(243, 238, 255, 0.85) 100%);
  --tk-quest-border: rgba(244, 114, 182, 0.3);
  --tk-quest-hover-border: rgba(236, 72, 153, 0.6);
  --tk-quest-shadow: 0 8px 20px rgba(167, 139, 250, 0.12);
  --tk-quest-num: #db2777;
  --tk-quest-arrow: #a855f7;
}
/* 顶部巨幕名言 */
.tk-hero {
  text-align: center;
  margin: 40px 0;
}
.tk-hero-title {
  font-family: 'Cinzel Decorative', 'Georgia', serif;
  font-size: 32px;
  font-weight: 900;
  background: var(--tk-title-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: var(--tk-title-shadow);
  letter-spacing: 2px;
  margin-bottom: 12px;
  line-height: 1.35;
}
.tk-hero-sub {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--tk-sub-color);
  letter-spacing: 2px;
}
/* 双栏响应式网格 */
.tk-grid {
  display: grid;
  grid-template-columns: 45fr 55fr;
  gap: 48px;
  margin: 20px 0 36px;
  align-items: start;
}
.tk-section-title {
  font-family: 'Cinzel Decorative', 'Georgia', serif;
  color: var(--tk-h3-color) !important;
  border-bottom: 1px solid var(--tk-h3-border);
  padding-bottom: 8px;
  margin-top: 0 !important;
  margin-bottom: 14px !important;
  font-size: 18px;
  letter-spacing: 0.8px;
}
/* 序言区样式 */
.tk-prologue-quote {
  font-family: 'Cinzel Decorative', 'Georgia', serif;
  font-style: italic;
  font-size: 16px;
  letter-spacing: 1.5px;
  text-align: center;
  background: var(--tk-quote-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: var(--tk-quote-shadow);
  margin: 24px 0;
  line-height: 1.5;
}
.tk-prologue-list {
  list-style-type: none !important;
  padding-left: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tk-prologue-item {
  font-size: 13.5px;
  color: var(--tk-text-muted);
  line-height: 1.6;
  padding-left: 12px;
  margin: 0 !important;
  transition: transform 0.25s ease;
}
.tk-prologue-item:hover {
  transform: translateX(4px);
}
.tk-prologue-item b {
  color: var(--tk-text-bold);
  letter-spacing: 1px;
}
.tk-prologue-divider {
  color: var(--tk-divider);
  margin: 0 6px;
}
/* 技术栈卡片样式 */
.tk-tech-card {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.tk-tech-card:hover {
  transform: translateX(4px);
}
.tk-tech-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 3px;
}
.tk-tech-badge {
  padding: 1px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px;
  font-weight: 600;
}
.tk-tech-name {
  color: var(--tk-text-bold);
  letter-spacing: 0.5px;
  font-size: 14px;
}
.tk-tech-desc {
  font-size: 13px;
  color: var(--tk-text-muted);
  line-height: 1.4;
  margin-left: 2px;
}
/* 正在推进的副本 */
.tk-quest-heading {
  font-family: 'Cinzel Decorative', 'Georgia', serif;
  color: var(--tk-h3-color) !important;
  text-align: center;
  margin-top: 36px !important;
  letter-spacing: 1px;
  font-size: 18px;
}
.tk-quest-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 540px;
  margin: 24px auto 0;
}
.tk-quest-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--tk-quest-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 8px;
  border: 1px solid var(--tk-quest-border);
  box-shadow: var(--tk-quest-shadow);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.tk-quest-item:hover {
  transform: translateY(-2px);
  border-color: var(--tk-quest-hover-border);
}
.tk-quest-num {
  color: var(--tk-quest-num);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16px;
  flex-shrink: 0;
}
.tk-quest-title {
  color: var(--tk-text-bold);
  font-size: 13.5px;
  width: 160px;
  text-align: left;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}
.tk-quest-arrow {
  color: var(--tk-quest-arrow);
  margin-right: 16px;
  flex-shrink: 0;
}
.tk-quest-desc {
  color: var(--tk-text-muted);
  font-size: 13.5px;
  text-align: left;
  flex: 1;
}
/* 底部徽章栏 */
.tk-badges {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 40px 0 20px;
}
.tk-badges a {
  transition: transform 0.25s ease;
}
.tk-badges a:hover {
  transform: translateY(-2px);
}
/* ====== 3. 手机端与平板小屏响应式适配 (≤ 768px) ====== */
@media screen and (max-width: 768px) {
  .tk-hero {
    margin: 24px 0;
  }
  .tk-hero-title {
    font-size: 22px;
    letter-spacing: 1px;
  }
  .tk-hero-sub {
    font-size: 11px;
    letter-spacing: 1px;
    padding: 0 8px;
  }
  .tk-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .tk-prologue-quote {
    font-size: 14.5px;
    margin: 18px 0;
  }
  .tk-quest-item {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tk-quest-num {
    margin-right: 8px;
  }
  .tk-quest-title {
    width: auto;
    margin-right: 8px;
  }
  .tk-quest-arrow {
    margin-right: 8px;
  }
  .tk-quest-desc {
    min-width: 120px;
  }
}
</style>

<div class="tk-home">
  <div class="tk-hero">
    <div class="tk-hero-title">"We are standing on the shoulders of giants."</div>
    <div class="tk-hero-sub">"At its core, technology is a shared infrastructure belonging to all of humanity."</div>
  </div>
  <div class="tk-grid">
    <div>
      <h3 class="tk-section-title">❖ 序言 / PROLOGUE</h3>
      <p class="tk-prologue-quote">"Technology is essentially a vessel; what truly gives it a soul is your creative intent."</p>
      <ul class="tk-prologue-list">
        <li class="tk-prologue-item" style="border-left: 2px solid #10b981;">
          <b>第九艺术</b><span class="tk-prologue-divider">|</span>在电子游戏的叙事中寻找逻辑闭环。
        </li>
        <li class="tk-prologue-item" style="border-left: 2px solid #a78bfa;">
          <b>音符画布</b><span class="tk-prologue-divider">|</span>在乐理与体积之间寻找美的诠释定义。
        </li>
        <li class="tk-prologue-item" style="border-left: 2px solid #0ea5e9;">
          <b>水下放空</b><span class="tk-prologue-divider">|</span>肉体是灵魂的奴隶。
        </li>
        <li class="tk-prologue-item" style="border-left: 2px solid #f59e0b;">
          <b>极客时刻</b><span class="tk-prologue-divider">|</span>寻找下一个点燃香烟的借口。
        </li>
      </ul>
    </div>
    <div>
      <h3 class="tk-section-title">❖ 技术栈 / TECH STACK</h3>
      <div class="tk-tech-card" style="background: linear-gradient(90deg, rgba(16,185,129,0.08) 0%, transparent 100%); border-left: 3px solid #10b981;">
        <div class="tk-tech-header">
          <code class="tk-tech-badge" style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3);">05%</code>
          <b class="tk-tech-name">C Language</b>
        </div>
        <div class="tk-tech-desc">越过抽象层与内存直接对话。</div>
      </div>
      <div class="tk-tech-card" style="background: linear-gradient(90deg, rgba(226,113,29,0.08) 0%, transparent 100%); border-left: 3px solid #e2711d;">
        <div class="tk-tech-header">
          <code class="tk-tech-badge" style="background: rgba(226,113,29,0.15); color: #e2711d; border: 1px solid rgba(226,113,29,0.3);">04%</code>
          <b class="tk-tech-name">Java (Swing / Spring Boot)</b>
        </div>
        <div class="tk-tech-desc">体会面向对象与并发解耦之美。</div>
      </div>
      <div class="tk-tech-card" style="background: linear-gradient(90deg, rgba(55,118,171,0.1) 0%, transparent 100%); border-left: 3px solid #3776ab;">
        <div class="tk-tech-header">
          <code class="tk-tech-badge" style="background: rgba(55,118,171,0.15); color: #3b82f6; border: 1px solid rgba(55,118,171,0.4);">03%</code>
          <b class="tk-tech-name">Python (PySide6)</b>
        </div>
        <div class="tk-tech-desc">以极简语法降维打击。</div>
      </div>
      <div class="tk-tech-card" style="background: linear-gradient(90deg, rgba(227,79,38,0.08) 0%, transparent 100%); border-left: 3px solid #e34f26;">
        <div class="tk-tech-header">
          <code class="tk-tech-badge" style="background: rgba(227,79,38,0.15); color: #e34f26; border: 1px solid rgba(227,79,38,0.3);">02%</code>
          <b class="tk-tech-name">Web & Serverless</b>
        </div>
        <div class="tk-tech-desc">理解HTML/CSS/JS与Cloudflare生态结合。</div>
      </div>
      <div class="tk-tech-card" style="background: linear-gradient(90deg, rgba(6,182,212,0.08) 0%, transparent 100%); border-left: 3px solid #06b6d4;">
        <div class="tk-tech-header">
          <code class="tk-tech-badge" style="background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3);">01%</code>
          <b class="tk-tech-name">Go & Wails & Vue</b>
        </div>
        <div class="tk-tech-desc">打破沙盒铸造轻量级跨平台桌面应用。</div>
      </div>
    </div>
  </div>
  <h3 class="tk-quest-heading">❖ 正在推进的副本 / CURRENT QUESTS</h3>
  <div class="tk-quest-list">
    <div class="tk-quest-item">
      <span class="tk-quest-num">[01]</span>
      <b class="tk-quest-title">Indie Game Dev</b>
      <span class="tk-quest-arrow">→</span>
      <span class="tk-quest-desc">Clod ＆ Gold 土块与金苹果</span>
    </div>
    <div class="tk-quest-item">
      <span class="tk-quest-num">[02]</span>
      <b class="tk-quest-title">Desktop Artifacts</b>
      <span class="tk-quest-arrow">→</span>
      <span class="tk-quest-desc">继续深造</span>
    </div>
    <div class="tk-quest-item">
      <span class="tk-quest-num">[03]</span>
      <b class="tk-quest-title">Network & Cloud</b>
      <span class="tk-quest-arrow">→</span>
      <span class="tk-quest-desc">网络架构学习</span>
    </div>
    <div class="tk-quest-item">
      <span class="tk-quest-num">[04]</span>
      <b class="tk-quest-title">Captain's Dream</b>
      <span class="tk-quest-arrow">→</span>
      <span class="tk-quest-desc">船长之梦</span>
    </div>
  </div>
  <div class="tk-badges">
    <a href="https://github.com/GallantTarry"><img src="https://img.shields.io/badge/Profile-TuKuai-18181b?style=for-the-badge&logo=github&logoColor=white" alt="TuKuai"/></a>
    <a href="https://steamcommunity.com/id/ImShaoXiaBieZou/"><img src="https://img.shields.io/badge/Steam-疯狂游玩中-1b2838?style=for-the-badge&logo=steam&logoColor=white" alt="Steam"/></a>
    <a href="https://www.minecraft.net/"><img src="https://img.shields.io/badge/Game-Minecraft-2b6643?style=for-the-badge&logo=minecraft&logoColor=white" alt="Minecraft"/></a>
    <a href="https://space.bilibili.com/396312441"><img src="https://img.shields.io/badge/Bilibili-叫我烤地瓜-fb7299?style=for-the-badge&logo=bilibili&logoColor=white" alt="Bilibili"/></a>
  </div>
</div>
