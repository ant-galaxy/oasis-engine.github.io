---
order: 1
title: 统计面板
type: 性能调试
label: Performance
---

[@oasis-engine-toolkit/stats](https://www.npmjs.com/package/@oasis-engine-toolkit/stats) 包主要用来显示相机的渲染状态，只需要为相机节点添加 `Stats` 组件：

```typescript
import { Engine } from "oasis-engine";
import { Stats } from "@oasis-engine-toolkit/stats";

cameraEntity.addComponent(Camera);
cameraEntity.addComponent(Stats);
```

## 示例

<playground src="text-barrage.ts"></playground>
