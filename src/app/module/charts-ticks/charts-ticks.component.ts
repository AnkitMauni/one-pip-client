import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charts-ticks',
  standalone: true,
  imports: [],
  templateUrl: './charts-ticks.component.html',
  styleUrls: ['./charts-ticks.component.scss']
})
export class ChartsTicksComponent {
  constructor(private router:Router) {
    
  }
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
