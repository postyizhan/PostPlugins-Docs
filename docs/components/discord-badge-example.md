---
title: Discord徽章示例
sidebar_position: 4
---

import { BadgeGroup, DiscordBadge } from '@site/src/components/BadgeGroup';
import Badge from '@site/src/components/Badge';

# Discord 徽章示例

## 更新后的Discord徽章

我们已经更新了Discord徽章的样式，以匹配官方样式：

```jsx
<DiscordBadge serverId="1342805340839870514" />
```

<DiscordBadge serverId="1342805340839870514" />

## 自定义Discord徽章

您也可以使用基础Badge组件创建完全自定义的Discord徽章：

```jsx
<Badge
  service="discord"
  value="1342805340839870514"
  label=""
  logo="discord"
  logoColor="ffffff"
  color="7389D8"
  labelColor="6A7EC2"
  link="https://discord.com/invite/jN4Br8uhSS"
  description="加入我们的Discord"
/>
```

<Badge
  service="discord"
  value="1342805340839870514"
  label=""
  logo="discord"
  logoColor="ffffff"
  color="7389D8"
  labelColor="6A7EC2"
  link="https://discord.com/invite/jN4Br8uhSS"
  description="加入我们的Discord"
/>

## 原始shields.io链接

这是完全匹配的原始shields.io徽章URL：

```
https://img.shields.io/discord/1342805340839870514.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2
```

<img src="https://img.shields.io/discord/1342805340839870514.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord Badge" /> 