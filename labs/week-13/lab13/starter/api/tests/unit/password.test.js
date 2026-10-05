import { describe, test, expect } from 'vitest';

import {
  hashPassword,
  verifyPassword,
} from '../../src/utils/password.js';

const SEED_HASH =
  'scrypt$5e1f0c3a9b7d2e4f6a8c0b1d3e5f7a9c$338b498479d3c59bb029562c2482814ede32b60ae26efe9089abb12596d4b812ee99726a544a46c23d2ce5595e25bb19601cd532f99e09be89d8c662c06d657c';

describe('hashPassword', () => {

  test('รูปแบบ scrypt$salt$hash', () => {
    expect(hashPassword('secret-1'))
      .toMatch(/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  });

  test('รหัสผ่านเดียวกัน hash 2 ครั้ง ได้ไม่เหมือนกัน (salt สุ่ม)', () => {
    expect(hashPassword('secret-1'))
      .not.toBe(hashPassword('secret-1'));
  });

  test('hash ไม่มีรหัสผ่านตัวจริงปนอยู่', () => {
    expect(hashPassword('secret-1'))
      .not.toContain('secret-1');
  });

});

describe('verifyPassword', () => {

  test('รหัสผ่านถูก → true', () => {
    expect(
      verifyPassword('secret-1', hashPassword('secret-1'))
    ).toBe(true);
  });

  test('รหัสผ่านผิด → false', () => {
    expect(
      verifyPassword('secret-2', hashPassword('secret-1'))
    ).toBe(false);
  });

  test('ตรวจ hash ของบัญชีเจ้าหน้าที่ใน schema.sql ได้', () => {
    expect(
      verifyPassword('staff1234', SEED_HASH)
    ).toBe(true);
  });

  test.each([
    undefined,
    '',
    'plain-text',
    'md5$abc$def',
  ])(
    'hash ผิดรูปแบบ %j → false (ไม่พัง)',
    (stored) => {
      expect(
        verifyPassword('staff1234', stored)
      ).toBe(false);
    }
  );

});