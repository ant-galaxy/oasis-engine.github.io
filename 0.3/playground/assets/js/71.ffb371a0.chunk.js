(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{496:function(n,e,A){"use strict";A.r(e),e.default='import { OrbitControl } from "@oasis-engine/controls";\nimport * as dat from "dat.gui";\nimport {\n  AssetType,\n  Camera,\n  EnvironmentMapLight,\n  MeshRenderer,\n  PBRMaterial,\n  PrimitiveMesh,\n  SkyBox,\n  SystemInfo,\n  TextureCubeMap,\n  Vector3,\n  WebGLEngine\n} from "oasis-engine";\n\n/**\n * use PBR material\n */\nfunction usePBR(rows = 5, cols = 5, radius = 1, gap = 1) {\n  const deltaGap = radius * 2 + gap;\n  const minX = (-deltaGap * (cols - 1)) / 2;\n  const maxY = (deltaGap * (rows - 1)) / 2;\n  const deltaMetal = 1 / (cols - 1);\n  const deltaRoughness = 1 / (rows - 1);\n\n  // create model mesh\n  const mesh = PrimitiveMesh.createSphere(engine, radius, 64);\n\n  // create renderer\n  for (let i = 0, count = rows * cols; i < count; i++) {\n    const entity = rootEntity.createChild();\n    const renderer = entity.addComponent(MeshRenderer);\n    const material = new PBRMaterial(engine);\n    const currentRow = Math.floor(i / cols);\n    const currentCol = i % cols;\n\n    renderer.mesh = mesh;\n    renderer.setMaterial(material);\n    entity.transform.setPosition(minX + currentCol * deltaGap, maxY - currentRow * deltaGap, 0);\n\n    // pbr metallic\n    material.metallicFactor = 1 - deltaMetal * currentRow;\n\n    // pbr roughness\n    material.roughnessFactor = deltaRoughness * currentCol;\n\n    // base color\n    if (currentRow === 0) {\n      material.baseColor.setValue(186 / 255, 110 / 255, 64 / 255, 1.0);\n    } else if (currentRow === rows - 1) {\n      material.baseColor.setValue(0, 0, 0, 1);\n    }\n  }\n}\n\nconst gui = new dat.GUI();\nconst guiDebug = {\n  env: "forrest",\n  introX: "\u4ece\u5de6\u5230\u53f3\u7c97\u7cd9\u5ea6\u9012\u589e",\n  introY: "\u4ece\u4e0a\u5230\u4e0b\u91d1\u5c5e\u5ea6\u9012\u51cf"\n};\ngui.add(guiDebug, "introX");\ngui.add(guiDebug, "introY");\n\n// create engine object\nconst engine = new WebGLEngine("o3-demo");\nengine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;\nengine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;\n\nconst scene = engine.sceneManager.activeScene;\nconst rootEntity = scene.createRootEntity();\n\n// create camera\nconst cameraEntity = rootEntity.createChild("camera_entity");\ncameraEntity.transform.position = new Vector3(0, 0, 20);\ncameraEntity.addComponent(Camera);\nconst control = cameraEntity.addComponent(OrbitControl);\ncontrol.maxDistance = 20;\ncontrol.minDistance = 2;\n\n// create skybox\nconst skybox = rootEntity.addComponent(SkyBox);\n\n// create env light\nconst envLight = rootEntity.addComponent(EnvironmentMapLight);\n\n// load env texture\nengine.resourceManager\n  .load([\n    {\n      urls: [\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ"\n      ],\n      type: AssetType.TextureCube\n    },\n    {\n      urls: [\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"\n      ],\n      type: AssetType.TextureCube\n    },\n    {\n      urls: [\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*4ebgQaWOLaIAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*i56eR6AbreUAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*3wYERKsel5oAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*YiG7Srwmb3QAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*VUUwQrAv47sAAAAAAAAAAAAAARQnAQ",\n        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Dn2qSoqzfwoAAAAAAAAAAAAAARQnAQ"\n      ],\n      type: AssetType.TextureCube\n    }\n  ])\n  .then((cubeMaps: TextureCubeMap[]) => {\n    envLight.diffuseTexture = cubeMaps[0];\n    envLight.specularTexture = cubeMaps[1];\n    skybox.skyBoxMap = cubeMaps[1];\n    gui.add(guiDebug, "env", ["forrest", "road"]).onChange((v) => {\n      switch (v) {\n        case "forrest":\n          envLight.specularTexture = cubeMaps[1];\n          skybox.skyBoxMap = cubeMaps[1];\n          break;\n        case "road":\n          envLight.specularTexture = cubeMaps[2];\n          skybox.skyBoxMap = cubeMaps[2];\n          break;\n      }\n    });\n  });\n\n// run engine\nengine.run();\n\n// show pbr materials\nusePBR();\n'}}]);