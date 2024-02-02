---
order: 3
title: 碰撞器组件 
type: 物理
label: Physics
---

引入物理引擎的最大好处是使得场景中的物体拥有了物理响应。碰撞器在引擎中属于组件。在使用前，我们需要先了解下碰撞器的类型：

1. [StaticCollider](${api}core/StaticCollider)：静态碰撞器，主要用于场景中静止的物体；
2. [DynamicCollider](${api}core/DynamicCollider)：动态碰撞器，用于场景中需要受到脚本控制，或者响应物理反馈的物体。

## 编辑器使用

### 添加碰撞器组件

首先需要考虑的是，碰撞器是静态的还是动态的，然后添加对应的碰撞器组件，静态碰撞器 StaticCollider 或者 动态 DynamicCollider

![buildBox](https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*ha7AS4lbXvsAAAAAAAAAAAAADsqFAQ/original)

### 选择碰撞器的外形

事实上，每一种 `Collider` 都是 [ColliderShape](${api}core/ColliderShape) 的集合，即每一种 `Collider` 都可以通过组合 `ColliderShape` 设置复合的碰撞器外形。

目前支持了四种 `ColliderShape`，但不同的后端物理包支持程度不同，具体如下：

| 名称 | 解释       | 支持的后端物理包                    |
| :--- |:---------|:----------------------------|
| [BoxColliderShape](${api}core/BoxColliderShape) | 盒形碰撞外形   | physics-lite， physics-physx |
| [SphereColliderShape](${api}core/SphereColliderShape) | 球形碰撞外形   | physics-lite， physics-physx |
| [PlaneColliderShape](${api}core/PlaneColliderShape) | 无界平面碰撞外形 | physics-physx               |
| [CapsuleColliderShape](${api}core/CapsuleColliderShape) | 胶囊碰撞外形   | physics-physx               |

引擎支持复合的碰撞器外形，也就是说，碰撞器本身可以由 BoxColliderShape，SphereColliderShape，CapsuleColliderShape 复合而成。

这里特别强调的是 `Collider` 与 `ColliderShape` 的位置关系。每一个 `Collider` 的姿态和其挂载的 `Entity` 是一致的，每一帧两者都会进行同步。而 `ColliderShape` 上则可以通过 `position` 属性设置 **相对于** `Collider` 的偏移。

![table](https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*erlGRKk7dNMAAAAAAAAAAAAADsqFAQ/original)

在加入碰撞器组件后，不会默认添加碰撞器外形，因此需要点击 Add Item 进行添加，添加后会在视口中看到碰撞器的辅助渲染出现。

![buildBox2](https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*2iyJQYNc7ZQAAAAAAAAAAAAADsqFAQ/original)

对于每一个碰撞器外形，都可以设计对应的一些大小属性。例如

<img src="https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*miQpS5GQ6x8AAAAAAAAAAAAADsqFAQ/original" alt="buildBox2" style="zoom:50%;" />

但无论那个碰撞器外形，都可以设置 Local Position，即相对于 Entity 坐标的局部偏移

![buildBox2](https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*_vceQ529MJIAAAAAAAAAAAAADsqFAQ/original)

### 动态碰撞器设置
和静态碰撞器不同，动态碰撞器会受到物理规律的作用，因此有许多附加的物理属性进行设置

<img src="https://mdn.alipayobjects.com/huamei_vvspai/afts/img/A*bUd8RIXCuXgAAAAAAAAAAAAADsqFAQ/original" alt="buildBox2" style="zoom:50%;" />

在修改这些参数后，视口不会发生变化，因为动态碰撞器默认会受到重力的作用，因此需要在 Play 模式下才能进行观察。

### 注意
- 确定的碰撞区域应尽量简单，以提高物理引擎检测的性能
- 碰撞器的参照坐标系为从属 Entity 的坐标系
- PlaneColliderShape 表示全平面，因此没有辅助线的显示，一般作为地板使用

## 脚本使用

物理响应分为两种类型：

1. 触发器模式：物体不具备刚体外形，但发生接触时可以触发特定的脚本函数。
2. 碰撞器模式：物理具有刚体外形，发生接触时不仅可以触发脚本函数，还可以根据物理规律改变原先的运动。

针对这两种类型，脚本中都提供了对应的函数，并且碰撞器组件也提供了一系列设置自身状态的函数，例如速度，质量等等。

### 触发器脚本函数

对于触发器模式，首先需要给场景中的 `Entity` 添加 `Collider`；该当这些组件相互接触时，会自动触发脚本组件当中的三个函数：

1. [onTriggerEnter](${docs}script#组件生命周期函数#ontriggerenter)：相互接触时调用
2. [onTriggerStay](${docs}script#组件生命周期函数#ontriggerstay)：接触过程中*循环*调用
3. [onTriggerExit](${docs}script#组件生命周期函数#ontriggerexit)：接触结束时调用

可以通过 `ColliderShape` 上的 `isTrigger` 开启触发器模式，但需要特别强调的是，**两个 StaticCollider 之间不会调用触发器事件**，除非其中一个是 `DynamicCollider`。

<playground src="physx-collision-detection.ts"></playground>

### 碰撞器脚本函数

对于碰撞器模式，`DynamicCollider` 相互作用时会触发三个碰撞相关的脚本函数：
1. [onCollisionEnter](${docs}script#组件生命周期函数#oncollisionenter)：碰撞触发时调用
2. [onCollisionStay](${docs}script#组件生命周期函数#oncollisionstay)：碰撞过程中*循环*调用
3. [onCollisionExit](${docs}script#组件生命周期函数#oncollisionexit)：碰撞结束时调用

<playground src="physx-compound.ts"></playground>