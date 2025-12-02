import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Productos } from './pages/productos/productos';  
import { ProductDetails } from './pages/product-details/product-details';  

export const routes: Routes = [
  { path: '', component: Home  },
  { path: 'contact', component: Contact},
  { path: 'products', component: Productos},
  { path: 'products/:productId', component: ProductDetails},
];
