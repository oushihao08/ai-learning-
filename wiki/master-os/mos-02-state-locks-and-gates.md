---
id: mos-02-state-locks-and-gates
type: master-os
title: 母法二：状态锁与不可逆闸门（区分答应与交割、盯死硬熔断）
domain: meta
mastery: battle_proven
confidence: 1.0
hubs: []
edges:
  - rel: related_lens
    target: mos-01-endgame-and-leverage
  - rel: related_lens
    target: mos-03-asymmetric-payoff
tags:
  - master-os
  - state-machine
  - gates
related:
  - mos-01-endgame-and-leverage
  - mos-03-asymmetric-payoff
  - mm-02-obligation-vs-disposition
  - mm-04-procedural-gates-and-time-locks
  - fl-01-pe-repurchase-vs-capital-reduction
  - fl-02-unauthorized-guarantee-vs-apparent-authority
evidence_refs:
  - raw/sources/2026-11-26-work-legal-sota-55pct.md
created: 2026-11-26
updated: 2026-11-26
---

# 母法二：状态锁与不可逆闸门

## 核心思考刀法

一切复杂系统本质上都是状态机。平庸者看表态，高手只盯**状态跃迁的硬锁**：
1. **Promise ≠ Commit**：对方签了字、接口返回 `202 Accepted`，不等于资产、控制权或数据真正完成了排他交割。
2. **内核级前置锁不可跳步**：哪些外部系统级门槛（如多签授权、前置审批、法定减资）没过，你手里的业务协议根本调不动底层资源？
3. **硬熔断死线（Hard Timeout）**：哪条时间线一旦跨过就物理清零、神仙难救？

## 跨领域挂载投影

- **工程与分布式架构**：两阶段提交、幂等锁、队列租约过期与不可续期熔断。
- **商事法务挂载**：直接统摄 [[mm-02-obligation-vs-disposition]]（物债二分）、[[mm-04-procedural-gates-and-time-locks]]（时效 vs 除斥期）、[[fl-01-pe-repurchase-vs-capital-reduction]]（对赌减资前置锁）与 [[fl-02-unauthorized-guarantee-vs-apparent-authority]]（担保股东会多签锁）。
- **发散者红队提醒**：发散思维最容易“重战略轻死线”，务必让 AI 参谋死盯 [[tw-01-chop-without-resolution]] 与 [[tw-02-hard-caducity-timeout]]。
