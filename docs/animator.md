---
order: 10
title: Animator
type: Component
---

The [Animator](${api}core/animation/Animator) can organize [AnimationClips](${api}core/animation/AnimationClip) through the state machine to achieve more flexible and rich animation effects.

<playground src="skeleton-animation.ts"></playground>

## Basic usage
After loading the GLTF model, the engine will automatically add an Animator component to the model's root entity , and add the animation clips in the model to it. You can get the Animator component directly on the root entity of the model and play the specified animation.

```typescript
engine.resourceManager
  .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/5e3c1e4e-496e-45f8-8e05-f89f2bd5e4a4.glb")
  .then((asset) => {
    const { defaultSceneRoot } = asset;
    rootEntity.addChild(defaultSceneRoot);
    const animator = defaultSceneRoot.getComponent(Animator);
    animator.play("run");
});
```

### Control playback speed

You can control the playback speed of the animation through the [speed](${api}core/animation/Animator#speed) property. The default value of `speed` is `1.0`, the larger the value, the faster the playback, the smaller the slower the playback.

```typescript
animator.speed = 2.0；
```

### Set animator data

You can set the data of the animation controller through the [animatorController](${api}core/animation/Animator#animatorController) property. The loaded GLTF model will automatically add a default AnimatorController.

```typescript
animator.animatorController = new AnimatorController()；
```

### Play the specified AnimationState

<playground src="skeleton-animation-play"></playground>

You can use the [play](${api}core/animation/Animator#play) method to play the specified AnimatorState. The parameter is the `name` of AnimatorState, and the description of other parameters is detailed in [API document](${api}core/animation/Animator#play)

```typescript
  animator.play("run");
```

### CrossFade

<playground src="skeleton-animation-crossFade"></playground>

You can use the [crossFade](${api}core/animation/Animator#crossFade) method to make the character transition to a specified state. The first parameter is the `name` of the animation state to be transitioned to, and the second parameter is the normalized animation transition time. For the description of other parameters, please refer to [API document](${api}core/animation/Animator#crossFade ).

### Add events to animation

<playground src="animation-event"></playground>

You can use [AnimationEvent](${api}core/animation/AnimationEvent) to add events to AnimationClip. The animation event will call the specified callback function of the component you bind to the same entity at the specified time.

```typescript
const event = new AnimationEvent();
event.functionName = "test";
event.time = 0.5;
clip.addEvent(event);
```

## Use AnimationStateMachine to control animation

Before further introducing the usage method, let's briefly introduce the composition of the animation system for understanding. The composition of the animation system is as follows:

### Composition of animation system

![image-20210830233452874](https://gw.alipayobjects.com/zos/OasisHub/b973418a-cca7-46c9-9298-a54e7d445f70/image-20210830233452874.png)

#### [Animator](${api}core/animation/Animator)
The Animator component of the animation system, used to control the playback of the animation。

#### [AnimatorController](${api}core/animation/AnimatorController)
Used to store the data of the  Animator component.

#### AnimatorControllerParameter（0.6版本将会提供）
The variables used in the Animator are used to switch the state of the animation state machine.

#### [AnimatorControllerLayer](${api}core/animation/AnimatorControllerLayer)
Store the animation state machine data, blending mode and blending weight of this layer.

#### [AnimatorStateMachine](${api}core/animation/AnimatorStateMachine)
Animation state machine, used to control the playback logic of the animation state, each animation state contains an AnimationClip.

#### [BlendingMode](${api}core/animation/AnimatorControllerLayer#blendingMode)
Blending mode of the animation layer

#### [AnimatorState](${api}core/animation/AnimatorState)
The AnimatorState is the basic structure of the state machine. Each AnimatorState contains an AnimationClip, when the character is in this state, the AnimationClip will be played.

#### [AnimatorTransition](${api}core/animation/AnimatorTransition)
AnimatorTransition defines when and how the state machine transitions from one state to another.

#### [AnimationClip](${api}core/animation/AnimationClip)
Store animation based on key frames.

#### [AnimationCurve](${api}core/animation/AnimationCurve)
Store a collection of key frames evaluated at a specified time.

#### [AnimationEvent](${api}core/animation/AnimationEvent)
AnimationEvent allows you to call the callback function of the script bound to the same entity at a specified time.

#### [Keyframe](${api}core/animation/KeyFrame)
Animation key frames

#### [Interpolation](${api}core/animation/AnimationCurve#interpolation)
The interpolation method of the key frame in the AnimationCurve.

### Use AnimatorTransition for animation crossFade
You can realize the crossFade between AnimationStates by adding AnimatorTransition to AnimatorState.

```typescript
const walkState = animatorStateMachine.addState('walk');
walkState.clip = walkClip;
const runState = animatorStateMachine.addState('run');
walkState.clip = runClip;
const transition = new AnimatorStateTransition();
transition.duration = 1;
transition.offset = 0;
transition.exitTime = 0.5;
transition.destinationState = runState;
walkState.addTransition(runState);
animator.play("walk");
```
In this way, every time you play the `walk` animation on the layer where the animation state machine is located, you will start to crossFade to the `run` animation halfway through the playback.

### Animation additive

<playground src="skeleton-animation-additive"></playground>

Animation additive is the effect achieved by blending between AnimatorControllerLayers. The first layer is the basic animation layer. Modifying its weight and blending mode will not take effect. Add the AnimationState you want to make additive, add it to other layers and set its blending mode to `AnimatorLayerBlendingMode.Additive` to achieve the animation additive effect. The Oasis engine supports multi-layer animation additive.
