import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {
  constructor(private router:Router) {
    
  }
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
