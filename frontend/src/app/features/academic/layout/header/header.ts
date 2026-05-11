import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']   // mejor practice (o styleUrl si prefieres)
})
export class HeaderComponent {
  @Input()  sidebarAbierto = true;
  @Output() toggleSidebar  = new EventEmitter<void>();

  usuario = {
    nombre:   'Administrador',
    apellido: 'SIGEH',
    rol:      'Rector',
    foto:     null
  };

  menuUsuarioAbierto = false;
  notificaciones = 10;   // ahora es reactivo
  mensajes = 5;          // cantidad de mensajes nuevos

  toggle() {
    this.toggleSidebar.emit();
  }

  toggleMenuUsuario() {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
  }

  get iniciales(): string {
    return `${this.usuario.nombre[0]}${this.usuario.apellido[0]}`.toUpperCase();
  }

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });
  }
}