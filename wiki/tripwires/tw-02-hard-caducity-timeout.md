---
id: tw-02-hard-caducity-timeout
type: tripwire
title: 红队暗雷 02：把一到点就清零的“除斥期”当成发微信能续命的时效
domain: legal
mastery: mapped
confidence: 0.40
hubs:
  - mos-02-state-locks-and-gates
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: related_lens
    target: mm-04-procedural-gates-and-time-locks
  - rel: related_lens
    target: fl-01-pe-repurchase-vs-capital-reduction
tags:
  - tripwire
  - red-team
  - deadline
related:
  - mos-02-state-locks-and-gates
  - mm-04-procedural-gates-and-time-locks
  - fl-01-pe-repurchase-vs-capital-reduction
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 红队暗雷 02：把一到点就清零的“除斥期”当成发微信能续命的时效

- **发散者为什么会踩**：觉得一直在拉扯谈判、微信一直在催，权利肯定还在。
- **踩爆后果**：对赌回购合理行权期（参考 6 个月）、撤销股东会决议（60 天）、债权人撤销权（1 年/5 年）、建工优先受偿权（18 个月）、上诉期（15 天）全是**不可中断硬死线**，超期 1 天权利直接物理销毁。
- **10 秒防雷动作**：一旦对方违约或触发行权条件，第一时间让 AI 列出该事项的**最早死线日历锁**，先发正式行权函或立案锁死权利再慢慢谈。
