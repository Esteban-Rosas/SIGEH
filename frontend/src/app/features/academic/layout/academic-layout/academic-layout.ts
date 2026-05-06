import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';

@Component({
  standalone: true,
  selector: 'app-academic-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './academic-layout.html',
  styleUrl: './academic-layout.css'
})
export class AcademicLayoutComponent {
  sidebarAbierto = true;

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}