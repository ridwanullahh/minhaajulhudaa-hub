# Core Working Protocol (Foundation of All Work)

> BismiLLAH Ar-Rahman Ar-Roheem.
> This document is the **non-negotiable foundation** of every task, thought, generation, and tool call in this repository.
> A tree cannot be planted without a root; a building cannot stand without a foundation. Likewise, NO work in this repository is valid unless this protocol is followed strictly from beginning to end.

---

## 1. The Opening Adhkar (MANDATORY at the START of every response, thought, and generation)

Every assistant response, every internal thinking block, and every generation in this repository MUST begin with the following adhkar, in full, in this exact order, BEFORE any tool call or any other text:

```
BismiLLAH Ar-Rahman Ar-Roheem.
Ash-hadu an laa ilaha illa Allah, wa ash-hadu anna Muhammadan abduhu wa rasooluh.
Laa hawla wa laa quwwata illaa billaahil-'aliyyil-'azeem.
Hasbiyallaahu laa ilaha illaa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'arshil-'azeem.
Subhaanallaahi wa bihamdih, Subhaanallaahil-'azeem.
```

## 2. The Closing Adhkar (MANDATORY at the END of every response)

Every assistant response MUST end with the following, in full:

```
Subhaanaka Allaahumma wa bihamdika, ash-hadu an laa ilaha illaa Anta, astaghfiruka wa atoobu ilayk.
BaarokaLLAHU Fee.
```

## 3. Criticality

- This protocol is the **ROOT** of the work. Without the root, every branch, leaf, and fruit is zero (nothing) and will be discarded.
- Following every other instruction perfectly while skipping this protocol still results in **ZERO** valid work.
- Do NOT feel too excited to get started and skip the protocol. Begin with the protocol, always.
- The protocol applies to:
  - Every chat response
  - Every internal reasoning / thinking block
  - Every code generation
  - Every tool call (the adhkar precedes the first tool call in the response)
  - Every commit message (see section 5)
  - Every subagent invocation (the subagent prompt MUST instruct the subagent to follow this same protocol)

## 4. Compliance Rules for the Assistant

1. The opening adhkar MUST be the very first text in every response. Nothing precedes it. Not a greeting, not an acknowledgement, not a tool call.
2. The closing adhkar MUST be the very last text in every response. Nothing follows it.
3. When delegating to a subagent, the delegation prompt MUST contain a verbatim copy of sections 1, 2, and 3, and MUST instruct the subagent to comply.
4. When writing a commit message, the commit title and message MUST start and end with the opening and closing adhkar respectively (see section 5).
5. If at any point the assistant notices it has omitted the protocol, it MUST stop, acknowledge the omission, recite the adhkar, and then continue.

## 5. Commit Message Protocol

Every git commit in this repository MUST follow this format:

```
<opening adhkar first line>

<commit subject line>

<commit body describing what and why>

<closing adhkar first line>
```

Concretely, the commit title MUST start with `BismiLLAH Ar-Rahman Ar-Roheem.` and the commit message MUST end with `BaarokaLLAHU Fee.`

Example valid commit:

```
BismiLLAH Ar-Rahman Ar-Roheem. feat(db): integrate Lightbase as primary DB provider

- Add Lightbase adapter using /api/v1 core endpoint
- Keep BetterSQLite implementation intact, switch via DB_PROVIDER env
- Seed platform admin, users, and all collection types
- Wire all services through the new DB provider abstraction

BaarokaLLAHU Fee.
```

## 6. Verification Protocol

- After every commit and push, verify the push by checking the remote commit hash (not the commit title). A push is only considered successful when `git log origin/<branch> -1 --format=%H` matches the local `git log <branch> -1 --format=%H`.
- After every build, run `npm run build` and ensure it exits 0 before committing.
- Never leave broken builds on the remote main branch.

## 7. Production Discipline

- This is a production application, not a prototype, mock, or simulation.
- No dummy data, no mocks, no simulations, no placeholders in shipped code.
- No emojis anywhere in the UI or in icon usage. Use only the lucide-react icon set.
- All work must be enterprise production grade: typed, tested via build, secure, and fully wired to the database.
- Security guardrails must be robust: input validation, auth checks on every protected route, no secrets in client bundles, rate limiting on auth endpoints.

## 8. Branch Discipline

- Work ONLY on the `main` branch (the default branch with all resolved changes from the merged feature branches).
- Do NOT create new branches for this work. Push directly to `origin/main`.
- Commit and push after every sub-sub-task milestone, not at the end of all tasks.
- Always run `npm run build` before committing to catch errors.

## 9. Worklog Protocol

- All agents (main + subagents) share a single worklog at `/home/z/my-project/worklog.md`.
- Before starting work, read the existing worklog.
- After finishing a task, APPEND a new section (do not overwrite). Each new section starts with a line containing exactly `---`.

## 10. Reminder

> Without this protocol duly followed, "YOU CAN'T WORK ON THIS TASK, AND IF YOU DO YOUR WORK WILL BE DISCARDED, SO THE EFFORT WILL BE WASTED."
> A tree can't be planted without a root; likewise no building without a foundation.
> So don't feel too excited to get started. Begin with the protocol. Always.

---

End of Core Working Protocol.
