import { CommonModule } from '@angular/common';
import {
  NgbCarouselModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Subscription, Unsubscribable } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ShareService } from 'src/app/services/share.service';
import { GlobalService } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { AdvancedChartComponent } from '../advanced-chart/advanced-chart.component';

declare const myFunction: any;
declare const setupDataUpdateInterval: any;
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbCarouselModule,
    NgbAccordionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,AdvancedChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  overlays: any = [];
  pop: boolean = false;
  popUP: boolean = false;
  selectedOverlay: string = 'abands';
  oscillators: any = [];
  returnSeriesData: any = [];
  serialData: any = [];
  indicateor: any = -20;
  allHistoryData: any = [];
  allHistoryData2: any = [];

  selectedOscillator: string = 'abspriceindicator';
  tradesValue: any = [];
  indicatorValue: any = [];
  indicObj: any = [];

  showChart: any = 1;
  getLocaAccList: any = [];

  checkSymboldata: any = [];
  checkSymboldata1: any = [];
  gotValue: boolean = false;
  accountList: any = [];
  accountActiveList: any = [];
  accountUnActiList: any = [];
  DC_URL: any = '';

  constructor(
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private api: GlobalService,
    private router: Router,
    private share: ShareService,
    private http: HttpClient
  ) {
    this.accountList = JSON.parse(
      localStorage.getItem('brokerAccList') || '[]'
    );
    this.accountActiveList = this.accountList.filter(
      (list: any) => list.account === Number(localStorage.getItem('AccountID'))
    );

    if (this.accountActiveList.length > 0) {
    }
    this.accountUnActiList = this.accountList.filter(
      (list: any) => list.account != Number(localStorage.getItem('AccountID'))
    );

    this.checkSymboldata = JSON.parse(
      localStorage.getItem('chartData') || '[]'
    );

    this.getLocaAccList = localStorage.getItem('brokerAccList');
    if (this.getLocaAccList == '[]') {
      this.showChart = 2;
    } else {
      this.showChart = 1;
    }

    this.tradesValue = JSON.parse(localStorage.getItem('trades') || '[]');
    this.indicatorValue = JSON.parse(localStorage.getItem('indicator') || '[]');

    this.share.sharedData$.subscribe((data: any) => {
      if (data) {
        console.log('dataa', data);
        //  this.qoutes =(data.Sock_Quote).replace(/\\/g, "//")
        this.DC_URL = data.DC_URL;
      } else {
        // const storedQuote = localStorage.getItem('Sock_Quote');
        // this.qoutes = storedQuote ? storedQuote.replace(/\\/g, "//") : "";
        // console.log(this.qoutes);

        const storedTradeString = localStorage.getItem('admin'); // Get item from localStorage

        if (storedTradeString) {
          const storedTrade = JSON.parse(storedTradeString); // Parse JSON string to object
          this.DC_URL = storedTrade.DC_URL; // Access DC_URL property
          // console.log('this.DC_URL:', storedTrade, this.DC_URL);
        } else {
          console.error("No 'admin' data found in localStorage.");
        }
      }
    });
  }
  private chartDataSubscription: any;

  symbolDataVal: any;

  getSubscriveLiveData(): void {
    console.log('data', localStorage.getItem('changeSym'));
    this.share.changeSym$.subscribe((res) => {
      const sym = res === 'NoData' ? 'AUDUSD.c_5200' : res;
      this.symbolDataVal = sym;
      localStorage.setItem('changeSym', sym);
      this.historyData(sym);
    });
  }
  indData: any;
  chartData: any = [];
  ngOnInit() {
    this.commAphaNum(10);
  }
  ngAfterViewInit(): void {
    this.getSubscriveLiveData();
     (window as any).onRangeSelectorClick = (period: number) => {
      console.log("Hi chacha", period);
    // const symbol = localStorage.getItem('changeSym') || 'AUDUSD.c_5200';
    this.historyData(this.symbolDataVal, period);
  };
  }
  validateOHLC(element: any): number[] | null {
    const time = element.TimeSec ? Number(element.TimeSec) : null;
    const open = parseFloat(element.Open);
    const high = parseFloat(element.High);
    const low = parseFloat(element.Low);
    const close = parseFloat(element.Close);

    if (
      time === null ||
      isNaN(open) ||
      isNaN(high) ||
      isNaN(low) ||
      isNaN(close)
    ) {
      return null;
    }

    const timestamp = time.toString().length === 10 ? time * 1000 : time;
    return [timestamp, open, high, low, close];
  }

  randomNumber: any;
  generateRandomNumber() {
    // Generate a random number between 10 and 99
    this.randomNumber = Math.floor(Math.random() * 90) + 10;
    console.log(' generateRandomNumber()', this.randomNumber);
  }

  redirectNew() {
    this.generateRandomNumber();
    const data = {
      sym: localStorage.getItem('setSymbol'),
      info: localStorage.getItem('Info'),
    };
    console.log('data', data);

    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data),
      },
    };

    this.router.navigate(['/', 'trade-buysell', this.randomNumber], navData);
  }

  getSeries(data: any, volume: any) {
    let val = [
      {
        type: 'sma',
        linkedTo: 'BTCUSD',
      },
      {
        type: 'sma',
        linkedTo: 'BTCUSD',
        params: {
          period: 50,
        },
      },
      {
        type: 'column',
        id: 'volume',
        name: 'Volume',
        data: volume,
        yAxis: 1,
      },
      {
        type: 'pc',
        id: 'overlay',
        linkedTo: 'BTCUSD',
        yAxis: 0,
      },
      {
        type: 'macd',
        id: 'oscillator',
        linkedTo: 'BTCUSD',
        yAxis: 2,
      },
    ];
    return [];
  }
  OpenPop(val: any) {
    this.indicateor = val;
  }

  obj: any;

  dataMK: any = [];

  modelData: any;
  SymbolName: any;
  clickSelectSym(sym: any, info: any) {
    // this.marketDataSubscription.unsubscribe()
    this.cdr.detectChanges();

    localStorage.setItem('setSymbol', sym);
    localStorage.setItem('Info', info);

    this.toggleActive('item2', 'chart');
    // this.historyData(this.SymbolName)
  }

  toggleActive(item: string, val: any) {
    if (item) {
      this.router.navigateByUrl(`${val}`);
      // this.share.setActiveRoute(item);
    }
  }

  id: any;
  digitFixed: any;
  commAphaNum(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    this.id = result;

    return result;
  }

  activeTab: any = 1;
  clickTab(val: any) {
    this.activeTab = val;
  }

  historyDataValue: any = [];
  historyDataValue1: any = [];
  ohlc: any = [];
  volume: any = [];
  SymbInfo: any = {};
  newOHLC300: any = [];
  formattedDate: any;
  private marketDataSubscription: any = Subscription;

  unixEpochTime: any;

  historyData(val: string, _oPeriod:number=1): void {
    console.log("data", val, "_operiod", _oPeriod);
    // if (this.chartDataSubscription) {
    //   this.chartDataSubscription.unsubscribe();
    // }
    this.ohlc = [];
    const obj = { Symbol: val, oPeriod: _oPeriod };

    this.http.post(`${this.DC_URL}GET_DM_HG_CHRT`, obj).subscribe({
      next: (res: any) => {
     
        this.historyDataValue1 = res.lstData.reverse()
        .map(this.validateOHLC)
        .filter((val:any): val is number[] => Array.isArray(val));


        for (let i = 0; i < this.historyDataValue1.length; i++) {
          this.ohlc.push([
            this.historyDataValue1[i][0],
            this.historyDataValue1[i][1],
            this.historyDataValue1[i][2],
            this.historyDataValue1[i][3],
            this.historyDataValue1[i][4],
          ]);
        }

        this.ohlc.sort((a: any, b: any) => a[0] - b[0]);
        this.ohlc = [...this.historyDataValue1]; // Assign only valid data

        // console.log('Final OHLC:', this.ohlc); // Log after assignment
        try {
          // const parsedIndicators = this.indData ? JSON.parse(this.indData) : [];
          if (!this.ohlc || !this.ohlc.length) {
  console.warn("⚠️ No valid OHLC data to chart.");
  return;
}
          myFunction(this.ohlc, 0, val, {});
        } catch (e) {
          console.error('Failed to parse indicator data', e);
          myFunction(this.ohlc, 0, val, {});
        }

        this.SocketDataValue(val);
      },
      error: (err) => {
        console.error('Error fetching historical data', err);
      },
    });
  }
  showLiveData: any = [];
  shocketData: any = [];
  i = 0.0001;
  time = 60;
  newDataLiveData: any = [];
  SocketDataValue(val: any): void {
    this.showLiveData = [];
    this.chartDataSubscription = this.share.allMarketLiveData$.subscribe(
      (res: any[]) => {
        // console.log("ress",res);
        this.showLiveData = res.filter(
          (data) => data.oSymbolConfig?.Symbol === val
        );

        if (this.showLiveData.length > 0 && this.showLiveData[0]?.oInitial) {
          const initial = this.showLiveData[0].oInitial;

          // Safely parse all values
          const time = initial.TimeSec ? Number(initial.TimeSec) : null;
          const open = parseFloat(initial.Open);
          const high = parseFloat(initial.High);
          const low = parseFloat(initial.Low);
          const close = parseFloat(initial.Close);

          // Ensure all required values are valid numbers
          if (
            time !== null &&
            !isNaN(open) &&
            !isNaN(high) &&
            !isNaN(low) &&
            !isNaN(close)
          ) {
            // Convert TimeSec to milliseconds
            const timestamp = time.toString().length === 10 ? time * 1000 : time;

            const livePoint = [
              Number(timestamp),
              parseFloat(open.toFixed(5)),
              parseFloat(high.toFixed(5)),
              parseFloat(low.toFixed(5)),
              parseFloat(close.toFixed(5)),
            ];
            setupDataUpdateInterval(livePoint);
          } else {
            console.warn('Invalid live data point', {
              time,
              open,
              high,
              low,
              close,
            });
          }
        }
      }
    );
  }
  countDecimalDigits(num: number): number {
    if (num === undefined || num === null) return 0;
    const numStr: string = num.toString();
    const decimalIndex: number = numStr.indexOf('.');
    if (decimalIndex !== -1) {
      return numStr.substring(decimalIndex + 1).length;
    } else {
      return 0;
    }
  }
  // ngOnDestroy() {
  //   if (this.chartDataSubscription) {

  //     this.chartDataSubscription.unsubscribe();
  //     setupDataUpdateInterval([])

  //   }
  // }
  ngOnDestroy(): void {
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }
}
