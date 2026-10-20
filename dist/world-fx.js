import * as THREE from './vendor/three.module.js';

const clockUniform={value:0};
const vertex=`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
export function decoratePlanet(model,{mobile=false}={}) {
  const {world,R,planet,water,portalInner,materials,helpers,campus,cottage,lab,workshop}=model;
  let seed=1947;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const day={value:0};
  planet.material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vGardenPos;').replace('#include <begin_vertex>','#include <begin_vertex>\nvGardenPos=position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vGardenPos;
      float grain(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,41.718)))*43758.5453);}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
      float field=sin(vGardenPos.x*7.+sin(vGardenPos.z*6.))*sin(vGardenPos.y*8.-vGardenPos.z*3.);
      float contour=smoothstep(.91,.98,sin(field*24.+vGardenPos.y*9.));
      diffuseColor.rgb*=.94+grain(floor(vGardenPos*180.))*.12;
      diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*1.13,contour*.3);`);
  };
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(R*1.045,72,48),new THREE.ShaderMaterial({
    uniforms:{uDay:day},side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vec4 p=modelMatrix*vec4(position,1.);vP=p.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*p;}`,
    fragmentShader:`uniform float uDay;varying vec3 vN;varying vec3 vP;void main(){vec3 eye=normalize(cameraPosition-vP);float f=pow(1.-abs(dot(normalize(vN),eye)),3.);vec3 c=mix(vec3(.16,.48,.46),vec3(.26,.53,.54),uDay);gl_FragColor=vec4(c,f*.48);}`
  }));world.add(atmosphere);
  const waterMat=new THREE.ShaderMaterial({uniforms:{uTime:clockUniform,uDay:day},vertexShader:vertex,fragmentShader:`
    uniform float uTime;uniform float uDay;varying vec2 vUv;
    void main(){vec2 p=vUv*2.-1.;float wave=sin(p.x*31.+p.y*18.+uTime*1.1)+sin(p.y*47.-p.x*8.-uTime*.7);
      float shine=pow(max(0.,sin(p.x*19.+p.y*37.+wave*.6+uTime*.4)),16.);
      vec3 c=mix(vec3(.045,.21,.24),vec3(.12,.39,.43),.5+wave*.13);
      c+=vec3(.62,.78,.66)*shine*.28;c+=vec3(.07,.1,.08)*uDay;
      gl_FragColor=vec4(c,1.);}`});water.material=waterMat;
  portalInner.material=new THREE.ShaderMaterial({uniforms:{uTime:clockUniform},vertexShader:vertex,fragmentShader:`
    uniform float uTime;varying vec2 vUv;
    void main(){vec2 p=vUv*2.-1.;float r=length(p);float a=atan(p.y,p.x);float spiral=sin(a*3.+r*18.-uTime*1.6);
      float ring=pow(max(0.,1.-abs(r-.77)*8.),2.);float core=exp(-r*6.);
      vec3 c=vec3(.025,.07,.10)+vec3(.13,.58,.48)*pow(max(0.,spiral),5.)*r;
      c+=vec3(.58,1.,.75)*ring*.9+vec3(1.3,.58,.26)*core;
      float stars=pow(max(0.,sin(p.x*72.+p.y*31.)*cos(p.y*66.-p.x*23.)),35.);c+=stars*.7;
      gl_FragColor=vec4(c,1.);}`});
  // Shared instanced vegetation: detail grows without hundreds of extra draws.
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.023,.038,.28,6),materials.wood,74);
  const leafMat=new THREE.MeshStandardMaterial({color:'#789576',roughness:.92});
  leafMat.onBeforeCompile=s=>{s.uniforms.uTime=clockUniform;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x+=sin(uTime*.65+instanceMatrix[3].x*3.)*.025*(position.y+.3);');};
  const leaves=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.18,1),leafMat,74*4),dummy=new THREE.Object3D(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
  let treeCount=0,leafCount=0;const occupied=[campus,cottage,lab,workshop,model.portal,model.sculpture].map(g=>g.position.clone().normalize());
  for(let attempt=0;treeCount<74&&attempt<500;attempt++){
    const y=random()*1.88-.94,a=random()*Math.PI*2,n=new THREE.Vector3(Math.cos(a)*Math.sqrt(1-y*y),y,Math.sin(a)*Math.sqrt(1-y*y));
    if(Math.abs(y)<.13||occupied.some(v=>v.dot(n)>.93))continue;
    q.setFromUnitVectors(up,n);const scale=.7+random()*.65;dummy.quaternion.copy(q);dummy.scale.setScalar(scale);dummy.position.copy(n).multiplyScalar(R+.13*scale);dummy.updateMatrix();trunks.setMatrixAt(treeCount,dummy.matrix);
    for(let j=0;j<4;j++){const offset=new THREE.Vector3(Math.sin(j*2.4)*.10,.35+Math.cos(j)*.06,Math.cos(j*2.4)*.10).multiplyScalar(scale).applyQuaternion(q);dummy.position.copy(n).multiplyScalar(R).add(offset);dummy.scale.set(scale*.9,scale*(1.05+random()*.25),scale*.9);dummy.updateMatrix();leaves.setMatrixAt(leafCount,dummy.matrix);leaves.setColorAt(leafCount,new THREE.Color(['#64866c','#91a078','#b2b58b','#4e7664'][treeCount%4]));leafCount++;}treeCount++;
  }
  trunks.count=treeCount;leaves.count=leafCount;trunks.castShadow=true;leaves.castShadow=true;leaves.receiveShadow=true;world.add(trunks,leaves);
  const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.016,0,0,.016,0,0,0,.12,.018],3));blade.computeVertexNormals();
  const grassMat=new THREE.MeshStandardMaterial({color:'#92a97b',roughness:1,side:THREE.DoubleSide});grassMat.onBeforeCompile=s=>{s.uniforms.uTime=clockUniform;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x+=sin(uTime+instanceMatrix[3].x*4.+instanceMatrix[3].z*3.)*.035*position.y/.12;');};
  const grass=new THREE.InstancedMesh(blade,grassMat,mobile?1400:3600);let count=0;
  for(let i=0;i<grass.count;i++){const y=random()*2.-1.,a=random()*Math.PI*2,n=new THREE.Vector3(Math.cos(a)*Math.sqrt(1-y*y),y,Math.sin(a)*Math.sqrt(1-y*y));if(Math.abs(y)<.08||occupied.some(v=>v.dot(n)>.96))continue;dummy.position.copy(n).multiplyScalar(R+.015);dummy.quaternion.setFromUnitVectors(up,n);dummy.rotateY(random()*6.28);dummy.scale.setScalar(.45+random()*.55);dummy.updateMatrix();grass.setMatrixAt(count,dummy.matrix);grass.setColorAt(count,new THREE.Color().setHSL(.21+random()*.07,.18,.35+random()*.2));count++;}grass.count=count;world.add(grass);
  const flowers=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.027,1),new THREE.MeshStandardMaterial({color:'#dfbd9a',roughness:.9}),220);count=0;
  for(let i=0;i<220;i++){const n=new THREE.Vector3(random()-.5,random()-.5,random()-.5).normalize();if(occupied.some(v=>v.dot(n)>.97))continue;dummy.position.copy(n).multiplyScalar(R+.05);dummy.scale.setScalar(.8+random()*.5);dummy.updateMatrix();flowers.setMatrixAt(count,dummy.matrix);flowers.setColorAt(count,new THREE.Color(i%4?'#ddcda5':'#cc8b76'));count++;}flowers.count=count;world.add(flowers);
  // Architectural details: roof ridges, masonry, gardens and warm path lanterns.
  for(const g of [campus,cottage,workshop]){for(let i=-3;i<=3;i++){const ridge=helpers.box(.025,.025,g===campus?.65:.8,materials.wood,g,i*.12,g===campus?.76:.64,0);ridge.rotation.z=0;} }
  const lamps=[];
  for(let i=0;i<15;i++){const a=i/15*Math.PI*2,n=new THREE.Vector3(Math.cos(a)*.7,1,Math.sin(a)*.7).normalize();if(occupied.some(v=>v.dot(n)>.98))continue;const g=helpers.surface(n.x,n.y,n.z,.015);helpers.cyl(.012,.018,.17,materials.metal,g,0,.085,0);const bulb=helpers.sphere(.037,model.windowMat,g,0,.19,0,1,1.3,1);lamps.push(bulb);}
  // Small orbiting islands extend the world beyond the globe without enclosing it.
  const islands=[];for(let i=0;i<2;i++){const g=new THREE.Group();g.position.set(i?3.8:-3.9,i?1.6:-.8,i?-1.3:1.1);g.rotation.z=i?-.2:.2;const rock=new THREE.Mesh(new THREE.ConeGeometry(.36,.65,6),materials.stone);rock.rotation.z=Math.PI;g.add(rock);helpers.cyl(.4,.36,.09,materials.sage,g,0,.34,0);const loop=helpers.torus(.23,.02,materials.cream,g,0,.7,0);loop.rotation.y=.3;world.add(g);islands.push(g);}
  return {setDay(value){day.value=value?1:0;},setQuality(high){grass.visible=high;flowers.visible=high;},update(t){clockUniform.value=t;islands.forEach((g,i)=>{g.position.y=(i?1.6:-.8)+Math.sin(t*.4+i*2)*.055;});},counts:{trees:treeCount,grass:grass.count,flowers:flowers.count}};
}

export function createBackdrop(scene,dpr=1){
  let seed=882;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const pos=[],scales=[],colors=[];for(let i=0;i<2200;i++){const a=random()*Math.PI*2,r=18+random()*35,y=(random()-.5)*42;pos.push(Math.cos(a)*r,y,Math.sin(a)*r);scales.push(.5+Math.pow(random(),6)*2.8);const c=new THREE.Color().setHSL(.12+random()*.07,.15,.65+random()*.3);colors.push(c.r,c.g,c.b);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('aSize',new THREE.Float32BufferAttribute(scales,1));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const material=new THREE.ShaderMaterial({uniforms:{uTime:clockUniform,uOpacity:{value:.75},uDpr:{value:Math.min(dpr,1.6)}},vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aSize;uniform float uTime;uniform float uDpr;varying vec3 vColor;varying float vPulse;void main(){vColor=color;vPulse=.7+.3*sin(uTime*.35+position.x*7.);vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=aSize*uDpr*1.5;}`,
    fragmentShader:`uniform float uOpacity;varying vec3 vColor;varying float vPulse;void main(){float d=length(gl_PointCoord-.5)*2.;float a=exp(-d*d*5.);if(a<.01)discard;gl_FragColor=vec4(vColor,a*vPulse*uOpacity);}`});
  const stars=new THREE.Points(geo,material);scene.add(stars);
  const orbit=new THREE.Group();orbit.rotation.z=-.3;scene.add(orbit);
  const curve=new THREE.EllipseCurve(0,0,5.6,3.9,.15,Math.PI*1.65,false,.2);const points=curve.getPoints(180).map(v=>new THREE.Vector3(v.x,v.y,-1.8));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color:'#668f89',transparent:true,opacity:.22,dashSize:.04,gapSize:.15}));line.computeLineDistances();orbit.add(line);
  return {setDay(value){material.uniforms.uOpacity.value=value?.14:.75;line.material.opacity=value?.14:.22;},update(t){stars.rotation.y=t*.0018;orbit.rotation.y=Math.sin(t*.035)*.08;}};
}
