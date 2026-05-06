import { Request, Response, NextFunction } from 'express';

export const soloRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ mensaje: 'No autenticado' });
      return;
    }
    if (!roles.includes(req.usuario.rol)) {
      res.status(403).json({
        mensaje: `Acceso denegado. Se requiere: ${roles.join(', ')}`
      });
      return;
    }
    next();
  };
};