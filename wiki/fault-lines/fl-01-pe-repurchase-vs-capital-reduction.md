---
id: fl-01-pe-repurchase-vs-capital-reduction
type: fault-line
title: 对赌股权回购生死门：目标公司没走完减资，赢了合同也拿不到钱
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-02-state-locks-and-gates
  - mos-04-lateral-restructure
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: assimilates_into
    target: mos-04-lateral-restructure
  - rel: collides_with
    target: mm-01-claim-basis-dispatch
  - rel: guards_against
    target: tw-02-hard-caducity-timeout
tags:
  - legal
  - pe-vc
  - corporate
related:
  - mos-02-state-locks-and-gates
  - mos-04-lateral-restructure
  - mm-01-claim-basis-dispatch
  - tw-02-hard-caducity-timeout
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 对赌股权回购生死门：目标公司没走完减资，赢了合同也拿不到钱

## 挂入我的母法

直挂 [[mos-02-state-locks-and-gates]] + [[mos-04-lateral-restructure]]：普通商业协议（User Space）撞上了《公司法》保护外部债主的内核态硬锁（Kernel Lock）。

## 主帅必抓的 20% 胜负开关

1. **告创始人 vs 告目标公司冰火两重天**：让创始人个人掏钱回购，法院直接判给钱；但让**目标公司**掏钱回购，只要公司没走完三分之二股东会减资决议 + 45 天债权人公告（而创始人捏着大股根本不会配合你开会！），法院认定“一时履行不能”，**直接驳回要钱诉请**。
2. **6 个月行权死线锁**：没写行权期时，触发回购条件后拖过合理期间（实务主流看 **6 个月**）才正式发函，回购权可能直接作废（见 [[tw-02-hard-caducity-timeout]]）。
3. **升维改规矩破局**：签约时别迷信“目标公司连带回购”四个字，直接改成**创始人个人回购 + 绑定“拒不配合减资决议的高额个人违约金”或预签股权质押**，直接绕开减资死锁。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 《九民纪要》第 5 条原文、减资公告登报流程、历年现金分红扣减与单复利折算公式，全交 AI 处理。
