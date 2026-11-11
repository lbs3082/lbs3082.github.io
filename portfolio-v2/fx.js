// 화면 움직임: Anime.js(로고·제목·배경 점), Motion(버튼·메뉴·카드).
// 라이브러리를 불러오지 못하거나 '동작 줄이기' 설정이면 아무것도 하지 않고, 내용은 그대로 보입니다.
// 주소에 ?fx=on 을 붙이면 '동작 줄이기' 설정과 상관없이 움직임을 켭니다(확인용).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && new URLSearchParams(location.search).get('fx') !== 'on';
const ANIME = 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm';
const MOTION = 'https://cdn.jsdelivr.net/npm/motion@14.12.0/+esm';

// 글자를 한 글자씩 span으로 나눈다. 화면 낭독기는 원문을 그대로 읽는다.
function splitChars(el) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = '1';
  const chars = [];
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const word = document.createElement('span');
          word.className = 'fx-word';
          [...part].forEach(ch => {
            const s = document.createElement('span');
            s.className = 'fx-char';
            s.textContent = ch;
            word.append(s);
            chars.push(s);
          });
          frag.append(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        if (child.children.length === 0 && child.textContent.length <= 2) {
          child.classList.add('fx-char');
          chars.push(child);
        } else walk(child);
      }
    });
  };
  const label = [...el.childNodes].map(n => n.nodeName === 'BR' ? ' ' : n.textContent).join('').replace(/\s+/g, ' ').trim();
  walk(el);
  if (!el.hasAttribute('aria-label')) {
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.append(...el.childNodes);
    const sr = document.createElement('span');
    sr.className = 'fx-sr';
    sr.textContent = label;
    el.append(sr, visual);
  }
  return chars;
}

async function animeFx() {
  const { animate, stagger, utils } = await import(ANIME);

  // 1) 로고 조각이 흩어졌다 모인다. 마우스를 올리면 다시 한 번.
  const mark = document.querySelector('.wordmark');
  const pieces = splitChars(mark);
  if (pieces.length) {
    const gather = () => animate(pieces, {
      x: [{ to: () => utils.random(-46, 46), duration: 260, ease: 'outQuad' }, { to: 0, duration: 720, ease: 'outElastic(1, .55)' }],
      y: [{ to: () => utils.random(-26, 26), duration: 260, ease: 'outQuad' }, { to: 0, duration: 720, ease: 'outElastic(1, .55)' }],
      rotate: [{ to: () => utils.random(-70, 70), duration: 260 }, { to: 0, duration: 720, ease: 'outElastic(1, .55)' }],
      delay: stagger(45)
    });
    animate(pieces, {
      x: { from: () => utils.random(-70, 70) },
      y: { from: () => utils.random(-36, 36) },
      rotate: { from: () => utils.random(-120, 120) },
      opacity: { from: 0 },
      duration: 900,
      delay: stagger(70),
      ease: 'outElastic(1, .6)'
    });
    let busy = false;
    mark.addEventListener('pointerenter', () => {
      if (busy) return;
      busy = true;
      gather().then(() => { busy = false; });
    });
  }

  // 2) 첫 화면 제목이 한 글자씩 올라온다.
  const title = [...splitChars(document.querySelector('.intro h1')), ...splitChars(document.querySelector('.intro-line'))];
  if (title.length) {
    animate(title, {
      y: { from: '0.9em' },
      opacity: { from: 0 },
      duration: 620,
      delay: stagger(26, { start: 150 }),
      ease: 'outExpo'
    });
  }

  // 3) 첫 화면 배경의 점들이 물결처럼 차례로 움직인다.
  const intro = document.querySelector('.intro');
  if (intro) {
    const layer = document.createElement('div');
    layer.className = 'intro-dots';
    layer.setAttribute('aria-hidden', 'true');
    intro.prepend(layer);
    let wave;
    const build = () => {
      if (wave) wave.pause();
      const gap = 34;
      const cols = Math.max(4, Math.floor(layer.clientWidth / gap));
      const rows = Math.max(3, Math.floor(layer.clientHeight / gap));
      layer.style.setProperty('--cols', cols);
      layer.replaceChildren(...Array.from({ length: cols * rows }, () => document.createElement('span')));
      wave = animate(layer.children, {
        y: [0, -6],
        scale: [1, 1.7],
        opacity: [0.16, 0.5],
        duration: 1100,
        delay: stagger(70, { grid: [cols, rows], from: 'first' }),
        loop: true,
        alternate: true,
        ease: 'inOutSine'
      });
    };
    build();
    let timer;
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(build, 250); }).observe(layer);
    new IntersectionObserver(([entry]) => { if (wave) entry.isIntersecting ? wave.play() : wave.pause(); }).observe(intro);
  }
}

async function motionFx() {
  const { animate, inView } = await import(MOTION);

  // 4) 버튼을 누르면 살짝 눌렸다가 튕긴다.
  document.querySelectorAll('.btn, .chip, .menu-toggle').forEach(el => {
    const up = () => animate(el, { scale: 1 }, { type: 'spring', stiffness: 520, damping: 11 });
    el.addEventListener('pointerdown', () => animate(el, { scale: 0.92 }, { duration: 0.09 }));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => el.addEventListener(type, up));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') animate(el, { scale: [0.92, 1] }, { type: 'spring', stiffness: 520, damping: 11 }); });
  });

  // 5) 메뉴가 열릴 때 항목이 위에서부터 차례로 나온다. (좁은 화면에서 '메뉴' 버튼)
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header nav');
  if (toggle && nav) {
    const links = [...nav.querySelectorAll('a')];
    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      nav.toggleAttribute('data-open', open);
      if (open) links.forEach((link, i) => animate(link, { opacity: [0, 1], y: [-14, 0] }, { duration: 0.34, delay: i * 0.07, ease: 'easeOut' }));
    };
    document.documentElement.classList.add('has-menu');
    toggle.hidden = false;
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  // 6) 스크롤을 내리면 카드가 하나씩 올라온다.
  const groups = ['.project-grid', '.side-list', '.timeline'];
  groups.forEach(selector => {
    const group = document.querySelector(selector);
    if (!group) return;
    [...group.children].forEach((card, i) => {
      card.style.opacity = '0';
      inView(card, () => {
        animate(card, { opacity: [0, 1], y: [28, 0] }, { duration: 0.55, delay: (i % 4) * 0.09, ease: [0.22, 1, 0.36, 1] });
      }, { amount: 0.15 });
    });
  });
}

if (!reduce) {
  animeFx().catch(error => console.warn('Anime.js 효과를 건너뜁니다.', error));
  motionFx().catch(error => {
    console.warn('Motion 효과를 건너뜁니다.', error);
    document.querySelectorAll('[style*="opacity"]').forEach(el => { el.style.opacity = ''; });
  });
}
