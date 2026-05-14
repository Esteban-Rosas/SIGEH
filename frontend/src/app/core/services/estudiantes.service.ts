import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id_estudiante:    number;
  nombre:           string;
  apellido:         string;
  numero_documento: string;
  tipo_documento:   string;
  correo:           string;
  telefono:         string;
  estado:           string;
  estado_matricula: string;
  fecha_nacimiento: string;
  fecha_matricula:  string;
  grupo_nombre:     string;
  grado_nombre:     string;
  grado_codigo:     string;
  nivel_nombre:     string;
}

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private api = 'http://localhost:3000/api/estudiantes';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('sigeh_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listar(): Observable<{ estudiantes: Estudiante[] }> {
    return this.http.get<{ estudiantes: Estudiante[] }>(
      this.api, { headers: this.headers() }
    );
  }

  obtener(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`, { headers: this.headers() });
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.api, data, { headers: this.headers() });
  }

  actualizar(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data, { headers: this.headers() });
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(
      `${this.api}/${id}/estado`, { estado }, { headers: this.headers() }
    );
  }
}