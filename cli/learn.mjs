#!/usr/bin/env node
/**
 * 文件职责：ai-learning v4 全景认知版图、双轴状态机（认知深度 × 心理接受度）、星系母法图谱编译与子 Agent 收割引擎。
 * 主要公开入口：
 *   - status [project] [--json]：输出全景版图亮灯率（L0黑雾..L4统摄）、心理接受度/摩擦分布、母法恒星引力与计分板
 *   - context [project] [--mode auto|panorama|sparring|bullshit-audit|xray] [--minutes N] [--sector S] [--topic K]：智能选局与上下文编译
 *   - graph [--hub mos-id] [--query kw] [--json]：检索与遍历有向语义知识图谱（含 breaks_intuition_of 母法止损边）
 *   - record <project> ...：结算四类微模式结果，原子更新 sector/node 双轴状态、高水位保护、暗雷锁与武器卡铸造
 *   - harvest ...：供后台子 Agent 收割实战经验，区分文档提炼（probed/L1）与亲手实战（battle_proven/L4），同步关联项目版图
 *   - build-graph：扫描 wiki/**.md 编译 wiki/graph.json 与 wiki/index.md
 *   - init <slug> ...：初始化含 panorama.json 全景骨架的新领域立项
 *   - link-skill：将本仓库 skills/agent-learn 软链挂载到 ~/.agents/skills 与 ~/.codex/skills
 *   - lint：全量校验全景版图、双轴枚举、母法挂载、20/80 深度熔断、行话防忽悠切口、双链闭合与账实一致
 * 调用方：用户终端、skills/agent-learn 主 Agent 及 Learning Graph Harvester 子 Agent。
 */

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
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
  { dir: "fault-lines", type: "fault-line", label: "高压规则对撞与公法禁区（Fault Lines）" },
  { dir: "playbooks", type: "playbook", label: "一页破局与鉴谎武器卡（Playbooks）" },
  { dir: "tripwires", type: "tripwire", label: "发散者红队防雷卡（Tripwires）" },
  { dir: "sparks", type: "spark", label: "日常实战零散火花（Harvested Sparks）" },
];

const BOOLEAN_FLAGS = new Set(["json", "help", "h", "human-verified"]);
const VALID_TYPES = new Set(["overview", ...WIKI_BUCKETS.map((b) => b.type)]);
const VALID_MASTERY = ["mapped", "probed", "weapon_unlocked", "battle_proven"];
const MASTERY_RANK = Object.fromEntries(VALID_MASTERY.map((m, i) => [m, i]));

const VALID_DEPTHS = [
  "L0_unseen",
  "L1_panoramic",
  "L2_conversational",
  "L3_radar_and_bs_proof",
  "L4_mastered",
];
const DEPTH_RANK = Object.fromEntries(VALID_DEPTHS.map((d, i) => [d, i]));

const VALID_ACCEPTANCE = new Set([
  "unassessed",
  "embraced",
  "delegated_to_ai",
  "friction_resistant",
  "skeptical_parked",
]);

const VALID_RELS = new Set([
  "assimilates_into",
  "breaks_intuition_of",
  "collides_with",
  "guards_against",
  "unlocks_weapon",
  "lateral_leap_to",
  "related_lens",
  "mentions",
]);

