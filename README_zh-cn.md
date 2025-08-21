吃豆人 (Pac-Man)
=======

对原版吃豆人街机游戏的历史致敬与精准重制

灵感源自 [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)

### 关于此分支的注意事项

- 修改 pacman.js，使游戏开始菜单仅播放 start-music.mp3 一次
- 将高分榜从 localStorage（浏览器）改为 KV 存储（云端存储），避免本地浏览器清除数据
- 本项目已适配 Cloudflare Pages 部署（需启用 KV 存储，添加 'pacman' 命名空间和 'HISCORES' 变量）
- （可选）部署时可在构建命令添加 'sh build.sh' 生成新 pacman.js，或留空
- 保留 pacman.js.bak - 高分榜数据存储至浏览器 localStorage
- [立即试玩](https://pacman-dbq.pages.dev/)。你能打破最高分吗？ ;)

### 开发中功能

- 音效系统
- 过场动画
- 双人轮替模式

联系方式：shaunewilliams@gmail.com

开源许可
-------

本程序遵循**GNU 通用公共许可证第3版**发布，
您可自由分发及修改，由自由软件基金会管理。

游戏说明
--------

支持所有 Canvas 兼容浏览器。**触控操作**已在移动浏览器启用。游戏具有**分辨率自适应**特性，可完美适配任何屏幕尺寸。**性能优化**建议：缩小窗口或使用浏览器缩放功能。

### 主要操作

- **滑动**：在移动浏览器控制吃豆人
- **方向键**：控制吃豆人移动
- **End键**：暂停游戏
- **Esc键**：打开游戏内菜单

### 已验证桌面浏览器

- Safari
- Firefox
- Chrome

### 已验证移动设备

- [iPad 和 iPhone（Mobile Safari）](http://www.atariage.com/forums/topic/202594-html5-pac-man/)
- Samsung Galaxy Tablet 7 (Firefox Beta)
- Nexus 7 (Chrome)

游戏模式
-----

所有游戏均可从主菜单进入。

![综合界面][1]

- **经典吃豆人**：1980年南梦宫原版街机
- **Ms. 吃豆人**：1981年 GCC/Midway 修改版
- **疯狂奥托**：Midway 收购前 GCC 内部未发布版本 ([观看视频](http://www.youtube.com/watch?v=CEKAqWk-Tp4))
- **饼干人**：全新版本，配备先进的**程序化地图生成系统**

### 极速模式

每种游戏均含「极速模式」（又称竞速模式），源自街机厅常见硬件改装。此模式下，吃豆人移动速度提升至约2倍（与鬼魂眼球同速），且吃豆时不会减速。

### 高分榜

各游戏（标准与极速模式独立计算）的高分将保存在您的设备浏览器中。

学习模式
----------

学习模式可可视化展示鬼魂行为规律。（彩色方块代表鬼魂目标点。）

![学习模式][2]

练习模式
-------------

本模式提供特殊训练功能。通过屏幕按钮或以下快捷键可实现**慢动作**或**时间回溯**（机制灵感来自游戏 [Braid](http://braid-game.com/)）。菜单中还可启用**无敌模式**或**鬼魂路径可视化**。

![练习模式][3]

### 练习模式操作

- **Shift**：长按回溯时间（Braid 风格）
- **1**：长按降至 0.5 倍速
- **2**：长按降至 0.25 倍速
- **O**：切换吃豆人加速模式
- **P**：切换自动游玩模式
- **I**：切换无敌模式
- **N**：跳至下一关卡
- **Q,W,E,R,T**：分别切换 Blinky, Pinky, Inky, Clyde, 吃豆人的目标标记
- **A,S,D,F,G**：分别切换 Blinky, Pinky, Inky, Clyde, 吃豆人的移动路径

程序化生成地图
---------------------------

**饼干人**模式中，迷宫变化频率与 Ms. 吃豆人 相同，但采用**程序生成算法**。每关卡预设专属配色方案，使随机迷宫保持结构一致性。

![程序生成][4]

### 算法说明

迷宫设计严格遵循原始吃豆人与 Ms. 吃豆人 地图推导出的设计规范。

精准度保障
--------

本项目致力于高度还原原始街机体验。当前精准度得益于反向工程师 Jamey Pittman 与 Bart Grantham 的研究成果。

现已精确复现原始街机的坐标系统、移动物理、鬼魂行为、角色速度、计时器与帧更新速率。

### 现存差异

- 评分显示暂停、地图闪烁等非关键事件的**时序**为近似值
- 因随机数生成器差异，**无法复用原始吃豆人通关模式**
- **碰撞检测**更严格（检测频率加倍），避免穿墙漏洞
- 已移除**溢出漏洞**（当吃豆人朝上时鬼魂目标偏移问题，详见[技术说明](http://donhodges.com/pacman_pinky_explanation.htm)）

### 提交问题

如发现影响体验的不准确之处，欢迎提交反馈。若您具备反向工程经验，欢迎为本项目贡献力量！

项目结构说明
-------------------------
- 所有 JavaScript 源码位于 "src/" 目录
- "build.sh" 将源码合并至根目录 "pacman.js"
- "debug.htm" 直接引用 "src/*.js" 进行调试
- "index.htm" 仅使用 "pacman.js" 运行游戏
- "fruit" 目录含 Ms. 吃豆人 果实路径研究资料
- "mapgen" 目录含程序化迷宫生成算法文档
- "sprites" 目录含游戏素材及图集查看器 "atlas.htm"
- "font" 目录含游戏字体资源

鸣谢
-------

### 技术贡献
- **Jamey Pittman** 编著 [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)，整合 Atari Age 论坛 ('Dav', 'JamieVegas') 的逆向工程成果
- **Bart Grantham** 提供 Ms. Pac-Man 内核分析与果实路径深度解析

### 原始团队
- Namco 创造经典吃豆人游戏
- MAME 团队提供街机模拟器与调试工具
- GCC 开发 Ms. Pac-Man 创新关卡设计
- Jonathan Blow 通过 [Braid](http://braid-game.com) 启发时间操控机制（[实现细节](https://store.cmpgame.com/product/5900/The-Implementation-of-Rewind-in-braid)）

### 美术资源
- 采用 [Tang Yongfa](http://www.threadless.com/product/2362/Cookies) 的饼干怪兽吃豆人设计用于随机地图模式

社区反馈
------------------------

- http://www.reddit.com/r/programming/comments/z0tuv/historical_tribute_and_accurate_remake_of_the/
- http://www.reddit.com/r/javascript/comments/z7bc0/very_polished_javascript_remake_of_pac_man/
- http://news.ycombinator.com/item?id=4448539
- http://www.atariage.com/forums/topic/202594-html5-pac-man/
- http://news.dice.com/2012/09/04/pac-man-online-open-source/



[1]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/montage2.png
[2]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/learn.png
[3]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/practice.png
[4]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/procedural.png
