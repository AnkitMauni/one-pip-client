import { Component,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as cc from 'currency-codes';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';
import { HeaderToFooterService } from 'src/app/services/headerToFooter.service';



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
  liveBalance: any;
  liveMargin: any;
  isPendingOrder: boolean = false;
  nvatabc(tab: any){
    this.currentTab = tab
    if(tab == "tab1"){
      this.isResponseFromSocket = false;
      this.GET_OPENED1()
      // this.startInterval()
    }
    else if(tab == "tab2"){

      this.stopInterval()
      this.getAllExposure()
    }
    else if(tab == "tab3"){
      this.isResponseFromSocket = false;
      this.GET_USER_HISTORY()

    }
    else if(tab == "tab12"){
      this.isResponseFromSocket = false;
      this.getAllJournal()

    }

  }
  constructor(private headertoFooterSer:HeaderToFooterService,private datePipe: DatePipe,private http: HttpClient,private fb: FormBuilder,private share: ShareService, private api: GlobalService ,private modalService: NgbModal, config: NgbModalConfig,
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

this.headertoFooterSer.data$.subscribe((flag:boolean)=>{
      if(flag) this.GET_OPENED1();
    })
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
        // console.log("resss",res);
        
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
        // console.log("resss",res);
        
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
        // console.log("this.orderListData",this.orderListData);
        
      }
      
    })
    // const obj ={
    //   "Key": "",
    //   "Symbol": localStorage.getItem('changeSym')
    // }
    // this.api.GET_SYMBOL_PROP(obj).subscribe({ // Ensure api service and method name are correct
    //   next: (res: any) => {
    //     // this.minLot  = res.MinVol/10000;
    //     //     this.MaxLot  = val.V/10000;
    //     //     this.stepVol = res.Vol_Step/10000;
    //     // console.log(`Fetched initial data for dialog display (${symbol}):`, res);
    //   }
    // })
    
  }

liveMarketData:any=[]

  ngOnInit(){
      this.share.allMarketLiveData$.subscribe((res: any) => {
    this.liveMarketData = res;
    // optionally, force Angular to detect changes if needed
  });
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
    this.loginForm = this.fb.group({
      ac:[''],
      pass:['']
    })
    this.orderFrom = this.fb.group({
      // volume: [''],  
      price:['',[this.decimalValidator.bind(this)]] ,   // Control for the Volume input
      stopLimitPrice:['',[this.decimalValidator.bind(this)]] ,   // Control for the Volume input
      stopLoss: ['',[this.decimalValidator.bind(this)]],    // Control for the Stop Loss input
      takeProfit: ['',this.decimalValidator.bind(this)],  // Control for the Take Profit input
      comment: ['']      // Control for the Comment input
    });


    // this.getCalendarByToday();
    this.getCalendarByDay('next-week')

    this.share.msgForClientToModify$.subscribe((data:any) => {
      // const positionListData = JSON.parse(localStorage.getItem('positionListData') || '[]');
    
      // Find the index of the item with the matching Ticket ID
      // const index = positionListData.findIndex((item: any) => item.Ticket === data.Ticket);
    
      // If a matching item is found, update its SL value
      // if (index !== -1) {
        if(!data){
          // console.log('Received Data:', null);
          this.orderResData ={}
        }
        else{
          console.log('Received Data:', data);
       
          if(data.MsgID== 300){
         
          this.orderResData = data
          this.showMassage = 2
          this.showErroMass =1
         this.GET_OPENED1()
          }
          else  if( data.MsgID== 124){
         
            this.orderResData = data
            this.showMassage = 2
            this.showErroMass =1
           this.GET_OPENED1()
            }
          else if(data.MsgID == 301 ){
          // this.deleteIFPossitionNotExists(this.orderResData.ticketId)
          console.log("orderResData.error",data)
          this.orderResData = data
this.showMassage = 0
 this.showErroMass =2
 
          }
          else{
            this.orderResData = data
         
            this.showMassage = 2  
            this.showErroMass =2
       
           
          }
         
       
      }
    
    
    });
    setInterval(() => {
      this.calculateLiveMetrics();
    }, 500);
}
  getStepFromPrice1(): number {
    const price = parseFloat(this.orderFrom.get('price')?.value) || 0;
    const digits = this.countDecimalDigits(price || 0.0001);
    return 1 / Math.pow(10, digits);
  }
