import { Component, TemplateRef } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-synchronization',
  standalone: true,
  imports: [NgbDropdownModule, NgbNavModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './synchronization.component.html',
  styleUrls: ['./synchronization.component.scss']
})
export class SynchronizationComponent {
  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg modalone-two', centered: true });
  }
}
