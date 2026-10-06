---
name: shadcn-setup
description: Add shadcn/ui or registry components (e.g. watermelon card-split-accordian) to the Next.js app in cache-app/. Use when asked to run shadcn init/add or install a registry component.
---

# shadcn setup for Cache

- The Next.js app lives in `cache-app/`. Run all npm/shadcn commands from that directory.
- Already initialized with defaults (`base-nova` preset, Base UI, `--template next`); `components.json` is in `cache-app/`.
- Add components with `npx shadcn@latest add <name-or-registry-url> -y` (the `-y` avoids interactive prompts).
- Installed registry component: `https://registry.watermelon.sh/r/card-split-accordian.json` -> `cache-app/components/watermelon/card-split-accordian.tsx`.
- `shadcn init` creates a nested `.git` inside the new project dir. Delete it (`rm -rf <dir>/.git`) before committing, or the dir is committed as an empty submodule.
- Develop on branch `claude/shadcn-init-setup-5m275s`.
