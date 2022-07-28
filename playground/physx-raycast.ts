/**
 * @title PhysX Raycast
 * @category Physics
 */

import {
  BlinnPhongMaterial,
  BoxColliderShape,
  Camera,
  CapsuleColliderShape,
  Entity,
  HitResult,
  Layer,
  MeshRenderer,
  PlaneColliderShape,
  PrimitiveMesh,
  Ray,
  SphereColliderShape,
  StaticCollider,
  DynamicCollider,
  WebGLEngine,
  Quaternion,
  Vector3,
  DirectLight,
  Script,
  PointerButton, TextRenderer, Color, Font
} from "oasis-engine";
import {OrbitControl} from "oasis-engine-toolkit";

import {PhysXPhysics} from "@oasis-engine/physics-physx";

class GeometryGenerator extends Script {
  quat: Quaternion;

  onAwake() {
    this.quat = new Quaternion(0, 0, 0.3, 0.7);
    this.quat.normalize();
  }

  onUpdate(deltaTime: number) {
    const quat = this.quat;
    const inputManager = this.engine.inputManager;
    if (inputManager.isPointerDown(PointerButton.Secondary)) {
      if (Math.random() > 0.5) {
        addSphere(this.entity, 0.5, new Vector3(
          Math.floor(Math.random() * 6) - 2.5,
          5,
          Math.floor(Math.random() * 6) - 2.5
        ), quat);
      } else {
        addCapsule(this.entity, 0.5, 2.0, new Vector3(
          Math.floor(Math.random() * 6) - 2.5,
          5,
          Math.floor(Math.random() * 6) - 2.5
        ), quat);
      }
    }
  }
}

class Raycast extends Script {
  camera: Camera;
  ray = new Ray();
  hit = new HitResult();

  onAwake() {
    this.camera = this.entity.getComponent(Camera);
  }

  onUpdate(deltaTime: number) {
    const engine = this.engine;
    const ray = this.ray;
    const hit = this.hit;
    const inputManager = this.engine.inputManager;
    if (inputManager.isPointerDown(PointerButton.Primary)) {
      this.camera.screenPointToRay(inputManager.pointerPosition, ray);

      const result = engine.physicsManager.raycast(ray, Number.MAX_VALUE, Layer.Layer0, hit);
      if (result) {
        const mtl = new BlinnPhongMaterial(engine);
        const color = mtl.baseColor;
        color.r = Math.random();
        color.g = Math.random();
        color.b = Math.random();
        color.a = 1.0;

        const meshes: MeshRenderer[] = [];
        hit.entity.getComponentsIncludeChildren(MeshRenderer, meshes);
        meshes.forEach((mesh: MeshRenderer) => {
          mesh.setMaterial(mtl);
        });
      }
    }
  }
}

// init scene
function init(rootEntity: Entity) {
  const quat = new Quaternion(0, 0, 0.3, 0.7);
  quat.normalize();
  addPlane(rootEntity, new Vector3(30, 0.1, 30), new Vector3, new Quaternion);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 8; i++) {
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < 8; j++) {
      const random = Math.floor(Math.random() * 3) % 3;
      switch (random) {
        case 0:
          addBox(rootEntity, new Vector3(1, 1, 1), new Vector3(
            -2.5 + i + 0.1 * i,
            Math.floor(Math.random() * 6) + 1,
            -2.5 + j + 0.1 * j
          ), quat);
          break;
        case 1:
          addSphere(rootEntity, 0.5, new Vector3(
            Math.floor(Math.random() * 16) - 2.5,
            5,
            Math.floor(Math.random() * 16) - 2.5
          ), quat);
          break;
        case 2:
          addCapsule(rootEntity, 0.5, 2.0, new Vector3(
            Math.floor(Math.random() * 16) - 2.5,
            5,
            Math.floor(Math.random() * 16) - 2.5
          ), quat);
          break;
        default:
          break;
      }
    }
  }
}

function addPlane(rootEntity: Entity, size: Vector3, position: Vector3, rotation: Quaternion): Entity {
  const mtl = new BlinnPhongMaterial(rootEntity.engine);
  mtl.baseColor.set(0.03179807202597362, 0.3939682161541871, 0.41177952549087604, 1);
  const planeEntity = rootEntity.createChild();
  planeEntity.layer = Layer.Layer1;

  const renderer = planeEntity.addComponent(MeshRenderer);
  renderer.mesh = PrimitiveMesh.createCuboid(rootEntity.engine, size.x, size.y, size.z);
  renderer.setMaterial(mtl);
  planeEntity.transform.position = position;
  planeEntity.transform.rotationQuaternion = rotation;

  const physicsPlane = new PlaneColliderShape();
  physicsPlane.setPosition(0, size.y, 0);
  const planeCollider = planeEntity.addComponent(StaticCollider);
  planeCollider.addShape(physicsPlane);

  return planeEntity;
}

