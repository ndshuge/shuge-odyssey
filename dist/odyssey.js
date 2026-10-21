import * as THREE from './vendor/three.module.js';
import {EffectComposer} from './vendor/addons/postprocessing/EffectComposer.js';
import {RenderPass} from './vendor/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './vendor/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from './vendor/addons/postprocessing/OutputPass.js';
import {createPlanet} from './planet-model.js';
import {decoratePlanet,createBackdrop} from './world-fx.js';

const $=s=>document.querySelector(s),host=$('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function notify(name){window.dispatchEvent(new Event('shuge:'+name));}
function fallback(error){host.dataset.ready='fallback';$('#scene-loading').hidden=true;$('#render-fallback').hidden=false;notify('scene-error');if(error)console.error('Odyssey renderer unavailable:',error);}
try {boot();} catch(error){fallback(error);}

function boot(){
  const mobile=innerWidth<=760;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  if(renderer.debug)renderer.debug.onShaderError=()=>{paused=true;fallback(new Error('WebGL shader compilation failed'));};
  host.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,140);
  const model=createPlanet(),{world,planet,landmarks,clickables,tram,track,loops,windowMat}=model;
  world.position.set(.25,-.12,0);scene.add(world);
  const garden=decoratePlanet(model,{mobile}),backdrop=createBackdrop(scene,devicePixelRatio);
  const hemi=new THREE.HemisphereLight('#a9c9ca','#294a3f',1.55);scene.add(hemi);
  const sun=new THREE.DirectionalLight('#ffe1ad',3.1);sun.position.set(-5,8,6);sun.castShadow=true;
  sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;
  sun.shadow.normalBias=.035;sun.shadow.bias=-.00008;scene.add(sun);
  const rim=new THREE.DirectionalLight('#a1c6cf',1.7);rim.position.set(5,2,-6);scene.add(rim);
  windowMat.emissiveIntensity=1.2;
  const composer=new EffectComposer(renderer),renderPass=new RenderPass(scene,camera);
  const bloom=new UnrealBloomPass(new THREE.Vector2(800,800),.30,.55,1.12),output=new OutputPass();
  // Add glow radiance while retaining the original transparent scene alpha.
  Object.assign(bloom.blendMaterial,{blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,
    blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor,blendEquationAlpha:THREE.AddEquation,
    blendSrcAlpha:THREE.ZeroFactor,blendDstAlpha:THREE.OneFactor});
  composer.addPass(renderPass);composer.addPass(bloom);composer.addPass(output);
  let high=!mobile,day=document.body.dataset.time==='day',paused=reduced||document.body.dataset.motion==='paused';
  let rotation=reduced?.1:-.24,targetRotation=.1,tilt=reduced?-.07:.08,targetTilt=-.07;
  let baseDistance=16.8,distance=reduced?16.8:24,targetDistance=16.8,elapsed=0,last=0;
  let dirty=true,dirtyFrames=0,drag=null,suppressClick=null,velocityX=0,velocityY=0,route='',ride=false,rideStart=0,rideBase=0;
  let voyageOpen=document.body.dataset.voyage&&document.body.dataset.voyage!=='home';
  window.addEventListener('shuge:voyage-state',e=>{voyageOpen=e.detail.mode!=='home';if(voyageOpen)setRide(false);dirty=true;});
  let frames=0,totalFrameTime=0,slowFrames=0,autoDowngraded=false;
  const chapters={campus:'校园 · 学习与生长',life:'日常 · 兴趣与远方',work:'创作馆 · 让想法发生',lab:'实验馆 · 好奇心的形状',contact:'联系 · 从这里说声你好',about:'鼠哥 · 一个喜欢造世界的人'};
  const setCaption=text=>{if($('#chapter-caption'))$('#chapter-caption').textContent=text;};
  const setRide=value=>{ride=value;$('#ride').setAttribute('aria-pressed',String(value));$('#ride').textContent=value?'结束巡游':'星球巡游';$('#world-caption').textContent=value?'沿着轨道，发现我的几个世界。':'拖动探索 · 点击地标走近一点';};
  function quality(value,automatic=false){high=value;const dpr=Math.min(devicePixelRatio,high?(mobile?1.5:1.7):1.1);renderer.setPixelRatio(dpr);composer.setPixelRatio(dpr);sun.shadow.mapSize.set(high?2048:1024,high?2048:1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}garden.setQuality(high);bloom.enabled=high;host.dataset.quality=high?'high':'low';if($('#quality-toggle')){$('#quality-toggle').textContent=high?'画质：精细':'画质：流畅';$('#quality-toggle').setAttribute('aria-pressed',String(high));}if(automatic)host.dataset.adapted='true';resize();}
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;camera.fov=w<700?38:35;camera.updateProjectionMatrix();baseDistance=w<700?17.6:Math.max(16.8,16.8*(1.15/camera.aspect));if(!route&&!ride)targetDistance=baseDistance;dirty=true;host.dataset.viewport=w+'x'+h;}
  new ResizeObserver(resize).observe(host);quality(high);
  $('#quality-toggle')?.addEventListener('click',()=>{autoDowngraded=true;quality(!high);});
  $('#zoom-in').addEventListener('click',()=>{targetDistance=Math.max(11.7,targetDistance-1.2);});
  $('#zoom-out').addEventListener('click',()=>{targetDistance=Math.min(25,targetDistance+1.2);});
  function reset(){setRide(false);targetRotation=.1;targetTilt=-.07;targetDistance=baseDistance;velocityX=velocityY=0;setCaption('一颗星球，装着我的好奇心。');dirty=true;}
  $('#reset-view').addEventListener('click',reset);
  function tour(){setRide(!ride);rideBase=targetRotation;rideStart=performance.now();velocityX=velocityY=0;targetDistance=baseDistance+.3;}
  $('#ride').addEventListener('click',tour);
  window.addEventListener('shuge:explore',()=>{if(reduced){location.hash='about';return;}tour();host.focus({preventScroll:true});});
  function applyDay(value){day=value;hemi.intensity=day?2.6:1.55;sun.intensity=day?3.5:3.1;rim.intensity=day?.85:1.7;windowMat.emissiveIntensity=day?.15:1.2;garden.setDay(day);backdrop.setDay(day);bloom.strength=day?.16:.30;host.dataset.time=day?'day':'evening';dirty=true;}
  window.addEventListener('shuge:time',e=>applyDay(e.detail.day));applyDay(day);
  window.addEventListener('shuge:motion',e=>{paused=e.detail.paused;host.dataset.paused=String(paused);if(paused){velocityX=velocityY=0;setRide(false);}dirty=true;});
  const viewDirection=new THREE.Vector3(6.1,5.1,10.5).normalize(),temporary=new THREE.Vector3();
  function focusRoute(key){route=key;dirtyFrames=70;velocityX=velocityY=0;setRide(false);if(!key){reset();return;}setCaption(chapters[key]||'好奇心引力场');const anchor=landmarks[key]||landmarks[key==='contact'?'life':'work'];if(!anchor)return;const n=anchor.parent.position.clone().normalize();const yaw=Math.atan2(viewDirection.x,viewDirection.z)-Math.atan2(n.x,n.z);const nearest=rotation+Math.atan2(Math.sin(yaw-rotation),Math.cos(yaw-rotation));temporary.copy(n).applyAxisAngle(new THREE.Vector3(0,1,0),nearest);targetRotation=nearest;const desired=Math.atan2(temporary.y,temporary.z)-Math.atan2(viewDirection.y,viewDirection.z);targetTilt=tilt+Math.atan2(Math.sin(desired-tilt),Math.cos(desired-tilt));targetDistance=baseDistance-1.0;}
  window.addEventListener('shuge:navigate',e=>focusRoute(e.detail.route));
  window.addEventListener('scroll',()=>{dirty=true;},{passive:true});
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function hit(e){const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const first=raycaster.intersectObjects([planet,...clickables],false)[0];return first?.object.userData.route;}
  function navigate(key){if(key==='portal'){const effect=$('#portal-transition');effect.classList.add('active');targetDistance=Math.max(11.7,baseDistance-2.5);setTimeout(()=>{location.hash='work';effect.classList.remove('active');},reduced?0:520);}else if(key)location.hash=key;}
  function begin(e){if(e.button!==0||!e.isPrimary||drag)return;setRide(false);velocityX=velocityY=0;suppressClick=null;drag={id:e.pointerId,source:e.currentTarget,x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY,t:e.timeStamp,yaw:targetRotation,pitch:targetTilt,moved:false,touch:e.pointerType!=='mouse'};drag.source.setPointerCapture(e.pointerId);host.classList.add('dragging');}
  function move(e){if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>4)drag.moved=true;if(!drag.moved)return;const gain=drag.touch?.010:.007,dt=Math.max((e.timeStamp-drag.t)/1000,.008);velocityX=THREE.MathUtils.clamp((e.clientX-drag.px)*gain/dt,-1.3,1.3);velocityY=THREE.MathUtils.clamp((e.clientY-drag.py)*gain/dt,-1.3,1.3);drag.px=e.clientX;drag.py=e.clientY;drag.t=e.timeStamp;targetRotation=drag.yaw+dx*gain;targetTilt=drag.pitch+dy*gain;rotation=targetRotation;tilt=targetTilt;dirty=true;}
  function end(e){if(!drag||e.pointerId!==drag.id)return;const previous=drag;drag=null;host.classList.remove('dragging');if(previous.moved&&previous.source!==host)suppressClick=previous.source;if(!previous.moved){velocityX=velocityY=0;if(previous.source===host&&e.type==='pointerup')navigate(hit(e));}if(e.type!=='pointerup'||paused)velocityX=velocityY=0;}
  for(const surface of [host,...document.querySelectorAll('[data-hotspot]')]){surface.addEventListener('pointerdown',begin);surface.addEventListener('pointermove',move);for(const name of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(name,end);if(surface!==host)surface.addEventListener('click',e=>{if(suppressClick===surface){e.preventDefault();e.stopImmediatePropagation();suppressClick=null;}},true);}
  host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();setRide(false);velocityX=velocityY=0;if(e.key==='ArrowLeft')targetRotation-=.25;if(e.key==='ArrowRight')targetRotation+=.25;if(e.key==='ArrowUp')targetTilt-=.25;if(e.key==='ArrowDown')targetTilt+=.25;dirty=true;});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;fallback();});
  const point=new THREE.Vector3(),normal=new THREE.Vector3(),center=new THREE.Vector3(),eye=new THREE.Vector3();
  function labels(){const r=host.getBoundingClientRect(),u=$('#universe').getBoundingClientRect(),panelOpen=document.body.classList.contains('panel-open');world.getWorldPosition(center);eye.copy(camera.position).sub(center).normalize();const occupied=[];for(const a of document.querySelectorAll('[data-hotspot]')){landmarks[a.dataset.hotspot].getWorldPosition(point);normal.copy(point).sub(center).normalize();const front=normal.dot(eye)>.16;point.project(camera);const x=r.left+(point.x+1)*r.width/2,y=r.top+(1-point.y)*r.height/2;const overlap=occupied.some(p=>Math.abs(p.x-x)<115&&Math.abs(p.y-y)<42);const valid=!panelOpen&&front&&!overlap&&x>(innerWidth<761?25:innerWidth*.4)&&x<innerWidth-115&&y>(innerWidth<761?350:125)&&y<innerHeight-(innerWidth<761?130:150);a.classList.toggle('visible',valid);a.inert=!valid;a.setAttribute('aria-hidden',String(!valid));a.style.left=x-u.left+'px';a.style.top=y-u.top+'px';if(valid)occupied.push({x,y});}}
  const tangent=new THREE.Vector3(),radial=new THREE.Vector3(),side=new THREE.Vector3(0,-1,0),basis=new THREE.Matrix4();
  function frame(now){requestAnimationFrame(frame);if(document.hidden||voyageOpen){last=now;return;}const dt=Math.min((now-last)/1000,.05)||0;last=now;
    const moving=Math.abs(targetRotation-rotation)+Math.abs(targetTilt-tilt)+Math.abs(targetDistance-distance)>.0006;
    if(paused&&!ride&&!moving&&!dirty&&dirtyFrames<=0)return;dirty=false;if(dirtyFrames>0)dirtyFrames--;
    if(!paused)elapsed+=dt;if(!drag&&!ride&&!paused){targetRotation+=velocityX*dt;targetTilt+=velocityY*dt;velocityX*=Math.exp(-dt*4.7);velocityY*=Math.exp(-dt*4.7);}
    if(ride){const p=Math.min((now-rideStart)/24000,1),smooth=p*p*(3-2*p);targetRotation=rideBase+smooth*Math.PI*2;targetTilt=-.07+Math.sin(p*Math.PI*2)*.12;const names=['校园 · 学习与生长','创作馆 · 让想法发生','实验馆 · 好奇心的形状','日常 · 兴趣与远方'];setCaption(names[Math.min(3,Math.floor(p*4))]);if(p===1)setRide(false);}
    const ease=drag||reduced?1:1-Math.exp(-dt*5.6);rotation+=(targetRotation-rotation)*ease;tilt+=(targetTilt-tilt)*ease;distance+=(targetDistance-distance)*ease;world.rotation.set(tilt,rotation,0);
    camera.position.copy(viewDirection).multiplyScalar(distance);camera.lookAt(0,.18,0);
    const a=elapsed*.15;radial.set(Math.cos(a),0,Math.sin(a));tangent.set(-Math.sin(a),0,Math.cos(a));tram.position.copy(radial).multiplyScalar(3.15);basis.makeBasis(side,radial,tangent);tram.quaternion.setFromRotationMatrix(basis);loops.rotation.y=elapsed*.17;
    garden.update(elapsed);backdrop.update(elapsed);composer.render();labels();
    frames++;totalFrameTime+=dt;if(dt>.034&&!drag)slowFrames++;if(!autoDowngraded&&high&&frames>210&&slowFrames>105){autoDowngraded=true;quality(false,true);}
    if(frames%12===0){host.dataset.rotation=rotation.toFixed(3);host.dataset.tilt=tilt.toFixed(3);host.dataset.distance=distance.toFixed(2);host.dataset.lastPassDrawCalls=String(renderer.info.render.calls);host.dataset.lastPassTriangles=String(renderer.info.render.triangles);host.dataset.fps=(frames/Math.max(.1,totalFrameTime)).toFixed(0);}
  }
  host.dataset.ready='true';host.dataset.renderer='odyssey-three-r180';host.dataset.paused=String(paused);host.dataset.sceneVersion='3';host.dataset.vegetation=String(garden.counts.grass);$('#scene-loading').hidden=true;notify('scene-ready');
  if(location.hash)focusRoute(location.hash.slice(1));requestAnimationFrame(frame);
}
