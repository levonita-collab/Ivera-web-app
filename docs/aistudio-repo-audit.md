# Google AI Studio Repository Audit

**Status:** Template — awaiting repository access  
**Repository mentioned:** `ivera_googleaistudio_app` / `Aistudio`  
**Purpose:** Audit before any code is ported to the main Ivera app

---

## ⚠️ Pre-Audit Rules

- Do NOT copy any code before completing this audit
- Do NOT commit any API keys found in the repo
- Do NOT install new packages without checking compatibility
- Do NOT merge AI Studio code directly — port selectively after review

---

## Audit Checklist

When access to the repository is available, fill in each section below.

### 1. Project Basics

- [ ] **Framework**: (Next.js / React / Vite / plain HTML?)
- [ ] **TypeScript**: (Yes / No / Partial)
- [ ] **Node version**: (check `.nvmrc`, `engines` in `package.json`)
- [ ] **Package manager**: (npm / yarn / pnpm)

```
# Check package.json
cat package.json | jq '{name, version, dependencies, devDependencies}'
```

---

### 2. API Key Handling — CRITICAL

- [ ] Is `GEMINI_API_KEY` or equivalent key in any frontend file?
- [ ] Is the key in any `.env` file that might be committed?
- [ ] Does `.gitignore` exclude `.env.local` and `.env`?
- [ ] Is the key passed to a `NEXT_PUBLIC_*` variable?

```
# Scan for exposed keys
grep -rn "NEXT_PUBLIC.*GEMINI\|NEXT_PUBLIC.*API_KEY\|AIza\|AQ\." src/ --include="*.ts" --include="*.tsx" --include="*.js"
grep -rn "GEMINI\|AIza" .env* 2>/dev/null
```

**Risk level**: 🔴 HIGH if any key is found in a `NEXT_PUBLIC_*` var or committed `.env` file.

---

### 3. Gemini Integration

- [ ] Which Gemini model is used? (`gemini-1.5-flash` / `gemini-pro` / `gemini-1.5-pro` / other)
- [ ] Is it via REST API or `@google/generative-ai` SDK?
- [ ] Is the call client-side or server-side?
- [ ] Are there timeout guards?
- [ ] Are there fallback responses when API fails?

```
grep -rn "generativelanguage.googleapis.com\|@google/generative-ai\|genai\|generateContent" src/
```

**Port if:** Server-side, has fallbacks, uses a supported model  
**Do NOT port if:** Client-side (would expose key to browser)

---

### 4. Prompt Logic

List each prompt found and evaluate:

| Prompt name/purpose | Quality | Worth porting? | Notes |
|---|---|---|---|
| (fill in) | | | |

Check for:
- System prompts
- Few-shot examples
- Role instructions
- Output format constraints (JSON, word limits)
- Cultural/brand tone guidance

---

### 5. UI Components

List UI components that might be useful:

| Component | Purpose | Compatible with dark theme? | Worth porting? |
|---|---|---|---|
| (fill in) | | | |

Check for:
- Mobile-first layout
- Tailwind usage (check version — must match v4)
- Framer Motion usage
- Dark/light theme support (Ivera uses dark `#0F0C07` background)

---

### 6. Image Upload / Poster Logic

- [ ] Is there image upload functionality?
- [ ] Is it used for Gemini Vision (photo analysis)?
- [ ] What storage does it use? (Supabase Storage / Firebase / local?)
- [ ] What format does it send images to Gemini? (base64 / URL?)
- [ ] Any file size or type restrictions?

This would be useful for a future **Photo Proof Validator** feature (not yet implemented in Ivera).

---

### 7. Environment Variables

List all env variables used:

| Variable name | Purpose | NEXT_PUBLIC? | Risk |
|---|---|---|---|
| (fill in) | | | |

Mark any `NEXT_PUBLIC_*` variables that contain secrets as **CRITICAL RISK**.

---

### 8. Compatibility Assessment

| Aspect | AI Studio repo | Ivera app | Compatible? |
|---|---|---|---|
| Next.js version | (check) | 16.2.6 | ? |
| React version | (check) | 19 | ? |
| Tailwind version | (check) | v4 (CSS-first) | ? |
| TypeScript | (check) | Strict | ? |
| Supabase | (check) | v2 | ? |

---

## Integration Plan Template

Fill in after completing the audit above.

### Files SAFE to port
*(List specific files, functions, or prompt strings that can be safely copied)*

- [ ] Example: `src/lib/ai/prompts/imageAnalysis.ts` — server-side only, no key exposure

### Files to NOT port
*(List files that are risky or incompatible)*

- [ ] Example: `components/GeminiChat.tsx` — calls Gemini client-side

### Packages to add (if needed)
*(List any new npm packages required and check for conflicts)*

- [ ] Check: does version conflict with any existing package?

### Migration steps
*(Ordered list of porting steps once audit is approved)*

1. ...
2. ...

---

## Sign-off

Before porting any code, get approval from the owner confirming:

- [ ] API keys are not exposed in the AI Studio repo
- [ ] Ported code is server-side only
- [ ] No new frontend API key exposure is introduced
- [ ] Build passes after porting

**Audited by:** _______________  
**Date:** _______________  
**Approved to port:** Yes / No / Partial (specify)
