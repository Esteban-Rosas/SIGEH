import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar';

declare var anime: any;

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private animatedStats = false;

  ngAfterViewInit() {
    this.initEntranceAnimations();
    this.initScrollReveal();
    this.initRevealAlScroll();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initEntranceAnimations() {
    // Animación de entrada para los elementos del hero
    anime.timeline({
      easing: 'easeOutExpo',
      duration: 800
    })
    .add({
      targets: '.animate-badge',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600
    })
    .add({
      targets: '.animate-title',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=400')
    .add({
      targets: '.animate-desc',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.animate-buttons',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.animate-stats',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.animate-image',
      translateX: [50, 0],
      opacity: [0, 1],
      duration: 900,
      easing: 'easeOutElastic(1, .5)'
    }, '-=600');

    // Animación de entrada para los pills con stagger
    anime({
      targets: '.animate-pill',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(80),
      easing: 'easeOutQuad'
    });

    anime({
      targets: '.animate-niveles-titulo',
      translateX: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutQuad'
    });
  }

  private initScrollReveal() {
    // Configurar Intersection Observer para contar stats cuando aparezcan
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection && !this.animatedStats) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animatedStats) {
            this.animatedStats = true;
            this.animateStatsNumbers();
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.5 });
      
      this.observer.observe(statsSection);
    } else {
      // Si no hay observer, animar igualmente después de un pequeño delay
      setTimeout(() => {
        if (!this.animatedStats) {
          this.animatedStats = true;
          this.animateStatsNumbers();
        }
      }, 1500);
    }

    // Animación sutil para las pills cuando entran en scroll (además de la inicial)
    const nivelesSection = document.querySelector('.niveles');
    if (nivelesSection) {
      const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: '.nivel-pill',
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: 400,
              delay: anime.stagger(50),
              easing: 'easeOutBack'
            });
            pillObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      
      pillObserver.observe(nivelesSection);
    }
  }

  private animateStatsNumbers() {
    // Animar el número de niveles (10)
    const nivelesStat = document.querySelector('.stat-num[data-target="10"]');
    if (nivelesStat && nivelesStat.textContent !== '10') {
      anime({
        targets: nivelesStat,
        innerHTML: [0, 10],
        round: 1,
        easing: 'easeOutQuad',
        duration: 1500,
        update: (anim: any) => {
          if (nivelesStat) {
            nivelesStat.textContent = String(Math.floor(anim.animations[0].currentValue));
          }
        }
      });
    }

    // Animar el porcentaje de aulas digitales (100%)
    const aulasStat = document.querySelector('.stat-num[data-target="100"]');
    if (aulasStat && aulasStat.textContent !== '100%') {
      anime({
        targets: aulasStat,
        innerHTML: [0, 100],
        round: 1,
        easing: 'easeOutQuad',
        duration: 1500,
        update: (anim: any) => {
          if (aulasStat) {
            const value = Math.floor(anim.animations[0].currentValue);
            aulasStat.textContent = value + (value === 100 ? '%' : '');
          }
        },
        complete: () => {
          if (aulasStat && aulasStat.textContent !== '100%') {
            aulasStat.textContent = '100%';
          }
        }
      });
    }

    // Efecto de pulso para el texto ABP
    const abpStat = document.querySelector('.stat-text');
    if (abpStat) {
      anime({
        targets: abpStat,
        scale: [0.8, 1.2, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
    }
  }

  scrollAlContenido() {
    const contenido = document.getElementById('contenido-principal');
    if (contenido) {
      contenido.scrollIntoView({ behavior: 'smooth' });
    }
  }
  private initRevealAlScroll() {
  const elementos = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Pequeño delay escalonado entre tarjetas
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observer.observe(el));
}
}