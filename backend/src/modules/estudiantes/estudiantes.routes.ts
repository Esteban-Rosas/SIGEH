import { Router } from 'express';
import {
  listarEstudiantes,
  obtenerEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  cambiarEstado
} from './estudiantes.controller';
import { verificarToken } from '../../middlewares/auth.middleware';
import { soloRoles }      from '../../middlewares/role.middleware';

const router = Router();

router.use(verificarToken);

router.get(  '/',    soloRoles('rector','coordinador','administrativo'), listarEstudiantes);
router.get(  '/:id', soloRoles('rector','coordinador','administrativo'), obtenerEstudiante);
router.post( '/',    soloRoles('rector','coordinador','administrativo'), crearEstudiante);
router.put(  '/:id', soloRoles('rector','coordinador','administrativo'), actualizarEstudiante);
router.patch('/:id/estado', soloRoles('rector','coordinador','administrativo'), cambiarEstado);

export default router;