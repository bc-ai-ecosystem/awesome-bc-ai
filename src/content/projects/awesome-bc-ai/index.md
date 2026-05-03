---
title: "Awesome BC + AI"
description: "This website! A public directory of projects built by BC + AI members."
author_name: "Prajwal Prashanth"
author_github: "Toricane"
github_repo: "https://github.com/bc-ai-ecosystem/awesome-bc-ai"
demo_url: "https://bc-ai-ecosystem.github.io/awesome-bc-ai/"
category: "Ecosystem Tooling & Infra"
tags: ["website"]
image: "./Awesome BC + AI.png"
---

Welcome to the official **BC + AI Ecosystem Directory**! This platform serves as a living, community-driven archive for discovering the incredible projects, tools, and research being built across British Columbia.

We believe in a radically local, ethically bold approach to AI. This directory is designed to connect builders, researchers, and creatives in the province without the need for traditional gatekeepers. 

### ✨ Technical Architecture
The directory is built on a modern **"Data as Code"** architecture. Instead of relying on a centralized database, every single project is stored natively within the GitHub repository as a Markdown file. 
- **Blazing Fast:** Built with **Astro v6**, the entire site is statically generated at build time, ensuring zero-javascript page loads for the directory browsing experience.
- **Client-Side Generation:** This very submission form is built with **React** and **Tailwind CSS v4**. It runs entirely in your browser, validating data with strict **Zod** schemas, parsing images, and generating the final Markdown payload for you to commit.
- **Automated Deployments:** A custom GitHub Actions pipeline watches the `main` branch, automatically clearing caches, rebuilding the Astro Content Collections, and deploying to GitHub Pages.

### 🛠️ Key Features
* **Live Project Previews:** See exactly what your project card will look like while you type.
* **Fuzzy Search & Filtering:** Instantly sift through the ecosystem using the client-side Fuse.js search implementation.
* **Colocated Assets:** Project images are stored directly alongside their Markdown files, keeping the repository incredibly clean and modular.
* **Dynamic Tagging:** Built-in support for categorizing projects by tags, events, and focus areas.

### 🤝 How to Contribute
Want to add your own project? Just fill out this form! It will generate a folder containing an `index.md` file and your image. Drop that folder into the `src/content/projects/` directory in our GitHub repo, open a Pull Request, and you're done. 

The code lives here. The community lives on Discord. Let's build the future together.
