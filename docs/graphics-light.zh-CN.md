---
order: 2
title: 光照
type: 图形
label: Graphics
---

光照使场景更有层次感，使用光照，能建立更真实的三维场景。Galacean Engine 支持以下几种光源：

| 类型 | 解释 |
| :-- | :-- |
| [DirectLight](${api}core/DirectLight) | **方向光**，光线相互平行，几何属性只有方向 |
| [PointLight](${api}core/PointLight) | **点光源**，一个点向周围所有方向发出的光，光照强度随光源距离衰减 |
| [SpotLight](${api}core/SpotLight) | **聚光灯**，由一个特定位置发出，向特定方向延伸的光，光照强度随光源距离衰减，光照区域为锥形，锥形边缘随张开角度衰减 |
| [AmbientLight](${api}core/AmbientLight) | **环境光**，默认从各个角度照射物体，其强度都是一致的，如果开启了漫反射纹理模式，则采样纹理作为环境颜色；如果设置了镜面反射纹理，则开启 IBL，用来实现全局光照 |

## 方向光

**方向光**表示的是光线从以某个方向均匀射出，光线之间是平行的，太阳照射在地球表面的光可以认为是方向光，因为太阳和地球距离的远大于地球半径，所以照射在地球的阳光可以看作是来自同一个方向的一组平行光，即方向光。

<img src="https://gw.alipayobjects.com/zos/OasisHub/93d8b5ba-6c3d-498d-a343-ec976ba39978/image-20231009113534494.png" alt="image-20231009113534494" style="zoom:50%;" />

