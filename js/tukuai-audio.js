class TukuaiAudioComponent extends HTMLElement {
    connectedCallback() {
        const url = this.getAttribute('url') || this.getAttribute('src');
        if (!url) return;

        const name = this.getAttribute('name') || this.getAttribute('title') || '未知音频';
        const artist = this.getAttribute('artist') || this.getAttribute('author') || '';
        const cover = this.getAttribute('cover') || this.getAttribute('pic') || '';
        const theme = this.getAttribute('theme') || '#10b981';

        // 创建内部独立容器，避免全局 ID 冲突
        const container = document.createElement('div');
        container.className = 'custom-aplayer';
        this.appendChild(container);

        setTimeout(() => {
            if (!this.isConnected) return; // 切页保护

            this.ap = new APlayer({
                container: container,
                theme: theme,
                audio: [{
                    name: name,
                    artist: artist,
                    url: url,
                    cover: cover
                }]
            });
        }, 50);
    }

    disconnectedCallback() {
        // 核心保护：切换离开页面时，浏览器自动调用销毁，音乐立即停播，不留残留！
        if (this.ap) {
            try { this.ap.destroy(); } catch (e) {}
            this.ap = null;
        }
    }
}

customElements.define('tukuai-audio', TukuaiAudioComponent);