---
id: mos-03-asymmetric-payoff
type: master-os
title: 母法三：非对称赔率与底账穿透（只认不可变底账、算净落袋收益）
domain: meta
mastery: battle_proven
confidence: 1.0
hubs: []
edges:
  - rel: related_lens
    target: mos-02-state-locks-and-gates
  - rel: related_lens
    target: mos-04-lateral-restructure
tags:
  - master-os
  - payoff
  - ground-truth
related:
  - mos-02-state-locks-and-gates
  - mos-04-lateral-restructure
  - mm-03-evidence-log-hierarchy
  - mm-05-waterfall-and-net-payoff
  - sp-01-why-sota-models-fail-real-law
evidence_refs:
  - raw/sources/2026-11-26-work-legal-sota-55pct.md
created: 2026-11-26
updated: 2026-11-26
---

# 母法三：非对称赔率与底账穿透

## 核心思考刀法

不听故事、不看表面大数字，永远做两层穿透：
1. **穿透底账（Ground Truth Only）**：把单方汇报、PPT、起诉状摘要全部当成不可信输入，直接钻到底层第三方不可篡改流水/日志对账——异常一定藏在边缘记录里。
2. **穿透真实净赔率（Net Realizable Payoff）**：纸面赢 1000 万但排在清偿队尾拿 0 元，不如今天改条件拿走 300 万现金。永远比较各互斥方案扣掉时间、摩擦和前顺位截留后的**净到手值**。

## 跨领域挂载投影

- **工程与量化风控**：线上事故只看数据库真实事务与网关原始日志；调度优化只看真实吞吐瓶颈而非表面忙碌。
- **商事法务挂载**：统摄 [[mm-03-evidence-log-hierarchy]]（证据三性与边缘凭证穿透）与 [[mm-05-waterfall-and-net-payoff]]（清偿抵充顺序与优先受偿瀑布）。
