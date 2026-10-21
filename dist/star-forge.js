import * as THREE from './vendor/three.module.js';

// A tiny, deterministic world builder. No DOM, network, textures or global clock.
const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const COLORS = {
  reef: [
    ['#153f46', '#346f70', '#99baa0', '#d5d6aa', '#edb69a'],
    ['#1f414a', '#527d7f', '#abc9b2', '#e2d9b8', '#cd9a7a'],
    ['#204e4b', '#608e82', '#b3c79c', '#e4d8b0', '#e9aa90']
  ],
  mineral: [
    ['#253e48', '#5e9294', '#a9d7c9', '#e9e0c4', '#e4b6a2'],
    ['#3e4149', '#8c8894', '#c6c5b6', '#e3decf', '#dca685'],
    ['#284d50', '#649d91', '#bfd3b3', '#e4dcc3', '#e3ae96']
  ],
  halo: [
    ['#493f39', '#ac8770', '#e4c2a4', '#eee3c8', '#a8c8bf'],
    ['#31484d', '#6e9897', '#b9cfc2', '#e6e2c9', '#dfa68a'],
    ['#454653', '#928f9e', '#d0c5c5', '#eadcca', '#a9cbbb']
  ]
};

/** Text -> stable unsigned seed. Unicode is intentionally retained. */
export function seedFromText(text = '') {
  let hash = 2166136261;
  for (const character of String(text).normalize('NFC')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seedNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value >>> 0 : seedFromText(value);
}

function randomFor(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}

function specification(seed, kind) {
  seed = seedNumber(seed);
  kind = Object.hasOwn(COLORS, kind) ? kind : 'reef';
  const random = randomFor(seed);
  const palette = COLORS[kind][Math.floor(random() * COLORS[kind].length)].slice();
  const phase = [random() * TAU, random() * TAU, random() * TAU];
  return {seed, kind, palette, phase, random};
}

function field(x, y, z, phase) {
  return Math.sin(x * 3.7 + phase[0] + Math.cos(y * 4.1)) * .43
    + Math.sin(y * 5.2 - z * 2.9 + phase[1]) * .32
    + Math.cos(z * 6.4 + x * 2.2 + phase[2]) * .25;
}

function normalPoint(random) {
  const y = random() * 2 - 1;
  const a = random() * TAU;
  const r = Math.sqrt(1 - y * y);
  return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
}

/**
 * Unit-scale planet; detail 0 is for a map, detail 1 for a close view.
 * Its material colors are independent per instance; calling dispose is idempotent.
 */
export function createSeedPlanet({seed = 2026, kind = 'reef', detail = 1} = {}) {
  const spec = specification(seed, kind);
  ({seed, kind} = spec);
  const {palette, phase, random} = spec;
  const group = new THREE.Group();
  group.name = `seed-${kind}-${seed}`;
  group.userData = {seed, kind};
  const colors = palette.map(color => new THREE.Color(color));
  const clock = {value: 0};
  const materials = new Set(), geometries = new Set(), animated = [];
  let disposed = false;
  const geo = value => {geometries.add(value); return value;};
  const mat = value => {materials.add(value); return value;};
  const standard = options => mat(new THREE.MeshStandardMaterial(options));
  const add = (geometry, material) => {
    const mesh = new THREE.Mesh(geo(geometry), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const installInstances = (geometry, material, poses) => {
    const mesh = new THREE.InstancedMesh(geo(geometry), material, poses.length);
    const dummy = new THREE.Object3D();
    poses.forEach((pose, index) => {
      dummy.position.copy(pose.position);
      dummy.quaternion.setFromUnitVectors(UP, pose.normal || UP);
      dummy.rotateY(pose.twist || 0);
      dummy.scale.set(...(pose.scale || [1, 1, 1]));
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      if (pose.color) mesh.setColorAt(index, pose.color);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const bodyGeometry = kind === 'mineral'
    ? new THREE.IcosahedronGeometry(.79, detail > 0 ? 3 : 2)
    : new THREE.SphereGeometry(kind === 'halo' ? .68 : .82, detail > 0 ? 48 : 28, detail > 0 ? 28 : 18);
  const positions = bodyGeometry.attributes.position;
  const vertexColors = [], n = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    n.fromBufferAttribute(positions, i).normalize();
    const value = field(n.x, n.y, n.z, phase);
    let radius, color;
    if (kind === 'reef') {
      const land = THREE.MathUtils.smoothstep(value, .02, .5);
      radius = .82 + Math.max(0, value) * .09;
      color = colors[0].clone().lerp(colors[1], THREE.MathUtils.clamp((value + .8) * .6, 0, 1));
      color.lerp(colors[2], land).lerp(colors[3], Math.max(0, value - .48) * 1.2);
    } else if (kind === 'mineral') {
      radius = .80 + Math.round(value * 5) * .023;
      color = colors[0].clone().lerp(colors[2], (value + 1) * .5);
      if (Math.abs(value) < .06) color.lerp(colors[3], .65);
    } else {
      radius = .68;
      const band = .5 + .5 * Math.sin(n.y * 31 + value * 3.4 + phase[1]);
      color = colors[1].clone().lerp(colors[2], band * .75).lerp(colors[3], Math.pow(band, 9) * .4);
    }
    positions.setXYZ(i, n.x * radius, n.y * radius, n.z * radius);
    vertexColors.push(color.r, color.g, color.b);
  }
  bodyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));
  bodyGeometry.computeVertexNormals();
  const bodyMaterial = standard({vertexColors: true, roughness: kind === 'mineral' ? .42 : .82,
    metalness: kind === 'mineral' ? .28 : .05, flatShading: kind === 'mineral'});
  // The very fine contour is a surface print; no additional transparent globe.
  bodyMaterial.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vForgePosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvForgePosition=position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vForgePosition;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float printLine=pow(.5+.5*sin(vForgePosition.y*170.+sin(vForgePosition.x*24.)*.6),24.);
        diffuseColor.rgb*=.96+printLine*.085;`);
  };
  bodyMaterial.customProgramCacheKey = () => 'seed-planet-print-v1';
  const body = add(bodyGeometry, bodyMaterial);

  if (kind === 'reef') {
    const islands = [], trees = [], beacons = [];
    for (let i = 0; i < (detail > 0 ? 24 : 14); i++) {
      const normal = normalPoint(random), size = .06 + random() * .065;
      const radius = .90 + random() * .16;
      islands.push({normal, position: normal.clone().multiplyScalar(radius), scale: [size, size, size], twist: random() * TAU});
      trees.push({normal, position: normal.clone().multiplyScalar(radius + size * .8),
        scale: [size * .55, size * (1.1 + random() * .7), size * .55], color: colors[i % 3 + 1]});
      if (i % 4 === 0) beacons.push({normal, position: normal.clone().multiplyScalar(radius + size * 2), scale: [.018, .018, .018]});
    }
    const islandGeo = new THREE.ConeGeometry(1, 1.6, 6);
    islandGeo.rotateZ(Math.PI);
    installInstances(islandGeo, standard({color: palette[1], roughness: .95, flatShading: true}), islands);
    installInstances(new THREE.IcosahedronGeometry(1, 0), standard({color: '#e4e5ce', roughness: .9}), trees);
    installInstances(new THREE.IcosahedronGeometry(1, 1), standard({color: palette[4], emissive: palette[4], emissiveIntensity: .35, roughness: .7}), beacons);
    // A small, tilted companion carries the eye beyond the central silhouette.
    const moon = add(new THREE.IcosahedronGeometry(.10, 1), standard({color: palette[3], roughness: 1}));
    moon.position.set(1.13, .40, -.14);
    animated.push({mesh: moon, base: moon.position.clone(), phase: phase[0], amplitude: .025});
  }

  if (kind === 'mineral') {
    const crystals = [];
    for (let i = 0; i < (detail > 0 ? 38 : 20); i++) {
      const normal = normalPoint(random), size = .035 + random() * .045;
      crystals.push({normal, position: normal.clone().multiplyScalar(.88),
        scale: [size, .10 + random() * .29, size], twist: random() * TAU,
        color: colors[1 + i % 3]});
    }
    installInstances(new THREE.ConeGeometry(1, 1, 5), standard({color: '#dbdfca', roughness: .32, metalness: .3, flatShading: true}), crystals);
    const edges = new THREE.LineSegments(geo(new THREE.EdgesGeometry(bodyGeometry, 24)), mat(new THREE.LineBasicMaterial({color: palette[3], transparent: true, opacity: .12})));
    group.add(edges);
    const satellite = add(new THREE.OctahedronGeometry(.105), standard({color: palette[4], roughness: .4, metalness: .15}));
    satellite.position.set(-1.03, .5, .12);
    animated.push({mesh: satellite, base: satellite.position.clone(), phase: phase[1], amplitude: .04});
  }

  if (kind === 'halo') {
    const ringMaterial = mat(new THREE.ShaderMaterial({
      uniforms: {uTime: clock, uInner: {value: colors[2]}, uOuter: {value: colors[4]}, uPhase: {value: phase[0]}},
      side: THREE.DoubleSide, transparent: true, depthWrite: false,
      vertexShader: `uniform float uTime;uniform float uPhase;varying vec2 vRing;
        void main(){vRing=position.xy;vec3 p=position;float a=atan(p.y,p.x);
        p.z+=sin(length(p.xy)*24.+a*3.+uTime*.35+uPhase)*.016;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader: `uniform vec3 uInner;uniform vec3 uOuter;uniform float uPhase;varying vec2 vRing;
        void main(){float r=length(vRing);float t=clamp((r-.91)/.52,0.,1.);
        float fiber=.5+.5*sin(r*267.+uPhase);float gap=1.-smoothstep(.014,.025,abs(r-1.145));
        float edge=smoothstep(.91,.94,r)*(1.-smoothstep(1.39,1.43,r));
        vec3 c=mix(uInner,uOuter,t*.78);c*=.73+fiber*.27;
        float alpha=edge*(.52+fiber*.38)*(1.-gap*.88);
        gl_FragColor=vec4(c,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`
    }));
    const ring = add(new THREE.RingGeometry(.91, 1.43, detail > 0 ? 144 : 80, 4), ringMaterial);
    ring.rotation.set(-1.05, .15, -.35);
    ring.castShadow = false;
    ring.receiveShadow = false;
    const moon = add(new THREE.SphereGeometry(.085, 16, 12), standard({color: palette[3], roughness: .9}));
    moon.position.set(1.12, .72, -.15);
    animated.push({mesh: moon, base: moon.position.clone(), phase: phase[2], amplitude: .02});
  }

  group.updateMatrixWorld(true);
  return {group, palette: palette.slice(), seed, kind,
    update(t = 0) {
      if (disposed) return;
      clock.value = Number.isFinite(t) ? t : 0;
      body.rotation.y = clock.value * .035;
      for (const item of animated) {
        item.mesh.position.copy(item.base);
        item.mesh.position.y += Math.sin(clock.value * .5 + item.phase) * item.amplitude;
        item.mesh.rotation.y = clock.value * .14;
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      group.traverse(object => {if (object.isInstancedMesh) object.dispose();});
      group.removeFromParent();
      group.clear();
    }
  };
}

function circle(ctx, x, y, radius, fill) {
  ctx.beginPath();ctx.arc(x, y, radius, 0, TAU);ctx.fillStyle = fill;ctx.fill();
}

function wrapText(ctx, text, x, y, width, lineHeight, maxLines = 3) {
  let line = '';
  const lines = [], characters = Array.from(text);
  for (let index = 0; index < characters.length; index++) {
    const character = characters[index];
    const next = line + character;
    if (line && ctx.measureText(next).width > width) {
      if (lines.length === maxLines - 1) {
        while (line && ctx.measureText(line + '…').width > width) line = line.slice(0, -1);
        line += '…';break;
      }
      lines.push(line);line = character;
    } else line = next;
  }
  if (line) lines.push(line);
  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
}

/** An original seed-based illustration, deliberately not a claim of a WebGL screenshot. */
export function drawStarPostcard(ctx, {seed = 2026, kind = 'reef', title = '给好奇心，一颗新星。', width = 1600, height = 1000} = {}) {
  const spec = specification(seed, kind);
  ({seed, kind} = spec);
  const {palette, random, phase} = spec;
  width = Math.max(320, Number(width) || 1600);height = Math.max(200, Number(height) || 1000);
  const scale = Math.min(width / 1600, height / 1000), ox = (width - 1600 * scale) / 2, oy = (height - 1000 * scale) / 2;
  ctx.save();ctx.fillStyle = '#0b1a20';ctx.fillRect(0, 0, width, height);ctx.translate(ox, oy);ctx.scale(scale, scale);
  const glow = ctx.createRadialGradient(1050, 480, 20, 1050, 480, 750);
  glow.addColorStop(0, '#264641');glow.addColorStop(1, '#0b1a20');ctx.fillStyle = glow;ctx.fillRect(0, 0, 1600, 1000);
  for (let i = 0; i < 330; i++) {
    const x = random() * 1600, y = random() * 1000;
    ctx.globalAlpha = .15 + random() * .65;
    circle(ctx, x, y, .5 + random() * 1.4, i % 7 ? '#bfcec0' : palette[4]);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#50716b';ctx.lineWidth = 1;
  for (const radius of [330, 416]) {ctx.beginPath();ctx.ellipse(1090, 480, radius, radius * .68, -.31, 0, TAU);ctx.stroke();}
  ctx.setLineDash([2, 12]);ctx.beginPath();ctx.arc(1090, 480, 361, 0, TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.font = '500 22px Outfit, system-ui, sans-serif';ctx.fillStyle = '#c8d5c7';ctx.fillText('SHUGE  /  ODYSSEY', 100, 105);
  ctx.fillStyle = palette[4];ctx.font = '500 17px Outfit, system-ui, sans-serif';ctx.fillText('A SMALL WORLD, BORN OF CURIOSITY', 102, 161);
  ctx.fillStyle = '#f0f0e7';ctx.font = '600 70px "Microsoft YaHei", system-ui, sans-serif';
  wrapText(ctx, String(title || '给好奇心，一颗新星。').trim().slice(0, 48), 98, 360, 540, 100, 3);
  ctx.fillStyle = '#afc3b7';ctx.font = '400 25px "Microsoft YaHei", system-ui, sans-serif';
  ctx.fillText('从一个念头，抵达一个世界。', 102, 740);
  const cx = 1090, cy = 480, radius = kind === 'halo' ? 210 : 260;
  // Rear half of the ring is occluded by the globe, matching the 3D family.
  const ring = front => {
    ctx.save();ctx.translate(cx, cy);ctx.rotate(-.32);ctx.scale(1, .36);
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 70; i++) {
      const r = 280 + i * 1.7;
      if (i > 31 && i < 38) continue;
      ctx.globalAlpha = .35 + .3 * Math.sin(i * 2.3) ** 2;
      ctx.strokeStyle = i % 4 ? palette[2] : palette[4];ctx.beginPath();
      ctx.arc(0, 0, r, front ? 0 : Math.PI, front ? Math.PI : TAU);ctx.stroke();
    }
    ctx.restore();
  };
  if (kind === 'halo') ring(false);
  ctx.save();ctx.beginPath();ctx.arc(cx, cy, radius, 0, TAU);ctx.clip();
  const body = ctx.createRadialGradient(cx - radius * .43, cy - radius * .42, 0, cx, cy, radius * 1.16);
  body.addColorStop(0, palette[2]);body.addColorStop(.48, palette[1]);body.addColorStop(1, palette[0]);
  ctx.fillStyle = body;ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  if (kind === 'halo') {
    for (let i = 0; i < 100; i++) {
      ctx.globalAlpha = .12 + .15 * Math.sin(i * 1.6 + phase[0]) ** 2;
      ctx.fillStyle = palette[2 + i % 2];ctx.beginPath();
      const y = cy - radius + i * radius / 50;
      ctx.ellipse(cx, y, radius * 1.2, 3 + random() * 7, -.08, 0, TAU);ctx.fill();
    }
  } else if (kind === 'reef') {
    for (let i = 0; i < 38; i++) {
      const x = cx + (random() - .5) * radius * 2, y = cy + (random() - .5) * radius * 2;
      ctx.globalAlpha = .45 + random() * .3;ctx.fillStyle = palette[2 + i % 2];
      ctx.beginPath();ctx.ellipse(x, y, 12 + random() * 65, 9 + random() * 40, random() * TAU, 0, TAU);ctx.fill();
    }
  } else {
    for (let i = 0; i < 65; i++) {
      const x = cx + (random() - .5) * radius * 2.2, y = cy + (random() - .5) * radius * 2.2, size = 25 + random() * 75;
      ctx.globalAlpha = .25 + random() * .4;ctx.fillStyle = palette[1 + i % 3];
      ctx.beginPath();ctx.moveTo(x, y - size);ctx.lineTo(x + size * .55, y + size * .6);ctx.lineTo(x - size * .65, y + size * .3);ctx.closePath();ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius * .8, cy + radius * .55);
  shade.addColorStop(0, '#10262800');shade.addColorStop(.55, '#10262818');shade.addColorStop(1, '#08171de8');
  ctx.fillStyle = shade;ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);ctx.restore();
  if (kind === 'halo') ring(true);
  ctx.save();ctx.globalAlpha = .8;circle(ctx, cx + radius * .95, cy - radius * .92, 21, palette[3]);ctx.restore();
  ctx.strokeStyle = '#58736b';ctx.lineWidth = 1;ctx.beginPath();ctx.moveTo(100, 839);ctx.lineTo(1500, 839);ctx.stroke();
  ctx.fillStyle = '#dce2cf';ctx.font = '400 20px Outfit, system-ui, sans-serif';
  ctx.fillText(`SEED  ${String(seed).padStart(10, '0')}`, 102, 890);
  ctx.fillText({reef: '01  /  FLOATING REEF', mineral: '02  /  CRYSTAL ARCHIVE', halo: '03  /  SILKEN ORBIT'}[kind], 650, 890);
  ctx.fillStyle = '#9bb2a7';ctx.font = '400 17px "Microsoft YaHei", system-ui, sans-serif';
  ctx.fillText('好奇心造星所 · 种子生成纪念图', 102, 938);
  ctx.textAlign = 'right';ctx.fillText('ndshuge.github.io/shuge-odyssey', 1498, 938);ctx.restore();
  return {seed, kind, palette: palette.slice(), width, height};
}
