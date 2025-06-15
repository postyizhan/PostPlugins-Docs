---
title: 组件库
sidebar_position: 00
---

# PostPlugins 组件库

本节包含 PostPlugins 文档中使用的各种 React 组件，这些组件可以在 MDX 文档中直接使用，帮助您更好地展示内容。

## 可用组件

### 徽章组件

- [徽章组件](./badges.md) - 在文档中添加徽章（如 QQ群、Discord、GitHub 等）
- [使用指南](./usage-guide.md) - 徽章组件的详细使用说明

### 如何使用组件

在 MDX 文档中，您可以通过在文件顶部导入组件来使用它们：

```jsx
import { ComponentName } from '@site/src/components/ComponentPath';

<ComponentName prop1="value1" prop2="value2" />
```

更多详细信息，请参阅每个组件的文档页面。
