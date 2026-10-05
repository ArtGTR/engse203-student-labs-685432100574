import { describe, test, expect, vi } from 'vitest';
import { AppError, asyncHandler, notFound, errorHandler } from '../../src/middleware/errorHandler.js';
import { logger } from '../../src/middleware/logger.js';

describe('errorHandler middleware', () => {
  test('AppError เก็บ message และ status', () => {
    const err = new AppError('bad request', 400);
    expect(err.message).toBe('bad request');
    expect(err.status).toBe(400);
  });

  test('AppError default status = 500', () => {
    const err = new AppError('server error');
    expect(err.status).toBe(500);
  });

  test('notFound ตอบ 404', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const req = { method: 'GET', originalUrl: '/missing' };

    notFound(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'ไม่พบเส้นทาง GET /missing',
    });
  });

  test('errorHandler 400 ใช้ข้อความของ error', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const err = new AppError('ข้อมูลไม่ถูกต้อง', 400);
    const req = {};
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ข้อมูลไม่ถูกต้อง',
      }),
    );
  });

  test('errorHandler 500 ส่งข้อความ server error', () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const err = new Error('boom');
    const req = {};
    const next = vi.fn();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
        stack: expect.any(Array),
      }),
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('asyncHandler', () => {
  test('handler สำเร็จ → เรียก handler', async () => {
    const next = vi.fn();
    const fn = vi.fn(async (req, res, nextArg) => {
      nextArg('ok');
      return 'done';
    });

    const wrapped = asyncHandler(fn);
    await wrapped({}, {}, next);

    expect(fn).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith('ok');
  });

  test('handler throw → ส่ง error ให้ next', async () => {
    const next = vi.fn();
    const error = new Error('failed');
    const wrapped = asyncHandler(async () => {
      throw error;
    });

    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('logger middleware', () => {
  test('เรียก next และ log เมื่อ response finish', () => {
    const finishHandlers = [];
    const res = {
      statusCode: 200,
      on: vi.fn((event, cb) => {
        if (event === 'finish') finishHandlers.push(cb);
      }),
    };
    const req = {
      method: 'GET',
      originalUrl: '/api/test',
    };
    const next = vi.fn();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));

    finishHandlers[0]();

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('GET /api/test → 200'));
    spy.mockRestore();
  });
});
