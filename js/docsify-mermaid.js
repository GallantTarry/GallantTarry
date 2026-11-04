/* Mermaid 12.2.0: https://cdn.jsdelivr.net/npm/mermaid@12.2.0/dist/mermaid.min.js
 * 本地完整包，许可证见 mermaid.LICENSE；无需额外 CDN 分块。
 */
(function () {
    'use strict';

    const config = window.$docsify = window.$docsify || {};
    let revision = 0;
    let rendering = false;
    let diagramId = 0;
    let theme = currentTheme();

    function currentTheme() {
        return document.body.classList.contains('theme-light') ? 'light' : 'dark';
    }

    function mermaidConfig(card) {
        const css = getComputedStyle(card);
        const color = name => css.getPropertyValue('--mermaid-' + name).trim();
        const text = color('text');
        const line = color('line');
        return {
            startOnLoad: false,
            securityLevel: 'strict',
            suppressErrorRendering: true,
            theme: 'base',
            look: 'classic',
            fontFamily: color('font'),
            flowchart: { htmlLabels: true, useMaxWidth: false },
            sequence: { useMaxWidth: false },
            themeVariables: {
                darkMode: currentTheme() === 'dark',
                fontFamily: color('font'),
                fontSize: '14px',
                background: color('label-bg'),
                primaryColor: color('primary'),
                primaryBorderColor: color('primary-border'),
                primaryTextColor: text,
                secondaryColor: color('secondary'),
                secondaryBorderColor: color('secondary-border'),
                secondaryTextColor: text,
                tertiaryColor: color('tertiary'),
                tertiaryBorderColor: color('tertiary-border'),
                tertiaryTextColor: text,
                textColor: text,
                lineColor: line,
                edgeLabelBackground: color('label-bg'),
                clusterBkg: color('cluster'),
                clusterBorder: color('cluster-border'),
                titleColor: text,
                actorBkg: color('primary'),
                actorBorder: color('primary-border'),
                actorTextColor: text,
                actorLineColor: line,
                signalColor: line,
                signalTextColor: text,
                labelBoxBkgColor: color('secondary'),
                labelBoxBorderColor: color('secondary-border'),
                labelTextColor: text,
                loopTextColor: text,
                noteBkgColor: color('tertiary'),
                noteBorderColor: color('tertiary-border'),
                noteTextColor: text,
                activationBkgColor: color('secondary'),
                activationBorderColor: color('secondary-border'),
                sequenceNumberColor: color('label-bg')
            }
        };
    }

    function prepareDiagrams(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        template.content.querySelectorAll('pre').forEach(pre => {
            const code = pre.querySelector('code');
            const language = (pre.dataset.lang || '').trim().split(/\s+/)[0].toLowerCase();
            if (language !== 'mermaid' && !code?.matches('.language-mermaid, .lang-mermaid')) return;

            const card = document.createElement('div');
            card.className = 'mermaid-card is-loading';
            card.dataset.mermaidSource = (code || pre).textContent;
            card.setAttribute('aria-busy', 'true');
            card.innerHTML = '<div class="mermaid-status" role="status">正在绘制图表…</div>' +
                '<div class="mermaid-diagram" tabindex="0" role="region" aria-label="Mermaid 图表，可横向滚动" hidden></div>';
            pre.replaceWith(card);
        });
        return template.innerHTML;
    }

    function showError(card) {
        card.classList.add('is-error');
        const message = document.createElement('div');
        message.className = 'mermaid-error';
        message.setAttribute('role', 'status');
        message.textContent = '图表暂时无法显示，请检查 Mermaid 语法或刷新页面重试。';
        const details = document.createElement('details');
        details.className = 'mermaid-source';
        const summary = document.createElement('summary');
        summary.textContent = '查看图表源码';
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = card.dataset.mermaidSource;
        pre.appendChild(code);
        details.append(summary, pre);
        card.append(message, details);
    }

    // Mermaid 的配置是全局的：串行渲染，并丢弃快速切主题/换文章后的旧结果。
    async function renderDiagrams() {
        revision++;
        if (rendering) return;
        rendering = true;
        let completedRevision;
        try {
            do {
                completedRevision = revision;
                // 双重兜底：若在 afterEach 阶段被其它插件（如 docsify-latex）临时遮蔽，在 DOM 阶段补全转换为卡片
                document.querySelectorAll('.markdown-section pre').forEach(pre => {
                    const code = pre.querySelector('code');
                    const language = (pre.dataset.lang || '').trim().split(/\s+/)[0].toLowerCase();
                    if (language === 'mermaid' || code?.matches('.language-mermaid, .lang-mermaid')) {
                        const card = document.createElement('div');
                        card.className = 'mermaid-card is-loading';
                        card.dataset.mermaidSource = (code || pre).textContent;
                        card.setAttribute('aria-busy', 'true');
                        card.innerHTML = '<div class="mermaid-status" role="status">正在绘制图表…</div>' +
                            '<div class="mermaid-diagram" tabindex="0" role="region" aria-label="Mermaid 图表，可横向滚动" hidden></div>';
                        pre.replaceWith(card);
                    }
                });
                const cards = document.querySelectorAll('.markdown-section .mermaid-card');
                for (const card of cards) {
                    if (completedRevision !== revision) break;
                    if (!card.isConnected) continue;
                    const viewport = card.querySelector('.mermaid-diagram');
                    const status = card.querySelector('.mermaid-status');
                    card.querySelectorAll('.mermaid-error, .mermaid-source').forEach(node => node.remove());
                    card.classList.remove('is-error');
                    card.classList.add('is-loading');
                    card.setAttribute('aria-busy', 'true');
                    status.hidden = false;
                    viewport.hidden = true;
                    try {
                        if (!window.mermaid) throw new Error('Mermaid 未加载');
                        window.mermaid.initialize(mermaidConfig(card));
                        const result = await window.mermaid.render('site-mermaid-' + (++diagramId), card.dataset.mermaidSource);
                        if (completedRevision !== revision || !card.isConnected) continue;
                        viewport.innerHTML = result.svg;
                        const svg = viewport.querySelector('svg');
                        const width = svg.viewBox.baseVal.width;
                        if (width > 0) {
                            // 保持文字的自然字号，宽图在容器内滚动，不压缩到无法阅读。
                            svg.style.width = width + 'px';
                            svg.style.maxWidth = 'none';
                            svg.style.height = 'auto';
                        }
                        result.bindFunctions?.(viewport);
                        viewport.hidden = false;
                        card.dataset.renderedTheme = currentTheme();
                    } catch (error) {
                        if (completedRevision !== revision || !card.isConnected) continue;
                        viewport.replaceChildren();
                        showError(card);
                        console.warn('[Mermaid] 图表渲染失败:', error);
                    } finally {
                        if (completedRevision === revision && card.isConnected) {
                            card.classList.remove('is-loading');
                            card.setAttribute('aria-busy', 'false');
                            status.hidden = true;
                        }
                    }
                }
            } while (completedRevision !== revision);
        } finally {
            rendering = false;
        }
    }

    config.plugins = (config.plugins || []).concat(function (hook) {
        hook.afterEach(prepareDiagrams);
        hook.doneEach(renderDiagrams);
    });

    // 只响应实际主题变化；侧边栏与开场动画也会改 body.class。
    new MutationObserver(function () {
        const nextTheme = currentTheme();
        if (nextTheme !== theme) {
            theme = nextTheme;
            renderDiagrams();
        }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // 字体加载完成后再校正文字测量，避免中文标签被截断。
    document.fonts?.ready.then(renderDiagrams);
})();
