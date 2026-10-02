window.COURSE_META = {
  "day": 3,
  "phase": "OPERATE",
  "documentTitle": "조선대학교 AWS 클라우드 웹서비스 구축 · DAY 3",
  "eyebrow": "DIAGNOSE · COMPARE · CLEANUP",
  "heading": "웹서비스 장애를 진단하고,",
  "headingAccent": "AWS 자원을 안전하게 정리합니다.",
  "description": "네트워크, 보안 그룹, Nginx, 파일과 로그를 기준으로 장애를 진단하고 EC2와 S3 배포 방식을 비교한 뒤 비용이 발생하는 실습 자원을 정리합니다.",
  "sideCopy": "장애 분석, S3 비교, 최종 검증과 자원 정리를 진행합니다.",
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
      "배포 비교",
      "EC2와 S3 정적 웹사이트의 운영 책임을 비교합니다."
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
    "title": "Amazon S3와 EC2 배포 비교",
    "subtitle": "같은 정적 웹페이지를 기준으로 객체 스토리지와 가상 서버의 역할, 운영 범위와 선택 기준을 비교합니다.",
    "plan": [
      "S3 개념 8분",
      "구조와 권한 10분",
      "배포 비교 12분",
      "선택 실습 15분",
      "판단 정리 5분"
    ],
    "slides": [
      {
        "title": "같은 웹페이지도 다른 서비스로 제공할 수 있습니다",
        "lead": "정적 파일만 필요한지, 서버 프로그램과 운영체제 제어가 필요한지에 따라 선택합니다.",
        "body": "<div class=\"compare\"><article><span class=\"visual-icon\" data-icon=\"bucket\"></span><h3>Amazon S3 정적 웹사이트</h3><ul><li>정적 파일 제공</li><li>운영체제와 웹 서버 관리 없음</li><li>서버 측 프로그램 직접 실행 불가</li></ul></article><mark>VS</mark><article><span class=\"visual-icon\" data-icon=\"server\"></span><h3>Amazon EC2 + Nginx</h3><ul><li>정적·동적 콘텐츠 제공 가능</li><li>운영체제와 웹 서버 직접 관리</li><li>패치·로그·보안 책임 확대</li></ul></article></div>"
      },
      {
        "title": "S3는 데이터를 객체 단위로 저장합니다",
        "lead": "버킷은 객체를 담는 최상위 컨테이너이고 키는 객체를 구분하는 전체 이름입니다.",
        "body": "<div class=\"visual-stage s3-visual\"><div class=\"bucket-shell\"><span data-icon=\"bucket\"></span><b>cloud-site-student01</b><small>고유한 이름과 리전</small></div><div class=\"object-stack\"><article><span data-icon=\"file\"></span><b>index.html</b><small>키: index.html</small></article><article><span data-icon=\"palette\"></span><b>style.css</b><small>키: css/style.css</small></article><article><span data-icon=\"object\"></span><b>profile.webp</b><small>키: images/profile.webp</small></article></div></div><div class=\"concept-key\"><span><b>버킷</b>객체의 최상위 공간</span><span><b>객체</b>데이터와 메타데이터</span><span><b>키</b>객체의 전체 이름</span></div>"
      },
      {
        "title": "EC2와 S3는 관리 책임과 기능 범위가 다릅니다",
        "lead": "단순함이 항상 우수한 것은 아니며 필요한 기능과 운영 능력을 기준으로 선택합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>항목</th><th>S3 정적 웹사이트</th><th>EC2 + Nginx</th></tr></thead><tbody><tr><td>운영체제</td><td>관리하지 않음</td><td>패치·계정·서비스 관리</td></tr><tr><td>서버 코드</td><td>직접 실행 불가</td><td>Node.js·Java·Python 등 가능</td></tr><tr><td>확장</td><td>서비스가 처리</td><td>인스턴스·LB 설계</td></tr><tr><td>보안</td><td>버킷 정책 등</td><td>SG·OS·Nginx·앱</td></tr><tr><td>활용</td><td>소개·문서·정적 자산</td><td>API·백엔드·커스텀 환경</td></tr></tbody></table></div>"
      },
      {
        "title": "S3 공개 읽기는 GetObject만 허용합니다",
        "lead": "웹 콘텐츠 전용 버킷에 읽기만 허용하고 업로드·수정·삭제 권한은 공개하지 않습니다.",
        "body": "<pre><code>{\n  &quot;Version&quot;: &quot;2012-10-17&quot;,\n  &quot;Statement&quot;: [{\n    &quot;Effect&quot;: &quot;Allow&quot;,\n    &quot;Principal&quot;: &quot;*&quot;,\n    &quot;Action&quot;: &quot;s3:GetObject&quot;,\n    &quot;Resource&quot;: &quot;arn:aws:s3:::YOUR-BUCKET-NAME/*&quot;\n  }]\n}</code><button class=\"copy\">복사</button></pre><div class=\"callout danger\"><b>민감한 파일을 공개 버킷에 업로드하지 않습니다.</b><br>정적 웹사이트 설정은 인터넷 사용자가 객체를 읽을 수 있게 하므로 웹 콘텐츠만 저장합니다.</div>"
      },
      {
        "title": "선택 실습: 같은 프로젝트를 S3에 배포합니다",
        "lead": "EC2 결과와 비교하기 위해 같은 정적 프로젝트를 별도의 S3 버킷에 배포합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>버킷 생성</h3><p>고유한 영문 이름과 서울 리전을 선택합니다.</p><span class=\"result\">버킷 표시</span></div><div class=\"step\"><h3>프로젝트 업로드</h3><p>index.html이 버킷 루트에 있도록 업로드합니다.</p><span class=\"result\">객체 키 확인</span></div><div class=\"step\"><h3>정적 웹사이트</h3><p>인덱스 문서를 index.html로 설정합니다.</p><span class=\"result\">엔드포인트 생성</span></div><div class=\"step\"><h3>공개 읽기</h3><p>실습 지침에 따라 GetObject 정책을 적용합니다.</p><span class=\"result\">공개 경고 확인</span></div><div class=\"step\"><h3>접속 확인</h3><p>웹사이트 엔드포인트에서 하위 파일까지 확인합니다.</p><span class=\"result\">EC2와 동일 화면</span></div><div class=\"step\"><h3>차이 기록</h3><p>주소·설정·운영 범위·HTTPS 차이를 정리합니다.</p><span class=\"result\">비교표 완성</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "요구사항에 따라 배포 서비스를 선택합니다",
        "lead": "서버를 사용할 수 있다는 이유가 아니라 필요한 기능과 관리 책임을 기준으로 판단합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>요구사항</th><th>우선 선택</th><th>이유</th></tr></thead><tbody><tr><td>동아리 소개 정적 사이트</td><td>S3 + CloudFront 검토</td><td>서버 코드가 필요 없음</td></tr><tr><td>Python API</td><td>EC2 또는 관리형 컴퓨팅</td><td>실행 환경 필요</td></tr><tr><td>이미지 원본 저장</td><td>S3</td><td>객체 단위 저장</td></tr><tr><td>특정 Linux 설정</td><td>EC2</td><td>운영체제 제어 필요</td></tr></tbody></table></div><div class=\"check\"><label><input type=\"checkbox\">S3의 버킷·객체·키를 구분할 수 있습니다.</label><label><input type=\"checkbox\">EC2와 S3의 운영 책임을 비교할 수 있습니다.</label><label><input type=\"checkbox\">공개 읽기와 공개 쓰기의 차이를 설명할 수 있습니다.</label><label><input type=\"checkbox\">요구사항에 맞는 배포 방식을 선택할 수 있습니다.</label></div>",
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
        "body": "<div class=\"check\"><label><input type=\"checkbox\">리전·가용 영역·VPC·서브넷의 관계를 설명할 수 있습니다.</label><label><input type=\"checkbox\">IGW와 라우팅 테이블로 퍼블릭 경로를 구성할 수 있습니다.</label><label><input type=\"checkbox\">최소 범위의 보안 그룹 규칙을 만들 수 있습니다.</label><label><input type=\"checkbox\">Ubuntu Server 26.04 LTS EC2에 Nginx를 설치할 수 있습니다.</label><label><input type=\"checkbox\">Kiro로 정적 웹 프로젝트를 만들고 검토할 수 있습니다.</label><label><input type=\"checkbox\">SCP와 rsync로 배포와 재배포를 수행할 수 있습니다.</label><label><input type=\"checkbox\">로그와 명령으로 접속 장애를 진단할 수 있습니다.</label><label><input type=\"checkbox\">EC2와 S3 배포 방식의 차이를 설명할 수 있습니다.</label><label><input type=\"checkbox\">비용 발생 자원을 확인하고 안전하게 삭제했습니다.</label></div><div class=\"question\"><b>최종 설명</b><br>“브라우저에 EC2 공개 IP를 입력했을 때 화면이 나타나기까지”를 VPC, 라우팅, 보안 그룹, EC2와 Nginx를 포함하여 설명합니다.</div>",
        "kind": "summary"
      }
    ]
  }
];
