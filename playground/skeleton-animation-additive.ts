/**
 * @title Animation Additive
 * @category Animation
 */
import * as dat from "dat.gui";
import {
  AnimationClip,
  Animator,
  AnimatorControllerLayer,
  AnimatorLayerBlendingMode,
  AnimatorStateMachine,
  Camera,
  DirectLight,
  GLTFResource,
  Logger,
  SystemInfo,
  Vector3,
  WebGLEngine
} from "oasis-engine";
import { OrbitControl } from "oasis-engine-toolkit";
const gui = new dat.GUI();

Logger.enable();

const engine = new WebGLEngine("canvas");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// camera
const cameraEntity = rootEntity.createChild("camera_node");
cameraEntity.transform.position = new Vector3(0, 1, 5);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl).target = new Vector3(0, 1, 0);

const lightNode = rootEntity.createChild("light_node");
lightNode.addComponent(DirectLight).intensity = 0.6;
lightNode.transform.lookAt(new Vector3(0, 0, 1));
lightNode.transform.rotate(new Vector3(0, 90, 0));

engine.resourceManager
  .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb")
  .then((gltfResource) => {
    const { animations, defaultSceneRoot } = gltfResource;
    const animator = defaultSceneRoot.getComponent(Animator);
    const { animatorController } = animator;

    const animatorStateMachine = new AnimatorStateMachine();
    const additiveLayer = new AnimatorControllerLayer("additiveLayer");
    additiveLayer.stateMachine = animatorStateMachine;
    additiveLayer.blendingMode = AnimatorLayerBlendingMode.Additive;
    animatorController.addLayer(additiveLayer);

    const animationNames = animations.filter((clip) => !clip.name.includes("pose")).map((clip) => clip.name);
    const animationNames2 = [];

    if (animations) {
      animations.forEach((clip: AnimationClip) => {
        if (clip.name.includes("pose")) {
          const animatorState2 = animatorStateMachine.addState(clip.name);
          animatorState2.clip = clip;
          animatorState2.clipStartTime = 1;
          animationNames2.push(clip.name);
        }
      });
    }
    rootEntity.addChild(defaultSceneRoot);
    animator.play(animationNames[0], 0);
    animator.play(animationNames2[1], 1);

    const debugInfo = {
      animation: animationNames[0],
      additive_pose: animationNames2[1],
      additive_weight: 1,
      speed: 1
    };

    gui.add(debugInfo, "animation", animationNames).onChange((v) => {
      animator.play(v, 0);
    });

    gui.add(debugInfo, "additive_pose", animationNames2).onChange((v) => {
      animator.play(v, 1);
    });

    gui.add(debugInfo, "additive_weight", 0, 1).onChange((v) => {
      additiveLayer.weight = v;
    });

    gui.add(debugInfo, "speed", -1, 1).onChange((v) => {
      animator.speed = v;
    });
  });

engine.run();
