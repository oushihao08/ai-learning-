---
id: mm-02-obligation-vs-disposition
type: concept
title: 物债二分：签字答应你（Promise）不等于东西归了你（Commit）
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-02-state-locks-and-gates
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: related_lens
    target: mm-01-claim-basis-dispatch
  - rel: related_lens
    target: mm-05-waterfall-and-net-payoff
tags:
  - legal
  - property-vs-contract
related:
  - mos-02-state-locks-and-gates
  - mm-01-claim-basis-dispatch
  - mm-05-waterfall-and-net-payoff
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 物债二分：签字答应你（Promise）不等于东西归了你（Commit）

## 挂入我的母法

直挂 [[mos-02-state-locks-and-gates]]：完全等价于分布式系统里的**下单返回 `Promise`（签合同产生相对债权）**与**底层账本最终 `Commit`（过户/交付完成绝对物权或股权交割）**。

## 主帅必抓的 20% 胜负开关

1. **没过户 ≠ 合同废纸**：哪怕房子/股权没过户（没 Commit），只要买卖合同签得合法，这张 `Promise` 依然有效——正是凭它有效，你才能索赔违约金和差价损失。
2. **只签合同挡不住第三方查封**：钱付了但没走完法定过户/交付公示，一旦卖家破产或被别的债主查封，你大概率只能当普通债主排队分残渣，拿不走标的物。
3. **股权内外两道锁**：签了转股协议只管你们俩；进了股东名册才对公司生效；做完工商变更才对抗外部善意第三人。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 不动产物权期待权（《执行异议和复议规定》第 28/29 条）那四五个细碎认定条件、动产观念交付的学理分类，**统统不用记**；遇到查封争议时直接丢给 AI 逐条比对流水和占有凭证。

## 发散者易踩的 1 颗暗雷

谈收购、买资产、代持还原时，千万别觉得“协议签完字盖完章就稳了”——没把工商变更、账户共管或质押登记闭环锁死前，你的钱随时裸奔。

## 行话切口与防忽悠镇场

- **核心行话对译**：`物债二分/区分原则`（合同有效和过户成没成两码事）｜`物权期待权`（没过户但满足特定严苛条件能挡住别人法院查封的保命牌）｜`对抗善意第三人`（没做工商/抵押公示登记，不知情外人买走了你就干瞪眼）。
- **律师常见忽悠**：草拟完股权转让或资产收购协议收钱走人，却不设计“工商变更登记/权利交割与尾款共管绑定”的闭环动作。
- **老板一招试深浅**：「*协议签完到正式变更登记中间这半个月空窗期，如果对方资产被别的债主首封或者他一股二卖，你这份协议靠哪条锁保我的钱？*」
