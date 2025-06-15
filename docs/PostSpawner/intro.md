---
title: 开始
description: 开始
---
import ResourcePage from '@site/src/components/ResourceComponents/ResourcePageMDX';

<ResourcePage 
  name="PostSpawner" 
  description="PostSpawner 是一个功能丰富的 Minecraft 刷怪笼控制插件，支持挖掘、放置、破坏几率等多种操作。"
  modrinthId="postspawner"
  minebbsId="postspawner"
  spigotId="postspawner"
  category="游戏机制"
  navigationItems={[
    {
      id: 'plugin-intro',
      title: 'PostSpawner 插件介绍',
      href: '#plugin-intro',
    },
    {
      id: 'core-features',
      title: '核心功能',
      href: '#core-features',
    },
    {
      id: 'usage',
      title: '使用方法',
      href: '#usage',
    }
  ]}
  features={[
    '✅ 刷怪笼管理：支持精准采集和普通工具挖掘刷怪笼',
    '🌐 多语言支持：内置中文和英文语言文件，可轻松扩展',
    '🎮 丰富的动作系统：支持命令执行、物品掉落、音效播放等多种动作',
    '🔌 钩子系统：兼容 PlaceholderAPI、ItemsAdder、MythicMobs、NeigeItems、Oraxen 等插件',
    '⚙️ 灵活配置：完全可自定义的配置和消息系统',
    '🔄 更新检查：提供可关闭的更新检查功能'
  ]}
  otherPlatforms={[
    {
      name: 'MineBBS',
      url: 'https://www.minebbs.com/threads/postspawner.37090/',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    }
  ]}
>

## PostSpawner 插件介绍 {#plugin-intro}

PostSpawner 是一个功能丰富的 Minecraft 刷怪笼控制插件，为服务器提供了完整的刷怪笼管理解决方案。它允许服务器管理员和玩家按照特定规则挖掘、放置和使用刷怪笼，增强了游戏的平衡性和趣味性。

### 适用场景

PostSpawner 插件特别适合以下服务器类型：

- 生存服务器：平衡刷怪笼经济，增加游戏挑战性
- RPG服务器：自定义刷怪笼掉落和奖励机制
- 小游戏服务器：创建特殊的刷怪笼关卡或挑战
- 任何需要控制刷怪机制的服务器

## 核心功能 {#core-features}

### 刷怪笼管理

- 支持精准采集和普通工具挖掘刷怪笼
- 可设置不同工具的破坏几率和触发条件
- 完全可自定义的刷怪笼行为和属性

### 动作系统

- 支持多种动作类型，包括命令执行、物品掉落、音效播放等
- 可设置条件触发特定动作
- 灵活组合不同动作创建复杂交互

### 插件兼容与钩子

- 兼容 PlaceholderAPI、ItemsAdder、MythicMobs
- 支持 NeigeItems、Oraxen 等物品插件
- 可扩展的钩子系统适配更多插件

### 多语言支持

- 内置中文和英文语言文件
- 可轻松扩展其他语言
- 根据服务器或玩家设置自动切换语言

## 使用方法 {#usage}

### 基础安装

1. 下载插件并放置到服务器的plugins文件夹中
2. 重启服务器或使用插件管理器加载插件
3. 配置文件会自动生成，可根据需要进行修改
4. 使用 `/postspawner reload` 命令重载配置

### 刷怪笼设置

- 使用对应权限和工具可以挖掘或放置刷怪笼
- 可通过配置文件设置不同类型刷怪笼的行为
- 支持自定义刷怪笼掉落物和触发事件

![](_images/show1.png)

![](_images/show2.png)

</ResourcePage>

<!-- ![](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/supported/spigot_vector.svg)
![](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/supported/paper_vector.svg)
![](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/available/modrinth_vector.svg)
![](https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/available/github_vector.svg)
![](https://gitee.com/postyizhan/images-hosting/releases/download/svg/minebbs_badge.svg) -->
