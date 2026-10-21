/** Native, keyboard-accessible controls for the additional Odyssey worlds. */
export function initVoyageUI(projects = []) {
  const emit = (name, detail = {}) => window.dispatchEvent(new CustomEvent('shuge:' + name, {detail}));
  const state = {mode: 'home', index: 0, seed: 2026, kind: 'reef', title: '我的好奇心'};
  let available = true, returnFocus = null;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.dataset.motion === 'paused';
  const entry = document.createElement('div');
  entry.className = 'voyage-entry';
  entry.innerHTML = `<button id="voyage-open" type="button"><span class="voyage-entry-orbit" aria-hidden="true"></span><span>打开奇想宇宙</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></button><p id="voyage-entry-note">作品是行星，而你也可以造一颗。</p>`;
  document.querySelector('.welcome-actions')?.after(entry);
  const overlay = document.createElement('section');
  overlay.id = 'voyage'; overlay.className = 'voyage'; overlay.hidden = true; overlay.inert = true;
  overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-labelledby', 'voyage-title');
  overlay.innerHTML = `
    <div id="voyage-scene" class="voyage-scene" tabindex="0" role="img" aria-label="奇想宇宙。拖动调整视角，也可以使用作品列表或造星按钮。"></div>
    <div class="voyage-scrim" aria-hidden="true"></div>
    <header class="voyage-header"><span class="voyage-wordmark"><i aria-hidden="true"></i>奇想宇航局<small>SHUGE / OPEN UNIVERSE</small></span><button id="voyage-close" type="button" aria-label="关闭奇想宇宙，回到小镇"><span>回到小镇</span><svg aria-hidden="true"><use href="#i-cross"/></svg></button></header>
    <nav class="voyage-modes" aria-label="选择宇宙空间"><button type="button" data-voyage-mode="atlas" aria-pressed="true">作品星图</button><button type="button" data-voyage-mode="forge" aria-pressed="false">造一颗星</button></nav>
    <div class="voyage-intro"><h2 id="voyage-title" tabindex="-1">把好奇心，<br>连成星系<span>。</span></h2><p class="voyage-lead" id="voyage-lead">每一个作品，都是一颗独立的星球。<br>选一颗，看看里面生长着什么。</p></div>
    <div id="voyage-atlas" class="voyage-atlas">
      <article class="voyage-project" aria-labelledby="voyage-project-title"><p class="voyage-project-index"><span id="voyage-project-number">01</span><span> / </span><span id="voyage-project-total"></span><i aria-hidden="true"></i><span>正在接近</span></p><h3 id="voyage-project-title"></h3><p id="voyage-project-description"></p><div class="voyage-project-links"><a id="voyage-project-live" target="_blank" rel="noopener noreferrer">探索作品 <svg aria-hidden="true"><use href="#i-arrow"/></svg></a><a id="voyage-project-source" target="_blank" rel="noopener noreferrer">查看源码 ↗</a></div></article>
      <div class="voyage-projects" id="voyage-projects" role="group" aria-label="选择一颗作品星球"></div>
    </div>
    <div id="voyage-forge" class="voyage-forge" hidden>
      <label class="voyage-name" for="voyage-star-name"><span>给它一个名字</span><input id="voyage-star-name" type="text" maxlength="24" value="我的好奇心" autocomplete="off" spellcheck="false"></label>
      <div class="voyage-kinds" role="group" aria-label="选择星球形态"><button type="button" data-star-kind="reef" aria-pressed="true"><i class="kind-reef" aria-hidden="true"></i>漂浮群岛</button><button type="button" data-star-kind="mineral" aria-pressed="false"><i class="kind-mineral" aria-hidden="true"></i>棱晶之星</button><button type="button" data-star-kind="halo" aria-pressed="false"><i class="kind-halo" aria-hidden="true"></i>丝绸环星</button></div>
      <div class="voyage-seed-row"><span id="voyage-seed-label">星球种子 / 2026</span><button id="voyage-reroll" type="button">再生一颗 <svg aria-hidden="true"><use href="#i-reset"/></svg></button></div>
      <div class="voyage-forge-actions"><button id="voyage-postcard" class="voyage-action-primary" type="button">保存星球纪念图 <svg aria-hidden="true"><use href="#i-arrow"/></svg></button><button id="voyage-share" type="button">复制星球链接</button></div>
      <input id="voyage-share-fallback" class="voyage-share-fallback" type="text" readonly hidden aria-label="手动复制星球链接">
      <p class="voyage-local-note">生成过程在你的设备上完成；复制链接可分享这颗星球。</p>
    </div>
    <footer class="voyage-footer"><span id="voyage-coordinate">一片属于好奇心的轨道</span><div class="voyage-footer-controls"><span class="voyage-hint">拖动旋转 · 方向键也可以</span><button id="voyage-motion" type="button" aria-pressed="false">暂停动态</button></div></footer>
    <p id="voyage-announcement" class="sr-only" aria-live="polite"></p>`;
  document.body.append(overlay);
  const $ = selector => overlay.querySelector(selector);
  const openButton = entry.querySelector('button');
  const title = $('#voyage-title');
  const projectButtons = [];
  projects.forEach((project, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'voyage-project-choice';
    button.dataset.projectIndex = String(index);
    button.setAttribute('aria-pressed', String(index === 0));
    const number = document.createElement('span'); number.className = 'voyage-choice-number'; number.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('span'); name.textContent = project.title;
    const marker = document.createElement('i'); marker.setAttribute('aria-hidden', 'true');
    button.append(number, name, marker);
    button.addEventListener('click', () => {selectProject(index); emit('project', {index});});
    $('#voyage-projects').append(button); projectButtons.push(button);
  });
  $('#voyage-project-total').textContent = String(projects.length).padStart(2, '0');

  function selectProject(index) {
    if (!Number.isInteger(index) || !projects[index]) return;
    state.index = index;
    const project = projects[index];
    $('#voyage-project-title').textContent = project.title;
    $('#voyage-project-description').textContent = project.description;
    $('#voyage-project-number').textContent = String(index + 1).padStart(2, '0');
    $('#voyage-project-live').href = project.live;
    $('#voyage-project-source').href = project.source;
    projectButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    $('#voyage-coordinate').textContent = `作品轨道 ${String(index + 1).padStart(2, '0')} / ${project.title}`;
    $('#voyage-announcement').textContent = '已选择：' + project.title;
  }
  function setSeed({seed = state.seed, kind = state.kind, title: name = state.title} = {}) {
    state.seed = Number(seed) >>> 0;
    state.kind = ['reef', 'mineral', 'halo'].includes(kind) ? kind : 'reef';
    state.title = String(name).trim().slice(0, 24) || '我的好奇心';
    if (document.activeElement !== $('#voyage-star-name')) $('#voyage-star-name').value = state.title;
    $('#voyage-seed-label').textContent = '星球种子 / ' + state.seed;
    overlay.querySelectorAll('[data-star-kind]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.starKind === state.kind)));
    if (state.mode === 'forge') $('#voyage-coordinate').textContent = state.title + ' / SEED ' + state.seed;
  }
  function setMode(mode) {
    if (!['home', 'atlas', 'forge'].includes(mode) || (mode !== 'home' && !available)) return;
    const previous = state.mode; state.mode = mode;
    if (previous !== mode) $('#voyage-share-fallback').hidden = true;
    document.body.dataset.voyage = mode;
    if (mode === 'home') {
      overlay.hidden = true; overlay.inert = true; overlay.removeAttribute('aria-modal');
      if (previous !== 'home' && returnFocus) {const target = returnFocus; returnFocus = null; requestAnimationFrame(() => {if (state.mode === 'home' && target.isConnected && !target.closest('[inert]')) target.focus({preventScroll: true});});}
      return;
    }
    if (previous === 'home') returnFocus = document.activeElement;
    overlay.hidden = false; overlay.inert = false; overlay.setAttribute('aria-modal', 'true');
    $('#voyage-atlas').hidden = mode !== 'atlas';
    $('#voyage-forge').hidden = mode !== 'forge';
    title.replaceChildren();
    const first = document.createTextNode(mode === 'atlas' ? '把好奇心，' : '给宇宙，');
    const second = document.createTextNode(mode === 'atlas' ? '连成星系' : '添一颗你的星');
    const dot = document.createElement('span'); dot.textContent = '。';
    title.append(first, document.createElement('br'), second, dot);
    $('#voyage-lead').replaceChildren();
    $('#voyage-lead').append(document.createTextNode(mode === 'atlas' ? '每一个作品，都是一颗独立的星球。' : '换一种形态，拨动一次宇宙的随机数。'), document.createElement('br'), document.createTextNode(mode === 'atlas' ? '选一颗，看看里面生长着什么。' : '给这颗小世界命名，再带走一张纪念图。'));
    overlay.querySelectorAll('[data-voyage-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.voyageMode === mode)));
    if (mode === 'atlas') selectProject(state.index); else setSeed(state);
    $('#voyage-scene').setAttribute('aria-label', mode === 'atlas' ? '作品星系。拖动调整视角，选择作品也可使用下方作品列表。' : '你正在创造的星球。拖动调整视角，用形态按钮改变这颗星球。');
    if (previous !== mode) requestAnimationFrame(() => {if (state.mode !== 'home') title.focus({preventScroll: true});});
  }
  const openMode = mode => {setMode(mode); if (state.mode === mode) emit('voyage', {mode});};
  openButton.addEventListener('click', () => openMode('atlas'));
  $('#voyage-close').addEventListener('click', () => openMode('home'));
  overlay.querySelectorAll('[data-voyage-mode]').forEach(button => button.addEventListener('click', () => openMode(button.dataset.voyageMode)));
  $('#voyage-star-name').addEventListener('input', () => {setSeed({title: $('#voyage-star-name').value}); emit('forge', {...state});});
  $('#voyage-star-name').addEventListener('change', () => {$('#voyage-star-name').value = state.title;});
  overlay.querySelectorAll('[data-star-kind]').forEach(button => button.addEventListener('click', () => {setSeed({kind: button.dataset.starKind}); emit('forge', {...state});}));
  $('#voyage-reroll').addEventListener('click', () => {const values = new Uint32Array(1); if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(values); else values[0] = Math.floor(Math.random() * 4294967295); setSeed({seed: values[0]}); emit('forge', {...state}); $('#voyage-announcement').textContent = '一颗新的星球已生成。';});
  $('#voyage-postcard').addEventListener('click', () => emit('postcard', {...state}));
  $('#voyage-share').addEventListener('click', () => emit('share-star', {...state}));
  function motionState() {$('#voyage-motion').setAttribute('aria-pressed', String(paused)); $('#voyage-motion').textContent = paused ? '继续动态' : '暂停动态';}
  $('#voyage-motion').addEventListener('click', () => {paused = !paused; motionState(); emit('voyage-motion', {paused});});
  window.addEventListener('shuge:motion', event => {paused = Boolean(event.detail.paused); motionState();});
  motionState();
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); openMode('home'); return;}
    if (event.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll('button:not(:disabled),a[href],input,#voyage-scene')].filter(element => !element.closest('[hidden]') && element.getClientRects().length > 0);
    const first = focusable[0], last = focusable.at(-1);
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
  });
  function setAvailability(value) {
    available = Boolean(value); openButton.disabled = !available;
    entry.querySelector('p').textContent = available ? '作品是行星，而你也可以造一颗。' : '这台设备暂不支持奇想宇宙，仍可从导航阅读全部作品。';
    if (!available && state.mode !== 'home') openMode('home');
  }
  selectProject(0); setSeed(state); setMode('home');
  return {setMode, selectProject, setSeed, setAvailability, getState: () => ({...state, paused})};
}

