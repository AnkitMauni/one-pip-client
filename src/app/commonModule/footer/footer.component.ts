import { Component,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as cc from 'currency-codes';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentTab: any = "tab1";
  v = 'VND';
  id:any
  calendars: any = [];
  highlightedDates: any[] = [];
  startDate: any;
  endDate: any;
  popUP:boolean=false;
  newStartDate: any;
  newEndDate: any;
  connectionStatus: any;
  orderFrom!:FormGroup
  loginForm!:FormGroup
  
  orderListData:any={}
  positionListData:any={}
  loc:any ={}
  accList:any
  nvatabc(tab: any){
    this.currentTab = tab
    if(tab == "tab1"){
      this.GET_OPENED1()
      // this.startInterval()
    }
    else if(tab == "tab2"){
      this.stopInterval()
      this.getAllExposure()
    }
    else if(tab == "tab3"){
      this.GET_USER_HISTORY()
    }
  }
  constructor(private datePipe: DatePipe,private http: HttpClient,private fb: FormBuilder,private share: ShareService, private api: GlobalService ,private modalService: NgbModal, config: NgbModalConfig,
    private datepipe: DatePipe, private route:Router){
    
      const newDate = new Date()
    this.startDate = this.datepipe.transform(
      newDate,
      'yyyy-MM-dd',
      'GMT'
    );
    // console.log("this.startDate",this.startDate);
    this.GET_OPENED1()

    this.share.changeSym$.subscribe((res:any)=>{
      console.log("ress",res);
      if(!res){
        const sym = localStorage.getItem('changeSym')
        this.changeSymbolData(sym)
      }
      else{
        this.changeSymbolData(res)
      }
    
    })
    // this.share.activeValue$.subscribe((res:any)=>{
    //   if(res == 1){
    //       this.listOpen =[]
    //       this.GET_OPENED1()
    
      
    //   }
    //   else{

    //   }
    // })


    // new socket
    this.share.slUpdate$.subscribe(( res:any)=>{
      if(res == 0){
        this.positionListData = JSON.parse(localStorage.getItem('positionListData') || '{}')
      }
    })
    this.share.dataArray$.subscribe(( res:any)=>{
      // console.log("all order ",res);
      
     
      if(res>0){
        this.positionListData = res
        console.log("resss",res);
        
      }
      else{
        this.positionListData = JSON.parse(localStorage.getItem('positionListData') || '{}')
      }
      
    })

    this.share.footerClosOrder$.subscribe(( res:any)=>{
     
      console.log("footerClosOrder$",res);
      
    })
    this.share.dataArray$.subscribe(( res:any)=>{
      // console.log("all order ",res);
      
     
      if(res>0){
        this.positionListData = res
        console.log("resss",res);
        
      }
      else{
        this.positionListData = JSON.parse(localStorage.getItem('positionListData') || '{}')
      }
      
    })
     //position
    this.share.dataArray1$.subscribe(( res:any)=>{
      // console.log("all order ",res);
      
     
      if(res>0){
        this.orderListData = res
      }
      else{
        this.orderListData = JSON.parse(localStorage.getItem('orderListData') || '{}')
        console.log("this.orderListData",this.orderListData);
        
      }
      
    })
    
  }



  ngOnInit(){
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
    this.loginForm = this.fb.group({
      ac:[''],
      pass:['']
    })
    this.orderFrom = this.fb.group({
      // volume: [''],  
      price:[''] ,   // Control for the Volume input
      stopLoss: [''],    // Control for the Stop Loss input
      takeProfit: [''],  // Control for the Take Profit input
      comment: ['']      // Control for the Comment input
    });


    // this.getCalendarByToday();
    this.getCalendarByDay('next-week')

    this.share.msgForClientToModify$.subscribe((data:any) => {
      const positionListData = JSON.parse(localStorage.getItem('positionListData') || '[]');
    
      // Find the index of the item with the matching Ticket ID
      const index = positionListData.findIndex((item: any) => item.Ticket === data.Ticket);
    
      // If a matching item is found, update its SL value
      if (index !== -1) {
        if(!data){
          console.log('Received Data:', null);
          this.orderResData ={}
        }
        else{
          console.log('Received Data:', data);
       
          if(this.data.MsgID== 300){
          
          this.orderResData = data
          this.showMassage = 2
          this.showErroMass =1
         
          }
          else  if( data.MsgID== 124){
          
            this.orderResData = data
            this.showMassage = 2
            this.showErroMass =1
           
            }
          else if(data.MsgID == 301 && data.ERR_MSG == "POSITION_NOT_EXISTS"){
          this.deleteIFPossitionNotExists(this.orderResData.ticketId)

          }
          else {
            this.orderResData = data
          
            this.showMassage = 2  
            this.showErroMass =2
        
           
          }
          
        }
      } else {
        console.log('Ticket ID not found in positionListData.');
      }
   
    
    });
}

trimTime(val: any): string {
  if (!val) return ''; // or return 'N/A', or just val

  return val.replace(/\.000$/, '');
}


data1: any =[]
data2: any =[]
getCurrent(val:any,type:any){
  this.data1=   this.data.filter((item: any) => item?.oSymbolConfig?.Symbol === val);
  // console.log(this.data1[0]);
  if(this.data1[0] != undefined){
  if(type == 0){
    
    return  this.data1[0]?.oInitial?.Bid
  }
  else if(type == 1){
    return  this.data1[0].oInitial?.Ask
  }
}
else{

    return 0.000
  }
 
} 
symbolMetaMap: { [symbol: string]: any } = {};

getInitial(symbol: string) {
  const obj = {
    Key: "",
    Symbol: symbol,
  };

  this.api.GET_SYMBOL_INITIAL(obj).subscribe({
    next: (res: any) => {
      this.symbolMetaMap[symbol] = res;
      setInterval(() => {
  this.calculateLiveMetrics();
}, 500); // Call calculation after metadata is available
    },
    error: (err) => console.error(err),
  });
}

listOpenObj:any ={}
listOpen:any =[]
listPending:any=[]
GET_OPENED1(){
  this.listOpen =[]
  let obj ={
   
    Account: Number(localStorage.getItem('loginId')),
  }

  this.api.GET_USER_OPEN_POS(obj).subscribe({next: (res:any)=>{
    // this.startInterval()
    this.listOpen = res.lstPos
    if(this.listOpen){
      this.listOpen.forEach((pos:any) => {
  if (!this.symbolMetaMap[pos.Sy]) {
    this.getInitial(pos.Sy);
  }
});
    }
    this.listPending = res.lstPending
      this.allGetTrade1 = res?.oAccount
      this.allGetTrade = this.allGetTrade1
      this.share.livBalance(this.allGetTrade.Balance)
    console.log("lstPos",res);
    // this.GET_USER_TRADE_WD()
  },
  error: (err:any)=>{
    console.log(err);
    
  }})
}
equity = 0;
usedMargin = 0;
freeMargin = 0;
marginLevel = 0;

calculateLiveMetrics() {
  let floatingPL = 0;
  let usedMargin = 0;

  this.listOpen.forEach((pos:any) => {
    const symbol = pos.Sy;
    const volumeLots = pos.V / 100; // Since V = 100 means 0.01 lot
    const symbolMeta = this.symbolMetaMap[symbol];

    if (!symbolMeta) return; // Wait for metadata

    const calcType = symbolMeta.Calculation;
    const contractSize = symbolMeta.ContractSize;
    const leverage = symbolMeta.INITIAL_MK_B || 1;
    const marketPrice = this.getCurrent(symbol, pos.BS); // Live price

    // Margin Calculation
    let margin = 0;
    if (calcType === 'FOREX') {
      margin = (volumeLots * contractSize) / leverage;
    } else if (calcType === 'CFD') {
      margin = volumeLots * contractSize * marketPrice;
    } else if (calcType === 'CFDLEVERAGE') {
      margin = (volumeLots * contractSize * marketPrice) / leverage;
    }

    usedMargin += margin;

    // Floating P/L
    floatingPL += Number(this.getProfitUSD(pos));
  });

  const balance = Number(this.allGetTrade?.Balance || 0);
  this.equity = balance + floatingPL;
  this.usedMargin = usedMargin;
  this.freeMargin = this.equity - usedMargin;
  this.marginLevel = usedMargin > 0 ? (this.equity / usedMargin) * 100 : 0;
}
intervalId: any;
  counter = 0;

  // Start the interval
  startInterval() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.counter++;
        this.GET_USER_TRADE_WD()
        
      }, 1000); // Interval set to 1000ms (1 second)
    }
  }

  // Stop the interval
  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Ensure the interval is cleared on component destruction
  ngOnDestroy() {
    this.stopInterval();
  }
