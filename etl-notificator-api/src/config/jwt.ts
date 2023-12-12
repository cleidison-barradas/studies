const { JWT_ISSUER, JWT_SUBJECT, JWT_AUDIENCE, JWT_EXPIRES, JWT_ALGORITHM } = process.env;
import { Algorithm } from 'jsonwebtoken';

interface JwtConfig {
    issuer?: string
    subject?: string
    audience?: string
    expiresIn?: string
    algorithm?: Algorithm
}

export const jwtConfig = {
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT,
    audience: JWT_AUDIENCE,
    expiresIn: JWT_EXPIRES,
    algorithm: JWT_ALGORITHM,
} as JwtConfig;