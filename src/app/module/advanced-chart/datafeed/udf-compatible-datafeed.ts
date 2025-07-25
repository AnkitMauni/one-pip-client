import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
import {
  GetBarsResult,
  LimitedResponseConfiguration,
  PeriodParamsWithOptionalCountback,
} from './history-provider';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import {
  HistoryCallback,
  ErrorCallback,
  LibrarySymbolInfo,
  ResolutionString,
  ResolveCallback,
} from './datafeed-api';
 
export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
  private shareService: ShareService;
  private marketDataSubscription?: Subscription;
  private latestListenerGuid: string | null = null;
  private currentSymbol: string = 'AUDUSD.c_5200';
  constructor(
    datafeedURL: string,
    updateFrequency: number = 10 * 1000,
    limitedServerResponse?: LimitedResponseConfiguration,
    shareService?: ShareService
  ) {
    const requester = new Requester();
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(
      datafeedURL,
      quotesProvider,
      requester,
      updateFrequency,
      limitedServerResponse
    );
    this.shareService = shareService!;
    this.shareService.changeSym$?.subscribe((symbolName: string) => {
      console.log("UDFCompatibleDatafeed: Received symbol update:", symbolName);
      if (symbolName) {
          this.currentSymbol = symbolName;
      }
  });
  }
 
  override subscribeBars(
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    listenerGuid: string
  ): void {
    if (this.marketDataSubscription) {
      this.marketDataSubscription.unsubscribe();
      this.marketDataSubscription = undefined;
    }
    // console.log('🟢 Subscribing to live data for:', symbolInfo.ticker);
    this.latestListenerGuid = listenerGuid;
    console.log('🟢 Substhis.latestListenerGuid', this.latestListenerGuid);
 
    if (!this.shareService?.allMarketLiveData$) {
      console.warn('⚠️ No live data stream available');
      return;
    }
    // console.log("tick", tickArray, "Symbol" ,symbolInfo)
    this.marketDataSubscription =
      this.shareService.allMarketLiveData$.subscribe((tickArray) => {
        if (!Array.isArray(tickArray)) return;
        tickArray.forEach((tick) => {
          try {
            const { oInitial, oSymbolConfig } = tick;
            const symbol = oSymbolConfig?.Symbol;
            if (!oInitial || !symbol || symbol !== symbolInfo.ticker) return;
 
            // Validate and convert timestamp
            const rawTime = Number(oInitial.TimeSec);
            const timeSeconds =
              rawTime.toString().length === 13
                ? Math.floor(rawTime / 1000)
                : rawTime;
 
            // Validate timestamp range
            const timeDate = new Date(timeSeconds * 1000);
            if (
              timeDate.getFullYear() < 2020 ||
              timeDate.getFullYear() > 2030
            ) {
              console.warn(
                '⚠️ Invalid timestamp in live data:',
                rawTime,
                '→',
                timeDate
              );
              return;
            }
 
            const bar = {
              time: timeSeconds * 1000, // TradingView expects milliseconds for real-time data
              open: parseFloat(oInitial.Open) || 0,
              high: parseFloat(oInitial.High) || 0,
              low: parseFloat(oInitial.Low) || 0,
              close: parseFloat(oInitial.Close) || 0,
              volume: parseFloat(oInitial.Vol) || 0,
            };
 
            // Validate bar data
            if (
              bar.open <= 0 ||
              bar.high <= 0 ||
              bar.low <= 0 ||
              bar.close <= 0
            ) {
              console.warn('⚠️ Invalid bar data:', bar);
              return;
            }
 
            console.log('✅ Emitting bar for:', symbol, bar);
            onRealtimeCallback(bar);
          } catch (error) {
            console.error('❌ Error processing live data tick:', error, tick);
          }
        });
      });
  }
 
  override unsubscribeBars(listenerGuid: string): void {
    // console.log('🔴 Unsubscribing from live data for listener:', listenerGuid);
    // this.latestListenerGuid = null;
    // this.marketDataSubscription?.unsubscribe();
    // this.marketDataSubscription = undefined;
  }
 
  override getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParamsWithOptionalCountback,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ): void {
    const symbol = symbolInfo.ticker;
    const to = periodParams.to;
    const fiveDaysAgo = to - 3 * 24 * 60 * 60;
    const from = periodParams.from;
    const serverResolution = this.convertResolution(resolution);
    const countback = 150;
    const url = `https://quoteapi.onepip.app/quoteapi/history?symbol=${symbol}&resolution=${serverResolution}&from=${fiveDaysAgo}&to=${to}&countback=${countback}`;
 
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.s === 'no_data') {
          onResult([], { noData: true, nextTime: data.nextTime });
          return;
        }
 
        const bars = data.t.map((time: number, i: number) => ({
          time: time * 1000,
          open: parseFloat(data.o[i]),
          high: parseFloat(data.h[i]),
          low: parseFloat(data.l[i]),
          close: parseFloat(data.c[i]),
          volume: data.v ? parseFloat(data.v[i]) : 0,
        }));
 
        bars.sort((a: any, b: any) => a.time - b.time);
        onResult(bars, { noData: bars.length === 0 });
      })
      .catch(err => {
        console.error('getBars error:', err);
        onError(err.message || 'Failed to fetch data');
      });
  }
 
 
 
  private convertResolution(resolution: ResolutionString): string {
    const resolutionMap: { [key: string]: string } = {
      '1': '1',
      '5': '5',
      '15': '15',
      '30': '30',
      '60': '60',
      '240': '240',
      '1D': '1D',
      '1W': '1W',
      '1M': '1M',
    };
 
    return resolutionMap[resolution] || '1';
  }
  protected override _requestConfiguration(): Promise<import("./udf-compatible-datafeed-base").UdfCompatibleConfiguration | null> {
    // Define your static configuration object
    const staticConfig: import("./udf-compatible-datafeed-base").UdfCompatibleConfiguration = {
        supported_resolutions: ['1' as ResolutionString, '5' as ResolutionString, '15' as ResolutionString],
        supports_group_request: false,
        supports_search: true,
        supports_marks: true,
        supports_timescale_marks: true,
        supports_time: true,
        exchanges: [
            { value: "", name: "All Exchanges", desc: "" },
            { value: "NYSE", name: "NYSE", desc: "NYSE" }
            // Add other exchanges from your original response if needed
        ],
        symbols_types: [
            { name: "All types", value: "" },
            { name: "Stock", value: "stock" }
             // Add other symbol types from your original response if needed
        ]
        // Add other properties if your application logic requires them
    };
 
    console.log("UDFCompatibleDatafeed: Using static configuration, skipping /config call");
    // Return a resolved promise with the static configuration
    return Promise.resolve(staticConfig);
  }
  override resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: import("./datafeed-api").SymbolResolveExtension | undefined
  ): void {
    const symbolToResolve = this.currentSymbol; // Or use symbolName if that's the intent
    const resolvedSymbolInfo: LibrarySymbolInfo = {
      name: symbolToResolve,
      description: symbolToResolve,
      type: 'stock', // Or 'forex', 'crypto', etc.
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1,
      minmove2: 10, // Often minmov * 10, but check your data
      fractional: false,
      // pointvalue: 1,
      has_intraday: true,
      supported_resolutions: ['1' as ResolutionString, '5' as ResolutionString, '15' as ResolutionString], // Match your config/static data
      visible_plots_set: 'ohlcv',
      pricescale: 10000, // Dynamically set based on symbol
      ticker: symbolToResolve,
      full_name: '',
      exchange: '',
      listed_exchange: '',
      format: 'price'
    };
    onResolve(resolvedSymbolInfo);
  }
}
 
 