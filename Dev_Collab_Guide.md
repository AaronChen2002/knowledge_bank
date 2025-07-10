✨ Goals
Enable clean, fast collaboration between devs 

Prevent merge conflicts and context loss

Make sure Cursor stays aligned per branch and per feature

Keep the repo organized, readable, and stable

🪵 1. Branching Strategy
Rule	Description
🧪 Feature branches	Create a new branch for each feature or bugfix:
feature/ingest-ui, fix/search-bug
💬 Descriptive names	Keep names short but meaningful — use hyphens
🚀 Never push directly to main	Always work in branches and create PRs (even if WIP)
🧼 Delete branches after merge	Keeps things clean

🔁 3. PR Workflow
Create a feature branch:
git checkout -b feature/vault-tab

Write code (use Cursor for scaffolding as needed)

Commit frequently:
git commit -m "feat: basic Vault tab layout"

Push your branch:
git push origin feature/vault-tab

Open a PR titled:
✨ Vault Tab UI

Tag the other person as a reviewer (@aaronchen, etc.)

