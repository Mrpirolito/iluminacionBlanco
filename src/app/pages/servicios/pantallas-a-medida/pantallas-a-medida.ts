import { Component } from '@angular/core';

@Component({
  selector: 'app-pantallas-a-medida',
  standalone: true,
  templateUrl: './pantallas-a-medida.html',
  styleUrls: ['../servicio-detalle.css'] // Usamos el mismo CSS compartido
})
export class PantallasAMedida {
  phoneNumber = '34679967754';
  mensajeWhatsApp = encodeURIComponent('Hola, estoy interesado/a en el servicio de pantallas a medida y me gustaría más información.');
}
