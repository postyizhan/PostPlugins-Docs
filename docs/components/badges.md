---
title: 徽章组件
sidebar_position: 1
---

import { BadgeGroup, QQBadge, DiscordBadge, GitHubBadge } from '@site/src/components/BadgeGroup';
import Badge from '@site/src/components/Badge';

# 徽章组件

这个徽章组件可以轻松地在 Markdown 文档中添加各种徽章，无需直接编写复杂的 Markdown 图片链接语法。

## 预配置徽章

我们提供了几种常用的预配置徽章组件：

### QQ 群徽章

```jsx
<QQBadge group="611076407" link="https://8aka.cn/qq" description="点击加入" />
```

<QQBadge group="611076407" link="https://8aka.cn/qq" description="点击加入" />

### Discord 徽章

```jsx
<DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" description="点击加入" />
```

<DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" description="点击加入" />

### GitHub 徽章

```jsx
<GitHubBadge username="postyizhan" link="https://github.com/postyizhan" description="主页" />
```

<GitHubBadge username="postyizhan" link="https://github.com/postyizhan" description="主页" />

## 徽章组

使用 BadgeGroup 组件可以轻松排列多个徽章：

```jsx
<BadgeGroup>
  <QQBadge group="611076407" link="https://8aka.cn/qq" />
  <DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" />
  <GitHubBadge username="postyizhan" link="https://github.com/postyizhan" />
</BadgeGroup>
```

<BadgeGroup>
  <QQBadge group="611076407" link="https://8aka.cn/qq" />
  <DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" />
  <GitHubBadge username="postyizhan" link="https://github.com/postyizhan" />
</BadgeGroup>

## 自定义徽章

如果需要创建自定义徽章，可以直接使用基础 Badge 组件：

```jsx
<Badge 
  service="badge"
  label="版本"
  value="v1.0.0"
  color="blue"
  logo="npm"
  link="https://example.com"
  description="最新版本"
/>
```

<Badge 
  service="badge"
  label="版本"
  value="v1.0.0"
  color="blue"
  logo="npm"
  link="https://example.com"
  description="最新版本"
/>

## Badge 组件参数

| 参数 | 类型 | 描述 |
|------|------|------|
| service | string | 服务类型，可选值为 'badge' 或 'discord' |
| label | string | 徽章左侧文本 |
| value | string | 徽章右侧文本 |
| color | string | 徽章右侧背景颜色，可以是颜色名称或十六进制颜色代码 |
| logo | string | 徽章上显示的 Logo，详见 [shields.io](https://shields.io/badges) |
| logoColor | string | Logo 颜色 |
| labelColor | string | 徽章左侧背景颜色 |
| style | string | 徽章样式，可选值为 'plastic'、'flat'、'flat-square'、'for-the-badge' 等 |
| link | string | 徽章点击后跳转的链接 |
| description | string | 徽章后面显示的描述文本 |
