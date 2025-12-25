import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importamos CommonModule

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterModule, CommonModule], // Lo añadimos a los imports
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class Servicios {
  
  // 1. Creamos un array con los datos de nuestros servicios
  servicios = [
    {
      titulo: 'Arreglos de Lámparas',
      descripcion: 'Devolvemos la vida a tus lámparas favoritas. Reparaciones eléctricas, restauración de piezas y más.',
      enlace: '/servicios/arreglos-lamparas',
      imgNormal: 'images/apagado.png',
      imgHover: 'images/arreglo.jpg', // Imagen al pasar el ratón
      imgActual: 'images/apagado.png' // Imagen que se muestra actualmente
    },
    {
      titulo: 'Pantallas a Medida',
      descripcion: 'Diseña con nosotros la pantalla perfecta para tu espacio. Elegimos juntos telas, formas y tamaños.',
      enlace: '/servicios/pantallas-a-medida',
      imgNormal: 'images/pantallas a medidas.png',
      imgHover: 'images/pantalla.jpg', // Imagen al pasar el ratón
      imgActual: 'images/pantallas a medidas.png' // Imagen que se muestra actualmente
    }
  ];

  // 2. Método que se activa cuando el ratón entra en la tarjeta
  onMouseOver(servicio: any) {
    servicio.imgActual = servicio.imgHover;
  }

  // 3. Método que se activa cuando el ratón sale de la tarjeta
  onMouseOut(servicio: any) {
    servicio.imgActual = servicio.imgNormal;
  }
}
