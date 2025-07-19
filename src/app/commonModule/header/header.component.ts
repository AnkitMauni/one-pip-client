import { Component,Input } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { NgbDropdownModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { ShareService } from 'src/app/services/share.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  
	
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  collapsed = true;
  openDemoAccountForm!:FormGroup
  connectAccountForm!:FormGroup
  orderFrom!:FormGroup
    libuysellTab: any = "tab1"
  @Input()shareInputNav=0
  private element:any= HTMLElement;
  connectionStatus: any;
  Blance:any=0.000
  loginForm!:FormGroup
  private dashboardRoute: string = '/dashboard';
  private previousUrl:any;
  id:any
  accountList:any =[]
  accountActiveList:any =[]
  accountUnActiList:any =[]
  step: any = 0
  qoutes:any 
  trades:any
  passForm:any= FormGroup
  private socket: any = WebSocketSubject;
  bufferArray: any = Uint8Array;
  dropdownOptions: { label: string, value: number }[] = [];
  subscribedSymbols:any
  constructor(private toaster: ToastrService,private fb: FormBuilder,private share:ShareService ,private location: Location,private modalService: NgbModal, config: NgbModalConfig,private global: GlobalService,private router: Router, private api:GlobalService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';

   this.id = localStorage.getItem('loginId')
   
   config.backdrop = 'static';
		config.keyboard = false;
    // this.changeSymbolData()
    this.share.changeSym$.subscribe((res:any)=>{
      console.log(" symbol ress",res);
      if(res == 'NoData'){
        const sym = 'AUDUSD.c_5200'
        this.getInitial(sym)
        this.changeSymbolData(sym)
      }
      else{
        localStorage.setItem('changeSym',res)
        const sym = res
        console.log("sym",sym);
        localStorage.getItem('changeSym')
        this.changeSymbolData(sym)
         this.getInitial(sym)
      }
    
    })

    this.share.liveBalance$.subscribe((res:any)=>{
 
      this.Blance = res
    })


     this.share.orderFlags$.subscribe((flags: number[]) => {
    this.buildDropdownOptions(flags);
  });

  this.share.getSymbols$.subscribe((res:any)=>{
    this.subscribedSymbols = res
    console.log("subscribedSymbols",this.subscribedSymbols)
    this.convertSymbolsToMenuTree(this.subscribedSymbols)
  })
    this.accountList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
    this.accountActiveList=  this.accountList.filter((list:any) => list.account === Number(localStorage.getItem('loginId')))
console.log("this.accountActiveListthis.accountActiveListthis.accountActiveList",this.accountActiveList);
this.share.sharedData$.subscribe((data:any) => {
  if (data) {
   console.log("dataa",data);
  //  this.qoutes =(data.Sock_Quote).replace(/\\/g, "//")
   this.trades =(data.Sock_Trade).replace(/\\/g, "//")
   
  }
  else{
   
    // const storedQuote = localStorage.getItem('Sock_Quote');
    // this.qoutes = storedQuote ? storedQuote.replace(/\\/g, "//") : "";
    // console.log(this.qoutes);
    
    const storedTrade = localStorage.getItem('Sock_Trade');
    this.trades = storedTrade ? storedTrade.replace(/\\/g, "//") : "";
    console.log("this.trades0",this.trades);
  }
});

this.socket = new WebSocket(`${this.trades}`); 

this.socket.onmessage = this.handleMessage.bind(this);
this.socket.onerror = this.handleError.bind(this);

let obj = {
  id: 100,
  Account:Number(localStorage.getItem('loginId')),
  Key: 201001,


}

setTimeout(() => {
  this.login1(obj)
  // this.get_Mk()
  // this.GET_USER_ALL_SYMBOLS_v2()
}, 3000);
this.

share.closeOrderbySocket$.subscribe((data:any) => {
  if(!data){
    console.log('Received Data:', null);
  }
  else{
    console.log('Received Data:', data);
    this.sendingCloseOr(data)
  }

});

share.sendModefy$.subscribe((data:any) => {
  if(!data){
    console.log('Received Data:', null);
  }
  else{
    console.log('Received Data:', data);
    this.sendingModefyOr(data)
  }

});
  }

  toggleSideNav(): void {
    this.global.toggleSidenav();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
   
    if (this.element) {
      // this.renderer.listen(this.element, 'contextmenu',null);
    }
  }
symbolMenu: any[] = [];
menu2: any;
// subscribedSymbols: any[] = [];
selectedNode2: any;
isDropdownOpen2 = false;
isReadonly = true;
index = 0;
expand2: { [key: number]: boolean } = {};

convertSymbolsToMenuTree(lstSymbols: any[]) {
  const grouped: { [key: string]: any[] } = {};

  lstSymbols.forEach(symbol => {
    const group = symbol.oSymbolConfig.Secu || 'OTHERS';
    if (!grouped[group]) grouped[group] = [];

    grouped[group].push({
      title: `${symbol.oSymbolConfig.Symbol}, ${symbol.oSymbolConfig.Info}`,
      thumb: symbol.oSymbolConfig.Icon,
      scripCode: symbol.oSymbolConfig.ScripCode,
      path: symbol.oSymbolConfig.Symbol,
      icon: '',
      submenu: []
    });
  });

  const menuTree: any[] = [];

  for (const group in grouped) {
    const node = {
      title: group,
      thumb: 'assets/images/sideimg/mt-icons22.png',
      icon: '',
      path: group,
      submenu: grouped[group].map(this.toNode.bind(this))
    };
    menuTree.push(this.toNode(node));
  }

  this.symbolMenu = menuTree;
  this.menu2 = this.symbolMenu;
  const currentSymbol = localStorage.getItem('changeSym') || 'AUDUSD.c_5200';
const selected = this.findSymbolNode(currentSymbol);
if (selected) {
  this.selectedNode2 = selected;
  this.symShow = selected.scripCode;
}
}
findSymbolNode(symbolCode: string): any {
  const search = (nodes: any[]): any => {
    for (const node of nodes) {
      if (node.scripCode === symbolCode) return node;
      if (node.submenu?.length) {
        const found = search(node.submenu);
        if (found) return found;
      }
    }
    return null;
  };

  return search(this.menu2 || []);
}

private toNode(node: any): any {
  const copy = { ...node, index: ++this.index };
  if (copy.submenu && copy.submenu.length) {
    this.expand2[copy.index] = false; // Initialize as collapsed
    copy.submenu = copy.submenu.map((sub: any) => this.toNode(sub));
  }
  return copy;
}

toggleDropdown2() {
  this.isDropdownOpen2 = !this.isDropdownOpen2;
}

toggleVisible2(node: any) {
  if (node.submenu?.length) {
    this.expand2[node.index] = !this.expand2[node.index];
  }
}

selectNode2(node: any) {
  this.selectedNode2 = node;
  this.symShow = node.scripCode;

  localStorage.setItem('changeSym', node.scripCode); // persist
  // this.share.changeSym$.next(node.scripCode);        // notify others if needed

  this.toggleDropdown2();
  this.getSymInfo(node.scripCode);  
    this.getInitial(node.scripCode);                 // fetch new chart data
}
getSymInfo(val: any) {
  this.selectedRowIndex = null;
  this.filterSymbols(val?.path || val);
}
filterSymbols(filterValue: string) {
  // If the structure is flat now (each item is a symbol)
  const symbolMatch = this.subscribedSymbols.find(
    (symbol: any) => symbol.oSymbolConfig?.Symbol === filterValue
  );

  if (symbolMatch) {
    console.log("symbolMatch", [symbolMatch]);
    this.subscribedSymbols = [symbolMatch];  // if you want to show only the matched one
    return { lstSymbols: [symbolMatch] };
  }

  return { lstSymbols: [] };
}

getInitial(val:any) {
  let obj = {
    "Key": "",
    "Symbol": val,
  };

  this.api.GET_SYMBOL_INITIAL(obj).subscribe({
    next: (res: any) => {
      console.log("Ress", res);
      if (res?.ordFlag) {
        this.share.setOrderFlags(res.ordFlag);
      }
    },
    error: (err: any) => {
      console.log(err);
    },
  });
}
buildDropdownOptions(flags: number[]) {
  const options = [];

  if (flags.includes(1)) {
    options.push({ label: 'Market Execution', value: 0 }); // Always mapped to 0
  }

  if (flags.includes(2)) {
    options.push({ label: 'Buy Limit', value: 2 });
    options.push({ label: 'Sell Limit', value: 3 });
  }

  if (flags.includes(4)) {
    options.push({ label: 'Buy Stop', value: 4 });
    options.push({ label: 'Sell Stop', value: 5 });
  }

  if (flags.includes(8)) {
    options.push({ label: 'Buy Stop Limit', value: 6 });
    options.push({ label: 'Sell Stop Limit', value: 7 });
  }

  this.dropdownOptions = options;
}
  private handleMessage(event: MessageEvent) {
    const blobData: Blob = event.data;

    const reader = new FileReader();

    reader.onload = () => {
      const binaryData: ArrayBuffer | null = reader.result as ArrayBuffer;

      if (binaryData) {
        const uint8ArrayData = new Uint8Array(binaryData);
        // console.log('Received binary data:', uint8ArrayData);
        // this.orderCancelRespDecrypt(uint8ArrayData)
        if (this.step == 0) {
          this.decodeLogin1(uint8ArrayData)
        }
        else if(this.step == 1){
          this.orderRes(uint8ArrayData)
          // this.errorRes(uint8ArrayData)
        }
        else if(this.step == 3){
          this.closeOrderRes(uint8ArrayData)
          // this.errorRes(uint8ArrayData)
        }
        else if(this.step == 4){
          this.ModifyRes(uint8ArrayData)
          // this.errorRes(uint8ArrayData)
        }
        
         else{
          this.errorRes(uint8ArrayData)
         } 



        // 
        // Process binary data as needed, assuming it's a valid JSON object
        try {
          const jsonData = JSON.parse(this.bytesToAscii(uint8ArrayData));

          console.log('Received data as JSON:', jsonData);

          // Now you have the JSON object and can use it as needed
        } catch (error) {
          // console.error('Failed to parse binary data as JSON:', error);
        }
      } else {
        console.error('Failed to read binary data from Blob.');
      }
    };

    reader.readAsArrayBuffer(blobData);
  }
  private handleError(event: Event) {
    console.error('WebSocket error:', event);
  }
  jsonBytes: any = []
  private bytesToAscii(bytes: Uint8Array): string {
    // Convert binary data to ASCII representation
    return String.fromCharCode(...bytes);
  }

  connection: any
  handleClose(event: Event) {
    console.log('Connection Market closed:', event);
    // You can add your logic here to handle the connection loss
    if (event.type == 'close') {
      this.connection = false
    }
    else {
      this.connection = true
    }
  }

  closed(){
    this.socket.close()
  }

  decodeLogin1(byteArray: Uint8Array): any {
    const view = new DataView(byteArray.buffer);




    const id = view.getUint16(0, true); // Assuming ID is 2 bytes
    const loginId = view.getUint32(2, true); // Assuming LoginID is 8 bytes
    const key = view.getUint32(10, true); // Assuming Key is 4 bytes
    const Resp_Code = view.getUint16(14, true); // Assuming Resp_Code is 2 bytes
    const timestamp = (view as any).getBigUint64(16, true);


    // Create an object with the original data
    const originalData = {
      ID: id,
      LoginID: loginId,
      Key: key,
      Resp_Code: Resp_Code,
      Timestamp: Number(timestamp)
    };
    
    this.step = 1

    console.log("Deocde..... trade", originalData)
    return originalData;
  }

  formatTimeString(timeString: string): string {
    // Split the time string into hours, minutes, and seconds
    const timeParts = timeString.split(':');
    if (timeParts.length !== 3) {
      // console.error('Invalid time string format:', timeString);
      return '00:00:00'; // Or any default value you prefer
    }

    const [hours, minutes, seconds] = timeParts;

    // Return the formatted time string
    const valueData = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    return valueData;
  }

  refresh(val:any){

    location.reload()
  }
  
  login1(obj: any) {

    this.step = 0
    this.jsonBytes = []
    this.jsonBytes = this.convertLogin(obj);



    this.bufferArray = new Uint8Array(this.jsonBytes);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Convert the hexadecimal string to bytes before sending
      // const byteArray = this.hexToBytes(data);

      console.log("this.jsonBytes1111", this.jsonBytes)

      this.socket.send(this.bufferArray);
      console.log("this.jsonBytes", this.jsonBytes.buffer,"this.bufferArray" ,this.bufferArray)

    } else {
      console.error('WebSocket connection is not open.');
    }

  }


  result1: any = []
  convertLogin(obj: any): Uint8Array {
    const buffer = new ArrayBuffer(14); // Total byte length based on your specified lengths
    const view = new DataView(buffer);

    // Set values in the buffer
    view.setUint16(0, obj.id, true); // 2 bytes for id
    view.setUint32(2, obj.Key, true); // 4 bytes for Key
    view.setUint32(6, obj.Account, true); // 8 bytes for Account
    // view.setBigUint64(6, BigInt(obj.Account), true); // 8 bytes for Account
    // view.setBigUint64(10, BigInt(obj.Account), true); // 8 bytes for Account
    const result = new Uint8Array(buffer);
   console.log("login req", obj, result);
    return result;
  }


  ngOnInit(){
    console.log(" this.shareInputNav",this.shareInputNav);
    this.loginForm = this.fb.group({
      ac:[''],
      pass:['']
    })
 this.passForm = this.fb.group({
  
      pass:['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!*\-?&^])[A-Za-z\d@#$%!*\-?&^]{8,}$/)
    // One uppercase, one lowercase, one digit, one special char
  ]]
    })
    this.createForm();
    this.onDepositChange()
    this.onLeverageChange()

    this.orderFrom = this.fb.group({
      // volume: [''],  
      price:[''] ,   // Control for the Volume input
      stopLoss: [''],    // Control for the Stop Loss input
      takeProfit: [''],  // Control for the Take Profit input
      comment: ['']      // Control for the Comment input
    });
  
