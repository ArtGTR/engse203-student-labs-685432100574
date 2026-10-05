import { describe, test, expect, beforeEach } from 'vitest';
import {
  loadSeed,
  getDbStatus,
  findAll,
  findById,
  create,
  updateStatus,
  remove,
  listUsers,
  listRequestsByUser,
} from '../../src/services/requestService.js';

beforeEach(async () => {
  await loadSeed();
});

describe('requestService coverage', () => {
  test('getDbStatus → connected', () => {
    const status = getDbStatus();
    expect(status.connected).toBe(true);
    expect(status.tables).toBeGreaterThan(0);
  });

  test('findAll ไม่มี status → 5 รายการ', () => {
    expect(findAll()).toHaveLength(5);
  });

  test('findAll status → เฉพาะสถานะที่ขอ', () => {
    const rows = findAll({ status: 'in-progress' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.status === 'in-progress')).toBe(true);
  });

  test('findById ไม่พบ → null', () => {
    expect(findById('REQ-999')).toBeNull();
  });

  test('create user เดิม → สร้างคำร้องได้', () => {
    const created = create({
      requesterName: 'สมชาย ใจดี',
      requestType: 'แจ้งซ่อม',
      location: 'TEST',
      details: 'รายละเอียดทดสอบยาวพอ',
      priority: 'normal',
    });

    expect(created.id).toBe('REQ-006');
    expect(created.requesterName).toBe('สมชาย ใจดี');
  });

  test('updateStatus ไม่พบ → null', () => {
    expect(updateStatus('REQ-999', 'completed')).toBeNull();
  });

  test('remove ไม่พบ → null', () => {
    expect(remove('REQ-999')).toBeNull();
  });

  test('remove พบ → คืนข้อมูลเดิมและลบจริง', () => {
    const removed = remove('REQ-005');
    expect(removed.id).toBe('REQ-005');
    expect(findById('REQ-005')).toBeNull();
  });

  test('listUsers → มีชื่อผู้ใช้และไม่มี email', () => {
    const users = listUsers();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).not.toHaveProperty('email');
  });

  test('listRequestsByUser → คืนคำร้องของ user', () => {
    const rows = listRequestsByUser(1);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('requestType');
    expect(rows[0]).toHaveProperty('status');
  });
});
