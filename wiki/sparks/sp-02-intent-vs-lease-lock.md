---
id: sp-02-intent-vs-lease-lock
type: spark
title: 实战火花 02：共享业务意图与实际执行锁分离（队列防撞车 ↔ 合同物债二分）
domain: agent-arch
mastery: battle_proven
confidence: 0.9
hubs:
  - mos-02-state-locks-and-gates
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: lateral_leap_to
    target: mm-02-obligation-vs-disposition
tags:
  - spark
  - agent-arch
related:
  - mos-02-state-locks-and-gates
  - mm-02-obligation-vs-disposition
evidence_refs:
  - raw/sources/2026-11-26-sp-02-intent-vs-lease-lock.md
created: 2026-11-26
updated: 2026-11-26
---

# 实战火花 02：共享业务意图与实际执行锁分离（队列防撞车 ↔ 合同物债二分）

## 挂入我的母法

直挂 [[mos-02-state-locks-and-gates]]，跨界联动 [[mm-02-obligation-vs-disposition]]。

## 20% 跨界可复用破局点

在多机并发调度中，全局库只记『想办什么（waiting 意图/Promise）』，真正谁抢到执行权只看本机原子锁（Commit）；这与商事法务中『签了买卖合同只算债权意图，做完过户登记才算拿到排他物权锁』在底层状态机上完全同构。

## 顺手排掉的细节暗雷

- 严禁把全局共享表里的 waiting 状态误判成正在执行或永久死锁，恰如不能把一份未过户合同误当成已完成产权交割。