方向光有 3 个主要个特性：_颜色_（[color](${api}core/DirectLight#color)）、_强度_（[intensity](${api}core/DirectLight#intensity)）、_方向_（[direction](${api}core/DirectLight#direction)）。_方向_ 则由方向光所在的节点的朝向表示。

| 属性      | 作用                             |
| :-------- | :------------------------------- |
| Intensity | 控制平行光的强度，**值越高越亮** |
| Color     | 控制平行光的颜色，默认白色       |

### 编辑器使用

<img src="https://gw.alipayobjects.com/zos/OasisHub/b554d6f8-c9a4-48a9-9dd3-475dbf63ae55/image-20231009113622354.png" alt="image-20231009113622354" style="zoom:50%;" />

### 脚本使用
```typescript
const lightEntity = rootEntity.createChild("light");
const directLight = lightEntity.addComponent(DirectLight);

directLight.color.set(0.3, 0.3, 1, 1);

// 调整方向
lightEntity.transform.setRotation(-45, -45, 0);
```

## 点光源

**点光源**存在于空间中的一点，由该点向四面八方发射光线，比如生活中的灯泡就是点光源。

<img src="https://gw.alipayobjects.com/zos/OasisHub/f0d42119-4ebf-4214-a9c1-154e6c00be65/image-20231009113806918.png" alt="image-20231009113806918" style="zoom:50%;" />

点光源有 3 个主要特性：_颜色_（[color](${api}core/PointLight#color)）、_强度_（[intensity](${api}core/PointLight#intensity)）、_有效距离_（[distance](${api}core/PointLight#distance)））。超过有效距离的地方将无法接受到点光源的光线，并且离光源越远光照强度也会逐渐降低。

| 属性      | 作用                             |
| :-------- | :------------------------------- |
| Intensity | 控制点光源的强度，**值越高越亮** |
| Color     | 控制点光源的颜色，默认白色       |
| Distance  | 有效距离，光照强度随距离衰减     |


### 编辑器使用

<img src="https://gw.alipayobjects.com/zos/OasisHub/5d8e7211-aff1-4911-85ac-844915976ef0/image-20231009113830843.png" alt="image-20231009113830843" style="zoom:50%;" />


### 脚本使用
```typescript
const lightEntity = rootEntity.createChild("light");

const pointLight = lightEntity.addComponent(PointLight);
pointLight.distance = 100;
pointLight.color.set(0.3, 0.3, 1, 1);
lightEntity.transform.setPosition(-10, 10, 10);
```

## 聚光灯

**聚光灯**和点光源有点像，但是它的光线不是朝四面八方发射，而是朝某个方向范围，就像现实生活中的手电筒发出的光。

<img src="https://gw.alipayobjects.com/zos/OasisHub/1695c247-a6f1-43c5-8cfe-cb89c507cf31/image-20231009114221422.png" alt="image-20231009114221422" style="zoom:50%;" />

聚光灯有几个主要特性：_颜色_（[color](${api}core/SpotLight#color)）、_强度_（[intensity](${api}core/SpotLight#intensity)）、_有效距离_（[distance](${api}core/SpotLight#distance)）、_散射角度_（[angle](${api}core/SpotLight#angle)）、_半影衰减角度_（[penumbra](${api}core/SpotLight#penumbra)）。散射角度表示与光源朝向夹角小于多少时有光线，半影衰减角度表示在有效的夹角范围内，随着夹角增大光照强度逐渐衰减至 0 。

| 属性                   | 作用                                                     |
| :--------------------- | :------------------------------------------------------- |
| Angle(散射角度)        | 表示与光源朝向夹角小于多少时有光线                       |
| Intensity(强度)        | 控制聚光灯的强度，**值越高越亮**                         |
| Color(颜色)            | 控制聚光灯的颜色                                         |
| Distance(距离)         | 有效距离，光照强度随距离衰减                             |
| Penumbra(半影衰减角度) | 表示在有效的夹角范围内，随着夹角增大光照强度逐渐衰减至 0 |

### 编辑器使用

<img src="https://gw.alipayobjects.com/zos/OasisHub/d3ff9ed7-ccba-4112-ba73-568b6b203549/image-20231009114257367.png" alt="image-20231009114257367" style="zoom:50%;" />

### 脚本使用

```typescript
const lightEntity = rootEntity.createChild("light");

const spotLight = lightEntity.addComponent(SpotLight);

spotLight.angle = Math.PI / 6; // 散射角度
spotLight.penumbra = Math.PI / 12; // 半影衰减角度
spotLight.color.set(0.3, 0.3, 1, 1);

lightEntity.transform.setPosition(-10, 10, 10);
lightEntity.transform.setRotation(-45, -45, 0);
```

<playground src="light-type.ts"></playground>

## 环境光

![image-20230914142423022](https://gw.alipayobjects.com/zos/OasisHub/ce57cb4c-2285-4c36-b5a2-d89b70280282/image-20230914142423022.png)

除了直接光源，[IBL 技术](https://learnopengl-cn.github.io/07%20PBR/03%20IBL/01%20Diffuse%20irradiance/)将 周围环境视为一个大光源，保存在立方体纹理中，在渲染时，将立方体纹理的每个像素都视为光源，这种方式可以有效地捕捉环境的全局光照和氛围，使物体更好地融入其环境。因为实时卷积计算 IBL 非常耗时，所以编辑器会提前烘焙周围环境到一张[预滤波环境贴图](https://learnopengl-cn.github.io/07%20PBR/03%20IBL/02%20Specular%20IBL/)中，即每个 mipmap 级别存储不同粗糙度的预卷积结果。

环境光已经内置在了[场景](${api}core/Scene)中，主要使用了 IBL 技术，IBL 技术将周围环境视为一个大光源，保存在立方体纹理中，在渲染时，将立方体纹理的每个像素都视为光源，这种方式可以有效地捕捉环境的全局光照和氛围，使物体更好地融入其环境。

### 编辑器使用

Galacean 支持通过 [编辑器](https://galacean.antgroup.com/editor) 进行离线烘焙得到 IBL 烘焙产物 `*.env` 文件。在编辑器中点击场景，配置如下：

修改背景或者烘焙分辨率后，点击“烘焙场景”按钮可重新进行烘焙。

#### 环境漫反射

<img src="https://gw.alipayobjects.com/zos/OasisHub/7b2f79cc-7886-43da-b1cb-32bb7373dcb0/image-20231009114400810.png" alt="image-20231009114400810" style="zoom:50%;" />

| 属性 | 作用 |
| :-- | :-- |
| Mode | 支持 `Sky`和 `Solid Color` 两种模式，默认 `Sky` 模式，表示使用根据场景烘焙的球谐参数; `Solid Color` 模式时使用纯色作为漫反射颜色 |
| Intensity | 漫反射强度 |

#### 环境镜面反射

<img src="https://gw.alipayobjects.com/zos/OasisHub/635ba520-5b7c-4156-a617-445045ddf92d/image-20231009114427072.png" alt="image-20231009114427072" style="zoom:50%;" />

| 属性 | 作用 |
| :-- | :-- |
| Mode | 支持 `Sky`和 `Custom` 两种模式，默认 `Sky` 模式，表示使用根据场景烘焙的预滤波环境贴图; `Custom` 模式时可以单独上传一张 HDR 贴图作为环境反射 |
| Intensity | 镜面反射强度 |
| Baker Resolution | 表示烘焙后的立方体纹理分辨率，默认 128 分辨率，烘焙产物约为 500KB，64 分辨率的烘焙产物约为 125KB，可以根据场景选择合适的烘焙分辨率。 |

#### 背景

<img src="https://gw.alipayobjects.com/zos/OasisHub/1604407b-f6e0-442a-b179-aef4836877cf/image-20231009114455268.png" alt="image-20231009114455268" style="zoom:50%;" />

| 属性 | 作用 |
| :-- | :-- |
| Mode | 支持 `Sky`、`Solid Color`、`Texture` 三种模式。默认 `Sky` 模式，配大气散射作为背景； `Solid Color` 模式支持设置纯色作为背景；`Texture` 模式支持设置纹理作为背景 |
| Color | `Solid Color` 模式时，可以设置颜色 |
| Texture | `Texture` 模式时，可以设置纹理 |
| Material | `Sky` 模式时，可以绑定材质球，一般选择天空盒或者大气散射 </br> <img src="https://gw.alipayobjects.com/zos/OasisHub/5e0474d7-136d-4a8a-a2a7-8f5ee83cb5c5/image-20231007172742202.png" alt="image-20231007172742202" style="zoom:50%;" /> |
| Mesh | `Sky` 模式时，可以绑定 Mesh。大气散射搭配球，天空盒搭配立方体 |

#### 阴影

平行光组件下面可以打开阴影功能，可以前往 [阴影教程](${docs}graphics-shadow) 了解更多细节。

<img src="https://gw.alipayobjects.com/zos/OasisHub/98e9ce45-5de5-4161-964b-0b9b099b7662/image-20231009114604582.png" alt="image-20231009114604582" style="zoom:50%;" />


### 脚本使用

我们在 [glTF Viewer](https://galacean.antgroup.com/#/gltf-viewer) 也提供了小工具，直接拖拽 HDR 贴图即可 ：

![gltf viewer](https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*9mGbSpQ4HngAAAAAAAAAAAAAARQnAQ)

拿到 `*.env` 后，我们可以通过 resourceManager 加载环境光：

```typescript
engine.resourceManager
  .load<AmbientLight>({
    type: AssetType.Env,
    url: "*.env"
  })
  .then((ambientLight) => {
    scene.ambientLight = ambientLight;

    // 如果希望添加天空盒，也可以方便地从 ambientLight 中拿到
    skyMaterial.texture = ambientLight.specularTexture;
    // 由于烘焙贴图的编码方式是 RGBM，因此需要进行相应的解码设置
    skyMaterial.textureDecodeRGBM = true;
  });
```

<playground src="ambient-light.ts"></playground>
