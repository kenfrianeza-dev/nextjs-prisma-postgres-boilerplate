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