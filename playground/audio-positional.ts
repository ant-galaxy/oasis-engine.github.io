/**
 * @title Audio Positional
 * @category Audio
 */
import {
  AssetType,
  AudioClip,
  AudioListener,
  PositionalAudioSource,
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  Vector3,
  WebGLEngine,
  PBRMaterial,
  DirectLight,
  AmbientLight,
  Entity,
  Script,
  Pointer,
  StaticCollider,
  SphereColliderShape,
} from "@galacean/engine";

import { LitePhysics } from "@galacean/engine-physics-lite";
import { FreeControl } from "@galacean/engine-toolkit-controls";
import { GridControl } from "@galacean/engine-toolkit-custom-material";
import { LineDrawer } from "@galacean/engine-toolkit-auxiliary-lines";

import * as dat from "dat.gui";

const gui = new dat.GUI();
function addGUI(audioSource: PositionalAudioSource) {
  const state = {
    volume: 1,
    mute: false,
    playbackRate: 1,
    loop: true,
    panningMode: ["equalpower"],
    minDistance: 1,
    maxDistance: 10,
    distanceModel: ["linear"],
    innerAngle: 360,
    outerAngle: 360,
    outerVolume: 0,
  };

  // basic setup
  gui.add(state, "volume", 0, 10).onChange((v: number) => {
    audioSource.volume = v;
  });

  gui.add(state, "mute").onChange((v: boolean) => {
    audioSource.mute = v;
  });

  gui.add(state, "playbackRate", 0, 2).onChange((v: number) => {
    audioSource.playbackRate = v;
  });

  gui.add(state, "loop").onChange((v: boolean) => {
    audioSource.loop = v;
  });
  // distance model
  const panningModeConfig = ["HRTF", "equalpower"];
  const distanceModelConfig = ["exponential", "inverse", "linear"];

  gui
    .add(state, "panningMode", panningModeConfig)
    .onChange((v: PanningModelType) => {
      audioSource.PanningMode = v;
    });

  gui.add(state, "minDistance", 0, 5).onChange((v: number) => {
    audioSource.minDistance = v;
  });

  gui.add(state, "maxDistance", 5, 100).onChange((v: number) => {
    audioSource.maxDistance = v;
  });

  gui
    .add(state, "distanceModel", distanceModelConfig)
    .onChange((v: DistanceModelType) => {
      audioSource.distanceModel = v;
    });

  // direction model
  gui.add(state, "innerAngle", 0, 360).onChange((v: number) => {
    audioSource.innerAngle = v;
  });

  gui.add(state, "outerAngle", 0, 360).onChange((v: number) => {
    audioSource.outerAngle = v;
  });

  gui.add(state, "outerVolume", 0, 1).onChange((v: number) => {
    audioSource.outerVolume = v;
  });
}
class HitPlayScript extends Script {
  public onClick: () => any;
  onPointerDown(pointer: Pointer): void {
    this.onClick && this.onClick();
  }
}
class AudioScript extends Script {
  private _audioSource: PositionalAudioSource;
  constructor(entity: Entity) {
    super(entity);
    this._audioSource = this.entity.getComponent(PositionalAudioSource);
  }

  onUpdate() {
    const maxRadius = this._audioSource.maxDistance;
    const minRadius = this._audioSource.minDistance;
    const pos = this.entity.transform.position;
    LineDrawer.drawSphere(maxRadius, pos);
    LineDrawer.drawSphere(minRadius, pos);
  }
}

// Create engine
WebGLEngine.create({ canvas: "canvas", physics: new LitePhysics() }).then(
  (engine) => {
    engine.canvas.resizeByClientSize();
    // Scene
    const rootEntity = engine.sceneManager.activeScene.createRootEntity();
    const scene = engine.sceneManager.activeScene;
    scene.background.solidColor.set(0, 0, 0, 1);

    scene.ambientLight.diffuseSolidColor.set(1, 0, 0, 1);
    scene.ambientLight.diffuseIntensity = 1.2;

    // Camera
    const cameraEntity = rootEntity.createChild("Camera");
    cameraEntity.transform.setPosition(0, 4, 25);
    cameraEntity.transform.lookAt(new Vector3(0, 2, 0), new Vector3(0, 1, 0));

    const camera = cameraEntity.addComponent(Camera);
    const controller = cameraEntity.addComponent(FreeControl);
    controller.floorMock = false;
    controller.movementSpeed = 10;

    cameraEntity.addComponent(AudioListener);

    // light
    const light = rootEntity.createChild("light");
    light.transform.setPosition(-140, 1000, -1020);
    light.transform.lookAt(new Vector3(30, 0, 300));
    const directLight = light.addComponent(DirectLight);
    directLight.color.set(0, 0.6, 0.8, 1);

    // Grid
    const grid = rootEntity.addComponent(GridControl);
    grid.camera = camera;
    rootEntity.addComponent(MeshRenderer);
    rootEntity.addComponent(LineDrawer);

    // Sphere
    const sphereEntity = rootEntity.createChild("sphere");
    sphereEntity.transform.setPosition(0, 2, 0);
    const sphereRender = sphereEntity.addComponent(MeshRenderer);
    sphereRender.mesh = PrimitiveMesh.createSphere(engine, 1);
    const material = new PBRMaterial(engine);
    material.baseColor.set(1, 0.4, 0.2, 1);
    sphereRender.setMaterial(material);

    const playCollider = sphereEntity.addComponent(StaticCollider);
    const playShape = new SphereColliderShape();
    playShape.radius = 1;
    playCollider.addShape(playShape);

    const playHandler = sphereEntity.addComponent(HitPlayScript);

    engine.resourceManager
      .load<AmbientLight>({
        type: AssetType.Env,
        url: "https://gw.alipayobjects.com/os/bmw-prod/89c54544-1184-45a1-b0f5-c0b17e5c3e68.bin",
      })
      .then((ambientLight) => {
        scene.ambientLight = ambientLight;
      });

    engine.resourceManager
      .load<AudioBuffer>({
        url: "https://mass-office.alipay.com/huamei_koqzbu/afts/file/JLvfSZkPfIoAAAAAAAAAABAADnV5AQBr",
        type: AssetType.Audio,
      })
      .then((audioBuffer) => {
        const clip = new AudioClip(engine);
        clip.setData(audioBuffer);

        const audioSource = sphereEntity.addComponent(PositionalAudioSource);
        audioSource.clip = clip;
        audioSource.loop = true;
        audioSource.maxDistance = 10;
        audioSource.distanceModel = "linear";
        addGUI(audioSource);

        sphereEntity.addComponent(AudioScript);

        playHandler.onClick = () => {
          audioSource.play();
          material.baseColor.set(
            Math.random(),
            Math.random(),
            Math.random(),
            1
          );
        };
      });

    engine.run();
  }
);
