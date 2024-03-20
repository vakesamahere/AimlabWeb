
//*
//initialize and render the scene
const sensitivityDefault = 0.28//不开镜
function main(){
  // 获取canvas元素，并创建一个新的WebGLRenderer渲染器，设置抗锯齿并关联到canvas
  const canvas = document.querySelector("#c");//选中id==c的元素(canvas)
  const body = document.body;
  const renderer = new WebGLRenderer({antialias:true,canvas});//渲染场景的实例，抗锯齿，在canvas画布上
  document.querySelector(".left").style.display = "none";//隐藏页面左侧的元素(若有)
  // 设置透视相机的参数
  const fov = 45; // 视野角度
  const aspect = 2; // 宽高比，这里设置为canvas的默认宽高比
  const near = 0.01; // 近裁剪面
  const far = 300; // 远裁剪面
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 20); // 设置相机的初始位置
  camera.lookAt(0, 2, 0); // 设置相机的观察目标
  // 创建一个新的场景
  const scene = new Scene();
  scene.background = new Color("white"); // 设置场景背景色为白色
  // 创建一个纹理加载器
  const loader = new TextureLoader();
  // 创建PointerLockControls，允许通过鼠标控制相机
  const controls = new PointerLockControls(camera, canvas);
  controls.pointerSpeed = sensitivityDefault;
  try{
    controls.pointerSpeed = parseFloat(senField.value);
  }catch(e){
    controls.pointerSpeed = sensitivityDefault;
  }
  console.log(camera);
  // 获取页面上的菜单面板和开始按钮
  const menuPanel = document.getElementById("menuPanel");
  const startButton = document.getElementById("startButton");
  const senField = document.getElementById("senField");
  document.querySelector(".left").display = "none";// 隐藏左侧的元素

  // 为开始按钮添加点击事件，锁定鼠标并启用PointerLockControls
  document.addEventListener('DOMContentLoaded', function() {
    startButton.addEventListener('click', function() {
        controls.lock();
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'q') {
      controls.lock();
    }
  });
  //设置灵敏度
  senField.addEventListener(
    "input",
    function(){
      try{
        controls.pointerSpeed = parseFloat(senField.value);
      }catch(e){
        controls.pointerSpeed = sensitivityDefault;
      }
    }
  );
  // 监听controls的锁定和解锁事件，相应地显示和隐藏菜单面板
  controls.addEventListener("lock", () => {
    menuPanel.style.display = "none";
    document.querySelector(".left").style.display = "block";
  });
  controls.addEventListener("unlock", () => {
    menuPanel.style.display = "block";
    document.querySelector(".left").style.display = "none";
  });
  // 创建Stats对象来监控性能
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  {
    const planeSize = 40;
    // 加载棋盘格纹理并设置其重复属性getComputedStyle(body).backgroundImage
    const image = document.getElementById('image');
    console.log(image.src);


    //const texture = loader.load(URL.createObjectURL('./checker.png'));
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
    //const texture = loader.load('./checker.png');
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.magFilter = NearestFilter;
    texture.colorSpace = SRGBColorSpace;
    const repeats = planeSize / 2; // 计算纹理重复的次数
    texture.repeat.set(repeats, repeats);

    // 创建一个平面几何体和一个与之关联的基本材质
    const planeGeo = new PlaneGeometry(planeSize, planeSize);
    const planeMat = new MeshBasicMaterial({
      map: texture,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5); // 设置材质的颜色
    const mesh = new Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5; // 旋转平面几何体
    scene.add(mesh); // 将平面添加到场景中

    // 创建第二个平面几何体并添加到场景中
    const secondPlaneGeo = new PlaneGeometry(40, 30);
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const secondMesh = new Mesh(secondPlaneGeo, planeMat);
    scene.add(secondMesh);
  }
  {
    // 创建球体几何体并设置其参数
    const sphereRadius = 1;
    const sphereWidthDivisions = 16;
    const sphereHeightDivisions = 8;
    const sphereGeo = new SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );

    // 创建多个球体并随机放置它们
    const numSpheres = 3;
    for (let i = 0; i < numSpheres; ++i) {
      const base = new Object3D(); // 创建一个对象作为球体的基础
      scene.add(base);

      const u = i / numSpheres; // 计算球体的位置
      const x = MathUtils.lerp(-12, 12, Math.random());
      const y = MathUtils.lerp(1, 10, Math.random());

      // 创建球体的材质
      const sphereMat = new MeshPhongMaterial();
      sphereMat.color.setHSL(u, 1, 0.75);
      const sphereMesh = new Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(x, y, 1); // 设置球体的位置
      base.add(sphereMesh); // 将球体添加到基础对象上

      // 记住所有球体和它们的位置信息
    }
  }
  {   
    // 创建一个半球形光源，模拟天空光和地面光
    const skyColor = 0xb1e1ff; // 天空光颜色
    const groundColor = 0xb97a20; // 地面光颜色
    const intensity = 0.75; // 光源强度
    const light = new HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }
  {
    // 创建一个方向光源，设置其颜色和强度
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new DirectionalLight(color, intensity);
    light.position.set(0, 10, 5); // 设置光源位置
    light.target.position.set(-5, 0, 0); // 设置光源目标位置
    scene.add(light); // 将光源添加到场景中
    scene.add(light.target); // 将光源目标添加到场景中
  }
  // 创建一个射线投射器，用于鼠标点击时检测场景中的物体
  const raycaster = new Raycaster();

  // 监听canvas的点击事件，使用射线投射器检测点击位置的物体
  window.addEventListener("mousedown", () => {
    const rect = canvas.getBoundingClientRect();
    const center = document.querySelector(".left").getBoundingClientRect();

    const pickPosition = {
      x: ((center.left - rect.left) / canvas.width) * 2 - 1,
      y: ((center.top - rect.top) / canvas.height) * -2 + 1,
    };

    raycaster.setFromCamera(pickPosition, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      // 如果有物体被点击，移动该物体的位置
      const object = intersectedObjects[0].object;
      if (object.parent.type !== "Scene") {
        object.position.x = MathUtils.lerp(-12, 12, Math.random());
        object.position.y = MathUtils.lerp(1, 10, Math.random());
      }
    }
  });
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  // 渲染循环函数
  function render(time) {
    time *= 0.001; // convert to seconds

    resizeRendererToDisplaySize(renderer);// 调整渲染器大小
    stats.update();// 更新性能监控数据

    renderer.render(scene, camera);// 渲染场景

    requestAnimationFrame(render);// 请求下一帧动画
  }

  requestAnimationFrame(render);// 开始渲染循环
}
main();
//*/