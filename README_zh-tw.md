Pac-Man
=======

經典小精靈街機遊戲的歷史致敬與精準重製版

靈感來自 [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)

### 此分支的注意事項

- 修改 pacman.js，使遊戲開始選單只播放 start-music.mp3 一次
- 將高分榜從 localStorage（瀏覽器）改為 KV 儲存（雲端儲存），避免本地瀏覽器清除資料
- 此專案已修改為支援 Cloudflare Pages 部署（需啟用 KV 儲存，新增 'pacman' 命名空間及 'HISCORES' 變數）
- （選用）部署時可在建置指令加入 'sh build.sh' 產生新 pacman.js，或留空
- 保留 pacman.js.bak - 將高分榜儲存至瀏覽器 localStorage
- [立即試玩](https://pacman-dbq.pages.dev/)。你能打破最高分嗎？ ;)

### 進行中項目

- 音效
- 過場動畫
- 雙人輪替模式

聯絡信箱：shaunewilliams@gmail.com

授權條款
-------

本程式依據**GNU 通用公共授權版本 3**（GNU General Public License Version 3）
由自由軟體基金會發布，您可自由散佈及修改。

遊戲說明
--------

支援所有支援 canvas 的瀏覽器。**觸控操作**已在行動瀏覽器啟用。遊戲具備**解析度無關性**，能自動適應任何螢幕尺寸。縮小視窗或使用瀏覽器縮放功能可**提升效能**。

### 主要操作

- **滑動**：在行動瀏覽器控制小精靈
- **方向鍵**：控制小精靈移動
- **End 鍵**：暫停遊戲
- **Esc 鍵**：開啟遊戲內選單

### 確認支援的桌面瀏覽器

- Safari
- Firefox
- Chrome

### 確認支援的行動裝置

- [iPad 和 iPhone（Mobile Safari）](http://www.atariage.com/forums/topic/202594-html5-pac-man/)
- Samsung Galaxy Tablet 7 (Firefox Beta)
- Nexus 7 (Chrome)

遊戲模式
-----

所有遊戲皆可從主選單遊玩。

![綜合畫面][1]

- **小精靈 (Pac-Man)**：1980 年南夢宮原始街機版
- **Ms. 小精靈 (Ms. Pac-Man)**：1981 年 GCC/Midway 修改版
- **瘋狂奧托 (Crazy Otto)**：Midway 買下前 GCC 內部未發布版本 ([觀看影片](http://www.youtube.com/watch?v=CEKAqWk-Tp4))
- **餅乾人 (Cookie-Man)**：配備先進**程序化地圖生成器**的全新 Ms. 小精靈 版本

### 加速模式

每種遊戲皆有「加速模式」（又稱速攻模式），此為原始街機機台常見的硬體修改。此模式下，小精靈移動速度約為兩倍（與鬼魂眼球同速），且吃豆子時不會減速。

### 高分榜

各遊戲（標準與加速模式分開計算）的高分將儲存在您的本機瀏覽器中。

學習模式
----------

學習模式可視覺化展示鬼魂行為。（彩色方塊代表鬼魂誘餌。）

![學習][2]

練習模式
-------------

此模式提供特殊功能供玩家練習。可透過螢幕按鈕或下方熱鍵進行**慢動作**或**回溯時間**（時間操控設計靈感來自遊戲 [Braid](http://braid-game.com/)）。亦可透過選單啟用**無敵模式**或**鬼魂軌跡顯示**。

![練習][3]

### 練習模式操作

- **Shift**：長按回溯時間（類 Braid）
- **1**：長按將遊戲速度降至 0.5 倍
- **2**：長按將遊戲速度降至 0.25 倍
- **O**：切換小精靈加速模式
- **P**：切換小精靈自動遊玩模式
- **I**：切換小精靈無敵模式
- **N**：跳至下一關卡
- **Q,W,E,R,T**：分別切換 Blinky, Pinky, Inky, Clyde, 小精靈的目標圖示
- **A,S,D,F,G**：分別切換 Blinky, Pinky, Inky, Clyde, 小精靈的移動路徑

程序生成地圖
---------------------------

**餅乾人**模式中，迷宮變化頻率與 Ms. 小精靈 相同，但採用**程序生成**。每關卡預設顏色調色盤，使隨機迷宮結構保持一致性。

![程序生成][4]

### 演算法說明

迷宮結構設計謹慎貼合原始 Pac-Man 與 Ms. 小精靈 地圖推導出的設計模式。

精準度
--------

本專案力求貼近原始街機遊戲。目前精準度歸功於反向工程師 Jamey Pittman 與 Bart Grantham 的研究。

當前實現已精確匹配原始街機的座標空間、移動物理、鬼魂行為、角色速度、計時器與更新速率。

### 未臻完美處

某些非關鍵事件（如得分暫停與迷宮閃爍動畫）的**時序**目前僅為近似值。

遺憾的是，由於隨機數生成器的複雜性，**無法沿用原始小精靈模式**。

此外，**碰撞檢測**比原始版本更嚴密（檢查頻率加倍），用以防止穿牆「漏洞」。

我特意省略了**溢位漏洞**（當小精靈朝上時會偏移鬼魂目標，詳情[請參考](http://donhodges.com/pacman_pinky_explanation.htm)）。

### 通報/修正漏洞

若您發現影響遊戲體驗或單純不合理的不準確之處，歡迎通報。若您是熟悉反向工程的開發者，願意貢獻專業知識，將對本專案大有幫助！

專案結構導覽
-------------------------
- 所有 JavaScript 原始碼位於 "src/" 目錄
- "build.sh" 將所有原始檔合併至根目錄的 "pacman.js"
- "debug.htm" 使用 "src/*.js" 檔案顯示遊戲
- "index.htm" 僅使用 "pacman.js" 檔案顯示遊戲
- "fruit" 目錄包含 Ms. 小精靈 果實路徑的筆記與圖表
- "mapgen" 目錄包含程序化迷宮生成的筆記、圖表與實驗
- "sprites" 目錄包含參考精靈圖與可擴展遊戲精靈檢視器 "atlas.htm"
- "font" 目錄包含遊戲使用的字型資源

致謝
-------

### 反向工程貢獻者

感謝 **Jamey Pittman** 編寫 [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)，整合自身研究與 'Dav' 和 'JamieVegas' 的成果（[Atari Age 論壇](http://www.atariage.com/forums/topic/68707-pac-man-ghost-ai-question/)）。亦感謝他為本專案精準度要求提供詳盡的街機實現細節。

感謝 **Bart Grantham** 分享 Ms. Pac-Man 內部運作專業知識，提供詳細註解的反組譯碼與果實路徑運作說明。

### 原始遊戲團隊

感謝 Namco 原始小精靈團隊創造如此歷久不衰的遊戲。感謝 MAME 團隊提供街機模擬器與實用除錯工具。

感謝 GCC Ms. Pac-Man 團隊創造多樣化美術地圖，成為本專案地圖生成器基礎。

感謝 Jonathan Blow 創造 [Braid](http://braid-game.com) 中的回溯機制，啟發本專案相同功能。亦感謝他在[演講](https://store.cmpgame.com/product/5900/The-Implementation-of-Rewind-in-braid)中詳述實作細節，助益本專案開發。

### 美術設計

感謝 Tang Yongfa 與其在[threadless 網站](http://www.threadless.com/product/2362/Cookies)的餅乾怪獸小精靈設計，本專案隨機迷宮模式採用此角色。

公開反饋連結
------------------------

- http://www.reddit.com/r/programming/comments/z0tuv/historical_tribute_and_accurate_remake_of_the/
- http://www.reddit.com/r/javascript/comments/z7bc0/very_polished_javascript_remake_of_pac_man/
- http://www.reddit.com/r/webdev/comments/z85lj/quite_accurate_remake_of_pacman_in_js/
- http://news.ycombinator.com/item?id=4448539
- http://news.ycombinator.com/item?id=4464006
- http://www.lockergnome.com/news/2012/09/02/play-pac-man-online-for-free-no-download/
- http://www.atariage.com/forums/topic/202594-html5-pac-man/
- http://boards.straightdope.com/sdmb/showthread.php?t=664081
- http://www.classicarcadegaming.com/forums/index.php?topic=4563.0
- http://news.dice.com/2012/09/04/pac-man-online-open-source/



[1]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/montage2.png
[2]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/learn.png
[3]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/practice.png
[4]: https://bitbucket.org/shaunew/pac-man/raw/4714800233a9/shots/procedural.png
