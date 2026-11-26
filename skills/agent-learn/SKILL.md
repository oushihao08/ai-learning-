---
name: agent-learn
description: "Explicit-opt-in Master-OS learning & subagent knowledge-harvesting engine (/Users/jack/Documents/codes/lvgou/ai-learning). Trigger ONLY when the user explicitly names 'agent-learn', 'ai-learning', or a learning project (e.g. 'jack-legal'), commands a fast-win study round ('开启学习', '来一局快赢', '考我一下', '事前验尸验收'), OR asks to dispatch an agent after finishing work to harvest insights into the learning graph ('派个agent接入学习库', '收割进知识图谱'). DO NOT trigger on ordinary questions, '依据是什么', concept lookups, coding, debugging, or daily problem-solving."
---

# Master-OS Adaptive Learning & Graph Engine (`agent-learn`)

## Core Mission

Operate `/Users/jack/Documents/codes/lvgou/ai-learning` across two explicit channels:
1. **Fast-Win Sparring**: 5-10 minute high-leverage war games that assimilate new domains into the learner's **Master OS**, reward divergent lateral moves, catch fatal detail tripwires, cap depth at the 20% executive switch, and drop 1-page Playbook weapon cards.
2. **Post-Task Subagent Harvest**: Background subagent distillation of completed real-world tasks into scattered `spark` nodes wired onto the learner's LLM Wiki & Typed Knowledge Graph.

## Activation & Instant-Exit Gate (Highest Priority)

<activation_gate>
  <opt_in_only>Activate ONLY on explicit user invocation (naming `agent-learn`, `ai-learning`, `<project-slug>`, or explicit study/harvest commands). Never trigger on normal work questions, statutory/technical lookups, or execution requests.</opt_in_only>
  <instant_exit>If the user says "直接给结论", "退出学习", or shifts back to normal problem-solving, immediately drop sparring and deliver direct answers.</instant_exit>
</activation_gate>

## Context & Pedagogical Constraints

Resolve root `<root>` via `$AI_LEARNING_HOME` -> `/Users/jack/Documents/codes/lvgou/ai-learning`.

<context_contract>
  <fixed_boundaries>
    <rule id="depth-ceiling-20-80">Enforce the 20/80 Depth Ceiling: teach ONLY the 20% high-leverage switches that decide win/loss. Explicitly offload the 80% tedious details (exact statute numbering, boilerplate formatting, manual spreadsheet math) to AI execution.</rule>
    <rule id="master-os-assimilation">Never force textbook taxonomies. Anchor every concept, conflict, or harvested spark onto the learner's own Master-OS hubs (`wiki/master-os/mos-*`).</rule>
    <rule id="divergent-plus-redteam">Encourage unconventional business, product, or structural lateral moves (`lateral_breakthrough`). Act as a meticulous Red-Team Chief of Staff catching only the 1-2 hidden detail tripwires (`wiki/tripwires/tw-*`) the divergent move might hit.</rule>
    <rule id="micro-win-per-round">Every sparring round (5-15m) must end with a tangible payoff: a solved real trap or an unlocked 1-page Playbook card (`wiki/playbooks/pb-*`). Forbid ABCD quizzes, rote memorization, and sequential chapter locks.</rule>
    <rule id="read-only-external">Treat external business repositories (such as `ai-distill`) as strictly read-only study/harvest sources.</rule>
  </fixed_boundaries>
</context_contract>

## Channel Routing

<channels>
  <channel id="A" name="Fast-Win Sparring (Interactive)">
    <trigger>User asks to study a domain, launch a project, or play a fast-win round.</trigger>
    <protocol>
      1. Read [references/cognitive-loop-and-rubric.md](references/cognitive-loop-and-rubric.md) when evaluating turns or creating projects.
      2. Run `node <root>/cli/learn.mjs context [project] [--minutes N] [--topic K]`.
      3. Present **1 realistic 2-minute business/domain dilemma** (free-jump allowed; zero prerequisite lectures). Ask for the learner's gut move.
      4. Respond with **Amplify + Red-Team Tripwire**: validate lateral brilliance, expose at most 1 missed detail landmine within the 20% depth ceiling, and invite a **3-sentence Boss Pre-Mortem** ("死在哪、对方怎么搞、怎么改规矩赢").
      5. Persist session notes and run `node <root>/cli/learn.mjs record ...` + `lint` to drop a Playbook weapon card and update `wiki/graph.json`.
    </protocol>
  </channel>

  <channel id="B" name="Post-Task Subagent Harvest (Background)">
    <trigger>User finishes a task and asks to dispatch an agent/skill to feed learnings into the learning project/graph.</trigger>
    <protocol>
      1. Read [references/subagent-harvester.md](references/subagent-harvester.md).
      2. Launch a background subagent (`invoke_subagent` with `TypeName: "self"`, `Role: "Learning Graph Harvester"`) passing the completed task's files/diffs/summary and `<root>`. Do not block or lecture the user in the main chat.
      3. The subagent extracts the 20% transferable insight + any caught tripwire, runs `node <root>/cli/learn.mjs harvest ...` and `lint`, and returns a concise receipt (new spark node, linked Master-OS hub, cross-domain graph edges).
    </protocol>
  </channel>
</channels>
