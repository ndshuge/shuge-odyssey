/* Deterministic model and postcard command checks. Does not compile WebGL shaders. */
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import {createSeedPlanet, seedFromText, drawStarPostcard} from '../dist/star-forge.js';

const checks = [], budgets = {};
assert.equal(seedFromText('好奇心'), seedFromText('好奇心'));
assert.equal(seedFromText('é'), seedFromText('e\u0301'));
assert.notEqual(seedFromText('好奇心'), seedFromText('好奇心！'));
assert(Number.isInteger(seedFromText('🪐鼠哥')) && seedFromText('🪐鼠哥') >= 0);
checks.push('Text seeds are stable, Unicode-aware and unsigned');

function snapshot(planet) {
  const values = [];
  planet.group.traverse(object => {
    if (object.geometry) values.push(...object.geometry.attributes.position.array);
    if (object.instanceMatrix) values.push(...object.instanceMatrix.array);
  });
  return values;
}

for (const kind of ['reef', 'mineral', 'halo']) {
  const planet = createSeedPlanet({seed: 457829, kind});
  const duplicate = createSeedPlanet({seed: 457829, kind});
  const different = createSeedPlanet({seed: 572, kind});
  assert.deepEqual(snapshot(planet), snapshot(duplicate));
  assert.deepEqual(planet.palette, duplicate.palette);
  // Halo geometry is deliberately constant; per-seed color and shader phase change instead.
  if (kind !== 'halo') assert.notDeepEqual(snapshot(planet), snapshot(different));
  checks.push(`${kind}: seed reproduces geometry and palette`);
  let triangles = 0, drawables = 0;
  const geometries = new Set(), materials = new Set();
  planet.group.traverse(object => {
    if (object.geometry) {
      geometries.add(object.geometry);drawables++;
      const positions = object.geometry.attributes.position;
      for (const value of positions.array) assert(Number.isFinite(value));
      if (object.isMesh) triangles += (object.geometry.index?.count || positions.count) / 3 * (object.isInstancedMesh ? object.count : 1);
    }
    if (object.instanceMatrix) for (const value of object.instanceMatrix.array) assert(Number.isFinite(value));
    if (object.material) materials.add(object.material);
    assert(object.matrixWorld.elements.every(Number.isFinite));
  });
  assert(triangles < 12000, `${kind} exceeds per-planet triangle budget`);
  assert(drawables <= 8, `${kind} exceeds drawable budget`);
  budgets[kind] = {triangles, drawables};
  checks.push(`${kind}: finite model and instance data stay under 12k triangles / 8 drawables`);
  for (const material of materials) {
    if (material.isShaderMaterial) {
      assert(material.vertexShader.includes('void main()'));
      assert(material.fragmentShader.includes('void main()'));
      assert(material.uniforms.uTime);
    } else {
      const shader = {uniforms: {}, vertexShader: THREE.ShaderLib.standard.vertexShader, fragmentShader: THREE.ShaderLib.standard.fragmentShader};
      material.onBeforeCompile(shader);
      if (material.customProgramCacheKey() === 'seed-planet-print-v1') assert(shader.fragmentShader.includes('vForgePosition'));
    }
  }
  planet.update(0);planet.update(2.5);planet.update(Number.NaN);
  planet.group.updateMatrixWorld(true);
  planet.group.traverse(object => assert(object.matrixWorld.elements.every(Number.isFinite)));
  checks.push(`${kind}: material customization and finite animation state`);
  let disposedGeometry = 0, disposedMaterial = 0;
  geometries.forEach(geometry => geometry.addEventListener('dispose', () => disposedGeometry++));
  materials.forEach(material => material.addEventListener('dispose', () => disposedMaterial++));
  const parent = new THREE.Group();parent.add(planet.group);
  planet.dispose();planet.dispose();planet.update(5);
  assert.equal(disposedGeometry, geometries.size);assert.equal(disposedMaterial, materials.size);
  assert.equal(planet.group.parent, null);assert.equal(planet.group.children.length, 0);
  checks.push(`${kind}: every owned resource disposes exactly once and detaches`);
  duplicate.dispose();different.dispose();
}

const fallback = createSeedPlanet({kind: '__proto__', seed: 'safe kind'});
assert.equal(fallback.kind, 'reef');assert.equal(fallback.seed, seedFromText('safe kind'));fallback.dispose();
checks.push('Unknown type safely uses reef and accepts text seeds');

function recorder() {
  const commands = [];
  const gradient = {addColorStop: (...args) => commands.push(['stop', ...args])};
  const context = new Proxy({commands, measureText: value => ({width: Array.from(value).length * 36}),
    createRadialGradient: (...args) => {commands.push(['radial', ...args]);return gradient;},
    createLinearGradient: (...args) => {commands.push(['linear', ...args]);return gradient;}
  }, {get(object, key) {
    if (key in object) return object[key];
    return (...args) => {for (const value of args) if (typeof value === 'number') assert(Number.isFinite(value));commands.push([key, ...args]);};
  }, set(object, key, value) {commands.push(['set', key, value === gradient ? '[gradient]' : value]);object[key] = value;return true;}});
  return context;
}
for (const kind of ['reef', 'mineral', 'halo']) {
  const first = recorder(), second = recorder();
  const result = drawStarPostcard(first, {seed: 112203, kind, title: '一颗好奇心，正在生长。'});
  drawStarPostcard(second, {seed: 112203, kind, title: '一颗好奇心，正在生长。'});
  assert.deepEqual(first.commands, second.commands);
  assert(first.commands.some(command => command.includes('好奇心造星所 · 种子生成纪念图')));
  assert.equal(result.seed, 112203);assert.equal(result.width, 1600);assert.equal(result.height, 1000);
  checks.push(`${kind}: postcard drawing is deterministic and explicitly labeled as an illustration`);
}
drawStarPostcard(recorder(), {width: 390, height: 244, title: '很长的名字'.repeat(20)});
checks.push('Postcard accepts a narrow output and long text without nonfinite commands');
console.log(JSON.stringify({scope: 'CPU geometry, deterministic drawing commands and resource ownership; no GPU shader or pixel proof', passed: checks.length, budgets, checks}, null, 2));
