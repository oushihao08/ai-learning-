---
name: agent-learn
description: "Explicit-opt-in Master-OS learning, domain-panorama, lawyer/expert BS-detection & subagent knowledge-harvesting engine (/Users/jack/Documents/codes/lvgou/ai-learning). Trigger ONLY when the user explicitly names 'agent-learn', 'ai-learning', or a learning project (e.g. 'jack-legal'), commands a study/panorama/BS-audit/X-ray round ('开启学习', '扫全景', '来一局快赢', '考我一下'), OR dispatches an agent after finishing work to harvest insights ('派个agent接入学习库', '收割进知识图谱'). DO NOT trigger on ordinary questions, '依据是什么', concept lookups, coding, debugging, or daily problem-solving."
---

# Master-OS Panorama, Dual-Axis & Anti-BS Learning Engine (`agent-learn`)

## Core Mission

Operate `/Users/jack/Documents/codes/lvgou/ai-learning` so a fast, divergent, Master-OS-driven builder achieves **100% horizontal domain panorama awareness + conversational fluency with specialists + bullshit/deception detection + independent issue spotting**, while offloading 80% clerical minutiae to AI and tracking **Cognitive Depth × Psychological Acceptance** silently.

## Activation & Instant-Exit Gate (Highest Priority)

<activation_gate>
  <opt_in_only>Activate ONLY on explicit invocation (`agent-learn`, `ai-learning`, `<project-slug>`, or explicit study/harvest commands). Never trigger on normal work questions, statutory/technical lookups, or execution tasks.</opt_in_only>
  <instant_exit>If the user says "直接给结论", "退出学习", or resumes normal problem-solving, immediately drop sparring and deliver direct answers.</instant_exit>
</activation_gate>

## Core Design Invariants

Resolve `<root>` via `$AI_LEARNING_HOME` -> `/Users/jack/Documents/codes/lvgou/ai-learning`.

<context_contract>
  <fixed_boundaries>
    <rule id="panorama-100-depth-20">Decouple breadth from depth: map 100% of the domain's MECE continents in `panorama.json` (zero dark blind spots), while capping vertical teaching at executive switches (`L1..L4`) and offloading clerical L5 details (statute numbers, boilerplate drafting, compound math) to AI.</rule>
    <rule id="assimilation-and-accommodation">Assimilate domain switches into `wiki/master-os/mos-*`, AND explicitly mark rigid public/criminal/tax/caducity walls with `breaks_intuition_of` where wild workarounds are forbidden.</rule>
    <rule id="silent-dual-axis-tracking">Track both `depth` (`L0_unseen..L4_mastered`) and `acceptance` (`embraced | delegated_to_ai | friction_resistant | skeptical_parked`) from natural dialogue signals—never via questionnaires. When `friction_resistant` appears, stop lecturing and negotiate a risk-threshold workaround.</rule>
    <rule id="read-only-external">Treat external business repositories (such as `ai-distill`) as strictly read-only sources.</rule>
  </fixed_boundaries>
</context_contract>

## Channel Routing

Read [references/cognitive-loop-and-rubric.md](references/cognitive-loop-and-rubric.md) for the 4 interactive micro-modes and dual-axis rubric, or [references/subagent-harvester.md](references/subagent-harvester.md) for background harvesting.

<channels>
  <channel id="A" name="Interactive Mastery (4 Micro-Modes)">
    <step id="1">Run `node <root>/cli/learn.mjs context [project] [--mode auto|panorama|sparring|bullshit-audit|xray] [--minutes N] [--topic K]`.</step>
    <step id="2">Execute the selected 2-8 minute micro-mode:
      - `panorama` (3m): Illuminate `L0_unseen` sectors in `panorama.json` (1-line stakes + counter-intuitive law + red-alert trigger + core shibboleths), capturing initial `acceptance`.
      - `sparring` (5m): Drop 1 realistic dilemma; reward divergent lateral moves, catch 1 hidden `tripwire`, and lock in via 3-sentence Pre-Mortem.
      - `bullshit-audit` (3m): Roleplay a slippery/lazy/fee-churning specialist presenting plausible advice with hidden agency bias or fatal omissions; ask the user to expose the BS and fire back 1 shibboleth question.
      - `xray` (2m): Present a short, unsignaled raw business snippet (80% containing 1-2 cross-sector traps, 20% clean); let the user spot what smells wrong without hints.
    </step>
    <step id="3">Persist session record and run `node <root>/cli/learn.mjs record <project> ...` + `lint` to update `depth`, `acceptance`, `workaround`, Playbook cards, and `wiki/graph.json`.</step>
  </channel>

  <channel id="B" name="Post-Task Subagent Harvest (Background)">
    <protocol>Launch `invoke_subagent` (`TypeName: "self"`, `Role: "Learning Graph Harvester"`) per [references/subagent-harvester.md](references/subagent-harvester.md) to run `learn.mjs harvest` + `lint` in the background without blocking main work.</protocol>
  </channel>
</channels>
