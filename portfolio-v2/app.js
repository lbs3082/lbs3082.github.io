const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linebreaks = value => html(value).replace(/\n/g,'<br>');
const requestedMode = new URLSearchParams(location.search).get('view');
const modeKey = Object.hasOwn(readingModes, requestedMode) ? requestedMode : 'common';
const mode = readingModes[modeKey];
const order = [...mode.groups.flatMap(group=>group.ids), ...mode.other];
const serial = id => String(order.indexOf(id)+1).padStart(2,'0');
const query = modeKey === 'common' ? '' : `?view=${modeKey}`;
const homeURL = `./${query}`;
const caseURL = id => `case.html?id=${encodeURIComponent(id)}${modeKey==='common'?'':`&view=${modeKey}`}`;
const metricList = values => `<dl class="metrics">${values.map(([value,label])=>`<div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>`;

function visual(kind, compact=false) {
  if(kind==='rm') return `<figure class="work-visual visual-rm${compact?' compact':''}" aria-label="대시보드 구현 흐름 도식"><figcaption class="visual-caption">DASHBOARD / 구현 흐름 도식</figcaption><div class="balance"><div>은행<small>수익성</small></div><span class="balance-center">함께 볼<br><strong>판단 기준</strong></span><div>기업<small>이익</small></div></div><div class="balance-rule"><span></span><strong>손익분기점</strong><span></span></div><ol class="visual-flow"><li><span>01</span>계산 입력</li><li><span>02</span>금리 조절</li><li><span>03</span>추천 갱신</li></ol></figure>`;
  if(kind==='metro') return `<figure class="work-visual visual-metro${compact?' compact':''}" aria-label="역세권 공공데이터 분석 흐름 도식"><figcaption class="visual-caption">REGIONAL ANALYSIS / 분석 흐름 도식</figcaption><div class="metro-radius"><strong>500<span>m</span></strong><p>역세권을 기준으로<br>공공데이터 결합</p></div><ol class="metro-flow"><li><span>DATA</span><strong>12</strong><small>변수 정리</small></li><li><span>PERSONA</span><strong>5</strong><small>역세권 유형</small></li><li><span>MODEL</span><strong class="word">Stacking</strong><small>수요 추정</small></li></ol></figure>`;
  if(kind==='teaching') return `<figure class="work-visual visual-teaching"><figcaption class="visual-caption">DIAGNOSIS / 대응 흐름 도식</figcaption><p class="diagram-question">어디에서<br>막혔나요?</p><div class="diagnosis"><span>개념 이해</span><span>계산 과정</span></div><p class="diagnosis-next"><span aria-hidden="true">↓</span> 필요한 힌트와 참고 자료</p></figure>`;
  if(kind==='event') return `<figure class="work-visual visual-event"><figcaption class="visual-caption">OPERATIONS / 역할과 보고 도식</figcaption><div class="role-map"><div><strong>신입생 팀장</strong><span>팀 운영</span></div><span class="role-connection">질문 ↕ 도움</span><div><strong>2학년 멘토</strong><span>경험 공유 · 현장 확인</span></div><span class="role-connection">즉시 보고 ↓</span><div><strong>학생회장</strong><span>운영 총괄</span></div></div></figure>`;
  if(kind==='transition') return `<figure class="work-visual visual-transition"><figcaption class="visual-caption">TWO-STAGE MODEL / 팀의 예측 흐름 도식</figcaption><p class="transition-baseline">유형 유지 고객 <strong>89<span>%</span></strong></p><ol class="transition-flow"><li><span>01 / 변화 여부</span><strong>F1 · 재현율</strong></li><li><span>02 / 변화 방향</span><strong>방향 예측</strong></li></ol><p class="transition-note">전체 정확도보다, 찾아야 할 고객에 맞는 지표로.</p></figure>`;
  return '';
}

function preview(id, kind) {
  const p=portfolio[id];
  if(kind==='analysis') return `<article class="project-preview"><div class="preview-main"><div class="preview-copy"><p class="eyebrow">CASE ${serial(id)} / ${html(p.type)}</p><p class="project-title">${html(p.title)}</p><h3><a href="${caseURL(id)}">${linebreaks(p.short)}</a></h3><p class="preview-deck">${html(p.deck)}</p><dl class="preview-meta"><div><dt>ROLE</dt><dd>${html(p.role)}</dd></div><div><dt>PERIOD</dt><dd>${html(p.period)}</dd></div></dl><a class="text-link" href="${caseURL(id)}">문제와 판단 읽기 <span aria-hidden="true">↗</span></a></div><a class="visual-link" href="${caseURL(id)}" aria-label="${html(p.title)} 상세 읽기">${visual(p.visual,true)}</a></div><div class="preview-result"><span class="eyebrow">확인한 결과</span><p>${html(p.outcome)}</p></div></article>`;
  return `<article class="field-preview ${id==='event-safety'?'field-event':''}"><p class="eyebrow">CASE ${serial(id)} / ${html(p.type)}</p><p class="project-title">${html(p.title)}</p><h3><a href="${caseURL(id)}">${linebreaks(p.short)}</a></h3><p>${html(p.deck)}</p><div class="field-observation">${id==='teaching-support'?'<strong>60 <span>/</span> 80<small>%</small></strong><span>전년도 / 2025년 제출률</span>':'<strong>3<small>건</small><span>을 다시 보고</span></strong><span>남아 있던 음주 규칙 문제 확인</span>'}</div><p class="field-caption">${html(p.period)} · ${html(p.organization)}</p><a class="text-link" href="${caseURL(id)}">과정 읽기 <span aria-hidden="true">↗</span></a></article>`;
}

const workSections=document.querySelector('#work-sections');
if(workSections){
  if(modeKey==='fdo'){
    document.querySelector('#reading-order').remove();
    document.querySelector('.wordmark').href=homeURL;
  }else document.querySelector('#reading-order').innerHTML=`<span class="eyebrow">사례를 읽는 순서</span><nav aria-label="사례를 읽는 순서">${Object.entries(readingModes).map(([key,value])=>`<a href="./${key==='common'?'':`?view=${key}`}#work" ${modeKey===key?'aria-current="page"':''}>${html(value.name)}</a>`).join('')}</nav>`;
  workSections.innerHTML=mode.groups.map((group,index)=>`<section class="work-group ${group.kind}" aria-labelledby="group-${group.kind}"><div class="section-head"><span class="eyebrow">0${index+1} / ${group.kind==='analysis'?'DATA & DECISIONS':'FIELD & ACTION'}</span><h2 id="group-${group.kind}">${group.kind==='analysis'?'문제를 나누고,<br>근거로 확인한 작업.':'현장에서 원인을 찾고<br>바꾼 경험.'}</h2><p>${group.kind==='analysis'?'어떤 기준을 세웠고,<br>어디까지 확인했는지.':'사람의 상황을 살피고,<br>운영의 흐름을 바꿨습니다.'}</p></div><div class="${group.kind==='field'?'field-grid':'analysis-list'}">${group.ids.map(id=>preview(id,group.kind)).join('')}</div></section>`).join('');
  document.querySelector('#other-list').innerHTML=mode.other.map(id=>{const p=portfolio[id];return `<a class="other-row" href="${caseURL(id)}"><span class="mono">${serial(id)}</span><div><h3>${html(p.title)}</h3><p>${html(p.outcome)}</p></div><span class="other-period">${p.period==='2주'?'2주':'활동 경험'}</span><span class="other-arrow" aria-hidden="true">↗</span></a>`;}).join('');
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
    const sections=p.sections.map((section,i)=>`<section class="chapter" id="${section.id}" aria-labelledby="title-${section.id}"><div class="chapter-kicker"><span class="mono">${String(i+1).padStart(2,'0')}</span><span>${html(section.label)}</span></div><h2 id="title-${section.id}">${linebreaks(section.title)}</h2>${section.ownership?`<aside class="ownership"><h3 class="eyebrow">MY CONTRIBUTION</h3><p>${html(section.ownership)}</p></aside>`:''}${(!section.groups?(section.paragraphs||[]):[]).map(text=>`<p class="chapter-copy">${html(text)}</p>`).join('')}${section.visual?visual(section.visual):''}${section.steps?`<ol class="steps">${section.steps.map(([title,text],step)=>`<li><span class="mono">${String(step+1).padStart(2,'0')}</span><div><h3>${html(title)}</h3><p>${html(text)}</p></div></li>`).join('')}</ol>`:''}${section.groups?`<div class="outcomes">${section.groups.map(group=>`<section class="outcome-group"><h3>${html(group.label)}</h3><div>${group.metrics?metricList(group.metrics):''}<p>${html(group.text)}</p></div></section>`).join('')}</div>`:''}${section.incidents?`<ol class="incidents" aria-label="운영 후 다시 살핀 세 사례">${section.incidents.map(([title,text],n)=>`<li><span class="mono">0${n+1}</span><div><h3>${html(title)}</h3><p>${html(text)}</p></div></li>`).join('')}</ol>`:''}${(section.groups?(section.paragraphs||[]):[]).map(text=>`<p class="chapter-copy">${html(text)}</p>`).join('')}${section.image?`<figure class="evidence-image"><a href="assets/${section.image.file}" target="_blank" rel="noopener noreferrer" aria-label="${html(section.image.alt)} 원본 보기"><img src="assets/${section.image.file}" alt="${html(section.image.alt)}" width="900" height="507" loading="lazy"></a><figcaption>${html(section.image.caption)}</figcaption></figure>`:''}${section.reflection?`<aside class="reflection"><h3>${html(section.reflection.title)}</h3><p>${html(section.reflection.text)}</p></aside>`:''}</section>`).join('');
    caseContent.innerHTML=`<header class="case-hero shell"><a class="back-link" href="${homeURL}#work">← 모든 작업</a><div class="case-eyebrow"><span class="eyebrow">CASE ${serial(id)}</span><span class="eyebrow">${html(p.type)}</span></div><p class="case-name">${html(p.title)}</p><h1>${linebreaks(p.headline)}</h1><p class="case-deck">${html(p.deck)}</p><dl class="case-meta"><div><dt>ROLE</dt><dd>${html(p.role)}</dd></div><div><dt>PERIOD</dt><dd>${html(p.period)}</dd></div><div><dt>CONTEXT</dt><dd>${html(p.organization)}</dd></div><div><dt>TOOLS & METHODS</dt><dd>${html(p.tools.join(' · '))}</dd></div></dl></header><div class="case-layout shell"><aside class="chapter-nav"><nav aria-label="작업 읽기 목차"><span class="eyebrow">IN THIS STORY</span><ol>${p.sections.map((s,i)=>`<li><a href="#${s.id}" ${i===0?'aria-current="location"':''}><span class="mono">${String(i+1).padStart(2,'0')}</span>${html(s.label)}</a></li>`).join('')}</ol></nav></aside><div class="chapters">${sections}${scopeBlock}</div></div><nav class="case-pagination shell" aria-label="다음 작업 또는 메인으로 이동"><a class="pagination-home" href="${homeURL}#work"><span class="eyebrow">ALL WORK</span><strong>메인으로 돌아가기</strong><span aria-hidden="true">↗</span></a>${next?`<a class="pagination-next" href="${caseURL(next)}"><span class="eyebrow">NEXT / CASE ${serial(next)}</span><strong>${html(portfolio[next].title)}</strong><span aria-hidden="true">→</span></a>`:''}</nav>`;
    if('IntersectionObserver' in window){
      const links=[...document.querySelectorAll('.chapter-nav a')];
      const observer=new IntersectionObserver(entries=>{entries.filter(entry=>entry.isIntersecting).forEach(entry=>{links.forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -65% 0px'});
      document.querySelectorAll('.chapter').forEach(chapter=>observer.observe(chapter));
    }
  }
}
