import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-feeds',
  standalone: true,
  imports: [],
  templateUrl: './data-feeds.component.html',
  styleUrls: ['./data-feeds.component.scss']
})
export class DataFeedsComponent {
  constructor(private router:Router) {
    
  }
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