allGetTrade: any ={}
allGetTrade1: any ={}
getAlllstPOS: any =[]
GET_USER_TRADE_WD(){
  let obj={
    acc:Number(localStorage.getItem('loginId')),
  
   }
    this.api.GET_USER_TRADE_WD(obj).subscribe({
    next: (res: any) => {
      this.allGetTrade1 = res?.Account
      this.allGetTrade = this.allGetTrade1
      this.share.livBalance(this.allGetTrade.Balance)
      // console.log("this.allGetTrade.Account",this.allGetTrade);
      
     
    },
    error: (err: any) => {
      console.log(err);
     
    },
  });
}



modref:any
openXl(content: any) {
  this.modref= this.modalService.open(content, { size: 'md modalone', centered: true });
}

closeModel(){
  this.modref.close()
}

login(){
  let val = this.loginForm.value
 let obj ={
  "Key":"",
  "AC": val.ac,
  "PWD":val.pass
 }
 this.api.VERIFY_MANAGER(obj).subscribe({ next: (res:any)=>{
console.log("ress",res);
if(res.Result > -1){
  this.toggleConnection('eff')
  localStorage.setItem('loginId', val.ac);
  localStorage.setItem('managerId', res.Result);
  setTimeout(() => {
    window.location.reload()
  this.closeModel()
  },1000);

}
else if(res.Result == -1){
  localStorage.setItem('status', 'Disconnect');
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
 
    window.location.reload()

}

 },
 error: (err:any)=>{
console.log(err);

 }
})
}

navGateUrl()
{
  this.route.navigateByUrl('dashboard')
}
collapsed = true;
toggleConnection(ajsd:any) {
  if (this.connectionStatus === 'Connect') {
    this.connectionStatus = 'Disconnect';
    localStorage.setItem('status', 'Connect');
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
  
   
  } else {
   
    this.connectionStatus = 'Connect';
    localStorage.setItem('status', 'Disconnect');
    this.route.navigate(['/dashboard']).then(() => {
      this.route.navigate([{ outlets: { primary: null } }]); // Clear router state
      window.location.reload()
    });
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
    window.location.reload()

  }
}


logout(){
  this.navGateUrl()
}
   // number only
   numericMessage:any
   numberOnly1(event: any): boolean {
     const charCode = (event.which) ? event.which : event.keyCode;
     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
       this.numericMessage = true;
       return false;
     }
     this.numericMessage = false;
     return true;
   }

getCurrency(country:any){
  let a = cc.country(country)
if(a.length == 0){
return this.v.toLocaleLowerCase()
}else{
return a[0].code.toLowerCase()
}
    
}


commAphaNum(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  this.id =result
  return result;
}

rangeValue:any={}
getCalendarByToday() {

this.http.get('https://www.fxempire.com/api/v1/en/economic-calendar?dateRange=current-week&page=1&timezone=Asia%2FCalcutta').subscribe((signal: any) => {

  //  this.calendars = [].concat(...signal.data);
  //  this.spinner.hide();
   console.log(signal.calendar[0].events);
    this.calendars = signal.calendar[0].events;
//  console.log(this.calendars);
    this.rangeValue = signal.range
}, err => {
 
});

}



// refresh(){

