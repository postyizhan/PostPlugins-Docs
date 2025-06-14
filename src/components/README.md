# 徽章组件

这个文件夹包含 PostPlugins 文档站点的可复用组件。

## 徽章组件

徽章组件提供了一种简单的方式在 Markdown 文档中添加 shields.io 徽章：

- `Badge.js` - 基础徽章组件，用于生成 shields.io URL
- `BadgeGroup.js` - 包含徽章组组件和预配置徽章组件，如 QQBadge、DiscordBadge 和 GitHubBadge

## 使用方法

完整文档请参见 `docs/components/badges.md`。

### 示例

```jsx
import { BadgeGroup, QQBadge, DiscordBadge, GitHubBadge } from '@site/src/components/BadgeGroup';

<BadgeGroup>
  <QQBadge group="611076407" link="https://8aka.cn/qq" />
  <DiscordBadge serverId="1342805340839870514" link="https://discord.com/invite/jN4Br8uhSS" />
  <GitHubBadge username="postyizhan" link="https://github.com/postyizhan" />
</BadgeGroup>
```
