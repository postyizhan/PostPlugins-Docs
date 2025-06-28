---
title: 子图标
sidebar_position: 3
---

# 子图标

## 示例

```yaml
items:
  A:
    material: COMPASS
    # 子图标
    icons:
      # 条件
      - condition: 'data is_public'
        material: STONE
        action:
          - "[message] hello!"
      - condition: 'perm group.xxx'
        material: DIAMOND
    action:
      - "[sound] ORB_PICKUP 0.5 1.2"
```

子图标可以与父图标配置同样的节点，子图标没有的节点会从父图标继承

## 条件

子图标可以使用的判断条件

### perm

| 条件             | 描述                    | 案例                   |
|------------------|-------------------------|------------------------|
|perm &lt;权限节点&gt;  |检查玩家是否拥有指定权限 | perm postwarps.admin   |
|!perm &lt;权限节点&gt; |检查玩家是否没有指定权限 | !perm postwarps.create |

### op

| 条件 | 描述               | 案例 |
|------|--------------------|------|
|op	   | 检查玩家是否为OP   | op   |
|!op   | 检查玩家是否不是OP | !op  |

### data

| 条件            | 描述                                      | 案例            |
|-----------------|-------------------------------------------|-----------------|
| data &lt;数据键&gt;  | 检查数据上下文中指定键的布尔值是否为true  | data is_public  |
| !data &lt;数据键&gt; | 检查数据上下文中指定键的布尔值是否为false | !data is_public |

### player

| 条件              | 描述                         | 案例               |
|-------------------|------------------------------|--------------------|
| player &lt;玩家名&gt;  | 检查当前玩家是否为指定玩家   | player postyizhan  |
| !player &lt;玩家名&gt; | 检查当前玩家是否不为指定玩家 | !player postyizhan |
