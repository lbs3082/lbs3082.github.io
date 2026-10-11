const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// The data files are local authored content; render their text as text, not HTML.
const displayText = value => escapeHTML(String(value));
const assetName = value => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(?:png|jpe?g|webp|gif)$/.test(String(value)) ? String(value) : '';
const externalURL = value => { try { const url=new URL(value); return url.protocol==='https:' && url.hostname==='github.com' && !url.username && !url.password ? escapeHTML(url.href) : '#'; } catch { return '#'; } };
const withheldImages = new Set(["image4.jpeg","image5.jpeg","image6.png","image7.png","image8.jpeg"]);
const imageNotice = '<p class="material-note">고객·기업 정보의 공개 범위를 확인하기 전까지 금융 화면 자료는 게시하지 않습니다. 분석과 구현 과정은 본문에서 확인할 수 있습니다.</p>';
const publicationNotes = {
 'rag-evaluation':'15%p의 개선 전후 점수, 평가 질문 수, 검색·답변 정확도의 정의는 확인이 필요합니다.',
 'rm-marketing':'집계 수치는 팀 분석 결과이며, 개인 기여는 대시보드와 API 연동으로 구분했습니다. 90%+ 정확도의 평가 대상과 10% 일정 단축의 계산 근거는 확인이 필요합니다.',
 'event-safety':'행사명·개최일·참여 인원과 발생률의 분모·개선 전후 값은 확인이 필요합니다.',
 'teaching-support':'수업명·수강 인원·측정 기간과 성공률의 정의는 확인이 필요합니다.',
 'graph-anomaly':'실험 지표이며 실제 서비스의 탐지 성능과 구분합니다. 정확한 일정과 세부 개인 담당 범위는 자료에 미기재되어 있습니다.',
 'customer-transition':'모델 검증 결과입니다. 정확한 일정과 운영·영업 성과는 자료에 미기재되어 있습니다.',
 'second-banking':'분석에 근거한 전략 제안입니다. 정확한 일정, 개인 담당 범위, 실행 효과와 개인 회고는 확인이 필요합니다.',
 'metro-demand':'수요 추정 실험입니다. 정확한 일정, 개인 담당 범위, MAE 단위·평가 분할 방식과 개인 회고는 확인이 필요합니다.',
 'smart-bed':'장치 테스트 결과입니다. 약 6개월이라는 기간 외 정확한 일정과 개인 회고는 확인이 필요하며, 온도 제어는 미완성입니다.',
 'stock-ai-app':'공개 코드에서 확인한 구현 구조만 소개합니다. 개인 담당 범위·개발 기간·실행 화면·평가 결과는 확인이 필요합니다.'
};
const publicationNote = p => '<aside class="publication-note"><h3>검증 범위</h3><p>'+displayText(publicationNotes[p.id]||'평가 기준과 검증 범위를 확인하고 있습니다.')+'</p></aside>';
const periodText = p => displayText(p.period) + (p.period==='2026.09.07 — 2026.10.30' && new Date() < new Date('2026-10-31T00:00:00Z') ? ' (진행 중 · 종료 예정)' : '');
const learningText = p => p.learning;

const projectURL = p => `project.html?id=${encodeURIComponent(p.id)}`;
const metricMarkup = (p,cls) => !p.metrics.length ? '' : `<dl class="${cls}" data-count="${p.metrics.length}">${p.metrics.map(([v,l])=>`<div><dt>${displayText(l)}</dt><dd>${displayText(v)}</dd></div>`).join('')}</dl>`;
const ragVisual = () => `<figure class="rag-visual"><span class="eyebrow">EVALUATION DESIGN</span><div class="rag-scale"><strong>300</strong><span>평가용 문서<br>3개 기업 × 100개</span></div><ol><li><span>01 / DOCUMENTS</span><p>같은 제목,<br>서로 다른 수치</p></li><li><span>02 / IDENTIFICATION</span><p>파일 번호와<br>저장 구조 통일</p></li><li><span>03 / EVALUATION</span><p>질문에 맞는<br>답변과 근거 대조</p></li></ol><figcaption>평가 과정 구성도 · 실제 서비스 화면 아님</figcaption></figure>`;
const renderVisual = (p,detail=false) => withheldImages.has(p.image) ? imageNotice : p.image && assetName(p.image) ? `<figure class="${detail?'project-cover':'work-image'}">${detail?`<button class="image-button" data-image="${assetName(p.image)}" data-caption="${escapeHTML(p.alt)}" aria-label="${escapeHTML(p.alt)} 확대 보기">`:`<a href="${projectURL(p)}" aria-label="${escapeHTML(p.title)} 상세 보기">`}<img src="assets/${assetName(p.image)}" alt="${escapeHTML(p.alt)}" width="1280" height="720" loading="lazy">${detail?'<span>원본 이미지 확대</span></button>':'</a>'}</figure>` : p.id==='rag-evaluation' ? ragVisual() : '';

