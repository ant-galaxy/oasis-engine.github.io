(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{497:function(n,e,t){"use strict";t.r(e),e.default='import { OrbitControl } from "@oasis-engine/controls";\nimport * as dat from "dat.gui";\nimport {\n  AmbientLight,\n  AssetType,\n  Camera,\n  Color,\n  DirectLight,\n  EnvironmentMapLight,\n  GLTFResource,\n  SkyBox,\n  SystemInfo,\n  TextureCubeMap,\n  Vector3,\n  WebGLEngine\n} from "oasis-engine";\n\n//-- create engine object\nlet engine = new WebGLEngine("o3-demo");\nengine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;\nengine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;\n\nlet scene = engine.sceneManager.activeScene;\nconst rootEntity = scene.createRootEntity();\n\nconst color2glColor = (color) => new Color(color[0] / 255, color[1] / 255, color[2] / 255);\nconst glColor2Color = (color) => new Color(color[0] * 255, color[1] * 255, color[2] * 255);\nconst gui = new dat.GUI();\ngui.domElement.style = "position:absolute;top:0px;left:50vw";\n\nlet envLightNode = rootEntity.createChild("env_light");\nlet envLight = envLightNode.addComponent(EnvironmentMapLight);\nlet envFolder = gui.addFolder("EnvironmentMapLight");\nenvFolder.add(envLight, "enabled");\nenvFolder.add(envLight, "specularIntensity", 0, 1);\nenvFolder.add(envLight, "diffuseIntensity", 0, 1);\n\nlet directLightColor = { color: [255, 255, 255] };\nlet directLightNode = rootEntity.createChild("dir_light");\nlet directLight = directLightNode.addComponent(DirectLight);\ndirectLight.color = new Color(1, 1, 1);\nlet dirFolder = gui.addFolder("DirectionalLight1");\ndirFolder.add(directLight, "enabled");\ndirFolder.addColor(directLightColor, "color").onChange((v) => (directLight.color = color2glColor(v)));\ndirFolder.add(directLight, "intensity", 0, 1);\n\nconst ambient = rootEntity.addComponent(AmbientLight);\nambient.color = new Color(0.2, 0.2, 0.2, 1);\n\n//-- create camera\nlet cameraNode = rootEntity.createChild("camera_node");\ncameraNode.transform.position = new Vector3(0, 0, 5);\ncameraNode.addComponent(Camera);\ncameraNode.addComponent(OrbitControl);\n\nPromise.all([\n  engine.resourceManager\n    .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/83219f61-7d20-4704-890a-60eb92aa6159.gltf")\n    .then((gltf) => {\n      rootEntity.addChild(gltf.defaultSceneRoot);\n      console.log(gltf);\n    }),\n  engine.resourceManager\n    .load<TextureCubeMap>({\n      urls: [\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ"\n      ],\n      type: AssetType.TextureCube\n    })\n    .then((cubeMap) => {\n      envLight.diffuseTexture = cubeMap;\n    }),\n  engine.resourceManager\n    .load<TextureCubeMap>({\n      urls: [\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"\n      ],\n      type: AssetType.TextureCube\n    })\n    .then((cubeMap) => {\n      envLight.specularTexture = cubeMap;\n      rootEntity.addComponent(SkyBox).skyBoxMap = cubeMap;\n    })\n]).then(() => {\n  engine.run();\n});\n'}}]);