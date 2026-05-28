## 🛠️ Branching & Pull Request Guidelines

To keep our repository organized and maintainable, please follow these branching and PR conventions when contributing to the project.

### 1. The Core Prefixes
Use these prefixes to categorize the *intent* of your branch:

* **`feature/`** or **`feat/`**: For building new additions to the project.
  * *Example:* `feat/student-dashboard-ui`
* **`bugfix/`** or **`fix/`**: For fixing issues in the development code.
  * *Example:* `fix/laravel-migration-error`
* **`hotfix/`**: Strictly for urgent fixes that need to go directly to production.
  * *Example:* `hotfix/db-index-timeout`
* **`chore/`**: For routine tasks, dependency updates, or configuration changes that don't directly affect user-facing code.
  * *Example:* `chore/update-npm-packages`
* **`refactor/`**: For restructuring existing code without changing its external behavior.
  * *Example:* `refactor/api-response-handling`
* **`docs/`**: For updates to the README or inline documentation.
  * *Example:* `docs/setup-instructions`

---

### 2. Formatting Rules
To keep things unified across different developers' machines, please adhere to these ground rules:

* **Lowercase only:** Avoid camelCase or PascalCase to prevent case-sensitivity issues across different operating systems.
* **Use hyphens (`-`):** Separate words with hyphens instead of underscores (`_`) or slashes (`/`), aside from the initial prefix slash.
* **Keep it descriptive but concise:** The name should summarize the work so anyone reviewing the repository can understand it at a glance. 
  * ❌ *Bad:* `fix/bug` or `feature/my-work`
  * ✅ *Good:* `fix/react-hook-rendering` or `feat/faq-settings-module`

---

### 3. The Main Branches
Alongside the working branches above, this repository uses standard long-lived branches:

* **`main`**: The production-ready state of our application. **Nobody commits directly to this branch.** Code only gets here via Pull Requests (PRs).
* **`develop`** (or **`dev`**): The integration branch. All `feature/` and `fix/` branches get merged here first for testing before pushing a release to `main`.

---

### 4. Opening a Pull Request (PR)
When your branch is ready, push it to GitHub and open a Pull Request against the `develop` branch (or `main` if it's a hotfix). 

Since we are keeping things lightweight without a separate task tracker, your PR description is our main source of project documentation. Please include a brief summary:

* **What this does:** (e.g., "Adds the Google login button to the navbar.")
* **Why it's needed:** (e.g., "Users requested an easier way to sign in.")
* **How to test it:** (e.g., "Click the login button and ensure it redirects to the dashboard.")

*(Note: If we adopt a task tracker in the future, please include the ticket number in your branch name. Example: `feat/ISSUE-42-admin-auth-guard`)*

---

## ✍️ Commit Message Guidelines

All commits must follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. This keeps the git history readable, makes it easy to scan what changed at a glance, and enables future automation (changelogs, releases, etc.).

---

### 5. Commit Message Format

Every commit message must follow this structure:

```
<type>[(optional scope)]: <short description>

[optional body]

[optional footer(s)]
```

* The **type** and **description** are **required**.
* The **scope**, **body**, and **footer** are optional but encouraged for non-trivial changes.

---

### 6. Commit Types

Use one of the following types to categorize each commit:

| Type | When to Use | Example |
|---|---|---|
| `feat` | Introducing a new feature or user-facing capability | `feat: add cookie chunking for large session payloads` |
| `fix` | Fixing a bug or broken behavior | `fix: resolve hydration inconsistency in settings page` |
| `refactor` | Restructuring code without changing behavior | `refactor: modularize navigation config into directory structure` |
| `docs` | Changes to documentation only (README, comments, etc.) | `docs: update project structure overview in README` |
| `chore` | Maintenance tasks — deps, config, tooling, scripts | `chore: remove db seed command from docker-compose startup` |
| `style` | Visual/UI-only changes with no logic impact | `style: refine badge component styling and icon variants` |
| `test` | Adding or updating tests | `test: add Vitest coverage for user management module` |
| `perf` | Performance improvements | `perf: lazy-load role permissions on dashboard mount` |
| `ci` | CI/CD pipeline or workflow changes | `ci: add lint step to GitHub Actions workflow` |
| `revert` | Reverting a previous commit | `revert: feat: add experimental drag-and-drop table` |

---

### 7. Using Scopes (Optional but Recommended)

A **scope** narrows down *which part of the codebase* the commit affects. It is written in parentheses after the type:

```
feat(auth): implement direct user permissions alongside role-based assignments
refactor(user-management): refactor module with Vitest setup and Zustand state
chore(docker): automate database migrations and seeding in docker-compose
```

Use the module, feature, or layer name as the scope (e.g., `auth`, `user-management`, `settings`, `roles`, `dashboard`, `docker`, `api`).

---

### 8. Writing a Good Description

The short description (the part after the colon) is the most important part of your commit message.

* **Use the imperative mood** — write it as a command, as if completing the sentence *"This commit will…"*
  * ✅ `feat: add switch component for boolean settings`
  * ❌ `feat: added switch component` or `feat: adding switch component`
* **Start with a lowercase letter.**
* **Do not end with a period.**
* **Keep it under 72 characters** so it displays cleanly in git logs and GitHub.

---

### 9. Examples from This Repository

The following are real examples from this project's commit history that follow these conventions correctly:

```
feat: add middle name, suffix, and phone number fields to user profile
refactor: modularize roles-and-permissions client into feature-based components
docs: add CONTRIBUTING.md with branching and pull request guidelines
chore: remove db seed command from docker-compose startup sequence
style: refine UI components with new badge variants and optimized icons
feat(auth): implement direct user permissions and refine permission engine
feat(user-management): sync direct vs inherited permissions and ensure cache consistency
refactor: migrate shared components to a centralized directory and reorganize admin module structure
```

---

### 10. Commit Message Checklist

Before committing, verify:

- [ ] The type correctly reflects the intent of the change.
- [ ] The description uses the imperative mood and is under 72 characters.
- [ ] A scope is included if the change is isolated to a specific module.
- [ ] No period at the end of the description.
- [ ] Breaking changes are noted with a `BREAKING CHANGE:` footer or a `!` after the type (e.g., `refactor!: rename API response shape`).

---

> [!NOTE]
> Heads up — older commits in this repo don't always follow this format. These guidelines were written after the project was already underway, so the history is a bit inconsistent. That's fine. From here on out, this is the standard.