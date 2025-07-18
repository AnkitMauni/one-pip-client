import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit{
   // Define properties to hold route information
   currentName: any;
 
   currentUrl:any
   
  constructor(private share: ShareService,private route: ActivatedRoute,private router: Router,){
    this.currentUrl = this.router.url;

    // Subscribe to router events to get the updated URL on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      console.log(this.currentUrl); // This will log the current URL
      if(this.currentUrl == '/trading-accounts'){
  this.currentName = 'account'
      }else{
        this.currentName = 'processing'
      }
    });
  }

  cancel(){
    this.share.loader(false)
  }



 
  
   ngOnInit(): void {
     // Access the current route
     this.currentUrl = this.router.url;
    if(this.currentUrl == '/co-trading-account'){
        this.currentName = 'account'
      }
      else if(this.currentUrl == '/co-position'){
        this.currentName = 'position'
      }
      else if(this.currentUrl == '/co-orders'){
        this.currentName = 'order'
      }
      else{
        this.currentName = 'processing'
      }
    // Subscribe to router events to get the updated URL on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      // console.log(this.currentUrl); // This will log the current URL
   
    });
  }
}
