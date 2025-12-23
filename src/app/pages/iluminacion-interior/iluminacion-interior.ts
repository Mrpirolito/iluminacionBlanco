import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iluminacion-interior',
  templateUrl: './iluminacion-interior.html',
  styleUrls: ['./iluminacion-interior.css'],
  imports: [CommonModule]
})
export class IluminacionInterior implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService,
              private cdr: ChangeDetectorRef,
              private router: Router
            ) {}

  ngOnInit() {
    this.productosService.getProductosColeccion("Lamparas de interior") // Podrías cambiar esto si tienes diferentes colecciones
      .then((res: { items: any[]; }) => {
        console.log(res)
        this.productos = res.items;
        this.cdr.detectChanges();
      });
  }

  goToProductDetails(id: string) {
    this.router.navigate(['/iluminacion-interior', id]);
  }
}