addSll1() {
      const slControl = this.orderFrom.get('stopLimitPrice');
      const currentSL = parseFloat(slControl?.value) || parseFloat(this.orderFrom.get('price')?.value) || 0;
      const step = this.getStepFromPrice1();
    
      const newSL = (currentSL + step).toFixed(this.countDecimalDigits(step));
      slControl?.setValue(Number(newSL));
    }
    
    SubSll1() {
      const slControl = this.orderFrom.get('stopLimitPrice');
      const currentSL = parseFloat(slControl?.value) || parseFloat(this.orderFrom.get('price')?.value) || 0;
      const step = this.getStepFromPrice1();
    
      let newSL = currentSL - step;
      if (newSL < 0) newSL = 0;
    
      const formatted = newSL.toFixed(this.countDecimalDigits(step));

      slControl?.setValue(Number(formatted));
    }

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

// getInitial(symbol: string) {
//   const obj = {
//     Key: "",
//     Symbol: symbol,
//   };

//   this.api.GET_SYMBOL_INITIAL(obj).subscribe({
//     next: (res: any) => {
//       this.symbolMetaMap[symbol] = res;
//       setInterval(() => {
//   this.calculateLiveMetrics();
// }, 500); // Call calculation after metadata is available
//     },
//     error: (err) => console.error(err),
//   });
// }

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
//     if(this.listOpen){
//       this.listOpen.forEach((pos:any) => {
//   if (!this.symbolMetaMap[pos.Sy]) {
//     this.getInitial(pos.Sy);
//   }
// });
//     }
    this.listPending = res.lstPending
      this.allGetTrade1 = res?.oAccount
      this.allGetTrade = this.allGetTrade1
       this.share.updateAccountData({
        balance:this.allGetTrade1?.Balance,
        margin: this.allGetTrade1?.Margin
      });
      // this.liveMargin = this.allGetTrade1?.Margin
      // this.liveBalance= this.allGetTrade1?.Balance
      this.share.livBalance(this.allGetTrade.Balance)
    // console.log("lstPos",res);
    // this.GET_USER_TRADE_WD()
   this.isResponseFromSocket = true;

  },
  error: (err:any)=>{
    console.log(err);
   this.isResponseFromSocket = true;
    
  }})
}
equity = 0;
usedMargin = 0;
freeMargin = 0;
marginLevel = 0;

// calculateLiveMetrics() {
//   let floatingPL = 0;
//   let usedMargin = this.allGetTrade.Margin;

//   this.listOpen.forEach((pos:any) => {
//     const symbol = pos.Sy;
//     // const volumeLots = pos.V / 100; // Since V = 100 means 0.01 lot
//     // const symbolMeta = this.symbolMetaMap[symbol];
//     floatingPL += Number(this.getProfitUSD(symbol));
//     // if (!symbolMeta) return; // Wait for metadata

//     // const calcType = symbolMeta.Calculation;
//     // const contractSize = symbolMeta.ContractSize;
//     // const leverage = symbolMeta.INITIAL_MK_B || 1;
//     // const marketPrice = this.getCurrent(symbol, pos.BS); // Live price

//     // // Margin Calculation
//     // let margin = 0;
//     // if (calcType === 'FOREX') {
//     //   margin = (volumeLots * contractSize) / leverage;
//     // } else if (calcType === 'CFD') {
//     //   margin = volumeLots * contractSize * marketPrice;
//     // } else if (calcType === 'CFDLEVERAGE') {
//     //   margin = (volumeLots * contractSize * marketPrice) / leverage;
//     // }

//     // usedMargin += margin;

//     // Floating P/L
   
