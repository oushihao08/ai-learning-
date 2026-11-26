<!-- 文件职责：说明 /Users/jack/Documents/codes/lvgou/ai-learning/cli 下图谱编译、快赢记账与子 Agent 收割工具的命令契约。 -->
# 认知状态与星系知识图谱 CLI 说明（`cli/`）

适用对象：Jack 本人、`agent-learn` 快赢陪练 Agent，以及完成日常任务后被派发执行收割的 `Learning Graph Harvester` 子 Agent。

## 关键文件

| 文件 | 职责 |
| --- | --- |
| `learn.mjs` | 零第三方依赖 Node ESM 状态与图谱引擎：编译 `wiki/graph.json` 与 `wiki/index.md`、生成单局上下文、记录快赢战果掉卡、接收子 Agent 零散实战火花收割、执行全量门禁校验 |

## 命令参考

```sh
# 1. 查看战果总分板、母法恒星引力分布与立项进度
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs status [project] [--json]

# 2. 为一局 5-15 分钟快赢对练编译最优上下文（自由空降 + 暗雷优先 + 跨界联想）
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs context [project] [--minutes 8] [--topic <关键词>]

# 3. 查询或遍历有向语义知识图谱（按母法恒星或关键词检索跨界连接）
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs graph [--hub <mos-id>] [--query <关键词>] [--json]

# 4. 子 Agent 事后零散收割专用入口（一步写入 raw/sources + wiki/sparks + 刷新图谱与索引）
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs harvest \
  --slug sp-<slug> \
  --title "<标题>" \
  --domain <领域> \
  --hub <mos-01..04> \
  --takeaway "<20%可复用破局结论>" \
  [--tripwire-note "<顺手排掉的细节暗雷>"] \
  [--leap <跨界关联已有节点ID>] \
  [--source-summary "<刚干完的事实摘要>"] \
  [--evidence-ref "<外部文件或任务引用>"]

# 5. 快赢对练结算记账（支持同步铸造一页破局武器卡 pb-*）
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs record <project> \
  --node <node_id> \
  --verdict <lateral_breakthrough|calibrated_mastery|sharp_but_tripped|confident_blindspot> \
  --evidence <sessions/xxx.md> \
  [--note "<本局亮点或补丁>"] \
  [--playbook-id pb-<slug> --playbook-title "<武器卡名>" --playbook-points "<要点1|要点2|要点3>"]

# 6. 重编译 wiki/graph.json 与 wiki/index.md
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs build-graph

# 7. 新建其他领域的专项快赢立项
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs init <slug> --title "<名称>" --domain "<领域>" --goal "<目标>"

# 8. 全量门禁校验（无孤岛节点、强制挂载母法核、20/80 深度熔断栏、实证引用、双链闭合）
node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs lint
```

## 运行与安全边界

- 仅读写 `/Users/jack/Documents/codes/lvgou/ai-learning/` 内部文件；若检测到本机 `127.0.0.1:19828` LLM Wiki 桌面端已注册本项目，会在 `harvest` / `build-graph` 后尝试触发只读增量扫描通知（未开启或未注册时静默跳过，不报错）。
- 不修改任何外部业务仓库代码或数据库，不读取或输出任何密钥凭证。
