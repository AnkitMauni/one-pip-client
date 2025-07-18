import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-deals',
  standalone: true,
  imports: [],
  templateUrl: './order-deals.component.html',
  styleUrls: ['./order-deals.component.scss']
})
export class OrderDealsComponent {
  constructor(private router:Router) {
    
  }
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
