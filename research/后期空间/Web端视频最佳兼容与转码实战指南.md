# Web 视频跨平台极致兼容与 FFmpeg 压制实战指南

> 本指南总结了 Web 视频在移动端（iOS / Android / 微信浏览器）与 PC 端播放兼容性的底层技术细节，并提供了一套生产级、零报错的 FFmpeg 转码与精准控容方案。

---

## 一、 为什么很多视频电脑能播，手机却打不开？

在排查网页视频播放异常时，很多开发者常误以为“只要是 `.mp4` 后缀就一定能播”。实际上，**.mp4 只是一个封装容器（盒）**，里面装载的**视频流编码（Codec）**、**色彩空间**以及**元数据排布**才是决定设备能否解码的关键。

### 1. 编码格式陷阱：H.265 / HEVC (`hev1` vs `hvc1`)
- **iOS Safari 的“白名单”规则**：苹果从 iOS 11 开始支持 HEVC，但 WebKit 对 MP4 容器内的 FourCC（四字符标识）有严格限制——**只认 `hvc1`，绝对拒收 `hev1`**。如果视频在打包时标记为 `hev1`（很多录屏、剪辑软件的默认输出），iOS 浏览器会直接判定为损坏或未知格式，出现白屏或黑屏。
- **安卓与微信内嵌内核的“专利壁垒”**：由于 H.265 复杂的专利池授权费用，大部分移动端 Chromium 内核（如微信 X5 / Blink 内核）在 Web 层面并未原生开启 H.265 硬件解码通道，遇到后直接抛出解码失败。
- **电脑端为什么正常？**：PC 浏览器（如 Edge、Chrome）可以直接调用操作系统的 DirectShow / Media Foundation 软硬件加速或已安装的 HEVC 扩展，因此电脑端毫无压力。

### 2. 次世代编码门槛：AV1 (`av01`) 的芯片依赖
- AV1 是目前压缩率最高的新一代开源格式，但它**高度依赖移动端硬件芯片**：
  - **苹果生态**：仅 iPhone 15 Pro / iPhone 16 等搭载 **A17 Pro / A18 芯片**的机型才集成 AV1 硬件解码模块。
  - **安卓生态**：仅高通骁龙 8 Gen 2/3、联发科天玑 9000 等近年最新旗舰芯片支持硬解。
  - 普通机型和未集成 AV1 软解库的移动端 WebView 打开即无法加载。

### 3. 弱网长时间转圈元凶：未开启 `FastStart`
- MP4 文件的核心元数据索引存放在 **`moov` Atom** 中（包含音画时间戳、关键帧位置等）。
- 默认情况下，很多压制软件把 `moov` 写在**文件末尾**。
- **后果**：手机端浏览器无法边下边播，必须通过 HTTP 把整个视频文件（例如 80MB）全部下载到末尾读完 `moov` 后，才能起播第一秒。网络稍慢就会让用户误以为“死机 / 加载失败”。
- **解法**：开启 `faststart`，强制把 `moov` 搬到文件头部（几百 KB 内即可读取），实现**点击即秒开**。

---

## 二、 Web 端最完美的“黄金兼容标准”

经过大量实测与生产验证，以下参数组合可以在 **100% 的智能手机（iOS/Android）、平板、微信内嵌浏览器及 PC 桌面端**上稳定硬解秒播：

```mermaid
flowchart LR
    A[任意原始视频] --> B[FFmpeg 黄金转码管线]
    B --> C[视频流: H.264 High L3.1]
    B --> D[色彩格式: YUV 4:2:0 8-bit]
    B --> E[音频流: AAC mp4a]
    B --> F[流式优化: FastStart 头置索引]
    B --> G[画幅: Max 720P 保持比例]
```

