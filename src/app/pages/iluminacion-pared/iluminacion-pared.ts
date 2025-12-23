import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iluminacion-pared',
  templateUrl: './iluminacion-pared.html',
  styleUrls: ['./iluminacion-pared.css'],
  imports: [CommonModule]
})
export class IluminacionPared implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService,
              private cdr: ChangeDetectorRef,
              private router: Router
            ) {}

  ngOnInit() {
    this.productosService.getProductosColeccion("Lamparas de pared") // Cambiado para esta categoría
      .then((res: { items: any[]; }) => {
        console.log(res)
        this.productos = res.items;
        this.cdr.detectChanges();
      });
  }

  goToProductDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
