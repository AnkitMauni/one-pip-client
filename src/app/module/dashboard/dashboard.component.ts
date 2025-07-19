import { CommonModule } from '@angular/common';
import {
  NgbCarouselModule,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { ShareService } from 'src/app/services/share.service';
import { GlobalService } from 'src/app/services/global.service';

import { AdvancedChartComponent } from '../advanced-chart/advanced-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbCarouselModule,
    NgbAccordionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvancedChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  pop = false;
  popUP = false;
  selectedOverlay = 'abands';
  selectedOscillator = 'abspriceindicator';

  showChart = 1;
  DC_URL = '';

  accountList: any[] = [];
  accountActiveList: any[] = [];
  accountUnActiList: any[] = [];

  getLocaAccList: any = [];
  checkSymboldata: any[] = [];

  activeTab = 1;

  constructor(
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private api: GlobalService,
    private router: Router,
    private share: ShareService,
    private http: HttpClient
  ) {
    this.accountList = JSON.parse(localStorage.getItem('brokerAccList') || '[]');
    this.accountActiveList = this.accountList.filter(
      (list: any) => list.account === Number(localStorage.getItem('AccountID'))
    );
    this.accountUnActiList = this.accountList.filter(
      (list: any) => list.account !== Number(localStorage.getItem('AccountID'))
    );

    this.checkSymboldata = JSON.parse(localStorage.getItem('chartData') || '[]');
    this.getLocaAccList = localStorage.getItem('brokerAccList');

    this.showChart = this.getLocaAccList === '[]' ? 2 : 1;

    this.share.sharedData$.subscribe((data: any) => {
      if (data?.DC_URL) {
        this.DC_URL = data.DC_URL;
      } else {
        const storedTradeString = localStorage.getItem('admin');
        if (storedTradeString) {
          const storedTrade = JSON.parse(storedTradeString);
          this.DC_URL = storedTrade.DC_URL;
        } else {
          console.error("No 'admin' data found in localStorage.");
        }
      }
    });
  }

}
