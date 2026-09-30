window.COURSE_META = {
  "day": 1,
  "phase": "BUILD",
  "documentTitle": "조선대학교 AWS 클라우드 웹서비스 구축 · DAY 1",
  "eyebrow": "AWS VPC · EC2 · UBUNTU",
  "heading": "AWS 네트워크와 서버를 만들고,",
  "headingAccent": "Ubuntu EC2에 접속합니다.",
  "description": "리전과 가용 영역의 관계를 이해하고 VPC, 퍼블릭 서브넷, 인터넷 게이트웨이, 라우팅 테이블과 보안 그룹을 구성한 뒤 Ubuntu Server 26.04 LTS EC2를 생성합니다.",
  "sideCopy": "AWS 네트워크 구성부터 Ubuntu EC2 접속까지 진행합니다.",
  "statA": "VPC",
  "statACopy": "퍼블릭 네트워크 구성",
  "statB": "EC2",
  "statBCopy": "Ubuntu 26.04 LTS 접속",
  "outcomes": [
    [
      "인프라 구분",
      "리전, 가용 영역, VPC와 서브넷의 관계를 설명합니다."
    ],
    [
      "네트워크 구성",
      "IGW, 라우팅 테이블과 퍼블릭 서브넷을 연결합니다."
    ],
    [
      "접근 통제",
      "HTTP와 SSH에 필요한 최소 보안 그룹 규칙을 만듭니다."
    ],
    [
      "서버 접속",
      "Ubuntu Server 26.04 LTS EC2를 생성하고 안전하게 접속합니다."
    ]
  ]
};

