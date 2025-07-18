import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-firewall',
  standalone: true,
  providers: [NgbModal],
  templateUrl: './firewall.component.html',
  styleUrls: ['./firewall.component.scss']
})
export class FirewallComponent {

  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md modalone', centered: true });
  }
}