const VALID_VERDICTS = new Set([
  "panorama_mapped",
  "lateral_breakthrough",
  "calibrated_mastery",
  "bullshit_exposed",
  "xray_spotted",
  "sharp_but_tripped",
  "confident_blindspot",
  "fooled_by_jargon",
  "harvested_battle",
]);

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--") && token.includes("=")) {
      const eq = token.indexOf("=");
      const k = token.slice(2, eq);
      const v = token.slice(eq + 1);
      flags[k] = BOOLEAN_FLAGS.has(k) ? v !== "false" : v;
      continue;
    }
    if (token.startsWith("-")) {
      const key = token.replace(/^-+/, "");
      if (BOOLEAN_FLAGS.has(key)) {
        flags[key] = true;
        continue;
      }
      const val = argv[i + 1];
      if (val === undefined) {
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

function unquoteYamlScalar(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    if (trimmed.startsWith('"')) {
      try {
        return JSON.parse(trimmed);
      } catch (_e) {
        return trimmed.slice(1, -1);
      }
    }
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function formatYamlScalar(val) {
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  const str = String(val ?? "");
  if (str === "" || /[:#[\]{}&*!|>'"%@`\n]/.test(str) || /^\s|\s$/.test(str)) {
    return JSON.stringify(str);
  }
  return str;
}

function parseInlineArray(str) {
  const inner = str.trim().slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map((part) => String(unquoteYamlScalar(part)));
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
  let currentObj = null;

  for (let i = 1; i < endIdx; i += 1) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;

    if (currentKey === "edges") {
      const itemStart = raw.match(/^\s*-\s+([a-zA-Z0-9_]+):\s*(.*)$/);
      if (itemStart) {
        currentObj = { [itemStart[1]]: unquoteYamlScalar(itemStart[2]) };
        meta.edges.push(currentObj);
        continue;
      }
      const itemCont = raw.match(/^\s+([a-zA-Z0-9_]+):\s*(.*)$/);
      if (itemCont && currentObj) {
        currentObj[itemCont[1]] = unquoteYamlScalar(itemCont[2]);
        continue;
      }
    }

    const listItem = raw.match(/^\s*-\s+(.+)$/);
    if (listItem && currentKey && currentKey !== "edges") {
      meta[currentKey].push(unquoteYamlScalar(listItem[1]));
      continue;
    }

    const kv = raw.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    const val = rawVal.trim();
    currentObj = null;

    if (val.startsWith("[") && val.endsWith("]")) {
      meta[key] = parseInlineArray(val);
      currentKey = null;
    } else if (val === "") {
      meta[key] = [];
      currentKey = key;
    } else {
      currentKey = null;
      meta[key] = unquoteYamlScalar(val);
    }
  }

  const body = lines.slice(endIdx + 1).join("\n");
  return { meta, body };
}

function serializeFrontmatter(meta, body) {
  const lines = ["---"];
  const knownOrder = [
    "id",
    "type",
    "title",
    "domain",
    "mastery",
    "confidence",
    "hubs",
    "edges",
    "tags",
    "related",
    "evidence_refs",
    "created",
    "updated",
  ];
  const allKeys = [...knownOrder, ...Object.keys(meta).filter((k) => !knownOrder.includes(k))];
  const seen = new Set();

  for (const key of allKeys) {
    if (seen.has(key) || meta[key] === undefined) continue;
    seen.add(key);
    const val = meta[key];
    if (key === "edges") {
      if (!Array.isArray(val) || val.length === 0) {
        lines.push("edges: []");
      } else {
        lines.push("edges:");
        for (const e of val) {
          lines.push(`  - rel: ${formatYamlScalar(e.rel)}`);
          lines.push(`    target: ${formatYamlScalar(e.target)}`);
        }
      }
    } else if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of val) lines.push(`  - ${formatYamlScalar(item)}`);
      }
    } else {
      lines.push(`${key}: ${formatYamlScalar(val)}`);
    }
  }
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
  return (lines[0] || "").replace(/\*\*/g, "").slice(0, 95);
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
      if (!e.target || !e.rel) continue;
      edgeMap.set(`${p.slug}::${e.rel}::${e.target}`, {
        source: p.slug,
        target: e.target,
        rel: e.rel,
        explicit: true,
      });
    }
    const wikiRefs = [...body.matchAll(/\[\[([a-zA-Z0-9_-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1]);
    for (const target of wikiRefs) {
      if (target === p.slug) continue;
      const hasExplicit = [...edgeMap.values()].some((x) => x.source === p.slug && x.target === target);
      if (!hasExplicit) {
        edgeMap.set(`${p.slug}::mentions::${target}`, {
          source: p.slug,
          target,
          rel: "mentions",
          explicit: false,
        });
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
    schema_version: 4,
    generated_at: new Date().toISOString(),
    stats: {
      total_nodes: nodes.length,
      total_edges: edges.length,
      accommodation_walls: edges.filter((e) => e.rel === "breaks_intuition_of").length,
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
    "> 本索引与 `wiki/graph.json` 由 `cli/learn.mjs build-graph` 自动同步编译；支持在 LLM Wiki 桌面端或 Obsidian 中直接打开浏览。",
    "",
    `- [[overview]] — 星系总览（节点总数：${nodes.length}，语义边：${edges.length}，公法/刑法止损墙：${graph.stats.accommodation_walls}）`,
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
    const idx = existing.indexOf(heading);
    const nextHeadingIdx = existing.indexOf("\n## ", idx + heading.length);
    if (nextHeadingIdx === -1) {
      writeFileSync(logPath, `${existing.trimEnd()}\n- ${line}\n`);
    } else {
      const before = existing.slice(0, nextHeadingIdx).trimEnd();
      const after = existing.slice(nextHeadingIdx);
      writeFileSync(logPath, `${before}\n- ${line}\n${after}`);
    }
  } else {
    const updated = existing.replace(/^# .*$/m, (m) => `${m}\n\n${heading}\n\n- ${line}`);
    writeFileSync(logPath, updated);
  }
}

function recomputeLearnerAggregates() {
  const statePath = join(LEARNER_DIR, "cognitive-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  const frictionSet = new Set();
  const delegatedSet = new Set();

  for (const slug of readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith("."))) {
    const lPath = join(PROJECTS_DIR, slug, "ledger.json");
    if (!existsSync(lPath)) continue;
    const ledger = JSON.parse(readFileSync(lPath, "utf8"));
    for (const [id, info] of Object.entries({ ...(ledger.sectors || {}), ...(ledger.nodes || {}) })) {
      if (info.acceptance === "friction_resistant") frictionSet.add(`${slug}:${id}`);
      if (info.acceptance === "delegated_to_ai") delegatedSet.add(`${slug}:${id}`);
    }
  }
  state.friction_watchlist = [...frictionSet];
  state.delegated_ai_gates = [...delegatedSet];
  state.updated_at = new Date().toISOString();
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

function summarizeProject(slug) {
  const pDir = join(PROJECTS_DIR, slug);
  const project = JSON.parse(readFileSync(join(pDir, "project.json"), "utf8"));
  const panorama = JSON.parse(readFileSync(join(pDir, "panorama.json"), "utf8"));
  const ledger = JSON.parse(readFileSync(join(pDir, "ledger.json"), "utf8"));

  const sectorDepths = Object.fromEntries(VALID_DEPTHS.map((d) => [d, 0]));
  const unseenSectors = [];
  for (const sec of panorama.sectors || []) {
    const sState = ledger.sectors?.[sec.id] || { depth: "L0_unseen", acceptance: "unassessed" };
    sectorDepths[sState.depth] = (sectorDepths[sState.depth] || 0) + 1;
    if (sState.depth === "L0_unseen") unseenSectors.push(`${sec.id}(${sec.title})`);
  }

  const nodeDepths = Object.fromEntries(VALID_DEPTHS.map((d) => [d, 0]));
  const acceptanceCounts = {
    unassessed: 0,
    embraced: 0,
    delegated_to_ai: 0,
    friction_resistant: 0,
    skeptical_parked: 0,
  };
  const retestNodes = [];
  const frictionDetails = [];

  for (const [nid, info] of Object.entries(ledger.nodes || {})) {
    const d = info.depth || "L0_unseen";
    const a = info.acceptance || "unassessed";
    nodeDepths[d] = (nodeDepths[d] || 0) + 1;
    acceptanceCounts[a] = (acceptanceCounts[a] || 0) + 1;
    if (info.retest_required) retestNodes.push(nid);
    if (a === "friction_resistant") {
      frictionDetails.push({ id: nid, stance_note: info.stance_note, workaround: info.workaround });
    }
  }

  const totalSectors = (panorama.sectors || []).length;
  const litSectors = totalSectors - (sectorDepths.L0_unseen || 0);

  return {
    slug,
    title: project.title,
    panorama_coverage: `${litSectors}/${totalSectors}`,
    sector_depths: sectorDepths,
    unseen_sectors: unseenSectors,
    node_depths: nodeDepths,
    acceptance_counts: acceptanceCounts,
    retest_nodes: retestNodes,
    friction_details: frictionDetails,
  };
}

function cmdStatus(targetProject, asJson) {
  const graph = existsSync(join(WIKI_DIR, "graph.json"))
    ? JSON.parse(readFileSync(join(WIKI_DIR, "graph.json"), "utf8"))
    : buildKnowledgeGraph();
  const state = recomputeLearnerAggregates();
  const slugs = targetProject
    ? [targetProject]
    : readdirSync(PROJECTS_DIR).filter((d) => !d.startsWith(".") && statSync(join(PROJECTS_DIR, d)).isDirectory());

  const projects = slugs.map((s) => summarizeProject(s));

  if (asJson) {
    console.log(JSON.stringify({ state, graph_stats: graph.stats, projects }, null, 2));
    return;
  }

  console.log(`=== Jack 星系母法 · 全景认知与接受度总盘 (v4) ===`);
  console.log(
    `全局战果: 武器卡=${graph.stats.by_type.playbook} | 实战火花=${graph.stats.by_type.spark} | 红队防雷卡=${graph.stats.by_type.tripwire} | 母法止损墙=${graph.stats.accommodation_walls} | 识破忽悠=${state.scoreboard.bullshit_traps_exposed}`
  );
  console.log(`母法恒星引力分布:`);
  for (const h of graph.stats.hub_gravity) {
    console.log(`  * [${h.id}] ${h.title} -> 连接边数: ${h.connected_edges}`);
  }
  for (const p of projects) {
    console.log(`\n专项立项 [${p.slug}] ${p.title}`);
    console.log(`  1. 全景版图亮灯率: ${p.panorama_coverage} 个一级版块已扫除黑雾`);
    if (p.unseen_sectors.length > 0) {
      console.log(`     待3分钟扫雾版块 (${p.unseen_sectors.length}): ${p.unseen_sectors.join(" | ")}`);
    }
    console.log(
      `  2. 节点认知深度: L0黑雾=${p.node_depths.L0_unseen} | L1知全貌=${p.node_depths.L1_panoramic} | L2能与律师对话=${p.node_depths.L2_conversational} | L3审坑防骗=${p.node_depths.L3_radar_and_bs_proof} | L4母法统摄=${p.node_depths.L4_mastered}`
    );
    console.log(
      `  3. 心理接受姿态: 认同内化=${p.acceptance_counts.embraced} | 移交AI守门=${p.acceptance_counts.delegated_to_ai} | 直觉排斥易反弹=${p.acceptance_counts.friction_resistant} | 战略暂挂=${p.acceptance_counts.skeptical_parked} | 未表态=${p.acceptance_counts.unassessed}`
    );
    if (p.retest_nodes.length > 0) {
      console.log(`  4. 待换壳复测暗雷: ${p.retest_nodes.join(", ")}`);
    }
  }
}

function cmdContext(projectSlug, flags) {
  const state = JSON.parse(readFileSync(join(LEARNER_DIR, "cognitive-state.json"), "utf8"));
  const slug = projectSlug || state.active_project || "jack-legal";
  const pDir = join(PROJECTS_DIR, slug);
  if (!existsSync(pDir)) throw new Error(`未找到立项: ${slug}`);

  const profile = JSON.parse(readFileSync(join(LEARNER_DIR, "profile.json"), "utf8"));
  const project = JSON.parse(readFileSync(join(pDir, "project.json"), "utf8"));
  const panorama = JSON.parse(readFileSync(join(pDir, "panorama.json"), "utf8"));
  const ledger = JSON.parse(readFileSync(join(pDir, "ledger.json"), "utf8"));
  const graph = existsSync(join(WIKI_DIR, "graph.json"))
    ? JSON.parse(readFileSync(join(WIKI_DIR, "graph.json"), "utf8"))
    : buildKnowledgeGraph();

  const minutes = Number(flags.minutes || state.preferred_round_minutes || 8);
  const requestedMode = flags.mode || "auto";
  const targetSectorId = flags.sector || null;
  const topic = (flags.topic || "").toLowerCase();

  if (!panorama.sectors || panorama.sectors.length === 0) {
    console.log(JSON.stringify({ project: slug, recommended_mode: "build_panorama", reason: "立项尚未生成全景版图" }, null, 2));
    return;
  }

  const unseenSectors = panorama.sectors.filter(
    (s) => (!targetSectorId || s.id === targetSectorId) && (ledger.sectors?.[s.id]?.depth || "L0_unseen") === "L0_unseen"
  );

  if (requestedMode === "panorama" || (requestedMode === "auto" && !topic && unseenSectors.length >= Math.ceil(panorama.sectors.length * 0.6))) {
    const nextSec = unseenSectors[0] || panorama.sectors[0];
    console.log(
      JSON.stringify(
        {
          project: slug,
          round_budget_minutes: minutes,
          recommended_mode: "panorama",
          reason: `当前尚有 ${unseenSectors.length}/${panorama.sectors.length} 个版块处于 L0 未知黑雾，建议先花 3 分钟点亮版块坐标`,
          target_sector: nextSec,
          unseen_count: unseenSectors.length,
        },
        null,
        2
      )
    );
    return;
  }

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  let candidates = Object.entries(ledger.nodes || {})
    .filter(([, l]) => l.acceptance !== "skeptical_parked")
    .map(([id, l]) => ({ ...(nodeMap.get(id) || {}), ...l, id }));

  if (targetSectorId) {
    const sec = panorama.sectors.find((s) => s.id === targetSectorId);
    if (sec && sec.linked_nodes.length > 0) {
      const allowed = new Set(sec.linked_nodes);
      candidates = candidates.filter((c) => allowed.has(c.id));
    }
  }

  if (topic) {
    const filtered = candidates.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(topic) ||
        c.id.toLowerCase().includes(topic) ||
        (c.tags || []).some((t) => String(t).toLowerCase().includes(topic))
    );
    if (filtered.length > 0) candidates = filtered;
  }

  candidates.sort((a, b) => {
    if (Boolean(a.retest_required) !== Boolean(b.retest_required)) return a.retest_required ? -1 : 1;
    if ((a.acceptance === "friction_resistant") !== (b.acceptance === "friction_resistant")) {
      return a.acceptance === "friction_resistant" ? -1 : 1;
    }
    if ((a.acceptance === "delegated_to_ai") !== (b.acceptance === "delegated_to_ai")) {
      return a.acceptance === "delegated_to_ai" ? 1 : -1;
    }
    const da = DEPTH_RANK[a.depth || "L0_unseen"] ?? 0;
    const db = DEPTH_RANK[b.depth || "L0_unseen"] ?? 0;
    if (da !== db) return da - db;
    const typeRank = { "fault-line": 1, playbook: 2, concept: 3, tripwire: 4, spark: 5 };
    return (typeRank[a.type] || 9) - (typeRank[b.type] || 9);
  });

  const focus = candidates[0] || null;
  let mode = requestedMode;
  if (mode === "auto" && focus) {
    const dRank = DEPTH_RANK[focus.depth || "L0_unseen"] ?? 0;
    if (focus.acceptance === "friction_resistant" || dRank === 2) {
      mode = focus.type === "playbook" ? "bullshit-audit" : "xray";
    } else {
      mode = "sparring";
    }
  }

  const connectedEdges = focus ? graph.edges.filter((e) => e.source === focus.id || e.target === focus.id) : [];

  console.log(
    JSON.stringify(
      {
        project: slug,
        round_budget_minutes: minutes,
        recommended_mode: mode,
        depth_ceiling_rule: project.depth_ceiling_rule,
        learner_style: profile.identity.core_style,
        recommended_focus_node: focus,
        connected_graph_edges: connectedEdges,
        panorama_unseen_sectors: unseenSectors.map((s) => ({ id: s.id, title: s.title })),
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
            (n.tags || []).some((t) => String(t).toLowerCase().includes(q))
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
    throw new Error("harvest 的 --slug 必须以 sp- 开头（如 sp-03-escrow-gate）");
  }
  const hubPath = join(WIKI_DIR, "master-os", `${hub}.md`);
  if (!existsSync(hubPath)) {
    throw new Error(`指定的母法恒星节点不存在: ${hub}`);
  }

  const humanVerified = Boolean(flags["human-verified"]);
  const mastery = humanVerified ? "battle_proven" : "probed";
  const confidence = humanVerified ? 0.9 : 0.68;
  const depth = humanVerified ? "L4_mastered" : "L1_panoramic";

  const today = new Date().toISOString().slice(0, 10);
  mkdirSync(RAW_SOURCES_DIR, { recursive: true });
  mkdirSync(join(WIKI_DIR, "sparks"), { recursive: true });

  const rawRelPath = `raw/sources/${today}-${slug}.md`;
  writeFileSync(
    join(ROOT_DIR, rawRelPath),
    [
      `# 实战任务收割原始记录：${title}`,
      "",
      `- **收割日期**：${today}`,
      `- **所属领域**：\`${domain}\``,
      `- **实证类型**：${humanVerified ? "本人亲手完成任务实证" : "后台子 Agent 提取待实战复验"}`,
      `- **外部凭证引用**：\`${flags["evidence-ref"] || "当前会话完成事项"}\``,
      "",
      "## 事实摘要",
      "",
      flags["source-summary"] || takeaway,
      "",
    ].join("\n")
  );

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
    ...(flags["tripwire-note"] ? ["", "## 顺手排掉的细节暗雷", "", `- ${flags["tripwire-note"]}`] : []),
    "",
  ].join("\n");

  const sparkMeta = {
    id: slug,
    type: "spark",
    title,
    domain,
    mastery,
    confidence,
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

  if (flags.project) {
    const pDir = join(PROJECTS_DIR, flags.project);
    if (existsSync(pDir)) {
      const ledgerPath = join(pDir, "ledger.json");
      const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
      ledger.nodes[slug] = {
        mastery,
        depth,
        acceptance: humanVerified ? "embraced" : "unassessed",
        stance_note: "",
        workaround: "",
        confidence,
        attempts: 1,
        last_verdict: humanVerified ? "harvested_battle" : "panorama_mapped",
        retest_required: false,
        evidence_refs: [rawRelPath],
      };
      ledger.updated_at = new Date().toISOString();
      writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);

      if (flags.sector) {
        const panPath = join(pDir, "panorama.json");
        const pan = JSON.parse(readFileSync(panPath, "utf8"));
        const sec = (pan.sectors || []).find((s) => s.id === flags.sector);
        if (sec && !sec.linked_nodes.includes(slug)) {
          sec.linked_nodes.push(slug);
          writeFileSync(panPath, `${JSON.stringify(pan, null, 2)}\n`);
        }
      }
    }
  }

  const statePath = join(LEARNER_DIR, "cognitive-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state.scoreboard.sparks_harvested = (state.scoreboard.sparks_harvested || 0) + 1;
  if (humanVerified) {
    state.calibration_distribution.harvested_battle = (state.calibration_distribution.harvested_battle || 0) + 1;
  } else {
    state.calibration_distribution.panorama_mapped = (state.calibration_distribution.panorama_mapped || 0) + 1;
  }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  recomputeLearnerAggregates();

  appendWikiLog(`子 Agent 收割火花 [[${slug}]]（挂载母法 [[${hub}]]，水位：\`${mastery}\`）。`);
  const graph = buildKnowledgeGraph();
  const notified = await notifyDesktopLlmWikiIfRegistered();

  console.log(
    JSON.stringify(
      {
        ok: true,
        spark_path: relative(ROOT_DIR, sparkPath),
        mastery,
        depth,
        graph_nodes_total: graph.stats.total_nodes,
        graph_edges_total: graph.stats.total_edges,
        llm_wiki_desktop_notified: notified,
      },
      null,
      2
    )
  );
}

function defaultDepthAndMasteryForVerdict(verdict) {
  switch (verdict) {
    case "panorama_mapped":
      return { depth: "L1_panoramic", mastery: "probed", conf: 0.5, retest: false };
    case "calibrated_mastery":
      return { depth: "L2_conversational", mastery: "weapon_unlocked", conf: 0.8, retest: false };
    case "lateral_breakthrough":
      return { depth: "L3_radar_and_bs_proof", mastery: "weapon_unlocked", conf: 0.88, retest: false };
    case "bullshit_exposed":
      return { depth: "L3_radar_and_bs_proof", mastery: "weapon_unlocked", conf: 0.86, retest: false };
    case "xray_spotted":
      return { depth: "L3_radar_and_bs_proof", mastery: "weapon_unlocked", conf: 0.85, retest: false };
    case "sharp_but_tripped":
      return { depth: "L2_conversational", mastery: "probed", conf: 0.58, retest: true };
    case "confident_blindspot":
    case "fooled_by_jargon":
      return { depth: "L1_panoramic", mastery: "probed", conf: 0.45, retest: true };
    case "harvested_battle":
      return { depth: "L4_mastered", mastery: "battle_proven", conf: 0.92, retest: false };
    default:
      throw new Error(`未知 verdict: ${verdict}`);
  }
}

function cmdRecord(projectSlug, flags) {
  const verdict = flags.verdict;
  const evidence = flags.evidence;
  const nodeId = flags.node || null;
  const sectorId = flags.sector || null;

  if (!projectSlug || !verdict || !evidence || (!nodeId && !sectorId)) {
    throw new Error("record 必填参数: <project> (--node <id> 或 --sector <id>) --verdict <v> --evidence <path>");
  }
  if (!VALID_VERDICTS.has(verdict)) {
    throw new Error(`非法 verdict: ${verdict}（可选: ${[...VALID_VERDICTS].join(", ")}）`);
  }
  if (flags.depth && !DEPTH_RANK.hasOwnProperty(flags.depth)) {
    throw new Error(`非法 --depth: ${flags.depth}`);
  }
  if (flags.acceptance && !VALID_ACCEPTANCE.has(flags.acceptance)) {
    throw new Error(`非法 --acceptance: ${flags.acceptance}`);
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

  const ledgerPath = join(pDir, "ledger.json");
  const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
  const derived = defaultDepthAndMasteryForVerdict(verdict);
  const today = new Date().toISOString().slice(0, 10);

  if (sectorId) {
    if (!ledger.sectors?.[sectorId]) {
      throw new Error(`panorama/ledger 中不存在版块: ${sectorId}`);
    }
    const prevSec = ledger.sectors[sectorId];
    const targetDepth = flags.depth || derived.depth;
    const finalSecDepth =
      DEPTH_RANK[targetDepth] > DEPTH_RANK[prevSec.depth || "L0_unseen"] ? targetDepth : prevSec.depth;
    ledger.sectors[sectorId] = {
      depth: finalSecDepth,
      acceptance: flags.acceptance || prevSec.acceptance || "unassessed",
      stance_note: flags["stance-note"] ?? prevSec.stance_note ?? "",
    };
  }

  let mintedPlaybook = null;
  if (nodeId) {
    const pages = scanAllWikiPages();
    const targetPage = pages.find((p) => p.slug === nodeId);
    if (!targetPage || targetPage.parsed.error) {
      throw new Error(`未找到目标知识图谱节点: ${nodeId}`);
    }

    const prevNode = ledger.nodes[nodeId] || {
      mastery: "mapped",
      depth: "L0_unseen",
      acceptance: "unassessed",
      stance_note: "",
      workaround: "",
      confidence: 0.35,
      attempts: 0,
      evidence_refs: [],
    };

    const candidateDepth = flags.depth || derived.depth;
    const nextDepth = derived.retest
      ? candidateDepth
      : DEPTH_RANK[candidateDepth] >= DEPTH_RANK[prevNode.depth || "L0_unseen"]
        ? candidateDepth
        : prevNode.depth;

    const nextMastery =
      MASTERY_RANK[derived.mastery] >= MASTERY_RANK[prevNode.mastery || "mapped"]
        ? derived.mastery
        : prevNode.mastery;
    const effectiveMastery = derived.retest && nextMastery === "weapon_unlocked" ? "probed" : nextMastery;

    const refs = Array.isArray(prevNode.evidence_refs) ? [...prevNode.evidence_refs] : [];
    if (!refs.includes(resolvedEvidence)) refs.push(resolvedEvidence);

    ledger.nodes[nodeId] = {
      mastery: effectiveMastery,
      depth: nextDepth,
      acceptance: flags.acceptance || prevNode.acceptance || "unassessed",
      stance_note: flags["stance-note"] ?? prevNode.stance_note ?? "",
      workaround: flags.workaround ?? prevNode.workaround ?? "",
      confidence: derived.retest ? derived.conf : Math.max(prevNode.confidence || 0, derived.conf),
      attempts: (prevNode.attempts || 0) + 1,
      last_verdict: verdict,
      retest_required: derived.retest,
      evidence_refs: refs,
    };

    if (flags.tripwire && ledger.nodes[flags.tripwire]) {
      ledger.nodes[flags.tripwire].retest_required = true;
    }

    const { meta, body } = targetPage.parsed;
    const wikiRefs = Array.isArray(meta.evidence_refs) ? [...meta.evidence_refs] : [];
    if (!wikiRefs.includes(resolvedEvidence)) wikiRefs.push(resolvedEvidence);
    if (MASTERY_RANK[effectiveMastery] >= MASTERY_RANK[meta.mastery || "mapped"]) {
      meta.mastery = effectiveMastery;
    }
    meta.confidence = Math.max(Number(meta.confidence || 0), ledger.nodes[nodeId].confidence);
    meta.evidence_refs = wikiRefs;
    meta.updated = today;

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
        "## 即战核查三刀",
        "",
        ...points.map((pt, idx) => `${idx + 1}. ${pt}`),
        "",
      ].join("\n");
      writeFileSync(join(WIKI_DIR, "playbooks", `${pbId}.md`), serializeFrontmatter(pbMeta, pbBody));
      meta.edges = Array.isArray(meta.edges) ? meta.edges : [];
      if (!meta.edges.some((e) => e.target === pbId)) {
        meta.edges.push({ rel: "unlocks_weapon", target: pbId });
      }
      meta.related = Array.isArray(meta.related) ? meta.related : [];
      if (!meta.related.includes(pbId)) meta.related.push(pbId);
      ledger.nodes[pbId] = {
        mastery: "weapon_unlocked",
        depth: "L3_radar_and_bs_proof",
        acceptance: "embraced",
        stance_note: "",
        workaround: "",
        confidence: 0.88,
        attempts: 1,
        last_verdict: verdict,
        retest_required: false,
        evidence_refs: [resolvedEvidence],
      };
      mintedPlaybook = pbId;
    }

    writeFileSync(targetPage.fullPath, serializeFrontmatter(meta, body));
  }

  ledger.updated_at = new Date().toISOString();
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);

  const statePath = join(LEARNER_DIR, "cognitive-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  if (verdict !== "panorama_mapped") state.scoreboard.rounds_played += 1;
  if (mintedPlaybook) state.scoreboard.weapons_unlocked += 1;
  if (verdict === "lateral_breakthrough") state.scoreboard.lateral_breakthroughs += 1;
  if (verdict === "bullshit_exposed") state.scoreboard.bullshit_traps_exposed += 1;
  if (derived.retest) state.scoreboard.tripwires_caught += 1;
  state.calibration_distribution[verdict] = (state.calibration_distribution[verdict] || 0) + 1;
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  recomputeLearnerAggregates();

  appendWikiLog(
    `认知记账 [${projectSlug}] ${nodeId ? `[[${nodeId}]]` : sectorId} -> \`${verdict}\`${flags.acceptance ? ` / 接受态:\`${flags.acceptance}\`` : ""}${mintedPlaybook ? `，掉落武器卡 [[${mintedPlaybook}]]` : ""}。`
  );
  buildKnowledgeGraph();
  console.log(
    JSON.stringify(
      {
        ok: true,
        project: projectSlug,
        node: nodeId,
        sector: sectorId,
        verdict,
        updated_entry: nodeId ? ledger.nodes[nodeId] : ledger.sectors[sectorId],
        minted_playbook: mintedPlaybook,
      },
      null,
      2
    )
  );
}

function cmdInit(slug, flags) {
  if (!slug || !/^[a-z0-9][a-z0-9_-]{1,40}$/.test(slug)) {
    throw new Error("请提供合法的立项 slug（小写字母、数字、连字符，如 jack-finance）");
  }
  const pDir = join(PROJECTS_DIR, slug);
  if (existsSync(pDir)) throw new Error(`立项已存在: ${pDir}`);
  mkdirSync(join(pDir, "sessions"), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const title = flags.title || `${slug} 全景快赢立项`;
  const domain = flags.domain || slug;
  const goal = flags.goal || "横向 100% 摸清领域全景版图，纵向掌握平视对话、识破专家忽悠与自主审坑能力";

  writeFileSync(
    join(pDir, "project.json"),
    `${JSON.stringify(
      {
        schema_version: 4,
        slug,
        title,
        domain,
        goal,
        depth_ceiling_rule: "横向 100% 覆盖领域版块，纵向止步于 L3 审坑防骗与 L4 母法破局；L5 执业苦力细节全部交由 AI 代劳。",
        free_jump_enabled: true,
        source_anchors: [],
        created_at: today,
        updated_at: today,
      },
      null,
      2
    )}\n`
  );
  writeFileSync(
    join(pDir, "panorama.json"),
    `${JSON.stringify(
      {
        schema_version: 4,
        slug,
        domain,
        mece_basis: "待由 agent-learn 第 0 步生成该领域 MECE 全景版块",
        sectors: [],
      },
      null,
      2
    )}\n`
  );
  writeFileSync(
    join(pDir, "ledger.json"),
    `${JSON.stringify({ schema_version: 4, slug, sectors: {}, nodes: {}, updated_at: new Date().toISOString() }, null, 2)}\n`
  );
  writeFileSync(join(pDir, "README.md"), `<!-- 文件职责：${title} 立项说明。 -->\n# ${title}\n\n- **领域**：\`${domain}\`\n- **目标**：${goal}\n`);
  writeFileSync(
    join(pDir, "sessions", `${today}-arena.md`),
    `# ${title} 演武场（${today}）\n\n待运行 \`agent-learn\` 生成 \`panorama.json\` 全景地图与首轮对练。\n`
  );
  console.log(`已创建全景学习立项: ${pDir}`);
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
  console.log(
    `已挂载软链接:\n  ${agentsLink} -> ${sourceSkill}\n  ${codexLink} -> ../../.agents/skills/agent-learn`
  );
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
    if (!MASTERY_RANK.hasOwnProperty(meta.mastery)) errors.push(`${p.relPath}: 非法 mastery(${meta.mastery})`);

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
      if (!body.includes("行话")) {
        errors.push(`${p.relPath}: 缺少『行话切口与防忽悠镇场』模块 — 无法支撑与专业人士平视对话`);
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
      if (!VALID_RELS.has(e.rel)) errors.push(`${p.relPath}: 非法语义边类型 (${e.rel})`);
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
    const panPath = join(pDir, "panorama.json");
    const ledgerPath = join(pDir, "ledger.json");
    if (!existsSync(panPath)) errors.push(`projects/${pSlug}: 缺少 panorama.json`);
    if (!existsSync(ledgerPath)) errors.push(`projects/${pSlug}: 缺少 ledger.json`);
    if (!existsSync(panPath) || !existsSync(ledgerPath)) continue;

    const pan = JSON.parse(readFileSync(panPath, "utf8"));
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));

    for (const sec of pan.sectors || []) {
      if (!ledger.sectors?.[sec.id]) {
        errors.push(`projects/${pSlug}/ledger.json: 缺少全景版块 ${sec.id} 的状态记录`);
      }
      for (const ln of sec.linked_nodes || []) {
        if (!slugSet.has(ln)) {
          errors.push(`projects/${pSlug}/panorama.json: 版块 ${sec.id} 引用了不存在的节点 (${ln})`);
        }
      }
    }

    for (const [sid, sInfo] of Object.entries(ledger.sectors || {})) {
      if (!DEPTH_RANK.hasOwnProperty(sInfo.depth)) {
        errors.push(`projects/${pSlug}/ledger.json: 版块 ${sid} 非法 depth (${sInfo.depth})`);
      }
      if (!VALID_ACCEPTANCE.has(sInfo.acceptance)) {
        errors.push(`projects/${pSlug}/ledger.json: 版块 ${sid} 非法 acceptance (${sInfo.acceptance})`);
      }
    }

    for (const [nid, entry] of Object.entries(ledger.nodes || {})) {
      const page = pages.find((x) => x.slug === nid);
      if (!page) {
        errors.push(`projects/${pSlug}/ledger.json: 引用了图谱中不存在的节点 (${nid})`);
        continue;
      }
      if (!DEPTH_RANK.hasOwnProperty(entry.depth)) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} 非法 depth (${entry.depth})`);
      }
      if (!VALID_ACCEPTANCE.has(entry.acceptance)) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} 非法 acceptance (${entry.acceptance})`);
      }
      if (entry.last_verdict && !VALID_VERDICTS.has(entry.last_verdict)) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} 非法 last_verdict (${entry.last_verdict})`);
      }
      if (!page.parsed.error && MASTERY_RANK[page.parsed.meta.mastery] < MASTERY_RANK[entry.mastery]) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} mastery(${entry.mastery}) 高于全局 Wiki 水位`);
      }
      if (entry.mastery === "weapon_unlocked" && entry.retest_required) {
        errors.push(`projects/${pSlug}/ledger.json: 节点 ${nid} 存在未核销暗雷锁，不得标为 weapon_unlocked`);
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
  console.log(
    `[PASS] 星系母法图谱 (${pages.length} 节点)、100% 全景版图、认知×接受度双轴账本、行话切口与 20/80 深度熔断全部通过校验。`
  );
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const sub = positional[0];
  if (!sub || flags.help || flags.h) {
    console.log(
      "用法: node cli/learn.mjs <status|context|graph|harvest|record|build-graph|init|link-skill|lint> [options]"
    );
    return;
  }
  if (sub === "build-graph") {
    const g = buildKnowledgeGraph();
    await notifyDesktopLlmWikiIfRegistered();
    console.log(
      `已编译星系知识图谱: ${g.stats.total_nodes} 节点, ${g.stats.total_edges} 条语义边 (含母法止损墙 ${g.stats.accommodation_walls} 条)`
    );
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
