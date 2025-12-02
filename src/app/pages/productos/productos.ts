import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  imports: [CommonModule]
})
export class Productos implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService,
              private cdr: ChangeDetectorRef,
              private router: Router
            ) {}

  ngOnInit() {
    this.productosService.getProductosColeccion("Lamparas de interior")
      .then((res: { items: any[]; }) => {
        console.log(res)
        this.productos = res.items;
        this.cdr.detectChanges(); // 👈 fuerza actualización de la vista
      });
  }

  goToProductDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
