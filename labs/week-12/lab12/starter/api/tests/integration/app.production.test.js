import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const staticDir = path.join(os.tmpdir(), `engse203-week12-${process.pid}`);
mkdirSync(staticDir, { recursive: true });
writeFileSync(path.join(staticDir, 'index.html'), '<html><body>production frontend</body></html>');

process.env.NODE_ENV = 'production';
process.env.STATIC_DIR = staticDir;

const { createApp } = await import('../../src/app.js');
const app = createApp();

describe('Production app coverage', () => {
  test('GET / → เสิร์ฟ index.html', async () => {
    const r = await request(app).get('/');
    expect(r.status).toBe(200);
    expect(r.text).toContain('production frontend');
  });

  test('GET /dashboard → React Router fallback ส่ง index.html', async () => {
    const r = await request(app).get('/dashboard');
    expect(r.status).toBe(200);
    expect(r.text).toContain('production frontend');
  });
});

afterAll(() => {
  rmSync(staticDir, { recursive: true, force: true });
});
