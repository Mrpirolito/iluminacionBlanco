import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  imports: [CommonModule]
})
export class Productos implements OnInit, OnDestroy {

  productos: any[] = [];
  private categorySubscription: Subscription | undefined;

  constructor(private productosService: ProductosService,
              private cdr: ChangeDetectorRef,
              private router: Router
            ) {}

  ngOnInit() {
    console.log(`Entrando a lista de productos`)
    this.categorySubscription = this.productosService.selectedCategory$.subscribe(category => {
      if (category === 'Todos') {
        this.productosService.getProductos()
        .then((res: { items: any[]; }) => {
          console.log(`Cargando productos para: ${category}`, res);
          this.productos = res.items;
          this.cdr.detectChanges();
        });
    } else {
      this.productosService.getProductosColeccion(category)
        .then((res: { items: any[]; }) => {
          console.log(`Cargando productos para: ${category}`, res);
          this.productos = res.items;
          this.cdr.detectChanges();
        });
    }
    });
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

    goToProductDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  // Nuevo método para cambiar la categoría desde el sidebar de esta página
  setCategory(category: string) {
    this.productosService.setSelectedCategory(category);
  }
}

