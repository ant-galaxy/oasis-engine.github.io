/**
 * @title Framebuffer Picker
 * @category Toolkit
 */
import { Camera, GLTFResource, PBRMaterial, PointerButton, Script, Vector3, WebGLEngine } from "oasis-engine";
import { FramebufferPicker, OrbitControl } from "oasis-engine-toolkit";

class ClickScript extends Script {
  material: PBRMaterial;

  onUpdate(): void {
    const inputManager = this.engine.inputManager;
    if (inputManager.isPointerDown(PointerButton.Primary)) {
      const pointerPosition = inputManager.pointerPosition;
      framebufferPicker.pick(pointerPosition.x, pointerPosition.y).then((renderElement) => {
        if (renderElement) {
          this.material.baseColor.set(1, 0, 0, 1);
        } else {
          this.material.baseColor.set(1, 1, 1, 1);
        }
      });
    }
  }
}

const engine = new WebGLEngine("canvas");
engine.canvas.resizeByClientSize();
const scene = engine.sceneManager.activeScene;
const rootNode = scene.createRootEntity();
scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);

const cameraEntity = rootNode.createChild("camera_node");
const camera = cameraEntity.addComponent(Camera);
const control = cameraEntity.addComponent(OrbitControl);
cameraEntity.transform.position = new Vector3(10, 10, 30);
control.target.set(0, 3, 0);

const framebufferPicker = rootNode.addComponent(FramebufferPicker);
framebufferPicker.camera = camera;

engine.resourceManager
  .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/f40ef8dd-4c94-41d4-8fac-c1d2301b6e47.glb")
  .then((gltf) => {
    const { defaultSceneRoot, materials } = gltf;
    const material = materials[0] as PBRMaterial;

    defaultSceneRoot.transform.setScale(0.1, 0.1, 0.1);
    rootNode.addChild(defaultSceneRoot);

    const click = cameraEntity.addComponent(ClickScript);
    click.material = material;
  });

engine.run();
