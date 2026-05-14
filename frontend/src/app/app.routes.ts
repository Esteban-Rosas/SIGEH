import { Routes } from '@angular/router';

export const routes: Routes = [
  // ── Página pública ──────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/public/pages/home/home')
        .then(m => m.HomeComponent)
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./features/public/pages/about/about')
        .then(m => m.About)
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./features/public/pages/services/services')
        .then(m => m.Services)
  },
  {
    path: 'noticias',
    loadComponent: () =>
      import('./features/public/pages/news/news')
        .then(m => m.News)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/public/pages/contact/contact')
        .then(m => m.Contact)
  },

  // ── Login del sistema ────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/academic/pages/login/login')
        .then(m => m.Login)
  },

  // ── Sistema académico (protegido) ────────────────
  {
    path: 'sistema',
    loadComponent: () =>
      import('./features/academic/layout/academic-layout/academic-layout')
        .then(m => m.AcademicLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/academic/pages/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'estudiantes',
        loadComponent: () =>
          import('./features/academic/pages/estudiantes/estudiantes')
            .then(m => m.EstudiantesComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
