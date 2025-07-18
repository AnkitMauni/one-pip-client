function myfunction(val){

    new TradingView.widget({
        "autosize": true,
        "symbol": val,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "Dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": true,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": true,
        "news": [
          "headlines"
        ],
        "studies": [
          "Volume@tv-basicstudies"
        ],
        "no_referral_id": true,
        "container_id": "tv_chart_container"
      }
        );
}

