window.COURSE_META = {
  "day": 2,
  "phase": "DEVELOP",
  "documentTitle": "조선대학교 AWS 클라우드 웹서비스 구축 · DAY 2",
  "eyebrow": "UBUNTU · NGINX · KIRO",
  "heading": "Ubuntu 웹 서버를 준비하고,",
  "headingAccent": "Kiro 프로젝트를 배포합니다.",
  "description": "Ubuntu Server 26.04 LTS에 Nginx와 rsync를 설치하고 Kiro로 정적 웹 프로젝트를 만든 뒤 SCP와 rsync를 사용하여 EC2에 배포하고 재배포합니다.",
  "sideCopy": "Ubuntu·Nginx 구축부터 Kiro 프로젝트 배포까지 진행합니다.",
  "statA": "Nginx",
  "statACopy": "웹 서버 구축",
  "statB": "Kiro",
  "statBCopy": "개발·배포·재배포",
  "outcomes": [
    [
      "웹 서버 구축",
      "apt로 Nginx와 rsync를 설치하고 systemd로 관리합니다."
    ],
    [
      "프로젝트 개발",
      "Kiro로 배포 가능한 정적 웹 프로젝트를 만듭니다."
    ],
    [
      "파일 전송",
      "SSH와 SCP의 차이를 이해하고 프로젝트를 EC2로 전송합니다."
    ],
    [
      "서비스 배포",
      "/var/www/html에 반영하고 외부 접속과 재배포를 검증합니다."
    ]
  ]
};

