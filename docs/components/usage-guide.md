---
title: 使用指南
sidebar_position: 2
---

# 徽章组件使用指南

## 在 MDX 文档中使用徽章

要在 Docusaurus MDX 文档中使用徽章组件，请按照以下步骤操作：

### 步骤 1: 导入组件

在 MDX 文件的顶部添加以下导入语句：

```jsx
import { BadgeGroup, QQBadge, DiscordBadge, GitHubBadge } from '@site/src/components/BadgeGroup';
import Badge from '@site/src/components/Badge';
```

### 步骤 2: 使用组件

在文档中需要显示徽章的位置使用相应的组件：

```jsx
<BadgeGroup>
  <QQBadge group="611076407" link="https://8aka.cn/qq" />
  <DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" />
  <GitHubBadge username="postyizhan" link="https://github.com/postyizhan" />
</BadgeGroup>
```

## 常见问题

### 如何修改徽章的样式？

每个徽章组件都接受 `style` 参数，可以设置为 'plastic'、'flat'、'flat-square'、'for-the-badge' 等值：

```jsx
<GitHubBadge username="postyizhan" style="for-the-badge" />
```

### 如何添加自己的描述文本？

使用 `description` 参数添加徽章后面显示的文本：

```jsx
<QQBadge group="611076407" description="加入我们的讨论群" />
```

### 如何创建自定义徽章？

使用基础的 `Badge` 组件创建自定义徽章：

```jsx
<Badge 
  service="badge"
  label="构建状态"
  value="通过"
  color="green"
  logo="github-actions"
  link="https://github.com/postyizhan/postplugins/actions"
  description="最新构建状态"
/>
```

## 在现有文档中替换徽章

如果您想将现有 Markdown 文档中的徽章链接替换为徽章组件，请参考以下转换示例：

### 转换前（Markdown）

```markdown
- [![](https://img.shields.io/badge/QQ群-611076407-54B4EF?logo=qq)](https://8aka.cn/qq) <-点击加入
- [![](https://img.shields.io/discord/1342805340839870514.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.com/invite/jN4Br8uhSS) <-点击加入
- [![](https://img.shields.io/badge/GitHub-postyizhan-181717?style=plastic&logo=github&logoColor=white)](https://github.com/postyizhan) <- 主页
```

### 转换后（MDX 组件）

```jsx
<BadgeGroup>
  <QQBadge group="611076407" link="https://8aka.cn/qq" description="点击加入" />
  <DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" description="点击加入" />
  <GitHubBadge username="postyizhan" link="https://github.com/postyizhan" description="主页" />
</BadgeGroup>
```
