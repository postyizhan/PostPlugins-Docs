---
title: 地标动作
sidebar_position: 5
---

# 地标动作

## warp_create

```yaml
action:
  - "[warp_create]"
```

## warp_delete

```yaml
action:
  - "[warp_delete] 地标名称"
  - "[warp_delete]"  # 删除当前选中的地标
```

## warp_info

```yaml
action:
  - "[warp_info] 地标名称"
  - "[warp_info]"  # 显示当前选中地标信息
```

## warp_teleport

```yaml
action:
  - "[warp_teleport] 地标名称"
  - "[warp_teleport]"  # 使用玩家数据中的warp_id
```

## warp_search

```yaml
action:
  - "[warp_search]"        # 搜索地标
```

## warp_set

```yaml
action:
  - "[warp_set] 数据键名"
```

## warp_public

```yaml
action:
  - "[warp_public] 地标名称"
```

## warp_private

```yaml
action:
  - "[warp_private] 地标名称"
```

## warp_toggle

```yaml
action:
  - "[warp_toggle]"
```
