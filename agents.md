# AGENTS.md — Development Rules

## 1. Terminal Usage
- Always use **CMD (Command Prompt)** for terminal commands.
- Do not use PowerShell or Git Bash.
- Use CMD-compatible commands and syntax.

## 2. Git & Build Restrictions
- Never run `git push` unless I explicitly instruct you to.
- Never run production builds (`npm run build`) unless I explicitly instruct you to.
- Never commit, push, or deploy changes without my permission.
- Ask for permission before performing any restricted operation.

## 3. Strict Scope Control
- Work only on the specific feature, component, file, or task I request.
- Never modify the entire codebase to implement a small feature.
- Do not touch unrelated files, pages, components, styles, or configurations.
- Preserve the existing project architecture, coding style, and functionality.
- Avoid unnecessary refactoring, dependency installation, or code cleanup.
- Before modifying files, identify which files need changes and why.
- If the task requires changes outside the requested scope, explain why and ask for permission first.

## 4. Explain After Every Task
After completing each task, provide a simple explanation covering:
- What you changed.
- Which files you modified.
- Why those changes were necessary.
- How the code works.
- How the feature works inside the overall project.

Use simple, beginner-friendly language without unnecessary technical jargon.

## 5. Line-by-Line Code Learning
- I want to understand every line of code you write or modify.
- Explain new or modified code line by line in simple language.
- Explain important variables, functions, conditions, loops, hooks, API calls, and database operations.
- Do not skip code explanations just because the implementation seems simple.
- When modifying existing code, explain the relevant changes instead of unnecessarily explaining unrelated code.

## 6. Explain the Project Workflow
For every implemented feature, explain its complete workflow:
1. How the user interacts with the UI.
2. How the frontend handles the action.
3. How the API request is sent (if applicable).
4. How the backend processes the request.
5. How the database stores or retrieves the data (if applicable).
6. How the response returns to the frontend.
7. How the final result appears to the user.

## 7. Implementation Guidelines
- Understand the existing code before making changes.
- Prefer small, incremental, easy-to-understand implementations.
- Prioritize functionality over unnecessary UI improvements.
- Reuse existing components, functions, and utilities when appropriate.
- Do not introduce new libraries without explaining why they are needed.
- If requirements are unclear, ask me before making assumptions.
- Do not silently make major architectural decisions.

## 8. Completion Report
After completing a task, always provide:

**Task completed:** Brief description.

**Files changed:** List of modified files.

**Implementation explanation:** Explain the code changes line by line in simple language.

**Project workflow:** Explain how the implemented feature works from frontend to backend.

**Commands executed:** List the terminal commands used.

**Next steps:** Mention any remaining work or necessary manual steps.

My priority is not just getting working code. I also want to learn how the code works and become capable of implementing these features independently.