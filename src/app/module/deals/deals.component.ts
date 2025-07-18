import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [NgbDropdownModule, NgbNavModule, FormsModule, CommonModule],
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent {
  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl modaloneord', centered: true });
  }

}
