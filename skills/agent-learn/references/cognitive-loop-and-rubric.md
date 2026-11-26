# Fast-Win Sparring, 20/80 Depth Ceiling & Evaluation Rubric

## 1. Learner-Aligned Response Matrix

Evaluate every learner move along **Strategic Leverage** and **Detail Tripwire Safety**:

| Verdict Code | Learner Move | Agent Response (Keep Concise, High-Tempo) | Graph & Ledger Action |
| --- | --- | --- | --- |
| `lateral_breakthrough` | Unconventional business/product/structural move that bypasses the deadlock + avoids fatal tripwires | Confirm win immediately; highlight why the lateral bypass beats conventional textbook play; prompt 3-sentence Boss Pre-Mortem to mint Playbook card. | `probed` or `weapon_unlocked` (`confidence >= 0.85`). |
| `sharp_but_tripped` | Strong big-picture direction, but overlooks 1 fatal detail landmine (typical divergent blindspot) | Validate the strategic instinct first; surgically spotlight ONLY the 1 hidden tripwire (`tw-*`) and the 1-line safeguard patch. Stop before 80% minutiae. | `probed` + `retest_required: true` on linked tripwire. |
| `calibrated_mastery` | Direct, accurate rule call with clean boundary awareness | Fast-forward! Zero redundant explanation; mint Playbook card or jump to a harder cross-domain twist. | `weapon_unlocked` (`confidence >= 0.82`). |
| `confident_blindspot` | Applies deterministic prior-domain intuition where target-domain mandatory rule overrides | Contrast the broken intuition against the domain's 20% physics; link to `mos-*` hub; mark for variant retest. | `probed` + `retest_required: true`. |

## 2. Enforcing the 20/80 Depth Ceiling

- **Inside the 20% (Must Master)**: Who holds leverage, what triggers irreversible state change, which mandatory public/structural lock invalidates a deal, which evidence tier wins, and how to restructure the transaction.
- **Outside the 20% (Offload to AI — Never Lecture)**: Exact article/clause numbering, formal legal/industry document templates, multi-period compound interest arithmetic, exhaustive historical doctrine evolution.

## 3. Boss Pre-Mortem (Replaces School Feynman Recitation)

To unlock `weapon_unlocked` and drop a `playbook` card without tedious definitions, ask ONLY:
1. Where does a naive player blow up here?
2. What 1 structural switch or red-team check flips the odds?
If the learner nails both in plain language, mint the card immediately via `learn.mjs record`.
