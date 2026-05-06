import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  // Saludo dinámico según la hora (opcional)
  get saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  // Resumen de módulos (ahora con nombres de icono Material)
  resumen = [
    { icono: 'school',      label: 'Estudiantes',  valor: '0', color: '#1C4E80' },
    { icono: 'person',      label: 'Docentes',     valor: '0', color: '#2E7D32' },
    { icono: 'menu_book',   label: 'Materias',     valor: '0', color: '#6A1B9A' },
    { icono: 'campaign',    label: 'Comunicados',  valor: '0', color: '#E65100' },
  ];
}