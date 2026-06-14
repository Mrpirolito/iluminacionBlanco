import { Component, AfterViewInit, HostListener, ViewChild, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None,
})
export class Home implements AfterViewInit {
  @ViewChild('heroRef', { static: true }) heroRef!: ElementRef<HTMLElement>;
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  productosPopulares: any[] = [];

  servicios = [
    {
      titulo: 'Arreglos de Lámparas',
      descripcion: 'Devolvemos la vida a tus lámparas favoritas. Reparaciones eléctricas, restauración de piezas y más.',
      enlace: '/servicios/arreglos-lamparas',
      imgNormal: '/images/apagado.png',
      imgHover: '/images/arreglo.jpg',
      imgActual: '/images/apagado.png'
    },
    {
      titulo: 'Pantallas a Medida',
      descripcion: 'Diseña con nosotros la pantalla perfecta para tu espacio. Elegimos juntos telas, formas y tamaños.',
      enlace: '/servicios/pantallas-a-medida',
      imgNormal: '/images/pantallas a medidas.png',
      imgHover: '/images/pantalla.webp',
      imgActual: '/images/pantallas a medidas.png'
    }
  ];

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  velocity = 0;
  lastX = 0;
  lastTime = 0;
  momentumId: number | null = null;

  hasDragged = false;

  constructor(private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              private productosService: ProductosService, private router: Router) {}

  ngOnInit() {
    this.productosService.getProductosPopulares().then((res: { items: any[]; }) => {
          this.productosPopulares = res.items;
          this.cdr.detectChanges();
        });
  }

  ngAfterViewInit(): void {
    this.updateHeroBackground();
    // Esperar 2 frames para que el DOM haya pintado y offsetWidth sea real
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initCarousel();
      });
    });
  }

  private initCarousel(): void {
    const carousel = this.carousel.nativeElement;
    const originalCards = Array.from(carousel.children) as HTMLElement[];
    const numCards = originalCards.length;

    if (numCards === 0) return;

    // Clonar al final y al principio para scroll infinito
    originalCards.forEach(card => carousel.appendChild(card.cloneNode(true)));
    originalCards.slice().reverse().forEach(card => {
      carousel.insertBefore(card.cloneNode(true), carousel.firstChild);
    });

    const cardWidth = originalCards[0].offsetWidth + 16;
    const totalWidth = numCards * cardWidth;
    const startScroll = numCards * cardWidth; // apunta al set original (centro)

    // Saltar sin animación al centro
    carousel.style.scrollBehavior = 'auto';
    carousel.scrollLeft = startScroll;
    requestAnimationFrame(() => { carousel.style.scrollBehavior = ''; });

    // IMPORTANTE: usar < (estrictamente menor) no <=
    // porque startScroll === totalWidth y <= dispararía un reset en la init
    carousel.addEventListener('scroll', () => {
      if (carousel.scrollLeft >= totalWidth * 2) {
        carousel.style.scrollBehavior = 'auto';
        carousel.scrollLeft -= totalWidth;
        requestAnimationFrame(() => { carousel.style.scrollBehavior = ''; });
      } else if (carousel.scrollLeft < totalWidth) {
        carousel.style.scrollBehavior = 'auto';
        carousel.scrollLeft += totalWidth;
        requestAnimationFrame(() => { carousel.style.scrollBehavior = ''; });
      }
    });
  }

  selectCategory(category: string) {
    this.productosService.setSelectedCategory(category);
  }

  onMouseOver(servicio: any) { servicio.imgActual = servicio.imgHover; }
  onMouseOut(servicio: any)  { servicio.imgActual = servicio.imgNormal; }

  @HostListener('window:scroll')
  onWindowScroll() { this.updateHeroBackground(); }

  @HostListener('window:resize')
  onResize() { this.updateHeroBackground(); }

  private updateHeroBackground() {
    try {
      const hero = this.heroRef.nativeElement;
      const rect = hero.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const visibleRatio = rect.height > 0 ? visibleTop / rect.height : 0;
      const offsetRange = 30;
      const offset = (visibleRatio - 0.5) * offsetRange * 2;
      const pos = 50 + offset;
      this.renderer.setStyle(hero, 'backgroundPosition', `center ${pos}%`);
    } catch (e) {}
  }

  goToProductDetails(id: string) { this.router.navigate(['/products', id]); }

  onCategoryClick(event: MouseEvent, category: string) {
    if (this.hasDragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.selectCategory(category);
    this.router.navigate(['/products']);
  }

  scrollToLeft()  { this.carousel.nativeElement.scrollBy({ left: -280, behavior: 'smooth' }); }
  scrollToRight() { this.carousel.nativeElement.scrollBy({ left:  280, behavior: 'smooth' }); }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.hasDragged = false;
    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.lastX = event.pageX;
    this.lastTime = performance.now();
    if (this.momentumId) { cancelAnimationFrame(this.momentumId); this.momentumId = null; }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.3;
    this.carousel.nativeElement.scrollLeft = this.scrollLeft - walk;
    if (Math.abs(walk) > 5) this.hasDragged = true;
    const now = performance.now();
    this.velocity = (event.pageX - this.lastX) / (now - this.lastTime);
    this.lastX = event.pageX;
    this.lastTime = now;
  }

  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.applyMomentum();
  }

  onMouseLeave() { this.onMouseUp(); }

  applyMomentum() {
    const friction = 0.65;
    const step = () => {
      if (Math.abs(this.velocity) < 0.01) { this.momentumId = null; return; }
      this.carousel.nativeElement.scrollLeft -= this.velocity * 20;
      this.velocity *= friction;
      this.momentumId = requestAnimationFrame(step);
    };
    this.momentumId = requestAnimationFrame(step);
  }
}