/**
 * @title Audio Basic
 * @category Audio
 */
import { OrbitControl } from "@galacean/engine-toolkit-controls";
import {
  AssetType,
  AudioClip,
  AudioSource,
  BoxColliderShape,
  Camera,
  Entity,
  GLTFResource,
  Pointer,
  Script,
  SpotLight,
  StaticCollider,
  TextRenderer,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import { LitePhysics } from "@galacean/engine-physics-lite";
class RecorderScript extends Script {
  public onClick: () => any;
  onPointerDown(pointer: Pointer): void {
    this.onClick && this.onClick();
  }
}

class LightScript extends Script {
  public zDir: boolean = true;

  private _startX: number = -4;
  private _highY: number = 16;
  private _x: number = -4;
  private _y: number = 0;
  private _spotLight: SpotLight;
  // from left to right
  private _originDir: boolean = true;
  private _currDir: boolean = true;

  set startX(value: number) {
    this._startX = value;
    this._x = value;
    this._highY = value * value;

    if (value <= 0) {
      this._originDir = true;
    } else {
      this._originDir = false;
    }
  }

  get startX(): number {
    return this._startX;
  }

  constructor(entity: Entity) {
    super(entity);
    this._spotLight = entity.getComponent(SpotLight);
  }

  onUpdate(deltaTime: number): void {
    if (this._originDir) {
      // 开始时候是从左向右
      if (this._x >= -this.startX) {
        this._currDir = false;
      }
      if (this._x <= this.startX) {
        this._currDir = true;
      }
    } else {
      // 开始的时候是从右向左
      if (this._x >= this.startX) {
        this._currDir = false;
      }
      if (this._x <= -this.startX) {
        this._currDir = true;
      }
    }

    // 根据current direction计算
    if (this._currDir) {
      this._x = this._x + 4 * deltaTime;
    } else {
      this._x = this._x - 4 * deltaTime;
    }

    this._y = this._highY - this._x * this._x;
    if (this.zDir) {
      this.entity.transform.setPosition(this._x, this._y, this._x);
      this._spotLight.direction.set(-this._x, -this._y, -this._x);
    } else {
      this.entity.transform.setPosition(this._x, this._y, -this._x);
      this._spotLight.direction.set(-this._x, -this._y, this._x);
    }
  }
}

class BarScript extends Script {
  private _audioSource: AudioSource;
  private _barRenderer: TextRenderer;

  constructor(entity: Entity) {
    super(entity);
    this._audioSource = entity.getComponent(AudioSource);
    this._barRenderer = entity.children[0].getComponent(TextRenderer);
  }

  onUpdate(deltaTime: number): void {
    if (this._audioSource.isPlaying) {
      const percent = this._audioSource.time / this._audioSource.clip.duration;
      this._barRenderer.text = `${Math.floor(percent * 100)}` + "%";
    }
  }
}

function addBtn(
  rootEntity: Entity,
  position: Vector3,
  name: string,
  clickHandler: () => any
) {
  const playEntity = rootEntity.createChild(name);
  playEntity.transform.setPosition(position.x, position.y, position.z);

  const playCollider = playEntity.addComponent(StaticCollider);
  const playShape = new BoxColliderShape();
  playShape.size = new Vector3(1.4, 0.9, 1);
  playCollider.addShape(playShape);

  const playBtnEntity = playEntity.createChild("playbtn");
  playBtnEntity.transform.setPosition(0, 1, 0);
  const playText = playBtnEntity.addComponent(TextRenderer);
  playText.text = name;

  const playScript = playEntity.addComponent(RecorderScript);
  playScript.onClick = clickHandler;

  return playEntity;
}

// Create engine
WebGLEngine.create({ canvas: "canvas", physics: new LitePhysics() }).then(
  (engine) => {
    engine.canvas.resizeByClientSize();
    // Create root entity
    const rootEntity = engine.sceneManager.activeScene.createRootEntity();

    // Create camera
    const cameraEntity = rootEntity.createChild("Camera");
    cameraEntity.transform.setPosition(12, 16, 16);
    cameraEntity.addComponent(Camera);
    cameraEntity.addComponent(OrbitControl);

    // create light
    const lightEntity = rootEntity.createChild();

    const lightAEntity = lightEntity.createChild();
    const lightA = lightAEntity.addComponent(SpotLight);
    lightA.angle = 30;
    lightA.penumbra = 15;
    lightA.color.set(1, 0, 0, 1);
    const lightAHandler = lightAEntity.addComponent(LightScript);
    lightAHandler.startX = -4;

    const lightBEntity = lightEntity.createChild();
    const lightB = lightBEntity.addComponent(SpotLight);
    lightB.angle = 30;
    lightB.penumbra = 15;
    lightB.color.set(0, 1, 0, 1);
    const lightBHandler = lightBEntity.addComponent(LightScript);
    lightBHandler.startX = -4;
    lightBHandler.zDir = false;

    lightA.enabled = false;
    lightB.enabled = false;

    engine.resourceManager
      .load<GLTFResource>({
        url: "https://gw.alipayobjects.com/mdn/oasis_be/afts/file/A*96_aSZfBP7wAAAAAAAAAAAAADkp5AQ/tape_recorder.glb",
        type: AssetType.GLTF,
      })
      .then((asset) => {
        const { defaultSceneRoot } = asset;
        const recorderEntity = defaultSceneRoot;
        rootEntity.addChild(recorderEntity);
        recorderEntity.transform.setScale(10, 10, 10);
      });

    engine.resourceManager
      .load<AudioClip>({
        url: "https://mass-office.alipay.com/huamei_koqzbu/afts/file/JLvfSZkPfIoAAAAAAAAAABAADnV5AQBr",
        type: AssetType.Audio,
      })
      .then((clip: AudioClip) => {
        const playerEntity = rootEntity.createChild("player");

        const audioSource = playerEntity.addComponent(AudioSource);
        audioSource.clip = clip;

        const percentEntity = playerEntity.createChild();
        percentEntity.transform.setPosition(0, 8, 0);
        const test = percentEntity.addComponent(TextRenderer);
        test.fontSize = 80;
        playerEntity.addComponent(BarScript);

        // play btn
        addBtn(rootEntity, new Vector3(3.3, 4, 0), "PLAY", () => {
          audioSource.play();

          lightA.enabled = true;
          lightB.enabled = true;
        });
        // stop btn
        addBtn(rootEntity, new Vector3(-2.3, 4, 0), "STOP", () => {
          audioSource.stop();
          lightA.enabled = false;
          lightB.enabled = false;
        });

        addBtn(rootEntity, new Vector3(0.5, 4, 0), "PAUSE", () => {
          audioSource.pause();
        });
      });

    engine.run();
  }
);
