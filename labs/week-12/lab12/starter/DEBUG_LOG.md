# บันทึกการไล่ปัญหา (Debug Log)

## BUG #0 · รายละเอียด 10 ตัวอักษรไม่ผ่าน

- **อาการ:** รายละเอียดที่มี 10 ตัวอักษรถูกตรวจว่าไม่ผ่าน
- **วิธีทำซ้ำ:** ส่ง `details: "1234567890"` ผ่าน `validateRequestInput()`
- **เครื่องมือ:** Vitest unit test
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/validators/requestValidator.js` ใช้ `length <= MIN_DETAILS` ทำให้ค่า 10 ถูกปฏิเสธ
- **วิธีแก้:** เปลี่ยนเป็น `length < MIN_DETAILS` เพื่อให้ 10 ตัวอักษรผ่านตามค่าขอบ
- **test ที่กัน:** `requestValidator.test.js` ทดสอบ 9, 10 และ 11 ตัวอักษร

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** ลบคำร้องตรงกลางแล้วสร้างคำร้องใหม่ ทำให้รหัสซ้ำและเกิด error 500
- **วิธีทำซ้ำ:** ลบ `REQ-002` แล้ว POST คำร้องใหม่
- **เครื่องมือ:** Integration test + SQLite
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/services/requestService.js` เดิมสร้าง ID จาก `COUNT(*) + 1` เมื่อมีการลบตรงกลางจึงได้ ID ที่มีอยู่แล้ว
- **วิธีแก้:** เปลี่ยน `nextId()` ให้หาเลขสูงสุดจาก ID ที่มีอยู่แล้วแล้วบวก 1
- **test ที่กัน:** `requests.api.test.js` ทดสอบลบ `REQ-002` แล้ว POST ต้องได้ `REQ-006`

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** Dashboard นับรายการ `in-progress` เป็น 0
- **วิธีทำซ้ำ:** มี request ที่ API ส่ง `status: "in-progress"` แล้วดู SummaryPanel
- **เครื่องมือ:** Vitest frontend unit test
- **สาเหตุ (ไฟล์:บรรทัด):** `frontend/src/utils/requestSummary.js` เดิมนับ `in progress` ซึ่งไม่ตรงกับค่าจริงจาก API
- **วิธีแก้:** เปลี่ยนเป็น `count('in-progress')`
- **test ที่กัน:** `requestSummary.test.js` ใช้ข้อมูลที่มี `status: 'in-progress'` จำนวน 2 รายการและตรวจว่า `inProgress` เท่ากับ 2

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** PUT `REQ-999` ได้ 500 แทน 404
- **วิธีทำซ้ำ:** `PUT /api/requests/REQ-999` พร้อม `{ "status": "completed" }`
- **เครื่องมือ:** Integration test + console/error log
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/controllers/requestController.js` เดิมเข้าถึง `updated.id` ก่อนตรวจว่า `updated` เป็น null หรือไม่
- **วิธีแก้:** ตรวจ `if (!updated)` ก่อน แล้วจึง log และตอบ 200
- **test ที่กัน:** `requests.api.test.js` ทดสอบ PUT `REQ-999` ต้องได้ 404
