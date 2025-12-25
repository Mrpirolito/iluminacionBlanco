import { Component, HostListener, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importar Router
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements AfterViewInit {
  menuOpen = false;

  // Actualizamos la estructura de navItems
  navItems = [
    { label: 'Interior', href: '/products', category: 'Lamparas de interior', router: true },
    { label: 'Exterior', href: '/products', category: 'Lamparas de exterior', router: true },
    { label: 'Servicios', href: '/servicios', router: true },
    { label: 'Sobre nosotros', href: '/contact', router: true },
  ];

  visibleItems = [...this.navItems];
  overflowItems: Array<any> = [];

  @ViewChild('navContainer', { static: true }) navContainer!: ElementRef<HTMLElement>;
  @ViewChild('measure', { static: true }) measure!: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2, 
    private productosService: ProductosService,
    private router: Router
  ) {}

  // Nuevo método de navegación unificado
  navigate(path: string, category?: string) {
    if (category) {
      this.productosService.setSelectedCategory(category);
    }
    this.router.navigate([path]);
    
    // Si el menú está abierto, lo cerramos
    if (this.menuOpen) {
      this.toggleMenu();
    }
  }

  // Método para el buscador
  onSearch(event: any) {
    const query = event.target.value.trim(); // Usamos trim() para limpiar espacios
    if (query) { // Solo buscamos si hay texto
      this.router.navigate(['/search'], { queryParams: { q: query } });
      event.target.value = ''; // Limpiamos el input
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


  // Nuevo método para establecer la categoría desde el header
  selectCategory(category: string) {
    this.productosService.setSelectedCategory(category);
  }

  // Mantenemos toda la lógica del menú responsive
  ngAfterViewInit(): void {
    // initial layout
    setTimeout(() => this.updateNav(), 0);
  }
  @HostListener('window:resize')
  onResize() {
    // update nav layout on resize
    this.updateNav();
    if (window.innerWidth > 768 && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  checkScreenSize() {
    return window.innerWidth <= 768;
  }

  private updateNav() {
    const container = this.navContainer.nativeElement;
    const measureEl = this.measure.nativeElement;

    measureEl.innerHTML = '';
    const itemEls: HTMLElement[] = [];
    this.navItems.forEach(item => {
      const li = this.renderer.createElement('li');
      this.renderer.setStyle(li, 'display', 'inline-block');
      this.renderer.setStyle(li, 'padding', '6px 8px');
      li.textContent = item.label;
      measureEl.appendChild(li);
      itemEls.push(li as HTMLElement);
    });

    const moreButtonWidth = 70; 
    const available = container.clientWidth - moreButtonWidth;

    let used = 0;
    let lastIndex = this.navItems.length;
    for (let i = 0; i < itemEls.length; i++) {
      const w = Math.ceil(itemEls[i].getBoundingClientRect().width);
      if (used + w > available) {
        lastIndex = i;
        break;
      }
      used += w;
    }

    if (lastIndex < this.navItems.length) {
      this.visibleItems = this.navItems.slice(0, lastIndex);
      this.overflowItems = this.navItems.slice(lastIndex);
    } else {
      this.visibleItems = [...this.navItems];
      this.overflowItems = [];
    }
  }
}

