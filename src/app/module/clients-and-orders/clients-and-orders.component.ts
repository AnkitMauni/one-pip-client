import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-and-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-and-orders.component.html',
  styleUrls: ['./clients-and-orders.component.scss']
})
export class ClientsAndOrdersComponent {
  currentTab: any = "tab1";
  nvatabc (tab: any){
    this.currentTab = tab
  }



  personalTab: any = "tab1";
  personaltab (tab: any){
    this.personalTab = tab
  }

  individualTab: any = "tab1";
  individualtabc (tab: any){
    this.individualTab = tab
  }

  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig, private router:Router) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl modalone', centered: true });
  }

  
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