this.NaviGteMargin("Margin")
this.NaviGteMargin("Queue")
this.share.shareNavigateHight(this.shareInputNav)
  }
  closePassForm(){
   this.modref1.close() 
   this.passForm.reset()
  }
changePass(){
  const password = this.passForm.get('pass')?.value;
    const account = Number(localStorage.getItem('loginId')); // or use your value

    const payload = {
      Account: account,
      Password: password
    };
this.api.MAKE_CHANGE_PASSWORD(payload)
      .subscribe({
        next: (res: any) => {
          console.log("Password changed successfully:", res);
         
           this.toaster.success("Password changed successfully!", "Success");
          this.closeModel();
        },
        error: (err:any) => {
          console.error("Password change failed:", err);
          this.toaster.error("Failed to change password.", "Failed!");
        }
      });
}
  toggleConnection(ajsd:any) {

    if (this.connectionStatus === 'Connect') {
      this.connectionStatus = 'Disconnect';
      localStorage.setItem('status', 'Connect');
      this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
    
     
    } else {
      this.connectionStatus = 'Connect';
      localStorage.setItem('status', 'Disconnect');
    
      this.router.navigate(['/dashboard']).then(() => {
        this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
        window.location.reload()
      });
      this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
     
    
    }
  }

  
logout(){
  localStorage.removeItem('loginId');
  this.router.navigate(['/login']).then(() => {
    window.location.reload();
  });
}


  
 
  inputText: string = '';
  dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3'];


  active = 1;

  modref:any
  openXl(content: any) {
    this.orderty1 = 0
  this.navGateUrl()

    this.modref= this.modalService.open(content, { size: 'lg modalone', centered: true });
  }
  modref1:any
    openXl3(content: any) {
    this.orderty1 = 0
 

    this.modref1= this.modalService.open(content, { size: 'md modalone', centered: true });
  }

  data:any=[]
  changeAskBid:any =[]
  currentPri:any 
  changeSymbolData(val:any){
  
    
    this.share.allMarketLiveData$.subscribe((res: any) => {
      // console.log("allMarketLiveData",res);
      this.data = res.filter((item: any) => item?.oSymbolConfig?.Symbol === val);
      this.currentPri = this.data[0]?.oInitial?.Ask
      localStorage.setItem('changeSym',this.data[0]?.oSymbolConfig?.Symbol)
    })

     
    // localStorage.setItem('Ask',this.data.oInitial.Ask)
    //   localStorage.setItem('Bid',this.data.oInitial.Bid)
  
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
//   let obj ={
//     "Login": Number(localStorage.getItem('loginId')),
//     "Symbol": localStorage.getItem('changeSym'),
//     "Lot": Number(this.inputLotValue),
//     "Price":Number(price),
//     "SL":Number(this.orderFrom.value.stopLoss),
//     "PL":Number(this.orderFrom.value.takeProfit),
//     "ordType":val,               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
//     "fillType":1,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
//     "trdType":3,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
//     //"StopLimit":185.890,
//     "Expiry": 0,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
//     "ExpTime":this.timeStamp,
//     "Comment":(this.orderFrom.value.comment)
// }
console.log("localStorage.getItem('changeSym')",localStorage.getItem('changeSym'));

let obj = {
  Login: 105,
  accID:Number(localStorage.getItem('loginId')),
  Symbol: localStorage.getItem('changeSym'),
  Lot:  Number(this.inputLotValue),
  Price: Number(price),
  SL: Number(this.orderFrom.value.stopLoss),
  PL: 0,
  ordType: val, 
  fillType: 1,
  trdType: 3,
   StopLimit: "",
   Expiry: "",
   ExpTime: "",
  Comment: ""
};

this.sendOrder1(obj)
console.log("New order ",obj);

// this.global.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
//   this.orderResData= res
 
//   this.share.active(1)
//   if(this.orderResData.ERR_MSG == ""){
//     this.showMassage = 2
//     this.showErroMass =1
//   }
//   else   if(this.orderResData.ERR_MSG != ""){
//     this.showMassage = 2
//     this.showErroMass =2
//   }
//   else{
//     this.showMassage = 1
//     this.showErroMass =1
//   }


// },error:(err:any)=>{
//   console.log(err);
  
// }})
}

