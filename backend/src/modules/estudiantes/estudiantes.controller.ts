import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Listar todos los estudiantes
export const listarEstudiantes = async (
  req: Request, res: Response
): Promise<void> => {
  try {
    const resultado = await pool.query(`
      SELECT
        e.id_estudiante,
        u.nombre,
        u.apellido,
        u.numero_documento,
        u.tipo_documento,
        u.correo,
        u.telefono,
        u.estado,
        e.fecha_nacimiento,
        e.fecha_matricula,
        e.estado AS estado_matricula,
        g.nombre  AS grupo_nombre,
        gr.nombre AS grado_nombre,
        gr.codigo AS grado_codigo,
        n.nombre  AS nivel_nombre
      FROM estudiantes e
      JOIN usuarios u  ON e.id_usuario = u.id_usuario
      LEFT JOIN grupos  g  ON e.id_grupo  = g.id_grupo
      LEFT JOIN grados  gr ON g.id_grado  = gr.id_grado
      LEFT JOIN niveles n  ON gr.id_nivel = n.id_nivel
      ORDER BY u.apellido, u.nombre
    `);
    res.json({ estudiantes: resultado.rows });
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Obtener un estudiante por ID
export const obtenerEstudiante = async (
  req: Request, res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const resultado = await pool.query(`
      SELECT
        e.id_estudiante,
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.numero_documento,
        u.tipo_documento,
        u.correo,
        u.telefono,
        u.estado,
        e.fecha_nacimiento,
        e.fecha_matricula,
        e.estado AS estado_matricula,
        e.id_grupo,
        g.nombre  AS grupo_nombre,
        gr.id_grado,
        gr.nombre AS grado_nombre,
        gr.codigo AS grado_codigo,
        n.nombre  AS nivel_nombre
      FROM estudiantes e
      JOIN usuarios u  ON e.id_usuario  = u.id_usuario
      LEFT JOIN grupos  g  ON e.id_grupo   = g.id_grupo
      LEFT JOIN grados  gr ON g.id_grado   = gr.id_grado
      LEFT JOIN niveles n  ON gr.id_nivel  = n.id_nivel
      WHERE e.id_estudiante = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      res.status(404).json({ mensaje: 'Estudiante no encontrado' });
      return;
    }

    // Traer acudientes
    const acudientes = await pool.query(`
      SELECT a.*, ea.es_principal
      FROM acudientes a
      JOIN estudiante_acudiente ea ON a.id_acudiente = ea.id_acudiente
      WHERE ea.id_estudiante = $1
    `, [id]);

    res.json({
      estudiante: resultado.rows[0],
      acudientes: acudientes.rows
    });
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Crear estudiante
export const crearEstudiante = async (
  req: Request, res: Response
): Promise<void> => {
  const {
    nombre, apellido, tipo_documento, numero_documento,
    correo, telefono, fecha_nacimiento, id_grupo,
    // Acudiente principal
    acudiente_nombre, acudiente_apellido, acudiente_documento,
    acudiente_telefono, acudiente_correo, acudiente_parentesco
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Crear usuario
    const bcrypt = require('bcryptjs');
    const contrasena_hash = await bcrypt.hash(numero_documento, 10);

    const usuarioRes = await client.query(`
      INSERT INTO usuarios
        (id_rol, nombre, apellido, tipo_documento,
         numero_documento, correo, telefono, contrasena_hash)
      VALUES (6, $1, $2, $3, $4, $5, $6, $7)
      RETURNING id_usuario
    `, [nombre, apellido, tipo_documento, numero_documento,
        correo, telefono, contrasena_hash]);

    const id_usuario = usuarioRes.rows[0].id_usuario;

    // 2. Crear estudiante
    const estudianteRes = await client.query(`
      INSERT INTO estudiantes
        (id_usuario, id_grupo, fecha_nacimiento)
      VALUES ($1, $2, $3)
      RETURNING id_estudiante
    `, [id_usuario, id_grupo || null, fecha_nacimiento || null]);

    const id_estudiante = estudianteRes.rows[0].id_estudiante;

    // 3. Crear acudiente si viene en el body
    if (acudiente_nombre && acudiente_apellido) {
      const acudienteRes = await client.query(`
        INSERT INTO acudientes
          (nombre, apellido, tipo_documento, numero_documento,
           telefono, correo, parentesco)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_acudiente
      `, [acudiente_nombre, acudiente_apellido,
          tipo_documento, acudiente_documento,
          acudiente_telefono, acudiente_correo,
          acudiente_parentesco || 'padre']);

      await client.query(`
        INSERT INTO estudiante_acudiente
          (id_estudiante, id_acudiente, es_principal)
        VALUES ($1, $2, true)
      `, [id_estudiante, acudienteRes.rows[0].id_acudiente]);
    }

    await client.query('COMMIT');
    res.status(201).json({
      mensaje: 'Estudiante creado exitosamente',
      id_estudiante
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      res.status(400).json({
        mensaje: 'El documento o correo ya está registrado'
      });
    } else {
      console.error('Error al crear estudiante:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  } finally {
    client.release();
  }
};

// Actualizar estudiante
export const actualizarEstudiante = async (
  req: Request, res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    nombre, apellido, tipo_documento, numero_documento,
    correo, telefono, fecha_nacimiento, id_grupo, estado
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Obtener id_usuario del estudiante
    const est = await client.query(
      'SELECT id_usuario FROM estudiantes WHERE id_estudiante = $1',
      [id]
    );
    if (est.rows.length === 0) {
      res.status(404).json({ mensaje: 'Estudiante no encontrado' });
      return;
    }
    const id_usuario = est.rows[0].id_usuario;

    // Actualizar usuario
    await client.query(`
      UPDATE usuarios SET
        nombre = $1, apellido = $2, tipo_documento = $3,
        numero_documento = $4, correo = $5, telefono = $6,
        estado = $7
      WHERE id_usuario = $8
    `, [nombre, apellido, tipo_documento, numero_documento,
        correo, telefono, estado, id_usuario]);

    // Actualizar estudiante
    await client.query(`
      UPDATE estudiantes SET
        id_grupo = $1, fecha_nacimiento = $2
      WHERE id_estudiante = $3
    `, [id_grupo || null, fecha_nacimiento || null, id]);

    await client.query('COMMIT');
    res.json({ mensaje: 'Estudiante actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  } finally {
    client.release();
  }
};

// Cambiar estado del estudiante
export const cambiarEstado = async (
  req: Request, res: Response
): Promise<void> => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const est = await pool.query(
      'SELECT id_usuario FROM estudiantes WHERE id_estudiante = $1', [id]
    );
    if (est.rows.length === 0) {
      res.status(404).json({ mensaje: 'Estudiante no encontrado' });
      return;
    }
    await pool.query(
      'UPDATE usuarios SET estado = $1 WHERE id_usuario = $2',
      [estado, est.rows[0].id_usuario]
    );
    res.json({ mensaje: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};