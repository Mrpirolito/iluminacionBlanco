import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ProductosService } from '../../services/productos';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit {
  product: any;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('productId');

      if (id) {
        this.productosService.getProductoById(id)
          .then(res => {
            console.log('Producto recibido:', res);
            this.product = res;
            this.cdr.detectChanges(); 
          });
      }
    });
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  goBack() {
    this.location.back();
  }
}