/**
 * @title Raycast
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
  PhysicsMaterialCombineMode,
  PlaneColliderShape,
  PointLight,
  PrimitiveMesh,
  Ray,
  Script,
  SphereColliderShape,
  StaticCollider,
  WebGLEngine
} from "oasis-engine";
import { MathUtil, Quaternion, Vector2, Vector3 } from "@oasis-engine/math";
import { OrbitControl } from "@oasis-engine/controls";

import { PhysXPhysics } from "@oasis-engine/physics-physx";

PhysXPhysics.init().then(() => {
  const engine = new WebGLEngine("canvas", PhysXPhysics);

  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // init camera
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.addComponent(Camera);
  const pos = cameraEntity.transform.position;
  pos.setValue(10, 10, 10);
  cameraEntity.transform.position = pos;
  cameraEntity.addComponent(OrbitControl);

  // init light
  scene.ambientLight.diffuseSolidColor.setValue(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = 1.2;

  const light = rootEntity.createChild("light");
  light.transform.position = new Vector3(0, 5, 0);
  const p = light.addComponent(PointLight);
  p.intensity = 0.3;

  init();

  window.addEventListener("mousedown", (event: MouseEvent) => {
    const ray = new Ray();
    cameraEntity.getComponent(Camera).screenPointToRay(
      new Vector2(event.pageX * window.devicePixelRatio, event.pageY * window.devicePixelRatio), ray);

    const hit = new HitResult();
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
  });

  window.addEventListener("mousedown", (event: MouseEvent) => {
    if (event.button === 2) {
      if (Math.random() > 0.5) {
        addSphere(0.5, new Vector3(
          Math.floor(Math.random() * 6) - 2.5,
          5,
          Math.floor(Math.random() * 6) - 2.5
        ), new Quaternion(0, 0, 0.3, 0.7));
      } else {
        addCapsule(0.5, 2.0, new Vector3(
          Math.floor(Math.random() * 6) - 2.5,
          5,
          Math.floor(Math.random() * 6) - 2.5
        ), new Quaternion(0, 0, 0.3, 0.7));
      }
    }
  });

  engine.run();

  //--------------------------------------------------------------------------------------------------------------------
  // init scene
  function init() {
    addPlane(new Vector3(30, 0.1, 30), new Vector3, new Quaternion);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < 5; j++) {
        addBox(new Vector3(1, 1, 1), new Vector3(
          -2.5 + i + 0.1 * i,
          Math.floor(Math.random() * 6) + 1,
          -2.5 + j + 0.1 * j
        ), new Quaternion(0, 0, 0.3, 0.7));
      }
    }
  }

  //--------------------------------------------------------------------------------------------------------------------
  function addPlane(size: Vector3, position: Vector3, rotation: Quaternion): Entity {
    const mtl = new BlinnPhongMaterial(engine);
    const color = mtl.baseColor;
    color.r = 0.03179807202597362;
    color.g = 0.3939682161541871;
    color.b = 0.41177952549087604;
    color.a = 1.0;
    const planeEntity = rootEntity.createChild();
    planeEntity.layer = Layer.Layer1;

    const renderer = planeEntity.addComponent(MeshRenderer);
    renderer.mesh = PrimitiveMesh.createCuboid(engine, size.x, size.y, size.z);
    renderer.setMaterial(mtl);
    planeEntity.transform.position = position;
    planeEntity.transform.rotationQuaternion = rotation;

    const physicsPlane = new PlaneColliderShape();
    const planeCollider = planeEntity.addComponent(StaticCollider);
    planeCollider.addShape(physicsPlane);
    engine.physicsManager.addCollider(planeCollider);

    return planeEntity;
  }

  function addBox(size: Vector3, position: Vector3, rotation: Quaternion): Entity {
    const mtl = new BlinnPhongMaterial(engine);
    const color = mtl.baseColor;
    color.r = Math.random();
    color.g = Math.random();
    color.b = Math.random();
    color.a = 1.0;
    const boxEntity = rootEntity.createChild();
    const renderer = boxEntity.addComponent(MeshRenderer);

    renderer.mesh = PrimitiveMesh.createCuboid(engine, size.x, size.y, size.z);
    renderer.setMaterial(mtl);
    boxEntity.transform.position = position;
    boxEntity.transform.rotationQuaternion = rotation;

    const physicsBox = new BoxColliderShape();
    physicsBox.extents = size;
    physicsBox.material.staticFriction = 1;
    physicsBox.material.dynamicFriction = 2;
    physicsBox.material.bounciness = 0.1;
    physicsBox.isTrigger(false);

    const boxCollider = boxEntity.addComponent(StaticCollider);
    boxCollider.addShape(physicsBox);
    engine.physicsManager.addCollider(boxCollider);

    return boxEntity;
  }

  function addSphere(radius: number, position: Vector3, rotation: Quaternion): Entity {
    const mtl = new BlinnPhongMaterial(engine);
    const color = mtl.baseColor;
    color.r = Math.random();
    color.g = Math.random();
    color.b = Math.random();
    color.a = 1.0;
    const sphereEntity = rootEntity.createChild();
    const renderer = sphereEntity.addComponent(MeshRenderer);

    sphereEntity.addComponent(Script);

    renderer.mesh = PrimitiveMesh.createSphere(engine, radius);
    renderer.setMaterial(mtl);
    sphereEntity.transform.position = position;
    sphereEntity.transform.rotationQuaternion = rotation;

    const physicsSphere = new SphereColliderShape();
    physicsSphere.radius = radius;
    physicsSphere.material.staticFriction = 0.1;
    physicsSphere.material.dynamicFriction = 0.2;
    physicsSphere.material.bounciness = 1;
    physicsSphere.material.bounceCombine = PhysicsMaterialCombineMode.Minimum;

    const sphereCollider = sphereEntity.addComponent(StaticCollider);
    sphereCollider.addShape(physicsSphere);
    engine.physicsManager.addCollider(sphereCollider);

    return sphereEntity;
  }

  function addCapsule(radius: number, height: number, position: Vector3, rotation: Quaternion): Entity {
    const mtl = new BlinnPhongMaterial(engine);
    const color = mtl.baseColor;
    color.r = Math.random();
    color.g = Math.random();
    color.b = Math.random();
    color.a = 1.0;
    const cubeEntity = rootEntity.createChild();
    cubeEntity.transform.position = position;
    cubeEntity.transform.rotationQuaternion = rotation;
    const bodyEntity = cubeEntity.createChild("body");

    // eslint-disable-next-line no-param-reassign
    height -= radius * 2;
    // body
    {
      const renderer = bodyEntity.addComponent(MeshRenderer);
      renderer.mesh = PrimitiveMesh.createCylinder(engine, radius, radius, height);
      renderer.setMaterial(mtl);
    }

    // foot
    {
      const foot = bodyEntity.createChild("foot");
      const renderer = foot.addComponent(MeshRenderer);
      renderer.mesh = PrimitiveMesh.createSphere(engine, radius);
      renderer.setMaterial(mtl);
      foot.transform.position = new Vector3(0, -height / 2, 0);
    }

    // head
    {
      const head = bodyEntity.createChild("foot");
      const renderer = head.addComponent(MeshRenderer);
      renderer.mesh = PrimitiveMesh.createSphere(engine, radius);
      renderer.setMaterial(mtl);
      head.transform.position = new Vector3(0, height / 2, 0);
    }

    const physicsCapsule = new CapsuleColliderShape();
    physicsCapsule.radius = radius;
    physicsCapsule.height = height;

    const capsuleCollider = cubeEntity.addComponent(StaticCollider);
    capsuleCollider.addShape(physicsCapsule);
    engine.physicsManager.addCollider(capsuleCollider);

    return cubeEntity;
  }
});
