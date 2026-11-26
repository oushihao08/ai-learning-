# Wiki & Knowledge Graph Schema — Jack Master-OS Edition

本规范同时兼容本机 **LLM Wiki 桌面端（`127.0.0.1:19828`）**、**Obsidian 双链图谱** 以及 `cli/learn.mjs` 编译生成的**有向语义知识图谱（`wiki/graph.json`）**。

---

## 一、为什么不用传统树状目录，而用「星系母法引力图谱」？

传统知识库按“学科 → 章节 → 小节”建树，对**思维发散、不按常理、习惯用同一套个人方法论解决所有事**的大脑有两个死穴：
1. 跨界奇招（如用技术限流解决法务尾款拖欠）在树状目录里无处安放；
2. 干完活顺手收割的零散知识点会沦为杂乱无章的孤儿笔记。

本图谱采用 **「中心恒星（Master-OS Hubs）+ 多环轨道（Concepts / Fault-Lines / Playbooks / Tripwires / Sparks）」星系拓扑**：
- 中心永远只有你自己的 **4 颗通用母法恒星（`mos-01` ~ `mos-04`）**；
- 不管是系统学的法务开关，还是某天改完 Bug、谈完合作派子 Agent 顺手收割的一条零散经验，**一律用有向语义边挂到这 4 颗母法恒星上**——打开图谱一眼就能看到不同领域的招数如何在同一个底层逻辑上共振。

---

## 二、节点类型（Page Types）

| `type` | 存放目录 | 图谱角色与颗粒度限制 |
| --- | --- | --- |
| `overview` | `wiki/overview.md` | 图谱总入口（全库唯一） |
| `master-os` | `wiki/master-os/` | **中心恒星**：Jack 自己的通用破局四步母法节点（高中心度引力核） |
| `concept` | `wiki/concepts/` | **20% 领域开关**：某领域专家底层透镜，强制包含「80% 甩给 AI 不抠的细节」熔断栏 |
| `fault-line` | `wiki/fault-lines/` | **高压对撞区**：两条规则正面冲突、聪明人凭直觉最易翻车的胜负手 |
| `playbook` | `wiki/playbooks/` | **一页破局武器卡**：10 分钟闯关或实战打赢后掉落的即用打法（拿来就能审合同/判题） |
| `tripwire` | `wiki/tripwires/` | **红队细节暗雷**：专替发散不抠细节的大脑盯防的“漏看一眼就炸”的一票否决点 |
| `spark` | `wiki/sparks/` | **零散实战火花**：日常完成任务后派发子 Agent 自动提炼接入的鲜活经验点 |

---

## 三、YAML Frontmatter 与有向语义边（Typed Edges）

所有 `wiki/<subdir>/*.md` 页面必须包含以下标准头部（天然兼容 LLM Wiki 桌面端索引与 `cli/learn.mjs` 图谱编译）：

```yaml
---
id: fl-02-unauthorized-guarantee-vs-apparent-authority
type: fault-line
title: 公司越权对外担保：真公章不等于有效兜底
domain: legal
mastery: mapped
confidence: 0.35
hubs:
  - mos-02-state-locks-and-gates
  - mos-03-asymmetric-payoff
edges:
  - rel: assimilates_into
    target: mos-02-state-locks-and-gates
  - rel: guards_against
    target: tw-01-chop-without-resolution
  - rel: related_lens
    target: mm-01-claim-basis-dispatch
tags:
  - legal
  - corporate
  - guarantee
related:
  - mos-02-state-locks-and-gates
  - mos-03-asymmetric-payoff
  - tw-01-chop-without-resolution
  - mm-01-claim-basis-dispatch
evidence_refs: []
created: 2026-11-26
updated: 2026-11-26
---
```

### 六种标准有向语义关系（`edges[].rel`）

| 关系名（`rel`） | 含义 | 典型连接方向 |
| --- | --- | --- |
| `assimilates_into` | 该领域规则/零散火花本质上归入哪颗个人母法恒星 | `concept / fault-line / spark -> master-os` |
| `collides_with` | 两个底层原则在哪个冲突区正面相撞 | `fault-line -> concept` |
| `guards_against` | 提示发散出招时必须由红队兜底的细节暗雷 | `playbook / spark / fault-line -> tripwire` |
| `unlocks_weapon` | 吃透该冲突或实战后锻造出的即用武器卡 | `fault-line / spark -> playbook` |
| `lateral_leap_to` | 跨领域非对称联想（如代码多签机制 ↔ 公司对外担保股东会决议） | 任意两跨领域节点互指 |
| `related_lens` | 同领域协同调用的判断开关 | `concept <-> concept / fault-line` |

---

## 四、实战导向的四种掌握状态（`mastery`）

| 状态值 | 含义 | 门禁要求（`cli/learn.mjs lint` 校验） |
| --- | --- | --- |
| `mapped` | Agent 预铺的 20% 关键地图，尚未经过你实战拍板 | 必须挂载至少 1 个 `mos-*` 母法节点（`master-os` 自身除外） |
| `probed` | 已在 5–10 分钟残局中交过手，定位了奇招亮点或细节暗雷 | `evidence_refs` 至少含 1 条 `projects/*/sessions/` 记录 |
| `weapon_unlocked` | 已用“三句话事前验尸”拍透命门，掉落一页武器卡 | `evidence_refs >= 1` 且无未核销暗雷锁（`retest_required: false`） |
| `battle_proven` | 你在真实工作/项目中亲手干成，由子 Agent 附真实凭证收割入库 | `evidence_refs` 至少引用 1 份 `raw/sources/` 或真实业务记录 |

---

## 五、单页防啰嗦与 20/80 深度熔断硬规则

1. **严禁长篇大论**：单页控制在 **40–90 行以内**，一眼扫完。
2. **`concept` 与 `fault-line` 必须包含四块**：
   - `挂入我的母法`（一句话说清对应哪颗 `[[mos-...]]` 恒星）；
   - `主帅必抓的 20% 胜负开关`（最多 3 条）；
   - `直接甩给 AI 干的 80% 细节（不必深学）`（明确划出深度禁区）；
   - `发散者易踩的 1 颗暗雷`（链接对应 `[[tw-...]]` 或写明一行红线）。
3. **每次改动同步**：更新 `wiki/index.md`、`wiki/log.md` 并重编译 `wiki/graph.json`（`learn.mjs harvest` / `record` / `build-graph` 自动完成）。
