import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

// ตำแหน่งของไฟล์ service
const HERE = path.dirname(fileURLToPath(import.meta.url));

// ไฟล์ฐานข้อมูล
const DB_FILE = path.resolve(HERE, '../../data/campus.db');

// ไฟล์ schema
const SCHEMA_FILE = path.resolve(HERE, '../../data/schema.sql');

// เปิดฐานข้อมูล SQLite
const db = new DatabaseSync(DB_FILE);

// เปิด Foreign Key
db.exec('PRAGMA foreign_keys = ON');

// รูปแบบข้อมูลที่ส่งกลับให้ Controller / Frontend
const SELECT_SHAPE = `
  SELECT
    r.id AS id,
    u.name AS requesterName,
    r.request_type AS requestType,
    r.location AS location,
    r.details AS details,
    r.priority AS priority,
    r.status AS status,
    r.created_at AS createdAt
  FROM requests r
  JOIN users u ON u.id = r.requester_id
`;

/**
 * โหลดฐานข้อมูล
 */
export async function loadSeed() {
  const result = db
    .prepare(`
      SELECT COUNT(*) AS c
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'requests'
    `)
    .get();

  if (Number(result.c) === 0) {
    const schema = await readFile(SCHEMA_FILE, 'utf8');
    db.exec(schema);
  }

  // เปิด Foreign Key อีกครั้งหลังสร้าง schema
  db.exec('PRAGMA foreign_keys = ON');
}

/**
 * GET /api/requests
 * ดึงคำร้องทั้งหมด
 */
export function findAll({ status } = {}) {
  if (status) {
    return db
      .prepare(`
        ${SELECT_SHAPE}
        WHERE r.status = ?
        ORDER BY r.id
      `)
      .all(status);
  }

  return db
    .prepare(`
      ${SELECT_SHAPE}
      ORDER BY r.id
    `)
    .all();
}

/**
 * GET /api/requests/:id
 * ดึงคำร้องตาม ID
 */
export function findById(id) {
  const row = db
    .prepare(`
      ${SELECT_SHAPE}
      WHERE r.id = ?
    `)
    .get(String(id));

  return row ?? null;
}

/**
 * POST /api/requests
 * สร้างคำร้องใหม่
 */
export function create(input) {
  const {
    requesterName,
    requestType,
    location,
    details,
    priority = 'normal'
  } = input;

  // ค้นหา user จากชื่อ
  let user = db
    .prepare(`
      SELECT id
      FROM users
      WHERE name = ?
    `)
    .get(requesterName);

  // ถ้าไม่มี user ให้สร้างใหม่
  if (!user) {
    const department =
      input.department ?? 'วิศวกรรมซอฟต์แวร์';

    const email =
      input.email ??
      `${Date.now()}@rmutl.local`;

    const result = db
      .prepare(`
        INSERT INTO users
          (name, department, email)
        VALUES (?, ?, ?)
      `)
      .run(
        requesterName,
        department,
        email
      );

    user = {
      id: Number(result.lastInsertRowid)
    };
  }

  // สร้าง ID คำร้อง
  const id =
    `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // บันทึกคำร้อง
  db.prepare(`
    INSERT INTO requests
      (
        id,
        requester_id,
        request_type,
        location,
        details,
        priority
      )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    user.id,
    requestType,
    location,
    details,
    priority
  );

  // คืนข้อมูลที่สร้าง
  return findById(id);
}

/**
 * PUT /api/requests/:id
 * เปลี่ยนสถานะ
 */
export function updateStatus(id, status) {
  const result = db
    .prepare(`
      UPDATE requests
      SET status = ?
      WHERE id = ?
    `)
    .run(status, String(id));

  if (result.changes === 0) {
    return null;
  }

  return findById(id);
}

/**
 * DELETE /api/requests/:id
 * ลบคำร้อง
 */
export function remove(id) {
  const existing = findById(id);

  if (!existing) {
    return null;
  }

  db.prepare(`
    DELETE FROM requests
    WHERE id = ?
  `).run(String(id));

  return existing;
}
