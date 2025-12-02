import { Injectable } from '@angular/core';
import { createClient } from 'contentful';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private client = createClient({
    space: 'frd9fa5cfgsv',
    accessToken: '3EVmCK7az5pUtHrGOp7aw7vunkApJWf0fp9np_SwwYo'
  });

  constructor() {}

  // Obtener todos los productos
  getProductos() {
    return this.client.getEntries({
      content_type: 'product',
      // order: 'fields.orden' // opcional: ordena por campo
    });
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
}