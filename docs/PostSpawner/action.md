---
title: 动作
sidebar_position: 5
---

# 动作

格式说明： `[]` 为必填参数，`()` 为选填参数

| 动作语法 | 描述 | 示例 |
|----------|------|------|
| `[command] [命令]` | 让玩家执行命令 | `[command] spawn` |
| `[op] [命令]` | 临时给予玩家OP权限执行命令 | `[op] gamemode creative` |
| `[console] [命令]` | 在控制台执行命令 | `[console] broadcast 有人挖掘了刷怪笼！` |
| `[sound] [音效] (音量) (音调)` | 为玩家播放音效 | `[sound] BLOCK_ANVIL_LAND 1.0 1.5` |
| `[message] [文本]` | 向玩家发送消息 | `[message] &a你成功挖掘了刷怪笼！` |
| `[title] [主标题] (副标题)` | 向玩家展示标题 | `[title] &a挖掘成功 &7获得了一个刷怪笼` |
| `[drop_monster_spawner]` | 掉落被破坏的刷怪笼 | `[drop_monster_spawner]` |
| `[drop] [物品ID] (数量)` | 在指定位置掉落物品 | `[drop] DIAMOND 5` [物品库支持](./items.md) |
| `[give] [物品ID] (数量)` | 给予玩家物品 | `[give] DIAMOND_SWORD 1` [物品库支持](./items.md) |
| `[buff] [药水效果] (持续时间秒) (等级)` | 给予玩家药水效果 | `[buff] SPEED 30 2` |
| `[money] [操作] [数量]` | 控制玩家经济 | `[money] give 100`, `[money] take 200`, `[money] set 50` |
| `[points] [操作] [数量]` | 控制玩家点券 | `[points] give 100`, `[points] take 200`, `[points] set 50` |

特别的，创造模式下破坏刷怪笼不会执行任何动作。
