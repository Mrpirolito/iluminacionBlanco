import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  overlayActive = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    // Only for contact page: show overlay after the user scrolls down
    this.overlayActive = window.scrollY > 500;
  }

}
