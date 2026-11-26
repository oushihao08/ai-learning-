# Post-Task Subagent Harvester Protocol

Use when the user asks to dispatch an agent to feed a just-completed work task, bug fix, deal, or authoring batch into `/Users/jack/Documents/codes/lvgou/ai-learning`.

## 1. Subagent Prompt Contract (`invoke_subagent`)

Pass to `invoke_subagent` (`TypeName: "self"`, `Role: "Learning Graph Harvester"`):
- **Completed work scope**: Relevant file paths, diffs, trace summary, or conversation decisions (read-only on source workspace).
- **Target engine root**: `/Users/jack/Documents/codes/lvgou/ai-learning`.
- **Required subagent steps**:
  1. Inspect `/Users/jack/Documents/codes/lvgou/ai-learning/wiki/index.md` and `wiki/master-os/` to locate matching Master-OS hubs (`mos-01`..`mos-04`) and any cross-domain analog nodes (`mm-*`, `fl-*`, `pb-*`, `tw-*`, `sp-*`).
  2. Distill ONLY the **20% reusable decision pattern** and any **hidden tripwire** discovered during the work. Strip project-private secrets, credentials, and 80% low-level boilerplate.
  3. Run:
     ```sh
     node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs harvest \
       --slug "sp-<kebab-slug>" \
       --title "<concise actionable insight title>" \
       --domain "<domain>" \
       --hub "<mos-01..04>" \
       --takeaway "<1-3 sentence transferable decision rule>" \
       --tripwire-note "<optional 1-line detail trap caught>" \
       --leap "<optional existing wiki node id for cross-domain link>" \
       --source-summary "<factual summary of what was solved>" \
       --evidence-ref "<workspace/file or trace ref>"
     ```
  4. Run `node /Users/jack/Documents/codes/lvgou/ai-learning/cli/learn.mjs lint` and verify exit code `0`.
  5. Return a 3-line summary: (1) Created Spark path, (2) Assimilated Master-OS hub & cross-domain graph links, (3) Optional 1-line lateral insight for future reuse.
