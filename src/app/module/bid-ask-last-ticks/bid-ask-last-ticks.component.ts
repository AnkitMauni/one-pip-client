import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bid-ask-last-ticks',
  standalone: true,
  providers: [NgbModal],
  templateUrl: './bid-ask-last-ticks.component.html',
  styleUrls: ['./bid-ask-last-ticks.component.scss']
})
export class BidAskLastTicksComponent {
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md modalone', centered: true });
  }
}