window.COURSE = [
  {
    "day": 2,
    "id": "d2l1",
    "period": "1교시",
    "title": "Ubuntu와 Nginx 웹 서버 구축",
    "subtitle": "EC2에 Nginx를 설치하고 서비스 상태, 포트와 웹 문서 경로를 확인합니다.",
    "plan": [
      "웹 서버 구조 8분",
      "서비스 관리 10분",
      "Nginx 설치 15분",
      "기본 화면 변경 12분",
      "검증 5분"
    ],
    "slides": [
      {
        "title": "웹 서버는 HTTP 요청에 파일과 상태 코드로 응답합니다",
        "lead": "브라우저가 80번 포트로 요청하면 Nginx가 문서 경로에서 파일을 찾아 응답합니다.",
        "body": "<div class=\"visual-stage request-route\"><div class=\"diagram-node\"><span data-icon=\"browser\"></span><b>브라우저</b><small>GET /</small></div><span class=\"route-line\">TCP 80</span><div class=\"diagram-node\"><span data-icon=\"shield\"></span><b>보안 그룹</b><small>요청 허용</small></div><span class=\"route-line\">전달</span><div class=\"diagram-node selected\"><span data-icon=\"nginx\"></span><b>Nginx</b><small>요청 경로 해석</small></div><span class=\"route-line return\">200 OK</span><div class=\"diagram-node\"><span data-icon=\"file\"></span><b>index.html</b><small>콘텐츠 응답</small></div></div><div class=\"callout\"><b>EC2와 Nginx의 차이</b><br>EC2는 서버 자원이고 Nginx는 그 서버에서 실행되는 웹 서버 프로그램입니다.</div>"
      },
      {
        "title": "apt로 설치하고 systemd로 서비스를 관리합니다",
        "lead": "설치, 현재 실행, 부팅 시 자동 시작과 상태 확인은 서로 다른 작업입니다.",
        "body": "<pre><code>sudo apt update\nsudo apt upgrade -y\nsudo apt install -y nginx rsync\nsudo systemctl enable --now nginx\nsystemctl status nginx --no-pager\nsystemctl is-enabled nginx\nsystemctl is-active nginx</code><button class=\"copy\">복사</button></pre><div class=\"table\"><table><thead><tr><th>명령</th><th>의미</th></tr></thead><tbody><tr><td>apt install</td><td>패키지와 의존성을 설치합니다.</td></tr><tr><td>start</td><td>현재 서비스 실행을 시작합니다.</td></tr><tr><td>enable</td><td>다음 부팅 시 자동 시작을 등록합니다.</td></tr><tr><td>enable --now</td><td>자동 시작 등록과 현재 시작을 함께 수행합니다.</td></tr></tbody></table></div>"
      },
      {
        "title": "localhost와 공개 IP는 서로 다른 구간을 검증합니다",
        "lead": "서버 내부 테스트가 성공해도 외부 네트워크가 막혀 있으면 브라우저에서는 접속할 수 없습니다.",
        "body": "<div class=\"compare\"><article><h3>서버 내부 확인</h3><pre><code>curl -I http://localhost\nsudo ss -lntp | grep ':80'</code><button class=\"copy\">복사</button></pre><p>Nginx 프로세스와 80번 포트 수신 상태를 확인합니다.</p></article><mark>→</mark><article><h3>외부 브라우저 확인</h3><pre><code>http://PUBLIC_IP</code><button class=\"copy\">복사</button></pre><p>라우팅, 공개 IP, 보안 그룹과 Nginx를 함께 검증합니다.</p></article></div><div class=\"callout warn\"><b>현재는 HTTP로 접속합니다.</b><br>TLS 인증서를 구성하지 않았으므로 주소창에 http://와 공개 IPv4를 입력합니다.</div>"
      },
      {
        "title": "Nginx 기본 문서 경로에서 첫 화면을 제공합니다",
        "lead": "기본 파일을 백업하고 간단한 index.html로 변경하여 실제 서비스 경로를 확인합니다.",
        "body": "<pre><code>ls -al /var/www/html\nsudo cp /var/www/html/index.nginx-debian.html /var/www/html/index.nginx-debian.html.bak\necho '<h1>EC2 Web Server Ready</h1>' | sudo tee /var/www/html/index.html\ncurl http://localhost</code><button class=\"copy\">복사</button></pre><div class=\"callout\"><b>기본 문서 경로</b><br>이번 과정에서는 /var/www/html을 정적 웹 프로젝트의 배포 위치로 사용합니다.</div>"
      },
      {
        "title": "실습: Nginx를 설치하고 외부 접속을 확인합니다",
        "lead": "명령 결과와 브라우저 화면을 함께 확인하여 서버 내부와 외부 경로를 구분합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>EC2 접속</h3><p>Instance Connect 또는 SSH로 lab-web-ec2에 접속합니다.</p><span class=\"result\">ubuntu 셸</span></div><div class=\"step\"><h3>패키지 업데이트</h3><p>sudo apt update 후 sudo apt upgrade -y를 실행합니다.</p><span class=\"result\">오류 없이 완료</span></div><div class=\"step\"><h3>Nginx 설치</h3><p>sudo apt install -y nginx rsync를 실행합니다.</p><span class=\"result\">nginx -v 출력</span></div><div class=\"step\"><h3>서비스 활성화</h3><p>sudo systemctl enable --now nginx를 실행합니다.</p><span class=\"result\">active·enabled</span></div><div class=\"step\"><h3>내부 테스트</h3><p>curl -I http://localhost를 실행합니다.</p><span class=\"result\">200 OK</span></div><div class=\"step\"><h3>외부 테스트</h3><p>브라우저에서 http://공개IP로 접속합니다.</p><span class=\"result\">Nginx 화면</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "접속 실패와 웹 서버 준비 상태를 확인합니다",
        "lead": "여러 설정을 동시에 바꾸지 않고 서버 내부에서 외부 방향으로 확인합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>증상</th><th>먼저 확인</th><th>가능한 원인</th></tr></thead><tbody><tr><td>localhost도 실패</td><td>systemctl status nginx</td><td>미설치·중지·설정 오류</td></tr><tr><td>localhost 성공, 외부 실패</td><td>SG·라우팅·공개 IP</td><td>80번 차단 또는 경로 누락</td></tr><tr><td>403</td><td>파일 권한·error.log</td><td>읽기 권한 또는 설정</td></tr><tr><td>404</td><td>URL과 파일 경로</td><td>파일명·대소문자 불일치</td></tr></tbody></table></div><div class=\"check\"><label><input type=\"checkbox\">Nginx가 active와 enabled 상태입니다.</label><label><input type=\"checkbox\">80번 포트가 LISTEN 상태입니다.</label><label><input type=\"checkbox\">localhost 결과가 200입니다.</label><label><input type=\"checkbox\">공개 IP에서 Nginx 화면을 확인했습니다.</label></div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 2,
    "id": "d2l2",
    "period": "2교시",
    "title": "Kiro로 웹페이지 개발",
    "subtitle": "요구사항을 구조화하고 AI가 생성한 코드를 검토하여 배포 가능한 정적 프로젝트를 완성합니다.",
    "plan": [
      "AI 개발 흐름 8분",
      "요구사항 작성 12분",
      "Kiro 생성 15분",
      "코드 검토 10분",
      "로컬 검증 5분"
    ],
    "slides": [
      {
        "title": "Kiro는 요구사항부터 코드와 검증까지 연결합니다",
        "lead": "결과를 그대로 사용하는 것이 아니라 요구사항, 생성, 실행, 검토와 수정의 반복 과정으로 사용합니다.",
        "body": "<div class=\"visual-stage request-route\"><div class=\"diagram-node\"><span data-icon=\"file\"></span><b>요구사항</b><small>목적·구조·완료 기준</small></div><span class=\"route-line\">전달</span><div class=\"diagram-node selected\"><span data-icon=\"code\"></span><b>Kiro</b><small>파일 생성과 수정</small></div><span class=\"route-line\">실행</span><div class=\"diagram-node\"><span data-icon=\"terminal\"></span><b>로컬 테스트</b><small>브라우저·개발자 도구</small></div><span class=\"route-line return\">피드백</span><div class=\"diagram-node\"><span data-icon=\"check\"></span><b>검토·수정</b><small>요구사항과 결과 비교</small></div></div>"
      },
      {
        "title": "좋은 요구사항은 확인 가능한 완료 기준을 포함합니다",
        "lead": "화려하게 만들어 달라는 표현보다 대상, 콘텐츠, 구조, 동작과 금지 조건을 구체적으로 작성합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>항목</th><th>작성 내용</th><th>예시</th></tr></thead><tbody><tr><td>목적</td><td>사이트가 해결할 문제</td><td>전공 프로젝트 포트폴리오</td></tr><tr><td>대상</td><td>주요 방문자</td><td>교수·기업 담당자·학생</td></tr><tr><td>구조</td><td>필수 섹션과 순서</td><td>소개·기술·프로젝트·연락</td></tr><tr><td>표현</td><td>색상과 화면 밀도</td><td>남색·주황 포인트·충분한 여백</td></tr><tr><td>완료 기준</td><td>검증할 결과</td><td>360px에서 가로 스크롤 없음</td></tr></tbody></table></div>"
      },
      {
        "title": "Nginx에서 바로 제공할 정적 구조를 지정합니다",
        "lead": "외부 빌드 도구 없이 실행하고 시작 문서인 index.html을 프로젝트 루트에 둡니다.",
        "body": "<pre><code>cloud-portfolio/\n├─ index.html\n├─ css/style.css\n├─ js/app.js\n└─ images/profile.webp</code><button class=\"copy\">복사</button></pre><div class=\"grid3\"><article class=\"card\"><b class=\"metric\">HTML</b><h3>문서 구조</h3><p>제목, 본문, 이미지, 링크와 의미 있는 구역을 정의합니다.</p></article><article class=\"card\"><b class=\"metric\">CSS</b><h3>화면 표현</h3><p>배치, 색, 크기, 여백과 반응형 규칙을 정의합니다.</p></article><article class=\"card\"><b class=\"metric\">JS</b><h3>사용자 동작</h3><p>메뉴와 필요한 최소한의 상호작용을 처리합니다.</p></article></div>"
      },
      {
        "title": "Kiro에 기술 조건과 금지 사항을 함께 전달합니다",
        "lead": "배포 환경과 검토 기준을 명확히 하면 불필요한 라이브러리와 오류를 줄일 수 있습니다.",
        "body": "<pre><code>정적 포트폴리오 웹사이트를 만들어 주세요.\n대상: IT 관련 전공 3·4학년의 프로젝트 방문자\n필수 섹션: 소개, 보유 기술, 프로젝트 3개, 연락 방법\n파일: index.html, css/style.css, js/app.js, images/\n조건:\n- 빌드 도구 없이 Nginx에서 바로 제공\n- 모바일 360px부터 반응형\n- 의미 없는 애니메이션과 과도한 강조 색 금지\n- 모든 이미지에 alt 제공\n- 개인정보와 API 키 금지\n완료 기준: 콘솔 오류와 실패한 파일 요청이 없을 것</code><button class=\"copy\">복사</button></pre><div class=\"callout\"><b>생성 후 직접 검토합니다.</b><br>파일 구조, 콘텐츠 정확성, 접근성, 콘솔 오류와 배포 가능 여부를 확인합니다.</div>"
      },
      {
        "title": "실습: Kiro로 프로젝트를 생성하고 로컬에서 검증합니다",
        "lead": "한 번에 완성하려 하지 않고 요구사항, 생성, 실행, 검토와 수정 순서로 진행합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>프로젝트 열기</h3><p>Kiro에서 영문 이름의 빈 폴더를 엽니다.</p><span class=\"result\">경로 확인</span></div><div class=\"step\"><h3>요구사항 전달</h3><p>목적, 구조, 금지 조건과 완료 기준을 입력합니다.</p><span class=\"result\">생성 계획 확인</span></div><div class=\"step\"><h3>파일 생성 검토</h3><p>변경 내용을 읽고 필요한 작업만 승인합니다.</p><span class=\"result\">정적 파일 생성</span></div><div class=\"step\"><h3>로컬 서버 실행</h3><p>python -m http.server 5500을 실행합니다.</p><span class=\"result\">localhost:5500</span></div><div class=\"step\"><h3>콘텐츠 수정</h3><p>임의 정보와 불필요한 문구를 실제 내용으로 교체합니다.</p><span class=\"result\">내용 확인</span></div><div class=\"step\"><h3>오류 점검</h3><p>Console과 Network의 오류와 404를 확인합니다.</p><span class=\"result\">오류 0건</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "EC2에 보낼 최종 프로젝트를 확인합니다",
        "lead": "배포 폴더에는 공개되어도 되는 정적 파일만 포함되어야 합니다.",
        "body": "<div class=\"check\"><label><input type=\"checkbox\">프로젝트 루트에 index.html이 있습니다.</label><label><input type=\"checkbox\">CSS·JavaScript·이미지 경로가 상대경로입니다.</label><label><input type=\"checkbox\">파일명과 코드의 대소문자가 일치합니다.</label><label><input type=\"checkbox\">localhost:5500에서 모든 화면과 링크가 작동합니다.</label><label><input type=\"checkbox\">브라우저 Console에 오류가 없습니다.</label><label><input type=\"checkbox\">API 키·비밀번호·개인정보가 없습니다.</label><label><input type=\"checkbox\">불필요한 임시 파일이 없습니다.</label></div><div class=\"callout\"><b>배포 준비 완료</b><br>다음 교시에는 프로젝트를 EC2 임시 경로로 전송한 뒤 Nginx 문서 경로에 반영합니다.</div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 2,
    "id": "d2l3",
    "period": "3교시",
    "title": "Kiro 프로젝트를 EC2에 배포",
    "subtitle": "SCP로 파일을 전송하고 Nginx 문서 경로에 반영한 뒤 공개 IP로 검증합니다.",
    "plan": [
      "배포 흐름 8분",
      "SCP·SSH 10분",
      "파일 반영 12분",
      "개인 배포 15분",
      "검증 5분"
    ],
    "slides": [
      {
        "title": "배포는 개발 파일을 서비스 위치로 옮기는 과정입니다",
        "lead": "로컬에서 성공한 파일을 서버에 전송하고 웹 서버가 읽는 경로에 배치합니다.",
        "body": "<div class=\"visual-stage request-route\"><div class=\"diagram-node\"><span data-icon=\"code\"></span><b>Kiro 프로젝트</b><small>로컬 검증 완료</small></div><span class=\"route-line\">SCP</span><div class=\"diagram-node\"><span data-icon=\"folder\"></span><b>/tmp/cloud-site</b><small>임시 업로드 경로</small></div><span class=\"route-line\">rsync</span><div class=\"diagram-node selected\"><span data-icon=\"nginx\"></span><b>Nginx 문서 경로</b><small>/var/www/html</small></div><span class=\"route-line return\">HTTP</span><div class=\"diagram-node\"><span data-icon=\"browser\"></span><b>공개 웹사이트</b><small>http://PUBLIC_IP</small></div></div>"
      },
      {
        "title": "SSH는 명령, SCP는 파일 전송에 사용합니다",
        "lead": "두 방식은 같은 키와 접속 정보를 사용하지만 명령을 실행하는 위치가 다릅니다.",
        "body": "<div class=\"compare\"><article><h3>SSH · 서버 접속</h3><pre><code>ssh -i lab-key.pem ubuntu@PUBLIC_IP</code><button class=\"copy\">복사</button></pre><p>서버 셸에서 명령을 실행합니다.</p></article><mark>+</mark><article><h3>SCP · 파일 전송</h3><pre><code>scp -i lab-key.pem -r ./cloud-portfolio/* ubuntu@PUBLIC_IP:/tmp/cloud-site/</code><button class=\"copy\">복사</button></pre><p>로컬 파일을 EC2로 복사합니다.</p></article></div><div class=\"callout warn\"><b>실행 위치를 구분합니다.</b><br>SCP는 Kiro 터미널에서, mkdir·rsync·systemctl은 EC2 터미널에서 실행합니다.</div>"
      },
      {
        "title": "임시 경로를 확인한 뒤 Nginx 경로로 동기화합니다",
        "lead": "파일 목록을 확인하고 rsync로 서비스 경로를 원본과 일치시킵니다.",
        "body": "<pre><code># EC2\nmkdir -p /tmp/cloud-site\n\n# 로컬 Kiro 터미널\nscp -i lab-key.pem -r ./cloud-portfolio/* ubuntu@PUBLIC_IP:/tmp/cloud-site/\n\n# 다시 EC2\nfind /tmp/cloud-site -maxdepth 3 -type f | sort\nsudo rsync -av --delete /tmp/cloud-site/ /var/www/html/</code><button class=\"copy\">복사</button></pre><div class=\"callout danger\"><b>--delete 사용 전 경로를 확인합니다.</b><br>원본에 없는 대상 파일을 삭제하므로 /tmp/cloud-site/와 /var/www/html/을 정확히 입력합니다.</div>"
      },
      {
        "title": "권한과 Nginx 설정을 확인한 뒤 다시 읽습니다",
        "lead": "정적 파일은 실행 권한이 필요하지 않으며 Nginx가 디렉터리와 파일을 읽을 수 있어야 합니다.",
        "body": "<pre><code>sudo find /var/www/html -type d -exec chmod 755 {} \\;\nsudo find /var/www/html -type f -exec chmod 644 {} \\;\nsudo nginx -t\nsudo systemctl reload nginx\ncurl -I http://localhost</code><button class=\"copy\">복사</button></pre><div class=\"grid3\"><article class=\"card\"><b class=\"metric\">755</b><h3>디렉터리</h3><p>소유자 쓰기와 모든 사용자의 읽기·접근을 허용합니다.</p></article><article class=\"card\"><b class=\"metric\">644</b><h3>정적 파일</h3><p>소유자 쓰기와 모든 사용자의 읽기를 허용합니다.</p></article><article class=\"card\"><b class=\"metric\">nginx -t</b><h3>설정 검사</h3><p>서비스에 반영하기 전 설정 문법을 확인합니다.</p></article></div>"
      },
      {
        "title": "실습: 첫 EC2 웹사이트를 배포하고 다시 수정합니다",
        "lead": "전송, 확인, 반영, 외부 검증과 재배포를 한 흐름으로 수행합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>임시 폴더 생성</h3><p>EC2에서 /tmp/cloud-site를 생성합니다.</p><span class=\"result\">빈 폴더</span></div><div class=\"step\"><h3>프로젝트 전송</h3><p>Kiro 터미널에서 SCP로 파일을 전송합니다.</p><span class=\"result\">전송 성공</span></div><div class=\"step\"><h3>파일 확인</h3><p>EC2에서 index.html과 하위 폴더를 확인합니다.</p><span class=\"result\">구조 일치</span></div><div class=\"step\"><h3>서비스 반영</h3><p>rsync와 권한 명령을 실행하고 nginx -t를 확인합니다.</p><span class=\"result\">syntax is ok</span></div><div class=\"step\"><h3>외부 접속</h3><p>시크릿 창에서 http://공개IP로 접속합니다.</p><span class=\"result\">개인 웹사이트</span></div><div class=\"step\"><h3>수정·재배포</h3><p>제목에 v2를 추가하고 같은 절차로 다시 배포합니다.</p><span class=\"result\">최신 v2 표시</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "DAY 2 배포 결과를 확인합니다",
        "lead": "로컬 프로젝트와 EC2 서비스 파일이 일치하고 외부에서 최신 화면을 확인할 수 있어야 합니다.",
        "body": "<div class=\"check\"><label><input type=\"checkbox\">Kiro 프로젝트가 로컬에서 정상 동작합니다.</label><label><input type=\"checkbox\">SCP로 프로젝트 파일을 EC2에 전송했습니다.</label><label><input type=\"checkbox\">/tmp/cloud-site와 로컬 파일 구조가 일치합니다.</label><label><input type=\"checkbox\">Nginx 문서 경로에 최신 파일이 반영되었습니다.</label><label><input type=\"checkbox\">nginx -t 결과가 정상입니다.</label><label><input type=\"checkbox\">공개 IP에서 개인 웹사이트가 표시됩니다.</label><label><input type=\"checkbox\">한 번 수정한 뒤 재배포했습니다.</label></div><div class=\"callout\"><b>DAY 2 결과물</b><br>AWS 네트워크와 EC2, Ubuntu, Nginx, Kiro 프로젝트가 하나의 공개 웹서비스로 연결되었습니다.</div>",
        "kind": "summary"
      }
    ]
  }
];
