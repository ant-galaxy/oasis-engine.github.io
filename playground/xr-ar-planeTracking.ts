/**
 * @title AR plane tracking
 * @category XR
 */

import {
  Camera,
  Color,
  Entity,
  MeshRenderer,
  MeshTopology,
  ModelMesh,
  PrimitiveMesh,
  Script,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import {
  XRPlaneMode,
  XRPlaneTracking,
  XRSessionMode,
  XRTrackedInputDevice,
  XRTrackedPlane,
} from "@galacean/engine-xr";
import { WebXRDevice } from "@galacean/engine-xr-webxr";

WebGLEngine.create({
  canvas: "canvas",
  xrDevice: new WebXRDevice(),
}).then((engine) => {
  // 设置屏幕分辨率
  engine.canvas.resizeByClientSize(1);
  const { sceneManager, xrManager } = engine;
  const scene = sceneManager.scenes[0];
  const origin = (xrManager.origin = scene.createRootEntity("origin"));
  const camera = origin.createChild("Camera").addComponent(Camera);
  xrManager.cameraManager.attachCamera(XRTrackedInputDevice.Camera, camera);

  const entity = new Entity(engine);
  entity.addComponent(Axis);
  entity.addComponent(XRPlane);
  origin.addComponent(XRTrackedPlaneManager).prefab = entity;

  try {
    xrManager.addFeature(XRPlaneTracking, XRPlaneMode.EveryThing);
    xrManager.sessionManager.isSupportedMode(XRSessionMode.AR).then(
      () => {
        const content = xrManager.isSupportedFeature(XRPlaneTracking)
          ? "进入 AR"
          : "不支持平面追踪";
        addXRButton(content).onclick = () => {
          xrManager.enterXR(XRSessionMode.AR);
        };
      },
      (error) => {
        addXRButton("不支持 AR");
        console.error(error);
      }
    );
  } catch (error) {
    addXRButton("不支持相关功能");
  }

  engine.run();
});

class XRPlane extends Script {
  onStart(): void {
    const trackedComponent = this.entity.getComponent(TrackedComponent);
    const trackedPlane = trackedComponent?.data;
    if (!trackedPlane) return;
    const { entity, engine } = this;
    const renderer = entity.addComponent(MeshRenderer);
    const mesh = new ModelMesh(engine);
    mesh.setPositions(trackedPlane.polygon);
    mesh.addSubMesh(0, trackedPlane.polygon.length, MeshTopology.TriangleStrip);
    renderer.mesh = mesh;
    const material = new UnlitMaterial(engine);
    material.baseColor = new Color(
      Math.random(),
      Math.random(),
      Math.random(),
      0.5
    );
    renderer.setMaterial(material);
  }
}

class XRTrackedPlaneManager extends Script {
  private _prefab: Entity;
  private _trackIdToIndex: number[] = [];
  private _trackedComponents: Array<TrackedComponent> = [];

  get prefab(): Entity {
    return this._prefab;
  }

  set prefab(value: Entity) {
    this._prefab = value;
  }

  getTrackedComponentByTrackId(trackId: number): TrackedComponent | null {
    const index = this._trackIdToIndex[trackId];
    return index !== undefined ? this._trackedComponents[index] : null;
  }

  override onAwake(): void {
    const planeTracking = this._engine.xrManager.getFeature(XRPlaneTracking);
    this._onChanged = this._onChanged.bind(this);
    planeTracking?.addChangedListener(this._onChanged);
  }

  private _onChanged(
    added: readonly XRTrackedPlane[],
    updated: readonly XRTrackedPlane[],
    removed: readonly XRTrackedPlane[]
  ) {
    if (added.length > 0) {
      for (let i = 0, n = added.length; i < n; i++) {
        this._createOrUpdateTrackedComponents(added[i]);
      }
    }
    if (updated.length > 0) {
      for (let i = 0, n = updated.length; i < n; i++) {
        this._createOrUpdateTrackedComponents(updated[i]);
      }
    }
    if (removed.length > 0) {
      const {
        _trackIdToIndex: trackIdToIndex,
        _trackedComponents: trackedComponents,
      } = this;
      for (let i = 0, n = removed.length; i < n; i++) {
        const { id } = removed[i];
        const index = trackIdToIndex[id];
        if (index !== undefined) {
          const trackedComponent = trackedComponents[index];
          trackedComponents.splice(index, 1);
          delete trackIdToIndex[id];
          if (trackedComponent.destroyedOnRemoval) {
            trackedComponent.entity.destroy();
          } else {
            trackedComponent.entity.parent = null;
          }
        }
      }
    }
  }

  private _createOrUpdateTrackedComponents(
    sessionRelativeData: XRTrackedPlane
  ): TrackedComponent {
    let trackedComponent = this.getTrackedComponentByTrackId(
      sessionRelativeData.id
    );
    if (!trackedComponent) {
      const {
        _trackIdToIndex: trackIdToIndex,
        _trackedComponents: trackedComponents,
      } = this;
      trackedComponent = this._createTrackedComponents(sessionRelativeData);
      trackIdToIndex[sessionRelativeData.id] = trackedComponents.length;
      trackedComponents.push(trackedComponent);
    }
    trackedComponent.data = sessionRelativeData;
    const { transform } = trackedComponent.entity;
    const { pose } = sessionRelativeData;
    transform.position = pose.position;
    transform.rotationQuaternion = pose.rotation;
    return trackedComponent;
  }

  private _createTrackedComponents(
    sessionRelativeData: XRTrackedPlane
  ): TrackedComponent {
    const { origin } = this._engine.xrManager;
    const { _prefab: prefab } = this;
    let entity: Entity;
    if (prefab) {
      entity = prefab.clone();
      entity.name = `TrackedPlane${sessionRelativeData.id}`;
      origin.addChild(entity);
    } else {
      entity = origin.createChild(`TrackedPlane${sessionRelativeData.id}`);
    }
    const trackedComponent = entity.addComponent(TrackedComponent);
    return trackedComponent;
  }
}

export class TrackedComponent extends Script {
  private _data: XRTrackedPlane;
  private _destroyedOnRemoval = true;

  get destroyedOnRemoval(): boolean {
    return this._destroyedOnRemoval;
  }

  set destroyedOnRemoval(value: boolean) {
    this._destroyedOnRemoval = value;
  }

  get data(): XRTrackedPlane {
    return this._data;
  }

  set data(value: XRTrackedPlane) {
    this._data = value;
  }
}

class Axis extends Script {
  private _length = 0.1;
  private _arrows: Record<string, Entity> = {};
  private _sides: Record<string, Entity> = {};

  get length(): number {
    return this._length;
  }

  set length(value: number) {
    if (this._length !== value) {
      this._length = value;
      this._reset(value);
    }
  }

  onStart(): void {
    this._initSide("x", new Vector3(0, 0, -90), new Color(1, 0, 0, 1));
    this._initSide("y", new Vector3(0, 0, 0), new Color(0, 1, 0, 1));
    this._initSide("z", new Vector3(90, 0, 0), new Color(0, 0, 1, 1));
    this._initArrow("x", new Vector3(0, 0, -90), new Color(1, 0, 0, 1));
    this._initArrow("y", new Vector3(0, 0, 0), new Color(0, 1, 0, 1));
    this._initArrow("z", new Vector3(90, 0, 0), new Color(0, 0, 1, 1));
    this._reset(this._length);
  }

  private _reset(length: number): void {
    const { _arrows: arrows, _sides: sides } = this;
    arrows.x.transform.setPosition(length, 0, 0);
    arrows.y.transform.setPosition(0, length, 0);
    arrows.z.transform.setPosition(0, 0, length);

    sides.x.transform.setScale(1, length, 1);
    sides.y.transform.setScale(1, length, 1);
    sides.z.transform.setScale(1, length, 1);
  }

  private _initArrow(type: string, rot: Vector3, col: Color): void {
    const { engine, entity } = this;
    const arrow = (this._arrows[type] = entity.createChild("arrow" + type));
    const arrowRenderer = arrow.addComponent(MeshRenderer);
    arrowRenderer.mesh = PrimitiveMesh.createCone(engine, 0.004, 0.012);
    const material = new UnlitMaterial(engine);
    material.baseColor = col;
    arrowRenderer.setMaterial(material);
    arrow.transform.rotation = rot;
  }

  private _initSide(type: string, rot: Vector3, col: Color): void {
    const { engine, entity } = this;
    const side = (this._sides[type] = entity.createChild("side" + type));
    const rendererEntity = side.createChild("rendererEntity");
    rendererEntity.transform.position.set(0, 0.5, 0);
    const renderer = rendererEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCylinder(engine, 0.002, 0.002, 1);
    const material = new UnlitMaterial(engine);
    material.baseColor = col;
    renderer.setMaterial(material);
    side.transform.rotation = rot;
  }
}

function addXRButton(content: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = content;
  const { style } = button;
  style.position = "absolute";
  style.bottom = "20px";
  style.padding = "12px 6px";
  style.border = "1px solid rgb(255, 255, 255)";
  style.borderRadius = "4px";
  style.background = "rgba(0, 0, 0, 0.1)";
  style.color = "rgb(255, 255, 255)";
  style.font = "13px sans-serif";
  style.textAlign = "center";
  style.opacity = "0.5";
  style.outline = "none";
  style.zIndex = "999";
  style.cursor = "pointer";
  style.left = "calc(50% - 50px)";
  style.width = "100px";
  document.body.appendChild(button);
  return button;
}
