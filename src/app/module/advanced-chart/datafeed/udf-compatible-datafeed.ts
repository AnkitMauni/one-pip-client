import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
import { GetBarsResult, LimitedResponseConfiguration, PeriodParamsWithOptionalCountback } from './history-provider';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';
import {
  HistoryCallback,
  ErrorCallback,
  LibrarySymbolInfo,
  ResolutionString,
} from './datafeed-api';

export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
  private shareService: ShareService;
  private marketDataSubscription?: Subscription;
  private latestListenerGuid: string | null = null;

  constructor(
    datafeedURL: string,
    updateFrequency: number = 10 * 1000,
    limitedServerResponse?: LimitedResponseConfiguration,
    shareService?: ShareService
  ) {
    const requester = new Requester();
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(datafeedURL, quotesProvider, requester, updateFrequency, limitedServerResponse);
    this.shareService = shareService!;
  }

  override subscribeBars(
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    listenerGuid: string
  ): void {
    console.log('🟢 Subscribing to live data for:', symbolInfo.ticker);
    this.latestListenerGuid = listenerGuid;

    this.marketDataSubscription = this.shareService.allMarketLiveData$.subscribe((tickArray) => {
      if (!Array.isArray(tickArray)) return;

      tickArray.forEach((tick) => {
        const { oInitial, oSymbolConfig } = tick;

        const symbol = oSymbolConfig?.Symbol;
        if (!oInitial || !symbol || symbol !== symbolInfo.ticker) return;

        const bar = {
          time: oInitial.TimeSec,
          open: oInitial.Open,
          high: oInitial.High,
          low: oInitial.Low,
          close: oInitial.Close,
          volume: oInitial.Vol || 0,
        };

        console.log('✅ Emitting bar for:', symbol, bar);
        onRealtimeCallback(bar);
      });
    });
  }

  override unsubscribeBars(listenerGuid: string): void {
    console.log('🔴 Unsubscribing from live data for listener:', listenerGuid);
    this.latestListenerGuid = null;
    this.marketDataSubscription?.unsubscribe();
    this.marketDataSubscription = undefined;
  }

  override getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParamsWithOptionalCountback,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ): void {
    const extendedFrom = (periodParams.from ?? 0) - 2 * 24 * 60 * 60;
    const to = periodParams.to;

    console.log(`📊 getBars() called for ${symbolInfo.name}`);
    console.log(`Original range: ${new Date((periodParams.from ?? 0) * 1000)} → ${new Date(to * 1000)}`);
    console.log(`Extended range: ${new Date(extendedFrom * 1000)} → ${new Date(to * 1000)}`);

    const extendedParams = {
      ...periodParams,
      from: extendedFrom,
      to: to,
    };

    this._historyProvider.getBars(symbolInfo, resolution, extendedParams)
      .then((result: GetBarsResult) => {
        console.log(`✅ getBars() returned ${result.bars.length} bars`);
        onResult(result.bars, result.meta);
      })
      .catch((error: any) => {
        console.error(`❌ getBars() error:`, error);
        onError(error?.message || 'Error loading historical data');
      });
  }
}
