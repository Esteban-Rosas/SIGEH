import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  menuAbierto = false;
  navbarVisible = false;

  @HostListener('window:scroll')
  onScroll() {
    // El navbar aparece cuando el usuario baja más de la altura de la pantalla
    this.navbarVisible = window.scrollY > window.innerHeight * 0.7;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }
}