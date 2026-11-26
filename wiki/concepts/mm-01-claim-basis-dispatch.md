---
id: mm-01-claim-basis-dispatch
type: concept
title: 请求权基础：先锁哪条规则能直接给你要来钱
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-01-endgame-and-leverage
edges:
  - rel: assimilates_into
    target: mos-01-endgame-and-leverage
  - rel: related_lens
    target: mm-02-obligation-vs-disposition
  - rel: related_lens
    target: mm-04-procedural-gates-and-time-locks
tags:
  - legal
  - claim-basis
related:
  - mos-01-endgame-and-leverage
  - mm-02-obligation-vs-disposition
  - mm-04-procedural-gates-and-time-locks
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---

# 请求权基础：先锁哪条规则能直接给你要来钱

## 挂入我的母法

直挂 [[mos-01-endgame-and-leverage]]：像后端 API 路由鉴权一样，不喊委屈，第一秒先锁死**「谁 → 找谁 → 调哪条合同/法律接口 → 拿什么结果」**。

## 主帅必抓的 20% 胜负开关

1. **接口必须选准**：同一个损失，走“合同违约”、“债权人撤销权”还是“代位析产”，对应的管辖法院、举证难度和能拿回的金额天差地别；选错入口直接被驳回。
2. **要件缺一即挂**：每条规则就是一组必填参数（`Input Schema`），缺一个参数（比如告违约却没证明自己已先履约），整个请求直接 `400` 失败。
3. **预判对方拦截器**：出招前先问一句对方手里有没有“已抵销、已解除、未届期、过时效”四个阻断开关。

## 直接甩给 AI 干的 80% 细节（不必深学）

- 具体是《民法典》第几百几十条、司法解释文号是什么，**绝不用背**；
- 确定好“我要向谁主张什么”后，直接让 AI 按 `合同约定 → 物权返还 → 不当得利 → 侵权` 顺序给你拉出候选条文与要件核对表。

## 发散者易踩的 1 颗暗雷

代码调错接口改一行重发就行；官司选错案由败诉后，可能撞上“一事不再理”或错过 [[tw-02-hard-caducity-timeout]] 再也没法重来。

## 行话切口与防忽悠镇场

- **核心行话对译**：`请求权竞合`（违约和侵权两条路由同时通，但只能二选一不能双倍拿钱）｜`主体适格`（原被告找没找对人，穿透不了合同相对性就直接驳回）｜`抗辩权`（对方合法拖延或拒付的免死金牌）。
- **律师常见忽悠**：上来拍胸脯说“对方明显不讲理，咱们直接告他侵权赔偿”，却不核对是否存在有效合同排斥或选错请求权导致少赔一半。
- **老板一招试深浅**：「*这事咱们到底走违约、侵权还是不当得利？选这条路由比起另外两条，管辖法院、举证难度和能算出来的最高赔偿额分别差多少？*」
