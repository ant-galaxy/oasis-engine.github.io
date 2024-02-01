---
order: 6
title: Lottie
type: 图形
group: 2D
label: Graphics/2D
---


[lottie](https://airbnb.io/lottie/) 是 Airbnb 于 2017 年前后发布的一款跨平台的动画解决方案，可应用于 iOS，Android，React Native 和 web，通过 Bodymovin 插件解析 [AE](https://www.adobe.com/products/aftereffects.html) 动画，并导出可在移动端和 web 端渲染动画的 json 文件。设计师通过 AE 来制作动画，再用 Bodymovin 导出相应的 json 文件给到前端，前端可以使用这个 json 文件直接生成 100% 还原的动画。

用户可以在 Galacean 中轻松完成 Lottie 资产的处理和组件添加。

## 编辑器使用

建议设计师在 AE 中导出 lottie 文件的时候，图片采用 base64 格式写入 lottie 的 json 文件中。

开发者拿到 `.json` 文件后，首先需要把 `.json` 文件上传到 Galacean Editor。通过资产面板的上传按钮选择 “lottie” 资产，选择本地一个 lottie json 文件，然后：

<img src="https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*UQ1LTI_mYv4AAAAAAAAAAAAADjCHAQ/original"   />

选择一个节点，添加 Lottie 组件，选择 resource 为上一步上传的资产，通过修改 speed 改变播放速度：

![lottie](https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*ehFMT7vBaCAAAAAAAAAAAAAADjCHAQ/original)

| 属性 | 功能说明 |
| :--- | :--- |
| `resource` | 选择 Lottie 资产 |
| `isLooping` | 是否循环播放，默认循环 |
| `speed` | 播放速度，`1` 为原速度播放，数值越大播放约快 |
| `priority` | 渲染优先级，值越小，渲染优先级越高，越优先被渲染 |

| 方法 |  描述 |
| :--- | :--- |
| `play` | 播放动画，传入动画片段名参数会播放特定的动画片段 |
| `pause` | 暂停动画 |

### 切片功能

编辑器提供了动画切片的功能，可以把设计师提供的整个片段切成多段，每个片段需要定义片段名、开始帧、结束帧三个字段。

<playground src="lottie-clips.ts"></playground>

<img src="https://mdn.alipayobjects.com/huamei_w6ifet/afts/img/A*skjbSZjSpYoAAAAAAAAAAAAADjCHAQ/original" style="zoom:100%;" />

该操作会在 Lottie 协议中添加 `lolitaAnimations` 字段实现动画的切片：

```json
"lolitaAnimations": [
  {
    "name": "clip1",
    "start": 0,
    "end": 30
  },
  {
    "name": "clip2",
    "start": 50,
    "end": 100
  },
]
```

## 脚本使用

### 安装包

<a href="https://www.npmjs.com/package/@galacean/engine-lottie" target="_blank">@galacean/engine-lottie</a> 是 Galacean Engine 的二方包，需要手动安装：

```bash
npm i @galacean/engine-lottie --save
```

### 基础使用

在进行 `Pro Code` 开发的时候，需要一个 `json` 文件和一个 `atlas` 文件来实现 `lottie` 动画，通常美术同学通过 `AE` 导出的给到开发的只有 `json` 文件，此时需要使用 [tools-atlas-lottie](https://www.npmjs.com/package/@galacean/tools-atlas-lottie) `CLI` 工具生成 `atlas` 文件。

```typescript
import { LottieAnimation } from "@galacean/engine-lottie";

// Load lottie json、atlas file with engine's `resourceManager`
engine.resourceManager.load({
  urls: [
    "https://gw.alipayobjects.com/os/bmw-prod/b46be138-e48b-4957-8071-7229661aba53.json",
    "https://gw.alipayobjects.com/os/bmw-prod/6447fc36-db32-4834-9579-24fe33534f55.atlas"
  ],
  type: 'lottie'
}).then((lottieEntity) => {
  // Add lottie entity created to scene 
  root.addChild(lottieEntity);

  // Get `LottieAnimation` component and play the animation
  const lottie = lottieEntity.getComponent(LottieAnimation);
  lottie.isLooping = true;
  lottie.speed = 1;
  lottie.play();
});
```

<playground src="lottie.ts"></playground>

### 监听播放结束

很多时候我们有监听 Lottie 动画播放结束的需求，比如在动画结束的时候运行一些业务逻辑。`LottieAnimation` 的 `play` 方法会返回一个 `Promise`，所以可以很方便地监听动画结束的时机：

```typescript
  const lottie = lottieEntity.getComponent(LottieAnimation);
  await lottie.play();
  // do something next..
```

### 3D 变换

业务场景中经常会出现 3D 变换的需求，比如一些弹窗的入场动画。以旋转为例，由于传统的 lottie-web 方案只能沿着 **Z轴** 旋转（也就是说垂直于屏幕法线方向旋转），即使我们在 AE 中实现了沿着 **X轴** 或 **Y轴** 的旋转效果，使用 lottie-web  播放时也会被忽略。

<img src="https://gw.alipayobjects.com/mdn/rms_d27172/afts/img/A*qVYxTaEdVBgAAAAAAAAAAAAAARQnAQ" alt="3D rotation" style="zoom:50%;" />

得益于 Galacean Engine 2D/3D 引擎统一架构的优势，轻松地实现 3D 变换功能。

<playground src="lottie-3d-rotation.ts"></playground>

## 性能方面的建议

- 动画简单化。创建动画时需时刻记着保持 json 文件的精简，比如尽量不使用占用空间最多的路径关键帧动画。诸如自动跟踪描绘、颤动之类的技术会使得 json 文件变得非常大且耗性能。
- 如果有循环的帧，请不要在动画文件里面循环，请数出帧数，让开发自行控制这段动画的循环，能节省相同图层和动画的体积。
- 建立形状图层。将 AI、EPS、SVG 和 PDF 等资源转换成形状图层否则无法在 lottie 中正常使用，转换好后注意删除该资源以防被导出到 json 文件。
- 设置尺寸。在 AE 中可设置合成尺寸为任意大小，但需确保导出时合成尺寸和资源尺寸大小保持一致。
- 在尽量满足效果的情况下，请对路径做适当的裁剪，这个对性能影响很大。
- lottie 进行动画的时候会按照 AE 的设计进行分层，所以要尽量减少层数。
- 若确实没有必要使用路径动画，请将矢量图形替换为 png 图片，并用 transform 属性完成动画。
- 可以根据实际状况，斟酌降低动画帧率或者减少关键帧数量，这会减少每秒绘制的次数。
- 精简动画时长，可以循环的动作，就不要在时间轴做两遍，每一次读取关键帧都会消耗性能。编排上尽量避免 a 动作结束，b 动作开始，可以让动作有所重叠，减少动画长度。
- 同类项合并，有些元素是相似的，或者相同的用在了不同的地方，那就把这个元素预合成重复使用这一个元件，可以通过对该预合成的动画属性的调整达到想要的动画效果。
- 尽量减少图层个数。每个图层都会导出成相应的 json 数据，图层减少能从很大程度上减小 json 大小。
- 尽可能所有的图层都是在 AE 里面画出来的，而不是从其他软件引入的。如果是其他软件引入的，很可能导致描述这个图形的 json 部分变得很大。
- 制作的时候，请将动画元素**铺满**整个画布，这样可以避免浪费，也方便前端进行尺寸的调整。
- 如果矢量图形是在 AI 中导出的，请将多余的“组”等没有任何实际效用的元素删掉。
- 删除那些关闭了和无用的属性。
- 只导出 1x 图。
- 为了防止 lottie 导出的兼容性问题，请尽量使用英文版本 AE ，图层需简洁，命名清晰
- 避免大面积矢量部分，以及大面积粒子效果

## 如何从 AE 导出 Lottie 动画

### 什么是 Bodymovin

- Bodymovin 是一个 AE 的插件，它可以把动画直接输出成代码，直接给程序员使用放在各个终端上使用。
- 你可以在 github 上找到最新版本的 bodymovin 使用。
- Bodymovin的版本等于输出的json文件版本。


### 怎样使用 Bodymovin

- 到 Bodymovin 的 GitHub 首页（链接：airbnb/lottie-web）克隆项目到本地，或者下载 .zip 包。   
  ![image.png](https://gw.alipayobjects.com/zos/OasisHub/429a17b1-19b3-41b8-902c-4992d722832f/1597673434824-27e06992-4a7d-486a-8514-62a470c53789.png)
  
- 在项目目录的“/build/extension”目录下找到“bodymovin.zxp”文件，这个就是插件包了。
- 下载安装ZXP Installer。
ZXP插件安装器地址: [https://aescripts.com/learn/zxp-installer](https://aescripts.com/learn/zxp-installer) <br />

![image.png](https://gw.alipayobjects.com/zos/OasisHub/1e996008-498c-4845-953b-8d39f05503e0/1597674042809-af5a084f-f21b-4bf4-b0d4-7404466b2a1e.png)

- 打开AE，点击“编辑”>“首选项”>“常规”菜单项，选中“允许脚本写入文件和访问网络”，点击确定。  
      

![image.png](https://gw.alipayobjects.com/zos/OasisHub/22b31fcd-2b6e-4691-abd1-b173ccab87e7/1597674058269-f2242296-32c5-4ae9-973b-2943e04e94bc.png)
- 点击“窗口”>“扩展”>“Bodymovin”菜单项，就可以打开Bodymovin的界面使用插件了。

![image.png](https://gw.alipayobjects.com/zos/OasisHub/cb002ffc-4b59-4dbd-a85d-56e0c1809475/1597674100420-41e2440c-fe9a-4280-8000-4f384ccdf9c3.png)

- 打开Bodymovin插件窗口，可以发现该项目的名称出现在了下面的列表中。选中该名称，设置好 json 文件输出位置，点击 “Render”。

<img src="https://gw.alipayobjects.com/zos/OasisHub/605a89c4-4cde-4e36-a3cf-4d47abbd2f92/1597675512496-6c7320a9-fb09-460b-a2b0-e1a133020d9e.png" alt="image.png" style="zoom:50%;" />

- 点击上图中的 Settings，可以对导出的 json 进行配置：

<img src="https://gw.alipayobjects.com/zos/OasisHub/8e63e349-dad4-4fc9-a535-121aa92450b4/1597675671244-f967fb47-da02-4033-9c37-277e2056af40.png" alt="image.png" style="zoom:50%;" />
      
