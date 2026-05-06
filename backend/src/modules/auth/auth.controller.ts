import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    return;
  }

  try {
    const resultado = await pool.query(`
      SELECT u.*, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = $1 AND u.estado = 'activo'
    `, [correo]);

    if (resultado.rows.length === 0) {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      return;
    }

    const usuario = resultado.rows[0];
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena_hash
    );

    if (!contrasenaValida) {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      return;
    }

    // Actualizar último acceso
    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = $1',
      [usuario.id_usuario]
    );

    const payload = {
      id_usuario: usuario.id_usuario,
      id_rol:     usuario.id_rol,
      rol:        usuario.rol,
      nombre:     usuario.nombre,
      apellido:   usuario.apellido,
      correo:     usuario.correo,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' } as any
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: payload
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const perfil = async (req: Request, res: Response): Promise<void> => {
  res.json({ usuario: req.usuario });
};