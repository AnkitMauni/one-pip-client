// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {  
  production: false,
  // domain:"https://apiapp.traderscabinet.com/Tradersroom_API_traderscabinetapp/",  //Live Api
  // quotesUrl: "wss://apiapp.traderscabinet.com:9888", 
  // tradeUrl: "wss://apiapp.traderscabinet.com:9889"
  // https://apiapp.traderscabinet.com/Tradersroom_API_traderscabinetapp/
  // https://apimt.traderscabinet.com/Tradersroom_API_traderscabinetmt/

  // domain:"https://apidev.onepip.app/MTOnePipDevAPI/",  //Live Api
  domain:"https://userapi.onepip.app/userapi/",  //Live Api
  // domain:"https://quoteapi.onepip.app/quoteapi/",  
  // quotesUrl: "wss://apidev.onepip.app:9777", 
  // tradeUrl: "wss://apidev.onepip.app:9779"
  quotesUrl: "wss://apidev.onepip.app:9781", 
  tradeUrl: "wss://apidev.onepip.app:9783"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
