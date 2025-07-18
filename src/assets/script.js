// var chartData = [];
// var seriesDataVal = [];
// var chart;
// var ChangeData = [];
// var setChartData = [];
// var newDataLiveData = [];

// function myFunction(data, newLiveData, symbol, symbolInfo) {
//   console.log("OHLC Data Passed to Chart:", data);
//   data = data.sort((a, b) => a[0] - b[0]);
//   console.log("Sorted OHLC Data:", data);
//   // ? Check for future timestamps
//   const now = Date.now();
//   data.forEach((o) => {
//     if (o[0] > now + 10000) {
//       console.warn(
//         "?? Future timestamp detected in OHLC:",
//         o[0],
//         new Date(o[0])
//       );
//     }
//   });
//   // ? Calculate y-axis zoom range
//   const highPrices = data.map((d) => d[2]); // High
//   const lowPrices = data.map((d) => d[3]); // Low
//   const maxPrice = Math.max(...highPrices);
//   const minPrice = Math.min(...lowPrices);
//   const buffer = (maxPrice - minPrice) * 0.2 || 0.0002;
//   // ? Fix 1: Assign data inline + define yAxis reference
//   chartData = data;
//   const chartSericesData = [
//     {
//       type: "candlestick",
//       id: "aapl",
//       name: symbol,
//       color: "#FF7F7F",
//       upColor: "#90EE90",
//       data: chartData, // ? inline
//       yAxis: "main", // ? match yAxis id
//       lastPrice: {
//         enabled: true,
//         label: {
//           enabled: true,
//           backgroundColor: "#FF7F7F",
//           padding: 2,
//           shape: "rect",
//           borderRadius: 0,
//         },
//       },
//     },
//   ];

//   // ? Fix 2: Add yAxis array for candlestick, volume, oscillator
//   const options = {
//     chart: {
//       className: "sunny",
//       height: 620,
//       events: {
//         load() {
//           const chart = this;
//           const series = chart.series[0];
//           let i = 0;

//           setInterval(() => {
//             const currentData = series?.options?.data;
//             const newPoint = getNewPoint(i, currentData);
//             if (!newPoint || !Array.isArray(newPoint) || newPoint.length < 5) {
//               i++;
//               return;
//             }

//             const lastPoint = currentData[currentData.length - 1];
//             let updatedData;

//             if (lastPoint && lastPoint[0] !== newPoint[0]) {
//               updatedData = [...currentData, newPoint].sort(
//                 (a, b) => a[0] - b[0]
//               );
//             } else {
//               updatedData = [...currentData];
//               updatedData[currentData.length - 1] = newPoint;
//               updatedData.sort((a, b) => a[0] - b[0]);
//             }

//             if (updatedData.every((point) => point.length >= 5)) {
//               series.setData(updatedData);
//             }
//             i++;
//           }, 1000);
//         },
//       },
//     },

//     // ? Fix 3: Define all required yAxes
//     yAxis: [
//       {
//         id: "main",
//         title: { text: "Price" },
//         height: "70%",
//         resize: { enabled: true },
//         lineColor: "#999999",
//         lineWidth: 1,
//         gridLineColor: "#21323f",
//         min: minPrice - buffer,
//         max: maxPrice + buffer,
//         labels: {
//           align: "left",
//           style: { color: "#c5c7c9" },
//         },
//         crosshair: {
//           label: {
//             backgroundColor: "#fbfbfb",
//             borderRadius: 0,
//             enabled: true,
//             padding: 3,
//             style: { color: "#000" },
//           },
//         },
//       }
//     //   ,
//     //   {
//     //     id: "volume",
//     //     title: { text: "Volume" },
//     //     top: "70%",
//     //     height: "15%",
//     //     offset: 0,
//     //   },
//     //   {
//     //     id: "oscillator",
//     //     title: { text: "Oscillator" },
//     //     top: "85%",
//     //     height: "15%",
//     //     offset: 0,
//     //   },
//     ],

//     xAxis: {
//       gridLineColor: "#21323f",
//       gridLineWidth: 1,
//       lineColor: "#999999",
//       tickColor: "#999999",
//       tickLength: 5,
//       labels: {
//         style: { color: "#c5c7c9" },
//       },
//     },

//     credits: { enabled: false },
//     exporting: { enabled: false },
//     accessibility: { enabled: false },

