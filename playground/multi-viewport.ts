/**
 * @title Multi Viewport
 * @category Camera
 */

import {
  WebGLEngine,
  CameraClearFlags,
  DirectLight,
  AssetType,
  Camera,
  Vector3,
  MeshRenderer,
  BlinnPhongMaterial,
  Color,
  BackgroundMode,
  SkyBoxMaterial,
  PrimitiveMesh,
  TextureCube
} from "oasis-engine";
import { OrbitControl } from "oasis-engine-toolkit";

const engine = new WebGLEngine("canvas");
engine.canvas.resizeByClientSize();
const scene = engine.sceneManager.activeScene;
const { background } = scene;
const rootEntity = scene.createRootEntity();

// init camera
const leftCameraEntity = rootEntity.createChild("left-camera");
const leftCamera = leftCameraEntity.addComponent(Camera);
leftCamera.viewport.set(0, 0, 0.5, 1);
leftCamera.clearFlags = CameraClearFlags.Depth;
leftCameraEntity.transform.setPosition(10, 10, 10);
leftCameraEntity.transform.lookAt(new Vector3(0, 0, 0));
leftCameraEntity.addComponent(OrbitControl);

const rightCameraEntity = rootEntity.createChild("right-camera");
const rightCamera = rightCameraEntity.addComponent(Camera);
rightCamera.viewport.set(0.5, 0, 0.5, 1);
rightCamera.clearFlags = CameraClearFlags.Depth;
rightCameraEntity.transform.setPosition(10, 10, 10);
rightCameraEntity.transform.lookAt(new Vector3(0, 0, 0));
rightCameraEntity.addComponent(OrbitControl);

const lightEntity = rootEntity.createChild("Light");
lightEntity.transform.setRotation(-30, 0, 0);
lightEntity.addComponent(DirectLight);

// init cube
const cubeEntity = rootEntity.createChild("cube");
const renderer = cubeEntity.addComponent(MeshRenderer);
renderer.mesh = PrimitiveMesh.createCuboid(engine, 1, 1, 1);
const material = new BlinnPhongMaterial(engine);
material.baseColor = new Color(1, 0.25, 0.25, 1);
renderer.setMaterial(material);

engine.run();

engine.resourceManager
  .load<TextureCube>({
    urls: [
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",
      "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"
    ],
    type: AssetType.TextureCube
  })
  .then((cubeMap1) => {
    // Add skybox background
    background.mode = BackgroundMode.Sky;
    const skyMaterial = (background.sky.material = new SkyBoxMaterial(engine));
    skyMaterial.textureCubeMap = cubeMap1;
    background.sky.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2);
  });
