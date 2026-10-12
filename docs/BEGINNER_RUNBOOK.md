# Beginner Runbook — Git, GitHub & Vercel for Ivera

Written for someone who isn't a professional developer. This explains the words you'll see in PRs, Vercel emails, and Claude's messages about this project.

## The core idea

Your code lives in two places:
- **GitHub** — the permanent, official copy of every file, plus the full history of every change ever made.
- **Vercel** — watches GitHub and automatically turns your code into a live website.

## Key terms

- **Branch** — a parallel, safe copy of the code to make changes in, without touching the real site. `main` is the special branch that *is* your live production site.
- **Commit** — one saved "snapshot" of changes, with a short description of what changed and why.
- **Pull Request (PR)** — a request to merge a branch's changes into `main`. This is the "review gate" — nothing reaches your real site without going through a PR.
- **Preview deployment** — every PR automatically gets its own temporary, fully-working website URL (via Vercel) so you can click around and test before anything goes live. Look for a comment from the "vercel" bot on the PR with a "Preview" link.
- **Merge** — clicking the button that moves a PR's changes into `main`. Within a minute or two, Vercel redeploys your real site with those changes.

## How to review a PR (no coding needed)

1. Open the PR on GitHub — read its description, which explains what changed and why in plain language.
2. Find the Vercel bot's comment and click the **Preview** link — this is a real, working version of the site with just that PR's changes.
3. Click around on your phone and on a computer. Try the thing that changed.
4. If it looks right, tell whoever's helping you ("looks good, merge it") or click the green "Merge pull request" button yourself.
5. Wait ~1-2 minutes, then check your real site (ivera.info) — it should now reflect the change.

## If something goes wrong after a merge

You don't need to "undo" anything in the code. Go to:
**Vercel dashboard → your project → Deployments tab** → find the deployment from *before* the problem → click its three-dot menu → **"Promote to Production."** Your site instantly goes back to the working version. You can sort this out calmly afterward — there's no rush and no data loss from doing this.

## Where to find things mentioned in audit reports

- `docs/audits/` — technical findings, organized by topic (functional, security, tests, deployment, known issues).
- `docs/audits/KNOWN_ISSUES.md` — the short list of things that need **your** decision, not just a code fix. Start here if you only read one file.
- `docs/audits/DEPLOYMENT_CHECKLIST.md` — exact steps for checking your live Supabase/Vercel settings.

## Running things yourself (optional, needs a terminal)

If you ever want to check the project's health yourself without asking for help:

```bash
cd Ivera-web-app
npm ci              # (only needed once, or after dependencies change)
npm test             # should print "23 passed"
npm run build         # should finish with no red errors
```
