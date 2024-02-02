---
order: 1
title: 主菜单
type: 基础知识
group: 界面
label: Basics/Interface
---

项目管理包括新建项目、克隆项目、项目设置等操作。

<img src="https://gw.alipayobjects.com/zos/OasisHub/7bbd7d4c-ca69-49b6-a296-b0fc006e1c28/image-20230925162556276.png" alt="image-20230925162556276" style="zoom:50%;" />

### 新建项目和克隆项目

选择`New Project`项，可以进一步选择新建不同类型的项目。点击`Fork`，会跳转到新克隆的项目页面，旧的项目仍会保留。

<img src="https://gw.alipayobjects.com/zos/OasisHub/ff52d1d2-f8b0-4285-b845-d1661baf866b/image-20230925162814875.png" alt="image-20230925162814875" style="zoom:50%;" />

### 项目设置

点击`Project Settings`项，会出现项目设置弹窗，包含项目重命名、引擎版本管理、快照管理等操作。

<img src="https://gw.alipayobjects.com/zos/OasisHub/318a60f6-8c6c-4aa8-88e5-b96d9344bcc3/image-20230925172423563.png" alt="image-20230925172423563" style="zoom:50%;" />

#### 基础设置

`Basic` 中包含项目的基础信息设置：

- `Engine Version`：引擎版本升级，以便快速修复某个 bug 或享受新的功能（注意：引擎版本升级操作是不可逆的。为避免损坏项目，升级引擎过程中会自动克隆一个项目）。
- `Physics Backend`：物理引擎后端，可以选择 `Physics Lite` 或 `PhysX` 两种后端。前者是一个轻量级的物理引擎，后者是基于 [PhysX](https://developer.nvidia.com/physx-sdk) 的高级物理引擎。
- `Model Import Options`：模型导入选项，包含计算切线、移除灯光的选项。

#### 快照管理

`Snapshorts` 快照管理功能允许用户保存某个项目的快照到历史记录中，万一项目出现数据丢失等问题，可以通过 `Revet` 快速恢复到之前保存的某个快照。用户可以在菜单中选择 `Add Snapshot` 。点击快照名可以编辑快照名称，以方便下次快速找到。

<img src="https://gw.alipayobjects.com/zos/OasisHub/51d93899-44a7-40ef-a5ba-5550b89fcf49/image-20230925164014187.png" alt="image-20230925164014187" style="zoom:50%;" />