okReturn(){
  this.showErroMass =1
  this.showMassage = 1
  this.share.active(1)
}

//Ordersss
sendOrder1(obj:any) {
  console.log(obj);

   this.step = 1
   this.jsonBytes = []
   this.jsonBytes = this.sendNewOrder(obj);


 
   this.bufferArray = new Uint8Array(this.jsonBytes);
   if (this.socket && this.socket.readyState === WebSocket.OPEN) {
     // Convert the hexadecimal string to bytes before sending
     // const byteArray = this.hexToBytes(data);
   
     console.log("this.jsonBytes1111", this.jsonBytes)
     this.socket.send(this.bufferArray);
     console.log("Buffer as Array:", Array.from(this.bufferArray));
     console.log("this.jsonBytes", this.jsonBytes.buffer)

   } else {
     console.error('WebSocket connection is not open.');
   }




 }


sendNewOrder(obj:any) {
    
    
  const buffer = new ArrayBuffer(102); // Total byte length based on specified lengths
  const view = new DataView(buffer);
  view.setUint16(0, obj.Login, true);
  // (view as any).setBigUint64(2, BigInt(obj.accID), true); // 8 bytes for LoginID
  view.setUint32(2, obj.accID, true);
  const symbolBytes = new TextEncoder().encode(obj.Symbol);
  for (let i = 0; i < symbolBytes.length && i < 15; i++) {
      view.setUint8(10 + i, symbolBytes[i]); // Symbol field limited to 15 bytes
  }

  view.setFloat64(25, obj.Lot, true); // 8 bytes for Lot
  view.setFloat64(33, obj.Price, true); // 8 bytes for Price
  view.setFloat64(41, obj.SL, true); // 8 bytes for SL
  view.setFloat64(49, obj.PL, true); // 8 bytes for PL

  view.setUint16(57, obj.ordType, true); // 2 bytes for ordType


  view.setUint16(59, obj.fillType, true); // 2 bytes for fillType

  view.setUint16(61, obj.trdType, true); // 2 bytes for trdType (parsed as integer)

  view.setFloat64(63, obj.StopLimit, true); // 8 bytes for StopLimit


  view.setUint16(71, obj.Expiry, true); // 2 bytes for Expiry

  view.setUint32(73, obj.ExpTime, true); // 8 bytes for ExpTime

  // Convert Comment string to an array of UTF-8 encoded bytes
  const commentBytes = new TextEncoder().encode(obj.Comment);
  for (let i = 0; i < commentBytes.length && i < 20; i++) {
      view.setUint8(81 + i, commentBytes[i]); // Comment field limited to 20 bytes
  }
      // Return the result as Uint8Array
      const result = new Uint8Array(buffer);
      console.log("order req", obj, result);

     
      this.step = 1
      return result;
}


