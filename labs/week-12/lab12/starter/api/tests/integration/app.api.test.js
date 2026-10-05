import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

const app = createApp();
beforeEach(async () => { await loadSeed(); });

describe('App routes — coverage', () => {
  test('GET /api → 200 และคืนข้อมูล API', async () => {
    const r = await request(app).get('/api');
    expect(r.status).toBe(200);
    expect(r.body.message).toBe('Campus Service API is running');
    expect(r.body.version).toBe('3.0.0');
  });

  test('GET / → 200 และคืนข้อมูล development', async () => {
    const r = await request(app).get('/');
    expect(r.status).toBe(200);
    expect(r.body.message).toContain('Campus Service API');
    expect(r.body.api).toBe('/api');
  });
});

describe('User routes', () => {
  test('GET /api/users → รายชื่อผู้ใช้', async () => {
    const r = await request(app).get('/api/users');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body[0]).not.toHaveProperty('email');
  });

  test('GET /api/users/:id/requests → คำร้องของ user', async () => {
    const r = await request(app).get('/api/users/1/requests');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body[0]).toHaveProperty('requestType');
  });

  test('GET /api/users/:id/requests → user ที่ไม่มีคำร้อง', async () => {
    const r = await request(app).get('/api/users/99999/requests');
    expect(r.status).toBe(200);
    expect(r.body).toEqual([]);
  });
});