function addBox(rootEntity: Entity, size: Vector3, position: Vector3, rotation: Quaternion): Entity {
  const mtl = new BlinnPhongMaterial(rootEntity.engine);
  mtl.baseColor.set(Math.random(), Math.random(), Math.random(), 1.0);
  const boxEntity = rootEntity.createChild();
  const renderer = boxEntity.addComponent(MeshRenderer);

  renderer.mesh = PrimitiveMesh.createCuboid(rootEntity.engine, size.x, size.y, size.z);
  renderer.setMaterial(mtl);
  boxEntity.transform.position = position;
  boxEntity.transform.rotationQuaternion = rotation;

  const physicsBox = new BoxColliderShape();
  physicsBox.size = size;
  physicsBox.isTrigger = false;
  const boxCollider = boxEntity.addComponent(DynamicCollider);
  boxCollider.addShape(physicsBox);

  return boxEntity;
}

function addSphere(rootEntity: Entity, radius: number, position: Vector3, rotation: Quaternion): Entity {
  const mtl = new BlinnPhongMaterial(rootEntity.engine);
  mtl.baseColor.set(Math.random(), Math.random(), Math.random(), 1.0);
  const sphereEntity = rootEntity.createChild();
  const renderer = sphereEntity.addComponent(MeshRenderer);

  renderer.mesh = PrimitiveMesh.createSphere(rootEntity.engine, radius);
  renderer.setMaterial(mtl);
  sphereEntity.transform.position = position;
  sphereEntity.transform.rotationQuaternion = rotation;

  const physicsSphere = new SphereColliderShape();
  physicsSphere.radius = radius;
  const sphereCollider = sphereEntity.addComponent(DynamicCollider);
  sphereCollider.addShape(physicsSphere);

  return sphereEntity;
}

function addCapsule(rootEntity: Entity, radius: number, height: number, position: Vector3, rotation: Quaternion): Entity {
  const mtl = new BlinnPhongMaterial(rootEntity.engine);
  mtl.baseColor.set(Math.random(), Math.random(), Math.random(), 1.0);
  const capsuleEntity = rootEntity.createChild();
  const renderer = capsuleEntity.addComponent(MeshRenderer);

  renderer.mesh = PrimitiveMesh.createCapsule(rootEntity.engine, radius, height, 20)
  renderer.setMaterial(mtl);
  capsuleEntity.transform.position = position;
  capsuleEntity.transform.rotationQuaternion = rotation;

  const physicsCapsule = new CapsuleColliderShape();
  physicsCapsule.radius = radius;
  physicsCapsule.height = height;
  const capsuleCollider = capsuleEntity.addComponent(DynamicCollider);
  capsuleCollider.addShape(physicsCapsule);

  return capsuleEntity;
}

//----------------------------------------------------------------------------------------------------------------------
PhysXPhysics.initialize().then(() => {
  const engine = new WebGLEngine("canvas");
  engine.physicsManager.initialize(PhysXPhysics);

  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();
  rootEntity.addComponent(GeometryGenerator);

  // init camera
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.addComponent(Camera);
  const pos = cameraEntity.transform.position;
  pos.set(20, 20, 20);
  cameraEntity.transform.lookAt(new Vector3());
  cameraEntity.addComponent(OrbitControl);
  cameraEntity.addComponent(Raycast);

  const entity = cameraEntity.createChild("text");
  entity.transform.position = new Vector3(0, 3.5, -10);
  const renderer = entity.addComponent(TextRenderer);
  renderer.color = new Color();
  renderer.text = "Use mouse to click the entity";
  renderer.font = Font.createFromOS(entity.engine, "Arial");
  renderer.fontSize = 40;

  // init light
  scene.ambientLight.diffuseSolidColor.set(0.5, 0.5, 0.5, 1);

  // init directional light
  const light = rootEntity.createChild("light");
  light.transform.setPosition(0.3, 1, 0.4);
  light.transform.lookAt(new Vector3(0, 0, 0));
  light.addComponent(DirectLight);

  init(rootEntity);

  engine.run();
});
