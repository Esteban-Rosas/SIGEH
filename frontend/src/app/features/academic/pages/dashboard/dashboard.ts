import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClaseHorario {
  materia: string;
  aula: string;
  color: string;
}

interface Evento {
  icono: string;       // nombre del icono Material
  titulo: string;
  fecha: string;
  color: string;
}

interface Cumpleanio {
  nombre: string;
  grado: string;
  dia: number;
  tipo: 'estudiante' | 'docente';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  // Saludo dinámico según hora
  get saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  // Resumen con iconos Material
  resumen = [
    { icono: 'school',       label: 'Estudiantes',  valor: '0', color: '#1C4E80' },
    { icono: 'person',       label: 'Docentes',     valor: '0', color: '#2E7D32' },
    { icono: 'menu_book',    label: 'Materias',     valor: '0', color: '#6A1B9A' },
    { icono: 'campaign',     label: 'Comunicados',  valor: '0', color: '#E65100' },
  ];

  semanaOffset = 0;

  horas = ['7:00','8:00','9:00','10:00','11:00','12:00','1:00','2:00','3:00'];
  dias = ['Lunes','Martes','Miércoles','Jueves','Viernes'];

  horario: Record<string, Record<string, ClaseHorario>> = {
    'Lunes':     { '8:00': { materia:'Matemáticas', aula:'Aula 201', color:'#1C4E80' },
                   '10:00':{ materia:'Español',      aula:'Aula 202', color:'#42A5F5' },
                   '1:00': { materia:'Ed. Física',   aula:'Cancha',   color:'#2E7D32' } },
    'Martes':    { '8:00': { materia:'Ciencias',     aula:'Lab 101',  color:'#6A1B9A' },
                   '10:00':{ materia:'Matemáticas',  aula:'Aula 201', color:'#1C4E80' },
                   '1:00': { materia:'Inglés',        aula:'Aula 203', color:'#E65100' } },
    'Miércoles': { '8:00': { materia:'Arte',         aula:'Taller',   color:'#D81B60' },
                   '10:00':{ materia:'Español',      aula:'Aula 202', color:'#42A5F5' },
                   '2:00': { materia:'Música',       aula:'Sala de Música', color:'#F9A825' } },
    'Jueves':    { '8:00': { materia:'Matemáticas',  aula:'Aula 201', color:'#1C4E80' },
                   '10:00':{ materia:'Ciencias',     aula:'Lab 101',  color:'#6A1B9A' },
                   '1:00': { materia:'Ed. Física',   aula:'Cancha',   color:'#2E7D32' } },
    'Viernes':   { '8:00': { materia:'Inglés',       aula:'Aula 203', color:'#E65100' },
                   '10:00':{ materia:'Español',      aula:'Aula 202', color:'#42A5F5' },
                   '2:00': { materia:'Informática',  aula:'Lab 102',  color:'#00838F' } },
  };

  proximosEventos: Evento[] = [
    { icono:'science',       titulo:'Feria de Ciencias',        fecha:'15 may', color:'#1C4E80' },
    { icono:'theater_comedy',titulo:'Día del Idioma',           fecha:'20 may', color:'#6A1B9A' },
    { icono:'sports_soccer', titulo:'Olimpiadas Internas',      fecha:'28 may', color:'#2E7D32' },
    { icono:'groups',        titulo:'Reunión de Padres',        fecha:'3 jun',  color:'#E65100' },
    { icono:'palette',       titulo:'Exposición de Arte',       fecha:'10 jun', color:'#D81B60' },
  ];

  cumpleanios: Cumpleanio[] = [
    { nombre:'Sofía Martínez',  grado:'Grado 3°', dia: 5,  tipo:'estudiante' },
    { nombre:'Carlos Ruiz',     grado:'Grado 1°', dia: 9,  tipo:'estudiante' },
    { nombre:'Ana López',       grado:'Docente',  dia:14,  tipo:'docente'    },
    { nombre:'Miguel Torres',   grado:'Grado 5°', dia:18,  tipo:'estudiante' },
    { nombre:'Valeria Gómez',   grado:'Grado 2°', dia:22,  tipo:'estudiante' },
    { nombre:'Pedro Sánchez',   grado:'Docente',  dia:27,  tipo:'docente'    },
  ];

  getClase(dia: string, hora: string): ClaseHorario | null {
    return this.horario[dia]?.[hora] || null;
  }

  get etiquetaSemana(): string {
    if (this.semanaOffset === 0) return 'Semana Actual';
    if (this.semanaOffset === 1) return 'Próxima Semana';
    if (this.semanaOffset === -1) return 'Semana Pasada';
    return `Semana ${this.semanaOffset > 0 ? '+' : ''}${this.semanaOffset}`;
  }

  get fechasDias(): string[] {
    const hoy = new Date();
    const lunes = new Date(hoy);
    const diaSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
    lunes.setDate(hoy.getDate() - diaSemana + this.semanaOffset * 7);

    return this.dias.map((_, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    });
  }

  semanaAnterior() { this.semanaOffset--; }
  semanaSiguiente(){ this.semanaOffset++; }

  get mesActual(): string {
    return new Date().toLocaleDateString('es-CO', { month:'long', year:'numeric' });
  }

  get diaHoy(): number {
    return new Date().getDate();
  }
}