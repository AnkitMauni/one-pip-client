import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgbDropdownModule, NgbNavModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
 
})
export class OrdersComponent {

  inputText: string = '';
  dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3'];

  selectItem(item: string) {
    this.inputText = item;
  }



  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl modaloneord', centered: true });
  }
}
