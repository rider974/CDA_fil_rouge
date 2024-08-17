import { Role } from '@/entity/role';
import jwt from'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: Role
}

export function generateJwtToken(user: UserPayload): string {
  if (!JWT_SECRET) {
    throw new Error('La clé secrète JWT est manquante');
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, JWT_SECRET, options);
}
