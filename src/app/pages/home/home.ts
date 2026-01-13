import { Component, AfterViewInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos'; // Importamos el servicio
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('heroRef', { static: true }) heroRef!: ElementRef<HTMLElement>;
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;

  productosPopulares: any[] = [];

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  velocity = 0;
  lastX = 0;
  lastTime = 0;
  momentumId: number | null = null;

  hasDragged = false;

  // Inyectamos el servicio en el constructor
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
    // set an initial position
    this.updateHeroBackground();
  }

  // Nuevo método para establecer la categoría
  selectCategory(category: string) {
    this.productosService.setSelectedCategory(category);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateHeroBackground();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateHeroBackground();
  }

  private updateHeroBackground() {
    try {
      const hero = this.heroRef.nativeElement;
      const rect = hero.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Compute how much of the hero is visible (0..1)
      const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const visibleRatio = rect.height > 0 ? visibleTop / rect.height : 0;

      // Map visibleRatio to an offset percentage around 50% (center)
      // When hero is scrolled up (visibleRatio small) show top of image; when scrolled down (visibleRatio large) show bottom
      const offsetRange = 30; // percentage range to move (±30%)
      const offset = (visibleRatio - 0.5) * offsetRange * 2; // -30 .. +30

      const pos = 50 + offset; // base 50% (center)
      this.renderer.setStyle(hero, 'backgroundPosition', `center ${pos}%`);
    } catch (e) {
      // defensive: ignore if something goes wrong
    }
  }

  goToProductDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  onCategoryClick(event: MouseEvent, category: string) {
    if (this.hasDragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.selectCategory(category);
    this.router.navigate(['/products']);
  }

  scrollToLeft() {
    document.querySelector('.category-carousel')
      ?.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollToRight() {
    document.querySelector('.category-carousel')
      ?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.hasDragged = false;

    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;

    this.lastX = event.pageX;
    this.lastTime = performance.now();

    // cortar inercia si existía
    if (this.momentumId) {
      cancelAnimationFrame(this.momentumId);
      this.momentumId = null;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();

    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.3;

    this.carousel.nativeElement.scrollLeft = this.scrollLeft - walk;

    // detectar drag real (para cancelar click)
    if (Math.abs(walk) > 5) {
      this.hasDragged = true;
    }

    // calcular velocidad
    const now = performance.now();
    const dx = event.pageX - this.lastX;
    const dt = now - this.lastTime;

    this.velocity = dx / dt;

    this.lastX = event.pageX;
    this.lastTime = now;
  }

  onMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.applyMomentum();
  }

  onMouseLeave() {
    this.onMouseUp();
  }

  applyMomentum() {
    const friction = 0.65;

    const step = () => {
      if (Math.abs(this.velocity) < 0.01) {
        this.momentumId = null;
        return;
      }

      this.carousel.nativeElement.scrollLeft -= this.velocity * 20;
      this.velocity *= friction;

      this.momentumId = requestAnimationFrame(step);
    };

    this.momentumId = requestAnimationFrame(step);
  }

}
