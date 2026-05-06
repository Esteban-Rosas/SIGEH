import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  icono: string;        // nombre del icono de Material (ej: 'dashboard')
  label: string;
  ruta:  string;
  roles: string[];
}

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input()  abierto = true;
  @Output() toggle  = new EventEmitter<void>();

  rolActual = 'rector';
 
  menuItems: MenuItem[] = [
    { icono: 'dashboard',       label: 'Dashboard',      ruta: '/sistema/dashboard',      roles: ['rector','coordinador','administrativo','docente','padre','estudiante'] },
    { icono: 'school',         label: 'Estudiantes',    ruta: '/sistema/estudiantes',    roles: ['rector','coordinador','administrativo'] },
    { icono: 'person',         label: 'Docentes',       ruta: '/sistema/docentes',       roles: ['rector','coordinador','administrativo'] },
    { icono: 'menu_book',      label: 'Materias',       ruta: '/sistema/materias',       roles: ['rector','coordinador','administrativo'] },
    { icono: 'groups',         label: 'Grupos',         ruta: '/sistema/grupos',         roles: ['rector','coordinador','administrativo'] },
    { icono: 'schedule',       label: 'Horarios',       ruta: '/sistema/horarios',       roles: ['rector','coordinador','administrativo','docente','padre','estudiante'] },
    { icono: 'grade',          label: 'Calificaciones', ruta: '/sistema/calificaciones', roles: ['rector','coordinador','docente','padre','estudiante'] },
    { icono: 'checklist',      label: 'Asistencia',     ruta: '/sistema/asistencia',     roles: ['rector','coordinador','docente'] },
    { icono: 'campaign',       label: 'Comunicados',    ruta: '/sistema/comunicados',    roles: ['rector','coordinador','administrativo','docente','padre','estudiante'] },
    { icono: 'feedback',       label: 'PQRS',           ruta: '/sistema/pqrs',           roles: ['rector','coordinador','administrativo','padre'] },
    { icono: 'calendar_month', label: 'Calendario',     ruta: '/sistema/calendario',     roles: ['rector','coordinador','administrativo','docente','padre','estudiante'] },
    { icono: 'photo_library',  label: 'Galería',        ruta: '/sistema/galeria',        roles: ['rector','coordinador','administrativo','docente'] },
    { icono: 'settings',       label: 'Configuración',  ruta: '/sistema/configuracion',  roles: ['rector','administrativo'] },
  ];

  get itemsVisibles(): MenuItem[] {
    return this.menuItems.filter(item =>
      item.roles.includes(this.rolActual)
    );
  }

  onToggle() {
    this.toggle.emit();
  }
}