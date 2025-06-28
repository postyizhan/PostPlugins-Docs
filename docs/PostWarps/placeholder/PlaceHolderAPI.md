---
title: PlaceHolderAPI
sidebar_position: 1
---

# PlaceHolderAPI

## 基础统计变量

### 玩家地标统计

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_total_warps%` | 玩家地标总数 | `15` |
| `%postwarps_public_warps%` | 玩家公开地标数 | `5` |
| `%postwarps_private_warps%` | 玩家私有地标数 | `10` |
| `%postwarps_max_warps%` | 玩家地标上限 | `20` |
| `%postwarps_remaining_warps%` | 剩余可创建地标数 | `5` |

### 服务器统计

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_server_total_warps%` | 服务器地标总数 | `1250` |
| `%postwarps_server_public_warps%` | 服务器公开地标数 | `450` |
| `%postwarps_server_private_warps%` | 服务器私有地标数 | `800` |
| `%postwarps_server_players_with_warps%` | 有地标的玩家数 | `125` |

## 地标信息变量

### 最近使用的地标

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_last_warp_name%` | 最后使用的地标名称 | `我的家` |
| `%postwarps_last_warp_world%` | 最后使用的地标世界 | `world` |
| `%postwarps_last_warp_time%` | 最后使用时间 | `2024-01-15 10:30` |

### 特定地标信息

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_warp_exists_<地标名>%` | 地标是否存在 | `true` / `false` |
| `%postwarps_warp_public_<地标名>%` | 地标是否公开 | `true` / `false` |
| `%postwarps_warp_owner_<地标名>%` | 地标所有者 | `Steve` |
| `%postwarps_warp_description_<地标名>%` | 地标描述 | `我的温馨小家` |

## 经济相关变量

### 费用信息

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_create_cost%` | 创建地标费用 | `100.0` |
| `%postwarps_teleport_cost%` | 传送费用 | `10.0` |
| `%postwarps_public_cost%` | 设为公开费用 | `50.0` |
| `%postwarps_currency%` | 货币类型 | `金币` / `点券` |

### 消费统计

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_total_spent%` | 总消费金额 | `500.0` |
| `%postwarps_total_earned%` | 总收入金额（退款） | `100.0` |
| `%postwarps_net_spent%` | 净消费金额 | `400.0` |

## 排行榜变量

### 地标数量排行

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_top_warps_<排名>_name%` | 排行榜玩家名 | `Steve` |
| `%postwarps_top_warps_<排名>_count%` | 排行榜地标数 | `25` |
| `%postwarps_top_public_<排名>_name%` | 公开地标排行玩家名 | `Alex` |
| `%postwarps_top_public_<排名>_count%` | 公开地标排行数量 | `15` |

### 使用频率排行

| 变量 | 描述 | 示例输出 |
|------|------|----------|
| `%postwarps_top_usage_<排名>_name%` | 使用最多的地标名 | `商店` |
| `%postwarps_top_usage_<排名>_count%` | 使用次数 | `150` |
| `%postwarps_top_usage_<排名>_owner%` | 地标所有者 | `Admin` |
