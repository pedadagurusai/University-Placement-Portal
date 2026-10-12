import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import studentsRouter from './server/routes/students.ts';
import drivesRouter from './server/routes/drives.ts';
import appsRouter from './server/routes/applications.ts';
import noDuesRouter from './server/routes/nodues.ts';
import analyticsRouter from './server/routes/analytics.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON and URL-encoded body parsing with comfortable payload limits for Excel/CSV imports
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // REST API Routes
  app.use('/api/students', studentsRouter);
  app.use('/api/drives', drivesRouter);
  app.use('/api/applications', appsRouter);
  app.use('/api/nodues', noDuesRouter);
  app.use('/api/analytics', analyticsRouter);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`University Placement & No-Dues Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
