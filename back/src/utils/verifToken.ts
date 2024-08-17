import { NextApiRequest, NextApiResponse, NextApiHandler } from'next';
import jwt from'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

export function authenticateToken(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.cookie;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('; ').find(row => row.startsWith('authToken='));

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    console.log('authHeader', authHeader);
    console.log('Token:', token);
    try {
      const decoded = jwt.verify(token.split('=')[1], JWT_SECRET) as any;
      (req as any).user = decoded; 
      return handler(req, res);
    } catch (error) {
    console.error('Token verification error:', error);
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
}
