import * as THREE from './vendor/three.module.js';
import {createBackdrop} from './world-fx.js';
import {createAtlas} from './voyage-model.js';
import {createSeedPlanet,drawStarPostcard} from './star-forge.js';
import {initVoyageUI} from './voyage-ui.js';

const extra={shanhe:{title:'山河为证',description:'一部可以探索的历史互动作品，让山河与叙事在浏览器里相遇。',live:'https://ndshuge.github.io/shanhe-preview/',source:'https://github.com/ndshuge/shanhe-preview'}};
const projects=Object.entries({...window.SHUGE_PROJECTS,...extra}).map(([id,p])=>({id,...p}));
const ui=initVoyageUI(projects),host=document.querySelector('#voyage-scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let engine,mode='home',paused=reduced||document.body.dataset.motion==='paused';
let seedState={seed:20261021,kind:'reef',title:'一颗好奇心'};
const notify=message=>{const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove('show'),3000);};
function validStar(value){return value&&Number.isInteger(value.seed)&&value.seed>=0&&value.seed<=4294967295&&['reef','mineral','halo'].includes(value.kind)&&typeof value.title==='string'&&value.title.length<=24;}
try{const saved=JSON.parse(localStorage.getItem('shuge-star-v1'));if(validStar(saved))seedState=saved;}catch{}
const params=new URLSearchParams(location.search),shared={seed:Number(params.get('seed')),kind:params.get('kind'),title:params.get('star')||'一颗好奇心'};
const isShared=params.has('seed')&&validStar(shared);if(isShared)seedState=shared;
ui.setSeed(seedState);
function persist(){try{localStorage.setItem('shuge-star-v1',JSON.stringify(seedState));}catch{}}
function applyMode(next){
  if(!['home','atlas','forge'].includes(next))return;
  mode=next;
  paused=ui.getState().paused;
  if(mode!=='home'){
    if(location.hash){history.replaceState(null,'',location.pathname+location.search);window.dispatchEvent(new Event('shuge:reset-route'));}
    document.body.classList.remove('panel-open');document.querySelector('#panel').hidden=true;
  }
  if(!engine&&mode!=='home')try{engine=boot();}catch(error){console.error('Voyage renderer unavailable',error);ui.setAvailability(false);mode='home';notify('星际空间暂时无法绘制，可以继续探索小镇和作品。');}
  ui.setMode(mode);
  document.querySelector('#universe').inert=mode!=='home';document.querySelector('.site-header').inert=mode!=='home';
  window.dispatchEvent(new CustomEvent('shuge:voyage-state',{detail:{mode}}));
  if(engine)engine.mode(mode);
}
window.addEventListener('shuge:voyage',e=>applyMode(e.detail.mode));
window.addEventListener('shuge:project',e=>engine?.select(e.detail.index));
window.addEventListener('shuge:forge',e=>{if(!validStar(e.detail))return;const {seed,kind,title}=e.detail;seedState={seed,kind,title};persist();engine?.forge(seedState);});
window.addEventListener('shuge:voyage-motion',e=>{paused=e.detail.paused;engine?.invalidate();});
window.addEventListener('shuge:motion',e=>{paused=e.detail.paused;engine?.invalidate();});
window.addEventListener('hashchange',()=>{if(mode!=='home')applyMode('home');});
window.addEventListener('shuge:postcard',()=>{
  const snapshot={...seedState};
  try{const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1000;drawStarPostcard(canvas.getContext('2d'),{...snapshot,width:1600,height:1000});canvas.toBlob(blob=>{if(!blob){notify('纪念图未能生成，请再试一次。');return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='SHUGE-我的星球-'+snapshot.seed+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);notify('星球纪念图已生成');},'image/png');}catch{notify('纪念图暂时无法生成，请再试一次。');}
});
window.addEventListener('shuge:share-star',async()=>{const url=new URL(location.href);url.hash='';url.search='';url.searchParams.set('seed',seedState.seed);url.searchParams.set('kind',seedState.kind);url.searchParams.set('star',seedState.title);try{await navigator.clipboard.writeText(url.href);notify('星球链接已复制，打开就能重现这颗星。');}catch{const output=document.querySelector('#voyage-share-fallback');if(output){output.hidden=false;output.value=url.href;output.focus();output.select();}else notify('复制不可用，请使用地址栏分享。');}});

