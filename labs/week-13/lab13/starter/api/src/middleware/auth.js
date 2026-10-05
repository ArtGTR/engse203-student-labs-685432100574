import { verifyToken } from '../services/authService.js';

/**
 * ป้องกัน route ด้วย JWT
 */
export function authenticate(req, res, next) {
  const header = req.get('Authorization');

  if (!header) {
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'ไม่มีสิทธิ์ทำรายการนี้',
      });
    }

    next();
  };
}