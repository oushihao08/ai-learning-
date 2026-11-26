<!-- 文件职责：说明 /Users/jack/Documents/codes/lvgou/ai-learning/cli 下 v4 全景、双轴与图谱状态引擎的命令契约。 -->
# 全景认知、双轴状态与星系知识图谱 CLI 说明（`cli/`）

适用对象：Jack 本人、`agent-learn` 导学 Agent 及后台 `Learning Graph Harvester` 子 Agent。

## 核心命令

```sh
# 1. 查看全景版图亮灯率（L0黑雾..L4统摄）、心理接受度分布、母法引力与防骗战果
node cli/learn.mjs status [project] [--json]

# 2. 智能编译下一局微模式上下文（自动识别 L0黑雾版块 / 排斥易反弹节点 / 鉴谎或X光扫雷晋升）
node cli/learn.mjs context [project] [--mode auto|panorama|sparring|bullshit-audit|xray] [--minutes 8] [--sector <sec_id>] [--topic <kw>]

# 3. 检索有向语义知识图谱（含 breaks_intuition_of 母法止损墙）
node cli/learn.mjs graph [--hub <mos-id>] [--query <关键词>] [--json]

# 4. 结算四档微模式战果，原子更新认知深度 × 心理接受度双轴账本（支持高水位保护与武器卡掉落）
node cli/learn.mjs record <project> \
  [--node <node_id>] [--sector <sec_id>] \
  --verdict <panorama_mapped|lateral_breakthrough|calibrated_mastery|bullshit_exposed|xray_spotted|sharp_but_tripped|confident_blindspot|fooled_by_jargon> \
  [--depth <L1_panoramic..L4_mastered>] \
  [--acceptance <embraced|delegated_to_ai|friction_resistant|skeptical_parked>] \
  [--stance-note "<接受或抵触的具体原因>"] \
  [--workaround "<高排斥节点的分级阈值折中方案>"] \
  [--tripwire <tw_id>] \
  --evidence <sessions/xxx.md>

# 5. 后台子 Agent 事后零散收割入口（--human-verified 区分亲手实战 L4 与文档提取 L1）
node cli/learn.mjs harvest --slug sp-<id> --title "<标题>" --domain <d> --hub <mos-id> --takeaway "<结论>" [--project <p> --sector <s>] [--human-verified]

# 6. 重编译 wiki/graph.json 与 wiki/index.md / 挂载全局软链 / 全量门禁校验
node cli/learn.mjs build-graph
node cli/learn.mjs link-skill
node cli/learn.mjs lint
```
