---
id: pb-01-ai-legal-55pct-radar
type: playbook
title: 武器卡 01：30 秒看穿 AI 法务方案“假专业”的五眼雷达
domain: legal
mastery: battle_proven
confidence: 0.90
hubs:
  - mos-03-asymmetric-payoff
  - mos-04-lateral-restructure
edges:
  - rel: assimilates_into
    target: mos-03-asymmetric-payoff
  - rel: assimilates_into
    target: mos-04-lateral-restructure
  - rel: lateral_leap_to
    target: sp-01-why-sota-models-fail-real-law
  - rel: guards_against
    target: tw-02-hard-caducity-timeout
tags:
  - playbook
  - weapon-card
  - ai-distill
  - legal-qa
related:
  - mos-03-asymmetric-payoff
  - mos-04-lateral-restructure
  - sp-01-why-sota-models-fail-real-law
  - mm-03-evidence-log-hierarchy
  - tw-02-hard-caducity-timeout
evidence_refs:
  - raw/sources/2026-11-26-work-legal-sota-55pct.md
created: 2026-11-26
updated: 2026-11-26
---

# 武器卡 01：30 秒看穿 AI 法务方案“假专业”的五眼雷达

**即战用途**：审 `ai-distill` 法律题包/模型答卷，或看外聘律师/AI 写的合同意见书时，不用读完几千字，只扫这 5 眼：

1. **一眼查顺从讨好**：委托人提的无理/越界诉求（比如跳过公司减资直接要回购款），方案是**果断纠偏拦住**，还是顺着老板心意硬写诉状送死？
2. **二眼查底账穿透**：核心金额和起算日，是直接照抄主合同/诉状汇总表，还是核对到了**银行流水冲正、退票回执、送达签收单**等边缘原件？
3. **三眼查死线与新旧法**：行为发生在修法前还是修法后？有没有漏算不可续命的**除斥期间**（见 [[tw-02-hard-caducity-timeout]]）？
4. **四眼查清偿顺序**：多笔部分还款有没有去重并按 `费用 → 利息 → 本金` 冲抵？赢了之后排在优先权瀑布第几层？
5. **五眼查落地四要素**：建议是不是“建议尽快协商、及时补强证据”这种正确废话？真能用的指令必须含齐**「谁 + 在哪天前 + 拿什么材料 + 干哪个具体动作」**。