orderRes(byteArray: Uint8Array): any {
    localStorage.setItem('trade_Blance','')
    localStorage.setItem('trade_Margin','')
    localStorage.setItem('trade_FreeMargin','')
    const view = new DataView(byteArray.buffer);

    const MsgID = view.getUint16(0, true); // 2 bytes for MsgID
    if(MsgID == 302){
    const Login = Number((view as any).getBigUint64(2, true)); // Convert BigInt to number for Login
      const Ticket = Number((view as any).getBigUint64(10, true)); // Convert BigInt to number for Ticket
      const Lot = view.getFloat64(18, true); // 8 bytes for Lot
      const Price = view.getFloat64(26, true); // 8 bytes for Price
      const SL = view.getFloat64(34, true); // 8 bytes for SL
      const TL = view.getFloat64(42, true); // 8 bytes for TL
      const oBuySell = view.getUint16(50, true); // 2 bytes for oBuySell
      const State = view.getUint16(52, true); // 2 bytes for State
      const Update = view.getInt16(54, true); // 2 bytes for Update
      const Timestamp = Number((view as any).getBigUint64(56, true)); //8 bytes Convert BigInt to number for Timestamp
      const Balance  = view.getFloat64(64, true); // 8 bytes for Margin
      const Margin= view.getFloat64(72, true); // 8 bytes for FreeMargin
      const FreeMargin  = view.getFloat64(80, true); // 8 bytes for Balance
   
      // Decode Symbol
      let symbolBytes = [];
      for (let i = 0; i < 15; i++) {
          const byte = view.getUint8(88 + i);
          if (byte === 0) {
              break; // Stop if null character is encountered
          }
          symbolBytes.push(byte);
      }
      const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes)); // 15 bytes for Symbol
      localStorage.setItem('trade_Blance',`${Balance}`)
      localStorage.setItem('trade_Margin',`${Margin}`)
      localStorage.setItem('trade_FreeMargin',`${FreeMargin}`)
      // Returning the decoded object
      const obj = {
          MsgID:MsgID,
          Login:Login,
          Ticket:Ticket,
          Price:Number(Lot),
          Lot:(Number(Price)).toFixed(this.countDecimalDigits(0.01)),
          SL:SL,
          TL:TL,
          oBuySell:oBuySell,
          State:State,
          Update:Update,
          Timestamp:Timestamp,
          Symbol:Symbol,
          // Blance :Balance ,// 8 bytes for Price
          // Margin : Margin,  //8 bytes for SL
          // FreeMargin : FreeMargin, // 8 bytes for TL
          // PLCalPrice:this.CheckP
      };
   console.log("order res", obj);
         if(obj.oBuySell == 0 ||obj.oBuySell == 1 ){
        this.share.addPositon(obj)
      this.orderResData = obj
    this.showMassage = 2
    this.showErroMass =1
      //   this.redirect(obj)
        
      }
      else{
        this.share.addPositon(obj)
        this.getStatusActivity(obj)
        this.orderResData = obj
        this.showMassage = 2
        this.showErroMass =1
        // this.redirect(obj)
      }
    


    }
   else if (MsgID == 301){
   const Login = Number((view as any).getBigUint64(2, true)); // 8 bytes Convert BigInt to number for Login
      const Ticket = Number((view as any).getBigUint64(10, true));// 8 bytes Convert BigInt to number for Ticket
     // Extract Symbol (up to 15 characters, starting at byte 18, stopping at null character)
  let symbolBytes = [];
  for (let i = 0; i < 15; i++) {
      const byte = view.getUint8(18 + i); // Symbol starts at byte 18
      if (byte === 0) break; // Stop if null character is encountered
      symbolBytes.push(byte);
  }
  const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes));

  // Extract Comment (up to 20 characters, starting at byte 33)
  let commentBytes = [];
  for (let i = 0; i < 20; i++) {
      const byte = view.getUint8(33 + i); // Comment starts after Symbol (byte 33)
      if (byte === 0) break; // Stop if null character is encountered
      commentBytes.push(byte);
  }
  const Comment = new TextDecoder().decode(new Uint8Array(commentBytes));

  // Extract ERR_MSG (up to 50 characters, starting at byte 53)
  let errorMsgBytes = [];
  for (let i = 0; i < 50; i++) {
      const byte = view.getUint8(53 + i); // ERR_MSG starts after Comment (byte 53)
      if (byte === 0) break; // Stop if null character is encountered
      errorMsgBytes.push(byte);
  }
  const ERR_MSG = new TextDecoder().decode(new Uint8Array(errorMsgBytes));

  // Create object with parsed values
  const obj = {
      MsgID,
      Login,
      Ticket,
      Symbol,
      Comment,
      ERR_MSG,
  };

  console.log("rejecttt",obj);
   this.orderResData = obj
    this.showMassage = 2
    this.showErroMass =2

   }


}

timepa:any

closeOrderRes(byteArray: Uint8Array): any {
      
          const view = new DataView(byteArray.buffer);

          const MsgID = view.getUint16(0, true); // 2 bytes for MsgID
          if(MsgID == 124){
            const Login = Number((view as any).getBigUint64(2, true)); // 8 bytes for Login
            const Ticket = Number((view as any).getBigUint64(10, true)); // 8 bytes for Ticket
            const Lot = view.getFloat64(18, true); // 8 bytes for Lot
            
            // Extract Symbol (15 bytes, starting at byte 26)
            let symbolBytes = [];
            for (let i = 0; i < 15; i++) {
                const byte = view.getUint8(26 + i);
                if (byte === 0) break; // Stop at null character
                symbolBytes.push(byte);
            }
            const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes));
            
            // Extract Comment (20 bytes, starting at byte 41)
            let commentBytes = [];
            for (let i = 0; i < 20; i++) {
                const byte = view.getUint8(41 + i);
                if (byte === 0) break; // Stop at null character
                commentBytes.push(byte);
            }
            const Comment = new TextDecoder().decode(new Uint8Array(commentBytes));
            
            // Extract ERR_MSG (50 bytes, starting at byte 61)
            let errorMsgBytes = [];
            for (let i = 0; i < 50; i++) {
                const byte = view.getUint8(61 + i);
                if (byte === 0) break; // Stop at null character
                errorMsgBytes.push(byte);
            }
            const ERR_MSG = new TextDecoder().decode(new Uint8Array(errorMsgBytes));
            let obj ={ 
              MsgID:MsgID, 
              Login:Login,
              Ticket:Ticket, 
              Lot:Lot,
              Symbol:Symbol, 
              Comment:Comment,
              ERR_MSG:ERR_MSG

            }
            console.log({ MsgID, Login, Ticket, Lot, Symbol, Comment, ERR_MSG });
         this.step = 3;
         console.log("order res", obj);
            
              this.share.addPositon(obj)
              this.getStatusActivityClose(obj)
              this.share.msgForClientToModifyData(obj)
              // this.orderResData = obj
              // this.showMassage = 2
              // this.showErroMass =1
              // this.redirect(obj)
         
      
      
          }
         else if (MsgID == 301){
         const Login = Number((view as any).getBigUint64(2, true)); // 8 bytes Convert BigInt to number for Login
            const Ticket = Number((view as any).getBigUint64(10, true));// 8 bytes Convert BigInt to number for Ticket
           // Extract Symbol (up to 15 characters, starting at byte 18, stopping at null character)
        let symbolBytes = [];
        for (let i = 0; i < 15; i++) {
            const byte = view.getUint8(18 + i); // Symbol starts at byte 18
            if (byte === 0) break; // Stop if null character is encountered
            symbolBytes.push(byte);
        }
        const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes));
      
        // Extract Comment (up to 20 characters, starting at byte 33)
        let commentBytes = [];
        for (let i = 0; i < 20; i++) {
            const byte = view.getUint8(33 + i); // Comment starts after Symbol (byte 33)
            if (byte === 0) break; // Stop if null character is encountered
            commentBytes.push(byte);
        }
        const Comment = new TextDecoder().decode(new Uint8Array(commentBytes));
      
        // Extract ERR_MSG (up to 50 characters, starting at byte 53)
        let errorMsgBytes = [];
        for (let i = 0; i < 50; i++) {
            const byte = view.getUint8(53 + i); // ERR_MSG starts after Comment (byte 53)
            if (byte === 0) break; // Stop if null character is encountered
            errorMsgBytes.push(byte);
        }
        const ERR_MSG = new TextDecoder().decode(new Uint8Array(errorMsgBytes));
      
        // Create object with parsed values
        const obj = {
            MsgID,
            Login,
            Ticket,
            Symbol,
            Comment,
            ERR_MSG,
        };
      
        console.log("rejecttt",obj);
        this.share.msgForClientToModifyData(obj)
         this.orderResData = obj
          this.showMassage = 2
          this.showErroMass =2
    
         }
      
    
      }
      

