#!/usr/bin/env node
/**
 * 文件职责：ai-learning 认知进度管理、星系母法知识图谱编译与子 Agent 实战收割引擎。
 * 主要公开入口：
 *   - status [project] [--json]：输出战果计分板、母法恒星节点中心度、武器卡与立项掌握分布
 *   - context [project] [--minutes N] [--topic K]：为快赢对练编译候选残局节点、关联暗雷与跨界联想边
 *   - graph [--hub mos-id] [--query kw] [--json]：检索与遍历有向语义知识图谱（wiki/graph.json）
 *   - harvest ...：供事后派发的子 Agent 将刚完成的零散实战经验一键写入 raw/sources + wiki/sparks 并刷新图谱
 *   - record <project> ...：结算快赢对练结果、更新 ledger/cognitive-state 并在通关时自动铸造一页武器卡
 *   - build-graph：扫描 wiki/**.md 生成 wiki/graph.json 与 wiki/index.md
 *   - init <slug> ...：初始化新领域快赢立项
 *   - link-skill：将本仓库 skills/agent-learn 软链接挂载至 ~/.agents/skills 与 ~/.codex/skills
 *   - lint：强制校验母法挂载（零孤岛）、20/80 深度熔断栏、双链闭合与实证门禁
 * 调用方：用户终端、skills/agent-learn 主 Agent 及 Learning Graph Harvester 子 Agent。
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, statSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const WIKI_DIR = join(ROOT_DIR, "wiki");
const RAW_SOURCES_DIR = join(ROOT_DIR, "raw", "sources");
const LEARNER_DIR = join(ROOT_DIR, "learner");
const PROJECTS_DIR = join(ROOT_DIR, "projects");

const WIKI_BUCKETS = [
  { dir: "master-os", type: "master-os", label: "中心恒星：通用破局母法（Master OS）" },
  { dir: "concepts", type: "concept", label: "20% 领域底层开关（Concepts）" },
  { dir: "fault-lines", type: "fault-line", label: "高压规则对撞区（Fault Lines）" },
  { dir: "playbooks", type: "playbook", label: "一页破局武器卡（Playbooks）" },
  { dir: "tripwires", type: "tripwire", label: "发散者红队防雷卡（Tripwires）" },
  { dir: "sparks", type: "spark", label: "日常实战零散火花（Harvested Sparks）" },
];

const VALID_TYPES = new Set(["overview", ...WIKI_BUCKETS.map((b) => b.type)]);
const VALID_MASTERY = new Set(["mapped", "probed", "weapon_unlocked", "battle_proven"]);
const VALID_VERDICTS = new Set([
  "lateral_breakthrough",
  "calibrated_mastery",
  "sharp_but_tripped",
  "confident_blindspot",
]);

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--json" || token === "--help" || token === "-h") {
      flags[token.replace(/^-+/, "")] = true;
    } else if (token.startsWith("--")) {
      const key = token.slice(2);
      const val = argv[i + 1];
      if (val === undefined || val.startsWith("--")) {
        throw new Error(`参数 --${key} 缺少取值`);
      }
      flags[key] = val;
      i += 1;
    } else {
      positional.push(token);
    }
  }
  return { positional, flags };
}

function parseFrontmatter(markdown, filePath) {
  const lines = markdown.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { error: `${filePath}: 缺少起始 YAML Frontmatter` };
  }
  const endIdx = lines.findIndex((line, idx) => idx > 0 && line.trim() === "---");
  if (endIdx === -1) {
    return { error: `${filePath}: YAML Frontmatter 未闭合` };
  }
  const meta = {};
  let currentKey = null;
  let currentEdge = null;

  for (let i = 1; i < endIdx; i += 1) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;

    if (currentKey === "edges") {
      const edgeStart = raw.match(/^\s*-\s+rel:\s*(.+)$/);
      if (edgeStart) {
        currentEdge = { rel: edgeStart[1].trim().replace(/^['"]|['"]$/g, ""), target: "" };
        meta.edges.push(currentEdge);
        continue;
      }
      const edgeTarget = raw.match(/^\s+target:\s*(.+)$/);
      if (edgeTarget && currentEdge) {
        currentEdge.target = edgeTarget[1].trim().replace(/^['"]|['"]$/g, "");
        continue;
      }
    }

    const listItem = raw.match(/^\s*-\s+(.+)$/);
    if (listItem && currentKey && currentKey !== "edges") {
      meta[currentKey].push(listItem[1].trim().replace(/^['"]|['"]$/g, ""));
      continue;
    }

    const kv = raw.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    const val = rawVal.trim();
    currentEdge = null;
    if (val === "[]") {
      meta[key] = [];
      currentKey = null;
    } else if (val === "") {
      meta[key] = [];
      currentKey = key;
    } else {
      currentKey = null;
      const clean = val.replace(/^['"]|['"]$/g, "");
      if (clean === "true") meta[key] = true;
      else if (clean === "false") meta[key] = false;
      else if (/^-?\d+(\.\d+)?$/.test(clean)) meta[key] = Number(clean);
      else meta[key] = clean;
    }
  }

  const body = lines.slice(endIdx + 1).join("\n");
  return { meta, body };
}

function serializeFrontmatter(meta, body) {
  const lines = ["---"];
  const scalarOrder = ["id", "type", "title", "domain", "mastery", "confidence"];
  for (const k of scalarOrder) {
    if (meta[k] !== undefined) {
      const v = typeof meta[k] === "string" && /[:#[\]]/.test(meta[k]) ? `"${meta[k]}"` : meta[k];
      lines.push(`${k}: ${v}`);
    }
  }
  const writeList = (key, arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      lines.push(`${key}: []`);
      return;
    }
    lines.push(`${key}:`);
    for (const item of arr) lines.push(`  - ${item}`);
  };
  writeList("hubs", meta.hubs || []);
  if (Array.isArray(meta.edges) && meta.edges.length > 0) {
    lines.push("edges:");
    for (const e of meta.edges) {
      lines.push(`  - rel: ${e.rel}`);
      lines.push(`    target: ${e.target}`);
    }
  } else {
    lines.push("edges: []");
  }
  writeList("tags", meta.tags || []);
  writeList("related", meta.related || []);
  writeList("evidence_refs", meta.evidence_refs || []);
  lines.push(`created: ${meta.created || new Date().toISOString().slice(0, 10)}`);
  lines.push(`updated: ${meta.updated || new Date().toISOString().slice(0, 10)}`);
  lines.push("---");
  return `${lines.join("\n")}\n${body.startsWith("\n") ? body : `\n${body}`}`;
}

function scanAllWikiPages() {
  const pages = [];
  const overviewPath = join(WIKI_DIR, "overview.md");
  if (existsSync(overviewPath)) {
    const content = readFileSync(overviewPath, "utf8");
    pages.push({
      slug: "overview",
      bucket: ".",
      relPath: "wiki/overview.md",
      fullPath: overviewPath,
      content,
      parsed: parseFrontmatter(content, overviewPath),
    });
  }
  for (const bucket of WIKI_BUCKETS) {
    const dirPath = join(WIKI_DIR, bucket.dir);
    if (!existsSync(dirPath)) continue;
    for (const file of readdirSync(dirPath).sort()) {
      if (!file.endsWith(".md")) continue;
      const fullPath = join(dirPath, file);
      const slug = basename(file, ".md");
      const content = readFileSync(fullPath, "utf8");
      pages.push({
        slug,
        bucket: bucket.dir,
        expectedType: bucket.type,
        relPath: `wiki/${bucket.dir}/${file}`,
        fullPath,
        content,
        parsed: parseFrontmatter(content, fullPath),
      });
    }
  }
  return pages;
}

function extractFirstLineSummary(body) {
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("---"));
  const first = lines[0] || "";
  return first.replace(/\*\*/g, "").slice(0, 90);
}

