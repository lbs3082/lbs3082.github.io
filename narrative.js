const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines = value => String(value).split('\n').map(escapeHTML).join('<br>');
const assetName = value => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(?:png|jpe?g|webp|gif)$/.test(String(value)) ? String(value) : '';
const withheldImages = new Set(['image4.jpeg','image5.jpeg','image6.png','image7.png','image8.jpeg']);
const projectURL = p => `project.html?id=${encodeURIComponent(p.id)}`;
const missingText = value => String(value || '').replace(/자료에 미기재(?:되어 있습니다|입니다)?/g,'[내용 추가 필요]').replace('현재 제공 자료에는 개인 회고가 기재되어 있지 않습니다.','[내용 추가 필요] 개인 회고');
const periodText = p => escapeHTML(missingText(p.period));
const stages = [['problem','Problem','발견한 문제'],['insight','Insight','문제를 읽은 관점'],['strategy','Strategy','선택한 방향'],['execution','Execution','직접 실행한 과정'],['result','Result','결과와 배운 점']];
const metrics = values => values.length ? `<dl class="result-metrics">${values.map(([value,label])=>`<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl>` : '';
const diagram = (number, compact=false) => `<figure class="process-figure rm-figure ${compact?'compact':''}"><div class="figure-heading"><span>ONE SHARED CRITERION</span><span>${escapeHTML(number)}</span></div><div class="rm-balance"><span>은행<small>수익성</small></span><strong>손익<br>분기점</strong><span>기업<small>이익</small></span></div><ol class="rm-flow"><li>계산 입력</li><li>금리 조절</li><li>추천 갱신</li></ol><figcaption>대시보드·API 구현 흐름을 정리한 도식</figcaption></figure>`;
const imageFigure = (file,caption) => !file || withheldImages.has(file) || !assetName(file) ? '' : `<figure class="project-image"><button class="image-button" data-image="${assetName(file)}" data-caption="${escapeHTML(caption)}" aria-label="${escapeHTML(caption)} 확대"><img src="assets/${assetName(file)}" alt="${escapeHTML(caption)}" loading="lazy"><span>이미지 확대 ↗</span></button><figcaption>${escapeHTML(caption)}</figcaption></figure>`;

const grid = document.querySelector('#work-grid');
if(grid){
  grid.innerHTML=selectedProjects.map(p=>{const c=caseStories[p.id];return `<article class="case-preview"><div class="preview-heading"><span class="eyebrow">PROJECT ${c.number}</span><span class="small-label">${escapeHTML(p.category)}</span></div><div class="preview-layout"><div class="preview-copy"><p class="project-name">${escapeHTML(p.title)}</p><h3><a href="${projectURL(p)}">${lines(c.headline)}</a></h3><p class="preview-summary">${escapeHTML(c.teaser)}</p><dl class="preview-meta"><div><dt>역할</dt><dd>${escapeHTML(p.role)}</dd></div><div><dt>기간</dt><dd>${periodText(p)}</dd></div></dl><a class="read-link" href="${projectURL(p)}">Case Study 읽기 <span aria-hidden="true">↗</span></a></div><a class="preview-visual" href="${projectURL(p)}" aria-label="${escapeHTML(p.title)} 사례 읽기">${diagram(c.number,true)}</a></div></article>`;}).join('');
  document.querySelector('#experience-list').innerHTML=experienceStories.map(p=>{const c=caseStories[p.id];return `<article class="experience-preview"><span class="eyebrow">EXPERIENCE ${c.number} / ${escapeHTML(p.organization)}</span><h3><a href="${projectURL(p)}">${lines(c.headline)}</a></h3><p>${escapeHTML(c.teaser)}</p><div class="experience-bottom"><span>${periodText(p)}</span><a class="read-link" href="${projectURL(p)}">문제 해결 과정 읽기 <span aria-hidden="true">↗</span></a></div></article>`;}).join('');
  const workRow = p => `<a class="archive-row" href="${projectURL(p)}"><span class="mono">${caseStories[p.id].number}</span><strong>${escapeHTML(p.title)}</strong><span>${p.scope==='side'?'2주':'Android'}</span><span class="archive-read">읽기 ↗</span></a>`;
  document.querySelector('#development-list').innerHTML=[additionalDevelopment].map(workRow).join('');
  document.querySelector('#side-project-list').innerHTML=sideProjects.map(workRow).join('');
}

const content = document.querySelector('#project-content');
if(content){
  const p=projects.find(p=>p.id===new URLSearchParams(location.search).get('id'));
  if(!p){
    document.title='사례를 찾을 수 없습니다 — 이범수';
    content.innerHTML='<section class="not-found wrap"><p class="eyebrow">CASE NOT FOUND</p><h1>사례를 찾을 수 없습니다.</h1><a class="read-link" href="index.html#works">대표 사례로 돌아가기 ↗</a></section>';
  }else{
    const c=caseStories[p.id];
    const scope=p.scope==='side'?'SIDE PROJECT':p.scope==='experience'?'EXPERIENCE':'PROJECT';
    const sequence=p.scope==='side'?sideProjects:p.scope==='experience'?experienceStories:p.scope==='additional'?[additionalDevelopment]:selectedProjects;
    const next=sequence[sequence.indexOf(p)+1];
    const returnsHome=!next;
    const offersHomeChoice=!returnsHome;
    const nextHref=returnsHome?'index.html':projectURL(next);
    const nextLabel=returnsHome?'BACK TO HOME':`NEXT CASE / ${caseStories[next.id].number}`;
    const nextHeading=returnsHome?'메인으로\n돌아가기':caseStories[next.id].headline;
    const chapter = (id,title,body) => {const i=stages.findIndex(s=>s[0]===id);return `<section class="chapter chapter-${id}" id="${id}" aria-labelledby="${id}-title"><div class="chapter-label"><span class="mono">0${i+1}</span><span>${stages[i][1]}</span><span class="chapter-down" aria-hidden="true">↓</span></div><h2 id="${id}-title">${lines(title)}</h2>${body}</section>`;};
    const role=p.myRole;
    const steps=c.steps || p.approach.map(text=>['',text]);
    const executionVisual=c.diagram?diagram(c.number):imageFigure(p.image,p.alt);
    const resultFigures=p.figures.map(([file,caption])=>imageFigure(file,caption)).join('');
    document.title=`${p.title} — Case Study ${c.number} — 이범수`;
    document.querySelector('meta[name="description"]').content=c.teaser||p.summary;
    content.innerHTML=`<header class="project-hero wrap"><a class="back-link" href="index.html#${p.scope==='experience'?'experience':'works'}">← 사례 목록</a><div class="project-kicker"><span class="eyebrow">${scope} ${c.number}</span><span>${escapeHTML(p.category)}</span></div><p class="project-name">${escapeHTML(p.title)}</p><h1>${lines(c.headline)}</h1><p class="project-deck">${escapeHTML(c.teaser||p.summary)}</p><dl class="project-meta"><div><dt>MY ROLE</dt><dd>${escapeHTML(missingText(p.role))}</dd></div><div><dt>PERIOD</dt><dd>${periodText(p)}</dd></div><div><dt>TOOLS & METHODS</dt><dd>${escapeHTML(p.tags.join(' · '))}</dd></div></dl><a class="start-reading" href="#problem">문제의 시작부터 읽기 <span aria-hidden="true">↓</span></a></header><div class="story-layout wrap"><aside class="story-rail"><nav aria-label="Case Study 읽기 목차"><p class="eyebrow">${scope} ${c.number}</p><ol>${stages.map(([id,label],i)=>`<li><a href="#${id}" ${i===0?'aria-current="location"':''}><span class="mono">0${i+1}</span>${label}</a></li>`).join('')}</ol><p class="rail-progress"><span id="reading-stage">01 / 05</span><span>READING</span></p><div class="rail-track" aria-hidden="true"><span id="reading-progress"></span></div></nav></aside><div class="story-chapters">${chapter('problem',c.problemTitle,`<p class="chapter-lead">${escapeHTML(missingText(p.problem))}</p><div class="context-note"><h3>프로젝트의 배경</h3><p>${escapeHTML(p.background)}</p></div>`)}${chapter('insight',c.insightTitle,`<p class="chapter-lead">${escapeHTML(c.insight)}</p>`)}${chapter('strategy',c.strategyTitle,`<p class="chapter-lead">${escapeHTML(c.strategy)}</p><div class="decision-shift"><div><span class="eyebrow">BEFORE / 출발점</span><p>${escapeHTML(c.before)}</p></div><span class="shift-arrow" aria-hidden="true">↓</span><div><span class="eyebrow">DECISION / 선택한 방향</span><p>${escapeHTML(c.after)}</p></div></div>`)}${chapter('execution',c.executionTitle,`<div class="ownership"><span class="eyebrow">MY CONTRIBUTION</span><p>${escapeHTML(missingText(role))}</p></div><ol class="execution-steps">${steps.map(([title,text],i)=>`<li><span class="step-number mono">${String(i+1).padStart(2,'0')}</span><div>${title?`<h3>${escapeHTML(title)}</h3>`:''}<p>${escapeHTML(text)}</p></div></li>`).join('')}</ol>${executionVisual}`)}${chapter('result',c.resultTitle,`${metrics(c.results||p.metrics)}${c.resultNote?`<p class="result-note">${escapeHTML(c.resultNote)}</p>`:''}<p class="chapter-lead">${escapeHTML(missingText(p.outcome))}</p>${resultFigures}<div class="takeaway"><span class="eyebrow">WHAT I LEARNED</span><p>${escapeHTML(missingText(p.learning))}</p></div><details class="verification"><summary>측정 범위와 보완할 정보 <span aria-hidden="true">+</span></summary><p>${escapeHTML(missingText(p.limit))}</p>${withheldImages.has(p.image)?'<p>금융 화면 이미지는 고객·기업 정보의 공개 범위를 확인한 뒤 추가할 예정입니다.</p>':''}</details>`)}</div></div><nav class="case-navigation wrap${offersHomeChoice?' has-home-choice':""}" aria-label="다음 사례 또는 메인 화면으로 이동"><a class="next-case" href="${nextHref}"><span class="eyebrow">${escapeHTML(nextLabel)}</span><strong>${lines(nextHeading)}</strong><span class="next-arrow" aria-hidden="true">↗</span></a>${offersHomeChoice?'<a class="case-home-choice read-link" href="index.html">메인으로 돌아가기 <span aria-hidden="true">↗</span></a>':""}</nav>`;
    const chapterElements=[...document.querySelectorAll('.chapter')];
    const railLinks=[...document.querySelectorAll('.story-rail a')];
    let scheduled=false;
    const updateReading=()=>{scheduled=false;const point=window.innerHeight*0.38;let active=0;chapterElements.forEach((el,i)=>{if(el.getBoundingClientRect().top<=point)active=i;});railLinks.forEach((a,i)=>i===active?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));document.querySelector('#reading-stage').textContent=`0${active+1} / 05`;const top=chapterElements[0].getBoundingClientRect().top;const bottom=chapterElements.at(-1).getBoundingClientRect().bottom;const progress=Math.max(0,Math.min(1,(point-top)/(bottom-top)));document.querySelector('#reading-progress').style.transform=`scaleX(${progress})`;};
    addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateReading);}},{passive:true});
    addEventListener('resize',updateReading);updateReading();
    const dialog=document.querySelector('#image-dialog');let opener;
    document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{opener=button;dialog.querySelector('img').src=`assets/${assetName(button.dataset.image)}`;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();document.body.classList.add('dialog-open');}));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
  }
}
