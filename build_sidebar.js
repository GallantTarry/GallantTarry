const fs = require('fs');
const path = require('path');

// 配置扫描目录和输出文件
const targetDir = '海底宝藏';
const outputFile = '_sidebar.md';

let sidebarContent = '* 首页\n  * [README](README.md)\n';

function generateSidebar(dir, level = 0) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (file.startsWith('.')) return;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        const indent = '  '.repeat(level);

        if (stat.isDirectory()) {
            sidebarContent += `${indent}* ${file}\n`;
            generateSidebar(fullPath, level + 1);
        } else if (file.endsWith('.md')) {
            const fileNameWithoutExt = file.replace('.md', '');
            // 将反斜杠替换为正斜杠
            let urlPath = fullPath.replace(/\\/g, '/');
            
            // 【核心修复】：对路径中的每一段进行 URL 编码，解决空格导致无法点击的问题！
            const pathParts = urlPath.split('/');
            const encodedPathParts = pathParts.map(part => encodeURIComponent(part));
            const encodedUrlPath = encodedPathParts.join('/');

            sidebarContent += `${indent}  * [${fileNameWithoutExt}](${encodedUrlPath})\n`;
        }
    });
}

console.log('正在扫描目录...');
generateSidebar(targetDir);
fs.writeFileSync(outputFile, sidebarContent, 'utf-8');
console.log('搞定少侠！空格和中文路径的点击问题已修复。请重新运行此脚本。');