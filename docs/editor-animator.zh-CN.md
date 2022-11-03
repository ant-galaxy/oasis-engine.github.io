---
order: 3.4
title: 动画编辑
type: 编辑器
group: 组件
label: 编辑器/组件
---

通过 Animator 编辑器，你可以在上面方便的为动画添加过渡和混合：

## 基础使用

1. 将带动画的模型上传到编辑器上，编辑器会自动加载其上的动画片段到资源面板中

![image-20210902230821166](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457123966-0e930468-2054-4ff2-b6b0-e023f0cc748d.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)


2. 当我们把模型拖入到场景中，模型以初始姿态展示出来，但是并不会播放任何动画，我们需要在模型实体上添加Animator组件，来控制动画的播放。
![image-20210902230821166](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457441830-207e0940-4a82-4bc2-8d9c-d12d44c3eb31.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)
   
3. Animator组件需要引入一个AnimatorController资产，我们创建并引入
![image](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457702054-45c9d61a-1e9b-49b5-a719-36724471aaa2.png)
![image](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457755170-565aaa77-ec4b-462a-9a38-dc7ad66e9c19.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

4. 刚创建的AnimatorController中没有任何数据，我们需要对他进行编辑， 双击资产, 并为它添加一个AnimatorState：
![image](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457913962-d7859d4d-4879-44de-9e09-7dee51371a68.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

5. 点击AnimatorState为它绑定一个AnimationClip：
![image](https://cdn.nlark.com/yuque/0/2022/png/377058/1667457999371-e0ed9c57-d44c-4f2a-abda-12eba6e3a934.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

6. 至此你在导出的项目中就可以通过 `animator.play('New State')` 播放 `running` 动画了。如果你没有为实体添加Animator组件的话OasisEngine会为你默认创建一个并且AnimatorController中默认添加了模型的所有动画，拿上图的模型具体，你只需要直接调用 `animator.play('running')` 就可以了。以上内容是可以帮助你更清晰的了解Animator的运行机制，当然除此以外你可以通过AnimatorController的编辑器实现更多的功能。




### 参数说明
| 属性 | 功能说明 |
| :--- | :--- |
| `animatorController` | 绑定 `AnimatorController` 资产 |

## 默认播放
将AnimatorState连接到`entry`上你导出的项目运行时就会自动播放其上的动画，而不需再调用 `animator.play`。同时你也会看到编辑器的模型也开始播放动画了。
![image](https://cdn.nlark.com/yuque/0/2022/png/377058/1667458538130-56a01f2c-1602-4709-a29f-2b3eee903105.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)


## 动画过渡
将两个想要过渡的 `AnimatorState` 连接即可实现动画过渡的效果, 点击两个动画间的连线，可以修改动画过渡的参数调整效果：

![animationcrossfade](https://cdn.nlark.com/yuque/0/2022/gif/377058/1667458692286-29d9f543-9b98-4911-8fa7-ac38b61b1668.gif)

### 动画过渡参数说明
| 属性 | 功能说明 |
| :--- | :--- |
| `duration` | 过渡时长，时间为相对目标状态的归一化时间, 默认值为 1.0 |
| `offset` | 目标状态向前的偏移时间，时间为相对目标状态的归一化时间, 默认值为 0 |
| `exitTime` | 起始状态过渡开始时间，时间为相对起始状态的归一化时间, 默认值为 0.3 |

## 动画混合
双击 `AnimatorController` 资源文件编辑动画，添加Layer，将混合的动作也连接`entry`：

![animationadditive](https://cdn.nlark.com/yuque/0/2022/gif/377058/1667459461151-4568a32a-07db-427b-922e-3bc6f844097b.gif)

有的时候你想要得到一个固定的姿势，需要裁减设计师给到的动画切片，可以向上图一样修改 `动画状态` 的`开始时间` 及 `结束时间`，点击 `动画状态` 即可对其进行编辑:

![image-20210903000900986](https://cdn.nlark.com/yuque/0/2022/png/377058/1667459589837-ed583296-d2c6-43bc-a162-81bfc66cf4f3.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)


### 动画状态参数说明
| 属性 | 功能说明 |
| :--- | :--- |
| `Name` | 修改`动画状态`的名字，名字在所在的层要是**唯一**的。 |
| `AnimationClip` | 用于绑定 `动画片段` 资产，`动画片段` 存储了模型的动画数据。 |
| `WrapMode` | 动画状态是循环播放还是播放一次，默认为 `Once` 即播放一次。|
| `Speed` | 动画状态的播放速度，默认值为 1.0 ，值越大动画速度越快 |
| `StartTime` | `动画状态` 从 `动画片段` 的哪个时间开始播放，时间为相对 `动画片段` 时长的归一化时间。默认值为 0 ，即从头开始播放。 例如：值为 1.0 ，则是 `动画片段` 的最后一帧状态。 |
| `EndTime` | `动画状态` 播放到 `动画片段` 的哪个时间结束播放，时间为相对 `动画片段` 时长的归一化时间。默认值为 1.0 ，即播放到最后。 |

你也可以通过修改 `Layer` 的 `Weight` 参数来调整 `Layer` 在混合中的权重，通过修改 `Blending` 来修改混合模式。

![animationadditive2](https://cdn.nlark.com/yuque/0/2022/gif/377058/1667459778293-be31b02b-7f6c-4c27-becc-2c0c8e80b538.gif)

### Layer参数说明
| 属性 | 功能说明 |
| :--- | :--- |
| `Name` | 该层的名字，仅用于备忘。 |
| `Weight` | 该层的混合权重，默认值为 1.0 。 |
| `Blending` | 该层的混合模式，`Additive` 为叠加模式， `Override` 为覆盖模式，默认值为 `Override` |

Oasis 支持多层的混合，你可以增加更多的层以达到你想要的效果。

![animationadditive3](https://cdn.nlark.com/yuque/0/2022/gif/377058/1667459905978-f86e9051-7b62-44ad-aa43-87da0248a8f1.gif)
