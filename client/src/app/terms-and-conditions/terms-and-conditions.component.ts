import { Component, OnInit,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  @Output() termsAccepted = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  acceptTerms() {
    // Puedes realizar acciones adicionales aquí antes de emitir el evento
    this.termsAccepted.emit();
  }

}


