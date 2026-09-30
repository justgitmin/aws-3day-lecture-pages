(() => {
  const data = [...(window.COURSE || [])].sort((a,b)=>a.day-b.day || Number.parseInt(a.period,10)-Number.parseInt(b.period,10));
  const meta = window.COURSE_META || {};
  const nav = document.querySelector('#courseNav');
  const root = document.querySelector('#lessonRoot');
  const home = document.querySelector('#home');
  let activeLesson = null;
  let slides = [];
  let slideIndex = 0;

  const iconPaths = {
    server:'<rect x="9" y="10" width="46" height="18" rx="4"/><rect x="9" y="36" width="46" height="18" rx="4"/><circle cx="18" cy="19" r="2"/><circle cx="18" cy="45" r="2"/><path d="M27 19h19M27 45h19"/>',
    bucket:'<ellipse cx="32" cy="14" rx="21" ry="7"/><path d="M11 14v34c0 4 9 7 21 7s21-3 21-7V14M11 31c0 4 9 7 21 7s21-3 21-7"/>',
    database:'<ellipse cx="32" cy="13" rx="21" ry="7"/><path d="M11 13v38c0 4 9 7 21 7s21-3 21-7V13M11 26c0 4 9 7 21 7s21-3 21-7M11 39c0 4 9 7 21 7s21-3 21-7"/>',
    network:'<circle cx="13" cy="32" r="7"/><circle cx="51" cy="14" r="7"/><circle cx="51" cy="50" r="7"/><path d="M20 29l24-12M20 35l24 12M51 21v22"/>',
    shield:'<path d="M32 7l22 9v15c0 14-9 23-22 28C19 54 10 45 10 31V16z"/><path d="M23 32l6 6 13-14"/>',
    monitor:'<rect x="7" y="9" width="50" height="38" rx="5"/><path d="M16 31h8l5-10 7 19 5-9h8M23 56h18M32 47v9"/>',
    globe:'<circle cx="32" cy="32" r="25"/><path d="M7 32h50M32 7c9 8 14 16 14 25S41 49 32 57M32 7c-9 8-14 16-14 25s5 17 14 25"/>',
    region:'<path d="M32 58s18-18 18-32a18 18 0 10-36 0c0 14 18 32 18 32z"/><circle cx="32" cy="26" r="7"/>',
    zone:'<rect x="8" y="19" width="14" height="35" rx="2"/><rect x="25" y="9" width="14" height="45" rx="2"/><rect x="42" y="24" width="14" height="30" rx="2"/><path d="M13 27h4M13 35h4M30 18h4M30 27h4M30 36h4M47 32h4M47 40h4"/>',
    browser:'<rect x="6" y="10" width="52" height="44" rx="5"/><path d="M6 21h52M14 16h1M21 16h1M28 16h1"/>',
    play:'<circle cx="32" cy="32" r="25"/><path d="M27 21l17 11-17 11z"/>',
    disk:'<rect x="8" y="10" width="48" height="44" rx="6"/><circle cx="22" cy="32" r="7"/><path d="M35 25h12M35 33h12M35 41h8"/>',
    folder:'<path d="M7 18h20l6 7h24v27H7z"/><path d="M7 18v-6h18l5 6"/>',
    object:'<path d="M32 7l23 13v25L32 58 9 45V20zM9 20l23 13 23-13M32 33v25"/>',
    layers:'<path d="M32 8L7 21l25 13 25-13zM10 32l22 12 22-12M10 43l22 12 22-12"/>',
    palette:'<path d="M32 8a24 24 0 100 48h4c4 0 6-4 4-7-2-4 1-8 6-8h4c4 0 6-4 6-8A24 24 0 0032 8z"/><circle cx="20" cy="24" r="2"/><circle cx="31" cy="18" r="2"/><circle cx="43" cy="23" r="2"/>',
    code:'<path d="M24 18L10 32l14 14M40 18l14 14-14 14M36 12l-8 40"/>',
    key:'<circle cx="21" cy="28" r="10"/><path d="M29 35l21 21M40 45l6-6M46 51l6-6"/>',
    check:'<circle cx="32" cy="32" r="25"/><path d="M19 32l9 9 18-20"/>',
    arrows:'<path d="M10 20h39M42 13l8 7-8 7M54 44H15M22 37l-8 7 8 7"/>',
    file:'<path d="M15 7h24l12 12v38H15zM39 7v12h12M23 31h20M23 40h20M23 49h13"/>',
    gateway:'<path d="M8 32h48M32 8v48M15 25l-7 7 7 7M49 25l7 7-7 7M25 15l7-7 7 7M25 49l7 7 7-7"/>',
    route:'<circle cx="13" cy="13" r="6"/><circle cx="51" cy="13" r="6"/><circle cx="13" cy="51" r="6"/><circle cx="51" cy="51" r="6"/><path d="M19 13h18c8 0 14 6 14 14v18M13 19v26M19 51h26"/>',
    terminal:'<rect x="6" y="10" width="52" height="44" rx="5"/><path d="M15 23l8 8-8 8M29 40h17"/>',
    nginx:'<path d="M32 6l23 13v26L32 58 9 45V19z"/><path d="M22 43V21l20 22V21"/>',
    cloud:'<path d="M19 48h28a11 11 0 002-22 17 17 0 00-32-4A13 13 0 0019 48z"/>'
  };
  const metricIcons = {
    '저장':'bucket','재생':'play','연결':'network','IaaS':'server','PaaS':'layers','SaaS':'browser',
    'HTML':'browser','CSS':'palette','JS':'code','EC2':'server','S3':'bucket','RDS':'database',
    'VPC':'network','IAM':'key','CloudWatch':'monitor','Block':'disk','File':'folder','Object':'object',
    'GB·월':'bucket','요청':'arrows','전송':'network','200':'check','403':'shield','404':'file','500':'terminal',
    'Public':'network','Private':'shield','AMI':'disk','Type':'server','EBS':'disk','apt':'terminal','sudo':'key','-y':'check',
    '755':'folder','644':'file','nginx -t':'nginx','IPv4':'network','NAT':'gateway','Budget':'monitor','SSH':'terminal','Secret':'key',
    '즉시성':'cloud','탄력성':'arrows','사용량':'monitor'
  };
  const iconMarkup = name => `<svg viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.object}</svg>`;

  function hydrateVisuals(){
    document.querySelectorAll('[data-icon]').forEach(el=>{const name=el.dataset.icon;el.innerHTML=iconMarkup(name);el.classList.add('visual-icon')});
    document.querySelectorAll('.card .metric').forEach(metric=>{
      const name=metricIcons[metric.textContent.trim()];
      if(!name)return;
      const card=metric.closest('.card');
      card.classList.add('visual-card');
      metric.insertAdjacentHTML('afterend',`<span class="visual-icon card-icon" aria-hidden="true">${iconMarkup(name)}</span>`);
    });
  }

  const dayNames = {1:'BUILD',2:'DEVELOP',3:'OPERATE'};
  const availableDays = [...new Set(data.map(x=>x.day))];
  const firstLessonId = data[0]?.id;
  function renderHome(){
    const day=meta.day||availableDays[0]||1;
    const phase=meta.phase||dayNames[day];
    const outcomes=meta.outcomes||[];
    document.title=meta.documentTitle||`AWS 클라우드 웹서비스 구축 · DAY ${day}`;
    const description=document.querySelector('meta[name="description"]');
    if(description&&meta.description)description.content=meta.description;
    const brandNote=document.querySelector('.brand small');
    if(brandNote)brandNote.textContent=`조선대학교 · DAY ${day}`;
    const side=document.querySelector('.side-head');
    side.querySelector('small').textContent=`DAY ${day} · ${phase}`;
    side.querySelector('strong').textContent='3시간 · 3차시';
    side.querySelector('p').textContent=meta.sideCopy||'오늘 학습할 내용만 표시합니다.';
    home.innerHTML=`<div class="hero"><div><small>${meta.eyebrow||`DAY ${day} · ${phase}`}</small><h1>${meta.heading||'AWS 클라우드 웹서비스를'}<br><em>${meta.headingAccent||'직접 구축합니다.'}</em></h1><p>${meta.description||''}</p><button data-open="${firstLessonId||''}">DAY ${day} 시작하기</button></div><ol>${data.map((lesson,i)=>`<li><b>${lesson.period} · ${lesson.title}</b><span>${lesson.subtitle}</span></li>`).join('')}</ol></div><div class="stats"><div><b>DAY ${day}</b><span>${phase}</span></div><div><b>3차시</b><span>차시당 50분</span></div><div><b>${meta.statA||'AWS'}</b><span>${meta.statACopy||'클라우드 실습'}</span></div><div><b>${meta.statB||'결과물'}</b><span>${meta.statBCopy||'직접 검증'}</span></div></div><section class="home-block"><small>DAY ${day} OUTCOME</small><div><h2>오늘 수업을 마치면 할 수 있는 것</h2><div class="four">${outcomes.map((item,i)=>`<article><b>${String(i+1).padStart(2,'0')}</b><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div></div></section><section class="notice"><b>실습 공통 원칙</b><p>비밀번호·액세스 키·개인 키·개인정보는 Kiro, 웹페이지 또는 Git 저장소에 입력하지 않습니다. SSH는 현재 공인 IP로 제한하고, 과정 종료 후 사용하지 않는 AWS 자원을 삭제합니다.</p></section>`;
  }
  renderHome();
  availableDays.forEach(day => {
    const group = data.filter(x => x.day === day);
    nav.insertAdjacentHTML('beforeend', `<section class="daynav"><strong>DAY ${day}<em>${dayNames[day]}</em></strong>${group.map((l,i)=>`<button class="navlesson" data-open="${l.id}"><i>${i+1}</i><span>${l.period} · ${l.title}</span></button>`).join('')}</section>`);
  });

  data.forEach((lesson) => {
    const lessonIndex = data.indexOf(lesson) + 1;
    root.insertAdjacentHTML('beforeend', `<article class="lesson" id="${lesson.id}">
      <header class="lesson-hero" data-index="${String(lessonIndex).padStart(2,'0')}"><span class="lesson-tag">DAY ${lesson.day} · ${lesson.period} · ${dayNames[lesson.day]}</span><h1>${lesson.title}</h1><p>${lesson.subtitle}</p></header>
      <section class="plan"><b>50분 진행안</b><div>${lesson.plan.map(x=>`<span>${x}</span>`).join('')}</div></section>
      ${lesson.slides.map((s,i)=>`<section class="slide ${s.kind||''}" data-slide="${i}"><span class="slide-no">${lesson.period} · ${String(i+1).padStart(2,'0')}</span><h2>${s.title}</h2><p class="lead">${s.lead}</p>${s.body}</section>`).join('')}
    </article>`);
  });
  hydrateVisuals();

  function openLesson(id, updateHash=true) {
    const lesson = document.getElementById(id);
    if (!lesson) return;
    home.style.display='none';
    document.querySelectorAll('.lesson').forEach(x=>x.classList.toggle('active',x===lesson));
    document.querySelectorAll('.navlesson').forEach(x=>x.classList.toggle('active',x.dataset.open===id));
    activeLesson=lesson;
    slideIndex=0;
    slides=visibleSlides(lesson);
    if(updateHash) history.replaceState(null,'','#'+id);
    window.scrollTo({top:0,behavior:'smooth'});
    document.getElementById('sidebar').classList.remove('open');
  }
  function showHome(){document.body.classList.remove('presenting');document.getElementById('presentBar').hidden=true;document.querySelectorAll('.lesson').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.navlesson').forEach(x=>x.classList.remove('active'));activeLesson=null;slides=[];slideIndex=0;home.style.display='block';history.replaceState(null,'','#home');window.scrollTo(0,0)}
  function visibleSlides(lesson){
    const practiceOnly=document.body.classList.contains('practice-only');
    return [...lesson.querySelectorAll('.slide')].filter(x=>!practiceOnly||x.classList.contains('practice')||x.classList.contains('trouble')||x.classList.contains('summary'));
  }
  function firstPracticeLesson(){return [...document.querySelectorAll('.lesson')].find(x=>x.querySelector('.slide.practice,.slide.trouble'))}
  function refreshSlides(){if(!activeLesson)return;slides=visibleSlides(activeLesson);slideIndex=Math.min(slideIndex,Math.max(0,slides.length-1));showSlide()}
  function showSlide(){slides.forEach((s,i)=>s.classList.toggle('current',i===slideIndex));document.getElementById('counter').textContent=slides.length?`${slideIndex+1} / ${slides.length}`:'0 / 0';if(slides[slideIndex])slides[slideIndex].scrollTop=0}
  function togglePracticeMode(button){
    const enabled=!document.body.classList.contains('practice-only');
    document.body.classList.toggle('practice-only',enabled);
    button.setAttribute('aria-pressed',enabled);
    button.textContent=enabled?'전체 보기':'실습만';
    button.setAttribute('aria-label',enabled?'전체 강의 화면 보기':'실습 화면만 보기');
    button.title=enabled?'전체 강의 화면으로 돌아가기':'실습·오류 해결·점검 화면만 보기';
    if(enabled&&!activeLesson){
      const first=firstPracticeLesson();
      if(first)openLesson(first.id);
    }
    if(!activeLesson)return;
    slides=visibleSlides(activeLesson);
    slideIndex=0;
    if(document.body.classList.contains('presenting')){showSlide();return}
    document.querySelectorAll('.slide.current').forEach(x=>x.classList.remove('current'));
    if(enabled&&slides[0])requestAnimationFrame(()=>slides[0].scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function startPresent(){if(!activeLesson?.classList.contains('active')){const first=document.body.classList.contains('practice-only')?firstPracticeLesson():document.getElementById(firstLessonId);if(first)openLesson(first.id,false)}document.body.classList.add('presenting');document.getElementById('presentBar').hidden=false;refreshSlides();document.documentElement.requestFullscreen?.().catch(()=>{})}
  function exitPresent(){document.body.classList.remove('presenting');document.getElementById('presentBar').hidden=true;slides.forEach(x=>x.classList.remove('current'));document.exitFullscreen?.().catch(()=>{})}
  function move(delta){if(!document.body.classList.contains('presenting'))return;slideIndex=Math.max(0,Math.min(slides.length-1,slideIndex+delta));showSlide()}

  document.addEventListener('click', e => {
    const opener=e.target.closest('[data-open]'); if(opener){e.preventDefault();openLesson(opener.dataset.open);return}
    const copy=e.target.closest('.copy'); if(copy){const code=copy.parentElement.querySelector('code').innerText;navigator.clipboard?.writeText(code);copy.textContent='복사됨';setTimeout(()=>copy.textContent='복사',1200)}
  });
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showHome()});
  document.getElementById('navToggle').onclick=()=>{const s=document.getElementById('sidebar');s.classList.toggle('open');document.getElementById('navToggle').setAttribute('aria-expanded',s.classList.contains('open'))};
  document.getElementById('themeBtn').onclick=e=>{document.body.classList.toggle('dark');e.currentTarget.setAttribute('aria-pressed',document.body.classList.contains('dark'))};
  document.getElementById('practiceBtn').onclick=e=>togglePracticeMode(e.currentTarget);
  document.getElementById('presentBtn').onclick=startPresent;document.getElementById('exit').onclick=exitPresent;document.getElementById('prev').onclick=()=>move(-1);document.getElementById('next').onclick=()=>move(1);document.getElementById('printBtn').onclick=()=>window.print();
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();move(-1)}if(e.key==='Escape'&&document.body.classList.contains('presenting'))exitPresent()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&document.body.classList.contains('presenting'))exitPresent()});
  const initial=location.hash.slice(1);if(data.some(x=>x.id===initial))openLesson(initial,false);
})();