const grid = document.querySelector('#work-grid');
if(grid){
  grid.innerHTML = selectedProjects.map((p,i)=>`<article class="work featured-case" data-case="${escapeHTML(p.id)}" data-categories="${displayText(p.filters.join(' '))}"><div class="work-kicker"><span>${displayText(p.category)}</span><span>${String(i+1).padStart(2,'0')}</span></div><div class="work-layout">${p.id==='rm-marketing'?'':renderVisual(p)}<div class="work-copy"><span class="case-organization">${displayText(p.organization)}</span><div class="work-title"><h3><a href="${projectURL(p)}">${displayText(p.title)}</a></h3></div><p class="work-summary">${displayText(p.summary)}</p><dl class="work-meta"><div><dt>역할</dt><dd>${displayText(p.role)}</dd></div><div><dt>기간</dt><dd>${periodText(p)}</dd></div></dl><a class="text-link" href="${projectURL(p)}">${p.id==='rag-evaluation'?'평가 설계와 기획 과정 읽기':'추천 기준과 구현 과정 읽기'}</a></div>${p.id==='rm-marketing'?renderVisual(p):''}</div>${metricMarkup(p,'focus-metrics')}${publicationNote(p)}<div class="focus-story">${p.focusSections.map(([title,text],j)=>`<section><span class="eyebrow">${String(j+1).padStart(2,'0')}</span><h4>${displayText(title)}</h4><p>${displayText(text)}</p></section>`).join('')}</div><p class="focus-note">${displayText(p.metricNote)}</p></article>`).join('');
  document.querySelector('#side-project-list').innerHTML = sideProjects.map((p,i)=>`<a class="side-project-row" href="${projectURL(p)}"><span class="side-index">${String(i+1).padStart(2,'0')}</span><strong>${displayText(p.title)}</strong><span class="side-role">${displayText(p.role)}</span><span class="side-duration">2주</span><span class="side-read">상세 보기</span></a>`).join('');
  document.querySelector('#github-work').innerHTML = `<div class="code-heading"><span class="eyebrow">PYTHON / STREAMLIT / API INTEGRATION</span><h3><a href="${projectURL(githubWork)}">${displayText(githubWork.title)}</a></h3><p>${displayText(githubWork.summary)}</p></div><dl class="code-features"><div><dt>검색과 데이터 조회</dt><dd>SQLite 종목 조회 · yfinance 연동 · Plotly 차트</dd></div><div><dt>AI 요약 흐름</dt><dd>뉴스 검색 결과와 영상 오디오를 Gemini에 연결</dd></div><div><dt>화면 상태 관리</dt><dd>선택 종목·뉴스 결과 저장 · 오류 안내</dd></div></dl><p class="code-note">공개 코드에서 확인한 구현입니다. 기간·담당 범위·실행 결과는 제공 자료에 미기재되어 있습니다.</p><div class="code-links"><a class="text-link" href="${projectURL(githubWork)}">구현 구조와 코드 읽기</a><a class="text-link" href="${externalURL(githubWork.repository)}" target="_blank" rel="noopener noreferrer">GitHub 저장소 보기</a></div>`;
  const bed=additionalDevelopment;
  document.querySelector('#additional-development').innerHTML = `<p>${displayText(bed.summary)}</p><dl class="work-meta"><div><dt>역할</dt><dd>${displayText(bed.role)}</dd></div><div><dt>기간</dt><dd>${periodText(bed)}</dd></div></dl><p class="supplement-result">${displayText(bed.result)} · 온도 제어 미완성</p><a class="text-link" href="${projectURL(bed)}">캡스톤 상세 읽기</a>`;
  document.querySelector('#experience-list').innerHTML = experienceStories.map((p,i)=>`<article class="experience-story"><div class="experience-title"><span class="eyebrow">${String(i+1).padStart(2,'0')} / ${displayText(p.organization)}</span><h3><a href="${projectURL(p)}">${displayText(p.title)}</a></h3><p>${displayText(p.role)}</p><span class="small-label">활동 기간 ${periodText(p)}</span></div><div class="experience-body"><p>${displayText(p.summary)}</p><div class="experience-action"><h4>바꾼 방식</h4><p>${p.id==='event-safety'?'선배 팀장을 추가 배치하고, 취약 지점 사전 확인·즉시 보고·신입 팀장의 질문 경로를 정리했습니다.':'공통 오류를 먼저 시연하고, 학생별 막힌 단계를 구분해 힌트·체크리스트·교재의 참고 지점을 연결했습니다.'}</p></div>${metricMarkup(p,'experience-metrics')}${publicationNote(p)}<a class="text-link" href="${projectURL(p)}">문제와 실행 과정 읽기</a></div></article>`).join('');
}

