<!-- 文件职责：/Users/jack/Documents/codes/lvgou/ai-learning 项目总览、双通道操作手册与目录导航。 -->
# AI-Learning：个人母法驱动的跨界快赢与星系知识图谱

独立项目路径：`/Users/jack/Documents/codes/lvgou/ai-learning`  
配套全局门控 Skill：[`/Users/jack/.agents/skills/agent-learn/SKILL.md`](file:///Users/jack/.agents/skills/agent-learn/SKILL.md)（软链同步至 `~/.codex/skills/agent-learn`）

专为**追求高效率、反感钻牛角尖学太深、急见战果、习惯用自身母法解决一切问题、思维发散不按常理**的实战型构建者设计：
- **日常干活零打扰**：普通提问、查依据、写代码绝不误触发陪练反问；仅显式点名才开启，随时可秒退。
- **主帅 20/80 深度熔断**：只抓决定 80% 输赢的 20% 胜负手开关，把法条背诵、八股文书和繁琐精算 100% 甩给 AI。
- **双通道复利**：既支持 **5–10 分钟快赢闯关掉武器卡**（如 `jack-legal` 法务立项），又支持 **干完活后派发子 Agent 自动收割零散经验点** 汇入同一张星系 LLM Wiki 知识图谱。

---

## 一、完整目录结构

```text
/Users/jack/Documents/codes/lvgou/ai-learning/
├── AGENTS.md                                   # 协作铁律：双模硬隔离、20/80深度熔断、发散奇招+红队防雷
├── README.md                                   # 项目总览与双通道使用指南
├── purpose.md                                  # LLM Wiki 原生项目定义（可直接被 LLM Wiki 桌面端加载）
├── schema.md                                   # 星系母法图谱规范（节点类型、6种有向语义边、4级实证状态）
├── raw/sources/                                # 原始战果与外部语料切片（供子 Agent 收割存档）
├── wiki/                                       # 全局统一星系知识图谱（跨领域交汇，零孤岛）
│   ├── overview.md                             # 星系总览中心入口
│   ├── index.md                                # 自动编译的全量分类目录索引
│   ├── log.md                                  # 战果解锁与子 Agent 收割时间线
│   ├── graph.json                              # 机器可遍历的有向语义图谱（Nodes + Typed Edges + 母法引力统计）
│   ├── master-os/                              # 【中心恒星】你的四步通用破局母法（mos-01 ~ mos-04）
│   ├── concepts/                               # 【20%开关】领域底层决策透镜（含 80% 甩给 AI 的边界栏）
│   ├── fault-lines/                            # 【高压冲突】聪明人最易翻车的规则对撞区
│   ├── playbooks/                              # 【即战武器】一页破局武器卡（每赢一局即时掉落）
│   ├── tripwires/                              # 【红队防雷】专替发散大脑兜底的致命细节暗雷卡
│   └── sparks/                                 # 【零散火花】完成工作后由子 Agent 自动提炼接入的跨界经验
├── learner/                                    # 个人认知与战果中心（profile.json + cognitive-state.json）
├── projects/                                   # 专项闯关立项管理
│   └── jack-legal/                             # 内部立项 01：Jack 学习法务（只读联动 ../ai-distill 法律资产）
│       ├── README.md                           # 法务 20/80 清单与开局入口
│       ├── project.json                        # 立项配置与外部语料锚点
│       ├── arenas.json                         # 4 大自由空降战区（无前置串行锁）
│       ├── ledger.json                         # 逐节点战果与红队复测账本
│       └── sessions/2026-11-26-fast-win-arena.md # 首轮 5 分钟快赢擂台（3 个真金白银商业残局）
├── cli/                                        # 零依赖状态与图谱引擎（learn.mjs）
├── skills/agent-learn/                         # 随仓归档的导学与收割 Skill 模板（本机运行源位于 ~/.agents/skills/agent-learn）
└── docs/                                       # 立项研究与架构文档区（01 原视频拆解 / 02 全球调研与变体 / 03 完整方案）
```

---

## 二、最常用的三句口令

1. **5 分钟刷一局法务快赢**  
   `用 agent-learn 来一局 jack-legal 快赢`（或直接看 [2026-11-26-fast-win-arena.md](projects/jack-legal/sessions/2026-11-26-fast-win-arena.md) 挑 A/B/C 拍板）
2. **干完活顺手派子 Agent 收割零散经验入图谱**  
   `用 agent-learn 派个子 agent 把刚才干完的这件事提炼进我的学习图谱`
3. **新开任意其他领域的快赢立项**  
   `用 agent-learn 新建学习立项 jack-<领域>，我要解决 <具体目标>`

---

## 三、命令行图谱与进度速查

```sh
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs status
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs graph --hub mos-02-state-locks-and-gates
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs lint
```
