import { defineConfig } from 'vite';

// GitHub Pages serves the app from /<repo-name>/, the dev server from /
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/BDE26-exam-project/' : '/',
}));
