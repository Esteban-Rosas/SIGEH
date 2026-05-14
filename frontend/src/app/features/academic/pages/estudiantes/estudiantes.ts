import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EstudiantesService,
  Estudiante
} from '../../../../core/services/estudiantes.service';

type Vista = 'lista' | 'nuevo' | 'detalle' | 'editar';

@Component({
  selector: 'app-estudiantes',
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css']
})
export class EstudiantesComponent implements OnInit {

  vista: Vista = 'lista';
  cargando     = false;
  guardando    = false;
  error        = '';
  exito        = '';

  estudiantes:   Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  estudianteSeleccionado: any = null;

  busqueda   = '';
  filtroGrado = '';

  // Formulario nuevo/editar
  form: any = this.formVacio();

  constructor(private svc: EstudiantesService) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  formVacio() {
    return {
      // Estudiante
      nombre: '', apellido: '', tipo_documento: 'TI',
      numero_documento: '', correo: '', telefono: '',
      fecha_nacimiento: '', id_grupo: '',
      // Acudiente
      acudiente_nombre: '', acudiente_apellido: '',
      acudiente_documento: '', acudiente_telefono: '',
      acudiente_correo: '', acudiente_parentesco: 'madre'
    };
  }

  cargarEstudiantes() {
    this.cargando = true;
    this.svc.listar().subscribe({
      next: res => {
        this.estudiantes = res.estudiantes;
        this.estudiantesFiltrados = res.estudiantes;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar estudiantes';
        this.cargando = false;
      }
    });
  }

  filtrar() {
    const b = this.busqueda.toLowerCase();
    this.estudiantesFiltrados = this.estudiantes.filter(e => {
      const coincideBusqueda =
        e.nombre.toLowerCase().includes(b)     ||
        e.apellido.toLowerCase().includes(b)   ||
        e.numero_documento.includes(b)         ||
        e.correo.toLowerCase().includes(b);
      const coincideGrado = this.filtroGrado
        ? e.grado_codigo === this.filtroGrado
        : true;
      return coincideBusqueda && coincideGrado;
    });
  }

  verDetalle(id: number) {
    this.cargando = true;
    this.svc.obtener(id).subscribe({
      next: res => {
        this.estudianteSeleccionado = res;
        this.vista   = 'detalle';
        this.cargando = false;
      },
      error: () => {
        this.error   = 'Error al cargar el estudiante';
        this.cargando = false;
      }
    });
  }

  abrirEditar(est: Estudiante) {
    this.svc.obtener(est.id_estudiante).subscribe({
      next: res => {
        const e = res.estudiante;
        this.form = {
          nombre: e.nombre, apellido: e.apellido,
          tipo_documento: e.tipo_documento,
          numero_documento: e.numero_documento,
          correo: e.correo, telefono: e.telefono || '',
          fecha_nacimiento: e.fecha_nacimiento?.split('T')[0] || '',
          id_grupo: e.id_grupo || '',
          acudiente_nombre: '', acudiente_apellido: '',
          acudiente_documento: '', acudiente_telefono: '',
          acudiente_correo: '', acudiente_parentesco: 'madre'
        };
        this.estudianteSeleccionado = res;
        this.vista = 'editar';
      }
    });
  }

  guardar() {
    this.guardando = true;
    this.error = '';

    if (this.vista === 'nuevo') {
      this.svc.crear(this.form).subscribe({
        next: () => {
          this.exito    = 'Estudiante registrado exitosamente';
          this.guardando = false;
          this.form      = this.formVacio();
          this.cargarEstudiantes();
          setTimeout(() => { this.exito = ''; this.vista = 'lista'; }, 2000);
        },
        error: err => {
          this.error    = err.error?.mensaje || 'Error al guardar';
          this.guardando = false;
        }
      });
    } else {
      const id = this.estudianteSeleccionado.estudiante.id_estudiante;
      this.svc.actualizar(id, this.form).subscribe({
        next: () => {
          this.exito    = 'Estudiante actualizado exitosamente';
          this.guardando = false;
          this.cargarEstudiantes();
          setTimeout(() => { this.exito = ''; this.vista = 'lista'; }, 2000);
        },
        error: err => {
          this.error    = err.error?.mensaje || 'Error al actualizar';
          this.guardando = false;
        }
      });
    }
  }

  cambiarEstado(est: Estudiante) {
    const nuevoEstado = est.estado === 'activo' ? 'inactivo' : 'activo';
    this.svc.cambiarEstado(est.id_estudiante, nuevoEstado).subscribe({
      next: () => this.cargarEstudiantes()
    });
  }

  irALista() {
    this.vista  = 'lista';
    this.error  = '';
    this.exito  = '';
    this.form   = this.formVacio();
    this.estudianteSeleccionado = null;
  }

  get gradosUnicos(): string[] {
    const codigos = [...new Set(
      this.estudiantes.map(e => e.grado_codigo).filter(Boolean)
    )];
    return codigos;
  }

  get totalActivos(): number {
    return this.estudiantes.filter(e => e.estado === 'activo').length;
  }

  iniciales(nombre: string, apellido: string): string {
    return `${nombre?.[0] || ''}${apellido?.[0] || ''}`.toUpperCase();
  }
}