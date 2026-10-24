# Frontend

This folder contains the React 19 and Vite client for XAU Strategy Analyzer.

For full project setup, backend configuration, Firebase credentials, and CSV format, see the [project README](../README.md).

## Local development

Create `.env` from `.env.example`, add your Firebase web app configuration, then run:

```sh
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api`.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build in `dist/`.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build locally.
