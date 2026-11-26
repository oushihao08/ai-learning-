---
id: tw-01-chop-without-resolution
type: tripwire
title: 红队暗雷 01：只验真公章，漏要回避表决后的股东会决议
domain: legal
mastery: mapped
confidence: 0.40
hubs:
  - mos-02-state-locks-and-gates
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: related_lens
    target: fl-02-unauthorized-guarantee-vs-apparent-authority
tags:
  - tripwire
  - red-team
  - corporate
related:
  - mos-02-state-locks-and-gates
  - fl-02-unauthorized-guarantee-vs-apparent-authority
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 红队暗雷 01：只验真公章，漏要回避表决后的股东会决议

- **发散者为什么会踩**：谈妥大局后觉得“老板本人都签字盖真章了，还折腾啥形式主义纸片”。
- **踩爆后果**：凡涉及他方公司提供担保、债务加入、差额补足，缺合格决议直接导致担保无效，赔付上限从 100% 瞬间腰斩到 ≤50% 甚至 0%。
- **10 秒防雷动作**：只要合同里出现“第三家公司替对方兜底”，强制让经办人收齐 **公司章程 + 适格股东会/董事会决议** 丢给 AI 核对表决权比例。
