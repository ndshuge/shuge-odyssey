import * as THREE from './vendor/three.module.js';
import {createSeedPlanet,seedFromText} from './star-forge.js';

// An authored orrery, not a simulation of real astronomical bodies.
export function orbitPosition(index,time=0,target=new THREE.Vector3()){
  const angle=index*2.39996323+time*(.024+index*.002);
  const radius=2.35+index*.51;
  return target.set(Math.cos(angle)*radius,Math.sin(angle*2+index)*.28,Math.sin(angle)*radius*.72);
}
export function createAtlas(projects){
  const group=new THREE.Group(),systems=[],orbits=[],targets=[];
  group.name='Curiosity Orrery';
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.74,3),new THREE.MeshStandardMaterial({color:'#edbd91',emissive:'#d28a54',emissiveIntensity:.3,roughness:.45,metalness:.28}));
  group.add(core);
  const meridians=new THREE.Group();group.add(meridians);
  for(let k=0;k<3;k++){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.04+k*.15,.009,5,100),new THREE.MeshBasicMaterial({color:k===1?'#b5dbcf':'#f0d3ac',transparent:true,opacity:.65}));
    ring.rotation.set(k*.7,.35+k*.6,.2+k*.9);meridians.add(ring);
  }
  const p=new THREE.Vector3();
  projects.forEach((project,i)=>{
    const radius=2.35+i*.51,points=[];
    for(let j=0;j<=160;j++){const a=j/160*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius*.72));}
    const orbit=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#9ab9b4',transparent:true,opacity:.19}));group.add(orbit);orbits.push(orbit);
    const planet=createSeedPlanet({seed:seedFromText(project.id),kind:['reef','halo','mineral'][i%3],detail:.45});
    planet.group.name=project.id;planet.group.scale.setScalar(.27+(i%3)*.045);planet.group.position.copy(orbitPosition(i,0,p));
    group.add(planet.group);systems.push(planet);
    const target=new THREE.Mesh(new THREE.SphereGeometry(1.5,8,6),new THREE.MeshBasicMaterial({visible:false}));
    target.userData.project=i;planet.group.add(target);targets.push(target);
  });
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:'#eec8a2',transparent:true,opacity:.6}));group.add(line);
  let selected=0;
  function select(index){selected=THREE.MathUtils.clamp(index,0,systems.length-1);orbits.forEach((r,i)=>r.material.opacity=i===selected?.58:.14);}
  function update(time,dt=1){
    core.rotation.y=time*.08;meridians.rotation.y=time*.055;
    systems.forEach((system,i)=>{orbitPosition(i,time,system.group.position);system.update(time);const scale=(.27+(i%3)*.045)*(i===selected?1.28:1);system.group.scale.lerp(new THREE.Vector3(scale,scale,scale),Math.min(1,dt*6));});
    if(systems[selected]){const arr=line.geometry.attributes.position;arr.setXYZ(1,...systems[selected].group.position.toArray());arr.needsUpdate=true;line.geometry.computeBoundingSphere();}
  }
  select(0);update(0);
  return {group,systems,targets,select,update,get selected(){return selected;},dispose(){targets.forEach(t=>{t.geometry.dispose();t.material.dispose();});systems.forEach(s=>s.dispose());const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());group.clear();}};
}
