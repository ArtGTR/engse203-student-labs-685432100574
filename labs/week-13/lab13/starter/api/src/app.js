import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // CORS
  app.use(cors({ origin: config.corsOrigin }));

  // logging
  if (config.env !== 'test') {
    app.use(morgan(config.isProd ? 'combined' : 'dev'));
  }

  // จำกัดขนาด body ไม่เกิน 10kb
  app.use(express.json({ limit: '10kb' }));

  // API
  app.get('/api', (req, res) => {
    res.json({
      message: 'Campus Service API is running',
      version: '3.0.0',
    });
  });

  app.use('/api/health', healthRoutes);

  // Login
  app.use('/api/auth', authRoutes);

  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  // หน้าเว็บ
  if (config.isProd && existsSync(config.staticDir)) {
    app.use(express.static(config.staticDir));

    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(config.staticDir, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.json({
        message:
          'Campus Service API (dev) — หน้าเว็บอยู่ที่ Vite พอร์ต 5173',
        api: '/api',
      });
    });
  }

  // Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
