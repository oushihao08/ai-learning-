# Four Micro-Modes, Dual-Axis Rubric & Anti-BS Protocol

## 1. Orthogonal Dual-Axis State Machine (`depth` × `acceptance`)

### Axis A: Cognitive Depth (`depth`)
| Level | Meaning | Target Capability |
| --- | --- | --- |
| `L0_unseen` | Unmapped dark sector | Unknown unknown; must clear via `panorama` sweep first. |
| `L1_panoramic` | Bird's-eye orientation | Knows what business life/death this sector governs, its 1 counter-intuitive law, and when to hit the brakes. |
| `L2_conversational` | Interactional fluency | Understands core shibboleths (insider jargon <-> business reality); speaks on equal footing with specialists. |
| `L3_radar_and_bs_proof` | Autonomous spotting & anti-deception | Spots unprompted traps in raw snippets (`xray`) AND exposes specialist fee-churning/hedging/omissions (`bullshit-audit`). |
| `L4_mastered` | Master-OS ownership | Verified in real business execution or cross-domain structural redesign. |

### Axis B: Psychological Acceptance (`acceptance` — Implicitly Inferred, Zero Surveys)
| Stance | Natural Dialogue Signal | Mandatory Agent Adaptation |
| --- | --- | --- |
| `embraced` | Immediate buy-in; applies to own projects | Fast-forward; mint Playbook card and wire cross-domain links. |
| `delegated_to_ai` | "Makes sense, but too tedious—let AI check this" | Stop quizzing mechanics; register in `delegated_ai_gates` and only test executive sign-off criteria. |
| `friction_resistant` | "Too bureaucratic / kills deal speed / counter-intuitive!" | **Halt legalistic lecturing immediately.** Co-design a tiered threshold `workaround` (e.g. `<50w skip/personal guarantee; >=50w mandatory check`) and schedule disguised `xray` retests. |
| `skeptical_parked` | "Not worth the cost at my stage; I'll take the risk" | Record informed risk stance; do not nag. |

## 2. Verdict-to-Ledger Mapping (`learn.mjs record`)

| Verdict | Mode Source | Default Depth Target | Retest Lock |
| --- | --- | --- | --- |
| `panorama_mapped` | `panorama` | `L1_panoramic` | `false` |
| `lateral_breakthrough` | `sparring` | `L3_radar_and_bs_proof` (or `L4` with real deal) | `false` |
| `calibrated_mastery` | `sparring` | `L2_conversational` -> `L3_radar_and_bs_proof` | `false` |
| `bullshit_exposed` | `bullshit-audit` | `L3_radar_and_bs_proof` | `false` |
| `xray_spotted` | `xray` | `L3_radar_and_bs_proof` | `false` |
| `sharp_but_tripped` | `sparring` / `xray` | `L2_conversational` | `true` (locks `--tripwire`) |
| `confident_blindspot` | `sparring` / `xray` | `L1_panoramic` | `true` |
| `fooled_by_jargon` | `bullshit-audit` | `L1_panoramic` | `true` |