function boot(){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=760?1.25:1.6));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  host.prepend(renderer.domElement);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,120);
  scene.add(new THREE.HemisphereLight('#c4e4db','#15362d',2.5));const key=new THREE.DirectionalLight('#ffdeb4',4);key.position.set(-4,7,5);scene.add(key);const rim=new THREE.DirectionalLight('#a4d5d9',2.8);rim.position.set(5,2,-5);scene.add(rim);
  const root=new THREE.Group();scene.add(root);const atlas=createAtlas(projects);root.add(atlas.group);
  const backdrop=createBackdrop(scene,devicePixelRatio);backdrop.setDay(false);
  let star,view='home',rotation=.1,pitch=.18,targetRotation=.1,targetPitch=.18,time=0,last=0,dirty=true,drag=null,zoom=1,slow=0,qualityAdjusted=false,renderFrames=0;
  const labels=document.createElement('div');labels.className='atlas-labels';host.append(labels);
  const buttons=projects.map((project,index)=>{const b=document.createElement('button');b.type='button';b.textContent=project.title;b.className='atlas-label';b.setAttribute('aria-label','选择作品：'+project.title);b.addEventListener('click',()=>{ui.selectProject(index);select(index);});labels.append(b);return b;});
  const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2(),point=new THREE.Vector3();
  const eye=new THREE.Vector3(),look=new THREE.Vector3(),wantEye=new THREE.Vector3(),wantLook=new THREE.Vector3();
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<=760?42:40;camera.clearViewOffset();if(w>760)camera.setViewOffset(w,h,-w*.15,0,w,h);camera.updateProjectionMatrix();dirty=true;}
  new ResizeObserver(resize).observe(host);
  function forge(state){if(star&&star.seed===state.seed&&star.kind===state.kind)return;if(star){root.remove(star.group);star.dispose();}star=createSeedPlanet({...state,detail:1});star.group.scale.setScalar(2.35);root.add(star.group);star.group.visible=view==='forge';dirty=true;host.dataset.seed=String(state.seed);host.dataset.kind=state.kind;}
  function change(next){view=next;atlas.group.visible=view==='atlas';labels.hidden=view!=='atlas';if(star)star.group.visible=view==='forge';drag=null;targetRotation=.1;targetPitch=.18;zoom=1;dirty=true;host.dataset.mode=view;last=performance.now();resize();}
  function select(index){atlas.select(index);dirty=true;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===atlas.selected)));host.dataset.selected=String(atlas.selected);}
  host.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary||e.target.closest('button'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};host.setPointerCapture(e.pointerId);});
  host.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;targetRotation+=dx*.007;targetPitch=THREE.MathUtils.clamp(targetPitch+dy*.006,-.8,.85);drag.x=e.clientX;drag.y=e.clientY;drag.moved||=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5;dirty=true;});
  function end(e){if(!drag||e.pointerId!==drag.id)return;const previous=drag;drag=null;if(e.type!=='pointerup'||previous.moved||view!=='atlas')return;const rect=host.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObjects(atlas.targets,false)[0];if(hit){const index=hit.object.userData.project;ui.selectProject(index);select(index);}}
  for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,end);
  host.addEventListener('keydown',e=>{if(e.target!==host||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')targetRotation-=.2;if(e.key==='ArrowRight')targetRotation+=.2;if(e.key==='ArrowUp')targetPitch=Math.max(-.8,targetPitch-.12);if(e.key==='ArrowDown')targetPitch=Math.min(.85,targetPitch+.12);if(e.key==='+')zoom=Math.max(.75,zoom-.1);if(e.key==='-')zoom=Math.min(1.3,zoom+.1);dirty=true;});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();applyMode('home');ui.setAvailability(false);notify('星际画面中断，已回到小镇。');});
  if(renderer.debug)renderer.debug.onShaderError=()=>{applyMode('home');ui.setAvailability(false);notify('这台设备暂时无法绘制造星材质，已回到小镇。');};
  forge(seedState);select(0);eye.set(0,9,19);look.set(0,0,0);
  function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000)||0;last=now;if(view==='home'||document.hidden)return;
    const moving=Math.abs(targetRotation-rotation)+Math.abs(targetPitch-pitch)>.0003;
    if(paused&&!dirty&&!moving)return;
    if(!paused)time+=dt;
    const ease=reduced?1:1-Math.exp(-dt*6);rotation+=(targetRotation-rotation)*ease;pitch+=(targetPitch-pitch)*ease;root.rotation.set(pitch,rotation,0);
    const mobile=host.clientWidth<=760;
    if(view==='atlas'){atlas.update(time,dt);wantEye.set(0,mobile?11:9,mobile?20:17).multiplyScalar(zoom);wantLook.set(0,0,0);}else{star.update(time);wantEye.set(0,.6,11.2*zoom);wantLook.set(0,0,0);}
    const easing=reduced?1:1-Math.exp(-dt*4.2);eye.lerp(wantEye,easing);look.lerp(wantLook,easing);camera.position.copy(eye);camera.lookAt(look);backdrop.update(time);renderer.render(scene,camera);
    if(view==='atlas'){scene.updateMatrixWorld();const occupied=[];atlas.systems.forEach((system,i)=>{system.group.getWorldPosition(point);point.project(camera);const x=(point.x+1)*host.clientWidth/2,y=(1-point.y)*host.clientHeight/2;const b=buttons[i],overlap=occupied.some(p=>Math.abs(p.x-x)<115&&Math.abs(p.y-y)<40),valid=!overlap&&x>15&&x<host.clientWidth-110&&y>(mobile?85:150)&&y<host.clientHeight-(mobile?150:90)&&(mobile||x>host.clientWidth*.37);b.hidden=!valid;b.style.transform=`translate(${x.toFixed(1)}px,${(y+18).toFixed(1)}px)`;if(valid)occupied.push({x,y});});}
    host.dataset.ready='true';host.dataset.rotation=rotation.toFixed(3);host.dataset.renderCalls=String(renderer.info.render.calls);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.paused=String(paused);host.dataset.renderFrames=String(++renderFrames);dirty=moving||eye.distanceTo(wantEye)>.001;
    if(dt>.035&&!drag)slow++;if(slow>100&&!qualityAdjusted){qualityAdjusted=true;renderer.setPixelRatio(1);resize();host.dataset.adapted='true';}
  }
  requestAnimationFrame(frame);return {mode:change,forge,select,invalidate(){dirty=true;}};
}
if(isShared)applyMode('forge');
