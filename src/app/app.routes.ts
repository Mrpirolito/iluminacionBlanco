import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Productos } from './pages/productos/productos';  
import { ProductDetails } from './pages/product-details/product-details';  
import { IluminacionInterior } from './pages/iluminacion-interior/iluminacion-interior';
import { IluminacionPared } from './pages/iluminacion-pared/iluminacion-pared';
import { IluminacionExterior } from './pages/iluminacion-exterior/iluminacion-exterior';

export const routes: Routes = [
  { path: '', component: Home  },
  { path: 'contact', component: Contact},
  { path: 'products', component: Productos},
  { path: 'products/:productId', component: ProductDetails},
  { path: 'iluminacion-interior', component: IluminacionInterior },
  { path: 'iluminacion-pared', component: IluminacionPared },
  { path: 'iluminacion-exterior', component: IluminacionExterior },
];