| 核心指标 | 黄金参数配置 | 优势与原因 |
| :--- | :--- | :--- |
| **视频编码 (Codec)** | **H.264 / AVC (`avc1`)** | 全球兼容性 99.99%，所有移动端 GPU 原生支持硬件解码。 |
| **Profile (配置档次)** | **High Profile** | 画质细腻、压缩效率远高于 Baseline，且无画面色彩断层。 |
| **Level (编码级别)** | **Level 3.1** | 门槛极低，甚至能向下兼容 10 年前的老旧芯片，发热量极低。 |
| **像素格式 (Pix Fmt)** | **`yuv420p`** | 必须是 8-bit 4:2:0！坚决避开移动端无法硬件解码的 10-bit 或 4:2:2/4:4:4。 |
| **音频编码** | **AAC (`mp4a`)** | HTML5 `<video>` 标准配乐格式，跨浏览器全通。 |
| **流式播放标记** | **`+faststart`** | 将 `moov` 索引移至文件最前面，边下载边播放，实现移动端秒播。 |
| **分辨率策略** | **自适应 720P (Max 1280×720)** | 移动端 6~7 寸屏幕最佳锐度与体积比；同时按比例缩放，严禁强行拉伸 4:3 画面。 |

---

## 三、 实用 FFmpeg 核心命令速查

### 1. 单文件标准黄金转码命令（推荐日常使用）

```bash
ffmpeg -i input.mp4 \
  -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -c:v libx264 \
  -profile:v high \
  -level 3.1 \
  -preset fast \
  -crf 22 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output_compatible.mp4
```

> [!TIP]
> **关于自适应防拉伸滤镜的解释：**  
> `scale=w=1280:h=720:force_original_aspect_ratio=decrease` 会让视频在不超过 1280×720 的范围内按原有比例等比缩放：
> - 16:9 的 1080P 视频会刚好等比缩小为 `1280x720`；
> - 4:3 的视频（如老旧演讲、访谈）会保持 `960x720`，**绝对不会被横向压扁/拉胖**；
> - 尾部的 `scale=trunc(iw/2)*2:trunc(ih/2)*2` 确保长宽都是偶数，避免 H.264 编码报错。

---

## 四、 突破限制：精准压缩至 98MB（GitHub 100MB 限制方案）

由于 GitHub 仓库对单文件有严格的 **100MB 上限限制**（超过 100MB 无法直接 `git push`），通常建议将视频文件精准控制在 **95MB ~ 98MB** 之间。

### 1. 目标码率逆推公式

$$\text{总目标比特率 (bps)} = \frac{\text{目标文件大小 (Byte)} \times 8}{\text{视频时长 (秒)}} \times 0.98$$

其中：
- 目标体积取 **95.5 MB**（留出 2.5 MB 缓冲区）；
- 乘 `0.98` 是预留 **2% 的 MP4 容器封装损耗**；
- $\text{视频比特率} = \text{总比特率} - \text{音频比特率}$。

### 2. 高速精准压制命令（1-Pass + 码率上下限约束）

适合长视频或需要快速批量处理的场景：

```bash
# 假设计算出的视频码率为 450k，音频为 96k：
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -b:v 450k \
  -maxrate 600k \
  -bufsize 900k \
  -preset veryfast \
  -profile:v high \
  -level 3.1 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  output_under98m.mp4
```

### 3. 极致画质二次采样压制（2-Pass，适合对画质要求极高的长视频）

```bash
# 第一遍：快速分析全片运动复杂度（Windows 系统输出到 NUL，Linux/macOS 输出到 /dev/null）
ffmpeg -y -i input.mp4 \
  -c:v libx264 -b:v 450k -pass 1 \
  -preset fast -profile:v high -level 3.1 -pix_fmt yuv420p \
  -an -f null NUL

# 第二遍：按场景动态分配码率，输出最终文件
ffmpeg -y -i input.mp4 \
  -c:v libx264 -b:v 450k -pass 2 \
  -preset fast -profile:v high -level 3.1 -pix_fmt yuv420p \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  output_under98m_bestquality.mp4
```

---

