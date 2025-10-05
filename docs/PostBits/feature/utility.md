---
title: 实用命令
sidebar_position: 3
---

# 实用命令

- `[ ]` 必填
- `( )` 可选

## fix - 修理

```text
/fix
```

回满你手中装备的耐久。

## hat - 帽子

```text
/hat
```

将手中物品戴在头上。

## speed - 速度

```text
/speed [number/reset] (fly/walk)
```

设置行走和飞行的速度。

## fly - 飞行

```text
/fly [number/reset] (fly/walk)
```

开关飞行状态。

## heal - 治愈

```text
/heal
```

回满你的生命值，饱食度和饱和度并清除着火状态。

## suicide - 自杀

```text
/suicide
```

自杀。

## toast - 成就

```
/toast [玩家名|all] [图标] [类型] [消息] (model_data) (glow)
```

- 图标：物品 ID

- 类型：CHALLENGE | GOAL | TASK

- 消息：
  - 传统 `&`
  - 十六进制颜色 (&#RRGGBB)


- model_data: CustomModelData值（整数/浮点数）

- glow: 是否发光 (true/false)

::: info

此功能不支持且不能支持物品库。

:::

## vanish - 隐身

```text
/vanish
```

使你隐身，其他玩家不能看到，睡觉跳过夜晚计算人数不算你。
