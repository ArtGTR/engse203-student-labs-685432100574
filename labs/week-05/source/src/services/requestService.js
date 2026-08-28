/**
 * requestService.js — ชั้นเข้าถึงข้อมูล
 *
 * กติกาที่ checker ตรวจจริง:
 *   - fetch() ต้องอยู่ในไฟล์นี้เท่านั้น
 *   - หน้าและ component เรียกเฉพาะฟังก์ชันที่ export จากไฟล์นี้
 */

import {
  clearStoredRequests,
  readStoredRequests,
  writeStoredRequests,
} from './requestStorage.js';

const LAB_DELAY_MS = 420;

/* ─────────── ให้มาแล้ว ไม่ต้องแก้ ─────────── */

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForLabDelay() {
  await delay(globalThis.__ENGSE203_SKIP_DELAY__ ? 0 : LAB_DELAY_MS);
}

/* ─────────── คาบ 5A ─────────── */

async function fetchSeedRequests() {
  const baseUrl = import.meta.env?.BASE_URL ?? '/';

  const response = await fetch(
    `${baseUrl}data/initialRequests.json`,
  );

  if (!response.ok) {
    throw new Error('ไม่สามารถโหลดข้อมูลตัวอย่างได้');
  }

  return structuredClone(await response.json());
}

/* ─────────── คาบ 5B ─────────── */

async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();

  // มีข้อมูลที่ถูกต้องอยู่แล้ว
  if (stored.status === 'valid') {
    return stored.requests;
  }

  // ถ้าไม่มีข้อมูล หรือข้อมูลเสียหาย ให้โหลด seed
  const seedRequests = await fetchSeedRequests();

  // ถ้าข้อมูลเดิมเสีย ให้แจ้ง UI ว่ามีการกู้คืน
  if (stored.status === 'invalid') {
    onRecovery?.(
      'ข้อมูลเดิมเสียหาย ระบบได้กู้คืนข้อมูลตัวอย่างให้แล้ว',
    );
  }

  // บันทึกข้อมูลใหม่
  writeStoredRequests(seedRequests);

  return seedRequests;
}

export async function getRequests(options = {}) {
  await waitForLabDelay();

  if (options.scenario === 'error') {
    throw new Error(
      'LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ',
    );
  }

  if (options.scenario === 'empty') {
    return [];
  }

  return loadNormalRequests(options.onRecovery);
}

export async function getRequestById(requestId) {
  const requests = await getRequests();

  return requests.find(
    (request) => request.id === requestId,
  ) ?? null;
}

/* ─────────── เพิ่ม / ลบ / reset ─────────── */

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRequestInput(input) {
  if (!input) {
    throw new Error('ข้อมูลคำร้องไม่ถูกต้อง');
  }

  if (readText(input.requesterName).length < 2) {
    throw new Error('ชื่อผู้แจ้งไม่ถูกต้อง');
  }

  if (!readText(input.requestType)) {
    throw new Error('กรุณาเลือกประเภทคำร้อง');
  }

  if (!readText(input.location)) {
    throw new Error('กรุณาระบุสถานที่');
  }

  if (readText(input.details).length < 10) {
    throw new Error(
      'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร',
    );
  }

  if (!['normal', 'urgent'].includes(input.priority)) {
    throw new Error('ความเร่งด่วนไม่ถูกต้อง');
  }
}

function createRequestId(requests) {
  let id;

  do {
    const time = Date.now()
      .toString(36)
      .toUpperCase();

    const random = Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase();

    id = `REQ-${time}-${random}`;
  } while (
    requests.some(
      (request) => request.id === id,
    )
  );

  return id;
}

export async function addRequest(requestInput) {
  validateRequestInput(requestInput);

  const requests = await getRequests();

  const newRequest = {
    id: createRequestId(requests),
    requesterName: readText(
      requestInput.requesterName,
    ),
    requestType: readText(
      requestInput.requestType,
    ),
    location: readText(
      requestInput.location,
    ),
    details: readText(
      requestInput.details,
    ),
    priority: requestInput.priority,
    status: 'pending',
  };

  writeStoredRequests([
    ...requests,
    newRequest,
  ]);

  return structuredClone(newRequest);
}

export async function deleteRequest(requestId) {
  const requests = await getRequests();

  const nextRequests = requests.filter(
    (request) => request.id !== requestId,
  );

  writeStoredRequests(nextRequests);

  return structuredClone(nextRequests);
}

export async function resetRequests() {
  clearStoredRequests();

  const seedRequests = await fetchSeedRequests();

  writeStoredRequests(seedRequests);

  return structuredClone(seedRequests);
}