function buildKnowledgeGraph() {
  const pages = scanAllWikiPages();
  const nodes = [];
  const edgeMap = new Map();

  for (const p of pages) {
    if (p.parsed.error) continue;
    const { meta, body } = p.parsed;
    nodes.push({
      id: p.slug,
      type: meta.type,
      title: meta.title,
      domain: meta.domain || "general",
      mastery: meta.mastery || "mapped",
      confidence: Number(meta.confidence ?? 0.35),
      hubs: Array.isArray(meta.hubs) ? meta.hubs : [],
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      path: p.relPath,
      summary: extractFirstLineSummary(body),
      degree: 0,
    });

    for (const e of Array.isArray(meta.edges) ? meta.edges : []) {
      if (!e.target) continue;
      const key = `${p.slug}::${e.rel}::${e.target}`;
      edgeMap.set(key, { source: p.slug, target: e.target, rel: e.rel, explicit: true });
    }
    const wikiRefs = [...body.matchAll(/\[\[([a-zA-Z0-9_-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1]);
    for (const target of wikiRefs) {
      if (target === p.slug) continue;
      const hasExplicit = [...edgeMap.values()].some((x) => x.source === p.slug && x.target === target);
      if (!hasExplicit) {
        const key = `${p.slug}::mentions::${target}`;
        edgeMap.set(key, { source: p.slug, target, rel: "mentions", explicit: false });
      }
    }
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges = [...edgeMap.values()].filter((e) => nodeById.has(e.source) && nodeById.has(e.target));
  for (const e of edges) {
    nodeById.get(e.source).degree += 1;
    nodeById.get(e.target).degree += 1;
  }

  const graph = {
    schema_version: 3,
    generated_at: new Date().toISOString(),
    stats: {
      total_nodes: nodes.length,
      total_edges: edges.length,
      by_type: Object.fromEntries(
        ["master-os", "concept", "fault-line", "playbook", "tripwire", "spark"].map((t) => [
          t,
          nodes.filter((n) => n.type === t).length,
        ])
      ),
      hub_gravity: nodes
        .filter((n) => n.type === "master-os")
        .map((h) => ({ id: h.id, title: h.title, connected_edges: h.degree })),
    },
    nodes,
    edges,
  };

  writeFileSync(join(WIKI_DIR, "graph.json"), `${JSON.stringify(graph, null, 2)}\n`);

  const indexLines = [
    "# Jack 星系母法知识图谱索引",
    "",
    "> 本索引与 `wiki/graph.json` 由 `cli/learn.mjs build-graph` 自动同步编译；支持在 LLM Wiki 桌面端或 Obsidian 中直接打开浏览星系双链图谱。",
    "",
    `- [[overview]] — 星系总览（节点总数：${nodes.length}，语义连接边：${edges.length}）`,
    "",
  ];
  for (const bucket of WIKI_BUCKETS) {
    const group = nodes.filter((n) => n.type === bucket.type);
    indexLines.push(`## ${bucket.label}（${group.length}）`, "");
    if (group.length === 0) {
      indexLines.push("_暂无条目_", "");
    } else {
      for (const n of group) {
        indexLines.push(`- [[${n.id}]] — ${n.title} \`[${n.mastery}]\``);
      }
      indexLines.push("");
    }
  }
  writeFileSync(join(WIKI_DIR, "index.md"), `${indexLines.join("\n")}`);
  return graph;
}

async function notifyDesktopLlmWikiIfRegistered() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch("http://127.0.0.1:19828/api/v1/projects", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    const matched = (data.projects || []).find((p) => p.path === ROOT_DIR);
    if (!matched) return false;
    await fetch(`http://127.0.0.1:19828/api/v1/projects/${matched.id}/sources/rescan`, { method: "POST" });
    return true;
  } catch (_err) {
    return false;
  }
}

function appendWikiLog(line) {
  const logPath = join(WIKI_DIR, "log.md");
  const today = new Date().toISOString().slice(0, 10);
  const existing = existsSync(logPath) ? readFileSync(logPath, "utf8") : "# Jack 知识图谱演进与收割日志\n";
  const heading = `## ${today}`;
  if (existing.includes(heading)) {
    const updated = existing.replace(heading, `${heading}\n\n- ${line}`);
    writeFileSync(logPath, updated);
  } else {
    const updated = existing.replace(
      /^# .*$/m,
      (m) => `${m}\n\n${heading}\n\n- ${line}`
    );
    writeFileSync(logPath, updated);
  }
}

function cmdStatus(targetProject, asJson) {
  const graph = existsSync(join(WIKI_DIR, "graph.json"))
    ? JSON.parse(readFileSync(join(WIKI_DIR, "graph.json"), "utf8"))
    : buildKnowledgeGraph();
  const state = JSON.parse(readFileSync(join(LEARNER_DIR, "cognitive-state.json"), "utf8"));
  const slugs = targetProject
    ? [targetProject]
    : readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith(".") && statSync(join(PROJECTS_DIR, d)).isDirectory());

  const projects = slugs.map((slug) => {
    const pDir = join(PROJECTS_DIR, slug);
    const project = JSON.parse(readFileSync(join(pDir, "project.json"), "utf8"));
    const ledger = JSON.parse(readFileSync(join(pDir, "ledger.json"), "utf8"));
    const arenas = JSON.parse(readFileSync(join(pDir, "arenas.json"), "utf8"));
    const entries = Object.entries(ledger.nodes || {});
    const counts = { mapped: 0, probed: 0, weapon_unlocked: 0, battle_proven: 0 };
    const retestNodes = [];
    for (const [nid, info] of entries) {
      counts[info.mastery] = (counts[info.mastery] || 0) + 1;
      if (info.retest_required) retestNodes.push(nid);
    }
    return { slug, title: project.title, arenas_count: arenas.arenas.length, counts, retestNodes };
  });

  if (asJson) {
    console.log(JSON.stringify({ state, graph_stats: graph.stats, projects }, null, 2));
    return;
  }

  console.log(`=== Jack 星系母法与快赢战果总盘 ===`);
  console.log(
    `战果计分板: 已解锁武器卡=${graph.stats.by_type.playbook} | 实战收割火花=${graph.stats.by_type.spark} | 红队防雷卡=${graph.stats.by_type.tripwire} | 累计闯关=${state.scoreboard.rounds_played}`
  );
  console.log(`母法恒星引力分布:`);
  for (const h of graph.stats.hub_gravity) {
    console.log(`  * [${h.id}] ${h.title} -> 连接边数: ${h.connected_edges}`);
  }
  for (const p of projects) {
    console.log(`\n专项立项 [${p.slug}] ${p.title}（自由空降战区: ${p.arenas_count} 个）`);
    console.log(
      `  状态: 待开火(mapped)=${p.counts.mapped} | 已交手(probed)=${p.counts.probed} | 武器解锁(weapon_unlocked)=${p.counts.weapon_unlocked} | 实战验证(battle_proven)=${p.counts.battle_proven}`
    );
    if (p.retestNodes.length > 0) {
      console.log(`  待红队换壳复测暗雷: ${p.retestNodes.join(", ")}`);
    }
  }
}

function cmdContext(projectSlug, flags) {
  const slug = projectSlug || "jack-legal";
  const pDir = join(PROJECTS_DIR, slug);
  if (!existsSync(pDir)) throw new Error(`未找到立项: ${slug}`);

  const profile = JSON.parse(readFileSync(join(LEARNER_DIR, "profile.json"), "utf8"));
  const project = JSON.parse(readFileSync(join(pDir, "project.json"), "utf8"));
  const arenas = JSON.parse(readFileSync(join(pDir, "arenas.json"), "utf8"));
  const ledger = JSON.parse(readFileSync(join(pDir, "ledger.json"), "utf8"));
  const graph = existsSync(join(WIKI_DIR, "graph.json"))
    ? JSON.parse(readFileSync(join(WIKI_DIR, "graph.json"), "utf8"))
    : buildKnowledgeGraph();

  const minutes = Number(flags.minutes || 8);
  const topic = (flags.topic || "").toLowerCase();
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  let candidates = Object.entries(ledger.nodes).map(([id, l]) => ({
    ...nodeMap.get(id),
    ...l,
    id,
  }));

  if (topic) {
    const filtered = candidates.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(topic) ||
        c.id.toLowerCase().includes(topic) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(topic))
    );
    if (filtered.length > 0) candidates = filtered;
  }

  candidates.sort((a, b) => {
    if (a.retest_required !== b.retest_required) return a.retest_required ? -1 : 1;
    const rank = { mapped: 1, probed: 2, weapon_unlocked: 3, battle_proven: 4 };
    if (rank[a.mastery] !== rank[b.mastery]) return rank[a.mastery] - rank[b.mastery];
    const typeRank = { "fault-line": 1, tripwire: 2, concept: 3, playbook: 4, spark: 5 };
    return (typeRank[a.type] || 9) - (typeRank[b.type] || 9);
  });

  const focus = candidates[0] || null;
  const connectedEdges = focus
    ? graph.edges.filter((e) => e.source === focus.id || e.target === focus.id)
    : [];

  console.log(
    JSON.stringify(
      {
        project: slug,
        round_budget_minutes: minutes,
        depth_ceiling_rule: project.depth_ceiling_rule,
        learner_style: profile.identity.core_style,
        recommended_focus_node: focus,
        connected_graph_edges: connectedEdges,
        available_arenas: arenas.arenas.map((a) => ({ id: a.id, title: a.title, fast_win_promise: a.fast_win_promise })),
      },
      null,
      2
    )
  );
}

function cmdGraph(flags) {
  const graph = existsSync(join(WIKI_DIR, "graph.json"))
    ? JSON.parse(readFileSync(join(WIKI_DIR, "graph.json"), "utf8"))
    : buildKnowledgeGraph();

  let nodes = graph.nodes;
  let edges = graph.edges;

  if (flags.hub) {
    const connectedIds = new Set([flags.hub]);
    for (const e of edges) {
      if (e.source === flags.hub || e.target === flags.hub) {
        connectedIds.add(e.source);
        connectedIds.add(e.target);
      }
    }
    nodes = nodes.filter((n) => connectedIds.has(n.id));
    edges = edges.filter((e) => connectedIds.has(e.source) && connectedIds.has(e.target));
  }

  if (flags.query) {
    const q = flags.query.toLowerCase();
    const matchedIds = new Set(
      nodes
        .filter(
          (n) =>
            n.id.toLowerCase().includes(q) ||
            (n.title || "").toLowerCase().includes(q) ||
            (n.summary || "").toLowerCase().includes(q) ||
            (n.tags || []).some((t) => t.toLowerCase().includes(q))
        )
        .map((n) => n.id)
    );
    edges = edges.filter((e) => matchedIds.has(e.source) || matchedIds.has(e.target));
    for (const e of edges) {
      matchedIds.add(e.source);
      matchedIds.add(e.target);
    }
    nodes = nodes.filter((n) => matchedIds.has(n.id));
  }

  if (flags.json) {
    console.log(JSON.stringify({ count_nodes: nodes.length, count_edges: edges.length, nodes, edges }, null, 2));
    return;
  }

  console.log(`=== 星系知识图谱检索结果（节点: ${nodes.length}，语义边: ${edges.length}）===`);
  for (const n of nodes) {
    console.log(`  [${n.type}] ${n.id} — ${n.title} (${n.mastery})`);
  }
  console.log(`--- 关键语义连接 ---`);
  for (const e of edges) {
    console.log(`  ${e.source} --(${e.rel})--> ${e.target}`);
  }
}

async function cmdHarvest(flags) {
  const { slug, title, domain, hub, takeaway } = flags;
  if (!slug || !title || !domain || !hub || !takeaway) {
    throw new Error("harvest 必填参数: --slug --title --domain --hub --takeaway");
  }
  if (!slug.startsWith("sp-")) {
    throw new Error("harvest 的 --slug 必须以 sp- 开头（如 sp-02-contract-escrow-trick）");
  }
  const hubPath = join(WIKI_DIR, "master-os", `${hub}.md`);
  if (!existsSync(hubPath)) {
    throw new Error(`指定的母法恒星节点不存在: ${hub}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  mkdirSync(RAW_SOURCES_DIR, { recursive: true });
  mkdirSync(join(WIKI_DIR, "sparks"), { recursive: true });

  const rawRelPath = `raw/sources/${today}-${slug}.md`;
  const rawFullPath = join(ROOT_DIR, rawRelPath);
  const rawBody = [
    `# 实战任务收割原始记录：${title}`,
    "",
    `- **收割日期**：${today}`,
    `- **所属领域**：\`${domain}\``,
    `- **外部凭证/来源引用**：\`${flags["evidence-ref"] || "当前会话完成事项"}\``,
    "",
    "## 事实摘要",
    "",
    flags["source-summary"] || takeaway,
    "",
  ].join("\n");
  writeFileSync(rawFullPath, rawBody);

  const edges = [{ rel: "assimilates_into", target: hub }];
  const related = [hub];
  if (flags.leap) {
    edges.push({ rel: "lateral_leap_to", target: flags.leap });
    if (!related.includes(flags.leap)) related.push(flags.leap);
  }

  const sparkBody = [
    `# ${title}`,
    "",
    "## 挂入我的母法",
    "",
    `直挂 [[${hub}]]${flags.leap ? `，跨界联动 [[${flags.leap}]]` : ""}。`,
    "",
    "## 20% 跨界可复用破局点",
    "",
    takeaway,
    ...(flags["tripwire-note"]
      ? ["", "## 顺手排掉的细节暗雷", "", `- ${flags["tripwire-note"]}`]
      : []),
    "",
  ].join("\n");

  const sparkMeta = {
    id: slug,
    type: "spark",
    title,
    domain,
    mastery: "battle_proven",
    confidence: 0.9,
    hubs: [hub],
    edges,
    tags: ["spark", domain],
    related,
    evidence_refs: [rawRelPath],
    created: today,
    updated: today,
  };

  const sparkPath = join(WIKI_DIR, "sparks", `${slug}.md`);
  writeFileSync(sparkPath, serializeFrontmatter(sparkMeta, sparkBody));

  const statePath = join(LEARNER_DIR, "cognitive-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state.scoreboard.sparks_harvested = (state.scoreboard.sparks_harvested || 0) + 1;
  state.updated_at = new Date().toISOString();
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);

  appendWikiLog(`子 Agent 收割实战火花 [[${slug}]]（挂载母法 [[${hub}]]，领域：\`${domain}\`）。`);
  const graph = buildKnowledgeGraph();
  const notified = await notifyDesktopLlmWikiIfRegistered();

  console.log(
    JSON.stringify(
      {
        ok: true,
        spark_path: relative(ROOT_DIR, sparkPath),
        raw_source_path: rawRelPath,
        assimilated_hub: hub,
        graph_nodes_total: graph.stats.total_nodes,
        graph_edges_total: graph.stats.total_edges,
        llm_wiki_desktop_notified: notified,
      },
      null,
      2
    )
  );
}

function cmdRecord(projectSlug, flags) {
  const nodeId = flags.node;
  const verdict = flags.verdict;
  const evidence = flags.evidence;
  if (!projectSlug || !nodeId || !verdict || !evidence) {
    throw new Error("record 必填参数: <project> --node <id> --verdict <verdict> --evidence <path>");
  }
  if (!VALID_VERDICTS.has(verdict)) {
    throw new Error(`非法 verdict: ${verdict}（可选: ${[...VALID_VERDICTS].join(", ")}）`);
  }

  const pDir = join(PROJECTS_DIR, projectSlug);
  const resolvedEvidence = existsSync(join(ROOT_DIR, evidence))
    ? evidence
    : existsSync(join(pDir, evidence))
      ? relative(ROOT_DIR, join(pDir, evidence))
      : null;
  if (!resolvedEvidence) {
    throw new Error(`实证记录文件不存在: ${evidence}`);
  }

  const pages = scanAllWikiPages();
  const targetPage = pages.find((p) => p.slug === nodeId);
  if (!targetPage || targetPage.parsed.error) {
    throw new Error(`未找到目标知识图谱节点: ${nodeId}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const { meta, body } = targetPage.parsed;
  const isCleanWin = verdict === "lateral_breakthrough" || verdict === "calibrated_mastery";
  const newMastery = isCleanWin ? "weapon_unlocked" : "probed";
  const newConfidence = verdict === "lateral_breakthrough" ? 0.88 : isCleanWin ? 0.84 : 0.55;
  const retestRequired = verdict === "sharp_but_tripped" || verdict === "confident_blindspot";

  const refs = Array.isArray(meta.evidence_refs) ? [...meta.evidence_refs] : [];
  if (!refs.includes(resolvedEvidence)) refs.push(resolvedEvidence);
  meta.mastery = newMastery;
  meta.confidence = newConfidence;
  meta.evidence_refs = refs;
  meta.updated = today;

  let mintedPlaybook = null;
  if (flags["playbook-id"] && flags["playbook-title"] && flags["playbook-points"]) {
    const pbId = flags["playbook-id"];
    const pbHub = (meta.hubs && meta.hubs[0]) || "mos-04-lateral-restructure";
    const points = flags["playbook-points"]
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    const pbMeta = {
      id: pbId,
      type: "playbook",
      title: flags["playbook-title"],
      domain: meta.domain || projectSlug,
      mastery: "weapon_unlocked",
      confidence: 0.88,
      hubs: [pbHub],
      edges: [
        { rel: "assimilates_into", target: pbHub },
        { rel: "related_lens", target: nodeId },
      ],
      tags: ["playbook", "weapon-card", meta.domain || "general"],
      related: [pbHub, nodeId],
      evidence_refs: [resolvedEvidence],
      created: today,
      updated: today,
    };
    const pbBody = [
      `# ${flags["playbook-title"]}`,
      "",
      `源自节点 [[${nodeId}]] 实战解锁，挂载母法 [[${pbHub}]]。`,
      "",
      "## 即战三刀",
      "",
      ...points.map((pt, idx) => `${idx + 1}. ${pt}`),
      "",
    ].join("\n");
    writeFileSync(join(WIKI_DIR, "playbooks", `${pbId}.md`), serializeFrontmatter(pbMeta, pbBody));
    meta.edges = Array.isArray(meta.edges) ? meta.edges : [];
    if (!meta.edges.some((e) => e.target === pbId)) {
      meta.edges.push({ rel: "unlocks_weapon", target: pbId });
    }
    if (!meta.related.includes(pbId)) meta.related.push(pbId);
    mintedPlaybook = pbId;
  }

  writeFileSync(targetPage.fullPath, serializeFrontmatter(meta, body));

  const ledgerPath = join(pDir, "ledger.json");
  const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
  const prev = ledger.nodes[nodeId] || { attempts: 0, evidence_refs: [] };
  ledger.nodes[nodeId] = {
    mastery: newMastery,
    confidence: newConfidence,
    attempts: (prev.attempts || 0) + 1,
    last_verdict: verdict,
    retest_required: retestRequired,
    evidence_refs: refs,
  };
  if (mintedPlaybook) {
    ledger.nodes[mintedPlaybook] = {
      mastery: "weapon_unlocked",
      confidence: 0.88,
      attempts: 1,
      last_verdict: verdict,
      retest_required: false,
      evidence_refs: [resolvedEvidence],
    };
  }
  ledger.updated_at = new Date().toISOString();
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);

  const statePath = join(LEARNER_DIR, "cognitive-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state.scoreboard.rounds_played += 1;
  if (mintedPlaybook) state.scoreboard.weapons_unlocked += 1;
  if (verdict === "lateral_breakthrough") state.scoreboard.lateral_breakthroughs += 1;
  if (retestRequired) state.scoreboard.tripwires_caught += 1;
  state.calibration_distribution[verdict] = (state.calibration_distribution[verdict] || 0) + 1;
  state.updated_at = new Date().toISOString();
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);

  appendWikiLog(
    `快赢结算 [[${nodeId}]] -> \`${verdict}\`（状态：\`${newMastery}\`${mintedPlaybook ? `，掉落武器卡 [[${mintedPlaybook}]]` : ""}${flags.note ? `；备注：${flags.note}` : ""}）。`
  );
  buildKnowledgeGraph();
  console.log(JSON.stringify({ ok: true, node: nodeId, mastery: newMastery, retest_required: retestRequired, minted_playbook: mintedPlaybook }, null, 2));
}

function cmdInit(slug, flags) {
  if (!slug || !/^[a-z0-9][a-z0-9_-]{1,40}$/.test(slug)) {
    throw new Error("请提供合法的立项 slug（小写字母、数字、连字符，如 jack-finance）");
  }
  const pDir = join(PROJECTS_DIR, slug);
  if (existsSync(pDir)) throw new Error(`立项已存在: ${pDir}`);
  mkdirSync(join(pDir, "sessions"), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const title = flags.title || `${slug} 快赢实战立项`;
  const domain = flags.domain || slug;
  const goal = flags.goal || "用个人四步母法掌握该领域 20% 核心胜负开关并即时产出破局武器卡";

  writeFileSync(
    join(pDir, "project.json"),
    `${JSON.stringify(
      {
        schema_version: 3,
        slug,
        title,
        domain,
        goal,
        depth_ceiling_rule: "严格执行 20/80 深度熔断：只控 20% 胜负开关，80% 繁琐执行细节全部交由 AI 代劳。",
        free_jump_enabled: true,
        source_anchors: [],
        created_at: today,
        updated_at: today,
      },
      null,
      2
    )}\n`
  );
  writeFileSync(join(pDir, "arenas.json"), `${JSON.stringify({ schema_version: 3, slug, free_jump: true, arenas: [] }, null, 2)}\n`);
  writeFileSync(join(pDir, "ledger.json"), `${JSON.stringify({ schema_version: 3, slug, nodes: {}, updated_at: new Date().toISOString() }, null, 2)}\n`);
  writeFileSync(join(pDir, "README.md"), `<!-- 文件职责：${title} 立项说明。 -->\n# ${title}\n\n- **领域**：\`${domain}\`\n- **目标**：${goal}\n`);
  writeFileSync(join(pDir, "sessions", `${today}-fast-win-arena.md`), `# ${title} 5 分钟快赢擂台（${today}）\n\n待运行 \`agent-learn\` 注入首轮高杠杆残局。\n`);
  console.log(`已创建快赢学习立项: ${pDir}`);
}

function cmdLint() {
  const errors = [];
  for (const rootReq of ["purpose.md", "schema.md", "AGENTS.md", "README.md"]) {
    if (!existsSync(join(ROOT_DIR, rootReq))) errors.push(`根目录缺少 ${rootReq}`);
  }

  const pages = scanAllWikiPages();
  const slugSet = new Set(pages.map((p) => p.slug));
  const hubSet = new Set(pages.filter((p) => p.expectedType === "master-os").map((p) => p.slug));

  for (const p of pages) {
    if (p.parsed.error) {
      errors.push(p.parsed.error);
      continue;
    }
    const { meta, body } = p.parsed;
    for (const k of ["id", "type", "title", "domain", "mastery", "confidence", "created", "updated"]) {
      if (meta[k] === undefined || meta[k] === "") {
        errors.push(`${p.relPath}: 缺少字段 ${k}`);
      }
    }
    if (meta.id !== p.slug) errors.push(`${p.relPath}: id(${meta.id}) 与文件名(${p.slug}) 不一致`);
    if (!VALID_TYPES.has(meta.type)) errors.push(`${p.relPath}: 非法 type(${meta.type})`);
    if (p.expectedType && meta.type !== p.expectedType) {
      errors.push(`${p.relPath}: 目录要求 type=${p.expectedType}，实际为 ${meta.type}`);
    }
    if (!VALID_MASTERY.has(meta.mastery)) errors.push(`${p.relPath}: 非法 mastery(${meta.mastery})`);

    if (meta.type !== "master-os" && meta.type !== "overview") {
      const hubs = Array.isArray(meta.hubs) ? meta.hubs : [];
      if (hubs.length === 0) {
        errors.push(`${p.relPath}: 孤岛拦截 — 必须至少挂载 1 个个人母法恒星 (hubs: [mos-...])`);
      }
      for (const h of hubs) {
        if (!hubSet.has(h)) errors.push(`${p.relPath}: hubs 引用了不存在的母法节点 (${h})`);
      }
    }

    if (meta.type === "concept" || meta.type === "fault-line") {
      if (!body.includes("80%")) {
        errors.push(`${p.relPath}: 违反 20/80 深度熔断规范 — 正文必须明确划出『直接甩给 AI 干的 80% 细节』`);
      }
    }

    const refs = Array.isArray(meta.evidence_refs) ? meta.evidence_refs : [];
    if (meta.mastery !== "mapped" && refs.length === 0) {
      errors.push(`${p.relPath}: mastery=${meta.mastery} 必须绑定真实凭证 (evidence_refs)`);
    }
    for (const r of refs) {
      if (!existsSync(join(ROOT_DIR, r))) {
        errors.push(`${p.relPath}: evidence_refs 文件不存在 (${r})`);
      }
    }

    for (const e of Array.isArray(meta.edges) ? meta.edges : []) {
      if (!slugSet.has(e.target)) errors.push(`${p.relPath}: edge(${e.rel}) 指向不存在节点 (${e.target})`);
    }
    for (const rel of Array.isArray(meta.related) ? meta.related : []) {
      if (!slugSet.has(rel)) errors.push(`${p.relPath}: related 指向不存在节点 (${rel})`);
    }
    const links = [...body.matchAll(/\[\[([a-zA-Z0-9_-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1]);
    for (const l of links) {
      if (!slugSet.has(l)) errors.push(`${p.relPath}: 正文 [[${l}]] 指向不存在节点`);
    }
  }

  for (const pSlug of readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith("."))) {
    const pDir = join(PROJECTS_DIR, pSlug);
    if (!statSync(pDir).isDirectory()) continue;
    const ledgerPath = join(pDir, "ledger.json");
    if (!existsSync(ledgerPath)) {
      errors.push(`projects/${pSlug}: 缺少 ledger.json`);
      continue;
    }
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
    for (const [nid, entry] of Object.entries(ledger.nodes || {})) {
      const page = pages.find((x) => x.slug === nid);
      if (!page) {
        errors.push(`projects/${pSlug}/ledger.json: 引用了图谱中不存在的节点 (${nid})`);
        continue;
      }
      if (!page.parsed.error && page.parsed.meta.mastery !== entry.mastery) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} mastery(${entry.mastery}) 与 Wiki(${page.parsed.meta.mastery}) 不一致`);
      }
      if (entry.mastery === "weapon_unlocked" && entry.retest_required) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} 存在未核销暗雷复测锁，不得标为 weapon_unlocked`);
      }
    }
  }

  const indexContent = existsSync(join(WIKI_DIR, "index.md")) ? readFileSync(join(WIKI_DIR, "index.md"), "utf8") : "";
  for (const p of pages) {
    if (!indexContent.includes(`[[${p.slug}]]`)) {
      errors.push(`wiki/index.md 未收录节点 [[${p.slug}]]（请运行 build-graph）`);
    }
  }

  if (errors.length > 0) {
    console.error(`[FAIL] 发现 ${errors.length} 处图谱或门禁违规:`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[PASS] 星系母法图谱 (${pages.length} 节点)、20/80 深度熔断、零孤岛连接与实证门禁全部通过校验。`);
}

function cmdLinkSkill() {
  const sourceSkill = join(ROOT_DIR, "skills", "agent-learn");
  if (!existsSync(join(sourceSkill, "SKILL.md"))) {
    throw new Error(`仓库内未找到 Skill 源目录: ${sourceSkill}`);
  }
  const home = homedir();
  const agentsDir = join(home, ".agents", "skills");
  const codexDir = join(home, ".codex", "skills");
  mkdirSync(agentsDir, { recursive: true });
  mkdirSync(codexDir, { recursive: true });

  const agentsLink = join(agentsDir, "agent-learn");
  const codexLink = join(codexDir, "agent-learn");

  for (const linkPath of [agentsLink, codexLink]) {
    try {
      const st = lstatSync(linkPath);
      if (st.isSymbolicLink()) unlinkSync(linkPath);
      else throw new Error(`${linkPath} 已存在且为实体目录，请核实后再挂载软链`);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  symlinkSync(sourceSkill, agentsLink);
  symlinkSync("../../.agents/skills/agent-learn", codexLink);
  console.log(`已挂载软链接:\n  ${agentsLink} -> ${sourceSkill}\n  ${codexLink} -> ../../.agents/skills/agent-learn`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const sub = positional[0];
  if (!sub || flags.help || flags.h) {
    console.log("用法: node cli/learn.mjs <status|context|graph|harvest|record|build-graph|init|link-skill|lint> [options]");
    return;
  }
  if (sub === "build-graph") {
    const g = buildKnowledgeGraph();
    await notifyDesktopLlmWikiIfRegistered();
    console.log(`已编译星系知识图谱: ${g.stats.total_nodes} 节点, ${g.stats.total_edges} 条语义边`);
  } else if (sub === "status") {
    cmdStatus(positional[1], Boolean(flags.json));
  } else if (sub === "context") {
    cmdContext(positional[1], flags);
  } else if (sub === "graph") {
    cmdGraph(flags);
  } else if (sub === "harvest") {
    await cmdHarvest(flags);
  } else if (sub === "record") {
    cmdRecord(positional[1], flags);
  } else if (sub === "init") {
    cmdInit(positional[1], flags);
  } else if (sub === "link-skill") {
    cmdLinkSkill();
  } else if (sub === "lint") {
    cmdLint();
  } else {
    throw new Error(`未知命令: ${sub}`);
  }
}

main().catch((err) => {
  console.error(`错误: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
