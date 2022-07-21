import { OrbitControl } from "oasis-engine-toolkit";
import { AmbientLight, AssetType, Camera, DirectLight, GLTFResource, Vector3, WebGLEngine } from "oasis-engine";
import React, { useEffect } from "react";

export default function PBRHelmet() {
  useEffect(() => {
    const engine = init();

    return () => {
      engine.destroy();
    };
  }, []);

  return <canvas id="canvas-pbr-helmet" style={{ width: "400px", height: "400px" }} />;
}

function init(): WebGLEngine {
  // -- create engine object
  const engine = new WebGLEngine("canvas-pbr-helmet");
  engine.canvas.resizeByClientSize();

  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  const directLightNode = rootEntity.createChild("dir_light");
  const directLightNode2 = rootEntity.createChild("dir_light2");
  directLightNode.addComponent(DirectLight);
  directLightNode2.addComponent(DirectLight);

  directLightNode.transform.setRotation(30, 0, 0);
  directLightNode2.transform.setRotation(-30, 180, 0);

  // -- create camera
  const cameraNode = rootEntity.createChild("camera_node");
  cameraNode.transform.setPosition(0, 0, 3);
  cameraNode.addComponent(Camera);
  scene.background.solidColor.set(51 / 255, 51 / 255, 51 / 255, 1);
  const controls = cameraNode.addComponent(OrbitControl);
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.02;

  engine.run();

  engine.resourceManager
    .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/150e44f6-7810-4c45-8029-3575d36aff30.gltf")
    .then((gltf) => {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      gltf.defaultSceneRoot.transform.position = new Vector3(0, 0.1, 0);
      rootEntity.addChild(gltf.defaultSceneRoot);
    });

  engine.resourceManager
    .load<AmbientLight>({
      type: AssetType.Env,
      url: "https://gw.alipayobjects.com/os/bmw-prod/37f204c2-bc5b-4344-a368-8251bbeb0717.bin"
    })
    .then((ambientLight) => {
      scene.ambientLight = ambientLight;
    });

  return engine;
}
