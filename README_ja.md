Pac-Man
=======

オリジナルのパックマンアーケードゲームへの歴史的なトリビュートと正確なリメイク

[The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html) からインスパイアされました

### フォークに関する注意点

- pacman.jsを変更し、ゲームスタートメニューでstart-music.mp3を1回のみ再生するようにしました。
- ハイスコアをlocalStorage（ブラウザ）からKVストレージ（クラウドセーブ）に変更し、ローカルブラウザでクリアされないようにしました。
- このプロジェクトはKVストレージを有効にしたCloudflare Pagesへのデプロイ向けに変更されています。（'pacman'というKVネームスペースを追加し、'HISCORES'変数を設定してください。）
- （オプション）デプロイ時、ビルドコマンドに'sh build.sh'を追加して新しいpacman.jsを作成できます。空白のままにすることも可能です。
- 予約済みのpacman.js.bak - ハイスコアをブラウザのlocalStorageに保存します。
- [ここからプレイ](https://pacman-dbq.pages.dev/). ハイスコアを更新できますか？ ;)

### 開発中

- サウンド
- カットシーン
- 2人同時プレイ

連絡先: shaunewilliams@gmail.com

ライセンス
-------

このプログラムは**GNU General Public License Version 3**の下で自由に配布・改変できます。
フリーソフトウェア財団によって公開されています。

プレイ方法
--------

すべてのcanvas対応ブラウザでプレイ可能です。モバイルブラウザでは**タッチコントロール**が有効です。ゲームは**解像度に依存せず**、どの画面サイズにも自動調整されます。**パフォーマンス**はウィンドウを縮小するか、ブラウザのズーム機能で向上する場合があります。

### メインコントロール

- **スワイプ**: モバイルブラウザでパックマンを操作
- **矢印キー**: パックマンを操作
- **Endキー**: ゲームを一時停止
- **Escapeキー**: ゲーム内メニューを開く

### 確認済みデスクトップブラウザ

- Safari
- Firefox
- Chrome

### 確認済みモバイルデバイス

- [iPadおよびiPhone（モバイルSafari）](http://www.atariage.com/forums/topic/202594-html5-pac-man/)
- Samsung Galaxy Tablet 7 (Firefox Beta)
- Nexus 7 (Chrome)

ゲームモード
-----

各ゲームはメインメニューからプレイ可能です。

![Montage][1]

- **Pac-Man**: 1980年ナムコによるオリジナルアーケード
- **Ms. Pac-Man**: 1981年GCC/Midwayによるパックマン改変版
- **Crazy Otto**: Midwayに販売される前のGCC非公開バージョン ([動画を見る](http://www.youtube.com/watch?v=CEKAqWk-Tp4))
- **Cookie-Man**: 洗練された**プログラム生成マップ**を備えた新バージョン

### トゥルーモード

各ゲームには代替モード「トゥルーモード」（スピードモードとしても知られる）があります。これはオリジナルアーケード筐体で人気のあるハードウェア改変です。このモードでは、パックマンの速度は約2倍（ゴーストの目と同じ速度）になり、パワーペレット摂取時の減速がなくなります。

### ハイスコア

各ゲーム（ノーマルとトゥルーを別々に）のハイスコアは、お使いのブラウザによってローカルマシンに保存されます。

ラーニングモード
----------

ラーニングモードを使用すると、ゴーストの挙動を視覚的に確認できます。（色付きの四角はゴーストの目印です。）

![Learn][2]

プラクティスマード
-------------

このモードでは、特別な機能を備えた練習が可能です。画面上のボタンまたは以下のホットキーを使用して**スローモーション**または**タイムリバース**ができます。（タイムマニュピレーションのコントロールとデザインはゲーム[Braid](http://braid-game.com/)から借用しています。）メニューから**無敵モード**または**ゴーストビジュアライザー**を有効にすることもできます。

![Practice][3]

### プラクティスコントロール

- **Shift**: 押し続けるとタイムリバース（Braid風）
- **1**: 押し続けるとゲーム速度を0.5倍に
- **2**: 押し続けるとゲーム速度を0.25倍に
- **O**: パックマンのターボモード切り替え
- **P**: パックマンのアトラクトモード（自動プレイ）切り替え
- **I**: パックマンの無敵モード切り替え
- **N**: 次のレベルへ移動
- **Q,W,E,R,T**: blinky, pinky, inky, clyde, pacmanのターゲットグラフィックをそれぞれ切り替え
- **A,S,D,F,G**: blinky, pinky, inky, clyde, pacmanのパスグラフィックをそれぞれ切り替え

プログラム生成マップ
---------------------------

**Cookie-Man**ゲームモードでは、マップはMs.パックマンと同様に頻繁に変化しますが、**プログラム生成**されています。各レベルには事前に定義されたカラーパレットがあり、マップのランダム構造に一貫性をもたらします。

![Procedural][4]

### アルゴリズム説明

マップは、パックマンおよびMs.パックマンのオリジナルマップから推測されたデザインパターンに closely matchするよう慎重に構築されています。

正確性
--------

このプロジェクトの目標は、オリジナルアーケードゲームに合理的に正確であることです。現在の正確性は、リバースエンジニアJamey PittmanおよびBart Granthamの作業によるものです。

現在、座標空間、移動物理、ゴーストの挙動、アクターの速度、タイマー、更新レートはオリジナルアーケードゲームと一致しています。

### 不正確な点

スコア表示の一時停止やマップ点滅アニメーションなど、特定の非重要イベントの**タイミング**は現在近似値を使用しています。

残念ながら、ランダム数生成器の複雑さにより、オリジナルパックマンの**パターンを使用することはできません**。

また、**衝突検出**はオリジナルよりも厳密（2倍頻繁にチェック）で、すり抜けバグを防ぎます。

私は**オーバーフローバグ**（パックマンが上を向いているときにゴーストターゲットがシフトするバグ）を省略しました（詳細[こちら](http://donhodges.com/pacman_pinky_explanation.htm)）。

### バグの報告/修正

不正確な点や単なる annoyance がある場合は、ご報告ください。このプロジェクトに専門知識を貢献していただけるリバースエンジニアの方は大歓迎です！

リポジトリのナビゲーション
-------------------------
- すべてのJavaScriptソースファイルは "src/" ディレクトリにあります
- "build.sh" ファイルはすべてのソースを "pacman.js" に結合します
- "debug.htm" は "src/*.js" ファイルを使ってゲームを表示します
- "index.htm" は "pacman.js" ファイルのみを使用してゲームを表示します
- "fruit" ディレクトリにはMs.パックマンのフルーツ経路に関するノートと図があります
- "mapgen" ディレクトリにはプロシージャルパックマンマップ生成に関するノート、図、実験があります
- "sprites" ディレクトリにはスプライトシートのリファレンスと "atlas.htm" アトラスビューアが含まれます
- "font" ディレクトリにはゲームで使用されるフォントリソースがあります

クレジット
-------

### リバースエンジニア

**Jamey Pittman** に感謝します。[The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html) を執筆し、自身の研究と 'Dav' および 'JamieVegas' の知識（[Atari Ageフォーラムスレッド](http://www.atariage.com/forums/topic/68707-pac-man-ghost-ai-question/)）をまとめました。さらに、このプロジェクトの正確性要件を満たすために、アーケード実装固有の質問に非常に詳細に回答してくれました。

**Bart Grantham** に感謝します。Ms.パックマンの内部に関する専門知識を共有し、フルーツ経路の動作について詳細な解説付きの逆アセンブルと注釈を提供してくれました。

### オリジナルゲーム

持続的なゲームを作成したナムコのオリジナルパックマンチームに感謝します。また、アーケードエミュレータと非常に役立つデバッガを提供したMAMEチームにも感謝します。

マップジェネレータの基盤となった多様な美的マップを提供したGCCのMs.パックマンチームに感謝します。

[Braid](http://braid-game.com) でリワインドメカニズムを作成したJonathan Blowに感謝します。このプロジェクトのインスピレーション源となりました。さらに、[このトーク](https://store.cmpgame.com/product/5900/The-Implementation-of-Rewind-in-braid) で実装の詳細を公開してくれたことで、私の実装に大いに役立ちました。

### アート

ランダムマップモードで使用したCookie Monster Pac-Manデザインを提供したTang Yongfaと[threadlessウェブサイト](http://www.threadless.com/product/2362/Cookies)に感謝します。

パブリックフィードバックへのリンク
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
