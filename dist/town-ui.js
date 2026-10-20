/* The readable half of the planet. Routes remain ordinary links. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const emit = (type, detail = {}) => window.dispatchEvent(new CustomEvent('shuge:' + type, {detail}));
  let returnFocus, toastTimer, sound = false, audio, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2700); }
  const titles = {about:'认识鼠哥', campus:'校园里的我', life:'作品之外', work:'创作馆', lab:'好奇心实验馆', contact:'联系鼠哥'};
  function accessibility() {const open=!$('#panel').hidden,mobile=matchMedia('(max-width:760px)').matches;$('.welcome').inert=open;$('.scene-tags').inert=open;$('.site-header nav').inert=open&&!mobile;$('.github-top').inert=open;for(const s of ['.district-nav','.world-settings','.camera-controls','#scene'])$(s).inert=open&&mobile;}
  function route() {
    const key = location.hash.slice(1), open = !!titles[key];
    if (open && $('#panel').hidden) returnFocus = document.activeElement;
    $('#panel').hidden = !open; document.body.classList.toggle('panel-open', open);
    $$('.page').forEach(p => p.hidden = p.id !== 'page-' + key);
    $$('nav a').forEach(a => { const active = open && a.hash === '#' + key; a.classList.toggle('active', active); active ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'); });
    accessibility();emit('navigate', {route: open ? key : ''});
    if (open) { $('#panel-title').textContent = titles[key]; $('#panel-content').scrollTop = 0; const h = $('#page-' + key + ' h2'); h.tabIndex = -1; requestAnimationFrame(() => h.focus({preventScroll:true})); }
    else if (returnFocus) {const target=returnFocus;returnFocus=null;requestAnimationFrame(()=>{const visible=target.isConnected&&!target.closest('[inert]')&&target.getClientRects().length&&getComputedStyle(target).visibility!=='hidden';(visible?target:$('.logo')).focus({preventScroll:true});});}
    if (key === 'lab') requestAnimationFrame(drawCurve);
    note();
  }
  window.addEventListener('hashchange', route);
  $('#panel-close').addEventListener('click', () => location.hash = '');
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#panel').hidden) location.hash = ''; });
  $('#copy-github').addEventListener('click', async () => { try { await navigator.clipboard.writeText('https://github.com/ndshuge'); toast('GitHub 地址已复制'); } catch { toast('地址：https://github.com/ndshuge'); } });
  $$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('联系方式已复制');}catch{toast(b.dataset.copy);}}));
  const sceneControls=['#ride','#zoom-in','#zoom-out','#reset-view','#quality-toggle'];let sceneTimer;
  function sceneState(ready) {clearTimeout(sceneTimer);sceneControls.forEach(s=>$(s).disabled=!ready);$('#scene-loading').hidden=true;$('#render-fallback').hidden=ready;$('.camera-controls').hidden=!ready;$('#ride').hidden=!ready;if(!ready){$('#scene').dataset.ready='fallback';$('#world-caption').textContent='使用导航，直接认识鼠哥。';}}
  sceneControls.forEach(s=>$(s).disabled=true);
  window.addEventListener('shuge:scene-ready',()=>sceneState(true));window.addEventListener('shuge:scene-error',()=>sceneState(false));
  $('#world-module').addEventListener('error',()=>sceneState(false));sceneTimer=setTimeout(()=>{if($('#scene').dataset.ready!=='true')sceneState(false);},8000);
  $('#explore').addEventListener('click',()=>{if($('#scene').dataset.ready==='true')emit('explore');else location.hash='about';});
  function note() { if (!sound) return; try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); const o=audio.createOscillator(), g=audio.createGain(); o.type='sine'; o.frequency.value=440; g.gain.setValueAtTime(.035,audio.currentTime); g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.3); o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime+.31); } catch { sound=false; $('#sound-toggle').textContent='声音不可用'; } }
  $('#sound-toggle').addEventListener('click', () => { sound=!sound; $('#sound-toggle').setAttribute('aria-pressed',sound); $('#sound-toggle').textContent=sound?'声音开':'声音关'; note(); });
  function motion() { $('#motion-toggle').setAttribute('aria-pressed',paused); $('#motion-toggle').textContent=paused?'继续动态':'暂停动态'; document.body.dataset.motion=paused?'paused':'running'; emit('motion',{paused}); }
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;motion();}); motion();
  $('#time-toggle').addEventListener('click',()=>{const day=document.body.dataset.time!=='day';document.body.dataset.time=day?'day':'evening';$('#time-toggle').setAttribute('aria-pressed',day);$('#time-toggle').setAttribute('aria-label',day?'切换到傍晚':'切换到白昼');$('#time-toggle span').textContent=day?'切换傍晚':'切换白昼';$('#time-toggle use').setAttribute('href',day?'#i-moon':'#i-sun');emit('time',{day});note();});
  const projects = {...window.SHUGE_PROJECTS, shanhe:{title:'山河为证',description:'一部可以探索的历史互动作品，让山河与叙事在浏览器里相遇。',live:'https://ndshuge.github.io/shanhe-preview/',source:'https://github.com/ndshuge/shanhe-preview'}};
  const cats={micehole:'ai',academy:'learn',classnote:'learn',arcade:'play',galaxy:'play',board:'play',shanhe:'learn'};
  const link=(url,text)=>{const a=document.createElement('a');a.href=url;a.textContent=text;a.target='_blank';a.rel='noopener noreferrer';return a;};
  function works(filter='all') { const list=$('#work-list');list.replaceChildren();for(const [id,p] of Object.entries(projects)){if(filter!=='all'&&cats[id]!==filter)continue;const item=document.createElement('article');item.className='work-item';const thumb=link(p.live,'');thumb.className='work-thumb';thumb.setAttribute('aria-label','打开'+p.title);if(id==='micehole'||id==='shanhe'){thumb.classList.add(id==='micehole'?'mice-cover':'shanhe-cover');const strong=document.createElement('strong');strong.textContent=p.title;const sub=document.createElement('span');sub.textContent=id==='micehole'?'MAKE IDEAS HAPPEN':'让历史成为一次探索';thumb.append(strong,sub);}else{const img=document.createElement('img');img.src='assets/'+id+'.png';img.alt=p.title+'页面预览';img.loading='lazy';thumb.append(img);}const title=document.createElement('h3');title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.description;const actions=document.createElement('div');actions.className='work-links';actions.append(link(p.live,id==='micehole'?'查看发布':'体验作品'),link(p.source,'源码 ↗'));item.append(thumb,title,desc,actions);list.append(item);}$('#work-status').textContent='显示 '+list.children.length+' 件作品'; }
  $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));works(b.dataset.filter);}));works();
  // V1-quality point-cloud sculpture, adapted to the V2 panel palette.
  // Use the original 4,200 point surfaces rather than 1,000 sampled paths.
  let lab='curve',shape='ring',sculpturePaused=paused,angleX=-.48,angleY=.2,particleDrag=null;
  const TAU=Math.PI*2, PARTICLE_COUNT=4200, cloudPoints=[],cloudTargets=[];
  let particleDirty=true, morphing=false, particleLast=0;
  const pc=$('#particle-canvas'),px=pc.getContext('2d');
  pc.dataset.particleCount=String(PARTICLE_COUNT);
  function particlePauseState(){ $('#particle-pause').setAttribute('aria-pressed',String(sculpturePaused));$('#particle-pause').textContent=sculpturePaused?'继续旋转':'暂停旋转';pc.dataset.paused=String(sculpturePaused); }
  particlePauseState();
  window.addEventListener('shuge:motion',e=>{sculpturePaused=e.detail.paused;particleDirty=true;particlePauseState();});
  $$('[data-lab]').forEach(b=>b.addEventListener('click',()=>{
    lab=b.dataset.lab;$$('[data-lab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    $('#curve-lab').hidden=lab!=='curve';$('#particle-lab').hidden=lab!=='particles';
    particleDirty=true; if(lab==='curve')drawCurve(); else drawParticles();
  }));
  const curve=$('#curve-canvas'),cx=curve.getContext('2d');
  function fit(canvas){const w=canvas.clientWidth||380,d=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(w*d);}return canvas.width;}
  function drawCurve(){const w=fit(curve),f=+$('#frequency').value,p=+$('#phase').value;$('#frequency-value').textContent=f+' : 2';$('#phase-value').textContent=p+'°';cx.fillStyle='#20382f';cx.fillRect(0,0,w,w);cx.strokeStyle='#466252';cx.lineWidth=1;for(let i=1;i<8;i++){cx.beginPath();cx.moveTo(w*i/8,0);cx.lineTo(w*i/8,w);cx.moveTo(0,w*i/8);cx.lineTo(w,w*i/8);cx.stroke();}const grad=cx.createLinearGradient(0,0,w,w);grad.addColorStop(0,'#a5c9a2');grad.addColorStop(.5,'#f3c797');grad.addColorStop(1,'#f09873');cx.strokeStyle=grad;cx.lineWidth=w/210;cx.beginPath();for(let i=0;i<=2400;i++){const t=i/2400*TAU,x=w/2+Math.sin(f*t+p/180*Math.PI)*w*.39,y=w/2+Math.sin(2*t)*w*.39;i?cx.lineTo(x,y):cx.moveTo(x,y);}cx.stroke();}
  ['#frequency','#phase'].forEach(s=>$(s).addEventListener('input',drawCurve));
  $('#lab-random').addEventListener('click',()=>{$('#frequency').value=(+$('#frequency').value+2)%9+1;$('#phase').value=Math.floor(Math.random()*181);drawCurve();});
  $('#lab-save').addEventListener('click',()=>{drawCurve();curve.toBlob(blob=>{if(!blob)return;const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='鼠哥的好奇心曲线.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('曲线已保存为 PNG');});});
  function shapePoint(type,i){
    // Identical geometric families to V1: closed torus, braided knot, layered mouse.
    const u=(i%140)/140*TAU,v=Math.floor(i/140)/30*TAU;
    if(type==='ring'){const r=1.12+.48*Math.cos(v);return [r*Math.cos(u),r*Math.sin(u),.48*Math.sin(v)];}
    if(type==='knot'){
      // Sample a real 3D tube around a trefoil centreline, not a thin scribbled path.
      const t=(i%140)/140*TAU,v=Math.floor(i/140)/30*TAU,r=.82+.32*Math.cos(3*t),q=.17;
      return [(r+q*Math.cos(v))*Math.cos(2*t),(r+q*Math.cos(v))*Math.sin(2*t),.56*Math.sin(3*t)+q*Math.sin(v)];
    }
    // A legible particle mouse: one rounded head, two ears, a nose and small eyes.
    // Separate deterministic spherical point sets avoid the repeated latitude streaks
    // of the previous i%10 distribution.
    let start=0,count=2600,rx=.83,ry=.82,rz=.5,ox=0,oy=-.22,oz=0;
    if(i>=4140){start=4140;count=60;rx=.085;ry=.085;rz=.07;ox=.27;oy=-.06;oz=.51;}
    else if(i>=4080){start=4080;count=60;rx=.085;ry=.085;rz=.07;ox=-.27;oy=-.06;oz=.51;}
    else if(i>=4000){start=4000;count=80;rx=.12;ry=.095;rz=.1;ox=0;oy=-.53;oz=.52;}
    else if(i>=3300){start=3300;count=700;rx=.4;ry=.42;rz=.25;ox=.69;oy=.7;oz=0;}
    else if(i>=2600){start=2600;count=700;rx=.4;ry=.42;rz=.25;ox=-.69;oy=.7;oz=0;}
    const k=i-start,z=1-2*(k+.5)/count,a=k*2.39996322972865,rr=Math.sqrt(1-z*z);
    return [rr*Math.cos(a)*rx+ox,z*ry+oy,rr*Math.sin(a)*rz+oz];
  }
  function setParticleShape(type,instant=false){
    shape=type;pc.dataset.shape=type;
    for(let i=0;i<PARTICLE_COUNT;i++){
      cloudTargets[i]=shapePoint(type,i);
      if(!cloudPoints[i]||instant)cloudPoints[i]=cloudTargets[i].slice();
    }
    morphing=!instant;particleDirty=true;drawParticles();
  }
  $$('[data-shape]').forEach(b=>b.addEventListener('click',()=>{
    $$('[data-shape]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    setParticleShape(b.dataset.shape,sculpturePaused);
  }));
  $('#particle-pause').addEventListener('click',()=>{sculpturePaused=!sculpturePaused;particlePauseState();particleDirty=true;});
  function particleSize(){
    const width=pc.clientWidth||380,height=pc.clientHeight||width,dpr=Math.min(devicePixelRatio||1,2);
    const cw=Math.round(width*dpr),ch=Math.round(height*dpr);
    if(pc.width!==cw||pc.height!==ch){pc.width=cw;pc.height=ch;px.setTransform(dpr,0,0,dpr,0,0);particleDirty=true;}
    return [width,height];
  }
  function drawParticles(){
    const [width,height]=particleSize();
    if(!width||!height)return;
    px.fillStyle='#20382f';px.fillRect(0,0,width,height);
    const cosX=Math.cos(angleX),sinX=Math.sin(angleX),cosY=Math.cos(angleY),sinY=Math.sin(angleY);
    const scale=Math.min(width/3.9,height/3.9),visiblePoints=[];
    let unsettled=0;
    for(let i=0;i<PARTICLE_COUNT;i++){
      const point=cloudPoints[i],target=cloudTargets[i];
      if(!point||!target)continue;
      if(morphing){for(let j=0;j<3;j++){const diff=target[j]-point[j];point[j]+=diff*.15;if(Math.abs(diff)>.002)unsettled++;}}
      const x=point[0]*cosY-point[2]*sinY,z1=point[0]*sinY+point[2]*cosY;
      const y=point[1]*cosX-z1*sinX,z=point[1]*sinX+z1*cosX;
      const perspective=5/(5-z);
      visiblePoints.push([width/2+x*scale*perspective,height/2-y*scale*perspective,z,i,perspective]);
    }
    visiblePoints.sort((a,b)=>a[2]-b[2]);
    for(const [x,y,z,i,perspective] of visiblePoints){
      const depth=Math.max(.22,Math.min(.93,(z+2.1)/4));
      const accent=i%107===0||(shape==='mouse'&&i>=4000);
      px.fillStyle=accent?`rgba(242,158,112,${depth})`:`rgba(189,216,180,${depth})`;
      const radius=(accent?1.55:.6+depth*.65)*perspective;
      px.beginPath();px.arc(x,y,radius,0,TAU);px.fill();
    }
    if(morphing&&unsettled===0)morphing=false;
    pc.dataset.rotationY=angleY.toFixed(3);
    pc.dataset.rotationX=angleX.toFixed(3);
    pc.dataset.renderedCount=String(visiblePoints.length);
    particleDirty=false;
  }
  pc.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    particleDrag={id:e.pointerId,x:e.clientX,y:e.clientY};
    pc.setPointerCapture(e.pointerId);
  });
  pc.addEventListener('pointermove',e=>{
    if(!particleDrag||particleDrag.id!==e.pointerId)return;
    angleY+=(e.clientX-particleDrag.x)*.012;
    angleX=Math.max(-1.4,Math.min(1.4,angleX+(e.clientY-particleDrag.y)*.009));
    particleDrag.x=e.clientX;particleDrag.y=e.clientY;
    particleDirty=true;drawParticles();
  });
  const endParticleDrag=e=>{if(particleDrag&&e.pointerId===particleDrag.id)particleDrag=null;};
  pc.addEventListener('pointerup',endParticleDrag);
  pc.addEventListener('pointercancel',endParticleDrag);
  pc.addEventListener('lostpointercapture',endParticleDrag);
  pc.addEventListener('keydown',e=>{
    const dirs={ArrowLeft:[0,-.15],ArrowRight:[0,.15],ArrowUp:[-.15,0],ArrowDown:[.15,0]};
    if(dirs[e.key]){e.preventDefault();angleX=Math.max(-1.4,Math.min(1.4,angleX+dirs[e.key][0]));angleY+=dirs[e.key][1];particleDirty=true;drawParticles();}
    else if(e.code==='Space'){e.preventDefault();$('#particle-pause').click();}
  });
  setParticleShape('ring',true);
  let particleFrame=0;
  function particles(t){
    requestAnimationFrame(particles);
    if(document.hidden||lab!=='particles'||location.hash!=='#lab'){particleFrame=t;return;}
    const dt=Math.min(Math.max(0,t-particleFrame)/1000,.05);if(t-particleFrame<32)return;particleFrame=t;
    if(!sculpturePaused){angleY+=dt*.18;particleDirty=true;}
    if(particleDirty||morphing)drawParticles();
  }
  requestAnimationFrame(particles);window.addEventListener('resize',()=>{accessibility();if(location.hash==='#lab')drawCurve();});route();if($('#scene').dataset.ready==='true')sceneState(true);
})();