//   this.api.MAKE_ADM_REFRESH().subscribe({ next: (res:any)=>{
//     this.route.navigate(['/dashboard']).then(() => {
//       this.route.navigate([{ outlets: { primary: null } }]); // Clear router state
//       location.reload()
//     });
//   },
// error: (err:any)=>{
//   console.log(err);
  
// }})
// }


getCalendarByDay(e:any) {


this.http.get('https://www.fxempire.com/api/v1/en/economic-calendar?dateRange='+e+'&page=1&timezone=Asia%2FCalcutta').subscribe((signal: any) => {

  //  this.calendars = [].concat(...signal.data);
  //  this.spinner.hide();
  //  console.log(this.calendars);
  this.calendars = signal.calendar[0].events;

}, err => {
  
});

}



isStartDateSelected = false;

onDateSelected(date: any) {


if (!this.isStartDateSelected) {
  this.startDate = date;

  this.isStartDateSelected = true;
} else {
  this.endDate = date;
 
  this.highlightDatesInRange(this.startDate, this.endDate);
  // Reset start and end dates for next selection
  this.startDate = null;
  this.endDate = null;
  this.isStartDateSelected = false;
}

}

// Function to highlight dates between start and end dates
highlightDatesInRange(startDate: any, endDate: any) {
// Calculate the range of dates between start date and end date
console.log("startDate33",startDate,"endDate33",endDate);

const first = this.datepipe.transform(
  startDate.detail.value,
  'yyyy-MM-dd',
  'GMT'
);

const seond = this.datepipe.transform(
  endDate.detail.value,
  'yyyy-MM-dd',
  'GMT'
);

this.http.get(`https://www.fxempire.com/api/v1/en/economic-calendar?page=1&timezone=Asia%2FCalcutta&dateFrom=${first}&dateTo=${seond}`).subscribe((signal: any) => {

  //  this.calendars = [].concat(...signal.data);
  //  this.spinner.hide();
  //  console.log(this.calendars);
  this.calendars = signal.calendar[0].events;

}, err => {

});

console.log("first seond",first,seond);
this.newStartDate = first
this.newEndDate = seond


this.popUP = false
const dateRange = this.getDatesInRange(startDate, endDate);

// Create objects for each date in the range with custom styles
this.highlightedDates = dateRange.map(date => {
  return {
    date: date.toISOString().slice(0, 10), // Format date to 'YYYY-MM-DD'
    textColor: '#fff', // Example text color
    backgroundColor: '#007bff', // Example background color
  };
});
}

// Function to get the range of dates between two dates
private getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  const lastDate = new Date(endDate);
  lastDate.setHours(0, 0, 0, 0);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  

  return dates;
}

getAllSumm: any =[]
getAllJurn: any =[]
getAllExpos: any =[]
getAllSummry(){
 
  let obj ={
    "Key":"",
    "Account":Number(localStorage.getItem('loginId')),   // ManagerID
    "ManagerIndex":Number(localStorage.getItem('managerId'))
}
  this.api.GET_MGR_SUMMARY(obj).subscribe({next: (res:any)=>{
   console.log("summery",res);
   this.getAllSumm = res
    
  },
  error: (err:any)=>{
    console.log(err);
    
  }})
}

getAllJournal(){
 
  let obj ={
    "Key":"",
    "Account":Number(localStorage.getItem('loginId')),   // ManagerID
    "ManagerIndex":Number(localStorage.getItem('managerId'))
}
  this.api.GET_MGR_JOURNEL(obj).subscribe({next: (res:any)=>{
   console.log("journal",res);
   this.getAllJurn = res
    
  },
  error: (err:any)=>{
    console.log(err);
    
  }})
}

getAllExposure(){
 
  let obj ={
    "Key":"",
    "Account":Number(localStorage.getItem('loginId')),   // ManagerID
    "ManagerIndex":Number(localStorage.getItem('managerId'))
}
  this.api.GET_MGR_EXPOSURE(obj).subscribe({next: (res:any)=>{
   console.log("exposure",res);
   this.getAllExpos = res
    
  },
  error: (err:any)=>{
    console.log(err);
    
  }})
}