window.COURSE = [
  {
    "day": 1,
    "id": "d1l1",
    "period": "1교시",
    "title": "AWS 클라우드 아키텍처 이해",
    "subtitle": "웹 요청이 리전·네트워크·서버를 거쳐 응답으로 돌아오는 전체 구조를 이해합니다.",
    "plan": [
      "과정 목표 5분",
      "클라우드 구조 15분",
      "글로벌 인프라 12분",
      "보안과 책임 10분",
      "환경 확인 8분"
    ],
    "slides": [
      {
        "title": "3일 뒤 완성할 클라우드 웹서비스",
        "lead": "직접 구성한 VPC와 EC2에 Kiro로 만든 웹페이지를 배포하고 접속 장애의 원인을 설명합니다.",
        "body": "<div class=\"visual-stage request-route\"><div class=\"diagram-node\"><span data-icon=\"code\"></span><b>Kiro</b><small>웹페이지 개발과 수정</small></div><span class=\"route-line\">파일 전송</span><div class=\"diagram-node\"><span data-icon=\"network\"></span><b>Amazon VPC</b><small>주소와 통신 경로</small></div><span class=\"route-line\">HTTP</span><div class=\"diagram-node selected\"><span data-icon=\"server\"></span><b>Amazon EC2</b><small>Linux와 Nginx 실행</small></div><span class=\"route-line return\">응답</span><div class=\"diagram-node\"><span data-icon=\"browser\"></span><b>웹 브라우저</b><small>공개 IP로 결과 확인</small></div></div><div class=\"concept-key\"><span><b>구축</b>VPC·서브넷·라우팅·보안 그룹</span><span><b>배포</b>Kiro 프로젝트를 EC2로 전송</span><span><b>운영</b>로그와 명령으로 장애 원인 확인</span></div>"
      },
      {
        "title": "클라우드는 IT 자원을 필요한 시점에 사용하는 방식입니다",
        "lead": "서버, 스토리지, 데이터베이스와 네트워크를 인터넷을 통해 준비하고 사용량에 따라 비용을 지불합니다.",
        "body": "<div class=\"grid3\"><article class=\"card\"><b class=\"metric\">즉시성</b><h3>몇 분 안에 생성</h3><p>장비 구매와 배송 없이 콘솔이나 API에서 자원을 준비합니다.</p></article><article class=\"card\"><b class=\"metric\">탄력성</b><h3>수요에 맞춰 조절</h3><p>서비스 사용량에 따라 자원의 크기와 수량을 변경합니다.</p></article><article class=\"card\"><b class=\"metric\">사용량</b><h3>쓴 만큼 비용 발생</h3><p>실행 시간, 저장 용량, 요청 횟수와 데이터 전송량이 비용에 영향을 줍니다.</p></article></div><div class=\"callout warn\"><b>클라우드가 자동으로 저렴하거나 안전한 것은 아닙니다.</b><br>필요하지 않은 자원을 계속 실행하거나 접근 범위를 넓게 설정하면 비용과 보안 위험이 커집니다.</div>"
      },
      {
        "title": "리전과 가용 영역은 위치와 장애 범위를 나눕니다",
        "lead": "리전은 지리적 구역이고, 가용 영역은 리전 안에서 독립적으로 운영되는 인프라 집합입니다.",
        "body": "<div class=\"visual-stage infra-zoom\"><div class=\"diagram-node\"><span data-icon=\"globe\"></span><b>AWS 글로벌 인프라</b><small>여러 국가와 지역에 분산</small></div><span class=\"diagram-arrow\">→</span><div class=\"diagram-node selected\"><span data-icon=\"region\"></span><b>서울 리전</b><small>ap-northeast-2</small></div><span class=\"diagram-arrow\">→</span><div class=\"diagram-node\"><span data-icon=\"zone\"></span><b>가용 영역</b><small>2a · 2b · 2c · 2d</small></div></div><div class=\"region-criteria\"><span><b>거리</b>사용자와 가까울수록 지연시간을 줄일 수 있습니다.</span><span><b>규정</b>데이터 위치와 산업 규정을 확인합니다.</span><span><b>서비스</b>리전별 지원 기능을 확인합니다.</span><span><b>비용</b>리전별 요금 차이를 확인합니다.</span></div>"
      },
      {
        "title": "AWS 서비스는 역할로 구분하면 이해하기 쉽습니다",
        "lead": "서비스 이름을 외우기보다 컴퓨팅·네트워크·스토리지·권한·관찰의 역할을 먼저 연결합니다.",
        "body": "<div class=\"grid3\"><article class=\"card\"><b class=\"metric\">VPC</b><h3>가상 네트워크</h3><p>주소 범위, 서브넷, 경로와 통신 경계를 구성합니다.</p></article><article class=\"card\"><b class=\"metric\">EC2</b><h3>가상 서버</h3><p>Linux 운영체제와 Nginx 웹 서버를 실행합니다.</p></article><article class=\"card\"><b class=\"metric\">S3</b><h3>객체 스토리지</h3><p>파일을 객체로 저장하고 정적 콘텐츠를 제공할 수 있습니다.</p></article><article class=\"card\"><b class=\"metric\">IAM</b><h3>접근 권한</h3><p>누가 어떤 AWS 작업을 할 수 있는지 통제합니다.</p></article><article class=\"card\"><b class=\"metric\">CloudWatch</b><h3>상태 관찰</h3><p>지표와 로그를 사용해 서비스 상태를 확인합니다.</p></article><article class=\"card\"><b class=\"metric\">Route 53</b><h3>이름 연결</h3><p>도메인 이름을 서비스의 주소와 연결합니다.</p></article></div>"
      },
      {
        "title": "웹 요청은 여러 계층을 순서대로 통과합니다",
        "lead": "웹페이지가 열리지 않을 때는 브라우저부터 서버 프로세스까지 계층별로 확인합니다.",
        "body": "<div class=\"flow\"><div><b>① 주소 입력</b><span>브라우저가 공개 IP 또는 도메인으로 요청</span></div><div><b>② 네트워크 경로</b><span>인터넷 게이트웨이와 라우팅 테이블 통과</span></div><div><b>③ 접근 허용</b><span>보안 그룹의 HTTP 규칙 확인</span></div><div><b>④ 서버 응답</b><span>Nginx가 HTML·CSS·이미지 반환</span></div></div><div class=\"table\"><table><thead><tr><th>계층</th><th>확인 대상</th><th>대표 증상</th></tr></thead><tbody><tr><td>주소</td><td>공개 IPv4, 도메인</td><td>잘못된 목적지</td></tr><tr><td>경로</td><td>IGW, 라우팅 테이블</td><td>연결 시간 초과</td></tr><tr><td>보안</td><td>보안 그룹</td><td>80번·22번 차단</td></tr><tr><td>서버</td><td>Nginx, 파일, 권한</td><td>403·404·기본 화면</td></tr></tbody></table></div>"
      },
      {
        "title": "보안 책임과 실습 환경을 확인합니다",
        "lead": "AWS가 데이터센터를 보호하더라도 계정, 운영체제, 애플리케이션과 데이터 설정은 사용자가 관리합니다.",
        "body": "<div class=\"compare\"><article><h3>AWS의 책임</h3><ul><li>데이터센터 시설과 물리 보안</li><li>전원·냉각·기반 네트워크</li><li>하이퍼바이저와 서비스 기반</li></ul></article><mark>+</mark><article><h3>사용자의 책임</h3><ul><li>IAM 계정과 권한</li><li>보안 그룹과 네트워크 설정</li><li>EC2 운영체제 패치</li><li>애플리케이션과 데이터 보호</li></ul></article></div><div class=\"check\"><label><input type=\"checkbox\">AWS 실습 계정에 로그인할 수 있습니다.</label><label><input type=\"checkbox\">현재 리전이 서울(ap-northeast-2)입니다.</label><label><input type=\"checkbox\">Kiro가 설치되어 있고 로그인할 수 있습니다.</label><label><input type=\"checkbox\">수업용 프로젝트 폴더를 영문 경로에 만들었습니다.</label><label><input type=\"checkbox\">비밀번호·액세스 키·개인정보를 코드나 AI 대화에 입력하지 않습니다.</label></div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 1,
    "id": "d1l2",
    "period": "2교시",
    "title": "Amazon VPC 네트워크 구성",
    "subtitle": "CIDR, 퍼블릭 서브넷, 인터넷 게이트웨이, 라우팅 테이블과 보안 그룹을 직접 연결합니다.",
    "plan": [
      "주소 체계 10분",
      "VPC 구성요소 15분",
      "통신 흐름 10분",
      "VPC 실습 12분",
      "검증 3분"
    ],
    "slides": [
      {
        "title": "VPC는 AWS 안에 만드는 전용 가상 네트워크입니다",
        "lead": "VPC 안에서 사용할 IP 주소 범위와 외부 통신 경로, 접근 규칙을 직접 결정합니다.",
        "body": "<div class=\"visual-stage vpc-map\"><div class=\"vpc-boundary\"><b>VPC · 10.10.0.0/16</b><div class=\"subnet-block\"><span data-icon=\"network\"></span><div><strong>퍼블릭 서브넷 · 10.10.1.0/24</strong><small>인터넷 게이트웨이로 나가는 기본 경로 보유</small></div><div class=\"mini-instance\"><span data-icon=\"server\"></span><b>EC2</b></div></div></div><div class=\"gateway-node\"><span data-icon=\"gateway\"></span><b>인터넷 게이트웨이</b><small>VPC와 인터넷의 연결 지점</small></div></div><div class=\"concept-key\"><span><b>주소 범위</b>VPC와 서브넷의 사설 IP 범위</span><span><b>경로</b>목적지별 트래픽 전달 대상</span><span><b>허용 규칙</b>포트와 출발지를 제한</span></div>"
      },
      {
        "title": "CIDR과 서브넷은 주소 공간을 계층적으로 나눕니다",
        "lead": "10.10.0.0/16은 VPC 전체 범위이고 10.10.1.0/24는 그 안의 더 작은 서브넷 범위입니다.",
        "body": "<div class=\"compare\"><article><h3>VPC · 10.10.0.0/16</h3><ul><li>전체 네트워크의 큰 주소 공간</li><li>약 65,536개의 IPv4 주소 범위</li><li>내부 서브넷은 이 범위 안에서 생성</li></ul></article><mark>⊃</mark><article><h3>서브넷 · 10.10.1.0/24</h3><ul><li>특정 가용 영역에 속하는 작은 범위</li><li>256개의 IPv4 주소 범위</li><li>AWS가 일부 주소를 예약</li></ul></article></div><div class=\"callout warn\"><b>주소 범위는 겹치지 않게 설계합니다.</b><br>다른 VPC나 사내 네트워크와 연결할 때 중복 CIDR은 라우팅 충돌의 원인이 됩니다.</div>"
      },
      {
        "title": "인터넷 통신에는 주소, 게이트웨이와 경로가 모두 필요합니다",
        "lead": "퍼블릭 서브넷은 인터넷 게이트웨이로 향하는 기본 경로가 있는 서브넷입니다.",
        "body": "<div class=\"visual-stage request-route\"><div class=\"diagram-node\"><span data-icon=\"browser\"></span><b>인터넷 사용자</b><small>HTTP 요청</small></div><span class=\"route-line\">진입</span><div class=\"diagram-node\"><span data-icon=\"gateway\"></span><b>인터넷 게이트웨이</b><small>VPC에 연결</small></div><span class=\"route-line\">경로</span><div class=\"diagram-node\"><span data-icon=\"route\"></span><b>라우팅 테이블</b><small>0.0.0.0/0 → IGW</small></div><span class=\"route-line\">검사</span><div class=\"diagram-node selected\"><span data-icon=\"shield\"></span><b>보안 그룹</b><small>TCP 80 허용</small></div></div><pre><code>목적지 10.10.0.0/16  → local\n목적지 0.0.0.0/0    → Internet Gateway</code><button class=\"copy\">복사</button></pre>"
      },
      {
        "title": "보안 그룹은 인스턴스에 적용되는 상태 기반 방화벽입니다",
        "lead": "필요한 포트와 출발지만 허용하고, 응답 트래픽은 상태를 추적하여 자동으로 허용합니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>용도</th><th>프로토콜·포트</th><th>출발지</th><th>설정 이유</th></tr></thead><tbody><tr><td>웹 접속</td><td>TCP 80</td><td>0.0.0.0/0</td><td>실습 웹페이지 공개</td></tr><tr><td>서버 관리</td><td>TCP 22</td><td>내 공인 IP/32</td><td>현재 네트워크만 SSH 허용</td></tr><tr><td>모든 포트</td><td>All traffic</td><td>0.0.0.0/0</td><td><strong>사용하지 않음</strong></td></tr></tbody></table></div><div class=\"callout danger\"><b>0.0.0.0/0은 모든 IPv4 주소를 의미합니다.</b><br>웹 공개를 위한 80번에는 사용할 수 있지만 SSH 22번은 현재 공인 IP로 제한합니다.</div>"
      },
      {
        "title": "실습: VPC와 퍼블릭 서브넷을 구성합니다",
        "lead": "각 단계가 끝날 때 이름, CIDR, 연결 상태를 확인하고 다음 단계로 이동합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>VPC 생성</h3><p>lab-vpc를 10.10.0.0/16으로 생성합니다.</p><span class=\"result\">상태 Available</span></div><div class=\"step\"><h3>퍼블릭 서브넷 생성</h3><p>lab-public-subnet을 ap-northeast-2a, 10.10.1.0/24로 생성합니다.</p><span class=\"result\">VPC와 AZ 확인</span></div><div class=\"step\"><h3>인터넷 게이트웨이 연결</h3><p>lab-igw를 생성하고 lab-vpc에 연결합니다.</p><span class=\"result\">상태 Attached</span></div><div class=\"step\"><h3>라우팅 테이블 구성</h3><p>lab-public-rt에 0.0.0.0/0 → lab-igw 경로를 추가합니다.</p><span class=\"result\">경로 Active</span></div><div class=\"step\"><h3>서브넷 연결</h3><p>lab-public-subnet을 lab-public-rt에 명시적으로 연결합니다.</p><span class=\"result\">연결 목록 확인</span></div><div class=\"step\"><h3>공개 IPv4 자동 할당</h3><p>서브넷 설정에서 퍼블릭 IPv4 자동 할당을 활성화합니다.</p><span class=\"result\">설정 저장 완료</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "VPC 구성 결과를 연결 관계로 검증합니다",
        "lead": "자원이 존재하는 것보다 올바른 VPC와 서브넷에 연결되었는지가 중요합니다.",
        "body": "<div class=\"check\"><label><input type=\"checkbox\">lab-vpc의 CIDR이 10.10.0.0/16입니다.</label><label><input type=\"checkbox\">lab-public-subnet의 CIDR이 10.10.1.0/24입니다.</label><label><input type=\"checkbox\">인터넷 게이트웨이 상태가 Attached입니다.</label><label><input type=\"checkbox\">라우팅 테이블에 0.0.0.0/0 → IGW 경로가 있습니다.</label><label><input type=\"checkbox\">퍼블릭 서브넷이 해당 라우팅 테이블에 연결되어 있습니다.</label><label><input type=\"checkbox\">퍼블릭 IPv4 자동 할당이 활성화되어 있습니다.</label></div><div class=\"callout\"><b>현재 완료 상태</b><br>아직 EC2를 만들지 않았으므로 인터넷 접속 결과가 나타나지 않는 것이 정상입니다.</div>",
        "kind": "summary"
      }
    ]
  },
  {
    "day": 1,
    "id": "d1l3",
    "period": "3교시",
    "title": "Amazon EC2 서버 생성과 접속",
    "subtitle": "Ubuntu Server 26.04 LTS 인스턴스를 퍼블릭 서브넷에 배치하고 안전하게 접속합니다.",
    "plan": [
      "EC2 구조 10분",
      "생성 설정 12분",
      "보안 그룹 8분",
      "EC2 실습 15분",
      "Ubuntu 확인 5분"
    ],
    "slides": [
      {
        "title": "EC2는 필요한 사양으로 생성하는 가상 서버입니다",
        "lead": "AMI, 인스턴스 유형, 네트워크, 스토리지와 보안 그룹을 조합하여 한 대의 서버를 만듭니다.",
        "body": "<div class=\"visual-stage service-route\"><div class=\"diagram-node\"><span data-icon=\"disk\"></span><b>AMI</b><small>운영체제 이미지</small></div><span class=\"diagram-arrow\">+</span><div class=\"diagram-node\"><span data-icon=\"server\"></span><b>인스턴스 유형</b><small>CPU·메모리 사양</small></div><span class=\"diagram-arrow\">+</span><div class=\"diagram-node selected\"><span data-icon=\"network\"></span><b>VPC 설정</b><small>서브넷·공개 IP·SG</small></div></div><div class=\"concept-key\"><span><b>AMI</b>Ubuntu Server 26.04 LTS</span><span><b>EBS</b>운영체제와 웹파일 저장</span><span><b>접속</b>Instance Connect 또는 SSH</span></div>"
      },
      {
        "title": "EC2는 앞에서 만든 퍼블릭 서브넷에 배치됩니다",
        "lead": "사설 IP는 VPC 내부 통신에, 공개 IPv4는 인터넷 접속에 사용합니다.",
        "body": "<div class=\"visual-stage vpc-map\"><div class=\"vpc-boundary\"><b>lab-vpc · 10.10.0.0/16</b><div class=\"subnet-block\"><span data-icon=\"network\"></span><div><strong>lab-public-subnet</strong><small>0.0.0.0/0 → IGW</small></div><div class=\"mini-instance selected\"><span data-icon=\"server\"></span><b>lab-web-ec2</b><small>사설 IP + 공개 IPv4</small></div></div></div><div class=\"gateway-node\"><span data-icon=\"globe\"></span><b>인터넷</b><small>80번 웹 접속</small></div></div><div class=\"callout\"><b>공개 IP 확인</b><br>인스턴스를 중지 후 다시 시작하면 자동 할당된 공개 IPv4가 변경될 수 있습니다.</div>"
      },
      {
        "title": "접속 방법에 따라 준비 조건이 달라집니다",
        "lead": "수업 환경에서 사용 가능한 방식을 선택하되 키 파일을 공유하거나 공개 저장소에 올리지 않습니다.",
        "body": "<div class=\"table\"><table><thead><tr><th>방식</th><th>필요 조건</th><th>특징</th></tr></thead><tbody><tr><td>EC2 Instance Connect</td><td>지원 AMI와 네트워크 경로</td><td>브라우저 접속으로 키 파일 부담이 적습니다.</td></tr><tr><td>SSH + 키 페어</td><td>개인 키 파일과 TCP 22</td><td>일반적인 서버 접속 방식입니다.</td></tr><tr><td>Session Manager</td><td>IAM 역할, SSM Agent와 연결</td><td>인바운드 SSH 없이 접속할 수 있습니다.</td></tr></tbody></table></div><pre><code>ssh -i lab-key.pem ubuntu@PUBLIC_IP</code><button class=\"copy\">복사</button></pre>"
      },
      {
        "title": "실습용 보안 그룹은 웹과 관리 접속만 허용합니다",
        "lead": "HTTP 80은 웹 사용자에게, SSH 22는 현재 관리자 네트워크에만 허용합니다.",
        "body": "<div class=\"visual-stage security-flow\"><div class=\"security-client\"><span data-icon=\"browser\"></span><b>웹 사용자</b><small>TCP 80 · 전체</small></div><div class=\"security-gate\"><span data-icon=\"shield\"></span><b>lab-web-sg</b><small>필요한 요청만 허용</small></div><div class=\"security-client admin\"><span data-icon=\"terminal\"></span><b>관리자 PC</b><small>TCP 22 · 내 IP/32</small></div><div class=\"security-server\"><span data-icon=\"server\"></span><b>EC2</b><small>허용 요청 수신</small></div></div><div class=\"callout danger\"><b>SSH 출발지에 0.0.0.0/0을 사용하지 않습니다.</b><br>네트워크가 변경되면 현재 공인 IP를 다시 확인하여 /32 규칙을 수정합니다.</div>"
      },
      {
        "title": "실습: Ubuntu Server 26.04 LTS EC2를 생성합니다",
        "lead": "요약 화면에서 이름, AMI, 네트워크, 공개 IP, 보안 그룹과 스토리지를 다시 확인합니다.",
        "body": "<div class=\"steps\"><div class=\"step\"><h3>이름과 이미지</h3><p>lab-web-ec2 이름을 지정하고 Canonical의 Ubuntu Server 26.04 LTS (HVM), SSD Volume Type을 선택합니다.</p><span class=\"result\">이름·AMI 확인</span></div><div class=\"step\"><h3>인스턴스 유형</h3><p>계정에서 허용되는 수업용 소형 유형을 선택합니다.</p><span class=\"result\">유형 확인</span></div><div class=\"step\"><h3>접속 방식</h3><p>Instance Connect 또는 개인별 키 페어를 준비합니다.</p><span class=\"result\">키 외부 공유 금지</span></div><div class=\"step\"><h3>네트워크</h3><p>lab-vpc, lab-public-subnet, 공개 IPv4 활성화를 선택합니다.</p><span class=\"result\">네트워크 일치</span></div><div class=\"step\"><h3>보안 그룹</h3><p>HTTP 80은 전체, SSH 22는 내 IP만 허용합니다.</p><span class=\"result\">lab-web-sg 확인</span></div><div class=\"step\"><h3>시작과 접속</h3><p>Running과 상태 검사 2/2를 확인한 뒤 접속합니다.</p><span class=\"result\">ubuntu 셸 표시</span></div></div>",
        "kind": "practice"
      },
      {
        "title": "Ubuntu 접속 후 DAY 1 상태를 확인합니다",
        "lead": "현재 사용자, 운영체제, 주소와 디스크 상태를 확인하고 다음 날 사용할 자원을 유지합니다.",
        "body": "<pre><code>whoami\nhostname\ncat /etc/os-release\nip addr show\ndf -h\nfree -h</code><button class=\"copy\">복사</button></pre><div class=\"check\"><label><input type=\"checkbox\">EC2가 lab-public-subnet에서 Running 상태입니다.</label><label><input type=\"checkbox\">EC2에 공개 IPv4 주소가 있습니다.</label><label><input type=\"checkbox\">HTTP 80은 전체에, SSH 22는 내 IP에만 열려 있습니다.</label><label><input type=\"checkbox\">Ubuntu Server 26.04 LTS에 접속했습니다.</label><label><input type=\"checkbox\">사설 IP와 공개 IPv4의 용도를 구분할 수 있습니다.</label><label><input type=\"checkbox\">개인 키 파일과 인증정보를 안전하게 보관했습니다.</label></div>",
        "kind": "summary"
      }
    ]
  }
];
