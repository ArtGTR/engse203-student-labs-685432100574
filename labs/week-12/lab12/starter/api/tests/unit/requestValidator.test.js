import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง
 */

const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};

const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด', () => {
  test('9 ตัวอักษร → error', () => {
    expect(validateRequestInput(
      withField({ details: '123456789' })
    )).toHaveLength(1);
  });

  test('10 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(
      withField({ details: '1234567890' })
    )).toEqual([]);
  });

  test('11 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(
      withField({ details: '12345678901' })
    )).toEqual([]);
  });

  test('ช่องว่างล้วน → error', () => {
    expect(validateRequestInput(
      withField({ details: '          ' })
    )).not.toEqual([]);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้ง', () => {
  test('ชื่อ 1 ตัวอักษร → error', () => {
    expect(validateRequestInput(
      withField({ requesterName: 'ก' })
    )).not.toEqual([]);
  });

  test('ชื่อ 2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(
      withField({ requesterName: 'สม' })
    )).toEqual([]);
  });
});

describe('validateRequestInput — ประเภทคำร้องและ priority', () => {
  test('ประเภทคำร้องนอกรายการ → error', () => {
    expect(validateRequestInput(
      withField({ requestType: 'อื่น' })
    )).not.toEqual([]);
  });

  test('priority "high" → error', () => {
    expect(validateRequestInput(
      withField({ priority: 'high' })
    )).not.toEqual([]);
  });
});

describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([
    ['null', null],
    ['array', []],
    ['ตัวเลข', 123],
  ])('%s → error', (_, input) => {
    expect(validateRequestInput(input)).not.toEqual([]);
  });
});

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('"done" → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});