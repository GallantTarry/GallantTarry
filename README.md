<!-- 专属定制：Docsify 与 GitHub 双平台完美兼容 + 云端艺术字库 + 双主题流光 + PC/移动端自适应 -->
<div><ruby><rp><style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@1,400;1,600&display=swap');
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
.tk-hero {
  text-align: center;
  margin: 40px 0;
}
.tk-home h2.tk-hero-title {
  font-family: 'Cinzel Decorative', 'Georgia', serif !important;
  font-size: 32px !important;
  font-weight: 900 !important;
  background: var(--tk-title-grad) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: var(--tk-title-shadow) !important;
  letter-spacing: 2px !important;
  margin: 0 0 12px 0 !important;
  padding: 0 !important;
  border: none !important;
  line-height: 1.35 !important;
}
.tk-hero-sub,
.tk-hero-sub i,
.tk-hero-sub sub {
  font-family: 'Playfair Display', 'Georgia', serif !important;
  font-style: italic !important;
  font-size: 12px !important;
  color: var(--tk-sub-color) !important;
  letter-spacing: 2px !important;
  vertical-align: baseline !important;
  margin: 0 !important;
}
.tk-home table.tk-layout-table {
  display: block !important;
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  margin: 20px 0 36px !important;
  overflow: visible !important;
}
.tk-home table.tk-layout-table tbody {
  display: block !important;
  width: 100% !important;
  border: none !important;
  background: transparent !important;
}
.tk-home table.tk-layout-table tr.tk-layout-row {
  display: grid !important;
  grid-template-columns: 45fr 55fr !important;
  gap: 48px !important;
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  align-items: start !important;
}
.tk-home table.tk-layout-table td.tk-layout-col {
  display: block !important;
  width: 100% !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
}
.tk-home h3.tk-section-title {
  font-family: 'Cinzel Decorative', 'Georgia', serif !important;
  color: var(--tk-h3-color) !important;
  border-bottom: 1px solid var(--tk-h3-border) !important;
  padding-bottom: 8px !important;
  margin-top: 0 !important;
  margin-bottom: 14px !important;
  font-size: 18px !important;
  letter-spacing: 0.8px !important;
}
.tk-home blockquote.tk-prologue-quote {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 24px 0 !important;
}
.tk-home blockquote.tk-prologue-quote p,
.tk-home blockquote.tk-prologue-quote i {
  font-family: 'Cinzel Decorative', 'Georgia', serif !important;
  font-style: italic !important;
  font-size: 16px !important;
  letter-spacing: 1.5px !important;
  text-align: center !important;
  background: var(--tk-quote-grad) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: var(--tk-quote-shadow) !important;
  margin: 0 !important;
  line-height: 1.5 !important;
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
.tk-prologue-item.tk-b-green { border-left: 2px solid #10b981; }
.tk-prologue-item.tk-b-purple { border-left: 2px solid #a78bfa; }
.tk-prologue-item.tk-b-blue { border-left: 2px solid #0ea5e9; }
.tk-prologue-item.tk-b-amber { border-left: 2px solid #f59e0b; }
.tk-prologue-item b {
  color: var(--tk-text-bold);
  letter-spacing: 1px;
}
.tk-prologue-divider {
  color: var(--tk-divider);
  margin: 0 6px;
}
.tk-tech-card {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.tk-tech-card:hover {
  transform: translateX(4px);
}
.tk-tech-c {
  background: linear-gradient(90deg, rgba(16,185,129,0.08) 0%, transparent 100%);
  border-left: 3px solid #10b981;
}
.tk-tech-java {
  background: linear-gradient(90deg, rgba(226,113,29,0.08) 0%, transparent 100%);
  border-left: 3px solid #e2711d;
}
.tk-tech-py {
  background: linear-gradient(90deg, rgba(55,118,171,0.1) 0%, transparent 100%);
  border-left: 3px solid #3776ab;
}
.tk-tech-web {
  background: linear-gradient(90deg, rgba(227,79,38,0.08) 0%, transparent 100%);
  border-left: 3px solid #e34f26;
}
.tk-tech-go {
  background: linear-gradient(90deg, rgba(6,182,212,0.08) 0%, transparent 100%);
  border-left: 3px solid #06b6d4;
}
.tk-tech-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 3px;
}
.tk-home code.tk-tech-badge {
  padding: 1px 6px !important;
  border-radius: 4px !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px !important;
  font-weight: 600 !important;
}
.tk-tech-c code.tk-tech-badge {
  background: rgba(16,185,129,0.15) !important;
  color: #10b981 !important;
  border: 1px solid rgba(16,185,129,0.3) !important;
}
.tk-tech-java code.tk-tech-badge {
  background: rgba(226,113,29,0.15) !important;
  color: #e2711d !important;
  border: 1px solid rgba(226,113,29,0.3) !important;
}
.tk-tech-py code.tk-tech-badge {
  background: rgba(55,118,171,0.15) !important;
  color: #3b82f6 !important;
  border: 1px solid rgba(55,118,171,0.4) !important;
}
.tk-tech-web code.tk-tech-badge {
  background: rgba(227,79,38,0.15) !important;
  color: #e34f26 !important;
  border: 1px solid rgba(227,79,38,0.3) !important;
}
.tk-tech-go code.tk-tech-badge {
  background: rgba(6,182,212,0.15) !important;
  color: #06b6d4 !important;
  border: 1px solid rgba(6,182,212,0.3) !important;
}
.tk-tech-name {
  color: var(--tk-text-bold);
  letter-spacing: 0.5px;
  font-size: 14px;
}
.tk-tech-desc,
.tk-tech-desc sub {
  font-size: 13px !important;
  color: var(--tk-text-muted) !important;
  line-height: 1.4 !important;
  margin-left: 2px !important;
  vertical-align: baseline !important;
}
.tk-home h3.tk-quest-heading {
  font-family: 'Cinzel Decorative', 'Georgia', serif !important;
  color: var(--tk-h3-color) !important;
  text-align: center !important;
  margin-top: 36px !important;
  letter-spacing: 1px !important;
  font-size: 18px !important;
  border: none !important;
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
.tk-home code.tk-quest-num {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: var(--tk-quest-num) !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  margin-right: 16px !important;
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
@media screen and (max-width: 768px) {
  .tk-hero {
    margin: 24px 0;
  }
  .tk-home h2.tk-hero-title {
    font-size: 22px !important;
    letter-spacing: 1px !important;
  }
  .tk-hero-sub,
  .tk-hero-sub i,
  .tk-hero-sub sub {
    font-size: 11px !important;
    letter-spacing: 1px !important;
    padding: 0 8px !important;
  }
  .tk-home table.tk-layout-table tr.tk-layout-row {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
  .tk-home blockquote.tk-prologue-quote p,
  .tk-home blockquote.tk-prologue-quote i {
    font-size: 14.5px !important;
  }
  .tk-quest-item {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tk-home code.tk-quest-num {
    margin-right: 8px !important;
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
</style></rp></ruby></div>

<div class="tk-home">
  <div align="center" class="tk-hero">
    <h2 class="tk-hero-title">"We are standing on the shoulders of giants."</h2>
    <p class="tk-hero-sub"><i><sub>"At its core, technology is a shared infrastructure belonging to all of humanity."</sub></i></p>
  </div>
  <table width="100%" class="tk-layout-table">
    <tr class="tk-layout-row">
      <td width="45%" valign="top" class="tk-layout-col">
        <h3 class="tk-section-title">❖ 序言 / PROLOGUE</h3>
        <blockquote class="tk-prologue-quote">
          <p align="center"><i>"Technology is essentially a vessel; what truly gives it a soul is your creative intent."</i></p>
        </blockquote>
        <ul class="tk-prologue-list">
          <li class="tk-prologue-item tk-b-green">
            <b>第九艺术</b> <span class="tk-prologue-divider">|</span> 在电子游戏的叙事中寻找逻辑闭环。
          </li>
          <li class="tk-prologue-item tk-b-purple">
            <b>音符画布</b> <span class="tk-prologue-divider">|</span> 在乐理与体积之间寻找美的诠释定义。
          </li>
          <li class="tk-prologue-item tk-b-blue">
            <b>水下放空</b> <span class="tk-prologue-divider">|</span> 肉体是灵魂的奴隶。
          </li>
          <li class="tk-prologue-item tk-b-amber">
            <b>极客时刻</b> <span class="tk-prologue-divider">|</span> 寻找下一个点燃香烟的借口。
          </li>
        </ul>
      </td>
      <td width="55%" valign="top" class="tk-layout-col">
        <h3 class="tk-section-title">❖ 技术栈 / TECH STACK</h3>
        <div class="tk-tech-card tk-tech-c">
          <div class="tk-tech-header">
            <code class="tk-tech-badge">05%</code> <b class="tk-tech-name">C Language</b>
          </div>
          <div class="tk-tech-desc"><sub>越过抽象层与内存直接对话。</sub></div>
        </div>
        <div class="tk-tech-card tk-tech-java">
          <div class="tk-tech-header">
            <code class="tk-tech-badge">04%</code> <b class="tk-tech-name">Java (Swing / Spring Boot)</b>
          </div>
          <div class="tk-tech-desc"><sub>体会面向对象与并发解耦之美。</sub></div>
        </div>
        <div class="tk-tech-card tk-tech-py">
          <div class="tk-tech-header">
            <code class="tk-tech-badge">03%</code> <b class="tk-tech-name">Python (PySide6)</b>
          </div>
          <div class="tk-tech-desc"><sub>以极简语法降维打击。</sub></div>
        </div>
        <div class="tk-tech-card tk-tech-web">
          <div class="tk-tech-header">
            <code class="tk-tech-badge">02%</code> <b class="tk-tech-name">Web & Serverless</b>
          </div>
          <div class="tk-tech-desc"><sub>理解HTML/CSS/JS与Cloudflare生态结合。</sub></div>
        </div>
        <div class="tk-tech-card tk-tech-go">
          <div class="tk-tech-header">
            <code class="tk-tech-badge">01%</code> <b class="tk-tech-name">Go & Wails & Vue</b>
          </div>
          <div class="tk-tech-desc"><sub>打破沙盒铸造轻量级跨平台桌面应用。</sub></div>
        </div>
      </td>
    </tr>
  </table>
  <h3 align="center" class="tk-quest-heading">❖ 正在推进的副本 / CURRENT QUESTS</h3>
  <div align="center" class="tk-quest-wrap">
    <div class="tk-quest-list">
      <div class="tk-quest-item">
        <code class="tk-quest-num">[01]</code> <b class="tk-quest-title">Indie Game Dev</b> <span class="tk-quest-arrow">→</span> <span class="tk-quest-desc">Clod ＆ Gold 土块与金苹果</span>
      </div>
      <div class="tk-quest-item">
        <code class="tk-quest-num">[02]</code> <b class="tk-quest-title">Desktop Artifacts</b> <span class="tk-quest-arrow">→</span> <span class="tk-quest-desc">继续深造</span>
      </div>
      <div class="tk-quest-item">
        <code class="tk-quest-num">[03]</code> <b class="tk-quest-title">Network & Cloud</b> <span class="tk-quest-arrow">→</span> <span class="tk-quest-desc">网络架构学习</span>
      </div>
      <div class="tk-quest-item">
        <code class="tk-quest-num">[04]</code> <b class="tk-quest-title">Captain's Dream</b> <span class="tk-quest-arrow">→</span> <span class="tk-quest-desc">船长之梦</span>
      </div>
    </div>
  </div>
  <br>
  <div align="center" class="tk-badges">
    <a href="https://github.com/GallantTarry"><img src="https://img.shields.io/badge/Profile-TuKuai-18181b?style=for-the-badge&logo=github&logoColor=white" alt="TuKuai"/></a>
    <a href="https://steamcommunity.com/id/ImShaoXiaBieZou/"><img src="https://img.shields.io/badge/Steam-疯狂游玩中-1b2838?style=for-the-badge&logo=steam&logoColor=white" alt="Steam"/></a>
    <a href="https://www.minecraft.net/"><img src="https://img.shields.io/badge/Game-Minecraft-2b6643?style=for-the-badge&logo=minecraft&logoColor=white" alt="Minecraft"/></a>
    <a href="https://space.bilibili.com/396312441"><img src="https://img.shields.io/badge/Bilibili-叫我烤地瓜-fb7299?style=for-the-badge&logo=bilibili&logoColor=white" alt="Bilibili"/></a>
  </div>
</div>