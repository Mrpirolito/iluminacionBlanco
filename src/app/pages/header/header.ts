import { Component, HostListener, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements AfterViewInit {
  menuOpen = false;

  // structured nav items so we can measure and overflow them
  navItems = [
    { label: 'Interior', href: '#interior' },
    { label: 'Exterior', href: '#exterior' },
    { label: 'Ventiladores', href: '#ventiladores' },
    { label: 'Sobre nosotros', href: '/contact', router: true }
  ];

  visibleItems = [...this.navItems];
  overflowItems: Array<any> = [];

  @ViewChild('navContainer', { static: true }) navContainer!: ElementRef<HTMLElement>;
  @ViewChild('measure', { static: true }) measure!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

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

  // Replaces previous checkScreenSize behaviour used by template
  checkScreenSize() {
    return window.innerWidth <= 768;
  }

  private updateNav() {
    const container = this.navContainer.nativeElement;
    const measureEl = this.measure.nativeElement;

    // clear measure element and render all items for width measurement
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

    const moreButtonWidth = 70; // reserve width for "Más" button approximate
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
