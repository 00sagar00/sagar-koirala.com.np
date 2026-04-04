# Sagar Portfolio (React + Vite)

This portfolio is built with React and Vite.

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

The deployable files are generated in `dist/`.

## Deploy To Cloudflare Pages

### Option 1: Connect GitHub Repo (Recommended)

1. Push this project to GitHub.
2. In Cloudflare dashboard, open Pages and create a new project.
3. Connect your GitHub repo.
4. Use these build settings:
	- Framework preset: `Vite`
	- Build command: `npm run build`
	- Build output directory: `dist`
5. Deploy.

### Option 2: Direct Upload (No GitHub)

1. Run `npm run build` locally.
2. Upload the contents of `dist/` to Cloudflare Pages.

## SPA Routing Support

This project includes `public/_redirects` with:

```text
/* /index.html 200
```

That ensures direct links like `/projects` and `/contact` correctly load your React app on Cloudflare Pages.

## Environment Variables (Contact Form)

The contact form supports API submission if you set:

- `VITE_FORMSPREE_ENDPOINT`

Create a `.env` file locally:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-id
```

In Cloudflare Pages, add the same variable in Project Settings > Environment Variables.
