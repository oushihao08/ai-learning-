---
id: fl-02-unauthorized-guarantee-vs-apparent-authority
type: fault-line
title: 公司对外担保大坑：法人亲手盖真公章，没审决议照样砍半或免责
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-02-state-locks-and-gates
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: collides_with
    target: mm-03-evidence-log-hierarchy
  - rel: guards_against
    target: tw-01-chop-without-resolution
tags:
  - legal
  - guarantee
  - corporate
related:
  - mos-02-state-locks-and-gates
  - mm-03-evidence-log-hierarchy
  - tw-01-chop-without-resolution
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 公司对外担保大坑：法人亲手盖真公章，没审决议照样砍半或免责

## 挂入我的母法

直挂 [[mos-02-state-locks-and-gates]]：普通买卖认单签（公章），唯独**“替别人担保兜底”在全国法律层面强制开启了多签（Multi-Sig：`真公章 + 合格股东会/董事会决议`）**。

## 主帅必抓的 20% 胜负开关

1. **替股东/实控人担保，必须看“扣除关联方后过半数”的股东会决议**：大股东自己举手通过或只拿董事会决议都没用；你不索要这份决议，法律直接判你“非善意”，担保无效！
2. **无效后的腰斩赔率**：一旦担保无效，担保公司最多只赔主债务人还不上部分的 **1/2（二分之一）**（如果是上市公司没发公开担保公告，上市公司 **0 元全免责**）。
3. **识别马甲担保**：合同名叫《差额补足承诺函》《共同还款协议》《到期流动性支持》，只要实质是无偿替别人兜底，统统按担保查决议。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 《公司法》第 15 条与《民法典担保制度解释》第 7–9、17 条的各种过错比例档次（1/2、1/3、全免）及非关联担保章程核查清单，收章前直接把章程和决议拍照丢给 AI 核验。

## 行话切口与防忽悠镇场

- **核心行话对译**：`关联担保 vs 非关联担保`（替股东/实控人担保必须走回避后的股东会决议）｜`形式审查义务`（债权人必须查看章程与决议表决比例才算善意）｜`债务加入/差额补足准用担保`（换马甲也逃不掉决议审查）。
- **律师常见忽悠**：审合同时只盯着把担保条款文字改得很凶狠，却在交割核查单里漏写“收齐对方章程及关联股东回避后的股东会决议原件”。
- **老板一招试深浅**：「*这家担保公司和借款方是同一个实控人——光盖真公章加上董事会决议够不够？表决权怎么扣才不会被判越权无效砍半？*」
