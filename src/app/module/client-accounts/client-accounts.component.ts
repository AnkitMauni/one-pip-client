import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-accounts',
  standalone: true,
  imports: [],
  templateUrl: './client-accounts.component.html',
  styleUrls: ['./client-accounts.component.scss']
})
export class ClientAccountsComponent {
  constructor(private router:Router) {
    
  }
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
