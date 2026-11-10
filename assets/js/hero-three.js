import * as THREE from 'three';
import { RoomEnvironment } from '/assets/js/vendor/RoomEnvironment.js';
import { GLTFLoader } from '/assets/js/vendor/loaders/GLTFLoader.js';
import { DRACOLoader } from '/assets/js/vendor/loaders/DRACOLoader.js';

const host = document.getElementById('hero-three');
if (host) init(host);

function init(host) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  const look = new THREE.Vector3(0.55, 1.0, 0);
  camera.position.set(-0.2, 1.35, 5.2);
  camera.lookAt(look);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2.8, 4.4, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -0.0004;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xdfe8ff, 2.4);
  rim.position.set(-3.5, 2.4, -2.2);
  scene.add(rim);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe3ea, 1.15));

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ color: 0x1a2233, opacity: 0.16 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 256;
  const sctx = shadowCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 126);
  grad.addColorStop(0, 'rgba(0,0,0,0.30)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 256, 256);
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.0),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.004;
  scene.add(contact);

  const robot = new THREE.Group();
  scene.add(robot);

  const grid = new THREE.GridHelper(18, 36, 0xb2b2b2, 0xd4d4d4);
  grid.position.y = 0.002;
  grid.material.transparent = true;
  scene.add(grid);

  const applyGridTheme = () => {
    grid.material.opacity = document.documentElement.dataset.theme === "dark" ? 0.62 : 0.16;
  };
  applyGridTheme();
  new MutationObserver(applyGridTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  const hash = (i, s) => {
    const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const COLS = 56;
  const ROWS = 42;
  const COUNT = COLS * ROWS;
  const positions = new Float32Array(COUNT * 3);
  let idx = 0;
  for (let ix = 0; ix < COLS; ix++) {
    for (let iz = 0; iz < ROWS; iz++) {
      const x = 0.05 + (ix / (COLS - 1)) * 4.2;
      const z = -1.8 + (iz / (ROWS - 1)) * 3.2;
      const y = 0.42 + Math.sin(x * 0.9 + z * 0.6) * 0.22 + hash(ix * 97 + iz, 4) * 0.06;
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;
      idx++;
    }
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x466a9c) },
      uMouse: { value: new THREE.Vector3(1.6, 0, 0) },
      uFlow: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uFlow;
      uniform vec3 uMouse;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.x = mod(p.x - uFlow, 4.2) + 0.05;
        p.y += sin(position.x * 0.8 + uTime * 0.3) * 0.05;
        p.x += cos(position.z * 0.9 + uTime * 0.22) * 0.04;
        float d = distance(p.xz, uMouse.xz);
        float glow = smoothstep(1.5, 0.0, d);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp((3.0 + glow * 5.0) * (6.0 / -mv.z), 1.2, 9.0);
        gl_Position = projectionMatrix * mv;
        vAlpha = (0.20 + 0.34 * abs(sin(p.z * 0.8 + uTime * 0.2))) * (0.65 + glow * 1.2);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        if (length(c) > 0.5) discard;
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  const TILE = 1.2;
  const streakPts = [];
  for (let k = 0; k < 4; k++) {
    for (let i = 0; i < 12; i++) {
      const x = k * TILE + i * 0.1 + hash(i, k * 3 + 1) * 0.02;
      const y = 0.12 + hash(i, k * 3 + 2) * 0.7;
      const z = -1.2 + hash(i, k * 3 + 3) * 2.4;
      const len = 0.06 + hash(i, k * 3 + 4) * 0.10;
      streakPts.push(x, y, z, x + len, y, z);
    }
  }
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute('position', new THREE.Float32BufferAttribute(streakPts, 3));
  const streaks = new THREE.LineSegments(
    streakGeo,
    new THREE.LineBasicMaterial({ color: 0x8aa3c8, transparent: true, opacity: 0.45 })
  );
  scene.add(streaks);

  const links = {};
  const restPose = {};
  const simRest = {};
  const tmpQuat = new THREE.Quaternion();
  let walkData = null;
  let loaded = false;

  const draco = new DRACOLoader();
  draco.setDecoderPath('/assets/js/vendor/libs/draco/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  Promise.all([
    new Promise((resolve, reject) => loader.load('/assets/models/g1_walk.glb', resolve, undefined, reject)),
    fetch('/assets/models/g1_walk.json').then((r) => r.json())
  ]).then(([gltf, data]) => {
    const model = gltf.scene;
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) {
          o.material.envMapIntensity = 0.7;
          if ('roughness' in o.material) o.material.roughness = Math.max(0.25, o.material.roughness ?? 0.5);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.05 / size.y;
    model.scale.setScalar(scale);
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;

    const candidates = {};
    model.traverse((o) => {
      if (!o.name) return;
      const key = o.name.replace(/\.\d{3}$/, '');
      if (!candidates[key] || (o.children && o.children.length > 0)) candidates[key] = o;
    });
    Object.assign(links, candidates);
    for (const [key, node] of Object.entries(links)) {
      restPose[key] = { p: node.position.clone(), q: node.quaternion.clone() };
    }

    robot.add(model);
    walkData = data;
    if (data.rest) {
      data.names.forEach((name, i) => {
        const v = data.rest[i];
        simRest[name] = {
          p: new THREE.Vector3(v[0], v[1], v[2]),
          q: new THREE.Quaternion(v[3], v[4], v[5], v[6])
        };
      });
    }
    loaded = true;
    host.classList.add('is-ready');
    host.closest('.hero-stage')?.classList.add('is-live');
  }).catch((err) => {
    console.error('hero model failed', err);
  });

  let px = 0, py = 0, sp = 0, tx = 0, ty = 0, tp = 0;
  const hero = host.closest('.hero') || host;

  function onPointer(e) {
    const r = hero.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 2 - 1;
    py = ((e.clientY - r.top) / r.height) * 2 - 1;
  }
  function onScroll() {
    const r = hero.getBoundingClientRect();
    sp = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  }
  if (!reduce) {
    hero.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  let portrait = false;
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    portrait = camera.aspect < 1.05;
    camera.position.set(portrait ? 0.0 : -0.2, portrait ? 1.75 : 1.35, portrait ? 7.6 : 5.2);
    look.set(portrait ? 0.35 : 0.55, portrait ? 1.50 : 1.0, 0);
    camera.updateProjectionMatrix();
    robot.position.x = portrait ? 0.45 : 1.25;
  }

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(host);
  }

  let last = performance.now();
  const start = last;
  let walk = 0;
  let flow = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || !loaded) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = reduce ? 0 : (now - start) / 1000;
    walk += reduce ? 0 : dt * (0.34 + tp * 1.2);
    flow += reduce ? 0 : dt * (0.42 + tp * 1.6);

    tx += (px - tx) * 0.05;
    ty += (py - ty) * 0.05;
    tp += (sp - tp) * 0.05;

    camera.position.x += ((portrait ? 0.0 : -0.2) + tx * 0.32 - camera.position.x) * 0.06;
    camera.position.y += ((portrait ? 1.75 : 1.35) - ty * 0.12 + tp * 0.05 - camera.position.y) * 0.06;
    camera.lookAt(look);

    robot.rotation.y = -1.79 + tx * 0.30 + tp * 0.25;
    robot.position.x = (portrait ? 0.45 : 1.25) + tx * 0.12;
    robot.position.y = tp * 0.04;
    contact.position.x = robot.position.x;

    grid.position.x = -((walk * 0.55) % 0.5);
    streaks.position.x = -((walk * 0.9) % TILE);
    pMat.uniforms.uFlow.value = flow % 4.2;
    pMat.uniforms.uTime.value = t;
    pMat.uniforms.uMouse.value.set(0.6 + (tx + 1) * 1.7, 0, 0.1 - ty * 1.3);

    if (walkData) {
      const frames = walkData.frames;
      const idx = Math.floor((t * walkData.fps * 0.45) % frames.length);
      const row = frames[idx];
      for (let i = 0; i < walkData.names.length; i++) {
        const name = walkData.names[i];
        const node = links[name];
        if (!node) continue;
        const v = row[i];
        const rest = restPose[name];
        if (rest && /shoulder|elbow|palm|hand|wrist/.test(name)) {
          node.position.copy(rest.p);
          tmpQuat.set(v[3], v[4], v[5], v[6]).normalize();
          node.quaternion.copy(rest.q).slerp(tmpQuat, 0.12);
        } else {
          node.position.set(v[0], v[1], v[2]);
          node.quaternion.set(v[3], v[4], v[5], v[6]).normalize();
        }
      }
    }

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
