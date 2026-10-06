> **Copied 2026-10-05.** A snapshot of this repo now lives in the kk-kb monorepo at [`content/projects/02-bc-ai-ecosystem-nonprofit/publishing/awesome-bc-ai/`](https://github.com/WalksWithASwagger/kk-kb/tree/main/content/projects/02-bc-ai-ecosystem-nonprofit/publishing/awesome-bc-ai) (source commit `6ddf5ce76d14`), earmarked as source content for the bc-ai.ca redesign. This repo and its GitHub Pages site stay live for now; see PROVENANCE.md there.

# BC + AI Ecosystem

A community-driven directory for the BC + AI Ecosystem. We are British Columbia's grassroots AI collective. We believe in DIY over gatekeepers, community before clout, and building a future where artificial intelligence serves culture, creativity, and the planet.

This directory is a living archive of our radically local, ethically bold approach to AI.

## 🚀 Adding Your Project

We use a "Data as Code" approach where the directory is built entirely from Markdown files. You do **not** need to touch any code to submit your project!

1. Go to the live website and click **"Add Project"**.
2. Fill out the form with your project details (Title, Description, Category, Tags, Event, etc.) and optionally select a preview image.
3. Click **"Generate Project Files"**. This will download an `index.md` file to your computer.
4. On this GitHub repository, navigate to `src/content/projects`.
5. Click **Add file > Create new file**.
6. In the filename box, type your project's short name followed by `/index.md` (e.g. `my-awesome-project/index.md`).
7. Paste the contents of your downloaded `index.md` file into the editor.
8. If you have an image, click "Commit changes" to create the folder, then upload your image directly into that new folder (`src/content/projects/my-awesome-project/`).
9. Submit your Pull Request!

Once merged, the GitHub Actions workflow will automatically rebuild the site and your project will instantly appear in the directory.

## 🛠️ Local Development

If you want to run the directory locally or contribute to the Astro codebase:

```sh
# Install dependencies
npm install

# Start the local development server at localhost:4321
npm run dev

# Build for production
npm run build
```

### Tech Stack
* **Framework**: [Astro](https://astro.build) (Static rendering for maximum speed)
* **Components**: React
* **Styling**: Tailwind CSS v4
* **Content Management**: Astro Content Collections (glob loader)
