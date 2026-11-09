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

  const robot = new THREE.Group();
  scene.add(robot);

  const grid = new THREE.GridHelper(18, 36, 0xcfcfcf, 0xe4e4e4);
  grid.position.y = 0.002;
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  scene.add(grid);

  const hash = (i, s) => {
    const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const COLS = 46;
  const ROWS = 34;
  const COUNT = COLS * ROWS;
  const positions = new Float32Array(COUNT * 3);
  let idx = 0;
  for (let ix = 0; ix < COLS; ix++) {
    for (let iz = 0; iz < ROWS; iz++) {
      const x = 0.05 + (ix / (COLS - 1)) * 4.2;
      const z = -1.8 + (iz / (ROWS - 1)) * 3.2;
      const y = 0.28 + Math.sin(x * 0.9 + z * 0.6) * 0.16 + hash(ix * 97 + iz, 4) * 0.05;
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;
      idx++;
    }
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x3f5f92) } },
    vertexShader: `
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y += sin(p.x * 0.8 + uTime * 0.3) * 0.05;
        p.x += cos(p.z * 0.9 + uTime * 0.22) * 0.04;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(2.4 * (6.0 / -mv.z), 1.0, 3.2);
        gl_Position = projectionMatrix * mv;
        vAlpha = 0.18 + 0.32 * abs(sin(p.z * 0.8 + uTime * 0.2));
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

  const arm = {};

  const draco = new DRACOLoader();
  draco.setDecoderPath('/assets/js/vendor/libs/draco/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  let loaded = false;
  loader.load('/assets/models/g1_draco.glb', (gltf) => {
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

    robot.add(model);
    model.traverse((o) => {
      if (o.name && /^right_.*_link$/.test(o.name)) {
        arm[o.name] = { node: o, base: o.rotation.clone() };
      }
    });
    loaded = true;
    host.classList.add('is-ready');
    host.closest('.hero-stage')?.classList.add('is-live');
  }, undefined, (err) => {
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

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || !loaded) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = reduce ? 0 : (now - start) / 1000;

    tx += (px - tx) * 0.05;
    ty += (py - ty) * 0.05;
    tp += (sp - tp) * 0.05;

    camera.position.x += ((portrait ? 0.0 : -0.2) + tx * 0.26 - camera.position.x) * 0.06;
    camera.position.y += ((portrait ? 1.45 : 1.35) - ty * 0.12 + tp * 0.05 - camera.position.y) * 0.06;
    camera.lookAt(look);

    robot.rotation.y = -0.28 + tx * 0.14 + tp * 0.22;
    robot.position.y = Math.sin(t * 0.7) * 0.006;

    pMat.uniforms.uTime.value = t;
    const sh = arm['right_shoulder_pitch_link'];
    if (sh) sh.node.rotation.x = sh.base.x + tx * 0.20 + Math.sin(t * 0.5) * 0.03;
    const sr = arm['right_shoulder_roll_link'];
    if (sr) sr.node.rotation.z = sr.base.z - ty * 0.12;
    const ep = arm['right_elbow_pitch_link'];
    if (ep) ep.node.rotation.x = ep.base.x + 0.10 + Math.sin(t * 0.6 + 1) * 0.04;
    const palm = arm['right_palm_link'];
    if (palm) palm.node.rotation.y = palm.base.y + tx * 0.18;

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