const content=document.querySelector('#project-content');
if(content){
  const p=projects.find(p=>p.id===new URLSearchParams(location.search).get('id'));
  if(!p){
    document.title='사례를 찾을 수 없습니다 — 이범수';
    content.innerHTML='<section class="not-found"><span class="eyebrow">CASE NOT FOUND</span><h1>사례를 찾을 수 없습니다.</h1><a class="text-link" href="index.html#works">대표 사례 보기</a></section>';
  }else{
    document.title=`${p.title} — 이범수`;
    document.querySelector('meta[name="description"]').content=p.summary;
    const isExperience=p.scope==='experience';
    const isGithub=p.scope==='github';
    const sequence=p.scope==='side'?sideProjects:isExperience?experienceStories:isGithub?[githubWork,additionalDevelopment,...selectedProjects]:p.scope==='additional'?[additionalDevelopment,...selectedProjects]:selectedProjects;
    const next=sequence[(sequence.indexOf(p)+1)%sequence.length];
    const returnURL=isExperience?'index.html#experience':'index.html#works';
    const row=(num,heading,korean,body)=>`<section class="case-row" id="${heading.toLowerCase().replace(' ','-')}"><div class="case-label"><span>${num}</span><h2>${displayText(korean)}<small>${displayText(heading)}</small></h2></div><div class="case-body">${body}</div></section>`;
    const label=p.scope==='side'?'SIDE PROJECT / 2 WEEKS':isExperience?'EXPERIENCE':isGithub?'CODE STUDY':p.scope==='additional'?'ADDITIONAL DEVELOPMENT':'SELECTED CASE';
    content.innerHTML=`<a class="back-link" href="${returnURL}">${isExperience?'경험 목록':'대표 사례'}으로 돌아가기</a><div class="project-kicker"><span class="eyebrow">${displayText(label)} / ${displayText(p.category)}</span><span>LEE BEOMSU</span></div><h1 class="project-title">${displayText(p.title)}</h1><p class="project-intro">${displayText(p.summary)}</p><dl class="project-meta"><div><dt>나의 역할</dt><dd>${displayText(p.role)}</dd></div><div><dt>기간</dt><dd>${periodText(p)}</dd></div><div><dt>기술·방법</dt><dd>${displayText(p.tags.join(' / '))}</dd></div></dl>${isGithub?`<div class="repository-links"><a class="text-link" href="${externalURL(p.repository)}" target="_blank" rel="noopener noreferrer">GitHub 저장소 보기</a><dl>${p.codeLinks.map(([label,file])=>`<div><dt>${displayText(label)}</dt><dd><a href="${externalURL(githubRevisionURL+'/'+file)}" target="_blank" rel="noopener noreferrer">${displayText(file.split('#')[0])}</a></dd></div>`).join('')}</dl><p>실행 화면은 확인이 필요합니다.</p></div>`:''}${renderVisual(p,true)}${metricMarkup(p,'metric-grid')}${publicationNote(p)}${p.context?`<section class="case-context" aria-label="3C 문제 맥락"><span class="eyebrow">3C / CONTEXT</span><dl>${p.context.map(([l,t])=>`<div><dt>${displayText(l)}</dt><dd>${displayText(t)}</dd></div>`).join('')}</dl></section>`:''}<nav class="case-nav" aria-label="사례 상세 목차"><a href="#background">배경</a><a href="#problem">문제 정의</a><a href="#my-role">나의 역할</a><a href="#approach">실행 과정</a><a href="#result">결과와 검증</a><a href="#learnings">배운 점</a></nav>${row('01','Background','배경',`<p>${displayText(p.background)}</p>`)}${row('02','Problem','문제 정의',`<p>${displayText(p.problem)}</p>`)}${row('03','My Role','나의 역할',p.contributions?`<dl class="contribution-list">${p.contributions.map(([l,t])=>`<div><dt>${displayText(l)}</dt><dd>${displayText(t)}</dd></div>`).join('')}</dl>`:`<p>${displayText(p.myRole)}</p>`)}${row('04','Approach','실행 과정',`<ol class="approach-list">${p.approach.map(t=>`<li>${displayText(t)}</li>`).join('')}</ol>`)}${row('05','Result','결과와 검증',`<p>${displayText(p.outcome)}</p><aside class="limitation"><h3>측정 범위와 보완할 정보</h3><p>${displayText(p.limit)}</p></aside>${p.figures.map(([file,caption])=>withheldImages.has(file)?imageNotice:`<figure class="detail-figure"><button class="image-button" data-image="${assetName(file)}" data-caption="${escapeHTML(caption)}" aria-label="프로젝트 결과 이미지 확대"><img src="assets/${assetName(file)}" alt="${escapeHTML(caption)}" loading="lazy" width="1280" height="720"><span>원본 이미지 확대</span></button><figcaption>${displayText(caption)}</figcaption></figure>`).join('')}`)}${row('06','Learnings','작업에서 얻은 관점',`<p>${displayText(learningText(p))}</p>`)}<a class="next-project" href="${projectURL(next)}"><span class="eyebrow">${isExperience?'NEXT EXPERIENCE':p.scope==='side'?'NEXT SIDE PROJECT':'NEXT CASE'}</span><strong>${displayText(next.title)}</strong><span class="next-read">다음 사례 읽기</span></a>`;
    const dialog=document.querySelector('#image-dialog');
    let opener;
    document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
      opener=button;dialog.querySelector('img').src=`assets/${assetName(button.dataset.image)}`;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();document.body.classList.add('dialog-open');
    }));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
  }
}
