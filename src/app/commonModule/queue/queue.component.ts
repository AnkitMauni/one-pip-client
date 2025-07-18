import { Component, Input, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  currentTab: any = "tab1";

 
  @Input()shareInputNav=0
  nvatabc (tab: any){
    this.currentTab = tab
  }
  constructor(private share:ShareService){

  }
  ngOnInit(): void {
    console.log("shareInputNav queue",this.shareInputNav);
    
  }

  queueClose(){
    this.share.shareNavigation(
      {
        name: "Queue", 
        flag: false
      }
    )
  }
}
