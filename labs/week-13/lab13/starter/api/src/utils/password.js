import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEY_LENGTH);

  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(plain, stored) {
  if (
    typeof plain !== 'string' ||
    typeof stored !== 'string'
  ) {
    return false;
  }

  try {
    const parts = stored.split('$');

    if (parts.length !== 3) {
      return false;
    }

    const [scheme, saltHex, hashHex] = parts;

    if (scheme !== 'scrypt') {
      return false;
    }

    if (!/^[0-9a-f]{32}$/i.test(saltHex)) {
      return false;
    }

    if (!/^[0-9a-f]{128}$/i.test(hashHex)) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const storedHash = Buffer.from(hashHex, 'hex');

    const calculatedHash = scryptSync(
      plain,
      salt,
      storedHash.length
    );

    return timingSafeEqual(
      calculatedHash,
      storedHash
    );
  } catch {
    return false;
  }
}