class TukuaiPlayerComponent extends HTMLElement {
    connectedCallback() {
        const url = this.getAttribute('url') || this.getAttribute('src');
        if (!url) return;

        const title = this.getAttribute('title') || '少侠的截图';
        const pic = this.getAttribute('pic') || '';
        const theme = this.getAttribute('theme') || '#10b981';

        // 动态生成骨架 DOM
        this.innerHTML = `
      <div class="tukuai-video-wrapper">
        <div class="tukuai-video-glow"></div>
        <div class="tukuai-player-core"></div>
      </div>
    `;

        const container = this.querySelector('.tukuai-player-core');

        // 初始化 DPlayer
        setTimeout(() => {
            if (!this.isConnected) return; // 如果已被切页卸载则终止

            this.dp = new DPlayer({
                container: container,
                theme: theme,
                screenshot: true,
                video: {
                    url: url,
                    pic: pic
                }
            });

            // 移动端防劫持全屏
            if (this.dp.video) {
                this.dp.video.setAttribute('playsinline', 'true');
                this.dp.video.setAttribute('webkit-playsinline', 'true');
                this.dp.video.setAttribute('x5-playsinline', 'true');
            }

            // 禁用右键菜单
            container.addEventListener('contextmenu', (e) => e.preventDefault());

            // 截图命名绑定
            const cameraBtn = container.querySelector('.dplayer-camera-icon');
            if (cameraBtn) {
                cameraBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const canvas = document.createElement('canvas');
                    canvas.width = this.dp.video.videoWidth;
                    canvas.height = this.dp.video.videoHeight;
                    canvas.getContext('2d').drawImage(this.dp.video, 0, 0, canvas.width, canvas.height);
                    const a = document.createElement('a');
                    a.href = canvas.toDataURL('image/png');
                    a.download = `${title}.png`;
                    a.click();
                }, true);
            }
        }, 50);
    }

    disconnectedCallback() {
        // 切走路由离开当前文章时，浏览器自动调用，彻底杜绝背景音残留和内存泄漏
        if (this.dp) {
            try { this.dp.destroy(); } catch (e) {}
            this.dp = null;
        }
    }
}

customElements.define('tukuai-player', TukuaiPlayerComponent);