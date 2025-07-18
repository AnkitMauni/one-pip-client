import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-data-feeds-inner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-feeds-inner.component.html',
  styleUrls: ['./data-feeds-inner.component.scss']
})
export class DataFeedsInnerComponent {
  currentTab: any = "tab2";
  nvatabc (tab: any){
    this.currentTab = tab
  }
}
