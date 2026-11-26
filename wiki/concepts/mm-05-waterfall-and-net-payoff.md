---
id: mm-05-waterfall-and-net-payoff
type: concept
title: 清偿瀑布与净赔率：纸面赢一千万不如排在分钱第一顺位
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-03-asymmetric-payoff
edges:
  - rel: assimilates_into
    target: mos-03-asymmetric-payoff
  - rel: related_lens
    target: mm-02-obligation-vs-disposition
tags:
  - legal
  - waterfall
  - enforcement
related:
  - mos-03-asymmetric-payoff
  - mm-02-obligation-vs-disposition
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 清偿瀑布与净赔率：纸面赢一千万不如排在分钱第一顺位

## 挂入我的母法

直挂 [[mos-03-asymmetric-payoff]]：不看胜诉判决书上的面子数字，只算**资金清分瀑布流（Waterfall）**流到你这一层还剩几分钱真现金。

## 主帅必抓的 20% 胜负开关

1. **抢钱优先级阶梯**：`消费者买房人 > 建工承包人优先权 > 登记抵押权 > 税款 > 普通债主（排在最底层分残渣）`。跟重资产方交易没拿到前排顺位或实控人个人无限连带，赢了官司也可能是废纸。
2. **零散还款默认先扣利息**：没特别约定时，对方还的每一笔小钱依法按 `追讨费用 → 利息 → 本金` 顺序冲抵（剩余生息本金比直觉算出来的更高）。
3. **互斥打法算净值**：继续履约索赔逾期违约金 vs 解约退钱索赔差价，两套方案不能双要，必须先比扣完诉讼周期和执行折损后的净现值。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 多段 LPR 分段计息、违约金按实际损失 130% 调减的精确算术、多轮还款逐日冲抵 Excel 表，**100% 交给 AI 写 Python 脚本算**。

## 发散者易踩的 1 颗暗雷

签合同时觉得“我把违约金写到 50% 吓死他”，真出事才发现法院直接给你砍回实际损失附近，而对方核心资产早就抵押给银行了。
