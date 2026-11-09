import * as THREE from 'three';
import { RoomEnvironment } from '/assets/js/vendor/RoomEnvironment.js';

const host = document.getElementById('hero-three');
if (host) init(host);

function init(host) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 30);
  camera.position.set(1.5, 1.45, 4.6);
  camera.lookAt(0, 0.95, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(2.6, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -2.5;
  key.shadow.camera.right = 2.5;
  key.shadow.camera.top = 2.5;
  key.shadow.camera.bottom = -2.5;
  key.shadow.bias = -0.0004;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xdfe8ff, 1.6);
  rim.position.set(-3, 2.2, -2);
  scene.add(rim);

  const fill = new THREE.HemisphereLight(0xffffff, 0xdfe3ea, 1.1);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ color: 0x1a2233, opacity: 0.16 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xf6f6f6, roughness: 0.32, metalness: 0.06,
    clearcoat: 0.65, clearcoatRoughness: 0.22
  });
  const joint = new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.38, metalness: 0.65 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x1e3569, roughness: 0.35, metalness: 0.2 });

  const robot = new THREE.Group();
  scene.add(robot);

  function mesh(geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  const base = mesh(new THREE.CylinderGeometry(0.30, 0.35, 0.10, 64), paint, 0, 0.05, 0);
  const ring = mesh(new THREE.TorusGeometry(0.29, 0.012, 12, 72), accent, 0, 0.10, 0);
  ring.rotation.x = Math.PI / 2;
  const pedestal = mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.20, 48), paint, 0, 0.20, 0);
  robot.add(base, ring, pedestal);

  const yaw = new THREE.Group();
  yaw.position.y = 0.30;
  robot.add(yaw);

  const column = mesh(new THREE.CylinderGeometry(0.088, 0.10, 0.30, 40), paint, 0, 0.15, 0);
  yaw.add(column);
  yaw.add(mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.07, 40), joint, 0, 0.31, 0));

  const shoulder = new THREE.Group();
  shoulder.position.y = 0.34;
  yaw.add(shoulder);

  const shoulderJoint = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.26, 40), joint, 0, 0, 0);
  shoulderJoint.rotation.z = Math.PI / 2;
  shoulder.add(shoulderJoint);

  const upper = new THREE.Group();
  upper.position.y = 0.10;
  shoulder.add(upper);
  upper.add(mesh(new THREE.CapsuleGeometry(0.095, 0.42, 12, 32), paint, 0, 0.24, 0));

  const elbow = new THREE.Group();
  elbow.position.y = 0.48;
  upper.add(elbow);
  const elbowJoint = mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.22, 36), joint, 0, 0, 0);
  elbowJoint.rotation.z = Math.PI / 2;
  elbow.add(elbowJoint);

  const fore = new THREE.Group();
  fore.position.y = 0.09;
  elbow.add(fore);
  fore.add(mesh(new THREE.CapsuleGeometry(0.078, 0.34, 12, 32), paint, 0, 0.20, 0));

  const wrist = new THREE.Group();
  wrist.position.y = 0.40;
  fore.add(wrist);
  wrist.add(mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.10, 32), joint, 0, 0.02, 0));
  wrist.add(mesh(new THREE.BoxGeometry(0.22, 0.10, 0.14), paint, 0, 0.10, 0));

  const fingerGeo = new THREE.BoxGeometry(0.035, 0.20, 0.07);
  const left = mesh(fingerGeo, paint, -0.062, 0.22, 0);
  const right = mesh(fingerGeo, paint, 0.062, 0.22, 0);
  wrist.add(left, right);
  wrist.add(mesh(new THREE.BoxGeometry(0.16, 0.012, 0.08), accent, 0, 0.135, 0.03));

  shoulder.rotation.z = -0.50;
  elbow.rotation.z = 1.00;
  wrist.rotation.z = -0.45;

  const ribbons = new THREE.Group();
  robot.add(ribbons);
  const palette = [0x1e3569, 0x3f5f92, 0x7fa2d9, 0x2f6b5f, 0x9fb0c8, 0xb08a5a];
  const paths = [];
  for (let i = 0; i < palette.length; i++) {
    const pts = [];
    for (let s = 0; s <= 6; s++) {
      const u = s / 6;
      pts.push(new THREE.Vector3(
        0.05 + u * 3.0,
        1.82 + Math.sin(u * 2.6 + i * 0.7) * 0.18 * u - u * u * 0.35,
        -0.15 + u * 0.30 + i * 0.012
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 80, 0.030 - i * 0.0022, 10, false);
    const mat = new THREE.MeshBasicMaterial({ color: palette[i], transparent: true, opacity: 0.55 - i * 0.05 });
    const tube = new THREE.Mesh(geo, mat);
    ribbons.add(tube);
    paths.push({ mesh: tube, baseY: tube.position.y, phase: i * 0.6 });
  }

  let pointerX = 0, pointerY = 0, scrollP = 0;
  let targetX = 0, targetY = 0, targetP = 0;
  const hero = host.closest('.hero') || host;

  function onPointer(event) {
    const rect = host.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  }
  function onScroll() {
    const rect = hero.getBoundingClientRect();
    const span = Math.max(1, rect.height);
    scrollP = Math.min(1, Math.max(0, -rect.top / span));
  }

  if (!reduce) {
    hero.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0 }).observe(host);
  }

  let ready = false;
  let last = performance.now();
  const clockStart = last;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = reduce ? 0 : (now - clockStart) / 1000;

    targetX += (pointerX - targetX) * 0.06;
    targetY += (pointerY - targetY) * 0.06;
    targetP += (scrollP - targetP) * 0.06;

    camera.position.x = 1.5 + targetX * 0.22;
    camera.position.y = 1.45 - targetY * 0.14 + targetP * 0.06;
    camera.lookAt(0, 0.95, 0);

    robot.rotation.y = -0.45 + targetP * 0.35 + targetX * 0.10;
    yaw.rotation.y = targetX * 0.16 + Math.sin(t * 0.35) * 0.06;
    shoulder.rotation.z = -0.50 + targetP * 0.10 + Math.sin(t * 0.5) * 0.02;
    elbow.rotation.z = 1.00 - targetP * 0.12 + Math.sin(t * 0.42 + 1) * 0.03;
    wrist.rotation.z = -0.45 + Math.sin(t * 0.6) * 0.05;

    ribbons.children.forEach((tube, i) => {
      tube.position.y = Math.sin(t * 0.5 + i * 0.6) * 0.02;
      tube.rotation.z = Math.sin(t * 0.35 + i * 0.5) * 0.01;
    });

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      host.classList.add('is-ready');
      host.closest('.hero-scene')?.classList.add('is-live');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