//   });
//   // floatingPL += Number(this.getProfitUSD(pos));
//   const balance = Number(this.allGetTrade?.Balance || 0);
//   this.equity = balance + floatingPL;
//   this.usedMargin = usedMargin;
//   this.freeMargin = this.equity - usedMargin;
//   this.marginLevel = usedMargin > 0 ? (this.equity / usedMargin) * 100 : 0;
// }
floatingPL = 0;
calculateLiveMetrics() {
 
    let usedMargin = this.allGetTrade.Margin;
  this.floatingPL =0
    this.listOpen.forEach((pos: any) => {
      this.floatingPL += Number(this.getProfitUSD(pos));
    });
 

    let balance = Number(this.allGetTrade?.Balance || 0);
    this.share.accountData$.subscribe((data:any)=>{
      balance = data.balance;
      this.liveBalance = data.balance;
      this.liveMargin = data.margin;
    })
    this.equity = balance + this.floatingPL;
    this.usedMargin = this.liveMargin;
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
    if (this.modref) {
      this.modref.close();   // or this.modref.dismiss();
    }
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



navGateUrl()
{
  this.route.navigateByUrl('dashboard')
}
collapsed = true;
// toggleConnection(ajsd:any) {
//   if (this.connectionStatus === 'Connect') {
//     this.connectionStatus = 'Disconnect';
//     localStorage.setItem('status', 'Connect');
//     this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
  
   
//   } else {
   
//     this.connectionStatus = 'Connect';
//     localStorage.setItem('status', 'Disconnect');
//     this.route.navigate(['/dashboard']).then(() => {
//       this.route.navigate([{ outlets: { primary: null } }]); // Clear router state
//       window.location.reload()
//     });
//     this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
//     window.location.reload()

//   }
// }


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
  //  console.log(signal.calendar[0].events);
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
// console.log("startDate33",startDate,"endDate33",endDate);

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

// console.log("first seond",first,seond);
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
  //  console.log("summery",res);
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
    "ManagerIndex":Number(localStorage.getItem('managerId')),
    "lstTm":0
}
  this.api.GET_MGR_JOURNEL(obj).subscribe({next: (res:any)=>{
   console.log("journal",res);
   this.getAllJurn = Array.isArray(res) ? res : [];
    
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
  //  console.log("exposure",res);
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
 this.modref.close()
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
isResponseFromSocket: boolean = false;
customFrom: string = '';
customTo: string = '';

onRangeSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value;

  const now = new Date();
  let from: Date;

  switch (value) {
    case '1w':
      from = new Date();
      from.setDate(now.getDate() - 7);
      break;
    case '1m':
      from = new Date();
      from.setMonth(now.getMonth() - 1);
      break;
    case '1y':
      from = new Date();
      from.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return;
  }

  this.GET_USER_HISTORY({
    dtFrom: this.datePipe.transform(from, 'yyyy-MM-dd 00:00:01', 'GMT') as string,
    dtTo: this.datePipe.transform(now, 'yyyy-MM-dd 23:59:59', 'GMT') as string,
  });
}


applyCustomRange() {
  if (!this.customFrom || !this.customTo) return;

  this.GET_USER_HISTORY({
    dtFrom: this.customFrom + ' 00:00:01',
    dtTo: this.customTo + ' 23:59:59',
  });
}
GET_USER_HISTORY(params?: { dtFrom: string, dtTo: string }) {
  const now = new Date();

  const obj = {
    Account: Number(localStorage.getItem('loginId')),
    dtFrom: params?.dtFrom || this.datePipe.transform(now, 'yyyy-MM-dd 00:00:01', 'GMT'),
    dtTo: params?.dtTo || this.datePipe.transform(now, 'yyyy-MM-dd 23:59:59', 'GMT'),
  };

  this.api.GET_USER_HISTORY(obj).subscribe({
    next: (res: any) => {
      this.positionHitory = res?.lstPos || [];
      this.historyRow = res?.oAccount;
      this.isResponseFromSocket = true;
    },
    error: () => (this.isResponseFromSocket = true),
  });
}

// GET_USER_HISTORY(){
  

//   // const currentDate = new Date();

//   //   // Set dtFrom to the current date and time
//   //   const formattedDtFrom = this.datePipe.transform(currentDate, 'yyyy-MM-dd 23:59:59', 'GMT');
  
//   //   // Set dtTo to three days from now
//   //   const dtTo = new Date(currentDate);
//   //   dtTo.setMonth(dtTo.getMonth() - 3);
  
//   //   // Format the dtTo date
//   //   const formattedDtTo = this.datePipe.transform(dtTo, 'yyyy-MM-dd 00:00:01', 'GMT');
//     const currentDate = new Date();

// // Format To as current date with 23:59:59
// const formattedDtTo = this.datePipe.transform(currentDate, 'yyyy-MM-dd 23:59:59', 'GMT');

// // From should always be 1970-01-01 00:00:01
// const formattedDtFrom = '1970-01-01 00:00:01';

//   //   let obj ={
//   //     // "Key":"",
//   //     "Account": Number(localStorage.getItem('loginId')),
//   //     "dtFrom":formattedDtTo,
//   //     "dtTo":formattedDtFrom
//   // }
//   let obj = {
//     Account: Number(localStorage.getItem('loginId')),
//     dtFrom: formattedDtFrom,
//     dtTo: formattedDtTo
//   };
//     this.api.GET_USER_HISTORY(obj).subscribe({
//       next: (res: any) => {
    
        
       
//         //  closePrice
//         // "ProfitePrice":this.showProfitePrice,

//          this.positionHitory = res?.lstPos
//          console.log("this.positionHitory",this.positionHitory);
//          this.historyRow = res?.oAccount
        
//         //  this.positionHitory.forEach((element:any , index:any) => {
//         //    this.positionHitory[index].Symbol = element.Sy;
//         //    delete this.positionHitory[index].Sy;
//         //    this.positionHitory[index].closePrice = element.CL;
//         //    delete this.positionHitory[index].CL;
//         //    this.positionHitory[index].ProfitePrice = element.PL;
//         //    delete this.positionHitory[index].PL;
//         //    this.positionHitory[index].oBuySell = element.BS;
//         //    delete this.positionHitory[index].BS;
//         //    this.positionHitory[index].Price = element.OP;
//         //    delete this.positionHitory[index].OP;  
//         //    const indianDateTime = this.formatIndianTime(element.C);
           
//         //    const germanyDateTime = this.formatGermanyTime(indianDateTime)
          
//         //    this.positionHitory[index].Close_Timestamp = germanyDateTime;
//         //    delete this.positionHitory[index].C;
//         //    const indianDateTime1 = this.formatIndianTime(element.O);
//         //    const germanyDateTime1 = this.formatGermanyTime(indianDateTime1)
//         //    this.positionHitory[index].Open_Timestamp = germanyDateTime1;
//         //    delete this.positionHitory[index].O;
//         //    this.positionHitory[index].Ticket = element.PID;
//         //    delete this.positionHitory[index].PID;
//         //    this.positionHitory[index].Lot = this.getValue2(element.LT);
//         //    delete this.positionHitory[index].LT;
//         //    this.positionHitory[index].Swap = element.Sw;
//         //    delete this.positionHitory[index].Sw;
//         //    this.positionHitory[index].filterDate = this.formatGermanyTime1(indianDateTime);
         
          
//         // });

//         this.isResponseFromSocket = true;

//       },
//       error: (err: any) => {
//         console.log(err);
//         this.isResponseFromSocket = true;
//       },
//     });
//     return new Promise<void>((resolve) => setTimeout(resolve, 1500));
//   }


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
      if (this.modelData?.BS === 0 || this.modelData?.BS === 1) return;
  let value = parseFloat(val);
  if (isNaN(value)) {
    value = parseFloat(this.orderFrom.get('price')?.value) || this.currentPri || 0;
  }
const step = this.getStepFromPrice(value);
  const decimals = this.countDecimalDigits(step);
  const updatedValue = (value + 1 / Math.pow(10, decimals)).toFixed(decimals);

  this.inputSl = updatedValue;
  this.orderFrom.patchValue({ price: updatedValue });
       }
   

    // Subtract Sl 0.1 from the input value
    SubSll(val: any) {
      if (this.modelData?.BS === 0 || this.modelData?.BS === 1) return;
  let value = parseFloat(val);
  if (isNaN(value)) {
    value = parseFloat(this.orderFrom.get('price')?.value) || this.currentPri || 0;
      }
    
const step = this.getStepFromPrice(value);
  const decimals = this.countDecimalDigits(step);
  const updatedValue = (value - 1 / Math.pow(10, decimals)).toFixed(decimals);
    
  this.inputSl = updatedValue;
  this.orderFrom.patchValue({ price: updatedValue });
    }
 getStepFromPrice(current: any): number {
  const price = parseFloat(current) || 0;
  const digits = this.pricePrecision || 0.0001;
  return 1 / Math.pow(10, digits);
}

addSllSLTP() {
  const slControl = this.orderFrom.get('stopLoss');

  // Get base value: first time from 'price', otherwise from 'stopLoss'
  let baseValue: number;

  if (slControl?.value !== null && slControl?.value !== undefined && slControl.value !== 0) {
    baseValue = +slControl.value;
  } else {
    baseValue = +this.orderFrom.get('price')?.value || 0;
  }

  console.log("Base for SL:", baseValue);

  const step = +this.getStepFromPrice(baseValue);
  const precision = this.countDecimalDigits(step);
  const newSL = (baseValue + step).toFixed(precision);

  this.inputSl = newSL;

  // Set only 'stopLoss', do NOT touch 'price'
  slControl?.setValue(Number(newSL));
}



    
   SubSllSLTP() {
  const slControl = this.orderFrom.get('stopLoss');

  // Use stopLoss if set, otherwise fall back to price
  let baseValue: number;

  if (slControl?.value !== null && slControl?.value !== undefined && slControl.value !== 0) {
    baseValue = +slControl.value;
  } else {
    baseValue = +this.orderFrom.get('price')?.value || 0;
  }

  console.log("Base for SL (subtract):", baseValue);

  const step = +this.getStepFromPrice(baseValue);
  let newSL = baseValue - step;
  if (newSL < 0) newSL = 0;

  const precision = this.countDecimalDigits(step);
  const formatted = newSL.toFixed(precision);

  this.inputSl = formatted;
  slControl?.setValue(Number(formatted)); // Only update stopLoss, not price
}


    // Add TP 0.1 to the input value
addTP() {
  const tpControl = this.orderFrom.get('takeProfit');

  // Use takeProfit if set, else start from price
  let baseValue: number;
  if (tpControl?.value !== null && tpControl?.value !== undefined&& tpControl.value !== 0) {
    baseValue = +tpControl.value;
  } else {
    baseValue = +this.orderFrom.get('price')?.value || 0;
  }

  const step = +this.getStepFromPrice(baseValue);
  const precision = this.countDecimalDigits(step);
  const updatedValue = (baseValue + step).toFixed(precision);

  this.inputTPP = updatedValue;
  tpControl?.setValue(Number(updatedValue)); // Only update takeProfit
}

     
     
    // Subtract TP 0.1 from the input value
   subTP() {
  const tpControl = this.orderFrom.get('takeProfit');

  // Use takeProfit if set, else start from price
  let baseValue: number;
  if (tpControl?.value !== null && tpControl?.value !== undefined&& tpControl.value !== 0) {
    baseValue = +tpControl.value;
  } else {
    baseValue = +this.orderFrom.get('price')?.value || 0;
  }

  const step = +this.getStepFromPrice(baseValue);
  let newTP = baseValue - step;
  if (newTP < 0) newTP = 0;

  const precision = this.countDecimalDigits(step);
  const formatted = newTP.toFixed(precision);

  this.inputTPP = formatted;
  tpControl?.setValue(Number(formatted)); // Only update takeProfit
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

countDecimalDigits(num: number | string): number {
  if (num === undefined || num === null || isNaN(Number(num))) {
  return 0;
}

  const numStr = Number(num).toString();
  const decimalIndex = numStr.indexOf('.');
  return decimalIndex !== -1 ? numStr.length - decimalIndex - 1 : 0;
}
decimalValidator(control: AbstractControl): { [key: string]: any } | null {
  if (control.value == null || control.value === '') return null;
  // console.error("con",control.value);
  const value = this.currentPri?.toString()?? "0.00000";
  const precision = this.pricePrecision ?? 2; // fallback
  // console.error("this.pricePrecision",this.pricePrecision);
  const regex = new RegExp(`^\\d+(\\.\\d{0,${precision}})?$`);
  // console.error("regex.test(value)",regex.test(value));
  return regex.test(value) ? null : { invalidDecimal: true };
}
public minLot:number = 0;
public MaxLot:number = 0;
public stepVol:number = 0;
pricePrecision =2;
modref2:any
modelData:any ={}
openXl2(content2: any,val:any) {
  console.log("vallllue", val);
  this.orderFrom.controls['stopLimitPrice'].setValue(val.PTr)
  const obj ={
    "Key": "",
    "Symbol": val.Sy
  }
//  this.share.allMarketLiveData$.subscribe((res: any) => {
//       // console.log("allMarketLiveData",res);
//       this.data = res.filter((item: any) => item?.oSymbolConfig?.Symbol === val.Sy);
//       // console.log("dddaata[0]", this.data[0]);
//       this.currentPri = this.data[0]?.oInitial?.Ask
//       console.log("this.currentPri2", this.currentPri);
//       // localStorage.setItem('changeSym',this.data[0]?.oSymbolConfig?.Symbol)
//     })
  this.api.GET_SYMBOL_PROP(obj).subscribe({ // Ensure api service and method name are correct
      next: (res: any) => {
        this.pricePrecision = res.Digit;
        this.minLot  = res.MinVol/10000;
            this.MaxLot  = val.V/10000;
            this.stepVol = res.Vol_Step/10000;
        // console.log(`Fetched initial data for dialog display (${symbol}):`, res);
      }
    })
  this.modelData = val  
  this.inputLotValue = this.modelData.V/10000
  this.isPendingOrder = this.modelData.BS >= 2 && this.modelData.BS <= 7;
  this.inputSl = this.modelData.SL
  this.inputTPP = this.modelData.TP
  if(val.BS == 0 || val.BS == 1){
  this.orderFrom.patchValue({
    takeProfit :this.modelData.TP,
    price:this.modelData?.PC
})
this.orderFrom.patchValue({
  stopLoss : this.modelData.SL
 })
  }
    if(val.BS >1){
  this.orderFrom.patchValue({
    takeProfit :this.modelData.TP,
    price:this.modelData?.P
})
this.orderFrom.patchValue({
  stopLoss : this.modelData.SL
 })
  }

  const initialDateEvent = { target: { value: new Date().toISOString().split('T')[0] } };
  this.onDateChange(initialDateEvent);
this.navGateUrl()

this.showMassage = 1
// this.currPrice = this.getCurrent(val?.Sy,val?.BS)
// console.log("this.currentPri",this.currentPri);
//  this.orderFrom.patchValue({
//   price:this.currentPri
//  })
  this.modref= this.modalService.open(content2, { size: 'md modalone', centered: true });
}


refreshPosition(){
  this.GET_OPENED1()
}



// new data from socket

// randomNumber:any;
// generateRandomNumber() {
//   // Generate a random number between 10 and 99
//   this.randomNumber = Math.floor(Math.random() * 90) + 10;
//   console.log(" generateRandomNumber()",this.randomNumber);
  
// }
// positionsArray: { indexId: number; ticketId: number;statusId: number }[] = [];
// ordersArray: { indexId: number; ticketId: number;statusId: number}[] = [];

// savePositionData(index: number, ticketId: number, status: number) {
//   // Check if the ticketId already exists in the positionsArray

  
//   const exists = this.positionsArray.some(pos => pos.ticketId === ticketId);
//   if (!exists) {
//     this.positionsArray.push({ indexId: index, ticketId: ticketId,statusId: status});
//     localStorage.setItem('positions', JSON.stringify(this.positionsArray));
//     this.updatePositionListData()
//   }
// }

// saveOrderData(index: number, ticketId: number,status: number) {
//   // Check if the ticketId already exists in the ordersArray
//   const exists = this.ordersArray.some(order => order.ticketId === ticketId);
//   if (!exists) {
//     this.ordersArray.push({ indexId: index, ticketId: ticketId ,statusId: status});
//     localStorage.setItem('orders', JSON.stringify(this.ordersArray));

    
//   }
// }



  // // Function to filter positionListData based on positionsArray's ticketId
  // filterPositionListData(): void {
  //   // Step 1: Create a Set of ticketIds from positionsArray for quick lookup
  //   const validTickets = new Set(this.positionsArray.map(pos => pos.ticketId));

  //   // Step 2: Filter positionListData to only include items with a matching Ticket
  //   this.positionListData = this.positionListData.filter((item:any) => validTickets.has(item.Ticket));

  //   // Optional: Log the filtered data to the console
  //   console.log(this.positionListData);
  // }

  // // Call this method to filter the data
  // updatePositionListData(): void {
  //   this.filterPositionListData();
  // }


  // close order
  currPrice:any


  /// working code 
  closeOrder(Sy:any, BS:any) {

   const marketPrice = this.getCurrent(Sy,BS);

   if(this.inputLotValue > (this.modelData?.V)/10000){
    return
   }else{
   

    let obj = {
      Login: 108,
      accID: Number(localStorage.getItem('loginId')),
      Symbol: this.modelData.Sy,
      Ticket: Number(this.modelData.Pos),
      Lot: Number(this.inputLotValue),
      Price: this.orderFrom.value.price,
      ordType: Number(this.modelData.BS),
      fillType: 0,
      Comment:(this.orderFrom.value.comment)
    };
  
    this.share.sendCloseOrderbyData(obj);
    // this.closeOrderReq(obj)
  }}
 deleteOrder(Sy:any, BS:any) {

  //  const marketPrice = this.getCurrent(Sy,BS);
 
   


    let obj = {
      Login: 108,
      accID: Number(localStorage.getItem('loginId')),
      Symbol: this.modelData.Sy,
      Ticket: Number(this.modelData.Ord),
      Lot: Number(this.inputLotValue),
      Price: BS,
      ordType: Number(this.modelData.BS),
      fillType: 0,
      Comment:(this.orderFrom.value.comment),
      PL:this.modelData.TP
    };
  
    this.share.sendCloseOrderbyData(obj);
    // this.closeOrderReq(obj)
  }
 


modefyOrder() {

    let obj = {
      Login: 106,
      accID: Number(localStorage.getItem('loginId')),
      Symbol: this.modelData.Sy,
      Ticket: !this.modelData.Pos && this.modelData.Pos !==0 ? this.modelData?.Ord : this.modelData.Pos,
      Lot:this.modelData.V/10000,
      Price: Number(this.orderFrom.value.price),
      SL:  Number(this.orderFrom.value.stopLoss),
      // SL:  Number(this.inputSl),
      PL:Number(this.orderFrom.value.takeProfit),
      ordType: Number(this.modelData.BS),
      StopLimit: Number(this.orderFrom.value.stopLimitPrice)||'',
      Expiry: "",
      ExpTime: "",
      Comment: ""

    };
  
    this.share.sendModefyData(obj)
  
  }
// Modifydisble(modify: any) {
//   let livePrice:any;
//   if(modify?.Ord){
//     // console.log("modelData?.Ord",modify);
//       this.share.allMarketLiveData$.subscribe((res: any) => {
//               livePrice = res.filter((item: any) => item?.oSymbolConfig?.Symbol === modify?.Sy);
//               livePrice = livePrice[0].oInitial?.Ask;
//       // console.log("dddaata[0]", livePrice[0].oInitial?.Ask);
//     // this.data = res
//     // console.log("marketliveSocket", res)
//   })
//   }
//   const stopLoss = this.orderFrom.controls['stopLoss'].value;
//   const takeProfit = this.orderFrom.controls['takeProfit'].value;
//   const price = this.orderFrom.controls['price'].value;
//   const condition = modify.BS;
//   const hasStopLoss = stopLoss > 0;
//   const hasTakeProfit = takeProfit > 0;
//   if(condition == 0) {
//   if (!hasStopLoss && !hasTakeProfit) return true;

//   // If only stopLoss filled, validate it
//   if (hasStopLoss && !hasTakeProfit) return stopLoss < price;

//   // If only takeProfit filled, validate it
//   if (!hasStopLoss && hasTakeProfit) return takeProfit > price;

//   // If both filled, both must be valid
//   return stopLoss < price && takeProfit > price;
// }
// if(condition == 1)
//   {
//    if (!hasStopLoss && !hasTakeProfit) return true;

//   // If only stopLoss filled, validate it
//   if (hasStopLoss && !hasTakeProfit) return stopLoss > price;

//   // If only takeProfit filled, validate it
//   if (!hasStopLoss && hasTakeProfit) return takeProfit < price;

//   // If both filled, both must be valid
//   return stopLoss > price && takeProfit < price;
// }
// if(condition == 2 || condition == 4 || condition == 6){
// if (!hasStopLoss && !hasTakeProfit) return true;

//   // If only stopLoss filled, validate it
//   if (hasStopLoss && !hasTakeProfit) return stopLoss < price;

//   // If only takeProfit filled, validate it
//   if (!hasStopLoss && hasTakeProfit) return takeProfit > price;

//   // If both filled, both must be valid
//   return stopLoss < price && takeProfit > price;
// }

// if(condition == 3 || condition == 5 || condition == 7){
// //   if (!hasStopLoss && !hasTakeProfit) return true;

// //   // If only stopLoss filled, validate it
// //   if (hasStopLoss && !hasTakeProfit) return stopLoss < price;

// //   // If only takeProfit filled, validate it
// //   if (!hasStopLoss && hasTakeProfit) return takeProfit > price;

// //   // If both filled, both must be valid
// //   return stopLoss < price && takeProfit > price;
//   return true;
// }
// return false;
// }
getCurrentMarketPriceAsk(symbol: string): number | undefined {
  const found = this.liveMarketData.find((item:any) => item?.oSymbolConfig?.Symbol === symbol);
  return found?.oInitial?.Ask;
}
getCurrentMarketPriceBid(symbol: string): number | undefined {
  const found = this.liveMarketData.find((item:any) => item?.oSymbolConfig?.Symbol === symbol);
  return found?.oInitial?.Bid;
}
Modifydisble(modify: any): boolean {
  // Get livePrice synchronously
  const BS = modify.BS;
 if (!modify) return false;
 let livePrice:any;
 if(BS==0||BS==2||BS==4||BS==6){
   livePrice = this.getCurrentMarketPriceBid(modify.Sy);
 }
 if(BS==1||BS==3||BS==5||BS==7){
   livePrice = this.getCurrentMarketPriceAsk(modify.Sy);
 }
  if (livePrice === undefined) {
    // Can't get price, disable button
    return false;
  }

 

  const stopLoss = Number(this.orderFrom.controls['stopLoss'].value) || 0;
  const takeProfit = Number(this.orderFrom.controls['takeProfit'].value) || 0;
  const price = Number(this.orderFrom.controls['price'].value) || 0;
  const stopLimitPrice = Number(this.orderFrom.controls['stopLimitPrice']?.value) || 0;

  

  // Utility checks: SL & TP either 0 or positive
  const hasSL = stopLoss > 0;
  const hasTP = takeProfit > 0;

  // --- Rules for Open positions (BS 0 and 1) ---
  if (BS === 0) { // Buy open
    if (!hasSL && !hasTP) return true;
    if (hasSL && !hasTP) return stopLoss < price;
    if (!hasSL && hasTP) return takeProfit > price;
    return stopLoss < price && takeProfit > price;
  }
  if (BS === 1) { // Sell open
    if (!hasSL && !hasTP) return true;
    if (hasSL && !hasTP) return stopLoss > price;
    if (!hasSL && hasTP) return takeProfit < price;
    return stopLoss > price && takeProfit < price;
  }

  // --- Rules for Pending Positions ---
 if (BS === 2) { // Buy Limit
  // P <= MP AND SL < P AND TP > P (SL & TP optional)
  if (price > livePrice) return false;             // P > MP disallowed
  if (hasSL && stopLoss >= price) return false;    // SL must be less than P
  if (hasTP && takeProfit <= price) return false;  // TP must be greater than P
  return true;
}

  if (BS === 3) { // Sell Limit
  // P >= MP AND SL > P AND TP < P (SL & TP optional)
  if (price < livePrice) return false;           // P < MP disallowed
  if (hasSL && stopLoss <= price) return false;  // SL must be > P
  if (hasTP && takeProfit >= price) return false;// TP must be < P
  return true;
}
  if (BS === 4) { // Buy Stop
    // P >= MP AND SL < P AND TP > P (SL & TP optional)
    if (price < livePrice) return false;
    if (hasSL && stopLoss >= price) return false;
    if (hasTP && takeProfit <= price) return false;
    return true;
  }

  if (BS === 5) { // Sell Stop
    // P <= MP AND SL > P AND TP < P
    if (price > livePrice) return false;
    if (hasSL && stopLoss <= price) return false;
    if (hasTP && takeProfit >= price) return false;
    return true;
  }

  if (BS === 6) { // Buy Stop Limit
    // P >= MP AND SLP < P AND SL < SLP AND TP > SLP
    if (price < livePrice) return false;
    if (stopLimitPrice === 0) return false; // stopLimitPrice mandatory here for logic
    if (stopLimitPrice >= price) return false;
    if (hasSL && stopLoss >= stopLimitPrice) return false;
    if (hasTP && takeProfit <= stopLimitPrice) return false;
    return true;
  }

  if (BS === 7) { // Sell Stop Limit
    // P <= MP AND SLP > P AND SL > SLP AND TP < SLP
    if (price > livePrice) return false;
    if (stopLimitPrice === 0) return false;
    if (stopLimitPrice <= price) return false;
    if (hasSL && stopLoss <= stopLimitPrice) return false;
    if (hasTP && takeProfit >= stopLimitPrice) return false;
    return true;
  }

  // Default disable for other BS types or unknown
  return false;
}

onLotInputChange() {
  if (this.inputLotValue < this.minLot) {
    this.inputLotValue = this.minLot;
  } else if (this.inputLotValue > this.MaxLot) {
    this.inputLotValue = this.MaxLot;
  }
}

addVol() {
  console.log("this.inputLotValue",this.inputLotValue);
  console.log("this.stepVol",this.stepVol);
  console.log("this.pricePrecision",this.pricePrecision);
  const newVal = +(this.inputLotValue + this.stepVol).toFixed(this.pricePrecision??2); // Fixed to 4 decimal to avoid floating point issues
  if (newVal <= this.MaxLot) {
    this.inputLotValue = newVal;
  }
}

SubVol() {
  const newVal = +(this.inputLotValue - this.stepVol).toFixed(this.pricePrecision??2);
  if (newVal >= this.minLot) {
    this.inputLotValue = newVal;
  }
}
formatPrice(value: number | null | undefined): string {
  if (value == null) return '';
  return value.toFixed(this.pricePrecision ?? 2);
}
}
