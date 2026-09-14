import 'dotenv/config';

/**
 * TODO W07-CFG (CP10) · รวมค่าตั้งค่าไว้ที่เดียว
 *
 * ต้องมี: port (จาก PORT) · corsOrigin (จาก CORS_ORIGIN) · nodeEnv (จาก NODE_ENV)
 * ทุกค่าต้องมีค่าเริ่มต้นเผื่อไม่มี .env
 */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? 'localhost',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};