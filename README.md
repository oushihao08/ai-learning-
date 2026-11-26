<!-- 文件职责：/Users/jack/Documents/codes/lvgou/ai-learning 项目总览、全景双轴机制、四档微模式与目录导航。 -->
# AI-Learning (v4)：母法驱动的全景破局与星系知识图谱

独立项目路径：`/Users/jack/Documents/codes/lvgou/ai-learning`  
配套导学 Skill 唯一源码：[`skills/agent-learn/SKILL.md`](skills/agent-learn/SKILL.md)（`~/.agents/skills/agent-learn` 与 `~/.codex/skills/agent-learn` 均软链至此）

经**脑科学、AI 系统架构、学习与专长科学**三路专家 Agent 联合审阅升级（见 [`docs/04-三路专家Agent评审与架构复判升级记录.md`](docs/04-三路专家Agent评审与架构复判升级记录.md)），系统专为**发散跳跃、追求高效率、反感抠苦力细节、习惯用自身母法解决一切问题**的构建者打造：
- **横向 100% 全景无盲区 × 纵向止步主帅层**：新领域必先铺开 MECE 全景战争迷雾地图（`panorama.json`），让你完整知晓该领域一切事情；同时物理切除法条背诵/文书拉表等 80% 苦力层，全部甩给 AI。
- **静默记录「认知深度 × 心理接受度」双轴账本**：不发任何调查表，自动记录每块版图处于 `L0黑雾 → L1知全貌 → L2能与专家平视对话 → L3自主看坑&识破忽悠 → L4母法统摄`，以及你是**认同内化、嫌烦外包给 AI、还是直觉排斥（自动切换风险阈值折中方案）**。
- **日常干活 0% 打扰**：普通提问、查依据、写代码绝不误触发反问；仅显式点名开启，随时说“直接给结论”秒退。

---

## 一、完整目录结构

```text
/Users/jack/Documents/codes/lvgou/ai-learning/
├── AGENTS.md                                   # 协作铁律：双模硬隔离、全景100%×深度20%、双轴静默记账
├── README.md                                   # 项目总览与四档微模式操作手册
├── purpose.md                                  # LLM Wiki 原生项目定义（可直接被本机 LLM Wiki 桌面端加载）
├── schema.md                                   # v4 星系图谱与双轴规范（含 breaks_intuition_of 公法/刑法止损墙）
├── raw/sources/                                # 原始战果与外部语料切片（供子 Agent 收割存档）
├── wiki/                                       # 全局统一星系知识图谱（跨领域交汇，零孤岛）
│   ├── overview.md                             # 星系总览中心入口
│   ├── index.md                                # 自动编译的全量分类目录索引
│   ├── log.md                                  # 认知演进与子 Agent 收割时间线
│   ├── graph.json                              # 有向语义图谱（Nodes + 7类 Typed Edges + 母法引力与止损墙统计）
│   ├── master-os/                              # 【中心恒星】你的四步通用破局母法（mos-01 ~ mos-04）
│   ├── concepts/                               # 【20%开关】领域底层透镜（含 80% 甩给 AI + 行话防忽悠切口）
│   ├── fault-lines/                            # 【高压冲突与禁区】规则对撞胜负手与严禁野路子越界的刑民/公法墙
│   ├── playbooks/                              # 【即战武器】审合同、识别假专业与控外聘律师的一页武器卡
│   ├── tripwires/                              # 【红队防雷】专替发散大脑兜底的致命细节暗雷卡
│   └── sparks/                                 # 【零散火花】干完活后由子 Agent 自动提炼接入的跨界经验
├── learner/                                    # 个人认知画像（profile.json）与全局摩擦/战果态势（cognitive-state.json）
├── projects/                                   # 专项领域立项管理
│   └── jack-legal/                             # 内部立项 01：Jack 学习法务（八大洲全景防骗实战）
│       ├── README.md                           # 八大洲版图、双轴追踪说明与四档玩法入口
│       ├── project.json                        # 立项配置与 ../ai-distill 只读语料锚点
│       ├── panorama.json                       # 100% 商事法务八大洲 MECE 全景地图（含行话切口与律师忽悠套路）
│       ├── ledger.json                         # 版块+节点级「认知深度 × 心理接受度」双轴进度账本
│       └── sessions/2026-11-26-fast-win-arena.md # 首轮多维演武场（律师鉴谎局 / 原生态X光扫雷 / 母法破残局）
├── cli/                                        # 零依赖全景、双轴与图谱状态引擎（learn.mjs）
├── skills/agent-learn/                         # Skill 唯一维护源码（全局 ~/.agents/skills/agent-learn 软链指向此处）
└── docs/                                       # 立项文档区（01 原视频拆解 / 02 全球调研 / 03 架构方案 / 04 三专家Agent复判记录）
```

---

## 二、日常最爽快的五句口令

1. **全景开图扫黑雾（3 分钟点亮一块未知版图）**  
   `用 agent-learn 带我 3 分钟扫亮 jack-legal 的全景黑雾`
2. **练防忽悠：审油滑律师意见（3 分钟鉴谎镇场）**  
   `用 agent-learn 来一局 jack-legal 律师鉴谎局`
3. **练真眼力：无提示业务切片 X 光扫雷（2 分钟）**  
   `用 agent-learn 给我来一段无提示法务 X 光扫雷`
4. **干完活顺手派子 Agent 收割零散经验入图谱（后台免打扰）**  
   `用 agent-learn 派个子 agent 把刚才干完的事提炼进我的学习图谱`
5. **新开任意其他领域的 100% 全景立项**  
   `用 agent-learn 新建学习立项 jack-<领域>，我要完整摸透它并能防行家忽悠`

---

## 三、CLI 状态雷达与门禁命令

```sh
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs status
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs context jack-legal --mode auto
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs lint
```
