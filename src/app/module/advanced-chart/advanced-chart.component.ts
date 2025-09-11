import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import { OnDestroy } from '@angular/core';
import {
  widget,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from '../../../assets/charting_library';
import { UDFCompatibleDatafeed } from '../advanced-chart/datafeed/udf-compatible-datafeed';

import { ShareService } from 'src/app/services/share.service';
import { Subscription } from 'rxjs';
import { Timezone } from './datafeed/datafeed-api';
import { GlobalService } from 'src/app/services/global.service';
// import {
//     widget,
//     IChartingLibraryWidget,
//     ChartingLibraryWidgetOptions,
//     LanguageCode,
//     ResolutionString,
// } from '../../../assets/charting_library';
// import { TradingviewWidgetModule } from 'angular-tradingview-widget';
// interface IExtendedTradingViewWidget extends ITradingViewWidget {
//   datafeed?: {
//     OHLC?: any; // Replace with your actual OHLC data structure
//     datafeedReadyCallback?: () => void;
//     // Add any other datafeed properties as needed
//   };
// }
// declare const TradingView: any;
export interface LimitedResponseConfiguration {
  maxResponseLength: number;
  expectedOrder: 'earliestFirst' | 'latestFirst';
}
@Component({
  selector: 'app-advanced-chart',
  templateUrl: './advanced-chart.component.html',
  styleUrls: ['./advanced-chart.component.scss'],
  standalone: true,
  imports: [],
})
export class AdvancedChartComponent implements OnInit, OnDestroy {

  private _symbol: ChartingLibraryWidgetOptions['symbol'] = localStorage.getItem('changeSym') as string;
  private _interval: ChartingLibraryWidgetOptions['interval'] =
    'M' as ResolutionString;
  // BEWARE: no trailing slash is expected in feed URL
  // private _datafeedUrl = 'https://demo_feed.tradingview.com';

  private _datafeedUrl = 'https://www.marketwicks.com:4002';
  // private _datafeedUrl = "https://capitalark.in:4002"
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] =
    '/assets/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] =
    'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] =
    '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] =
    'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container'] =
    'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  private symbolSub!: Subscription;
  public myCurrentSymbol:any='';
  public data: any[] = [];
  constructor(private share: ShareService, private api: GlobalService) {
    this.share.changeSym$.subscribe((data: any) => {
      this.myCurrentSymbol = data;
      console.log('this.current', this.myCurrentSymbol);
    });
  }
  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol || this.myCurrentSymbol;

    // ✅ Correct usage: update symbol with interval
    if (this._tvWidget && this._tvWidget.chart()) {
      this._tvWidget.chart().setSymbol(this._symbol!);
      this._tvWidget.chart().setResolution(this._interval!);
    }
  }

  // @Input()
  // set interval(interval: ChartingLibraryWidgetOptions['interval']) {
  //     this._interval = interval || this._interval;
  // }
  @Input()
  set interval(interval: string) {
    this._interval = interval as ResolutionString;
  }

  @Input()
  set datafeedUrl(datafeedUrl: string) {
    this._datafeedUrl = datafeedUrl || this._datafeedUrl;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set chartsStorageUrl(
    chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  ) {
    this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
  }

  @Input()
  set chartsStorageApiVersion(
    chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  ) {
    this._chartsStorageApiVersion =
      chartsStorageApiVersion || this._chartsStorageApiVersion;
  }

  @Input()
  set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
    this._clientId = clientId || this._clientId;
  }

  @Input()
  set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
    this._userId = userId || this._userId;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }
  // get_Mk(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const obj = {
  //       Key: "",
  //       Account: Number(localStorage.getItem('loginId')),
  //       PkgID: Number(localStorage.getItem('PkgId'))
  //     };

  //     this.api.GET_USER_SUBSCRIBE_MK_v2(obj).subscribe({
  //       next: (res: any) => {
  //         this.data = res.lstSymbols;
  //         const initialSymbol = this.data[0]?.oSymbolConfig?.Symbol;
  //         if (initialSymbol) {
  //           this.share.changeSym.next(initialSymbol);
  //           localStorage.setItem('changeSym', initialSymbol);
  //           this.share.getSubscribedSymbol(this.data);
  //           resolve(initialSymbol);
  //         } else {
  //           reject("No symbol found from API");
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error(err);
  //         reject(err);
  //       }
  //     });
  //   });
  // }
  // ngOnInit() {
  //   this.get_Mk().then((initialSymbol: string) => {
  //   console.log("✅ Initial symbol from API:", initialSymbol);
  //   this._symbol = initialSymbol;  // set symbol
  //   localStorage.setItem('changeSym', initialSymbol);

  //   // now create the widget
  //   this.initTradingView();
  // });
  //   function getLanguageFromURL(): LanguageCode | null {
  //     const regex = new RegExp('[\\?&]lang=([^&#]*)');
  //     const results = regex.exec(location.search);

  //     return results === null
  //       ? null
  //       : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
  //   }
  //   const config: LimitedResponseConfiguration = {
  //     maxResponseLength: 1000,
  //     expectedOrder: 'latestFirst',
  //   };
  //   const widgetOptions: ChartingLibraryWidgetOptions = {
  //     symbol: this._symbol,
  //     datafeed: new UDFCompatibleDatafeed(
  //       this._datafeedUrl,
  //       1000,
  //       config,
  //       this.share
  //     ),
  //     interval: this._interval,
  //     container: this._containerId,
  //     library_path: this._libraryPath,
  //     locale: getLanguageFromURL() || 'en',
  //     // disabled_features: ['use_localstorage_for_settings'],
  //     disabled_features: [
  //       'use_localstorage_for_settings',
  //       'header_compare',
  //       'header_symbol_search',
  //     ],
  //     enabled_features: ['study_templates'],
  //     charts_storage_url: this._chartsStorageUrl,
  //     charts_storage_api_version: this._chartsStorageApiVersion,
  //     client_id: this._clientId,
  //     user_id: this._userId,
  //     fullscreen: this._fullscreen,
  //     autosize: this._autosize,
  //     timezone: 'Europe/Berlin', // Use configured timezone
  //   };

  //   const tvWidget = new widget(widgetOptions);
  //   this._tvWidget = tvWidget;

  //   tvWidget.onChartReady(() => {
  //     tvWidget.headerReady().then(() => {
  //       const button = tvWidget.createButton();
  //       button.setAttribute('title', 'Click to show a notification popup');
  //       button.classList.add('apply-common-tooltip');
  //       button.addEventListener('click', () =>
  //         tvWidget.showNoticeDialog({
  //           title: 'Notification',
  //           body: 'TradingView Charting Library API works correctly',
  //           callback: () => {
  //             console.log('Noticed!');
  //           },
  //         })
  //       );
  //       button.innerHTML = 'Check API';
  //     });
  //   });

  //   // 👇 Listen to symbol updates
  //   this.share.changeSym$.subscribe((newSymbol) => {
  //     console.log('📈 Symbol received:', newSymbol);
  //     this._symbol = newSymbol;
    
  //     if (this._tvWidget) {
  //       this._tvWidget.onChartReady(() => {
  //         this._tvWidget?.chart().setSymbol(newSymbol);
  //         this._tvWidget?.chart().setResolution(this._interval!);
  //       });
  //     } else {
  //       console.warn('⚠️ Widget not ready. Symbol will be applied after init.');
  //     }
  //   });
    
  // }    
  get_Mk(): Promise<string> {
    return new Promise((resolve, reject) => {
      const obj = {
        Key: '',
        Account: Number(localStorage.getItem('loginId')),
        PkgID: Number(localStorage.getItem('PkgId')),
      };

      this.api.GET_USER_SUBSCRIBE_MK_v2(obj).subscribe({
        next: (res: any) => {
          this.data = res.lstSymbols || [];
          const initialSymbol = this.data[0]?.oSymbolConfig?.Symbol;
          if (initialSymbol) {
            this.share.changeSym.next(initialSymbol);
            localStorage.setItem('changeSym', initialSymbol);
            this.share.getSubscribedSymbol(this.data);
            resolve(initialSymbol);
          } else {
            reject('No symbol found from API');
          }
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        },
      });
    });
  }

  ngOnInit() {
    this.get_Mk()
      .then((initialSymbol: string) => {
        console.log('✅ Initial symbol from API:', initialSymbol);
        this._symbol = initialSymbol;
        this.initTradingView();
      })
      .catch((err) => {
        console.error('⚠️ Failed to fetch initial symbol, falling back', err);
        this._symbol = this.myCurrentSymbol || 'EURUSD'; // fallback
        this.initTradingView();
      });

    // Listen to symbol updates after init
    this.symbolSub = this.share.changeSym$.subscribe((newSymbol) => {
      console.log('📈 Symbol received:', newSymbol);
      this._symbol = newSymbol;
      // if (this._tvWidget) {
      //   this._tvWidget.chart().setSymbol(newSymbol, this._interval!);
      // }
      if (this._tvWidget) {
              this._tvWidget.onChartReady(() => {
                this._tvWidget?.chart().setSymbol(newSymbol);
                this._tvWidget?.chart().setResolution(this._interval!);
              });
            }
    });
  }
  private initTradingView() {
    function getLanguageFromURL(): LanguageCode | null {
      const regex = new RegExp('[\\?&]lang=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
    }

    const config: LimitedResponseConfiguration = {
      maxResponseLength: 10000,
      expectedOrder: 'latestFirst',
    };

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol!,
      datafeed: new UDFCompatibleDatafeed(this._datafeedUrl, 1000, config, this.share),
      interval: this._interval,
      container: this._containerId,
      library_path: this._libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings', 'header_compare', 'header_symbol_search'],
      enabled_features: ['study_templates'],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      timezone: 'Europe/Athens',
    };

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      console.log('📊 TradingView ready with symbol:', this._symbol);
    });
  }
  ngOnDestroy() {
    if (this._tvWidget !== null) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }

    if (this.symbolSub) {
      this.symbolSub.unsubscribe();
    }
  }
}