data:any=[]
changeAskBid:any =[]
currentPri:any 
changeSymbolData(val:any){

  
  this.share.allMarketLiveData$.subscribe((res: any) => {
    this.data = res
    // console.log("marketliveSocket", res)
  })

   
  // localStorage.setItem('Ask',this.data.oInitial.Ask)
  //   localStorage.setItem('Bid',this.data.oInitial.Bid)

}



  item: any;
  tradeUser: any;
  allPos:any=[]

  showLiveData:any=[]

  profit(price:any, closingP:any, lot:any){
  
    const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
    const profitLoss = (Number(price)-Number(closingP)) * lot * pipValue;
    const roundedProfitLoss = Math.round(profitLoss * 100) / 100;

    return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
    //funtion done by krishna sir
  }
 

   retrunProfite:any
  getValue(price:any, closingP:any, lot:any,position:any){
    // console.log("position",position)
    let symbol = position.Sy
   if(symbol ===  'EURCHF'||
  symbol === 'EURGBP'||
  symbol === 'EURHUF'||
  symbol === 'EURJPY'||
  symbol === 'EURNOK'||
  symbol === "EURNZD"||
  symbol === 'EURPLN'||
  symbol ===  "EURSEK"||
  symbol === "EURTRY"){
    this.retrunProfite = this.getProfitEurusd(price, closingP, lot,position)
    return this.retrunProfite
  }
  else if(symbol ===  'GBPAUD'|| 
 symbol ===  'GBPCAD'||
 symbol === 'GBPJPY'||
 symbol === 'GBPNZD'||
 symbol === 'GBPPLN'||
 symbol === 'GBPTRY'){
    this.retrunProfite = this.getProfitGPBUSD(price, closingP, lot,position)
    return this.retrunProfite
  }
  else if(symbol ===  'USDCAD'|| 
  symbol === 'USDMXN'||
 symbol === 'USDTRY'||
 symbol === 'USDNOK'||
 symbol === 'USDPLN'||
 symbol === 'USDSEK'||
 symbol === 'USDZAR'||
 symbol === 'USDCHF'||
 symbol === 'BTCUSD'||
 symbol === 'USDCNH'){
    this.retrunProfite = this.getUsdcad(price, closingP, lot,position)
    // console.log("BTCUSD",this.retrunProfite)
    return this.retrunProfite
  }
   else{
    this.retrunProfite = this.profit(price, closingP, lot)
    return this.retrunProfite
   }

   
  }


  showAskBid:any
  showProfitePrice:any
  getProfitEurusd(price:any, closingP:any, lot:any,position:any){
    if(position.BS === 0){
  
      this.showAskBid =   localStorage.getItem('eurusdBid')
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(closingP)-Number(price))
     const proftLoass1 = 1/this.showAskBid
  
     const profitEUR = profitLoss*(1/price)
     const profitUSD = profitEUR*(1/proftLoass1)
     const actualProfite = profitUSD*lot
     const round = actualProfite*100000
     const roundedProfitLoss =  Math.round(round * 100) / 100;
     this.showProfitePrice = Math.round(round * 100) / 100;
       return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
     }
     else{
   
      this.showAskBid =  localStorage.getItem('eurusdAsk')
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(price)-Number(closingP))
     const proftLoass1 = 1/this.showAskBid
 
    const profitEUR = profitLoss*(1/price)
    const profitUSD = profitEUR*(1/proftLoass1)
    const actualProfite = profitUSD*lot
    const round = actualProfite*100000
    const roundedProfitLoss =  Math.round(round * 100) / 100;
    this.showProfitePrice = Math.round(round * 100) / 100;
    return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
     }
    //  let biggerValue: number;
    //  let smallerValue: number;
 
    //  if (price > closingP) {
    //    biggerValue = price;
    //    smallerValue = closingP;
    //  } else {
    //    biggerValue = closingP;
    //    smallerValue = price;
    //  }
   
    // console.log(" this.showProfitePrice",  this.showProfitePrice);
   
  }

  getProfitGPBUSD(price:any, closingP:any, lot:any,position:any){

    if(position.BS === 0){
  
      this.showAskBid =  localStorage.getItem('gbpusdBid')
       
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(closingP)-Number(price))
     const proftLoass1 = 1/this.showAskBid
   
     const profitEUR = profitLoss*(1/price)
     const profitUSD = profitEUR*(1/proftLoass1)
     const actualProfite = profitUSD*lot
     const round = actualProfite*100000
     const roundedProfitLoss =  Math.round(round * 100) / 100;
     this.showProfitePrice = Math.round(round * 100) / 100;
     return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
     }
     else{
      this.showAskBid =   localStorage.getItem('gbpusdAsk')
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(price)-Number(closingP))
     const proftLoass1 = 1/this.showAskBid
    
    const profitEUR = profitLoss*(1/price)
    const profitUSD = profitEUR*(1/proftLoass1)
    const actualProfite = profitUSD*lot
    const round = actualProfite*100000
    const roundedProfitLoss =  Math.round(round * 100) / 100;
    this.showProfitePrice = Math.round(round * 100) / 100;
    return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
     }
     
    
     
  
  }


  getUsdcad(price:any, closingP:any, lot:any,position:any){
    if(position.BS === 0){
  
      this.showAskBid =  localStorage.getItem('gbpusdBid')
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(closingP)-Number(price))
      const profitUSD = profitLoss/price 
      const profitMXN = profitUSD*100000
      const roundedProfitLoss = Math.round(profitMXN * 100) / 100;
  
      return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
    
     }
     else{
      this.showAskBid =   localStorage.getItem('gbpusdAsk')
      const pipValue = (Math.pow(10, this.countDecimalDigits(Number(price))))
      const profitLoss = (Number(price)-Number(closingP))
      const profitUSD = profitLoss/price 
      const profitMXN = profitUSD*100000
      const roundedProfitLoss = Math.round(profitMXN * 100) / 100;
  
      return roundedProfitLoss.toFixed(this.countDecimalDigits(0.01));
   
    
     }
  }
// getProfitUSD(position: any): string {
//   const rawSymbol = position.Sy || '';
//   const cleanSymbol = rawSymbol.split('.')[0];
//   const quoteCurrency = cleanSymbol.slice(-3);
//   const openPrice = Number(position.PC);
//   const lot = Number(position.V) / 10000;
//   const direction = position.BS;

//   const market = this.getMarketRates(cleanSymbol);
//   if (!market || !market.oInitial) {
//     // console.warn('❌ Market not found for', cleanSymbol);
//     return '0.00';
//   }

//   const ask = Number(market.oInitial.Ask);
//   const bid = Number(market.oInitial.Bid);
//   const contractSize = Number(market.oSymbolConfig?.Contract || 100000);

//   let exitPrice = direction === 0 ? bid : ask;
//   let rawProfit = (exitPrice - openPrice) * lot * contractSize;
//   if (direction === 1) rawProfit = (openPrice - exitPrice) * lot * contractSize;

//   // console.log("Clean Symbol:", cleanSymbol);
//   // console.log("Direction:", direction === 0 ? "Buy" : "Sell");
//   // console.log("Open:", openPrice, "Exit:", exitPrice);
//   // console.log("Lot:", lot, "Contract:", contractSize);
//   // console.log("Raw Profit:", rawProfit);

//   if (quoteCurrency === 'USD') {
//     return (Math.round(rawProfit * 100) / 100).toFixed(2);
//   }

//   const conversionSymbol = quoteCurrency + 'USD';
//   const conversionMarket = this.getMarketRates(conversionSymbol);
//   if (!conversionMarket || !conversionMarket.oInitial) {
//     // console.warn('❌ Conversion market missing for', conversionSymbol);
//     return '0.00';
//   }

//   const conversionRate = direction === 0
//     ? Number(conversionMarket.oInitial.Bid)
//     : Number(conversionMarket.oInitial.Ask);

//   const profitInUSD = rawProfit * conversionRate;

