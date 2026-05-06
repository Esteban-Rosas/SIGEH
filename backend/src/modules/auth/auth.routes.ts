import { Router } from 'express';
import { login, perfil } from './auth.controller';
import { verificarToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login',  login);
router.get('/perfil',  verificarToken, perfil);

export default router;