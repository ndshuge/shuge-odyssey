import * as THREE from './vendor/three.module.js';
import { RoundedBoxGeometry } from './vendor/addons/geometries/RoundedBoxGeometry.js';

// Authored miniature architecture, derived from the owner's second edition.
export function createPlanet() {
  const world=new THREE.Group();
  const geometryCache=new Map();
  function roundedBox(w,h,d) {const key=[w,h,d].join(':');if(!geometryCache.has(key))geometryCache.set(key,new RoundedBoxGeometry(w,h,d,1,Math.min(w,h,d)*.09));return geometryCache.get(key);}
  const R=3.05,up=new THREE.Vector3(0,1,0),clickables=[],landmarks={},glows=[];
  const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
  const grass=mat('#809d77'),edge=mat('#5c7962'),cream=mat('#e9dfc1'),roof=mat('#b96345'),wood=mat('#805d45'),dark=mat('#233e3d'),sage=mat('#95b19b'),metal=mat('#527570',.5),stone=mat('#b9b99a'),pink=mat('#dc9c83');
  const windowMat=new THREE.MeshStandardMaterial({color:'#f5ca84',emissive:'#eaa04e',emissiveIntensity:.85,roughness:.3});
  function mesh(geometry,material,parent=world){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function box(w,h,d,material,parent,x=0,y=0,z=0){const m=mesh(roundedBox(w,h,d),material,parent);m.position.set(x,y,z);return m;}
  function sphere(r,material,parent,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=mesh(new THREE.SphereGeometry(r,18,12),material,parent);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m;}
  function cyl(a,b,h,material,parent,x=0,y=0,z=0){const m=mesh(new THREE.CylinderGeometry(a,b,h,20),material,parent);m.position.set(x,y,z);return m;}
  function torus(r,t,material,parent,x=0,y=0,z=0){const m=mesh(new THREE.TorusGeometry(r,t,8,64),material,parent);m.position.set(x,y,z);return m;}
  function surface(x,y,z,height=0,parent=world){const g=new THREE.Group(),v=new THREE.Vector3(x,y,z).normalize();g.position.copy(v).multiplyScalar(R+height);g.quaternion.setFromUnitVectors(up,v);parent.add(g);return g;}
  function register(group,route,name){group.userData.route=route;group.traverse(o=>{if(o.isMesh){o.userData.route=route;clickables.push(o);}});const anchor=new THREE.Object3D();anchor.position.y=name==='campus'?1.4:1.1;group.add(anchor);landmarks[name||route]=anchor;}
  const geo=new THREE.SphereGeometry(R,100,64),colors=[],pos=geo.attributes.position,c=new THREE.Color();
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),n=Math.sin(x*3.2+z*2)*Math.sin(y*4.3-z*1.8)*.5+.5;c.set(n>.72?'#91a17c':n>.45?'#829a76':n>.2?'#73916f':'#64876d');colors.push(c.r,c.g,c.b);const k=1+Math.sin(x*4+y*3)*Math.sin(z*3-y*5)*.009;pos.setXYZ(i,x*k,y*k,z*k);}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const planet=mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));
  // A tiny lake, stepping paths, and a tram line are all fitted to the sphere.
  const lake=surface(-.8,.8,1.4,.025);const water=mesh(new THREE.CircleGeometry(.53,48),new THREE.MeshStandardMaterial({color:'#518e95',metalness:.28,roughness:.2}),lake);water.rotation.x=-Math.PI/2;water.scale.set(.66,1,1);
  for(let k=0;k<3;k++){const ripple=torus(.17+k*.09,.008,sage,lake,0,.012,0);ripple.rotation.x=Math.PI/2;ripple.scale.x=.66;}
  const track=new THREE.Group();track.rotation.z=-.19;track.rotation.x=.22;world.add(track);
  for(const r of [3.11,3.19]){const rail=torus(r,.018,metal,track);rail.rotation.x=Math.PI/2;}
  for(let i=0;i<84;i++){const a=i/84*Math.PI*2,sleeper=box(.16,.045,.055,wood,track,Math.cos(a)*3.15,0,Math.sin(a)*3.15);sleeper.rotation.y=-a;}
  function path(a,b,steps=12){for(let i=0;i<=steps;i++){const v=new THREE.Vector3().lerpVectors(a,b,i/steps).normalize(),g=surface(v.x,v.y,v.z,.03);const p=box(.16,.035,.21,stone,g);p.rotation.y=i*.15;}}
  path(new THREE.Vector3(.1,1,1),new THREE.Vector3(-1,1,.4),10);path(new THREE.Vector3(.1,1,1),new THREE.Vector3(1,1,.4),10);path(new THREE.Vector3(.1,1,1),new THREE.Vector3(0,1,-.8),12);
  function house(parent,{w=.72,h=.6,d=.64,rooftop=roof,wall=cream}={}){
    box(w,h,d,wall,parent,0,h/2,0);box(w+.06,.06,d+.06,stone,parent,0,.035,0);
    const shape=new THREE.Shape();shape.moveTo(-w*.58,0);shape.lineTo(0,w*.42);shape.lineTo(w*.58,0);shape.closePath();const r=mesh(new THREE.ExtrudeGeometry(shape,{depth:d+.16,bevelEnabled:false}),rooftop,parent);r.position.set(0,h,-d/2-.08);
    box(.17,.32,.025,wood,parent,0,.18,d/2+.02);sphere(.012,windowMat,parent,.045,.19,d/2+.04);
    for(const x of [-w*.32,w*.32]){box(.14,.2,.03,wood,parent,x,h*.65,d/2+.02);box(.105,.155,.035,windowMat,parent,x,h*.65,d/2+.04);box(.012,.17,.02,cream,parent,x,h*.65,d/2+.062);}
    box(.13,.25,.15,cream,parent,w*.27,h+.12,-d*.2);return parent;
  }
  const campus=surface(-.65,1,.02,.01);campus.rotation.y=.3;
  const hall=new THREE.Group();campus.add(hall);house(hall,{w:1.08,h:.7,d:.55});
  for(const x of [-.92,.92]){const wing=new THREE.Group();wing.position.set(x,0,-.05);wing.rotation.y=x>0?-.22:.22;campus.add(wing);house(wing,{w:.65,h:.58,d:.53});}
  const tower=new THREE.Group();tower.position.set(0,0,-.4);campus.add(tower);box(.35,1.2,.34,cream,tower,0,.6,0);const spire=mesh(new THREE.ConeGeometry(.3,.45,4),roof,tower);spire.position.y=1.42;spire.rotation.y=Math.PI/4;const clock=mesh(new THREE.CircleGeometry(.105,24),cream,tower);clock.position.set(0,1,.176);box(.012,.07,.012,dark,tower,0,1.025,.185);box(.065,.012,.012,dark,tower,.026,1,.188);
  for(const x of [-.31,0,.31])cyl(.035,.035,.38,cream,campus,x,.22,.48);
  box(.92,.07,.17,cream,campus,0,.44,.48);for(let i=0;i<3;i++)box(1.02+i*.06,.055,.16,stone,campus,0,.08-i*.022,.57+i*.1);
  register(campus,'campus','campus');
  const cottage=surface(1,1,.48);cottage.rotation.y=.1;house(cottage,{w:.76,h:.57,d:.64,wall:mat('#d2ac7e')});box(.65,.06,.36,wood,cottage,0,.04,.5);for(const x of [-.35,.35]){cyl(.018,.018,.65,cream,cottage,x,.32,.63);box(.08,.025,.27,cream,cottage,x,.5,.5);}box(.85,.055,.45,roof,cottage,0,.73,.42);cyl(.17,.19,.13,stone,cottage,.65,.07,.25);sphere(.22,sage,cottage,.65,.29,.25);register(cottage,'life','life');
  const workshop=surface(.18,.63,1);workshop.rotation.y=-.1;house(workshop,{w:.8,h:.62,d:.65,wall:mat('#cc8763'),rooftop:metal});box(.44,.26,.04,dark,workshop,0,.51,.35);box(.35,.15,.05,windowMat,workshop,0,.51,.375);for(let i=0;i<3;i++)box(.025,.17,.015,wood,workshop,-.1+i*.1,.51,.408);const antenna=cyl(.012,.012,.45,metal,workshop,.3,1.06,-.12);sphere(.05,pink,workshop,.3,1.3,-.12);register(workshop,'work','work');
  const lab=surface(.38,1,-.64);lab.rotation.y=.4;cyl(.5,.53,.4,cream,lab,0,.2,0);const dome=mesh(new THREE.SphereGeometry(.51,32,18,0,Math.PI*2,0,Math.PI/2),metal,lab);dome.position.y=.4;box(.055,.5,1.04,cream,lab,0,.48,0);box(.23,.3,.04,dark,lab,0,.18,.51);const telescope=cyl(.07,.11,.5,cream,lab,.25,.8,.1);telescope.rotation.z=-.55;for(const x of [-.72,.72]){cyl(.025,.025,.37,metal,lab,x,.2,0);const panel=box(.37,.035,.5,dark,lab,x,.4,0);panel.rotation.z=x>0?-.25:.25;for(let j=0;j<3;j++){const stripe=box(.008,.008,.49,metal,panel,-.12+j*.12,.025,0);}}
  register(lab,'lab','lab');
  // The mouse-shaped portal is a sculptural doorway into the project collection.
  const portal=surface(-.55,.3,1);portal.rotation.y=-.1;torus(.38,.075,cream,portal,0,.45,.03);torus(.19,.055,cream,portal,-.3,.79,.03);torus(.19,.055,cream,portal,.3,.79,.03);const portalGlow=new THREE.MeshBasicMaterial({color:'#90cbb5'});const pg=mesh(new THREE.CircleGeometry(.32,48),portalGlow,portal);pg.position.set(0,.45,.02);glows.push(pg);const inner=mesh(new THREE.CircleGeometry(.285,48),dark,portal);inner.position.set(0,.45,.03);for(let i=0;i<3;i++)box(.78+i*.1,.06,.2,stone,portal,0,.04-i*.025,.14+i*.13);register(portal,'portal','portal');
  // A little character: no portrait or personal likeness is implied.
  const mouse=surface(.7,.38,1.1,.05);mouse.rotation.y=-.45;sphere(.14,cream,mouse,0,.2,0,1,1.3,.8);sphere(.14,cream,mouse,0,.4,.02,1,.9,.9);for(const x of [-.11,.11]){sphere(.086,cream,mouse,x,.5,.01);sphere(.055,pink,mouse,x,.505,.052,1,1,.35);sphere(.014,dark,mouse,x*.52,.42,.14);sphere(.06,wood,mouse,x*.65,.065,.04,1,.5,1.4);}sphere(.023,pink,mouse,0,.37,.157);box(.16,.2,.08,roof,mouse,0,.24,-.12);const tail=torus(.16,.015,pink,mouse,.13,.1,-.13);tail.rotation.x=.6;
  const sculpture=surface(-.9,.88,-.75);const pedestal=cyl(.32,.38,.16,stone,sculpture,0,.08,0);const loops=new THREE.Group();loops.position.y=.62;sculpture.add(loops);for(let i=0;i<3;i++){const t=torus(.4,.025,i%2?roof:cream,loops);t.rotation.x=i*Math.PI/3;t.rotation.y=i*.65;}sphere(.085,windowMat,loops);register(sculpture,'lab','sculpture');
  const tram=new THREE.Group();track.add(tram);box(.23,.22,.47,roof,tram,0,.16,0);box(.235,.16,.33,cream,tram,0,.34,-.02);box(.27,.04,.53,metal,tram,0,.45,0);for(const z of [-.11,.08])for(const x of [-.125,.125])box(.012,.1,.12,windowMat,tram,x,.35,z);for(const z of [-.16,.16]){const wheel=cyl(.055,.055,.28,dark,tram,0,.08,z);wheel.rotation.z=Math.PI/2;}box(.14,.1,.02,windowMat,tram,0,.22,.245);

  return {world,R,planet,lake,water,campus,cottage,workshop,lab,portal,portalInner:inner,portalGlow:pg,mouse,sculpture,loops,track,tram,windowMat,landmarks,clickables,materials:{cream,roof,wood,dark,sage,metal,stone,pink},helpers:{surface,mesh,box,sphere,cyl,torus}};
}