//   // console.log("Conversion Rate:", conversionRate);
//   // console.log("Profit in USD:", profitInUSD);

//  return Math.abs(profitInUSD) < 0.01
//   ? profitInUSD.toFixed(5)
//   : (Math.round(profitInUSD * 100) / 100).toFixed(2);
// }
getProfitUSD(position: any): string {
  // --- Profit Calculation Debug ---
  // console.log('--- Profit Calculation Debug ---');

  const rawSymbol = position.Sy || '';
  const cleanSymbol = rawSymbol.split('.')[0];
  const quoteCurrency = cleanSymbol.slice(-3);
  const openPrice = Number(position.PC);
  const lot = Number(position.V) / 10000;
  const direction = position.BS;

  // console.log('Raw Symbol:', rawSymbol);
  // console.log('Clean Symbol:', cleanSymbol);
  // console.log('Quote Currency:', quoteCurrency);
  // console.log('Open Price:', openPrice);
  // console.log('Lot:', lot);
  // console.log('Direction:', direction === 0 ? 'Buy' : 'Sell');

  const market = this.getMarketRates(cleanSymbol);
  if (!market || !market.oInitial) return '0.00';

  const ask = Number(market.oInitial.Ask);
  const bid = Number(market.oInitial.Bid);
  const contractSize = Number(market.oSymbolConfig?.Contract || 100000);

  let exitPrice = direction === 0 ? bid : ask;
  let rawProfit = (exitPrice - openPrice) * lot * contractSize;
  if (direction === 1) rawProfit = (openPrice - exitPrice) * lot * contractSize;

  // console.log('Market Ask:', ask);
  // console.log('Market Bid:', bid);
  // console.log('Contract Size:', contractSize);
  // console.log('Exit Price:', exitPrice);
  // console.log('Raw Profit:', rawProfit);

  // ✅ Case 1: Quote currency is USD (no conversion needed)
  if (quoteCurrency === 'USD') {
    const result = this.formatProfit(rawProfit);
    // console.log('✅ USD quote. Final Profit (USD):', result);
    return result;
  }

  // ✅ Case 2: Try to get conversion to USD (quoteCurrency -> USD)
  let conversionSymbol = quoteCurrency + 'USD';
  let conversionMarket = this.getMarketRates(conversionSymbol);

  if (conversionMarket && conversionMarket.oInitial) {
    const foundSymbol = conversionMarket.oSymbolConfig?.Symbol || '';
    let rate = direction === 0
      ? Number(conversionMarket.oInitial.Bid)
      : Number(conversionMarket.oInitial.Ask);

    // ✅ If foundSymbol is actually USD/quoteCurrency, invert the rate
    if (foundSymbol.startsWith('USD')) {
      if (rate !== 0) {
        rate = 1 / rate;
        // console.log('⚠️ Inverted conversion rate because pair was USD/' + quoteCurrency);
      }
    }

    // console.log('✅ Using conversion symbol:', foundSymbol);
    // console.log('Conversion Rate:', rate);

    const convertedProfit = rawProfit * rate;
    const result = this.formatProfit(convertedProfit);
    // console.log('Converted Profit (USD):', result);
    return result;
  }

  // ❌ Fallback if conversion symbol not found
  return '0.00';
}


// ✅ Utility function to format the final profit
private formatProfit(profit: number): string {
  return Math.abs(profit) < 0.01
    ? profit.toFixed(5)
    : (Math.round(profit * 100) / 100).toFixed(2);
}




getMarketRates(symbol: string): any {
  // if (!this.data || !Array.isArray(this.data)) return null;

  // Try exact match first
  const exactMatch = this.data.find((item: any) =>
    item?.oSymbolConfig?.Symbol === symbol || item?.oSymbolConfig?.Symbol?.startsWith(symbol + '.')
  );
  // console.log("exactMatch",exactMatch)
  if (exactMatch) return exactMatch;

  // Try flexible reverse match if needed
  const reversedSymbol = symbol.slice(-3) + symbol.slice(0, -3); // e.g., GBPBTC
  return this.data.find((item: any) =>
    item?.oSymbolConfig?.Symbol?.startsWith(reversedSymbol)
  );
}
orderty1:any = 0
Ordertype1(ev:any){
  const selectElement = ev.target as HTMLSelectElement;
  this.orderty1 = selectElement.value
  console.log("ec", ev,selectElement.value);
  // this.tradeForm.patchValue({
  //   ordType: selectElement.value
  // })
 
}

priceTrade:any =0
orderResData:any ={}

showMassage:any = 1
showErroMass:any = 1

timeStamp:any
onDateChange(event: any) {
const selectedDate = new Date(event.target.value);
const epochTimestamp = Math.floor(selectedDate.getTime() / 1000); // Convert to Unix Timestamp
console.log('Epoch/Unix Timestamp:', epochTimestamp);
this.timeStamp = epochTimestamp
console.log("this.timeStamp",this.timeStamp);

// You can now use epochTimestamp as needed
}

MAKE_NEW_ORDER_Market(val:any, price:any){
// this.priceTrade = this.tradeForm.value.Price
// this.tradeForm.patchValue({
//   AtPrice:price
// })
let obj ={
  "Login": Number(localStorage.getItem('loginId')),
  "Symbol": localStorage.getItem('changeSym'),
  "Lot": Number(this.inputLotValue),
  "Price":Number(price),
  "SL":Number(this.orderFrom.value.stopLoss),
  "PL":Number(this.orderFrom.value.takeProfit),
  "ordType":val,               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
  "fillType":1,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
  "trdType":3,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
  //"StopLimit":185.890,
  "Expiry": 0,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
  "ExpTime":this.timeStamp,
  "Comment":(this.orderFrom.value.comment)
}
console.log("New order ",obj);

this.api.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
this.orderResData= res
setTimeout(() => {
  this.GET_OPENED1()
this.closeModel()
},1000);


if(this.orderResData.ERR_MSG == ""){
  this.showMassage = 2
  this.showErroMass =1
}
else   if(this.orderResData.ERR_MSG != ""){
  this.showMassage = 2
  this.showErroMass =2
}
else{
  this.showMassage = 1
  this.showErroMass =1
}


},error:(err:any)=>{
console.log(err);

}})
}


