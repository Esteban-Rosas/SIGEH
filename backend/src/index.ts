import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import './config/database';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SIGEH API corriendo en http://localhost:${PORT}`);
});