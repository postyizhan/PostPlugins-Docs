---
title: 图标
sidebar_position: 2
---

# 图标

物品图标的所有键值，实际使用中不需要全写

```yaml
items:
  A:
    material: COMPASS
    amount: 1
    enchanted: false
    customModelData: 1
    name: "item name"
    lore:
      - "item lore"
    i18n:
      zh_CN:
        name: "中文语言的名字"
        lore:
          - "中文语言的lore"
      en_US:
        name: "English name"
        lore:
          - "English lore"
    # 子图标
    icons:
      - condition: 'data is_public'
        material: STONE
        xxx: xxx
    action:
      - "[sound] ORB_PICKUP 0.5 1.2"
```

特别的，`customModelData` 与 `custom-model-data` 等同
