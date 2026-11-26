---
id: fl-03-deemed-acceptance-vs-fundamental-breach
type: fault-line
title: 软件与AI项目尾款战：“逾期视为验收合格”撞上“主功能烂尾”
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-04-lateral-restructure
  - mos-03-asymmetric-payoff
edges:
  - rel: assimilates_into
    target: mos-04-lateral-restructure
  - rel: assimilates_into
    target: mos-03-asymmetric-payoff
  - rel: collides_with
    target: mm-03-evidence-log-hierarchy
  - rel: guards_against
    target: tw-03-self-help-cut-without-clause
tags:
  - legal
  - software-contract
  - acceptance
related:
  - mos-04-lateral-restructure
  - mos-03-asymmetric-payoff
  - mm-03-evidence-log-hierarchy
  - tw-03-self-help-cut-without-clause
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 软件与AI项目尾款战：“逾期视为验收合格”撞上“主功能烂尾”

## 挂入我的母法

直挂 [[mos-04-lateral-restructure]] + [[mos-03-asymmetric-payoff]]：靠一纸“10 天不回函视为合格”打官司追尾款是下策，**前置收款结构 + 预埋合规降级开关 + 完整提测签收链**才是真胜负手。

## 主帅必抓的 20% 胜负开关

1. **倒计时启动有前提**：乙方漏交了合同清单里的源码或文档，连“10 天默示验收倒计时”都根本没启动！
2. **群聊提 P0 Bug 能击穿“未盖章回函”**：只要甲方在飞书/微信群持续指出核心流程跑不通，法院通常认实质异议；只有甲方已经真切流量商用赚钱了、只拿边角 UI 挑刺赖账时，“视为合格”才真正发威。
3. **野路子升维打法**：别把大头压在最后验收款！按里程碑拆高首付与上线前款，并在合同里白纸黑字写明**“逾期付款超 N 日，乙方有权自动切换系统为只读/停用 API 且不承担违约责任”**（避开 [[tw-03-self-help-cut-without-clause]]）。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 提测通知函标准措辞、UAT 缺陷分级映射表、工作量折算退费鉴定口径，全由 AI 生成核对。
