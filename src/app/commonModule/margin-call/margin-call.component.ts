import { Component,Input, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-margin-call',
  templateUrl: './margin-call.component.html',
  styleUrls: ['./margin-call.component.scss']
})
export class MarginCallComponent implements OnInit {
  
  @Input()shareInputNav=0
  currentTab: any = "tab1";
  nvatabc (tab: any){
    this.currentTab = tab
  }
  
  constructor(private share:ShareService){

  }
  ngOnInit(): void {
    console.log("shareInputNav margin",this.shareInputNav);
    
  }

  marginClose(){
    this.share.shareNavigation(
      {
        name: "Margin", 
        flag: false
      }
    )
  }
}
