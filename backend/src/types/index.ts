export interface UsuarioPayload {
  id_usuario: number;
  id_rol:     number;
  rol:        string;
  nombre:     string;
  apellido:   string;
  correo:     string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioPayload;
    }
  }
}