import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import estudiantesRoutes from './modules/estudiantes/estudiantes.routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudiantesRoutes);

// Ruta de verificación
app.get('/api/health', (req, res) => {
  res.json({ estado: 'SIGEH API funcionando', version: '1.0.1' });
});

export default app;