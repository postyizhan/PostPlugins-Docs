---
title: 命令
sidebar_position: 2
---

# 基础命令指南

本指南详细介绍 PostWarps 插件的所有可用命令

`<>` 为必填项，`[]` 为选填项

## 命令概览

PostWarps 提供两个主要命令：

- `/postwarps` (别名: `/pw`, `/warp`, `/warps`) - 主命令
- `/lang` (别名: `/language`) - 语言命令

命令别名：

| 主命令 | 别名 |
|--------|------|
| `/postwarps` | `/pw`, `/warp`, `/warps` |
| `/lang` | `/language` |

## 地标管理命令

### 创建地标

```
/pw warp create <名称> [描述] [公开状态]
```

**参数说明**：
- `<名称>` - 地标名称（必需）
- `[描述]` - 地标描述（可选）
- `[公开状态]` - true/false，是否公开（可选，默认false）

**示例**：
```bash
/pw warp create 家                    # 创建私有地标"家"
/pw warp create 矿场 我的挖矿基地        # 创建带描述的私有地标
/pw warp create 商店 欢迎来购物 true     # 创建公开地标
```

**权限要求**: `postwarps.create`

---

### 删除地标

```
/pw warp delete <名称>
```

**参数说明**：
- `<名称>` - 要删除的地标名称

**示例**：
```bash
/pw warp delete 家                    # 删除名为"家"的地标
```

**权限要求**:
- `postwarps.delete` - 删除自己的地标
- `postwarps.delete.others` - 删除他人的地标（管理员）

---

### 传送到地标

```
/pw warp tp <名称>
```

**参数说明**：
- `<名称>` - 地标名称

**示例**：
```bash
/pw warp tp 家                       # 传送到"家"地标
/pw warp tp 矿场                     # 传送到"矿场"地标
```

**权限要求**: `postwarps.teleport`

**注意事项**：
- 传送可能有延迟（根据配置）
- 移动或受伤可能取消传送（根据配置）
- 传送需要消耗金钱或点券（如果启用经济系统）

---

### 查看地标列表

```
/pw warp list [类型]
```

**参数说明**：
- `[类型]` - 可选参数：
  - `my` - 只显示我的地标
  - `public` - 只显示公开地标
  - 不填 - 显示所有可访问的地标

**示例**：
```bash
/pw warp list                        # 显示所有地标
/pw warp list my                     # 显示我的地标
/pw warp list public                 # 显示公开地标
```

**权限要求**: `postwarps.list`

---

### 查看地标信息

```
/pw warp info <名称>
```

**参数说明**：
- `<名称>` - 地标名称

**示例**：
```bash
/pw warp info 家                     # 查看"家"地标的详细信息
```

**权限要求**: `postwarps.info`

**显示信息**：
- 地标名称和描述
- 创建者
- 创建时间
- 位置坐标
- 公开/私有状态

---

### 设置地标状态

#### 设为公开

```
/pw warp public <名称>
```

#### 设为私有

```
/pw warp private <名称>
```

**参数说明**：
- `<名称>` - 地标名称

**示例**：
```bash
/pw warp public 商店                 # 将"商店"设为公开
/pw warp private 家                  # 将"家"设为私有
```

**权限要求**:
- `postwarps.public` - 设置为公开
- `postwarps.private` - 设置为私有

---

## 菜单命令

### 打开菜单

```
/pw menu [菜单类型]
```

**参数说明**：
- `[菜单类型]` - 可选参数：
  - `main` - 主菜单（默认）
  - `private_warps` - 私有地标菜单
  - `public_warps` - 公开地标菜单
  - `create` - 创建地标菜单

**示例**：
```bash
/pw menu                            # 打开主菜单
/pw menu main                       # 打开主菜单
/pw menu private_warps              # 打开私有地标菜单
/pw menu public_warps               # 打开公开地标菜单
/pw menu create                     # 打开创建菜单
```

**权限要求**: `postwarps.menu`

---

## 语言命令

### 切换语言

```
/lang <语言代码>
```

**支持的语言**：
- `zh_CN` - 简体中文
- `en_US` - 英语

**示例**：
```bash
/lang zh_CN                         # 切换到中文
/lang en_US                         # 切换到英语
```

---

### 查看可用语言

```
/lang list
```

显示所有可用的语言选项。

---

### 自动检测语言

```
/lang auto
```

根据客户端语言自动设置语言。

---

### 重载语言文件

```
/lang reload
```

重新加载语言文件（管理员命令）。

**权限要求**: `postwarps.admin`

---

## 管理员命令

### 重载插件

```
/pw reload
```

重新加载插件配置文件。

**权限要求**: `postwarps.admin`

---

### 查看版本信息

```
/pw version
```

显示插件版本和更新信息。

**权限要求**: `postwarps.use`

---

### 查看插件信息

```
/pw admin info
```

显示详细的插件统计信息：
- 插件版本
- 地标总数
- 公开/私有地标数量
- 数据库类型

**权限要求**: `postwarps.admin`

---
