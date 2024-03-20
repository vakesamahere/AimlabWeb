//import * as THREE from "./node_modules/three";
import {THREE} from "./node_modules/three";
import { PointerLockControls } from "./node_modules/three/examples/jsm/controls/PointerLockControls.js";
//import Stats from "three/examples/jsm/libs/stats.module";

//initialize and render the scene
function main(){
  // 获取canvas元素，并创建一个新的WebGLRenderer渲染器，设置抗锯齿并关联到canvas
  const canvas = document.querySelector("#c");//选中id==c的元素(canvas)
  const render = new THREE.WebGLRenderer({antialias:true,canvas});//渲染场景的实例，抗锯齿，在canvas画布上
  document.querySelector(".left").style.display = "none";//隐藏页面左侧的元素(若有)
  // 设置透视相机的参数
  const fov = 45; // 视野角度
  const aspect = 2; // 宽高比，这里设置为canvas的默认宽高比
  const near = 0.01; // 近裁剪面
  const far = 300; // 远裁剪面
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 20); // 设置相机的初始位置
  camera.lookAt(0, 2, 0); // 设置相机的观察目标
  // 创建一个新的场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white"); // 设置场景背景色为白色
  // 创建一个纹理加载器
  const loader = new THREE.TextureLoader();
  // 创建PointerLockControls，允许通过鼠标控制相机
  const controls = new PointerLockControls(camera, canvas);
  // 获取页面上的菜单面板和开始按钮
  const menuPanel = document.getElementById("menuPanel");
  const startButton = document.getElementById("startButton");
  // 隐藏左侧的元素
  document.querySelector(".left").display = "none";
  console.log(1);
}
main();