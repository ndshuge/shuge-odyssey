// Lifecycle and deterministic orrery checks. The renderer is a CPU stub, not GPU proof.
import * as Three from '../dist/vendor/three.module.js';
import {createAtlas,orbitPosition} from '../dist/voyage-model.js';
import {createSeedPlanet,drawStarPostcard} from '../dist/star-forge.js';
import {createBackdrop} from '../dist/world-fx.js';
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const checks=[],projects=Array.from({length:7},(_,i)=>({id:'project-'+i,title:'Project '+i,live:'https://example.com/'+i,source:'https://example.com/'+i}));
const atlas=createAtlas(projects);assert.equal(atlas.systems.length,7);atlas.update(1,.016);atlas.group.updateMatrixWorld();
for(let i=0;i<7;i++){assert(atlas.systems[i].group.position.distanceTo(orbitPosition(i,1))<1e-8);assert(atlas.targets[i].matrixWorld.elements.every(Number.isFinite));}
checks.push('All seven projects have deterministic finite orbital destinations');atlas.select(4);assert.equal(atlas.selected,4);atlas.update(8,.016);atlas.select(99);assert.equal(atlas.selected,6);checks.push('Selection clamps to available projects');atlas.dispose();assert.equal(atlas.group.children.length,0);checks.push('Atlas resources detach on disposal');
const elements=new Map(),events=new Map();let frame,renderCount=0,rendererCount=0,ui;
function elem(id){return {id,dataset:{},hidden:false,clientWidth:1280,clientHeight:720,style:{},children:[],handlers:{},classList:{add(){},remove(){}},append(...items){this.children.push(...items)},prepend(item){this.children.unshift(item)},setAttribute(k,v){this[k]=String(v)},addEventListener(k,f){this.handlers[k]=f},getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight}},setPointerCapture(){},focus(){},select(){}};}
const $=s=>{if(!elements.has(s))elements.set(s,elem(s));return elements.get(s)};
const document={querySelector:$,createElement:tag=>elem(tag),body:{dataset:{motion:'running'},classList:{remove(){}}},hidden:false};
class Renderer{constructor(){rendererCount++;this.domElement=elem('canvas');this.info={render:{calls:12,triangles:1000}};this.debug={};}setClearColor(){}setPixelRatio(){}setSize(){}render(scene,camera){renderCount++;scene.updateMatrixWorld();camera.updateMatrixWorld();}}
const context={THREE:{...Three,WebGLRenderer:Renderer},createAtlas,createSeedPlanet,drawStarPostcard,createBackdrop,
initVoyageUI(){const state={mode:'home',index:0,paused:false};ui={getState:()=>state,setMode:m=>state.mode=m,setSeed:s=>Object.assign(state,s),selectProject:i=>state.index=i,setAvailability(){}};return ui;},
document,window:{SHUGE_PROJECTS:Object.fromEntries(projects.map(p=>[p.id,p])),addEventListener:(k,f)=>events.set(k,f),dispatchEvent:e=>events.get(e.type)?.(e)},
localStorage:{getItem:()=>null,setItem(){}},location:{hash:'',pathname:'/',search:''},history:{replaceState(){}},URL,URLSearchParams,
matchMedia:()=>({matches:false}),devicePixelRatio:1,innerWidth:1280,performance,Event,requestAnimationFrame:f=>frame=f,
ResizeObserver:class{constructor(f){this.f=f}observe(){this.f()}},setTimeout,clearTimeout,navigator:{},console,
CustomEvent:class{constructor(type,{detail}={}){this.type=type;this.detail=detail}}};
const source=fs.readFileSync(new URL('../dist/voyage.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'');
vm.runInNewContext(source,context,{filename:'voyage.js'});assert.equal(rendererCount,0);checks.push('Second WebGL renderer is lazy: no allocation on homepage');
const emit=(name,detail)=>events.get('shuge:'+name)?.({detail});let now=performance.now();function frames(n=120){for(let i=0;i<n;i++){now+=16.7;frame(now);}}
emit('voyage',{mode:'atlas'});frames();assert.equal($('#voyage-scene').dataset.ready,'true');assert.equal(rendererCount,1);assert.equal($('#universe').inert,true);checks.push('Entering atlas initializes renderer and protects background focus');
emit('project',{index:4});frames(1);assert.equal($('#voyage-scene').dataset.selected,'4');checks.push('Project controls reach the corresponding orbital selection');
emit('voyage-motion',{paused:true});frames(180);let count=renderCount;frames(50);assert.equal(renderCount,count);checks.push('Stable paused voyage stops renderer calls');
emit('forge',{seed:0,kind:'halo',title:'零号星'});assert.equal($('#voyage-scene').dataset.seed,'0');emit('voyage',{mode:'forge'});frames(180);assert.equal($('#voyage-scene').dataset.kind,'halo');checks.push('Seed zero and requested kind survive UI to model');
emit('motion',{paused:true});frames(180);count=renderCount;frames(30);assert.equal(renderCount,count);checks.push('Shared homepage pause is respected by new engine');
emit('voyage-motion',{paused:false});frames(2);assert(renderCount>count);checks.push('Resume restarts rendering');document.hidden=true;count=renderCount;frames(30);assert.equal(renderCount,count);document.hidden=false;checks.push('Hidden document stops voyage rendering');
emit('voyage',{mode:'home'});count=renderCount;frames(50);assert.equal(renderCount,count);assert.equal($('#universe').inert,false);checks.push('Returning home stops voyage GPU work and restores original controls');
emit('voyage',{mode:'atlas'});frames(2);assert.equal(rendererCount,1);checks.push('Reopening reuses the owned renderer');
const result={scope:'CPU-only orrery and mode lifecycle with renderer/DOM stubs; browser pixels and GPU compilation are separate evidence',passed:checks.length,failed:0,checks};
fs.writeFileSync(new URL('../evidence/voyage-cpu.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
