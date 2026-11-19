const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ===== 配置 =====
const targetDir = '海底宝藏';
const outputFile = 'feed.xml';
const siteTitle = '土块';
const siteDesc = '编程、技术、笔记、艺术、生活、随笔';
const maxItems = 30;                       // feed 里最多放最近多少篇
const excludeDirs = ['🔒个人创作'];         // 有密码保护的目录，不公开到 feed
const siteUrl = 'https://' + fs.readFileSync('CNAME', 'utf-8').trim() + '/';

// ===== 工具函数 =====
function xmlEscape(s) {
    return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function collectMd(dir, list = []) {
    if (!fs.existsSync(dir)) return list;
    fs.readdirSync(dir).forEach(name => {
        if (name.startsWith('.')) return;
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            if (excludeDirs.includes(name)) return;
            collectMd(full, list);
        } else if (name.endsWith('.md')) {
            list.push(full.replace(/\\/g, '/'));
        }
    });
    return list;
}

// 用 git 历史得到每篇文章“首次提交时间”（比文件修改时间可靠）
function gitFirstCommitDates() {
    const map = new Map();
    try {
        const out = execFileSync(
            'git', ['-c', 'core.quotepath=false', 'log', '--name-only', '--format=@@%aI', '--', targetDir],
            { encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 }
        );
        let date = null;
        out.split(/\r?\n/).forEach(line => {
            if (line.startsWith('@@')) date = line.slice(2);
            else if (line.trim() && date) map.set(line.trim(), date); // 越往后越旧，最终保留最早一次
        });
    } catch (e) {
        console.log('提示：读取 git 历史失败，将使用文件修改时间。');
    }
    return map;
}

// 取正文前一段作为摘要
function summarize(text, max = 140) {
    const lines = text.replace(/\r/g, '').split('\n');
    let inCode = false;
    for (const raw of lines) {
        const line = raw.trim();
        if (line.startsWith('```')) { inCode = !inCode; continue; }
        if (inCode || !line) continue;
        if (/^(#|>|<|\||[-*+]\s|\d+\.\s|!\[|---|===)/.test(line)) continue;
        const plain = line
            .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/[*_`~]/g, '')
            .trim();
        if (plain.length < 8) continue;
        return plain.length > max ? plain.slice(0, max) + '…' : plain;
    }
    return '';
}

function title(text, fallback) {
    const m = text.match(/^#\s+(.+)$/m);
    return (m ? m[1] : fallback).trim();
}

// ===== 主流程 =====
console.log('正在生成 feed.xml ...');
const dates = gitFirstCommitDates();
const items = collectMd(targetDir).map(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const dt = new Date(dates.get(file) || fs.statSync(file).mtime);
    const encoded = file.split('/').map(encodeURIComponent).join('/');
    return {
        title: title(content, path.basename(file, '.md')),
        link: `${siteUrl}#/${encoded}`,
        date: dt,
        desc: summarize(content),
        category: file.split('/')[1] || ''
    };
}).sort((a, b) => b.date - a.date).slice(0, maxItems);

const lastBuild = items.length ? items[0].date : new Date();
const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xmlEscape(siteTitle)}</title>`,
    `    <link>${siteUrl}</link>`,
    `    <description>${xmlEscape(siteDesc)}</description>`,
    '    <language>zh-CN</language>',
    `    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}feed.xml" rel="self" type="application/rss+xml"/>`,
    ...items.map(it => [
        '    <item>',
        `      <title>${xmlEscape(it.title)}</title>`,
        `      <link>${xmlEscape(it.link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(it.link)}</guid>`,
        `      <pubDate>${it.date.toUTCString()}</pubDate>`,
        it.category ? `      <category>${xmlEscape(it.category)}</category>` : null,
        `      <description>${xmlEscape(it.desc)}</description>`,
        '    </item>'
    ].filter(Boolean).join('\n')),
    '  </channel>',
    '</rss>',
    ''
].join('\n');

fs.writeFileSync(outputFile, xml, 'utf-8');
console.log(`搞定！feed.xml 已更新，共收录最近 ${items.length} 篇文章。`);
