---
title: 更多徽章示例
sidebar_position: 3
---

import { BadgeGroup } from '@site/src/components/BadgeGroup';
import Badge from '@site/src/components/Badge';

# 更多徽章示例

除了预设的徽章组件外，您可以使用基础的 `Badge` 组件创建各种不同类型的徽章。以下是一些常用徽章的示例。

## 版本徽章

```jsx
<Badge 
  service="badge"
  label="版本"
  value="v1.0.0"
  color="blue"
  logo="npm"
  link="https://example.com"
/>
```

<Badge 
  service="badge"
  label="版本"
  value="v1.0.0"
  color="blue"
  logo="npm"
  link="https://example.com"
/>

## 构建状态徽章

```jsx
<Badge 
  service="badge"
  label="构建"
  value="通过"
  color="brightgreen"
  logo="github-actions"
  link="https://example.com"
/>
```

<Badge 
  service="badge"
  label="构建"
  value="通过"
  color="brightgreen"
  logo="github-actions"
  link="https://example.com"
/>

## 下载量徽章

```jsx
<Badge 
  service="badge"
  label="下载"
  value="10k"
  color="blue"
  logo="github"
  link="https://example.com"
/>
```

<Badge 
  service="badge"
  label="下载"
  value="10k"
  color="blue"
  logo="github"
  link="https://example.com"
/>

## 许可证徽章

```jsx
<Badge 
  service="badge"
  label="许可证"
  value="MIT"
  color="green"
  link="https://example.com"
/>
```

<Badge 
  service="badge"
  label="许可证"
  value="MIT"
  color="green"
  link="https://example.com"
/>

## 群组徽章

您可以将多个徽章组合在一起：

```jsx
<BadgeGroup>
  <Badge service="badge" label="版本" value="v1.0.0" color="blue" />
  <Badge service="badge" label="许可证" value="MIT" color="green" />
  <Badge service="badge" label="构建" value="通过" color="brightgreen" logo="github-actions" />
  <Badge service="badge" label="下载" value="10k" color="blue" logo="github" />
</BadgeGroup>
```

<BadgeGroup>
  <Badge service="badge" label="版本" value="v1.0.0" color="blue" />
  <Badge service="badge" label="许可证" value="MIT" color="green" />
  <Badge service="badge" label="构建" value="通过" color="brightgreen" logo="github-actions" />
  <Badge service="badge" label="下载" value="10k" color="blue" logo="github" />
</BadgeGroup>

## 自定义样式徽章

shields.io 支持多种样式：

```jsx
<BadgeGroup>
  <Badge service="badge" label="风格" value="plastic" color="blue" style="plastic" />
  <Badge service="badge" label="风格" value="flat" color="blue" style="flat" />
  <Badge service="badge" label="风格" value="flat-square" color="blue" style="flat-square" />
  <Badge service="badge" label="风格" value="for-the-badge" color="blue" style="for-the-badge" />
  <Badge service="badge" label="风格" value="social" color="blue" style="social" />
</BadgeGroup>
```

<BadgeGroup>
  <Badge service="badge" label="风格" value="plastic" color="blue" style="plastic" />
  <Badge service="badge" label="风格" value="flat" color="blue" style="flat" />
  <Badge service="badge" label="风格" value="flat-square" color="blue" style="flat-square" />
  <Badge service="badge" label="风格" value="for-the-badge" color="blue" style="for-the-badge" />
  <Badge service="badge" label="风格" value="social" color="blue" style="social" />
</BadgeGroup>

## 不同颜色的徽章

```jsx
<BadgeGroup>
  <Badge service="badge" label="红色" value="red" color="red" />
  <Badge service="badge" label="橙色" value="orange" color="orange" />
  <Badge service="badge" label="黄色" value="yellow" color="yellow" />
  <Badge service="badge" label="绿色" value="green" color="green" />
  <Badge service="badge" label="蓝色" value="blue" color="blue" />
  <Badge service="badge" label="紫色" value="purple" color="purple" />
</BadgeGroup>
```

<BadgeGroup>
  <Badge service="badge" label="红色" value="red" color="red" />
  <Badge service="badge" label="橙色" value="orange" color="orange" />
  <Badge service="badge" label="黄色" value="yellow" color="yellow" />
  <Badge service="badge" label="绿色" value="green" color="green" />
  <Badge service="badge" label="蓝色" value="blue" color="blue" />
  <Badge service="badge" label="紫色" value="purple" color="purple" />
</BadgeGroup>
