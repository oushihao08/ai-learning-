# Wiki & Knowledge Graph Schema — Jack Master-OS v4 (Panorama + Dual-Axis Edition)

本规范同时兼容本机 **LLM Wiki 桌面端（`127.0.0.1:19828`）**、**Obsidian 双链图谱** 以及 `cli/learn.mjs` 编译生成的**有向语义知识图谱（`wiki/graph.json`）**与领域全景账本（`projects/<slug>/{panorama,ledger}.json`）。

---

## 一、核心设计公式：横向 100% 全景无盲区 × 纵向四层止损 × 母法同化与顺应

为彻底解决“既要完整了解一个领域的一切事情，又绝不钻牛角尖学太深细节”的张力，系统将**广度**与**深度**正交解耦：
1. **横向广度 = 100% 全景战争迷雾地图（`panorama.json`）**：任何领域立项必须先铺开 MECE 全景版块（如法务八大版块，含刑民保命线与管律师防忽悠），杜绝“不知道自己不知道”的黑雾盲区。
2. **纵向深度 = 止步于“交互型专长 + 防骗元专长”，物理切除执业苦力层**：
   - `L0_unseen`（未知黑雾）→ `L1_panoramic`（知全貌与红灯信号）→ `L2_conversational`（懂核心行话底牌，能与专家平视对话）→ `L3_radar_and_bs_proof`（无提示看出业务隐患 + 识破专家欺骗/敷衍）→ `L4_mastered`（内化入母法并经真实业务验证）。
   - *执业苦力层（法条号默写、八股文书排版、多段复利精算）永久切除，100% 甩给 AI。*
3. **同化（Assimilation）+ 顺应（Accommodation）双轮保护**：能用商业/技术奇招破局处挂 `assimilates_into -> mos-*`；遇刑法、税法、除斥期等严禁野路子硬闯的高压墙，必须挂 **`breaks_intuition_of -> mos-*`** 警示止损！

---

## 二、节点类型（Page Types）

| `type` | 存放目录 | 图谱角色 |
| --- | --- | --- |
| `overview` | `wiki/overview.md` | 星系总览中心入口 |
| `master-os` | `wiki/master-os/` | **中心恒星**：Jack 四步通用破局母法引力核（`mos-01` ~ `mos-04`） |
| `concept` | `wiki/concepts/` | **20% 领域开关**：专家底层判断透镜（含 80% 甩给 AI 边界 + 行话防忽悠切口） |
| `fault-line` | `wiki/fault-lines/` | **高压对撞与禁区**：规则冲突胜负手或严禁野路子越界的公法/刑法红线 |
| `playbook` | `wiki/playbooks/` | **一页破局武器卡**：审合同、控专家、破残局的即战核查单 |
| `tripwire` | `wiki/tripwires/` | **红队细节暗雷**：专替发散大脑兜底的“漏看一眼就炸”的一票否决点 |
| `spark` | `wiki/sparks/` | **零散实战火花**：干完活后由子 Agent 自动提炼接入的跨界经验 |

---

## 三、七种标准有向语义边（`edges[].rel`）

| 关系名（`rel`） | 含义 |
| --- | --- |
| `assimilates_into` | 该领域规则可被哪颗个人母法恒星直接同化统摄 |
| `breaks_intuition_of` | **【母法物理边界墙】** 此处工程直觉或商业野路子失效/违法，必须强制顺应外部刚性规则 |
| `collides_with` | 两条有效原则在此冲突区正面碰撞 |
| `guards_against` | 发散出招时必须由红队参谋兜底的细节暗雷 |
| `unlocks_weapon` | 拆透冲突或实战后铸造出的即用武器卡 |
| `lateral_leap_to` | 跨领域非对称结构联想（如分布式租约锁 ↔ 物债二分） |
| `related_lens` | 同领域协同调用的判断透镜 |

---

## 四、双轴认知与心理接受度契约（`ledger.json`）

系统在不发任何调查问卷的前提下，从对话反应静默记录两个正交维度：

1. **认知深度轴（`depth`）**：`L0_unseen | L1_panoramic | L2_conversational | L3_radar_and_bs_proof | L4_mastered`
2. **心理接受与摩擦轴（`acceptance`）**：
   - `unassessed`：尚未交手
   - `embraced`：高度认同内化，主动迁移使用
   - `delegated_to_ai`：认同逻辑但反感亲自抠细节 → 转为 AI 守门清单，不再考细节
   - `friction_resistant`：**懂了但心里嫌重/别扭易反弹** → 停止法理说教，记录分级折中方案（`workaround`）并在实战中重点防漏
   - `skeptical_parked`：评估赔率后主动选择战略性跳过 → 尊重主帅风险偏好，不再唠叨

---

## 五、单卡内容硬门禁（`cli/learn.mjs lint` 强制校验）

1. 非 `master-os` / `overview` 节点必须至少挂载 1 个 `hubs: [mos-...]`（零孤岛）。
2. `concept` 与 `fault-line` 必须同时包含：
   - **`80%` 深度熔断栏**（明确哪些苦力细节甩给 AI 不学）；
   - **`行话` 切口栏**（提供 2–4 个与专业人士平视对话的核心行话翻译及防忽悠反问句）。
3. 后台子 Agent 纯文档提取默认记 `probed`（`L1_panoramic`），不冒充学习者本人已达 `L4_mastered`；唯有真实亲手决策或通过鉴谎/扫雷检验方可晋升高水位。
