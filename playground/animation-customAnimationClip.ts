/**
 * @title Animation CustomAnimationClip
 * @category Animation
 */
import * as dat from "dat.gui";
import {
  AnimationClip,
  AnimationColorCurve,
  AnimationEvent,
  AnimationFloatCurve,
  AnimationVector3Curve,
  Animator,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorStateMachine,
  Camera,
  Color,
  DirectLight,
  GLTFResource,
  Keyframe,
  Logger,
  Script,
  SystemInfo,
  TextRenderer,
  Transform,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
const gui = new dat.GUI();

Logger.enable();
const engine = new WebGLEngine("canvas");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// camera
const cameraWrap = rootEntity.createChild("camera_wrap");
const cameraEntity = cameraWrap.createChild("camera");
cameraEntity.transform.position = new Vector3(0, 3, 8);
cameraEntity.transform.rotation = new Vector3(-2, 0, 0);
cameraEntity.addComponent(Camera);

const lightNode = rootEntity.createChild("light_node");
const light = lightNode.addComponent(DirectLight);
light.intensity = 0.6;
lightNode.transform.lookAt(new Vector3(0, 0, 1));
lightNode.transform.rotate(new Vector3(0, 90, 0));

engine.resourceManager
  .load<GLTFResource>(
    "https://gw.alipayobjects.com/os/bmw-prod/ca50859b-d736-4a3e-9fc3-241b0bd2afef.gltf"
  )
  .then((gltfResource) => {
    const { defaultSceneRoot } = gltfResource;
    defaultSceneRoot.transform.setScale(0.05, 0.05, 0.05);
    rootEntity.addChild(defaultSceneRoot);
  });

engine.resourceManager
  .load<GLTFResource>(
    "https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb"
  )
  .then((gltfResource) => {
    const { defaultSceneRoot, animations } = gltfResource;
    rootEntity.addChild(defaultSceneRoot);
    const animator = defaultSceneRoot.getComponent(Animator);

    //custom rotate clip
    const rotateClip = new AnimationClip("rotate");
    const rotateState =
      animator.animatorController.layers[0].stateMachine.addState("rotate");
    rotateState.clip = rotateClip;
    const rotateCurve = new AnimationVector3Curve();
    const key1 = new Keyframe<Vector3>();
    key1.time = 0;
    key1.value = new Vector3(0, 0, 0);
    const key2 = new Keyframe<Vector3>();
    key2.time = 15;
    key2.value = new Vector3(0, 360, 0);
    rotateCurve.addKey(key1);
    rotateCurve.addKey(key2);
    rotateClip.addCurveBinding("", Transform, "rotation", rotateCurve);

    //custom light animation
    const sceneAnimator = rootEntity.addComponent(Animator);
    sceneAnimator.animatorController = new AnimatorController();
    const layer = new AnimatorControllerLayer("base");
    sceneAnimator.animatorController.addLayer(layer);
    const stateMachine = (layer.stateMachine = new AnimatorStateMachine());
    const sceneState = stateMachine.addState("sceneAnim");
    const sceneClip = (sceneState.clip = new AnimationClip("color"));

    const colorCurve = new AnimationColorCurve();
    const key3 = new Keyframe<Color>();
    key3.time = 0;
    key3.value = new Color(1, 0, 0, 1);
    const key4 = new Keyframe<Color>();
    key4.time = 5;
    key4.value = new Color(0, 1, 0, 1);
    const key5 = new Keyframe<Color>();
    key5.time = 10;
    key5.value = new Color(0, 1, 0, 1);
    const key6 = new Keyframe<Color>();
    key6.time = 15;
    key6.value = new Color(1, 0, 0, 1);
    colorCurve.addKey(key3);
    colorCurve.addKey(key4);
    colorCurve.addKey(key5);
    colorCurve.addKey(key6);

    const fovCurve = new AnimationFloatCurve();
    const key7 = new Keyframe<number>();
    key7.time = 0;
    key7.value = 45;
    const key8 = new Keyframe<number>();
    key8.time = 8;
    key8.value = 80;
    const key9 = new Keyframe<number>();
    key9.time = 15;
    key9.value = 45;

    fovCurve.addKey(key7);
    fovCurve.addKey(key8);
    fovCurve.addKey(key9);

    sceneClip.addCurveBinding("/light_node", DirectLight, "color", colorCurve);
    // curve can be reused
    sceneClip.addCurveBinding(
      "/camera_wrap",
      Transform,
      "rotation",
      rotateCurve
    );
    sceneClip.addCurveBinding(
      "/camera_wrap/camera",
      Camera,
      "fieldOfView",
      fovCurve
    );

    sceneAnimator.play("sceneAnim", 0);
    animator.play("rotate", 0);

    initDatGUI(animator, animations);
  });

engine.run();

const initDatGUI = (animator, animations) => {
  const animationNames = animations
    .filter((clip) => !clip.name.includes("pose"))
    .map((clip) => clip.name);
  animationNames.unshift("rotate");
  const debugInfo = {
    animation: animationNames[0],
    speed: 1,
  };

  gui.add(debugInfo, "animation", animationNames).onChange((v) => {
    animator.crossFade(v, 0.3);
  });

  gui.add(debugInfo, "speed", -1, 1).onChange((v) => {
    animator.speed = v;
  });
};
