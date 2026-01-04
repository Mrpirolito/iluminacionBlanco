import { Injectable } from '@angular/core';
import { createClient } from 'contentful';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // --- Restaurando BehaviorSubject ---
  private selectedCategory = new BehaviorSubject<string>('De pie');
  selectedCategory$ = this.selectedCategory.asObservable();

  private productos: any[] = [];
  private productosLoaded = false;

  private client = createClient({
    space: 'oxrryg6fb2im',
    accessToken: 'ZEwhJNTbs_31vNDJGy-6OBiMgIpIJqOLtLHBAymqIzw'
  });

  constructor() {}

  setSelectedCategory(category: string) {
    this.selectedCategory.next(category);
  }
  // ------------------------------------

  // Obtener todos los productos
  getProductos() {
    return this.client.getEntries({
      content_type: 'productos',
      order: ['fields.productName']
    }).then(res => {
      console.log("productos: ", res.items)
      this.productos = res.items;
      this.productosLoaded = true;
      return res;
    }).catch(error => {
      console.error('Error cargando productos:', error);
      throw error;
    });
  }

  // Obtener todos de una coleccion
  getProductosColeccion(coleccion: string) {
    return this.client.getEntries({
      content_type: 'productos',
      order: ['fields.productName'],
      'fields.productColection': coleccion
    });
  }

  // Obtener un producto por ID (opcional)
  getProductoById(id: string) {
    return this.client.getEntry(id);
  }

  // --- NUEVO MÉTODO DE BÚSQUEDA ---
  searchProductosByName(query: string) {
    return this.client.getEntries({
      content_type: 'productos',
      order: ['fields.productName'],
      'fields.productName[contains]': query
    });
  }

  getProductosPopulares() {
    return this.client.getEntries({
        content_type: 'productos',
        order: ['fields.productName'],
        'fields.productPopular': true        
      }).then(res => {
        this.productos = res.items;
        return res;
      }).catch(error => {
        console.error('Error cargando productos:', error);
        throw error;
      });
  }
}