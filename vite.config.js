import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  // GitHub Pages sert l'app sous /matches/ ; le conteneur Docker la sert à la racine (VITE_BASE=/).
  base: process.env.VITE_BASE ?? '/matches/',
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
});