Modify(priceAsk:any, priceBid:any){
  
  let obj ={


    "Login": Number(localStorage.getItem('loginId')),
    "Symbol": this.modelData.Sy,
    "Lot": Number(this.inputLotValue),
    "Price":(this.modelData.PC),
    "SL":Number(this.orderFrom.value.stopLoss),
    "PL":Number(this.orderFrom.value.takeProfit),
    "ordType":Number(this.modelData.BS),               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
    "fillType":0,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
    "trdType":7,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
    //"StopLimit":185.890,
    "Expiry": 0,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
    "ExpTime":this.timeStamp,
    "Comment":(this.orderFrom.value.comment)
  }
  console.log("New order ",obj);
  
  this.api.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
  this.orderResData= res

 
  if(this.orderResData.ERR_MSG == ""){
    this.showMassage = 2
    this.showErroMass =1
    // this.GET_OPENED1()
  }
  else   if(this.orderResData.ERR_MSG != ""){
    this.showMassage = 2
    this.showErroMass =2
    // this.GET_OPENED1()
  }
  else{
    this.showMassage = 1
    this.showErroMass =1
    // this.GET_OPENED1()
  }

  
  },error:(err:any)=>{
  console.log(err);
  
  }})
  }


  close(priceAsk:any, priceBid:any){
  
    let obj ={
      "Login":Number(localStorage.getItem('loginId')),
      "Symbol": this.modelData.Sy,
      "Ticket":Number(this.modelData.Pos),         // After open a trade we are getting the ticket number
      "Lot":Number(this.inputLotValue),
      "Price":(this.modelData.PC),
      "ordType":Number(this.modelData.BS),                //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
      "fillType":0,              ////FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
      "Comment":(this.orderFrom.value.comment)
    }
    console.log("New order ",obj);
    
    this.api.MAKE_CLOSE_ORDER(obj).subscribe({next:(res:any)=>{
    this.orderResData= res
   
    
   
    if(this.orderResData.ERR_MSG == ""){
      this.showMassage = 2
      this.showErroMass =1
      // this.GET_OPENED1()
    }
    else   if(this.orderResData.ERR_MSG != ""){
      this.showMassage = 2
      this.showErroMass =2
      // this.GET_OPENED1()
    }
    else{
      this.showMassage = 1
      this.showErroMass =1
      // this.GET_OPENED1()
    }
    

    },error:(err:any)=>{
    console.log(err);
    
    }})
    }
  
okReturn(){
this.showErroMass =1
this.showMassage = 1
// this.GET_OPENED1()
}

formatIndianTime(timestamp: number): Date {
  const indiaOffset = 5.5; // India is UTC+5:30
  const localDate = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const utcOffset = localDate.getTimezoneOffset() / 60;
  return new Date(localDate.getTime() + (utcOffset + indiaOffset) * 3600 * 1000);
}


positionHitory:any =[]
historyRow:any
GET_USER_HISTORY(){
  const currentDate = new Date();

    // Set dtFrom to the current date and time
    const formattedDtFrom = this.datePipe.transform(currentDate, 'yyyy-MM-dd 23:59:59', 'GMT');
  
    // Set dtTo to three days from now
    const dtTo = new Date(currentDate);
    dtTo.setMonth(dtTo.getMonth() - 3);
  
    // Format the dtTo date
    const formattedDtTo = this.datePipe.transform(dtTo, 'yyyy-MM-dd 00:00:01', 'GMT');
    

    let obj ={
      // "Key":"",
      "Account": Number(localStorage.getItem('loginId')),
      "dtFrom":formattedDtTo,
      "dtTo":formattedDtFrom
  }
    this.api.GET_USER_HISTORY(obj).subscribe({
      next: (res: any) => {
    
        
       
        //  closePrice
        // "ProfitePrice":this.showProfitePrice,

         this.positionHitory = res?.lstPos
         console.log("this.positionHitory",this.positionHitory);
         this.historyRow = res?.oAccount
        
        //  this.positionHitory.forEach((element:any , index:any) => {
        //    this.positionHitory[index].Symbol = element.Sy;
        //    delete this.positionHitory[index].Sy;
        //    this.positionHitory[index].closePrice = element.CL;
        //    delete this.positionHitory[index].CL;
        //    this.positionHitory[index].ProfitePrice = element.PL;
        //    delete this.positionHitory[index].PL;
        //    this.positionHitory[index].oBuySell = element.BS;
        //    delete this.positionHitory[index].BS;
        //    this.positionHitory[index].Price = element.OP;
        //    delete this.positionHitory[index].OP;  
        //    const indianDateTime = this.formatIndianTime(element.C);
           
        //    const germanyDateTime = this.formatGermanyTime(indianDateTime)
          
        //    this.positionHitory[index].Close_Timestamp = germanyDateTime;
        //    delete this.positionHitory[index].C;
        //    const indianDateTime1 = this.formatIndianTime(element.O);
        //    const germanyDateTime1 = this.formatGermanyTime(indianDateTime1)
        //    this.positionHitory[index].Open_Timestamp = germanyDateTime1;
        //    delete this.positionHitory[index].O;
        //    this.positionHitory[index].Ticket = element.PID;
        //    delete this.positionHitory[index].PID;
        //    this.positionHitory[index].Lot = this.getValue2(element.LT);
        //    delete this.positionHitory[index].LT;
        //    this.positionHitory[index].Swap = element.Sw;
        //    delete this.positionHitory[index].Sw;
        //    this.positionHitory[index].filterDate = this.formatGermanyTime1(indianDateTime);
         
          
        // });


       
      },
      error: (err: any) => {
        console.log(err);
        
      },
    });
    return new Promise<void>((resolve) => setTimeout(resolve, 1500));
  }


