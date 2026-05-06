import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioPayload } from '../types';

export const verificarToken = (
  req: Request, res: Response, next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ mensaje: 'Token requerido' });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as UsuarioPayload;

    req.usuario = payload;
    next();
  } catch {
    res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};