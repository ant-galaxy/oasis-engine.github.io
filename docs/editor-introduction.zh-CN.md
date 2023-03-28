---
order: 0
title: 快速上手
type: 介绍
label: Editor-Introduction
---

## 简介

[Oasis Editor](https://antg.antgroup.com/) 是一个基于移动优先的高性能开源互动引擎 [Oasis Engine](https://github.com/oasis-engine/engine) 的云端 Web 互动创作平台。它可以帮助你快速的创建、编辑和导出一个互动项目。你可以通过 Oasis Editor 快速上传互动资产，创建和编辑材质、调整灯光、创建实体，从而创造出复杂的场景。你可以实现自己的创意想法，将自己的创意变成一个互动的现实。总之，使用 Oasis Editor，你可以在开发过程中节省大量时间和精力，从而创造出更具创意性和交互性的互动作品。

## 认识编辑器

### 使用流程

在认识编辑器各模块之前，我们先了解一下使用编辑器创建互动项目的整体流程：

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*aa22QqPGmE8AAAAAAAAAAAAADsGIAQ/original)

我这里以一个最简单的 3D 场景为例，带你认识一下整个编辑器的使用方法。

### 首页

在你登录之后，首先看到的是编辑器的首页，在这个页面中会显示所有你创建的项目。使用右上角的按钮来创建项目，点击后可以选择要创建的项目类型，2D 或 3D。首先，我们来创建一个 3D 项目。

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*4iUvQ4XbQfMAAAAAAAAAAAAADsGIAQ/original)

### 编辑器

在项目创建后，会自动跳转到编辑器页面。

![SCR-20230223-klw.png](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*TYnpTreWDJ0AAAAAAAAAAAAADsGIAQ/original)

编辑器由这几部分组成：

**[层级面板](${docs}editor-hierarchy-cn)** 在这里会显示整个场景中的所有节点  
**[资产面板](${docs}editor-assets-cn)** 在这个面板中会显示当前项目所包含的所有资产，比如 HDR 贴图，各种纹理文件，脚本，字体文件等等  
**[主编辑区](${docs}editor-viewport-cn)** 是编辑器的主要操作区域，可以通过鼠标和键盘来编辑场景  
**[检查器面板](${docs}editor-inspector-cn)** 会根据你当前选择显示不同的可编辑选项

对于各个面板详细的介绍可以点击上方链接查看。接下来，我们来看看具体如何实现一个「旋转的立方体」项目。

### 创建立方体

首先，我们在 **层级面板** 中创建一个新的实体（[什么是实体？](https://oasisengine.cn/#/docs/latest/cn/entity)）。

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*9R-fQrDkqz0AAAAAAAAAAAAADsGIAQ/original)

我们用鼠标左键选中这个实体节点，此时检查器面板会显示出当前实体的一些可配置属性。因为我们的实体现在没有绑定任何组件（[什么是组件？](https://oasisengine.cn/#/docs/latest/cn/entity)），所以我们暂时只能调整实体的坐标信息这类的基础属性。

接下来，我们点击检查器面板中的 **Add Component** 按钮唤起组件选单，然后选择添加 **Mesh Renderer** 组件（什么是 [Mesh Renderer?](https://oasisengine.cn/#/docs/latest/cn/mesh-renderer)）。

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*rzeGTYjbAKYAAAAAAAAAAAAADsGIAQ/original)

这样，我们就给当前的实体新增了一个 Mesh Renderer 组件。但我们在主编辑区还看不到这个物体。需要为该组件添加 Mesh 和 Material 才行。我们为组件添加一个 Cuboid Mesh，但添加 Mesh 后我们只能看到模型的框体，因为我们还没有给它配置 “皮肤”。

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*mxSZT7XMbHgAAAAAAAAAAAAADsGIAQ/original)

所以接下来，我们来创建一个材质。

### 创建材质

我们首先在 **资产管理面板** 中依次选择 右键 → Create → Material 让编辑器会创建出一个默认材质。我们选中这个材质，此时检查器面板会显示当前材质的配置选项。默认的材质比较简单，我们可以为这个材质增加一些纹理贴图，如基础纹理、粗糙度纹理、法线贴图。

首先，我们来上传这些纹理。我们可以把这些纹理文件直接拖动到 **资产管理面板，** 既可批量上传这些文件。

上传后，我们可以在面板中看到这些文件。

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*hTxsT74Y47kAAAAAAAAAAAAADsGIAQ/original)

接下来，我们把这些贴图配置到刚刚创建的材质上：

然后，我们再次选择上一步创建的实体节点，为 Mesh Renderer 组件增加 Material 属性，选择我们刚刚做好的材质球。

这样，我们就能在场景中看到这个立方体了！

![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*L-a0ToEN5N4AAAAAAAAAAAAADsGIAQ/original)

现在看上去有点暗，需要把 [灯光](https://oasisengine.cn/#/docs/latest/cn/light) 调亮一点。我们在节点树中选择 DirectLight 节点，然后在检查器中调高 Intensity（光强度）属性。

现在看上去就比较正常了。
![Untitled](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*b2nKRan70_QAAAAAAAAAAAAADsGIAQ/original)

## 添加脚本

接下来，我们为这个节点再绑定一个 Script 组件（[什么是 Script 组件?](https://oasisengine.cn/#/docs/latest/cn/script)）。

1. 我们继续使用上述方式在检查器面板中添加 Script 组件
2. 接下来，我们在资产面板中 右键 → Create → Script  创建一个 Script 资产
3. 最后，在检查器面板中将刚创建的脚本文件绑定到脚本组件上

> ⚠️ 注意，如果你没有把脚本资产绑定到实体的脚本组件上，则脚本不会运行

创建了 Script 后，我们可以 **双击它** 来跳转到代码编辑器页面。

![Untitled](https://mdn.alipayobjects.com/huamei_fvsq9p/afts/img/A*EbiqQoEA-_oAAAAAAAAAAAAADqiTAQ/original)


进入代码编辑器后，我们写一个非常简单的旋转功能：

```ts
// Script.ts
import { Script } from 'oasis-engine';

export default class extends Script {
  onUpdate(deltaTime: number) {
    this.entity.transform.rotate(1,1,1);
  }
}
```

在写好代码后，保存(⌘+s), 右侧预览区就可以实时的看到整个场景的效果：

![preview](https://mdn.alipayobjects.com/huamei_x9dkln/afts/img/A*9lhLRY7D2g8AAAAAAAAAAAAADsGIAQ/original)

## 导出项目

现在，我们已经完成了在编辑器中的基础开发工作，接下来我们来导出这个项目到本地。

我们点击界面右上角的 **Export** 按钮，会唤起导出界面，我们这里把项目名改为 “box”，然后点击 **Download** 按钮，编辑器就会把项目打包为一个 `box.zip` 文件下载。

## 运行项目

项目打包完成后，我们使用 VsCode 打开 box 项目，运行 `npm install` , `npm run dev` ，可以看到项目已经能够正常运行了。