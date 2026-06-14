import { Component, HostListener, AfterViewInit, OnInit, ViewChild, ViewChildren, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.None,
})
export class Header implements OnInit, AfterViewInit {
  menuOpen   = false;
  isDark     = false;
  searchOpen = false;

  @ViewChild('searchInputEl') searchInputEl?: ElementRef<HTMLInputElement>;

  navItems = [
    { label: 'Interior',       href: '/products', category: 'Interior', router: true },
    { label: 'Exterior',       href: '/products', category: 'Exterior', router: true },
    { label: 'Servicios',      href: '/servicios', router: true },
    { label: 'Sobre nosotros', href: '/contact',   router: true },
  ];

  visibleItems  = [...this.navItems];
  overflowItems: Array<any> = [];

  @ViewChild('navContainer', { static: true }) navContainer!: ElementRef<HTMLElement>;
  @ViewChild('measure',      { static: true }) measure!:      ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2,
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Lee preferencia guardada; si no hay ninguna, usa el sistema
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.isDark = saved === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      setTimeout(() => this.searchInputEl?.nativeElement.focus(), 50);
    }
  }

  closeSearch() {
    this.searchOpen = false;
  }

  navigate(path: string, category?: string) {
    if (category) this.productosService.setSelectedCategory(category);
    this.router.navigate([path]);
    if (this.menuOpen) this.toggleMenu();
  }

  onSearch(event: any) {
    const query = event.target.value.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      event.target.value = '';
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  selectCategory(category: string) {
    this.productosService.setSelectedCategory(category);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateNav(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateNav();
    if (window.innerWidth > 768 && this.menuOpen) this.menuOpen = false;
  }

  checkScreenSize() { return window.innerWidth <= 768; }

  private updateNav() {
    if (!this.navContainer || !this.measure) return;
    const container = this.navContainer.nativeElement;
    const measureEl = this.measure.nativeElement;

    measureEl.innerHTML = '';
    const itemEls: HTMLElement[] = [];
    this.navItems.forEach(item => {
      const li = this.renderer.createElement('li');
      this.renderer.setStyle(li, 'display', 'inline-block');
      this.renderer.setStyle(li, 'padding', '6px 12px');
      li.textContent = item.label;
      measureEl.appendChild(li);
      itemEls.push(li as HTMLElement);
    });

    const available = container.clientWidth - 70;
    let used = 0;
    let lastIndex = this.navItems.length;
    for (let i = 0; i < itemEls.length; i++) {
      const w = Math.ceil(itemEls[i].getBoundingClientRect().width);
      if (used + w > available) { lastIndex = i; break; }
      used += w;
    }

    if (lastIndex < this.navItems.length) {
      this.visibleItems  = this.navItems.slice(0, lastIndex);
      this.overflowItems = this.navItems.slice(lastIndex);
    } else {
      this.visibleItems  = [...this.navItems];
      this.overflowItems = [];
    }
  }
}