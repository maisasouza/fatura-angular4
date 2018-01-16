import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nova-conta-modal',
  templateUrl: './nova-conta-modal.component.html',
  styleUrls: ['./nova-conta-modal.component.css']
})
export class NovaContaModalComponent {

  constructor(public activeModal: NgbActiveModal) { }
}
