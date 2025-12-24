import { Component, AfterViewInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos'; // Importamos el servicio
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('heroRef', { static: true }) heroRef!: ElementRef<HTMLElement>;
  productosPopulares: any[] = [];

  // Inyectamos el servicio en el constructor
  constructor(private renderer: Renderer2, private productosService: ProductosService, private router: Router) {}

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

}
