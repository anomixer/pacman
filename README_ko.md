팩맨 (Pac-Man)
=======

원본 팩맨 아케이드 게임에 대한 역사적 헌사 및 정확한 재제작

[The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)에서 영감을 받음

### 이 포크에 대한 참고 사항

- pacman.js를 수정하여 게임 시작 메뉴에서 start-music.mp3를 한 번만 재생하도록 했습니다.
- 하이스코어 저장소를 localStorage(브라우저)에서 KV 저장소(클라우드 저장)로 변경하여 로컬 브라우저에서 삭제되지 않도록 했습니다.
- 이 프로젝트는 Cloudflare Pages에 KV 저장소를 활성화하여 배포되도록 수정되었습니다. ('pacman'이라는 KV 네임스페이스 추가 후 'HISCORES' 변수 설정)
- (옵션) 배포 시 빌드 명령어에 'sh build.sh'를 추가하여 새 pacman.js를 생성할 수 있습니다. 비워둘 수도 있습니다.
- 예약된 pacman.js.bak - 하이스코어를 브라우저의 localStorage에 저장합니다.
- [여기서 플레이하기](https://pacman-dbq.pages.dev/). 하이스코어를 깰 수 있을까요? ;)

### 개발 중인 기능

- 사운드 시스템
- 컷신
- 2인 플레이 전환

문의: shaunewilliams@gmail.com

라이선스
-------

이 프로그램은 **GNU 일반 공중 라이선스 버전 3**에 따라 자유롭게 배포 및 수정할 수 있습니다.
자유 소프트웨어 재단에서 발표했습니다.

플레이 방법
--------

모든 캔버스 지원 브라우저에서 플레이 가능합니다. 모바일 브라우저에서는 **터치 컨트롤**이 활성화되어 있습니다. 게임은 **해상도에 구애받지 않아** 어떤 화면 크기에도 부드럽게 조정됩니다. 브라우저 창을 축소하거나 확대하여 **성능**을 향상시킬 수 있습니다.

### 주요 컨트롤

- **밀기**: 모바일 브라우저에서 팩맨 조작
- **화살표 키**: 팩맨 이동 조작
- **End 키**: 게임 일시 정지
- **Esc 키**: 인게임 메뉴 열기

### 확인된 데스크톱 브라우저

- Safari
- Firefox
- Chrome

### 확인된 모바일 기기

- [iPad 및 iPhone (모바일 사파리)](http://www.atariage.com/forums/topic/202594-html5-pac-man/)
- Samsung Galaxy Tablet 7 (Firefox Beta)
- Nexus 7 (Chrome)

게임 모드
-----

다음 각 게임은 메인 메뉴에서 플레이 가능합니다.

![종합 화면][1]

- **팩맨**: 1980년 남코 원작 아케이드
- **Ms. 팩맨**: 1981년 GCC/Midway 개조 버전
- **크레이지 오또**: Midway에 판매되기 전 GCC 내부 미출시 버전 ([동영상 보기](http://www.youtube.com/watch?v=CEKAqWk-Tp4))
- **쿠키맨**: 정교한 **절차적 맵 생성기**를 갖춘 새로운 Ms. 팩맨 버전

### 터보 모드

각 게임에는 터보 모드(일명 스피디 모드)라는 대체 모드가 있습니다. 이는 원본 아케이드 기계에서 흔히 볼 수 있는 인기 있는 하드웨어 개조입니다. 이 모드에서 팩맨은 약 2배의 속도(유령 눈알과 동일한 속도)로 이동하며, 펠릿을 먹을 때 속도가 감소하지 않습니다.

### 하이스코어

각 게임의 하이스코어(일반 및 터보 모드 별도로)는 브라우저에 의해 로컬 머신에 저장됩니다.

학습 모드
----------

학습 모드를 통해 유령들의 행동을 시각적으로 확인할 수 있습니다. (색상 사각형은 유령 유인물입니다.)

![학습][2]

연습 모드
-------------

이 모드에서는 특수 기능을 활용하여 게임을 연습할 수 있습니다. 화면 버튼 또는 아래에 나열된 단축키로 **슬로우 모션** 또는 **시간 되감기**를 할 수 있습니다. (시간 조작 컨트롤 및 디자인은 [Braid](http://braid-game.com/) 게임에서 차용했습니다). 메뉴에서 **무적 모드** 또는 **유령 시각화**도 켤 수 있습니다.

![연습][3]

### 연습 모드 컨트롤

- **Shift**: 누르고 있으면 시간 되감기(Braid 방식)
- **1**: 누르고 있으면 게임 속도를 0.5배로 감속
- **2**: 누르고 있으면 게임 속도를 0.25배로 감속
- **O**: 팩맨 터보 모드 전환
- **P**: 팩맨 어트랙트 모드(자동 플레이) 전환
- **I**: 팩맨 무적 모드 전환
- **N**: 다음 레벨로 이동
- **Q,W,E,R,T**: 각각 blinky, pinky, inky, clyde, 팩맨의 타겟 그래픽 전환
- **A,S,D,F,G**: 각각 blinky, pinky, inky, clyde, 팩맨의 경로 그래픽 전환

절차적으로 생성된 맵
---------------------------

**쿠키맨** 게임 모드에서는 미로가 Ms. 팩맨과 같이 자주 변경되지만 **절차적으로 생성**됩니다. 각 레벨은 사전 정의된 색상 팔레트를 가지고 있어 랜덤 구조의 미로에 일관성을 부여합니다.

![절차적][4]

### 알고리즘 설명

미로는 팩맨 및 Ms. 팩맨에서 발견된 원본 맵에서 유추된 디자인 패턴과 일치하도록 신중하게 구축되었습니다.

정확도
--------

이 프로젝트의 목표는 원본 아케이드 게임에 합리적으로 정확하게 유지하는 것입니다. 현재의 정확도는 리버스 엔지니어 Jamey Pittman과 Bart Grantham의 작업 덕분입니다.

현재 좌표 공간, 이동 물리학, 유령 행동, 액터 속도, 타이머 및 업데이트 속도는 원본 아케이드 게임과 일치합니다.

### 부정확한 점

스코어 표시 일시 정지 및 맵 깜빡임 애니메이션과 같은 특정 비중요 이벤트의 **시간 조정**이 현재 근사값으로 적용되었습니다.

다음과 같은 복잡한 난수 생성기 문제로 인해 원본 팩맨의 **패턴을 사용할 수 없습니다**.

또한 **충돌 감지**는 원본보다 더 엄격하게(2배 빈도로 확인) 설정되어 터널 통과 "버그"를 방지합니다.

유감스럽게도 팩맨이 위를 향할 때 유령 타겟이 이동하는 **오버플로 버그**는 제외했습니다. ([자세한 내용](http://donhodges.com/pacman_pinky_explanation.htm)).

### 버그 보고/수정

방해되거나 단순히 성가신 부정확한 점이 있으면 보고해 주세요. 이 프로젝트에 전문 지식을 기부하고자 하는 리버스 엔지니어는 큰 도움이 될 것입니다!

저장소 탐색
-------------------------
- 모든 자바스크립트 소스 파일은 "src/" 디렉터리에 위치
- "build.sh" 파일이 최상위 디렉터리의 "pacman.js"에 모든 소스 파일을 연결
- "debug.htm"은 "src/*.js" 파일을 사용하여 게임 표시
- "index.htm"은 "pacman.js" 파일만 사용하여 게임 표시
- "fruit" 디렉터리는 Ms. 팩맨 과일 경로에 대한 메모와 다이어그램 포함
- "mapgen" 디렉터리는 프로시저럴 팩맨 미로 생성에 대한 메모, 다이어그램 및 실험 포함
- "sprites" 디렉터리는 참조 스프라이트 시트 및 확장 가능한 게임 스프라이트를 보는 "atlas.htm"을 포함
- "font" 디렉터리는 게임에서 사용하는 글꼴 리소스 포함

크레딧
-------

### 리버스 엔지니어

**Jamey Pittman**님께 감사드립니다. 자신의 연구와 Atari Age 포럼 스레드([링크](http://www.atariage.com/forums/topic/68707-pac-man-ghost-ai-question/))의 'Dav'와 'JamieVegas' 등의 다른 리버스 엔지니어들의 연구를 바탕으로 [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)를 컴파일했습니다. 또한 프로젝트의 정확성 요구사항을 충족하기 위해 아케이드 구현 관련 구체적인 질문에 매우 상세한 답변을 제공해 주셨습니다.

**Bart Grantham**님께 감사드립니다. Ms. 팩맨 내부에 대한 전문 지식을 공유해 주시고, 과일 경로가 어떻게 작동하는지 상세한 주석이 달린 디스어셈블리와 메모를 제공해 주셨습니다.

### 원본 게임

영속적인 게임을 만든 남코 팩맨 팀에게 감사드립니다. 또한 아케이드 에뮬레이터와 매우 유용한 디버거를 제공한 MAME 팀에게도 감사드립니다.

맵 생성기의 기반으로 사용한 미적 맵의 다양한 버전을 제공한 GCC의 Ms. 팩맨 팀에게 감사드립니다.

[Braid](http://braid-game.com)에서 되감기 메커니즘을 만들고 [이 강연](https://store.cmpgame.com/product/5900/The-Implementation-of-Rewind-in-braid)에서 구현 세부사항을 발표해 주신 Jonathan Blow에게 감사드립니다. 이는 프로젝트의 구현에서 큰 도움이 되었습니다.

### 아트

무작위 미로 모드에서 사용한 쿠키 몬스터 팩맨 디자인을 제공한 Tang Yongfa와 [threadless 웹사이트](http://www.threadless.com/product/2362/Cookies)에 감사드립니다.

공개 피드백 링크
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
