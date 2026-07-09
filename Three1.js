(function () {
  const container = document.getElementById('threejs-1');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06070b);
  scene.fog = new THREE.FogExp2(0x06070b, 0.035);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2.2, 6.2);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -0.8;
  controls.minDistance = 3;
  controls.maxDistance = 12;
  controls.target.set(0, 0.2, 0);

  const ambient = new THREE.AmbientLight(0x7f83ff, 0.35);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffe7b8, 1.1);
  keyLight.position.set(4, 7, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x5dc8ff, 0.7);
  rimLight.position.set(-4, -2, -4);
  scene.add(rimLight);

  const group = new THREE.Group();
  scene.add(group);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff6b6b,
    roughness: 0.2,
    metalness: 0.12,
    emissive: 0x180000,
    clearcoat: 1,
    clearcoatRoughness: 0.2
  });

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd36e,
    roughness: 0.15,
    metalness: 0.35,
    emissive: 0x201100
  });

  const orbitMaterial = new THREE.MeshStandardMaterial({
    color: 0x4de1ff,
    roughness: 0.25,
    metalness: 0.2,
    emissive: 0x04121f
  });

  const core = new THREE.Mesh(new THREE.TorusKnotGeometry(1.0, 0.25, 180, 20), coreMaterial);
  core.position.y = 0.2;
  group.add(core);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.06, 24, 160), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const orbit = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), orbitMaterial);
  orbit.position.set(1.8, 0.8, 0);
  group.add(orbit);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(6, 64),
    new THREE.MeshStandardMaterial({ color: 0x111521, roughness: 0.95, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.3;
  scene.add(floor);

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();
    requestAnimationFrame(animate);

    group.rotation.y = t * 0.5;
    group.rotation.x = Math.sin(t * 0.7) * 0.15;
    orbit.position.x = Math.cos(t * 1.1) * 1.8;
    orbit.position.z = Math.sin(t * 1.2) * 1.3;
    core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);

    controls.update();
    renderer.render(scene, camera);
  }

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();