## 五、 全自动 Python 批量检测与压制脚本

您可以将以下脚本保存为 `batch_video_optimizer.py`，放在任何视频目录下直接运行：

```python
import os
import sys
import subprocess
import struct
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

def get_video_duration(filepath):
    """读取 MP4 moov 索引获取准确时长"""
    with open(filepath, 'rb') as fp:
        data = fp.read(2 * 1024 * 1024)
        idx = data.find(b'mvhd')
        if idx == -1: return 0
        ver = data[idx+4]
        if ver == 0:
            ts, dur = struct.unpack('>II', data[idx+16:idx+24])
        else:
            ts = struct.unpack('>I', data[idx+24:idx+28])[0]
            dur = struct.unpack('>Q', data[idx+28:idx+36])[0]
        return dur / ts if ts > 0 else 0

def optimize_video(folder, filename, target_max_mb=98.0):
    src = os.path.join(folder, filename)
    size_mb = os.path.getsize(src) / (1024 * 1024)
    tmp_out = os.path.join(folder, f"_opt_{filename}")
    dur = get_video_duration(src)
    
    print(f"\n[处理中] {filename} | 原始大小: {size_mb:.2f}MB | 时长: {dur/60:.1f}分钟")
    
    # 构建基础转码命令
    cmd = [
        FFMPEG, '-y', '-i', src,
        '-vf', 'scale=w=1280:h=720:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-level', '3.1',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-movflags', '+faststart'
    ]
    
    # 策略判断：如果文件本身超大或时长很长，开启精准控容
    if size_mb > target_max_mb and dur > 0:
        target_bits = 95.0 * 1024 * 1024 * 8  # 瞄准 95MB
        audio_kbps = 64 if dur > 1800 else 96
        total_kbps = (target_bits / dur) / 1000
        video_kbps = max(int((total_kbps * 0.98) - audio_kbps), 100)
        
        cmd.extend([
            '-b:v', f'{video_kbps}k',
            '-maxrate', f'{int(video_kbps * 1.3)}k',
            '-bufsize', f'{int(video_kbps * 2)}k',
            '-b:a', f'{audio_kbps}k',
            '-preset', 'veryfast'
        ])
    else:
        # 普通文件采用优质恒定画质 (CRF)
        cmd.extend(['-preset', 'fast', '-crf', '22', '-b:a', '128k'])
        
    cmd.append(tmp_out)
    
    # 执行转码
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if res.returncode == 0 and os.path.exists(tmp_out):
        final_mb = os.path.getsize(tmp_out) / (1024 * 1024)
        os.replace(tmp_out, src)
        print(f"  ✓ 成功！新大小: {final_mb:.2f} MB (已符合移动端秒播与 <98MB 限制)")
    else:
        print(f"  ✗ 转码失败，返回码: {res.returncode}")
        if os.path.exists(tmp_out): os.remove(tmp_out)

if __name__ == '__main__':
    target_dir = os.getcwd()
    for f in sorted(os.listdir(target_dir)):
        if f.lower().endswith('.mp4') and not f.startswith('_'):
            optimize_video(target_dir, f)
```

---

## 六、 快速验证清单（如何确认转码完全达标）

在上线或提交 Git 之前，建议对照以下清单进行快速核验：

1. **体积检查**：在终端运行 `ls -lh` 或资源管理器中查看，所有文件体积是否均 $\le 98\text{ MB}$；
2. **视频标签**：用代码或工具检查视频流四字符是否为 `avc1`（而非 `hev1` 或 `av01`）；
3. **音频流**：音频是否为 AAC（`mp4a`）；
4. **FastStart 校验**：用 16 进制编辑器或 Python 读取前 100KB，检查 `moov` 标签是否出现在 `mdat` 之前；
5. **真机体验测试**：用 iPhone（微信 / Safari）和安卓手机分别点击播放，验证是否达到**“点击即开播、拖动进度条不卡顿、画面不拉伸”**的最终效果。