//     rangeSelector: {
//       buttons: [
//         {
//           text: "M1",
//           dataGrouping: { forced: true, units: [["minute", [1]]] },
//         },
//         {
//           text: "M5",
//           dataGrouping: { forced: true, units: [["minute", [5]]] },
//         },
//         {
//           text: "M15",
//           dataGrouping: { forced: true, units: [["minute", [15]]] },
//         },
//         {
//           text: "M30",
//           dataGrouping: { forced: true, units: [["minute", [30]]] },
//         },
//         { text: "H1", dataGrouping: { forced: true, units: [["hour", [1]]] } },
//         { text: "H4", dataGrouping: { forced: true, units: [["hour", [4]]] } },
//         { text: "D1", dataGrouping: { forced: true, units: [["day", [1]]] } },
//         { text: "W1", dataGrouping: { forced: true, units: [["week", [1]]] } },
//         { text: "MN", dataGrouping: { forced: true, units: [["month", [1]]] } },
//         { type: "all", text: "All" },
//       ],
//       selected: 9,
//       inputEnabled: false,
//     },

//     navigator: {
//       series: { color: "#000000" },
//     },

//     scrollbar: {
//       enabled: false,
//       display: "none",
//     },

//     series: chartSericesData,

//     tooltip: {
//       valueDecimals: 2,
//       positioner: function () {
//         return { x: 10, y: 0 };
//       },
//       format: `${symbol} {point.open:.2f} {point.high:.2f} {point.low:.2f} {point.close:.2f}`,
//     },
//   };

//   // ? Destroy previous chart instance
//   if (chart) {
//     chart.destroy();
//   }

//   chart = Highcharts.stockChart("container", options);
//   console.log("Chart Container:", document.getElementById("container"));

//   // ? Update Oscillator Buttons
//   document.querySelectorAll(".myButton").forEach((button) => {
//     button.addEventListener("click", function (e) {
//       const series = chart.get("oscillator");
//       if (series) series.remove(false);
//       chart.addSeries({
//         type: e.target.value,
//         linkedTo: "aapl",
//         id: "oscillator",
//         yAxis: "oscillator", // ? updated
//       });
//     });
//   });

//   // ? Update Overlay Buttons
//   document.querySelectorAll(".myButtons").forEach((button) => {
//     button.addEventListener("click", function (e) {
//       const series = chart.get("overlay");
//       if (series) series.remove(false);
//       chart.addSeries({
//         type: e.target.value,
//         linkedTo: "aapl",
//         id: "overlay",
//         yAxis: "main", // ? optional, can be custom if you want separate
//       });
//     });
//   });
// }

// // ? getNewPoint logic
// function getNewPoint(i, data) {
//   if (data) {
//     const lastPoint = data[data.length - 1];
//     if (!lastPoint || lastPoint.length < 5) return null;

//     if (
//       Array.isArray(ChangeData) &&
//       ChangeData.length >= 5 &&
//       ChangeData.slice(1, 5).every((v) => typeof v === "number")
//     ) {
//       ChangeData[0] = lastPoint[0];
//       return ChangeData;
//     }

//     const variation = (Math.random() - 0.5) * 0.001;
//     return [
//       lastPoint[0] + 1000,
//       lastPoint[1] + variation,
//       lastPoint[2] + variation,
//       lastPoint[3] + variation,
//       lastPoint[4] + variation,
//     ];
//   }
// }

// // ? Real-time update function from Angular
// function setupDataUpdateInterval(val) {
//   if (
//     !Array.isArray(val) ||
//     val.length < 5 ||
//     !val.every((v) => typeof v === "number")
//   ) {
//     console.warn("Invalid live data array", val);
//     return;
//   }

//   newDataLiveData = val;
//   ChangeData = val;
//   setValue(val); // update buffer
// }

// function setValue(val) {
//   setChartData = val;
// }

// function getValue() {
//   if (!Array.isArray(setChartData) || setChartData.length < 5) {
//     console.warn("Invalid setChartData");
//     return null;
//   }
//   return setChartData;
// }

