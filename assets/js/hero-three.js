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

  const ribbons = new THREE.Group();
  robot.add(ribbons);
  const palette = [0x1e3569, 0x3f5f92, 0x7fa2d9, 0x2f6b5f, 0x9fb0c8];
  for (let i = 0; i < palette.length; i++) {
    const pts = [];
    for (let s = 0; s <= 6; s++) {
      const u = s / 6;
      pts.push(new THREE.Vector3(
        0.30 + u * 3.1,
        1.02 + Math.sin(u * 2.4 + i * 0.7) * 0.14 * u - u * u * 0.42,
        -0.10 + u * 0.26 + i * 0.012
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 72, 0.024 - i * 0.002, 10, false);
    const mat = new THREE.MeshBasicMaterial({ color: palette[i], transparent: true, opacity: 0.5 - i * 0.06 });
    ribbons.add(new THREE.Mesh(geo, mat));
  }

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

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
