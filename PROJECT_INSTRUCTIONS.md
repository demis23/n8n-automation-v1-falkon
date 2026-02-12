# Project Instructions: n8n Automation Falkon

This document serves as the primary source of truth and operational guide for the **n8n Automation Falkon** project. It is intended for both human developers and AI agents (Antigravity) working on this codebase.

## 1. Project Identity
- **Project Name**: n8n Automation Falkon
- **GitHub Repository**: [https://github.com/demis23/n8n-automation-v1-falkon](https://github.com/demis23/n8n-automation-v1-falkon)
- **Firebase Project ID**: `n8n-automation-v1-falkon`
- **Primary Tech Stack**: 
  - **n8n** (Workflow Automation)
  - **Firebase** (Backend: Firestore, Storage, Hosting)
  - **Node.js** (Custom Logic Scripts)

## 2. Directory Structure & Key Files
- **`workflow_main.json`**: The main n8n workflow definition. This file contains the JSON export of the n8n workflow.
- **`scripts/`**: Contains Node.js scripts used by n8n "Code" nodes. 
  - **Rule**: Logic should be kept in these external files and required into n8n nodes, rather than writing complex code directly inside n8n node parameters. This allows for easier version control and editing.
  - `telegram_incoming_handler.js`: Handles incoming messages from Telegram.
  - `prepare_generation.js`: Prepares prompts for AI generation.
  - `content_templates.js`: Stores text templates and prompts.
- **`public/`**: Public directory for Firebase Hosting. Contains `index.html` and other static assets.
- **`firebase.json`**: Configuration for Firebase services (Hosting, Firestore, Storage).
- **`.env`**: Environment variables (API keys, credentials). **NEVER COMMIT THIS FILE TO GIT.**

## 3. Workflow Logic (Summary)
The core workflow is designed to automate content creation for social media via Telegram and AI.
1.  **Trigger**: Receives text/image from Telegram.
2.  **Analysis**: Uses `scripts/telegram_incoming_handler.js`.
3.  **Gemini/OpenAI Integration**: Generates content based on input.
4.  **Approval**: Sends generated content back to user for approval via Telegram buttons.
5.  **Publication**: Publishes to Instagram/Facebook upon approval.

*See `README_WORKFLOW.md` for detailed workflow logic.*

## 4. Operational Guidelines for AI Agent

### General
1.  **Context Awareness**: Always check the current directory structure and file contents before making changes.
2.  **Version Control**: 
    - Commit changes frequently with clear, descriptive messages.
    - Push changes to the `main` branch on GitHub after significant milestones.
3.  **Safety**: 
    - Never expose secrets (API keys, tokens) in code or commit messages. Check `.gitignore` to ensure `.env` is excluded.

### modifying n8n Workflows
1.  **External Scripts**: When modifying logic for a Code Node, edit the corresponding file in `scripts/`. 
2.  **Workflow JSON**: If the `workflow_main.json` structure needs changing (adding nodes, changing connections), describe the changes clearly or provide a new JSON export if you have the capability to generate it validly.

### Firebase Operations
1.  **Hosting**: 
    - Web assets go in `public/`.
    - To deploy changes: `firebase deploy --only hosting`.
2.  **Database/Storage**: 
    - Rules are defined in `firestore.rules` and `storage.rules` (if present).
    - Use `firebase deploy --only firestore:rules` to update database rules.

### GitHub Operations
1.  **Sync**: Ensure local changes are pushed to remote `origin`.
    - `git add .`
    - `git commit -m "Description"`
    - `git push`

## 5. Setup & Initialization
- **Install Dependencies**: Run `npm install` if `package.json` is present (currently utilizing global or n8n internal modules).
- **Firebase Login**: Ensure `firebase-tools` is installed and authenticated via `firebase login`.
- **Environment**: Create a `.env` file based on the project requirements (see n8n docs for env var names).

---
**Last Updated**: 2026-02-12
