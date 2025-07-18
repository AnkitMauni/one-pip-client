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
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  IChartApi,
  ISeriesApi,
  Time,
  UTCTimestamp,CrosshairMode ,PriceScaleMode, 
  LineSeries
} from 'lightweight-charts';

import { AdvancedChartComponent } from '../advanced-chart/advanced-chart.component';
// declare const myFunction: any;
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
export class DashboardComponent implements OnInit {
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
 chart: IChartApi | undefined;
  candlestickSeries: ISeriesApi<'Candlestick'> | undefined;
  areaSeries: ISeriesApi<'Area'> | undefined;
  advancedWidgetConfig: any = null;
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
// ngAfterViewInit(): void {
//   this.getSubscriveLiveData();

//   (window as any).onRangeSelectorClick = (period: number) => {
//     console.log("Hi chacha", period);
//     this.historyData(this.symbolDataVal, period);
//   };

//   const container = document.getElementById('tv-chart')!;
//   if (!container) {
//   console.warn("Chart container not found");
//   return;
// }
//  this.chart = createChart(container, {
//   width: container.clientWidth,
//   height: 400,
//   layout: {
//     background: { color: '#FFFFFF' }, // White background ✅
//     textColor: '#000000',             // Black text for axis labels ✅
//   },
//   grid: {
//     vertLines: { color: '#E0E0E0' },  // Light gray grid lines ✅
//     horzLines: { color: '#E0E0E0' },
//   },
//   timeScale: {
//     timeVisible: true,
//     secondsVisible: true,
//     borderVisible: true,
//   },
//   rightPriceScale: {
//   borderVisible: true,
//   visible: true,
//   scaleMargins: {
//     top: 0.2,
//     bottom: 0.2,
//   },
//   mode: PriceScaleMode.Normal, // ✅ Helps fix missing labels
//   textColor: '#000000',
// },
//   crosshair: {
//     mode: CrosshairMode.Normal,
//     vertLine: {
//       color: '#6A5ACD',
//       labelVisible: true,
//     },
//     horzLine: {
//       color: '#6A5ACD',
//       labelVisible: true,
//     },
//   },
//   localization: {
//     locale: 'en',
//   },
// });
// this.chart.priceScale('right').applyOptions({
//   textColor: '#000000',
//   visible: true,
// });

//   this.areaSeries = this.chart.addSeries(AreaSeries, {
//     topColor: 'rgba(38,198,218, 0.56)',
//     bottomColor: 'rgba(38,198,218, 0.04)',
//     lineColor: 'rgba(38,198,218, 1)',
//     lineWidth: 2,
//   });

//   this.areaSeries.setData([
//     { time: '2025-07-01', value: 25 },
//     { time: '2025-07-02', value: 30 },
//     { time: '2025-07-03', value: 28 },
//     { time: '2025-07-04', value: 35 },
//   ]);
//   // ✅ Line series for precise Y-axis tick formatting
//   const lineSeries = this.chart.addSeries(LineSeries,{
//     color: 'transparent',
//     lineWidth: 1,
//     lastValueVisible: false,
//     priceLineVisible: false,
//     // crossHairMarkerVisible: false,
//     priceFormat: {
//       type: 'price',
//       precision: 5,
//       minMove: 0.00001,
//     },
//   });

//   lineSeries.applyOptions({
//     priceScaleId: 'right',
//   });

//   lineSeries.setData([
//     { time: '2025-07-01', value: 0.52341 },
//     { time: '2025-07-02', value: 0.52342 },
//     { time: '2025-07-03', value: 0.52346 },
//     { time: '2025-07-04', value: 0.52349 },
//   ]);

//   this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
//   upColor: '#26a69a',
//   downColor: '#ef5350',
//   wickUpColor: '#26a69a',
//   wickDownColor: '#ef5350',
//   borderVisible: false,
//   priceFormat: {
//     type: 'price',
//     precision: 6,        // ✅ Number of decimals shown
//     minMove: 0.000001,   // ✅ Smallest price step
//   },
// });
//   this.candlestickSeries.setData([
//     { time: '2025-07-01', open: 20, high: 32, low: 18, close: 25 },
//     { time: '2025-07-02', open: 25, high: 35, low: 22, close: 30 },
//     { time: '2025-07-03', open: 30, high: 33, low: 27, close: 28 },
//     { time: '2025-07-04', open: 28, high: 36, low: 26, close: 35 },
//   ]);
  

//   // ✅ Create tooltip
//   const toolTip = document.createElement('div');
//   toolTip.className = 'custom-tooltip';
//  toolTip.style.cssText = `
//   position: absolute;
//   z-index: 1000;
//   background: rgba(255, 255, 255, 0.95);  // White background ✅
//   color: #000000;                         // Black text ✅
//   padding: 8px;
//   border-radius: 4px;
//   font-size: 12px;
//   pointer-events: none;
//   display: none;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.2);
// `;
//   container.appendChild(toolTip);

//   this.chart.subscribeCrosshairMove((param) => {
//     if (!param || !param.time || !param.seriesData.size || !param.point) {
//       toolTip.style.display = 'none';
//       return;
//     }

//     if (!this.candlestickSeries) return;

//     const raw = param.seriesData.get(this.candlestickSeries);
//     if (!raw || typeof raw !== 'object') return;

//     // ✅ Type guard for BarData (which has OHLC)
//     const isBarData = (data: any): data is {
//       open: number;
//       high: number;
//       low: number;
//       close: number;
//     } => {
//       return (
//         typeof data.open === 'number' &&
//         typeof data.high === 'number' &&
//         typeof data.low === 'number' &&
//         typeof data.close === 'number'
//       );
//     };

//     if (!isBarData(raw)) {
//       toolTip.style.display = 'none';
//       return;
//     }

//     const { open, high, low, close } = raw;

//     // ✅ Handle param.time (UTCTimestamp or BusinessDay)
//     let timeStr = '';
//     if (typeof param.time === 'number') {
//       timeStr = new Date(param.time * 1000).toLocaleString();
//     } else {
//       // BusinessDay format
//       const bd = param.time as any;
//       timeStr = `${bd.year}-${String(bd.month).padStart(2, '0')}-${String(bd.day).padStart(2, '0')}`;
//     }

//     toolTip.innerHTML = `
//       <strong>${timeStr}</strong><br>
//       Open: ${open.toFixed(6)}<br>
//       High: ${high.toFixed(6)}<br>
//       Low: ${low.toFixed(6)}<br>
//       Close: ${close.toFixed(6)}
//     `;

//     const x = param.point.x;
//     const y = param.point.y;

//     toolTip.style.left = `${x + 15}px`;
//     toolTip.style.top = `${y}px`;
//     toolTip.style.display = 'block';
//   });

//   this.chart.timeScale().fitContent();
//   this.chart.priceScale('right').applyOptions({ autoScale: true }); // ✅ Optional but useful
// }


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
tradingViewOHLC:any
//   historyData(val: string, _oPeriod:number=1): void {
//     console.log("data", val, "_operiod", _oPeriod);
//     // if (this.chartDataSubscription) {
//     //   this.chartDataSubscription.unsubscribe();
//     // }
//     this.ohlc = [];
//     const obj = { Symbol: val, oPeriod: _oPeriod };

//     this.http.post(`${this.DC_URL}GET_DM_HG_CHRT`, obj).subscribe({
//       next: (res: any) => {
     
//         this.historyDataValue1 = res.lstData.reverse()
//         .map(this.validateOHLC)
//         .filter((val:any): val is number[] => Array.isArray(val));


//         for (let i = 0; i < this.historyDataValue1.length; i++) {
//           this.ohlc.push([
//             this.historyDataValue1[i][0],
//             this.historyDataValue1[i][1],
//             this.historyDataValue1[i][2],
//             this.historyDataValue1[i][3],
//             this.historyDataValue1[i][4],
//           ]);
//         }

//         this.ohlc.sort((a: any, b: any) => a[0] - b[0]);
//         this.ohlc = [...this.historyDataValue1]; // Assign only valid data

//         // console.log('Final OHLC:', this.ohlc); // Log after assignment
//         try {
//           // const parsedIndicators = this.indData ? JSON.parse(this.indData) : [];
//           if (!this.ohlc || !this.ohlc.length) {
//   console.warn("⚠️ No valid OHLC data to chart.");
//   return;
// }
//           myFunction(this.ohlc, 0, val, {});
//         } catch (e) {
//           console.error('Failed to parse indicator data', e);
//           myFunction(this.ohlc, 0, val, {});
//         }

//         this.SocketDataValue(val);
//       },
//       error: (err) => {
//         console.error('Error fetching historical data', err);
//       },
//     });
//   }
historyData(val: string, _oPeriod: number = 1): void {
  console.log("data", val, "_operiod", _oPeriod);
  this.ohlc = [];

  const obj = { Symbol: val, oPeriod: _oPeriod };

  this.http.post(`${this.DC_URL}GET_DM_HG_CHRT`, obj).subscribe({
    next: (res: any) => {
      this.historyDataValue1 = res.lstData.reverse()
        .map(this.validateOHLC)
        .filter((val: any): val is number[] => Array.isArray(val));

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

      if (!this.ohlc || !this.ohlc.length) {
        console.warn("⚠️ No valid OHLC data to chart.");
        return;
      }
      this.tradingViewOHLC = this.ohlc.map((item: number[]) => ({
  time: item[0], // already in ms
  open: item[1],
  high: item[2],
  low: item[3],
  close: item[4],
  volume: Math.floor(Math.random() * 1000) + 100 // if volume isn't available
}));
// Advanced Chart config
this.advancedWidgetConfig = {
  symbol: val || 'NASDAQ:AAPL',
  allow_symbol_change: false,
  autosize: true,
  enable_publishing: false,
  height: 610,
  hideideas: true,
  hide_legend: false,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  interval: 'D',
  locale: 'en',
  save_image: false,
  show_popup_button: false,
  style: '1', // CANDLES
  theme: 'Light',
  timezone: 'Etc/UTC',
  toolbar_bg: '#F1F3F6',
  widgetType: 'widget',
  width: 980,
  withdateranges: false
};

      // ✅ Set chart data
      if (this.candlestickSeries) {
        const formattedData = this.ohlc.map((item: number[]) => ({
          time: Math.floor(item[0] / 1000) as UTCTimestamp,
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
        }));
        this.candlestickSeries.setData(formattedData);
        this.chart?.timeScale().fitContent();

        // Optional: Update area chart with closing values
        if (this.areaSeries) {
          const areaData = formattedData.map((item:any) => ({
            time: item.time,
            value: item.close,
          }));
          this.areaSeries.setData(areaData);
        }
      }

      this.SocketDataValue(val);
    },
    error: (err) => {
      console.error('Error fetching historical data', err);
    },
  });
}
SocketDataValue(val: any): void {
  this.showLiveData = [];

  this.chartDataSubscription = this.share.allMarketLiveData$.subscribe(
    (res: any[]) => {
      this.showLiveData = res.filter(
        (data) => data.oSymbolConfig?.Symbol === val
      );

      if (this.showLiveData.length > 0 && this.showLiveData[0]?.oInitial) {
        const initial = this.showLiveData[0].oInitial;

        const time = initial.TimeSec ? Number(initial.TimeSec) : null;
        const open = parseFloat(initial.Open);
        const high = parseFloat(initial.High);
        const low = parseFloat(initial.Low);
        const close = parseFloat(initial.Close);

        if (
          time !== null &&
          !isNaN(open) &&
          !isNaN(high) &&
          !isNaN(low) &&
          !isNaN(close)
        ) {
          const timestamp = time.toString().length === 10 ? time * 1000 : time;

          const newCandle = {
            time: Math.floor(timestamp / 1000) as UTCTimestamp,
            open,
            high,
            low,
            close,
          };

          if (this.candlestickSeries) {
            this.candlestickSeries.update(newCandle);
          }
          if (this.advancedWidgetConfig?.datafeed?.OHLC) {
  this.advancedWidgetConfig.datafeed.OHLC.push({
    time: newCandle.time,
    open: newCandle.open,
    high: newCandle.high,
    low: newCandle.low,
    close: newCandle.close
  });
}
          if (this.areaSeries) {
            this.areaSeries.update({
              time: newCandle.time,
              value: newCandle.close,
            });
          }
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

  showLiveData: any = [];
  shocketData: any = [];
  i = 0.0001;
  time = 60;
  newDataLiveData: any = [];
  // SocketDataValue(val: any): void {
  //   this.showLiveData = [];
  //   this.chartDataSubscription = this.share.allMarketLiveData$.subscribe(
  //     (res: any[]) => {
  //       // console.log("ress",res);
  //       this.showLiveData = res.filter(
  //         (data) => data.oSymbolConfig?.Symbol === val
  //       );

  //       if (this.showLiveData.length > 0 && this.showLiveData[0]?.oInitial) {
  //         const initial = this.showLiveData[0].oInitial;

  //         // Safely parse all values
  //         const time = initial.TimeSec ? Number(initial.TimeSec) : null;
  //         const open = parseFloat(initial.Open);
  //         const high = parseFloat(initial.High);
  //         const low = parseFloat(initial.Low);
  //         const close = parseFloat(initial.Close);

  //         // Ensure all required values are valid numbers
  //         if (
  //           time !== null &&
  //           !isNaN(open) &&
  //           !isNaN(high) &&
  //           !isNaN(low) &&
  //           !isNaN(close)
  //         ) {
  //           // Convert TimeSec to milliseconds
  //           const timestamp = time.toString().length === 10 ? time * 1000 : time;

  //           const livePoint = [
  //             Number(timestamp),
  //             parseFloat(open.toFixed(5)),
  //             parseFloat(high.toFixed(5)),
  //             parseFloat(low.toFixed(5)),
  //             parseFloat(close.toFixed(5)),
  //           ];
  //           setupDataUpdateInterval(livePoint);
  //         } else {
  //           console.warn('Invalid live data point', {
  //             time,
  //             open,
  //             high,
  //             low,
  //             close,
  //           });
  //         }
  //       }
  //     }
  //   );
  // }
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
