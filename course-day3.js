window.COURSE_META = {
  "day": 3,
  "phase": "OPERATE",
  "documentTitle": "조선대학교 AWS 클라우드 웹서비스 구축 · DAY 3",
  "eyebrow": "DIAGNOSE · COMPARE · CLEANUP",
  "heading": "웹서비스 장애를 진단하고,",
  "headingAccent": "AWS 자원을 안전하게 정리합니다.",
  "description": "네트워크, 보안 그룹, Nginx, 파일과 로그를 기준으로 장애를 진단하고 전체 정적 웹 프로젝트를 S3 웹사이트로 배포한 뒤 비용이 발생하는 실습 자원을 정리합니다.",
  "sideCopy": "장애 분석, S3 정적 웹 호스팅, 최종 검증과 자원 정리를 진행합니다.",
  "statA": "LOG",
  "statACopy": "증거 기반 장애 분석",
  "statB": "CLEAN",
  "statBCopy": "비용 자원 정리",
  "outcomes": [
    [
      "장애 구분",
      "시간 초과와 HTTP 상태 코드 오류를 구분합니다."
    ],
    [
      "로그 분석",
      "systemctl, curl, ss와 Nginx 로그로 원인을 찾습니다."
    ],
    [
      "S3 웹 호스팅",
      "전체 프로젝트를 S3 정적 웹사이트로 배포하고 검증합니다."
    ],
    [
      "자원 정리",
      "의존 관계의 반대 순서로 AWS 실습 자원을 삭제합니다."
    ]
  ]
};

