(window.webpackJsonp=window.webpackJsonp||[]).push([[83],{512:function(r,n,e){"use strict";e.r(n),n.default='import { OrbitControl } from "@oasis-engine/controls";\r\nimport {\r\n  AssetType,\r\n  Camera,\r\n  Script,\r\n  Sprite,\r\n  SpriteRenderer,\r\n  SystemInfo,\r\n  Texture2D,\r\n  Vector3,\r\n  WebGLEngine\r\n} from "oasis-engine";\r\n\r\n// Create engine object\r\nconst engine = new WebGLEngine("o3-demo");\r\nengine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;\r\nengine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;\r\n\r\nconst scene = engine.sceneManager.activeScene;\r\nconst rootEntity = scene.createRootEntity();\r\n\r\n// Create camera\r\nconst cameraEntity = rootEntity.createChild("camera_entity");\r\ncameraEntity.transform.setPosition(0, 0, 50);\r\ncameraEntity.addComponent(Camera);\r\ncameraEntity.addComponent(OrbitControl);\r\n\r\n// Create sprite renderer\r\nengine.resourceManager\r\n  .load<Texture2D>({\r\n    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ApFPTZSqcMkAAAAAAAAAAAAAARQnAQ",\r\n    type: AssetType.Texture2D\r\n  })\r\n  .then((texture) => {\r\n    for (let i = 0; i < 10; ++i) {\r\n      setTimeout(() => {\r\n        const spriteEntity = rootEntity.createChild(`sprite_${i}`);\r\n        spriteEntity.transform.position = new Vector3(0, 0, 0);\r\n        const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);\r\n        const sprite = new Sprite(engine, texture);\r\n        spriteRenderer.sprite = sprite;\r\n        // spriteRenderer.flipX = true;\r\n        // spriteRenderer.flipY = true;\r\n        const rect = spriteRenderer.sprite.rect;\r\n        const scaleX = 100.0 / rect.width;\r\n        const scaleY = 100.0 / rect.height;\r\n        spriteEntity.transform.setScale(scaleX, scaleY, 1);\r\n        spriteEntity.addComponent(SpriteController);\r\n      }, 2000 * i);\r\n    }\r\n  });\r\n\r\nengine.run();\r\n\r\n// Script for sprite\r\nclass SpriteController extends Script {\r\n  static _curRotation: number = 0;\r\n\r\n  private _radius: number = 1.5;\r\n  private _curRadian: number;\r\n  private _scale: number;\r\n  private _scaleFlag: boolean;\r\n\r\n  onAwake() {\r\n    this._curRadian = 0;\r\n    this._radius = 15;\r\n    this._scale = 0.5;\r\n    this._scaleFlag = true;\r\n  }\r\n\r\n  onUpdate() {\r\n    // Update position.\r\n    this._curRadian += 0.005;\r\n    const { _radius, _curRadian, entity } = this;\r\n    const { transform } = entity;\r\n    const posX = Math.cos(_curRadian) * _radius;\r\n    const posY = Math.sin(_curRadian) * _radius;\r\n    transform.setPosition(posX, posY, 0);\r\n\r\n    // Update scale.\r\n    this._scale += this._scaleFlag ? 0.005 : -0.005;\r\n    const { _scale } = this;\r\n    transform.setScale(_scale, _scale, _scale);\r\n    if (this._scale >= 0.6) {\r\n      this._scaleFlag = false;\r\n    } else if (this._scale <= 0.4) {\r\n      this._scaleFlag = true;\r\n    }\r\n\r\n    // Update rotation.\r\n    SpriteController._curRotation += 0.05;\r\n    const { _curRotation } = SpriteController;\r\n    transform.setRotation(0, 0, _curRotation);\r\n  }\r\n}\r\n'}}]);