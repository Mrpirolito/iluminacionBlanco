import { Component } from '@angular/core';

@Component({
  selector: 'app-arreglos-lamparas',
  standalone: true,
  templateUrl: './arreglos-lamparas.html',
  styleUrls: ['../servicio-detalle.css'] // Usamos el mismo CSS compartido
})
export class ArreglosLamparas {
  phoneNumber = '34679967754';
  mensajeWhatsApp = encodeURIComponent('Hola, estoy interesado/a en el servicio de arreglos de lámparas y me gustaría más información.');
}
