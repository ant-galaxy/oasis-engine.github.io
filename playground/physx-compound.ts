/**
 * @title PhysX Compound
 * @category Physics
 */

import { OrbitControl } from "oasis-engine-toolkit";
import { PhysXPhysics } from "@oasis-engine/physics-physx";
import {
  BlinnPhongMaterial,
  BoxColliderShape,
  Camera,
  DirectLight,
  DynamicCollider,
  Entity,
  MeshRenderer,
  PlaneColliderShape,
  PrimitiveMesh,
  Quaternion,
  Script,
  StaticCollider,
  Vector2,
  Vector3,
  WebGLEngine
} from "oasis-engine";

class TableGenerator extends Script {
  private _totalTime: number = 0;

  onUpdate(deltaTime: number): void {
    this._totalTime += deltaTime;
    if (this._totalTime > 300) {
      this._addTable();
      this._totalTime = 0;
    }
  }

  private _addTable(): void {
    const entity = this.entity.createChild("entity");
    entity.transform.setPosition(Math.random() * 16 - 8, 10, Math.random() * 16 - 8);
    entity.transform.setRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360);
    entity.transform.setScale(3, 3, 3);
    const boxCollider = entity.addComponent(DynamicCollider);
    boxCollider.mass = 10.0;

    const boxMaterial = new BlinnPhongMaterial(this.engine);
    boxMaterial.baseColor.set(Math.random(), Math.random(), Math.random(), 1.0);
    boxMaterial.shininess = 128;
    {
      const physicsBox = new BoxColliderShape();
      physicsBox.size = new Vector3(0.5, 0.4, 0.045);
      physicsBox.setPosition(0, 0, 0.125);
      boxCollider.addShape(physicsBox);
      const child = entity.createChild();
      child.transform.setPosition(0, 0, 0.125);
      const boxRenderer = child.addComponent(MeshRenderer);
      boxRenderer.mesh = PrimitiveMesh.createCuboid(this.engine, 0.5, 0.4, 0.045);
      boxRenderer.setMaterial(boxMaterial);
    }

    {
      const physicsBox1 = new BoxColliderShape();
      physicsBox1.size = new Vector3(0.1, 0.1, 0.3);
      physicsBox1.setPosition(-0.2, -0.15, -0.045);
      boxCollider.addShape(physicsBox1);
      const child = entity.createChild();
      child.transform.setPosition(-0.2, -0.15, -0.045);
      const boxRenderer = child.addComponent(MeshRenderer);
      boxRenderer.mesh = PrimitiveMesh.createCuboid(this.engine, 0.1, 0.1, 0.3);
      boxRenderer.setMaterial(boxMaterial);
    }

    {
      const physicsBox2 = new BoxColliderShape();
      physicsBox2.size = new Vector3(0.1, 0.1, 0.3);
      physicsBox2.setPosition(0.2, -0.15, -0.045);
      boxCollider.addShape(physicsBox2);
      const child = entity.createChild();
      child.transform.setPosition(0.2, -0.15, -0.045);
      const boxRenderer = child.addComponent(MeshRenderer);
      boxRenderer.mesh = PrimitiveMesh.createCuboid(this.engine, 0.1, 0.1, 0.3);
      boxRenderer.setMaterial(boxMaterial);
    }

    {
      const physicsBox3 = new BoxColliderShape();
      physicsBox3.size = new Vector3(0.1, 0.1, 0.3);
      physicsBox3.setPosition(-0.2, 0.15, -0.045);
      boxCollider.addShape(physicsBox3);
      const child = entity.createChild();
      child.transform.setPosition(-0.2, 0.15, -0.045);
      const boxRenderer = child.addComponent(MeshRenderer);
      boxRenderer.mesh = PrimitiveMesh.createCuboid(this.engine, 0.1, 0.1, 0.3);
      boxRenderer.setMaterial(boxMaterial);
    }

    {
      const physicsBox4 = new BoxColliderShape();
      physicsBox4.size = new Vector3(0.1, 0.1, 0.3);
      physicsBox4.setPosition(0.2, 0.15, -0.045);
      boxCollider.addShape(physicsBox4);
      const child = entity.createChild();
      child.transform.setPosition(0.2, 0.15, -0.045);
      const boxRenderer = child.addComponent(MeshRenderer);
      boxRenderer.mesh = PrimitiveMesh.createCuboid(this.engine, 0.1, 0.1, 0.3);
      boxRenderer.setMaterial(boxMaterial);
    }
  }
}

PhysXPhysics.initialize().then(() => {
  const engine = new WebGLEngine("canvas");
  engine.physicsManager.initialize(PhysXPhysics);

  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity("root");
  scene.ambientLight.diffuseSolidColor.set(0.5, 0.5, 0.5, 1);

  // init camera
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(10, 10, 10);
  cameraEntity.addComponent(OrbitControl);

  // init directional light
  const light = rootEntity.createChild("light");
  light.transform.setPosition(0.3, 1, 0.4);
  light.transform.lookAt(new Vector3(0, 0, 0));
  light.addComponent(DirectLight);

  addPlane(rootEntity, new Vector2(30, 30), new Vector3(), new Quaternion());
  rootEntity.addComponent(TableGenerator);

  // Run engine
  engine.run();
});

function addPlane(rootEntity: Entity, size: Vector2, position: Vector3, rotation: Quaternion): Entity {
  const engine = rootEntity.engine;
  const material = new BlinnPhongMaterial(engine);
  material.baseColor.set(0.04, 0.42, 0.45, 1);
  material.shininess = 128;

  const entity = rootEntity.createChild();
  const renderer = entity.addComponent(MeshRenderer);
  entity.transform.position = position;
  entity.transform.rotationQuaternion = rotation;
  renderer.mesh = PrimitiveMesh.createPlane(engine, size.x, size.y);
  renderer.setMaterial(material);

  const physicsPlane = new PlaneColliderShape();
  physicsPlane.setPosition(0, 0.1, 0);
  const planeCollider = entity.addComponent(StaticCollider);
  planeCollider.addShape(physicsPlane);

  return entity;
}
