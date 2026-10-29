import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function slideOrderSavePlugin() {
  return {
    name: 'slide-order-save',
    configureServer(server) {
      server.middlewares.use('/api/save-order', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (!Array.isArray(data.order)) {
              throw new Error("Invalid payload: 'order' must be an array");
            }
            const filePath = path.resolve(__dirname, 'src/slideOrder.json');
            fs.writeFileSync(filePath, JSON.stringify(data.order, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('Save failed:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), slideOrderSavePlugin()],
  server: {
    host: true,
    port: 7649,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 7649,
    strictPort: true,
  },
})
