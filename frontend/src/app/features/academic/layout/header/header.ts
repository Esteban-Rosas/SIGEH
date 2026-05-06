import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  @Input()  sidebarAbierto = true;
  @Output() toggleSidebar  = new EventEmitter<void>();

  // Después vendrá del AuthService
  usuario = {
    nombre:   'Administrador',
    apellido: 'SIGEH',
    rol:      'Rector',
    foto:     null
  };

  menuUsuarioAbierto = false;

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