// // ? Optional: global config
// Highcharts.setOptions({
//   chart: {
//     height: 620,
//     className: "okok",
//   },
//   navigator: {
//     maskInside: false,
//     maskFill: "rgba(0, 0, 0, 0.3)",
//     height: 30,
//     margin: 10,
//     handles: { backgroundColor: "#000000" },
//     xAxis: {
//       labels: { enabled: false },
//       gridLineWidth: 0,
//     },
//   },
//   scrollbar: { height: 0 },
//   tooltip: {
//     shadow: false,
//     borderWidth: 0,
//     backgroundColor: "transparent",
//   },
//   xAxis: {
//     gridLineWidth: 1,
//     gridLineColor: "#c0c0c0",
//     gridLineDashStyle: "Dash",
//     tickLength: 5,
//     crosshair: {
//       label: {
//         backgroundColor: "#000000",
//         padding: 2,
//         shape: "rect",
//         borderRadius: 0,
//       },
//     },
//   },
//   yAxis: {
//     gridLineWidth: 1,
//     gridLineColor: "#c0c0c0",
//     gridLineDashStyle: "Dash",
//     tickInterval: 5,
//      min: minPrice - buffer,
//     max: maxPrice + buffer,
//     crosshair: {
//       label: {
//         backgroundColor: "#000000",
//         padding: 2,
//         shape: "rect",
//         borderRadius: 0,
//       },
//     },
//   },
// });
var chartData = [];
var chart;
var ChangeData = [];
var setChartData = [];
var newDataLiveData = [];
var pollingInterval;
 
// Declare global variables for minPrice and maxPrice
let minPrice = 0;
let maxPrice = 0;
 
function myFunction(data, newLiveData, symbol, symbolInfo) {
  data = data.sort((a, b) => a[0] - b[0]);
 
  const highPrices = data.map((d) => d[2]);
  const lowPrices = data.map((d) => d[3]);
  maxPrice = Math.max(...highPrices);
  minPrice = Math.min(...lowPrices);
 
  // ? Enforce a minimum visual range for flat OHLC data
  const minimumRange = 0.01; // You can adjust this to 0.05 or 0.1 depending on your instrument
  const range = Math.max(maxPrice - minPrice, minimumRange);
  const buffer = range * 0.2;
 
  const yMin = minPrice - buffer;
  const yMax = maxPrice + buffer;
 
  chartData = data;
 
  let previousClosePrice = data[data.length - 1]?.[4] ?? 0;
 
  const chartSericesData = [
    {
      type: "candlestick",
      id: "aapl",
      name: symbol,
      color: "#FF7F7F",
      upColor: "#90EE90",
      data: chartData,
      yAxis: "main",
      lastPrice: {
        enabled: true,
        label: {
          enabled: true,
          backgroundColor: "#FF7F7F",
          padding: 2,
          shape: "rect",
          borderRadius: 0,
        },
      },
    }
  ];
 
  const options = {
    chart: {
      className: "sunny",
      height: 620,
      animation: true,
      events: {
        load() {
          const chart = this;
          const series = chart.series[0];
          let i = 0;
 
          function updateLivePriceLine(newPrice) {
            const color = newPrice > previousClosePrice ? "green" :
                          newPrice < previousClosePrice ? "red" : "#FF7F7F";
 
            chart.yAxis[0].removePlotLine("live-price-line");
 
            chart.yAxis[0].addPlotLine({
              id: "live-price-line",
              value: newPrice,
              color: color,
              dashStyle: "Solid",
              width: 2,
              zIndex: 5,
              label: {
                text: `Live: ${newPrice.toFixed(5)}`,
                align: "right",
                x: -10,
                y: 15,
                style: {
                  color: color,
                  fontWeight: "bold",
                  background: "#fff",
                  padding: "2px 5px"
                }
              }
            });
 
            previousClosePrice = newPrice;
          }
 
          updateLivePriceLine(series.options.data?.[series.options.data.length - 1]?.[4] ?? 0);
 
          setInterval(() => {
            const currentData = series?.options?.data;
            const newPoint = getNewPoint(i, currentData);
            if (!newPoint || newPoint.length < 5) {
              i++;
              return;
            }
 
            const lastPoint = currentData[currentData.length - 1];
            let updatedData;
 
            if (lastPoint && lastPoint[0] !== newPoint[0]) {
              updatedData = [...currentData, newPoint].sort((a, b) => a[0] - b[0]);
            } else {
              updatedData = [...currentData];
              updatedData[currentData.length - 1] = newPoint;
              updatedData.sort((a, b) => a[0] - b[0]);
            }
 
            if (updatedData.every(point => point.length >= 5)) {
              series.setData(updatedData, true, false, false);
              updateLivePriceLine(newPoint[4]);
            }
 
            i++;
          }, 1000);
        }
      }
    },
 
    yAxis: [
      {
        id: "main",
        title: { text: "Price" },
        height: "100%",
        resize: { enabled: true },
        min: yMin,
        max: yMax,
        labels: { style: { color: "#c5c7c9" } },
        gridLineColor: "#21323f",
        opposite:false,
        gridLineWidth: 0,
        crosshair: {
          label: {
            backgroundColor: "#fbfbfb",
            enabled: true,
            style: { color: "#000" }
          }
        }
      }
    ],
 
    xAxis: {
      gridLineColor: "#21323f",
      gridLineWidth: 0,
      labels: { style: { color: "#c5c7c9" } },
      crosshair: true
    },
 
    credits: { enabled: false },
    exporting: { enabled: false },
    accessibility: { enabled: false },
 
    rangeSelector: {
      buttons: [
        {
          text: "M1",
          events: {
            click: function () {
              window.onRangeSelectorClick?.(1);
            },
          },
        },
        {
          text: "M15",
          events: {
            click: function () {
              window.onRangeSelectorClick?.(2);
            },
          },
        },
        {
          text: "M60",
          events: {
            click: function () {
              window.onRangeSelectorClick?.(3);
            },
          },
        },
        {
          text: "D1",
          events: {
            click: function () {
              window.onRangeSelectorClick?.(4);
            },
          },
        }
      ],
      selected: 0,
      inputEnabled: false
    },
 
    navigator: {
      series: { color: "#000000" }
    },
 
    scrollbar: {
      enabled: false
    },
 
    tooltip: {
      shared: true,
      valueDecimals: 5,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#333",
      style: {
        color: "#000",
        // fontWeight: "bold",
        // fontSize: "14px"
      },
      padding: 10,
      borderRadius: 8,
      shadow: true,
      pointFormat: `<b>{series.name}</b><br/>
                    O: <b>{point.open:.5f}</b><br/>
                    H: <b>{point.high:.5f}</b><br/>
                    L: <b>{point.low:.5f}</b><br/>
                    C: <b>{point.close:.5f}</b><br/>`
    },
    series: chartSericesData
  };
 
  if (chart) chart.destroy();
  chart = Highcharts.stockChart("container", options);
}
 
