import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not found in environment variables. Using default secret.');
}

export function signToken(payload: string | object | Buffer, expiresIn: SignOptions['expiresIn'] = JWT_EXPIRES_IN as SignOptions['expiresIn']): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): string | JwtPayload {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token: string): string | JwtPayload | null {
  return jwt.decode(token);
} 