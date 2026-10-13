import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/matches/',
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
});
