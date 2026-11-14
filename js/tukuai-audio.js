class TukuaiAudioComponent extends HTMLElement {
    connectedCallback() {
        const url = this.getAttribute('url') || this.getAttribute('src');
        if (!url) return;

        const name = this.getAttribute('name') || this.getAttribute('title') || '未知音频';
        const artist = this.getAttribute('artist') || this.getAttribute('author') || '满载而归';
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
                preload: 'metadata',
                audio: [{
                    name: name,
                    artist: artist,
                    url: url,
                    cover: cover
                }]
            });

            this._bindMediaSession(name, artist);
        }, 50);
    }

    _resolveAssetUrl(relPath) {
        return new URL(relPath, document.baseURI || window.location.href).href;
    }

    _syncPositionState(audioEl) {
        if (!('mediaSession' in navigator) || typeof navigator.mediaSession.setPositionState !== 'function') return;
        if (!audioEl || !Number.isFinite(audioEl.duration) || audioEl.duration <= 0) return;

        try {
            navigator.mediaSession.setPositionState({
                duration: audioEl.duration,
                playbackRate: audioEl.playbackRate || 1,
                position: Math.min(audioEl.currentTime || 0, audioEl.duration)
            });
        } catch (_) {
            // 部分浏览器在特定状态下不允许更新进度信息，静默忽略
        }
    }

    _bindMediaSession(name, artist) {
        const audioEl = this.ap && this.ap.audio;
        if (!audioEl || !('mediaSession' in navigator)) return;

        const safeSetAction = (action, handler) => {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (_) {
                // 忽略不支持特定 action 的内核
            }
        };

        const registerMetadata = () => {
            window.__TK_ACTIVE_AUDIO__ = this;
            navigator.mediaSession.metadata = new MediaMetadata({
                title: name,
                artist: artist || '满载而归',
                album: '满载而归 · 海底宝藏',
                artwork: [
                    {src: this._resolveAssetUrl('favicon/treasure-cover.png'), sizes: '512x512', type: 'image/png'},
                    {src: this._resolveAssetUrl('favicon/appletreasure.png'), sizes: '180x180', type: 'image/png'}
                ]
            });

            safeSetAction('play', () => this.ap && this.ap.play());
            safeSetAction('pause', () => this.ap && this.ap.pause());
            safeSetAction('seekbackward', (details) => {
                if (!this.ap) return;
                const offset = (details && details.seekOffset) || 10;
                this.ap.seek(Math.max(0, (audioEl.currentTime || 0) - offset));
                this._syncPositionState(audioEl);
            });
            safeSetAction('seekforward', (details) => {
                if (!this.ap || !Number.isFinite(audioEl.duration)) return;
                const offset = (details && details.seekOffset) || 10;
                this.ap.seek(Math.min(audioEl.duration, (audioEl.currentTime || 0) + offset));
                this._syncPositionState(audioEl);
            });
            safeSetAction('seekto', (details) => {
                if (!this.ap || !details || typeof details.seekTime !== 'number' || !Number.isFinite(audioEl.duration)) return;
                this.ap.seek(Math.max(0, Math.min(details.seekTime, audioEl.duration)));
                this._syncPositionState(audioEl);
            });
        };

        this._onPlay = () => {
            registerMetadata();
            navigator.mediaSession.playbackState = 'playing';
            this._syncPositionState(audioEl);
        };

        this._onPause = () => {
            if (window.__TK_ACTIVE_AUDIO__ !== this) return;
            navigator.mediaSession.playbackState = 'paused';
            this._syncPositionState(audioEl);
        };

        this._onSyncPos = () => {
            if (window.__TK_ACTIVE_AUDIO__ !== this) return;
            this._syncPositionState(audioEl);
        };

        audioEl.addEventListener('play', this._onPlay);
        audioEl.addEventListener('pause', this._onPause);
        audioEl.addEventListener('ended', this._onPause);
        audioEl.addEventListener('loadedmetadata', this._onSyncPos);
        audioEl.addEventListener('seeked', this._onSyncPos);
    }

    disconnectedCallback() {
        const audioEl = this.ap && this.ap.audio;
        if (audioEl) {
            if (this._onPlay) audioEl.removeEventListener('play', this._onPlay);
            if (this._onPause) {
                audioEl.removeEventListener('pause', this._onPause);
                audioEl.removeEventListener('ended', this._onPause);
            }
            if (this._onSyncPos) {
                audioEl.removeEventListener('loadedmetadata', this._onSyncPos);
                audioEl.removeEventListener('seeked', this._onSyncPos);
            }
        }

        if (window.__TK_ACTIVE_AUDIO__ === this) {
            window.__TK_ACTIVE_AUDIO__ = null;
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'none';
                ['play', 'pause', 'seekbackward', 'seekforward', 'seekto'].forEach((action) => {
                    try { navigator.mediaSession.setActionHandler(action, null); } catch (_) {}
                });
            }
        }

        // 核心保护：切换离开页面时，浏览器自动调用销毁，音乐立即停播，不留残留！
        if (this.ap) {
            try { this.ap.destroy(); } catch (e) {}
            this.ap = null;
        }
    }
}

customElements.define('tukuai-audio', TukuaiAudioComponent);
