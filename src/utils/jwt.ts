import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../models/User';

// Interface defining the data embedded inside the JWT token
export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

// Function to generate a signed JWT token
export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign(payload, secret, options);
};

// Function to verify and decode an existing JWT token
export const verifyTokenString = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key';
  return jwt.verify(token, secret) as TokenPayload;
};
