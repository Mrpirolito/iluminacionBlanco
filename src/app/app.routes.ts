import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Productos } from './pages/productos/productos';  
import { ProductDetails } from './pages/product-details/product-details';  
import { Servicios } from './pages/servicios/servicios';
import { ArreglosLamparas } from './pages/servicios/arreglos-lamparas/arreglos-lamparas';
import { PantallasAMedida } from './pages/servicios/pantallas-a-medida/pantallas-a-medida';

export const routes: Routes = [
  { path: '', component: Home  },
  { path: 'contact', component: Contact},
  { path: 'products', component: Productos},
  { path: 'products/:productId', component: ProductDetails},
  // --- Rutas de Servicios ---
  { path: 'servicios', component: Servicios },
  { path: 'servicios/arreglos-lamparas', component: ArreglosLamparas },
  { path: 'servicios/pantallas-a-medida', component: PantallasAMedida },
];
