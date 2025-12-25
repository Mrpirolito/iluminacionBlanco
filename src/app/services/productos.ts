import { Injectable } from '@angular/core';
import { createClient } from 'contentful';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // --- Restaurando BehaviorSubject ---
  private selectedCategory = new BehaviorSubject<string>('Lámparas de pie');
  selectedCategory$ = this.selectedCategory.asObservable();

  private productos: any[] = [];
  private productosLoaded = false;

  private client = createClient({
    space: 'frd9fa5cfgsv',
    accessToken: '3EVmCK7az5pUtHrGOp7aw7vunkApJWf0fp9np_SwwYo'
  });

  constructor() {}

  setSelectedCategory(category: string) {
    this.selectedCategory.next(category);
  }
  // ------------------------------------

  // Obtener todos los productos
  getProductos() {
    if (this.productosLoaded) {
      return Promise.resolve({ items: this.productos });
    } else {
      return this.client.getEntries({
        content_type: 'product',
        // order: 'fields.orden' // opcional: ordena por campo
      }).then(res => {
        this.productos = res.items;
        this.productosLoaded = true;
        return res;
      }).catch(error => {
        console.error('Error cargando productos:', error);
        throw error;
      });
    }
  }

  // Obtener todos de una coleccion
  getProductosColeccion(coleccion: string) {
    return this.client.getEntries({
      content_type: 'product',
      'fields.productColeccion': coleccion
    });
  }

  // Obtener un producto por ID (opcional)
  getProductoById(id: string) {
    return this.client.getEntry(id);
  }

  // --- NUEVO MÉTODO DE BÚSQUEDA ---
  searchProductosByName(query: string) {
    return this.client.getEntries({
      content_type: 'product',
      'fields.productName[contains]': query
    });
  }
}