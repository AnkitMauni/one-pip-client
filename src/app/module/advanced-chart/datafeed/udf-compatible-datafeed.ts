import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
import { LimitedResponseConfiguration } from './history-provider';
import { Subscription } from 'rxjs';
import { ShareService } from 'src/app/services/share.service';

export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
	private shareService: ShareService;
	private marketDataSubscription?: Subscription;

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

	// 🔄 Live data stream for the chart
private latestListenerGuid: string | null = null;

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
      console.log('📥 Tick received:', symbol, '| Expecting:', symbolInfo.ticker);

      if (!oInitial || !symbol || symbol !== symbolInfo.ticker) return;

      const bar = {
        time: oInitial.TimeSec, // already in ms
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
  if (this.marketDataSubscription) {
    this.marketDataSubscription.unsubscribe();
    this.marketDataSubscription = undefined;
  }
}}