errorRes(byteArray: Uint8Array): any {
  const view = new DataView(byteArray.buffer);

  const MsgID = view.getUint16(0, true); // 2 bytes for MsgID
  const Login = Number((view as any).getBigUint64(2, true)); // Convert BigInt to number for Login
  const Ticket = Number((view as any).getBigUint64(10, true)); 
  const Price = view.getFloat64(18, true); // 8 bytes for Price
  const Lot = view.getFloat64(26, true); // 8 bytes for Lot
  const State = view.getUint16(34, true); // 2 bytes for State
  const Update = view.getUint16(36, true); // 2 bytes for Update
  const SL = view.getFloat64(38, true); // 8 bytes for SL
  const TP = view.getFloat64(46, true); // 8 bytes for TP
  
  this.step = 3;
  
  const obj1 = {
      MsgID: MsgID,
      Login: Login,
      Ticket: Ticket,
      Price: Price,
      Lot: Lot,
      State: State,
      Update: Update,
      SL: SL.toFixed(5),
      TP: TP,
      ModifyType: "modify",
      TypeOfOration: "Modify position"
  };
 
  
  // Returning the decoded object
  const obj = {
      MsgID: MsgID,
      Login: Login,
      Ticket: Ticket,
      Price: Price,
      Lot: Lot,
      State: State,
      Update: Update,
      SL: SL.toFixed(5),
      TP: TP
  };
  
  console.log("order res", obj);
  
   return obj;
}

  
MAKE_NEW_ORDER(val:any){
 
let obj = {
  Login: 105,
  accID: Number(localStorage.getItem('loginId')),
  Symbol: localStorage.getItem('changeSym'),
  Lot: Number(this.inputLotValue),
  Price: Number(this.orderFrom.value.price),
  SL:  Number(this.orderFrom.value.stopLoss),
  // SL:  Number(this.inputSl),
  PL: Number(this.orderFrom.value.takeProfit),
  ordType: val,
  fillType: 1,
  trdType: 2,
  StopLimit: "",
  Expiry: "",
  ExpTime: "",
  Comment: ""
};
console.log("New order ",obj);
this.sendOrder1(obj)

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

  SubSl(val:any){
    if(val == ""){
     
       this.currVal =val
     }

     this.currVal = (parseFloat(val) - 1/Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
     this.orderFrom.patchValue({
      stopLoss : this.currVal
  })
  
    }

    inputSl: any = 0; // Initialize to prevent undefined errors

    addSll(val: any) {
      if (!val) {
        val = this.currentPri || 0; // Ensure default value
      }
    
      const numberAsString = val.toString();
      const decimalIndex = numberAsString.indexOf('.');
      const decimalPartLength = decimalIndex === -1 ? 0 : numberAsString.length - decimalIndex - 1;
    
      this.inputSl = (parseFloat(val) + 1 / Math.pow(10, decimalPartLength)).toFixed(this.countDecimalDigits(val));
    
      this.orderFrom.patchValue({
        stopLoss: this.inputSl
      });
    }
    
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
    
  currVTP:any 
  addTP(val:any){
  
   if(val == ""){
    val = this.inputTPP
   }

   this.inputTPP = (parseFloat(val) + 1/Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));


  this.orderFrom.patchValue({
    takeProfit : this.inputTPP
})
   
  }

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
   addValues(val1: number): number {
    return val1 + this.currVal;
  }

  addPricee(val: any) {
    if (!val) {
      val = this.currentAddP || 0; // Ensure default value
    }
  
    const numberAsString = val.toString();
    const decimalIndex = numberAsString.indexOf('.');
    const decimalPartLength = decimalIndex === -1 ? 0 : numberAsString.length - decimalIndex - 1;
  
    this.currentAddP = (parseFloat(val) + 1 / Math.pow(10, decimalPartLength)).toFixed(this.countDecimalDigits(val));
    
    this.orderFrom.patchValue({
      price: this.currentAddP
    });
  }
  
  subPricee(val: any) {
    if (!val) {
      val = this.currentAddP || 0; // Ensure default value
    }
  
    let newSL = (parseFloat(val) - 1 / Math.pow(10, this.countDecimalDigits(val))).toFixed(this.countDecimalDigits(val));
  
    // **Prevent negative stop loss**
    if (parseFloat(newSL) < 0) {
      newSL = '0';
    }
  
    this.currentAddP = newSL;
  
    this.orderFrom.patchValue({
      price: this.currentAddP
    });
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
isPlaceButtonDisabled(): boolean {
  const orderType = Number(this.orderty1); // 2 = Buy Limit, 3 = Sell Limit
  const price = parseFloat(this.orderFrom.get('price')?.value || '0');
  const sl = parseFloat(this.orderFrom.get('stopLoss')?.value || '0');
  const tp = parseFloat(this.orderFrom.get('takeProfit')?.value || '0');

  const slFilled = this.orderFrom.get('stopLoss')?.value !== '';
  const tpFilled = this.orderFrom.get('takeProfit')?.value !== '';

  let marketPrice = 0;
  if (orderType === 2) {
    marketPrice = parseFloat(this.data[0]?.oInitial?.Ask || '0'); // Buy Limit uses Ask
  } else if (orderType === 3) {
    marketPrice = parseFloat(this.data[0]?.oInitial?.Bid || '0'); // Sell Limit uses Bid
  }

  if (!price || !marketPrice) return true;

  // ? BUY LIMIT CONDITIONS
  if (orderType === 2) {
    // Basic Price Validation
    if (price > marketPrice) return true;

    // If both SL and TP are empty, allow placing (only price condition is required)
    if (!slFilled && !tpFilled) return false;

    // SL must be less than price
    if (slFilled && sl >= price) return true;

    // TP must be greater than price
    if (tpFilled && tp <= price) return true;

    return false; // ? All Buy Limit conditions passed
  }

  // ? SELL LIMIT CONDITIONS
  if (orderType === 3) {
    // Price must be >= market price
    if (price < marketPrice) return true;

    // If both SL and TP are empty, allow placing (only price condition is required)
    if (!slFilled && !tpFilled) return false;

    // SL must be >= price
    if (slFilled && sl < price) return true;

    // TP must be <= price
    if (tpFilled && tp > price) return true;

    // ? TP must also not exceed market price
    if (tpFilled && tp > marketPrice) return true;

    // ? SL is valid, but TP is still too high
    if (slFilled && sl > price && tpFilled && tp > price) return true;

    // ? All Sell Limit conditions passed
    return false;
  }
 // ? Buy Stop
  if (orderType === 4) {
    if (price <= marketPrice) return true; // Price should be greater

    // If both empty
    if (!slFilled && !tpFilled) return false;

    // If only SL filled
    if (slFilled && !tpFilled) {
      if (sl > price) return true;
      return false;
    }

    // If only TP filled
    if (tpFilled && !slFilled) {
      if (tp < price) return true;
      return false;
    }

    // If both filled
    if (slFilled && tpFilled) {
      if (sl > price || tp < price) return true;
      return false;
    }

    return false;
  }
  // ? SELL STOP CONDITIONS
if (orderType === 5) {
  if (price >= marketPrice) return true; // Price should be less than market price

  // Both SL and TP cannot be filled together (config restriction)
  if (slFilled && tpFilled) return true;

  // If SL is filled: it should be greater than the price
  if (slFilled && sl <= price) return true;

  // If TP is filled: it should be less than the price
  if (tpFilled && tp >= price) return true;

  return false; // ? All Sell Stop conditions passed
}
// ? BUY STOP LIMIT CONDITIONS
if (orderType === 6) {
  const stopLimitPrice = parseFloat(this.orderFrom.get('stopLimitPrice')?.value || '0');
  const lot = parseFloat(this.orderFrom.get('lotSize')?.value || '0');

  if (!price || !stopLimitPrice || !lot || lot <= 0 || price <= marketPrice) return true;

  // Only one of price or stopLimitPrice filled
  if ((price && !stopLimitPrice) || (!price && stopLimitPrice)) return true;

  // Stop limit price must be less than price
  if (stopLimitPrice >= price) return true;

  // SL > stopLimitPrice => invalid
  if (slFilled && sl > stopLimitPrice) return true;

  // SL < 0 or unreasonable
  if (slFilled && sl <= 0) return true;

  // TP < stopLimitPrice => invalid
  if (tpFilled && tp < stopLimitPrice) return true;

  // TP < 0 or unreasonable
  if (tpFilled && tp <= 0) return true;

  // All correct, but price field cleared
  if (!price && stopLimitPrice && slFilled && tpFilled) return true;

  return false; // ? All Buy Stop Limit conditions passed
}
// ? SELL STOP LIMIT CONDITIONS
if (orderType === 7) {
  const stopLimitPrice = parseFloat(this.orderFrom.get('stopLimitPrice')?.value || '0');
  const lot = parseFloat(this.orderFrom.get('lotSize')?.value || '0');

  // Price should be < market price
  if (!price || price >= marketPrice) return true;

  // stopLimitPrice should be >= price
  if (!stopLimitPrice || stopLimitPrice < price) return true;

  // Invalid or missing lot
  if (!lot || lot <= 0) return true;

  // Only price or stopLimitPrice filled (not both)
  if ((price && !stopLimitPrice) || (!price && stopLimitPrice)) return true;

  // SL must be > stopLimitPrice
  if (slFilled && sl <= stopLimitPrice) return true;

  // TP must be <= stopLimitPrice
  if (tpFilled && tp > stopLimitPrice) return true;

  // SL & TP both filled – config may allow only one
  if (slFilled && tpFilled) return true;

  return false; // ? All Sell Stop Limit conditions passed
}

  return true; // For unsupported order types, disable by default
}





  modref2:any
  inputTPP:any
  currentAddP:any
  symShow:any =""
  openXl2(content2: any) {
    const initialDateEvent = { target: { value: new Date().toISOString().split('T')[0] } };
    this.onDateChange(initialDateEvent);
  this.navGateUrl()
  console.log("this.currentPri",this.currentPri);
  this.showMassage = 1
  this.symShow =  localStorage.getItem('changeSym')
   this.orderFrom.patchValue({
    price:this.currentPri
   })
    this.inputSl  = this.currentPri
    this.inputTPP = this.currentPri
    this.currentAddP = this.currentPri
    this.modref= this.modalService.open(content2, { size: 'md modalone', centered: true });
  }

  closeModel(){
    this.modref.close()
  }
  loginDetails:any ={}
  login(){
    debugger
    this.navGateUrl()
    let val = this.loginForm.value
   let obj ={
    "Account":val.ac,
    "Password":val.pass,
    "BrokerID":100
    // "Key":"",
    // "AC": val.ac,
    // "PWD":val.pass
    
   }
   this.global.LOGIN_USER_ACCOUNT(obj).subscribe({ next: (res:any)=>{
  console.log("ress",res);
  if(res.oResult.Result == true){
    this.loginDetails = res
    const updatedData = { ...this.loginDetails, BrokerURL: '' }; // Merge BrokerURL into data
    localStorage.setItem('Acc',val.ac)
    this.share.setLoginData(updatedData);
  
    localStorage.setItem("admin", JSON.stringify(updatedData))
    this.toggleConnection('eff')
    localStorage.setItem('loginId', val.ac);
    localStorage.setItem('managerId', res.Result);
    setTimeout(() => {
      window.location.reload()
    this.closeModel()
    },1000);
    
 

  }
  else if(res.oResult.Result == false){
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

  marginOb:boolean= false
  queue:boolean= false
  NaviGteMargin(val:any){

    if(val == 'Margin'){
      this.marginOb=!this.marginOb
      this.share.shareNavigation(
        {
          name: val, 
          flag: this.marginOb
        }
      )
    }
    else if(val == 'Queue'){
      this.queue=!this.queue
      this.share.shareNavigation(
        {
          name: val, 
          flag: this.queue
        }
      )
    }
console.log("marinCell",val);



  }

  navGateUrl()
{
  this.router.navigateByUrl('dashboard')
}

navlogout()
{
  this.router.navigateByUrl('login')
}



createForm() {
  this.connectAccountForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  });

  this.openDemoAccountForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    accountType: ['Trade MT5 USD', Validators.required],
    deposit: ['5000', Validators.required],
    leverage: ['5000', Validators.required],
    agreeTerms: [false, Validators.requiredTrue]
  });
}


loginId :any = 771227
brokerAccList:any =[]


async  loginSend(){
  
   
  try {
    // Execute functions one by one
    await this.login()
    await this.getMtInfo();
    


  } catch (error) {
    console.error("Error in sequential calls:", error);
  
  }
}
 

async getMtInfo(){

    let obj =
    {
      "Key":"",
      "Account":Number(this.connectAccountForm.value.login),
      "BrokerID": 100
    }
    this.global.GET_MT_USER_INFO(obj).subscribe({
      next: (res: any) => {
        if (res != ""){
          this.brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
          let AccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
          const duplicateTrade = AccList.some((list: any) => list.account === Number(this.connectAccountForm.value.login));
      
          if (!duplicateTrade) {
            this.brokerAccList.push({
              account:Number(this.connectAccountForm.value.login),
              password:this.connectAccountForm.value.password,
              // brokerName:this.optionSelect,
              Company:res.Company,
              // brokeId:this.optionSelectObj.BrokerID,
              Leverage:res.Leverage,
              balance:res.Balance,
              name:res.Name
            })
            localStorage.setItem("brokerAccList", JSON.stringify(this.brokerAccList))
            this.brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
          
          }

          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(() => {
                    this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
                    location.reload()
                  });
          
          },1000);
        }
        else{

        }
     console.log("res",res)
  
      },
      error: (err: any) => {
        console.log(err);
        // this.share.errorTester("Something went wrong")
      },
    });
    return new Promise<void>((resolve) => setTimeout(resolve, 1000));
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


listOb:any={}
showListAccount(val:any){
 this.listOb = val
}

libuysell(tab: any) {
  this.libuysellTab = tab
}


openDemoAccount() {
 if (this.openDemoAccountForm.valid) {
 
   let obj = {
   
     "Key": "",
     "First": this.openDemoAccountForm.value.firstName,
     "Last": this.openDemoAccountForm.value.lastName,
     "Mobile": this.openDemoAccountForm.value.phone,
     "email": this.openDemoAccountForm.value.email,
     "BrokerID": 100,
     "Leverage":this.selectedLeverageValue,
     "Deposit": this.selectedDepositValue,
     "ERR_CODE": 1
 }

 this.global.OPEN_DEMO_ACCOUNT(obj).subscribe({ next:(res:any)=>{
   console.log("res",res);
   
 }})
 } else {
   console.log('Form is invalid');
 }
}


DeleteAcc(val:any){
 console.log("DeleteAcc",val);
 
 let brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')

 // Step 2: Filter out the account to be deleted
 brokerAccList = brokerAccList.filter((item:any) => item.account !== val);

 // Step 3: Save the updated list back to localStorage
 localStorage.setItem('brokerAccList', JSON.stringify(brokerAccList));

}

selectedDepositValue: any;
selectedLeverageValue: any;
onDepositChange() {
 this.openDemoAccountForm.get('deposit')?.valueChanges.subscribe(value => {
   this.selectedDepositValue = this.getDepositValue(value);
   console.log('Selected Deposit Value:', this.selectedDepositValue);
   // You can add additional logic here
 });
}

getDepositValue(value: string): string {
 const depositOptions = [
   '5000',
   '2000',
   '1000',
   '500',
   '300',
   '100'
 ];
 return depositOptions[+value] || 'Unknown';
}

onLeverageChange() {
 this.openDemoAccountForm.get('leverage')?.valueChanges.subscribe(value => {
   this.selectedLeverageValue = this.getLeverageValue(value);
   console.log('Selected Leverage Value:', this.selectedLeverageValue);
   // Additional logic can be added here
 });
}

getLeverageValue(value: string): string {
 const leverageOptions = [
   '500',
   '200',
   '100',
   '50',
   '30',
   '10'
 ];
 return leverageOptions[+value] || 'Unknown';
}

selectedRowIndex:any
getSelectRow(index:any){
 this.selectedRowIndex = index
}


async  autoConnectLogin(){
console.log("this.listOb dgeb ",this.listOb);

try {
await this.autoLogin();
// await this.getAutoMtInfo();

} catch (error) {
 console.error("Error in sequential calls:", error);

}
}



async getAutoMtInfo(){

 let obj =
 {
   "Key":"",
   "Account":Number(this.listOb.account),
   "BrokerID": 100
 }
 this.global.GET_MT_USER_INFO(obj).subscribe({
   next: (res: any) => {
     if (res != ""){
       // this.brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
       // let AccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
       // const duplicateTrade = AccList.some((list: any) => list.account === Number(this.connectAccountForm.value.login));
   
       // if (!duplicateTrade) {
       //   this.brokerAccList.push({
       //     account:this.listOb.account,
       //     password:this.listOb.password,
       //     // brokerName:this.optionSelect,
       //     Company:res.Company,
       //     // brokeId:this.optionSelectObj.BrokerID,
       //     Leverage:res.Leverage,
       //     balance:res.Balance,
       //     name:res.Name
       //   })
       //   localStorage.setItem("brokerAccList", JSON.stringify(this.brokerAccList))
       //   this.brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
        
       // }
       setTimeout(() => {
        
         this.router.navigate(['/dashboard']).then(() => {
                 this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
                 location.reload()
               });
       
       },1000);
     }
     else{

     }
  console.log("res",res)

   },
   error: (err: any) => {
     console.log(err);
     // this.share.errorTester("Something went wrong")
   },
 });
 return new Promise<void>((resolve) => setTimeout(resolve, 1000));
}


async autoLogin(){
 let obj ={
   
   "Account":Number(this.listOb.account),
   "Password":this.listOb.password,
   "BrokerID":100     // wo jayegi jo hm varify manager mai bhejre h

}
this.global.LOGIN_USER_ACCOUNT(obj).subscribe({ next:(res:any)=>{
 console.log("res",res);
 if(res.Result == true){
   localStorage.setItem('loginId',this.listOb.account)
   location.reload()
  
  
  
 }
 else{

 }
  
}})
}


//cose order
hideMOrderButton: any = false

sendingCloseOr(obj:any) {
 console.log(obj);
 
    this.step = 1
    this.jsonBytes = []
    this.jsonBytes = this.sendingClOrder(obj);


  
    this.bufferArray = new Uint8Array(this.jsonBytes);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Convert the hexadecimal string to bytes before sending
      // const byteArray = this.hexToBytes(data);
    
      console.log("this.jsonBytes1111", this.jsonBytes)
      this.socket.send(this.bufferArray);
      console.log("this.jsonBytes", this.jsonBytes.buffer)

    } else {
      console.error('WebSocket connection is not open.');
    }




}

  sendingClOrder(obj :any){
    const buffer = new ArrayBuffer(73); // Total byte length based on specified lengths
    const view = new DataView(buffer);
    view.setUint16(0, obj.Login, true);
    // (view as any).setBigUint64(2, BigInt(obj.accID), true); // 8 bytes for LoginID
    view.setUint32(2, obj.accID, true);
    const symbolBytes = new TextEncoder().encode(obj.Symbol);
    for (let i = 0; i < symbolBytes.length && i < 15; i++) {
        view.setUint8(10 + i, symbolBytes[i]); // Symbol field limited to 15 bytes
    }
      view.setUint32(25, obj.Ticket, true); // 8 bytes for Ticket
    
      view.setFloat64(33, obj.Lot, true); // 8 bytes for Lot
      view.setFloat64(41, obj.Price, true); // 8 bytes for Price
    
      view.setUint16(49, obj.ordType, true); // 2 bytes for ordType
      view.setUint16(51, obj.fillType, true); // 2 bytes for fillType
      
      // Convert Comment string to an array of UTF-8 encoded bytes
      const commentBytes = new TextEncoder().encode(obj.Comment);
      for (let i = 0; i < commentBytes.length && i < 20; i++) {
          view.setUint8(53 + i, commentBytes[i]); // Comment field limited to 20 bytes
      }
      
        // Return the result as Uint8Array
        const result = new Uint8Array(buffer);
        console.log("order req", obj, result);
  
       
        this.step = 3
        return result;
  }


  sendingModefyOr(obj:any) {
    console.log(obj);
    
       this.step = 4
       this.jsonBytes = []
       this.jsonBytes = this.sendingModefySo(obj);
   
   
     
       this.bufferArray = new Uint8Array(this.jsonBytes);
       if (this.socket && this.socket.readyState === WebSocket.OPEN) {
         // Convert the hexadecimal string to bytes before sending
         // const byteArray = this.hexToBytes(data);
       
         console.log("this.jsonBytes1111", this.jsonBytes)
         this.socket.send(this.bufferArray);
         console.log("this.jsonBytes", this.jsonBytes.buffer)
   
       } else {
         console.error('WebSocket connection is not open.');
       }
   
   
   
   
   }
   

   sendingModefySo(obj :any){
  
    const buffer = new ArrayBuffer(105); // Total byte length based on specified lengths
    const view = new DataView(buffer);
    view.setUint16(0, obj.Login, true);
    // (view as any).setBigUint64(2, BigInt(obj.accID), true); // 8 bytes for LoginID
    view.setUint32(2, obj.accID, true);
    const symbolBytes = new TextEncoder().encode(obj.Symbol);
    for (let i = 0; i < symbolBytes.length && i < 15; i++) {
        view.setUint8(10 + i, symbolBytes[i]); // Symbol field limited to 15 bytes
    }
  
    view.setUint32(25, obj.Ticket, true); // 8 bytes for Ticket
  
    view.setFloat64(33, obj.Lot, true); // 8 bytes for Lot
    view.setFloat64(41, obj.Price, true); // 8 bytes for Price
    view.setFloat64(49, obj.SL, true); // 8 bytes for SL
    view.setFloat64(57, obj.PL, true); // 8 bytes for PL
  
    view.setUint16(65, obj.ordType, true); // 2 bytes for ordType
    // view.setUint16(67, obj.trdType, true); // 2 bytes for trdType
  
    view.setFloat64(67, obj.StopLimit, true); // 8 bytes for StopLimit
  
    view.setUint16(75, obj.Expiry, true); // 2 bytes for Expiry
  
    view.setUint32(77, obj.ExpTime, true); // 8 bytes for ExpTime
  
    // Convert Comment string to an array of UTF-8 encoded bytes
    const commentBytes = new TextEncoder().encode(obj.Comment);
    for (let i = 0; i < commentBytes.length && i < 20; i++) {
        view.setUint8(85 + i, commentBytes[i]); // Comment field limited to 20 bytes
    }
        // Return the result as Uint8Array
        const result = new Uint8Array(buffer);
        console.log("Modify req", obj, result);
  
       
        this.step = 4
        return result;
    }

  getStatusActivity(val:any){
    if (val.Update == 9 && val.State == 4 &&val.MsgID==300){
      this.getSLUpdate(val)
    }
    else if ((val.Update == 4 && val.State == 4 && val.MsgID==300 ) || val.ERR_MSG =='POSITION_NOT_EXISTS'){
      this.deletePosition(val)
    }
      }
    

getStatusActivityModify(val:any){
        if (val.Update == 10 && val.State == 1 &&val.MsgID==300){
          this.getSLUpdate(val)
        }
        else if ((val.Update == 4 && val.State == 4 && val.MsgID==300 ) || val.ERR_MSG =='POSITION_NOT_EXISTS'){
          this.deletePosition(val)
        }
          }

getStatusActivityClose(val:any){
            if (val.MsgID==124){
              this.getLotUpdate(val)
            }
            else if (val.ERR_MSG =='POSITION_NOT_EXISTS'){
              this.deletePosition(val)
            }
              }

      getSLUpdate(val:any){
        // Retrieve the array from localStorage
        const positionListData = JSON.parse(localStorage.getItem('positionListData') || '[]');
    
        // Find the index of the item with the matching Ticket ID
        const index = positionListData.findIndex((item: any) => item.Ticket === val.Ticket);
      
        // If a matching item is found, update its SL value
        if (index !== -1) {
          positionListData[index].SL = val.SL; // Update SL value
          positionListData[index].TL = val.TL;
          localStorage.setItem('positionListData', JSON.stringify(positionListData)); // Save updated array
          console.log('SL updated successfully!', positionListData[index]);
          this.share.UpToDate(0)
        } else {
          console.log('Ticket ID not found in positionListData.');
        }
      }
    
      deletePosition(ticketId:any){
     // Retrieve the current data from localStorage
     const storedData = localStorage.getItem('positionListData');
    
     if (storedData) {
       // Parse the data into a JSON array
       const positionListData = JSON.parse(storedData);
    
       // Filter out the item with the matching Ticket ID
       const updatedData = positionListData.filter((item: any) => item.Ticket == ticketId);
       
       if (updatedData.length !== positionListData.length) {
         // Save the updated array back to localStorage
         localStorage.setItem('positionListData', JSON.stringify(updatedData));
         console.log(`Deleted item with Ticket ID ${ticketId}`);
         this.share.UpToDate(0)
         this.deletePositions(ticketId)
       } else {
         console.log(`No item found with Ticket ID ${ticketId}`);
       }
     } else {
       console.log('No data found in localStorage for key "positionListData"');
     }
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

      getLotUpdate(val:any){
        // Retrieve the array from localStorage
        const positionListData = JSON.parse(localStorage.getItem('positionListData') || '[]');
    
        // Find the index of the item with the matching Ticket ID
        const index = positionListData.findIndex((item: any) => item.Ticket === val.Ticket);
      
        // If a matching item is found, update its SL value
        if (index !== -1) {
          // positionListData[index].SL = val.SL; // Update SL value
          // positionListData[index].TL = val.TL;
          const LOT = (Number(positionListData[index].Lot) - Number(val.Lot))
          positionListData[index].Lot = LOT;
          if(Number(positionListData[index].Lot) == Number(val.Lot) || LOT == 0 || Number(positionListData[index].Lot) ==0){
            this.deletePosition(val.Ticket)
          }
          localStorage.setItem('positionListData', JSON.stringify(positionListData)); // Save updated array
          console.log('SL updated successfully!', positionListData[index]);
          this.share.UpToDate(0)
        } else {
          console.log('Ticket ID not found in positionListData.');
        }
      }

  ModifyRes(byteArray: Uint8Array): any {
        
        const view = new DataView(byteArray.buffer);

        const MsgID = view.getUint16(0, true); // 2 bytes for MsgID
      
       
        if(MsgID == 300){
          const Login = Number((view as any).getBigUint64(2, true)); // Convert BigInt to number for Login
          const Ticket = Number((view as any).getBigUint64(10, true)); 
          const Price = view.getFloat64(18, true); // 8 bytes for Price
          const Lot = view.getFloat64(26, true); // 8 bytes for Lot
          const State = view.getUint16(34, true); // 2 bytes for State
          const Update = view.getUint16(36, true); // 2 bytes for Update
          const SL = view.getFloat64(38, true); // 8 bytes for SL
          const TP = view.getFloat64(46, true); // 8 bytes for TP
          const Balance = view.getFloat64(54, true); // 8 bytes for Balance
          const Margin = view.getFloat64(62, true); // 8 bytes for Margin
          const FreeMargin = view.getFloat64(70, true); // 8 bytes for FreeMargin
          
          // Assuming the start index for Balance, Margin, and FreeMargin has been corrected to avoid overlap with earlier fields
          
        
          
          const obj1 = {
              MsgID: MsgID,
              Login: Login,
              Ticket: Ticket,
              Price: Price,
              Lot: Lot,
              State: State,
              Update: Update,
              SL: SL.toFixed(5),
              TL: TP,
              // Balance: Balance, // 8 bytes for Balance
              // Margin: Margin, // 8 bytes for Margin
              // FreeMargin: FreeMargin, // 8 bytes for FreeMargin
              // ModifyType: "modify",
              // TypeOfOration: "Modify position"
          };
         console.log("modify",obj1);
         this.getStatusActivityModify(obj1)
         this.share.msgForClientToModifyData(obj1)
        }
        else if (MsgID == 301){
          const Login = Number((view as any).getBigUint64(2, true)); // 8 bytes Convert BigInt to number for Login
             const Ticket = Number((view as any).getBigUint64(10, true));// 8 bytes Convert BigInt to number for Ticket
            // Extract Symbol (up to 15 characters, starting at byte 18, stopping at null character)
         let symbolBytes = [];
         for (let i = 0; i < 15; i++) {
             const byte = view.getUint8(18 + i); // Symbol starts at byte 18
             if (byte === 0) break; // Stop if null character is encountered
             symbolBytes.push(byte);
         }
         const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes));
       
         // Extract Comment (up to 20 characters, starting at byte 33)
         let commentBytes = [];
         for (let i = 0; i < 20; i++) {
             const byte = view.getUint8(33 + i); // Comment starts after Symbol (byte 33)
             if (byte === 0) break; // Stop if null character is encountered
             commentBytes.push(byte);
         }
         const Comment = new TextDecoder().decode(new Uint8Array(commentBytes));
       
         // Extract ERR_MSG (up to 50 characters, starting at byte 53)
         let errorMsgBytes = [];
         for (let i = 0; i < 50; i++) {
             const byte = view.getUint8(53 + i); // ERR_MSG starts after Comment (byte 53)
             if (byte === 0) break; // Stop if null character is encountered
             errorMsgBytes.push(byte);
         }
         const ERR_MSG = new TextDecoder().decode(new Uint8Array(errorMsgBytes));
       
         // Create object with parsed values
         const obj = {
             MsgID,
             Login,
             Ticket,
             Symbol,
             Comment,
             ERR_MSG,
         };
         this.share.msgForClientToModifyData(obj)
         console.log("rejecttt",obj);
          this.orderResData = obj
           this.showMassage = 2
           this.showErroMass =2
       
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
    navigate(){

    }
}



 