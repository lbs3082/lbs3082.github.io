const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linebreaks = value => html(value).replace(/\n/g,'<br>');
const mainIds = ['rm-marketing'];
const sideIds = ['graph-anomaly','metro-demand','second-banking','event-safety'];
const order = [...mainIds, ...sideIds];
const serial = id => id==='rag-eval' ? '01' : order.includes(id) ? String(order.indexOf(id)+2).padStart(2,'0') : '';
const homeURL = './';
const caseURL = id => `case.html?id=${encodeURIComponent(id)}`;
const metricList = values => `<dl class="metrics">${values.map(([value,label])=>`<div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>`;

function visual(kind, compact=false) {
  if(kind==='rm') return `<figure class="work-visual visual-rm${compact?' compact':''}" aria-label="대시보드 구현 흐름 도식"><figcaption class="visual-caption">DASHBOARD / 구현 흐름 도식</figcaption><div class="balance"><div>은행<small>수익성</small></div><span class="balance-center">함께 볼<br><strong>판단 기준</strong></span><div>기업<small>이익</small></div></div><div class="balance-rule"><span></span><strong>손익분기점</strong><span></span></div><ol class="visual-flow"><li><span>01</span>계산 입력</li><li><span>02</span>금리 조절</li><li><span>03</span>추천 갱신</li></ol></figure>`;
  if(kind==='metro') return `<figure class="work-visual visual-metro${compact?' compact':''}" aria-label="역세권 공공데이터 분석 흐름 도식"><figcaption class="visual-caption">REGIONAL ANALYSIS / 분석 흐름 도식</figcaption><div class="metro-radius"><strong>500<span>m</span></strong><p>역세권을 기준으로<br>공공데이터 결합</p></div><ol class="metro-flow"><li><span>DATA</span><strong>12</strong><small>변수 정리</small></li><li><span>PERSONA</span><strong>5</strong><small>역세권 유형</small></li><li><span>MODEL</span><strong class="word">Stacking</strong><small>수요 추정</small></li></ol></figure>`;
  if(kind==='teaching') return `<figure class="work-visual visual-teaching"><figcaption class="visual-caption">DIAGNOSIS / 대응 흐름 도식</figcaption><p class="diagram-question">어디에서<br>막혔나요?</p><div class="diagnosis"><span>개념 이해</span><span>문자열 · 입력 순서</span></div><p class="diagnosis-next"><span aria-hidden="true">↓</span> 필요한 힌트와 참고 자료</p></figure>`;
  if(kind==='event') return `<figure class="work-visual visual-event"><figcaption class="visual-caption">OPERATIONS / 역할과 보고 도식</figcaption><div class="role-map"><div><strong>신입생 팀장</strong><span>팀 운영</span></div><span class="role-connection">질문 ↕ 도움</span><div><strong>2학년 멘토</strong><span>경험 공유 · 현장 확인</span></div><span class="role-connection">즉시 보고 ↓</span><div><strong>학생회장</strong><span>운영 총괄</span></div></div></figure>`;
  if(kind==='transition') return `<figure class="work-visual visual-transition"><figcaption class="visual-caption">TWO-STAGE MODEL / 팀의 예측 흐름 도식</figcaption><p class="transition-baseline">유형 유지 고객 <strong>89<span>%</span></strong></p><ol class="transition-flow"><li><span>01 / 변화 여부</span><strong>F1 · 재현율</strong></li><li><span>02 / 변화 방향</span><strong>방향 예측</strong></li></ol><p class="transition-note">전체 정확도보다, 찾아야 할 고객에 맞는 지표로.</p></figure>`;
  return '';
}

const tags={'rm-marketing':'LLM · 대시보드','graph-anomaly':'그래프 ML','metro-demand':'ML · 앙상블','second-banking':'데이터 분석'};
const ownerOf=p=>(p.sections.find(section=>section.ownership)||{}).ownership||'';

function card(id) {
  const p=portfolio[id];
  return `<article class="project-card"><div class="card-tags"><span class="mono">${serial(id)}</span><span class="tag">${html(tags[id]||'AI')}</span><span class="card-period">${html(p.period)} · ${html(p.organization)}</span></div><h3><a href="${caseURL(id)}">${html(p.title)}</a></h3><p class="card-deck">${html(p.deck)}</p><dl class="card-meta"><div><dt>내 역할</dt><dd>${html(p.role)}</dd></div><div><dt>도구</dt><dd>${html(p.tools.join(' · '))}</dd></div></dl><div class="card-result"><span>확인한 결과</span><p>${html(p.outcome)}</p></div><a class="card-link" href="${caseURL(id)}">문제와 판단 과정 보기 <span aria-hidden="true">→</span></a></article>`;
}

const ragCard=`<article class="project-card"><div class="card-tags"><span class="mono">01</span><span class="tag">RAG · LLM 평가</span><span class="card-period">2026.09.07 — 10.30 · 미래내일 일경험</span></div><h3><a href="case.html?id=rag-eval">아이케미스트 개발 2팀 RAG 평가·시각화</a></h3><p class="card-deck">미래내일 일경험(프로젝트형) 필살기 메이킹 4기에서 팀장으로 PM 소통과 RAG 평가 설계를 맡았습니다. 기업 5곳·가상 문서 50개로 평가했을 때 정답률이 100%가 나와 300개로 늘렸고, PM이 아직 적다고 해 기업 10곳·1,000개로 평가 문서를 다시 만들었습니다. 이후 답변 속 수치를 표·그래프로 보여 주는 기능을 PM에게 제안해 화면을 설계했고, 구현은 팀원이 맡았으며 저는 결과를 검토했습니다.</p><dl class="card-meta"><div><dt>내 역할</dt><dd>팀장 · PM 소통 · RAG 평가 설계 · 시각화 기능 제안·화면 설계</dd></div></dl><div class="card-result"><span>확인한 결과</span><p>문서 1,000개 기준, Hit Rate(Hit@5) 지표로 평가 → 최종용 질문 답변 정답률 약 94%(목표 80%)</p></div><a class="card-link" href="case.html?id=rag-eval">문제와 판단 과정 보기 <span aria-hidden="true">→</span></a></article>`;

function sideCard(id) {
  const p=portfolio[id];
  return `<li><a class="side-card" href="${caseURL(id)}"><span class="side-top"><span class="mono">${serial(id)}</span><span class="side-badge">${html(p.period)}</span></span><strong>${html(p.title)}</strong><span class="side-role">${html(p.role)}</span><span class="side-result">${html(p.outcome)}</span><span class="side-more">자세히 <span aria-hidden="true">→</span></span></a></li>`;
}

const grid=document.querySelector('#project-grid');
if(grid){
  grid.innerHTML=ragCard+mainIds.map(card).join('');
  document.querySelector('#side-list').innerHTML=sideIds.map(sideCard).join('');
}

const caseContent=document.querySelector('#case-content');
if(caseContent){
  const id=new URLSearchParams(location.search).get('id');
  const p=Object.hasOwn(portfolio,id)?portfolio[id]:null;
  document.querySelector('.home-link').href=homeURL;
  document.querySelector('.work-link').href=`${homeURL}#work`;
  document.querySelector('.contact-link').href=`${homeURL}#contact`;
  if(!p){
    document.title='작업을 찾을 수 없습니다 — 이범수';
    caseContent.innerHTML=`<section class="not-found shell"><p class="eyebrow">WORK NOT FOUND</p><h1>작업을 찾을 수 없습니다.</h1><a class="text-link" href="${homeURL}#work">모든 작업으로 돌아가기 ↗</a></section>`;
  }else{
    document.title=`${p.title} — 이범수`;
    document.querySelector('meta[name="description"]').content=p.deck;
    document.body.classList.add('case-page',`case-${id}`);
    const next=order[order.indexOf(id)+1];
    const scopeNotes=p.scopeNotes||[...new Set(p.sections.flatMap(section=>section.limits||[]))];
    const scopeBlock=scopeNotes.length?`<aside class="limits case-limits" aria-labelledby="scope-title"><h2 id="scope-title">확인한 범위와 한계</h2>${scopeNotes.map(text=>`<p>${html(text)}</p>`).join('')}</aside>`:'';
    const sections=p.sections.map((section,i)=>`<section class="chapter" id="${section.id}" aria-labelledby="title-${section.id}"><div class="chapter-kicker"><span class="mono">${String(i+1).padStart(2,'0')}</span><span>${html(section.label)}</span></div><h2 id="title-${section.id}">${linebreaks(section.title)}</h2>${(!section.groups?(section.paragraphs||[]):[]).map(text=>`<p class="chapter-copy">${html(text)}</p>`).join('')}${section.visual?visual(section.visual):''}${section.steps?`<ol class="steps">${section.steps.map(([title,text],step)=>`<li><span class="mono">${String(step+1).padStart(2,'0')}</span><div><h3>${html(title)}</h3><p>${html(text)}</p></div></li>`).join('')}</ol>`:''}${section.groups?`<div class="outcomes">${section.groups.map(group=>`<section class="outcome-group"><h3>${html(group.label)}</h3><div>${group.metrics?metricList(group.metrics):''}<p>${html(group.text)}</p></div></section>`).join('')}</div>`:''}${section.incidents?`<ol class="incidents" aria-label="운영 후 다시 살핀 세 사례">${section.incidents.map(([title,text],n)=>`<li><span class="mono">0${n+1}</span><div><h3>${html(title)}</h3><p>${html(text)}</p></div></li>`).join('')}</ol>`:''}${(section.groups?(section.paragraphs||[]):[]).map(text=>`<p class="chapter-copy">${html(text)}</p>`).join('')}${section.image?`<figure class="evidence-image"><a href="assets/${section.image.file}" target="_blank" rel="noopener noreferrer" aria-label="${html(section.image.alt)} 원본 보기"><img src="assets/${section.image.file}" alt="${html(section.image.alt)}" width="900" height="507" loading="lazy"></a><figcaption>${html(section.image.caption)}</figcaption></figure>`:''}${section.reflection?`<aside class="reflection"><h3>${html(section.reflection.title)}</h3><p>${html(section.reflection.text)}</p></aside>`:''}</section>`).join('');
    caseContent.innerHTML=`<header class="case-hero shell"><a class="back-link" href="${homeURL}#work">← 모든 프로젝트</a><div class="case-eyebrow"><span class="eyebrow">CASE${serial(id)?' '+serial(id):''}</span><span class="eyebrow">${html(p.type)}</span></div><p class="case-name">${html(p.title)}</p><h1>${linebreaks(p.headline)}</h1><p class="case-deck">${html(p.deck)}</p><section class="case-summary" aria-labelledby="summary-title"><h2 id="summary-title">30초 요약</h2><dl><div class="summary-result"><dt>확인한 결과</dt><dd>${html(p.outcome)}</dd></div><div class="summary-own"><dt>내가 맡은 일</dt><dd>${html(ownerOf(p))}</dd></div><div><dt>역할</dt><dd>${html(p.role)}</dd></div><div><dt>기간 · 맥락</dt><dd>${html(p.period)} · ${html(p.organization)}</dd></div><div><dt>도구 · 방법</dt><dd>${html(p.tools.join(' · '))}</dd></div></dl></section></header><div class="case-layout shell"><aside class="chapter-nav"><nav aria-label="작업 읽기 목차"><span class="eyebrow">IN THIS STORY</span><ol>${p.sections.map((s,i)=>`<li><a href="#${s.id}" ${i===0?'aria-current="location"':''}><span class="mono">${String(i+1).padStart(2,'0')}</span>${html(s.label)}</a></li>`).join('')}</ol></nav></aside><div class="chapters">${sections}${scopeBlock}</div></div><nav class="case-pagination shell" aria-label="다음 작업 또는 메인으로 이동"><a class="pagination-home" href="${homeURL}#work"><span class="eyebrow">ALL WORK</span><strong>메인으로 돌아가기</strong><span aria-hidden="true">↗</span></a>${next?`<a class="pagination-next" href="${caseURL(next)}"><span class="eyebrow">NEXT / CASE ${serial(next)}</span><strong>${html(portfolio[next].title)}</strong><span aria-hidden="true">→</span></a>`:''}</nav>`;
    if('IntersectionObserver' in window){
      const links=[...document.querySelectorAll('.chapter-nav a')];
      const observer=new IntersectionObserver(entries=>{entries.filter(entry=>entry.isIntersecting).forEach(entry=>{links.forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -65% 0px'});
      document.querySelectorAll('.chapter').forEach(chapter=>observer.observe(chapter));
    }
  }
}

const dashFrame=document.querySelector('.dash-frame');
if(dashFrame){
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==dashFrame.contentWindow) return;
    if(event.data&&event.data.type==='dash-height'&&Number.isFinite(event.data.height)) dashFrame.style.height=`${Math.ceil(event.data.height)}px`;
  });
}