window.COURSE = [
  {
    "day": 3,
    "id": "d3l1",
    "period": "1교시",
    "title": "클라우드 웹서비스 장애 분석",
    "subtitle": "네트워크·보안·프로세스·파일·로그의 증거로 접속 장애의 원인을 찾습니다.",
    "plan": [
      "진단 원칙 8분",
      "계층별 점검 12분",
      "로그와 명령 10분",
      "복구 실습 15분",
      "정리 5분"
    ],
    "slides": [
      {
        "title": "장애는 가장 가까운 계층부터 범위를 줄여 찾습니다",
        "lead": "서버 내부 응답부터 확인한 뒤 보안 그룹, 라우팅과 브라우저 순서로 범위를 넓힙니다.",
        "body": "<div class=\"visual-stage diag-stack\"><div><span data-icon=\"browser\"></span><b>브라우저</b><small>URL·캐시·Network</small></div><div><span data-icon=\"network\"></span><b>네트워크</b><small>공개 IP·라우팅·IGW</small></div><div><span data-icon=\"shield\"></span><b>보안</b><small>보안 그룹 80·22</small></div><div><span data-icon=\"nginx\"></span><b>프로세스</b><small>Nginx active·LISTEN</small></div><div><span data-icon=\"file\"></span><b>콘텐츠</b><small>경로·권한·대소문자</small></div></div><div class=\"callout\"><b>진단 원칙</b><br>한 번에 하나의 원인 후보만 변경하고 변경 전후의 결과를 비교합니다.</div>"
      },
      {
        "title": "연결 시간 초과는 응답이 돌아오지 않았다는 의미입니다",
        "lead": "EC2 상태, 공개 IP, 라우팅, 보안 그룹과 Nginx 수신 포트를 순서대로 확인합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>인스턴스</h3><p>Running과 상태 검사 2/2를 확인합니다.</p><span class=\"result\">서버 기반 정상</span></div><div class=\"step\"><h3>주소</h3><p>현재 공개 IPv4와 브라우저 주소를 비교합니다.</p><span class=\"result\">목적지 일치</span></div><div class=\"step\"><h3>경로</h3><p>0.0.0.0/0 → IGW를 확인합니다.</p><span class=\"result\">경로 Active</span></div><div class=\"step\"><h3>보안</h3><p>인바운드 TCP 80의 출발지를 확인합니다.</p><span class=\"result\">HTTP 허용</span></div><div class=\"step\"><h3>포트</h3><p>sudo ss -lntp | grep :80을 실행합니다.</p><span class=\"result\">Nginx LISTEN</span></div></div>",
        "kind": "trouble"
      },
      {
        "title": "HTTP 상태 코드는 서버가 요청을 받은 뒤의 결과입니다",
        "lead": "시간 초과와 달리 403·404·500은 요청이 웹 서버까지 도착했다는 단서입니다.",
        "body": "<div class=\"grid3\"><article class=\"card\"><b class=\"metric\">403</b><h3>접근 거부</h3><p>파일 권한, 인덱스 설정과 접근 규칙을 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">404</b><h3>파일 없음</h3><p>URL, 실제 파일명, 대소문자와 상대경로를 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">500</b><h3>서버 내부 오류</h3><p>Nginx 설정과 애플리케이션 오류 로그를 확인합니다.</p></article></div><div class=\"callout\"><b>200만 정상 응답은 아닙니다.</b><br>304는 캐시 사용, 301·302는 이동을 의미할 수 있으므로 상태와 응답 내용을 함께 확인합니다.</div>"
      },
      {
        "title": "Nginx와 브라우저 로그에서 증거를 찾습니다",
        "lead": "서버는 요청과 오류를 기록하고 브라우저는 파일별 요청 상태를 보여줍니다.",
        "body": "<pre><code>sudo tail -n 30 /var/log/nginx/access.log\nsudo tail -n 30 /var/log/nginx/error.log\nsudo journalctl -u nginx --since '10 minutes ago' --no-pager\nsudo nginx -t</code><button class=\"copy\">복사</button></pre><div class=\"table\"><table><thead><tr><th>위치</th><th>확인 내용</th></tr></thead><tbody><tr><td>access.log</td><td>요청 IP·경로·상태 코드·응답 크기</td></tr><tr><td>error.log</td><td>파일 없음·권한·설정 오류</td></tr><tr><td>Console</td><td>JavaScript 오류</td></tr><tr><td>Network</td><td>CSS·JS·이미지의 403·404</td></tr></tbody></table></div>"
      },
      {
        "title": "실습: 세 가지 장애를 진단하고 복구합니다",
        "lead": "증상과 증거를 기록한 뒤 원인에 해당하는 설정만 수정합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>Nginx 중지</h3><p>외부와 localhost를 비교하고 systemctl로 원인을 확인합니다.</p><span class=\"result\">서비스 시작 후 200</span></div><div class=\"step\"><h3>HTTP 규칙 제거</h3><p>localhost 성공과 외부 실패의 차이를 확인합니다.</p><span class=\"result\">80번 규칙 복구</span></div><div class=\"step\"><h3>CSS 경로 오류</h3><p>Network의 404와 실제 파일명을 비교합니다.</p><span class=\"result\">스타일 정상</span></div><div class=\"step\"><h3>로그 확인</h3><p>각 장애 전후의 access.log와 error.log를 확인합니다.</p><span class=\"result\">원인별 증거</span></div><div class=\"step\"><h3>최종 검증</h3><p>시크릿 창과 curl로 최신 페이지를 확인합니다.</p><span class=\"result\">전체 정상</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "진단 순서를 자신의 말로 설명합니다",
        "lead": "서버 내부에서 외부로, 네트워크에서 콘텐츠로 확인 범위를 넓히는 순서를 정리합니다.",
        "body": "<div class=\"check\"><label><input type=\"checkbox\">시간 초과와 HTTP 상태 코드 오류의 차이를 설명할 수 있습니다.</label><label><input type=\"checkbox\">localhost로 서버와 외부 네트워크 문제를 구분할 수 있습니다.</label><label><input type=\"checkbox\">보안 그룹, 라우팅 테이블과 공개 IP를 확인할 수 있습니다.</label><label><input type=\"checkbox\">systemctl, ss, curl과 nginx -t를 사용할 수 있습니다.</label><label><input type=\"checkbox\">access.log와 error.log에서 증거를 찾을 수 있습니다.</label><label><input type=\"checkbox\">한 번에 하나의 설정만 변경했습니다.</label></div><div class=\"callout\"><b>복구 완료 기준</b><br>원인을 설명하고 수정한 설정을 제시하며 브라우저와 로그에서 정상 결과를 확인합니다.</div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 3,
    "id": "d3l2",
    "period": "2교시",
    "title": "Amazon S3 정적 웹사이트 배포",
    "subtitle": "HTML·CSS·JavaScript·이미지의 폴더 구조를 유지하여 전체 프로젝트를 S3 웹사이트로 배포합니다.",
    "plan": [
      "구조 점검 8분",
      "버킷·업로드 12분",
      "호스팅·권한 12분",
      "접속·오류 해결 13분",
      "EC2 비교 5분"
    ],
    "slides": [
      {
        "title": "S3에는 웹 프로젝트 전체를 배포합니다",
        "lead": "index.html이 참조하는 CSS·JavaScript·이미지가 함께 있어야 브라우저가 완성된 화면을 구성할 수 있습니다.",
        "body": "<div class=\"compare\"><article><span class=\"visual-icon\" data-icon=\"file\"></span><h3>index.html만 업로드</h3><ul><li>HTML 글자는 표시될 수 있습니다.</li><li>CSS·JavaScript·이미지 요청은 404가 됩니다.</li><li>기능과 디자인이 깨진 불완전한 배포입니다.</li></ul></article><mark>→</mark><article><span class=\"visual-icon\" data-icon=\"bucket\"></span><h3>프로젝트 전체 업로드</h3><ul><li>index.html과 error.html</li><li>css·js·images 폴더</li><li>HTML에 연결된 모든 정적 파일</li></ul></article></div><div class=\"callout\"><b>배포 기준</b><br>로컬에서 열리는 파일을 모두 올리는 것이 아니라, 웹페이지가 실제로 참조하는 파일과 폴더를 빠짐없이 동일한 상대경로로 업로드합니다.</div>"
      },
      {
        "title": "로컬 폴더 구조와 S3 객체 키를 일치시킵니다",
        "lead": "S3의 폴더는 실제 디렉터리가 아니라 객체 키의 접두사이며 대소문자를 구분합니다.",
        "body": "<div class=\"visual-stage s3-visual\"><div class=\"bucket-shell\"><span data-icon=\"folder\"></span><b>cloud-portfolio</b><small>로컬 프로젝트 폴더</small></div><div class=\"object-stack\"><article><span data-icon=\"file\"></span><b>index.html</b><small>키: index.html</small></article><article><span data-icon=\"file\"></span><b>error.html</b><small>키: error.html</small></article><article><span data-icon=\"palette\"></span><b>style.css</b><small>키: css/style.css</small></article><article><span data-icon=\"code\"></span><b>app.js</b><small>키: js/app.js</small></article><article><span data-icon=\"object\"></span><b>profile.webp</b><small>키: images/profile.webp</small></article></div></div><div class=\"callout warn\"><b>프로젝트 폴더 자체를 한 단계 더 올리지 않습니다.</b><br>버킷 루트에 cloud-portfolio/index.html이 아니라 index.html이 보여야 웹사이트 루트 주소가 정상적으로 열립니다.</div>"
      },
      {
        "title": "업로드 전에 프로젝트를 배포 가능한 상태로 점검합니다",
        "lead": "깨진 경로와 누락 파일을 먼저 수정하면 S3 권한 문제와 콘텐츠 문제를 분리하여 확인할 수 있습니다.",
        "body": "<pre><code>cloud-portfolio/\n├─ index.html\n├─ error.html\n├─ css/\n│  └─ style.css\n├─ js/\n│  └─ app.js\n└─ images/\n   └─ profile.webp</code><button class=\"copy\">복사</button></pre><div class=\"check\"><label><input type=\"checkbox\">index.html과 error.html 파일명이 모두 소문자입니다.</label><label><input type=\"checkbox\">HTML의 CSS 경로가 ./css/style.css와 일치합니다.</label><label><input type=\"checkbox\">HTML의 JavaScript 경로가 ./js/app.js와 일치합니다.</label><label><input type=\"checkbox\">이미지 경로와 실제 파일명·확장자·대소문자가 일치합니다.</label><label><input type=\"checkbox\">로컬 브라우저의 Console과 Network에 404 오류가 없습니다.</label><label><input type=\"checkbox\">비밀번호·액세스 키·개인정보가 파일에 포함되지 않았습니다.</label></div><div class=\"callout\"><b>error.html이 없다면 생성합니다.</b><br>존재하지 않는 주소를 요청했을 때 표시할 간단한 안내와 index.html로 돌아가는 링크를 작성합니다.</div>"
      },
      {
        "title": "버킷을 만든 뒤 프로젝트 내용을 루트에 업로드합니다",
        "lead": "서울 리전의 일반 목적 버킷을 만들고 index.html과 하위 폴더가 올바른 키로 저장되었는지 확인합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>S3 이동</h3><p>AWS 콘솔에서 S3 → 일반 목적 버킷 → 버킷 만들기를 선택합니다.</p><span class=\"result\">생성 화면</span></div><div class=\"step\"><h3>이름·리전</h3><p>전 세계에서 고유한 lab-site-학번-임의문자 이름과 아시아 태평양(서울) ap-northeast-2를 선택합니다.</p><span class=\"result\">이름·리전 확인</span></div><div class=\"step\"><h3>소유권</h3><p>객체 소유권은 ACL 비활성화(권장)를 유지합니다.</p><span class=\"result\">Bucket owner enforced</span></div><div class=\"step\"><h3>초기 보안</h3><p>업로드하는 동안 퍼블릭 액세스 차단은 켠 상태로 버킷을 만듭니다.</p><span class=\"result\">버킷 생성</span></div><div class=\"step\"><h3>업로드 시작</h3><p>버킷 → 객체 → 업로드를 선택합니다.</p><span class=\"result\">업로드 화면</span></div><div class=\"step\"><h3>내용 추가</h3><p>파일 추가로 index.html·error.html, 폴더 추가로 css·js·images를 선택합니다.</p><span class=\"result\">전체 항목 표시</span></div><div class=\"step\"><h3>업로드 완료</h3><p>업로드를 실행하고 실패 항목이 0개인지 확인합니다.</p><span class=\"result\">성공</span></div><div class=\"step\"><h3>키 검증</h3><p>버킷 루트에 index.html이 있고 css/style.css 등의 키가 보이는지 확인합니다.</p><span class=\"result\">구조 일치</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "정적 웹 호스팅과 공개 읽기 권한을 설정합니다",
        "lead": "웹사이트 기능을 활성화한 뒤 인터넷 사용자가 웹 콘텐츠 객체만 읽을 수 있도록 설정합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>호스팅 활성화</h3><p>속성 → 정적 웹 사이트 호스팅 → 편집 → 활성화를 선택합니다.</p><span class=\"result\">정적 웹사이트 호스팅</span></div><div class=\"step\"><h3>문서 지정</h3><p>호스팅 유형은 정적 웹 사이트, 인덱스 문서는 index.html, 오류 문서는 error.html로 저장합니다.</p><span class=\"result\">엔드포인트 생성</span></div><div class=\"step\"><h3>버킷 차단 수정</h3><p>권한 → 퍼블릭 액세스 차단 → 편집에서 이 실습 버킷의 모든 퍼블릭 액세스 차단을 해제하고 확인 문구를 입력합니다.</p><span class=\"result\">버킷 공개 경고</span></div><div class=\"step\"><h3>정책 편집</h3><p>권한 → 버킷 정책 → 편집에서 아래 GetObject 정책을 붙여 넣고 버킷 이름을 바꿉니다.</p><span class=\"result\">정책 저장</span></div><div class=\"step\"><h3>엔드포인트 접속</h3><p>속성의 정적 웹 사이트 호스팅 영역에서 버킷 웹 사이트 엔드포인트를 엽니다.</p><span class=\"result\">전체 화면 표시</span></div></div><pre><code>{\n  &quot;Version&quot;: &quot;2012-10-17&quot;,\n  &quot;Statement&quot;: [{\n    &quot;Sid&quot;: &quot;PublicReadForWebsite&quot;,\n    &quot;Effect&quot;: &quot;Allow&quot;,\n    &quot;Principal&quot;: &quot;*&quot;,\n    &quot;Action&quot;: &quot;s3:GetObject&quot;,\n    &quot;Resource&quot;: &quot;arn:aws:s3:::YOUR-BUCKET-NAME/*&quot;\n  }]\n}</code><button class=\"copy\">복사</button></pre><div class=\"callout danger\"><b>공개되는 범위는 웹 콘텐츠 객체 읽기입니다.</b><br>정책에 PutObject·DeleteObject를 추가하지 않고 민감한 파일을 이 버킷에 업로드하지 않습니다.</div>",
        "kind": "practice"
      },
      {
        "title": "웹사이트 엔드포인트에서 전체 파일과 오류를 검증합니다",
        "lead": "첫 화면만 확인하지 않고 CSS·JavaScript·이미지와 오류 문서까지 요청 상태를 확인합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>증상</th><th>확인 위치</th><th>수정 기준</th></tr></thead><tbody><tr><td>403 Access Denied</td><td>버킷 퍼블릭 액세스 차단·버킷 정책</td><td>GetObject와 버킷 ARN 확인</td></tr><tr><td>404 NoSuchKey</td><td>객체 키·파일명·대소문자</td><td>index.html을 루트에 배치</td></tr><tr><td>HTML만 표시</td><td>브라우저 Network의 CSS·JS·이미지</td><td>하위 폴더 전체 업로드</td></tr><tr><td>Object URL만 열림</td><td>접속한 주소</td><td>속성의 웹사이트 엔드포인트 사용</td></tr><tr><td>HTTPS 필요</td><td>S3 웹사이트 엔드포인트 제한</td><td>CloudFront·Amplify Hosting 검토</td></tr></tbody></table></div><div class=\"check\"><label><input type=\"checkbox\">버킷 루트에 index.html과 error.html이 있습니다.</label><label><input type=\"checkbox\">css·js·images 폴더의 객체 키가 로컬 경로와 일치합니다.</label><label><input type=\"checkbox\">웹사이트 엔드포인트에서 디자인과 기능이 정상입니다.</label><label><input type=\"checkbox\">Network에서 주요 파일의 응답이 200입니다.</label><label><input type=\"checkbox\">존재하지 않는 주소에서 error.html이 표시됩니다.</label><label><input type=\"checkbox\">공개 정책에는 s3:GetObject만 있습니다.</label><label><input type=\"checkbox\">EC2와 S3의 기능과 운영 책임 차이를 설명할 수 있습니다.</label></div><div class=\"callout\"><b>비교 결과</b><br>S3는 정적 파일 제공에 적합하고 서버 측 프로그램은 실행하지 않습니다. API·백엔드·운영체제 제어가 필요하면 EC2 또는 다른 컴퓨팅 서비스를 사용합니다.</div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 3,
    "id": "d3l3",
    "period": "3교시",
    "title": "최종 검증과 AWS 자원 정리",
    "subtitle": "구조, 보안, 기능과 비용을 점검하고 의존 관계에 따라 실습 자원을 안전하게 삭제합니다.",
    "plan": [
      "최종 개선 10분",
      "구조 설명 10분",
      "보안·비용 10분",
      "자원 정리 15분",
      "과정 평가 5분"
    ],
    "slides": [
      {
        "title": "최종 결과는 코드와 인프라가 연결된 서비스입니다",
        "lead": "네트워크 구성, 서버 운영, AI 개발, 배포와 장애 해결의 전 과정을 하나의 구조로 설명합니다.",
        "body": "<div class=\"visual-stage architecture-final\"><div class=\"arch-user\"><span data-icon=\"browser\"></span><b>사용자</b><small>HTTP 요청</small></div><div class=\"arch-vpc\"><b>Amazon VPC · 10.10.0.0/16</b><div><span data-icon=\"gateway\"></span><strong>Internet Gateway</strong></div><div><span data-icon=\"route\"></span><strong>Public Route Table</strong></div><div class=\"arch-subnet\"><b>Public Subnet · 10.10.1.0/24</b><span data-icon=\"shield\"></span><strong>Security Group</strong><span data-icon=\"server\"></span><strong>EC2 · Linux · Nginx</strong></div></div><div class=\"arch-dev\"><span data-icon=\"code\"></span><b>Kiro</b><small>SCP·재배포</small></div></div>"
      },
      {
        "title": "마지막 변경을 Kiro에서 만들고 다시 배포합니다",
        "lead": "푸터에 배포 정보와 버전을 추가하여 개발부터 운영 반영까지의 반복 과정을 마무리합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>변경 정의</h3><p>푸터에 리전, 서버 방식과 버전 v3를 표시합니다.</p><span class=\"result\">범위 확정</span></div><div class=\"step\"><h3>Kiro 수정</h3><p>요구사항을 전달하고 변경 파일을 검토합니다.</p><span class=\"result\">예상 파일만 변경</span></div><div class=\"step\"><h3>로컬 검증</h3><p>반응형 화면과 Console·Network를 확인합니다.</p><span class=\"result\">오류 0건</span></div><div class=\"step\"><h3>EC2 재배포</h3><p>SCP와 rsync로 변경 파일을 반영합니다.</p><span class=\"result\">nginx -t 정상</span></div><div class=\"step\"><h3>외부 검증</h3><p>시크릿 창에서 v3와 전체 기능을 확인합니다.</p><span class=\"result\">최신 화면</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "아키텍처는 요청 흐름에 따라 설명합니다",
        "lead": "서비스 이름을 나열하는 대신 요청이 통과하는 경로와 각 구성 요소의 역할을 연결합니다.",
        "body": "<div class=\"flow\"><div><b>① 목적지</b><span>EC2 공개 IPv4</span></div><div><b>② 경로</b><span>IGW와 라우팅 테이블</span></div><div><b>③ 허용</b><span>보안 그룹 TCP 80</span></div><div><b>④ 처리</b><span>Nginx가 파일 확인</span></div><div><b>⑤ 응답</b><span>HTML·CSS·JS 반환</span></div></div><div class=\"callout\"><b>설명에 포함할 내용</b><br>VPC CIDR, 서브넷, 기본 경로, 보안 그룹, EC2 운영체제, Nginx 문서 경로와 Kiro 배포 방법을 연결합니다.</div>"
      },
      {
        "title": "보안과 비용 발생 가능성을 최종 점검합니다",
        "lead": "실습 편의를 위해 넓힌 설정과 사용하지 않는 자원이 남아 있지 않은지 확인합니다.",
        "body": "<div class=\"grid3\"><article class=\"card\"><b class=\"metric\">EC2</b><h3>실행 시간</h3><p>인스턴스 실행 시간과 유형을 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">EBS</b><h3>볼륨</h3><p>인스턴스 종료 뒤 남는 볼륨을 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">IPv4</b><h3>공개 주소</h3><p>공개 IPv4와 탄력적 IP를 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">S3</b><h3>저장·요청</h3><p>객체와 공개 정책을 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">SSH</b><h3>접근 범위</h3><p>22번이 전체 인터넷에 열려 있지 않은지 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">Secret</b><h3>비밀정보</h3><p>키와 비밀번호가 코드에 없는지 확인합니다.</p></article></div>"
      },
      {
        "title": "실습: 의존 관계의 반대 순서로 자원을 정리합니다",
        "lead": "다른 학생이나 공용 자원이 아닌 자신의 lab 이름과 ID를 다시 확인한 뒤 삭제합니다.",
        "body": "<div class=\"visual-stage cleanup-flow\"><div><span>1</span><b>EC2 종료</b><small>인스턴스 정리</small></div><div><span>2</span><b>EBS·EIP</b><small>남은 자원 확인</small></div><div><span>3</span><b>보안 그룹</b><small>기본 SG 제외</small></div><div><span>4</span><b>라우팅·서브넷</b><small>네트워크 해제</small></div><div><span>5</span><b>IGW</b><small>분리 후 삭제</small></div><div><span>6</span><b>VPC 삭제</b><small>의존 자원 0건</small></div></div><div class=\"steps\"><div class=\"step\"><h3>결과 기록</h3><p>최종 화면과 구조를 필요한 범위에서 저장합니다.</p><span class=\"result\">증빙 완료</span></div><div class=\"step\"><h3>EC2 종료</h3><p>lab-web-ec2를 종료합니다.</p><span class=\"result\">Terminated</span></div><div class=\"step\"><h3>EBS·EIP 확인</h3><p>남은 볼륨과 주소가 없는지 확인합니다.</p><span class=\"result\">잔여 없음</span></div><div class=\"step\"><h3>S3 정리</h3><p>선택 실습 버킷을 비우고 삭제합니다.</p><span class=\"result\">버킷 제거</span></div><div class=\"step\"><h3>네트워크 정리</h3><p>SG, 서브넷, 라우팅, IGW, VPC 순서로 삭제합니다.</p><span class=\"result\">lab-vpc 제거</span></div><div class=\"step\"><h3>비용 확인</h3><p>Billing에서 실행 자원을 확인합니다.</p><span class=\"result\">실습 자원 0건</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "3일 과정의 학습 결과를 확인합니다",
        "lead": "각 항목을 직접 수행하고 이유를 설명할 수 있다면 인프라 구축부터 배포와 운영까지의 기본 흐름을 완성한 것입니다.",
        "body": "<div class=\"check\"><label><input type=\"checkbox\">리전·가용 영역·VPC·서브넷의 관계를 설명할 수 있습니다.</label><label><input type=\"checkbox\">IGW와 라우팅 테이블로 퍼블릭 경로를 구성할 수 있습니다.</label><label><input type=\"checkbox\">최소 범위의 보안 그룹 규칙을 만들 수 있습니다.</label><label><input type=\"checkbox\">Ubuntu Server 26.04 LTS EC2에 Nginx를 설치할 수 있습니다.</label><label><input type=\"checkbox\">Kiro로 정적 웹 프로젝트를 만들고 검토할 수 있습니다.</label><label><input type=\"checkbox\">SCP와 rsync로 EC2 배포와 재배포를 수행할 수 있습니다.</label><label><input type=\"checkbox\">로그와 명령으로 접속 장애를 진단할 수 있습니다.</label><label><input type=\"checkbox\">HTML·CSS·JavaScript·이미지 전체를 S3 정적 웹사이트로 배포할 수 있습니다.</label><label><input type=\"checkbox\">EC2와 S3의 기능과 운영 책임 차이를 설명할 수 있습니다.</label><label><input type=\"checkbox\">비용 발생 자원을 확인하고 안전하게 삭제했습니다.</label></div><div class=\"question\"><b>최종 설명</b><br>같은 웹 프로젝트가 EC2+Nginx와 S3 웹사이트 엔드포인트에서 제공되는 과정을 비교하여 설명합니다.</div>",
        "kind": "summary"
      }
    ]
  }
];
