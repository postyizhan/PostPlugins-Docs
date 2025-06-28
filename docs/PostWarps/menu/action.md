---
title: 动作
sidebar_position: 4
---

# 动作

## message

```yaml
action:
  - "[message] 消息内容"
```

```yaml
action:
  - "[message] &a欢迎使用PostWarps!"
```

## title

```yaml
action:
  - "[title] 主标题|副标题|淡入时间|停留时间|淡出时间"
```

```yaml
action:
  - "[title] &a传送成功！|&7欢迎来到 {warp_name}|10|40|10"
  - "[title] &c权限不足||20|60|20"  # 只显示主标题
```

## sound

```yaml
action:
  - "[sound] 音效名称 音量 音调"
```

```yaml
action:
  - "[sound] BLOCK_ANVIL_LAND 1.0 1.5"
```

## close

```yaml
action:
  - "[close]"
```

## menu

```yaml
action:
  - "[menu] 菜单名称"
```

```yaml
action:
  - "[menu] main"              # 打开主菜单
  - "[menu] create"            # 打开创建地标菜单
  - "[menu] private_warps"     # 打开私有地标菜单
  - "[menu] public_warps"      # 打开公开地标菜单
  - "[menu] settings"          # 打开设置菜单
```

## page_next

```yaml
action:
  - "[page_next]"
```

## page_prev

```yaml
action:
  - "[page_prev]"
```

## command

```yaml
action:
  - "[command] 命令内容"
```

## op

```yaml
action:
  - "[op] 命令内容"
```

## console

```yaml
action:
  - "[console] 命令内容"
```