MAKE_NEW_ORDER(val:any){

let obj ={
 "Login": Number(localStorage.getItem('loginId')),
  "Symbol": localStorage.getItem('changeSym'),
  "Lot": Number(this.inputLotValue),
  "Price":Number(this.orderFrom.value.price),
  "SL":Number(this.orderFrom.value.stopLoss),
  "PL":Number(this.orderFrom.value.takeProfit),
  "ordType":val,               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
  "fillType":1,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
  "trdType":3,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
  //"StopLimit":185.890,
  "Expiry": 0,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
  "ExpTime":this.timeStamp,
  "Comment":(this.orderFrom.value.comment)
}
console.log("New order ",obj);

this.api.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
this.orderResData= res
if(this.orderResData.ERR_MSG == ""){
  this.showMassage = 2
  this.showErroMass =1
}
else   if(this.orderResData.ERR_MSG != ""){
  this.showMassage = 2
  this.showErroMass =2
}
else{
  this.showMassage = 1
  this.showErroMass =1
}



},error:(err:any)=>{
console.log(err);

}})
}

inputLotValue: any = 0.01; // Initial value for the ion-input
inputLotValuew: any = 0.1;

addValue(val:any) {
  if(val ==1){
    this.inputLotValue = (parseFloat(this.inputLotValue) + 1/Math.pow(10, this.countDecimalDigits(this.inputLotValue))).toFixed(this.countDecimalDigits(this.inputLotValue));

  }
  else if(val ==2){
    this.inputLotValue = (parseFloat(this.inputLotValue) + 1/Math.pow(10, this.countDecimalDigits(this.inputLotValuew))).toFixed(this.countDecimalDigits(this.inputLotValue));

  }
}

dd:any
currVal:any
addSl(val:any){
  this.currVal = val

  this.orderFrom.patchValue({
    stopLoss : this.currVal
})

this.orderFrom.patchValue({
  takeProfit : this.currVal
})
  const curre =   Number((parseFloat(this.inputLotValue) + 1/Math.pow(10, this.countDecimalDigits(this.inputLotValuew))).toFixed(this.countDecimalDigits(this.inputLotValue)));

 this.dd = this.addValue(curre)
     this.orderFrom.patchValue({
      stopLoss :  this.dd
  })
 
}

