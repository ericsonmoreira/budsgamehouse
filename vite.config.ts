import { qrcode } from 'vite-plugin-qrcode';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [qrcode()],
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
