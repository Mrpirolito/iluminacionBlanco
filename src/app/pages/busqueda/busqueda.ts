import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './busqueda.html',
  styleUrls: ['../productos/productos.css'] // Reutilizamos el CSS de productos
})
export class Busqueda implements OnInit {
  
  productos: any[] = [];
  allProductos: any[] = [];
  query: string | null = '';
  busquedaRealizada = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Suscribimos a los query params primero
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q');
      this.filterProductos();
    });

    // Obtenemos todos los productos
    this.productosService.getProductos().then(res => {
      this.allProductos = res.items;
      this.filterProductos();
    }).catch(error => {
      console.error('Error cargando productos:', error);
    });
  }

  private filterProductos() {
    if (this.query && this.allProductos.length > 0) {
      this.productos = this.allProductos.filter(producto => 
        producto.fields.productName.toLowerCase().includes(this.query!.toLowerCase())
      );
      this.busquedaRealizada = true;
    } else {
      this.productos = [];
      this.busquedaRealizada = false;
    }
    this.cdr.detectChanges();
  }

  goToProductDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
