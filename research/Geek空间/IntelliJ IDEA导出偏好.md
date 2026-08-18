# IntelliJ IDEA导出偏好

在 IntelliJ IDEA 中导出设置偏好主要通过将其打包为 `.zip` 文件来实现，这在需要将本地习惯的快捷键、UI 主题或代码风格快速同步到 Ubuntu 服务器或远程 SSH 开发环境时非常方便。

  

以下是具体的导出步骤：

  

**1.打开设置管理菜单：**IDEA 顶部导航栏。

在 IDEA 的顶部菜单栏中，点击 **File**（文件），然后将鼠标悬停或点击 **Manage IDE Settings**（管理 IDE 设置）。

_注：在较老版本的 IDEA 中，可能直接在 File 菜单下就能看到 Export Settings。_

  

**2.选择导出：**点击 Export Settings。

在展开的子菜单中，点击 **Export Settings...**（导出设置...）。

  

**3.勾选需要的配置：**

此时会弹出一个窗口，列出了所有可导出的组件。默认情况下通常是全选的，你可以根据需要取消勾选不需要的部分（例如只保留 Keymaps 或 Code Style）。

  

**4.确认保存路径：**生成 .zip 文件。

在窗口底部的 **Export settings to:** 文本框中，选择或确认 `.zip` 文件的保存路径，最后点击 **OK**（确定）。

  

> **补充提示：Settings Sync (设置同步)**
> 
> 如果你使用的是较新版本的 IDEA，并且拥有 JetBrains 账号，也可以直接在右上角点击齿轮图标（或进入 `Settings -> Settings Sync`）开启云端同步功能，这样只要登录账号就能自动拉取所有配置，无需手动传输 `.zip` 压缩包。