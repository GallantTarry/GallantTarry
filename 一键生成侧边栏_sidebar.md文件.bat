bat_content = """@echo off
:: 切换当前 cmd 窗口的代码页为 UTF-8，防止中文乱码
chcp 65001 >nul

echo ===================================================
echo   正在为您执行 build_sidebar.js 生成侧边栏...
echo ===================================================
echo.

:: 调用 node 执行 js 文件
node build_sidebar.js

echo.
echo ===================================================
echo   执行完毕！按任意键关闭此窗口...
echo ===================================================
pause >nul
"""

file_path = "/mnt/data/一键生成侧边栏.bat"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(bat_content)

print(f"File generated at: {file_path}")