// Real-time data simulation
function getNewPoint(i, data) {
  if (!data) return null;
  const lastPoint = data[data.length - 1];
  if (!lastPoint || lastPoint.length < 5) return null;
 
  if (
    Array.isArray(ChangeData) &&
    ChangeData.length >= 5 &&
    ChangeData.slice(1, 5).every((v) => typeof v === "number")
  ) {
    ChangeData[0] = lastPoint[0];
    return ChangeData;
  }
 
  const variation = (Math.random() - 0.5) * 0.001;
  return [
    lastPoint[0] + 1000,
    lastPoint[1] + variation,
    lastPoint[2] + variation,
    lastPoint[3] + variation,
    lastPoint[4] + variation,
  ];
}
 
function setupDataUpdateInterval(val) {
  if (!Array.isArray(val) || val.length < 5 || !val.every((v) => typeof v === "number")) {
    console.warn("Invalid live data array", val);
    return;
  }
  newDataLiveData = val;
  ChangeData = val;
  setChartData = val;
}
 
function getValue() {
  if (!Array.isArray(setChartData) || setChartData.length < 5) {
    console.warn("Invalid setChartData");
    return null;
  }
  return setChartData;
}
 
// Global static style only
Highcharts.setOptions({
  chart: {
    height: 620,
    className: "okok",
  },
  navigator: {
    maskInside: false,
    maskFill: "rgba(0, 0, 0, 0.3)",
    height: 30,
    margin: 10,
    handles: { backgroundColor: "#000000" },
    xAxis: {
      labels: { enabled: false },
      gridLineWidth: 1,
    },
  },
  scrollbar: { height: 0 },
  tooltip: {
    shadow: false,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  xAxis: {
    gridLineWidth: 1,
    gridLineColor: "#c0c0c0",
    gridLineDashStyle: "Dash",
    tickLength: 5,
    crosshair: {
      label: {
        backgroundColor: "#000000",
        padding: 2,
        shape: "rect",
        borderRadius: 0,
      },
    },
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: "#c0c0c0",
    gridLineDashStyle: "Dash",
    tickInterval: 5,
    softMin: minPrice - buffer,
    softMax: maxPrice + buffer,
    crosshair: {
      label: {
        backgroundColor: "#000000",
        padding: 2,
        shape: "rect",
        borderRadius: 0,
      },
    },
  },
});
  // const yMin = minPrice - buffer;
  // const yMax = maxPrice + buffer;