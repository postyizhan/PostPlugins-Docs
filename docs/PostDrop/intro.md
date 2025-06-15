---
title: 开始
description: 开始
---
import ResourcePage from '@site/src/components/ResourceComponents/ResourcePageMDX';

<ResourcePage 
  name="PostDrop" 
  description="PostDrop 是一个简单而实用的 Minecraft 物品丢弃保护插件，可以防止其他玩家拾取您丢弃的物品。"
  modrinthId="postdrop"
  minebbsId="postdrop"
  spigotId="postdrop"
  category="实用工具"
  navigationItems={[
    {
      id: 'plugin-intro',
      title: 'PostDrop 插件介绍',
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
    '🔒 物品保护：玩家丢弃的物品默认受到保护，只有丢弃者可以拾取',
    '✨ 物品高亮：受保护的物品会有发光效果，方便玩家识别',
    '👁️ 物品可见性控制：可以配置受保护的物品对其他玩家是否可见（需要ProtocolLib）',
    '🔄 玩家自主控制：玩家可以自行切换是否保护丢弃的物品',
    '🔔 自动更新检查：自动检查并提示新版本',
    '🌐 多语言支持：内置中文和英文语言包',
    '📊 变量支持：支持PlaceholderAPI变量，可用于计分板、全息图等'
  ]}
  otherPlatforms={[
    {
      name: 'MineBBS',
      url: 'https://www.minebbs.com/resources/postdrop.11667/',
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

## PostDrop 插件介绍 {#plugin-intro}

PostDrop 是一个简单而实用的 Minecraft 物品丢弃保护插件，可以防止其他玩家拾取您丢弃的物品。它为服务器提供了一种安全丢弃物品的方式，避免玩家间的物品误拾或恶意拾取问题。

### 适用场景

PostDrop 插件特别适合以下服务器类型：

- 生存服务器：防止物品被其他玩家拾取
- RPG服务器：增强物品安全性
- 多人小游戏服务器：确保物品归属权
- 任何需要物品保护的服务器类型

## 核心功能 {#core-features}

### 物品保护系统

- 玩家丢弃的物品默认受到保护，只有丢弃者可以拾取
- 物品保护状态可由玩家自行控制开启或关闭
- 支持物品保护时间限制，超时后自动解除保护

### 物品高亮效果

- 受保护的物品会有发光效果，方便玩家识别
- 可自定义发光颜色和效果
- 支持不同权限组的不同高亮效果

### 物品可见性控制

- 可配置受保护的物品对其他玩家是否可见
- 需要ProtocolLib支持
- 减少服务器实体渲染负担

### 多语言支持

- 内置中文和英文语言包
- 支持自定义语言文件
- 根据玩家客户端语言自动切换

## 使用方法 {#usage}

### 基础使用

1. 安装插件到服务器的plugins文件夹
2. 重启服务器或使用插件管理器加载插件
3. 默认情况下，玩家丢弃的物品将自动受到保护
4. 使用 `/postdrop toggle` 命令切换物品保护状态

### 物品保护状态

- 当物品保护功能开启时，玩家丢弃的物品只有自己可以拾取
- 物品会有发光效果，便于识别
- 保护状态可通过命令随时切换

</ResourcePage>
