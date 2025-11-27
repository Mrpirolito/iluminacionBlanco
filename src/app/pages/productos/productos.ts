import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  imports: [CommonModule]
})
export class Productos implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService,
              private cdr: ChangeDetectorRef
            ) {}

  ngOnInit() {
    this.productosService.getProductos()
      .then((res: { items: any[]; }) => {
        console.log(res)
        this.productos = res.items;
        this.cdr.detectChanges(); // 👈 fuerza actualización de la vista
      });
  }
}