inputSl:any
inputTPP:any
    addSll(val:any){

      if(val == ""){
        val = this.currentPri
       }
       const numberAsString = val.toString();
       const decimalIndex = numberAsString.indexOf('.');
       const decimalPartLength = decimalIndex === -1 ? 0 : numberAsString.length - decimalIndex - 1;
   console.log("decimal",decimalPartLength);
   
       this.inputSl = (parseFloat(val) + 1/Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
       console.log("this.inputSl",this.inputSl);
       this.orderFrom.patchValue({
        stopLoss : this.inputSl
       })
    }

    // Subtract Sl 0.1 from the input value
    SubSll(val: any) {
      if (!val) {
        val = this.currentPri || 0; // Ensure default value
      }
    
      let newSL = (parseFloat(val) - 1 / Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
    
      // **Prevent negative stop loss**
      if (parseFloat(newSL) < 0) {
        newSL = '0';
      }
    
      this.inputSl = newSL;
    
      this.orderFrom.patchValue({
        stopLoss: this.inputSl
      });
    }
    

    // Add TP 0.1 to the input value
      addTP(val:any){
  
        if(val == ""){
         val = this.inputTPP
        }
     
        this.inputTPP = (parseFloat(val) + 1/Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
     
     
       this.orderFrom.patchValue({
         takeProfit : this.inputTPP
     })
    }
     
    // Subtract TP 0.1 from the input value
    subTP(val:any){
      if (!val) {
        val = this.inputTPP || 0; // Ensure default value
      }
    
      let newSL = (parseFloat(val) - 1 / Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
    
      // **Prevent negative stop loss**
      if (parseFloat(newSL) < 0) {
        newSL = '0';
      }
    
      this.inputTPP = newSL;
    
      this.orderFrom.patchValue({
        takeProfit: this.inputTPP
      });
    }
currVTP:any 


 addValues(val1: number): number {
  return val1 + this.currVal;
}

subtractValue(val:any) { 
if(val ==1){
  this.inputLotValue = (parseFloat(this.inputLotValue) - 1/Math.pow(10, this.countDecimalDigits(this.inputLotValue))).toFixed(this.countDecimalDigits(this.inputLotValue));

}
else if(val ==2){
  this.inputLotValue = (parseFloat(this.inputLotValue) - 1/Math.pow(10, this.countDecimalDigits(this.inputLotValuew))).toFixed(this.countDecimalDigits(this.inputLotValue));

}

}

countDecimalDigits(num: number): number {
// Convert the number to a string
const numStr: string = num.toString();

// Find the index of the decimal point
const decimalIndex: number = numStr.indexOf('.');

// If the decimal point exists, count the length of the substring after it
if (decimalIndex !== -1) {
  return numStr.substring(decimalIndex + 1).length;
} else {
  // If there's no decimal point, return 0
  return 0;
}
}

modref2:any
modelData:any ={}
openXl2(content2: any,val:any) {
  this.modelData = val  
  this.inputLotValue = this.modelData.Lot
  this.inputSl = this.modelData.SL
  this.inputTPP = this.modelData.TL
  this.orderFrom.patchValue({
    takeProfit :this.modelData.TL
})
this.orderFrom.patchValue({
  stopLoss : this.inputSl
 })
  const initialDateEvent = { target: { value: new Date().toISOString().split('T')[0] } };
  this.onDateChange(initialDateEvent);
this.navGateUrl()
console.log("this.currentPri",this.currentPri);
this.showMassage = 1
 this.orderFrom.patchValue({
  price:this.currentPri
 })
  this.modref= this.modalService.open(content2, { size: 'md modalone', centered: true });
}


refreshPosition(){
  this.GET_OPENED1()
}



// new data from socket

randomNumber:any;
generateRandomNumber() {
  // Generate a random number between 10 and 99
  this.randomNumber = Math.floor(Math.random() * 90) + 10;
  console.log(" generateRandomNumber()",this.randomNumber);
  
}
positionsArray: { indexId: number; ticketId: number;statusId: number }[] = [];
ordersArray: { indexId: number; ticketId: number;statusId: number}[] = [];

savePositionData(index: number, ticketId: number, status: number) {
  // Check if the ticketId already exists in the positionsArray

  
  const exists = this.positionsArray.some(pos => pos.ticketId === ticketId);
  if (!exists) {
    this.positionsArray.push({ indexId: index, ticketId: ticketId,statusId: status});
    localStorage.setItem('positions', JSON.stringify(this.positionsArray));
    this.updatePositionListData()
  }
}

saveOrderData(index: number, ticketId: number,status: number) {
  // Check if the ticketId already exists in the ordersArray
  const exists = this.ordersArray.some(order => order.ticketId === ticketId);
  if (!exists) {
    this.ordersArray.push({ indexId: index, ticketId: ticketId ,statusId: status});
    localStorage.setItem('orders', JSON.stringify(this.ordersArray));

    
  }
}



  // Function to filter positionListData based on positionsArray's ticketId
  filterPositionListData(): void {
    // Step 1: Create a Set of ticketIds from positionsArray for quick lookup
    const validTickets = new Set(this.positionsArray.map(pos => pos.ticketId));

    // Step 2: Filter positionListData to only include items with a matching Ticket
    this.positionListData = this.positionListData.filter((item:any) => validTickets.has(item.Ticket));

    // Optional: Log the filtered data to the console
    console.log(this.positionListData);
  }

  // Call this method to filter the data
  updatePositionListData(): void {
    this.filterPositionListData();
  }


  // close order
  currPrice:any
  closeOrder(priceAsk:any, priceBid:any) {
    // let obj ={
  //   "Login":Number(localStorage.getItem('loginId')),
  //   "Symbol": this.modelData.Sy,
  //   "Ticket":Number(this.modelData.Pos),         // After open a trade we are getting the ticket number
  //   "Lot":Number(this.inputLotValue),
  //   "Price":(this.modelData.PC),
  //   "ordType":Number(this.modelData.BS),                //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
  //   "fillType":0,              ////FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
  //   "Comment":(this.orderFrom.value.comment)
  // }

  if(this.modelData.oBuySell == 0 || 2|| 4||6){
    this.currPrice = this.data[0]?.oInitial?.Bid
   
  }
  else if(this.modelData.oBuySell == 1 || 3|| 5|| 7 ){
    this.currPrice = this.data[0]?.oInitial?.Ask
   
  }

    let obj = {
      Login: 108,
      accID: Number(localStorage.getItem('loginId')),
      Symbol: this.modelData.Symbol,
      Ticket: Number(this.modelData.Ticket),
      Lot: Number(this.inputLotValue),
      Price: (this.modelData.Price),
      ordType: Number(this.modelData.oBuySell),
      fillType: 0,
      Comment:(this.orderFrom.value.comment)
    };
  
    this.share.sendCloseOrderbyData(obj);
    // this.closeOrderReq(obj)
  }

  // closeOrderReq(obj:any) {
  //   console.log(obj);
    
  //      this.step = 1
  //      this.jsonBytes = []
  //      this.jsonBytes = this.deleteReq(obj);
   
   
     
  //      this.bufferArray = new Uint8Array(this.jsonBytes);
  //      if (this.socket2 && this.socket2.readyState === WebSocket.OPEN) {
  //        // Convert the hexadecimal string to bytes before sending
  //        // const byteArray = this.hexToBytes(data);
       
  //        console.log("this.jsonBytes1111", this.jsonBytes)
  //        this.socket2.send(this.bufferArray);
  //        console.log("this.jsonBytes", this.jsonBytes.buffer)
   
  //      } else {
  //        console.error('WebSocket connection is not open.');
  //      }
   
   
   
   
  // }


  modefyOrder() {

    let obj = {
      Login: 106,
      accID: Number(localStorage.getItem('loginId')),
      Symbol: this.modelData.Symbol,
      Ticket: this.modelData.Ticket,
      Lot:Number(this.inputLotValue),
      Price: Number(this.modelData.Price),
      SL:  Number(this.orderFrom.value.stopLoss),
      // SL:  Number(this.inputSl),
      PL:Number(this.orderFrom.value.takeProfit),
      ordType: Number(this.modelData.oBuySell),
      StopLimit: "",
      Expiry: "",
      ExpTime: "",
      Comment: ""
    };
  
    this.share.sendModefyData(obj)
  
  }


deleteIFPossitionNotExists(val:any){

}

deletePositions(ticketId:any){
  // Retrieve the current data from localStorage
  const storedData1 = localStorage.getItem('positions');
  if (storedData1) {
    // Parse the data into a JSON array
    const positions = JSON.parse(storedData1);
    // Filter out the item with the matching Ticket ID
  
    const updatedData1 = positions.filter((item: any) => item.ticketId == ticketId);
    if (updatedData1.length !== positions.length) {
      // Save the updated array back to localStorage
      localStorage.setItem('positions', JSON.stringify(updatedData1));
      console.log(`Deleted item with Ticket ID ${ticketId}`);
      this.share.UpToDate(0)
    } else {
      console.log(`No item found with Ticket ID ${ticketId}`);
    }
  } else {
    console.log('No data found in localStorage for key "positionListData"');
  }
    }


    // number and dot only
    numberOnly2(event: any): boolean {
      const charCode = event.which ? event.which : event.keyCode;
    
      // Reference to the input element
      const input = event.target as HTMLInputElement;
    
      // Allow digits (0-9) and dot (.)
      if ((charCode < 48 || charCode > 57) && charCode !== 46) {
        this.numericMessage = true;
        return false;
      }
    
      // Check if the input already contains a dot
      if (charCode === 46 && input.value.includes('.')) {
        this.numericMessage = true;
        return false;
      }
    
      this.numericMessage = false;
      return true;
    }
}
