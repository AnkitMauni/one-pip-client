import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-marketwatch',
  templateUrl: './marketwatch.component.html',
  styleUrls: ['./marketwatch.component.scss']
})
export class MarketwatchComponent implements OnInit {
  currentTab: any = "tab1";
  isOpen = false;
  selectedPath:any
  index = 0;
  menu: any;
  expand: any = {};
  getAllSymbol:any =[]
  selectedNode = undefined;
  parentNode: any;
  step: any = 0
  // qoutes = environment.quotesUrl;
  qoutes:any 
  trades:any

  nvatabc (tab: any){
    this.currentTab = tab
  }
  connectionStatus:any

  AddSymbols: any =[]
  constructor(private toster:ToastrService, private el: ElementRef, private renderer: Renderer2,private share:ShareService,private datePipe: DatePipe,private modalService: NgbModal,private fb: FormBuilder, config: NgbModalConfig, private router:Router,private api: GlobalService) {
    // config.backdrop = 'static';
		// config.keyboard = false;
    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';

    // this.getUserSubscribe()
  }

  openXl(content: any) {

    console.log("contetemmm");
    this.selectedRowIndex = null
    this.selectDivHid = 1
    this.modalService.open(content, { size: 'xl modalone-two lg850', centered: true });
  }

  openXl1(content1: any, val:any) {
  
    console.log("contetemmm");
    // this.selectedRowIndex = null
    // this.selectDivHid = 1
    this.modalService.open(content1, { size: 'xl modalone-two lg850', centered: true });
  }

  format(val: number, num:any): string {
    // Check if the number is an integer
    if (Number.isInteger(val)) {
      // If the integer 
        return val.toString();
      }
     else {
      // If it's a float, return it with num decimal places
      return val.toFixed(num);
    }
  }

  selectedRowIndex:any
  selectDivHid: any = 1
  
  getSelectRow(index:any,sym:any){
    this.selectedRowIndex = index
   this.symName = sym.sy
      this.selectDivHid = 2
  
  }
  private element:any= HTMLElement;

  private element1:any= HTMLElement;
  isMenuVisible:boolean = false;
  menuPosition = { x: 0, y: 0 };
  activeSubMenu: string | null = null;
  activeSubSubMenu: string | null = null;

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
   
    if (this.element) {
      // this.renderer.listen(this.element, 'contextmenu',null);
    }
  }


  getAllSymbol1:any =[]
  transformData(data: any) {
    const baseProperties = {
      thumb: "assets/images/sideimg/mt-icons22.png",
      icon: "",
      class: "",
      label: "",
      labelClass: "",
      extralink: false,
      submenu: []
    };
  
    return data.map((item: any) => {
      const firstItem = item.lstSecu[0];
      const restItems = item.lstSecu.slice(1).map((title: any) => {
        const subItem = {
          ...baseProperties,
          title,
          path: `${firstItem}\\${title}`,
          submenu: []
        };
        // Fetch symbol info for each submenu item
       
        return subItem;
      });

      
      return {
        ...baseProperties,
        title: firstItem,
        path: `${firstItem}`,
        submenu: restItems,
       
      };
    });
  }
  


  
  private toNode(x: any): any {
    const y: any = { ...x };
    y.index = ++this.index;
    for (let n = 0; n < y.submenu.length; n++) {
      y.submenu[n] = this.toNode(y.submenu[n]);
    }
    return y;
  }

  nodePranet:any
  toggleVisible(node: any) {

    if (node.submenu && node.submenu.length) {
      this.expand[node.index] = !this.expand[node.index];
      this.nodePranet = node.title
 
      
    }
  }

  selectNode(node: any,) {

    this.selectedNode = node;
    this.getSymInfo(this.selectedNode)
    
  }


lisAllSymb: any =[]
getSymInfo(val:any){
  if (val.path) {

  this.selectedRowIndex == null
  this.selectDivHid = 1
    this.api.GET_MQ_SECU_SYMBOLS(val.path).subscribe({ next : ( res:any) =>{
      this.lisAllSymb= res.lstSymbols
      this.getSymbolDeta = this.lisAllSymb[0]

     
    },
    error: (err: any) => {
      console.log(err);
     
    },})
  }
  else {
    console.error('No ID found in route parameters');
  }
}
private socket: any = WebSocketSubject;
bufferArray: any = Uint8Array;

qoutesUrll:any 
  ngOnInit(){
  //   this.element = this.el.nativeElement.querySelector('#yourElementId');
   
  //     if (this.element) {
  //   this.renderer.listen(this.element, 'contextmenu', this.onRightClick.bind(this));
  // }
 this.share.sharedData$.subscribe((data:any) => {
      if (data) {
       console.log("dataa",data);
       this.qoutes =(data.Sock_Quote).replace(/\\/g, "//")
       this.trades =(data.Sock_Trade).replace(/\\/g, "//")
       
      }
      else{
       
        const storedQuote = localStorage.getItem('Sock_Quote');
        this.qoutes = storedQuote ? storedQuote.replace(/\\/g, "//") : "";
        console.log(this.qoutes);
        
        const storedTrade = localStorage.getItem('Sock_Trade');
        this.trades = storedTrade ? storedTrade.replace(/\\/g, "//") : "";
        console.log(this.trades);
      }
    });

    this.socket = new WebSocket(`${this.qoutes}`); 
     this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onerror = this.handleError.bind(this);
 
    let obj = {
      id: 100,
      Account:Number(localStorage.getItem('loginId')),
      Key: 201001,


    }

    setTimeout(() => {
      this.login1(obj)
      this.get_Mk()
      this.GET_USER_ALL_SYMBOLS_v2()
    }, 3000);


   
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
      console.log("this.jsonBytes", this.jsonBytes.buffer)

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

    return result;
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
        else if (this.step == 1) {
          this.decode(uint8ArrayData)
        }
        // else if(this.step == 2){
        //   this.orderRes(uint8ArrayData)
        // }



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

  const id = view.getUint16(0, true);        // 2 bytes
  const loginId = view.getUint32(2, true);   // 4 bytes (assumed)
  const key = view.getUint32(10, true);      // 4 bytes
  const Resp_Code = view.getUint16(14, true); // 2 bytes
  const timestamp = (view as any).getBigUint64(16, true); // 8 bytes

  const originalData = {
    ID: id,
    LoginID: loginId,
    Key: key,
    Resp_Code: Resp_Code,
    Timestamp: Number(timestamp)
  };

  this.step = 1;
  console.log("✅ Decoded Login Response:", originalData);
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

  marketWatchData: any = []
decode(byteArray: Uint8Array) {
  const view = new DataView(byteArray.buffer);
  const MSS_ID = view.getUint16(0, true); // 2 bytes
  const count = view.getUint16(2, true); // 2 bytes

  const objectSize = 100; // Each object is 100 bytes long
  const objects = [];
  let skippedPackets = 0;
  for (let i = 0; i < count; i++) {
    const offset = 4 + i * objectSize;

    const Bid = view.getFloat64(offset, true);
    const Ask = view.getFloat64(offset + 8, true);
    const Vol = view.getFloat64(offset + 16, true);
    const Last = view.getFloat64(offset + 24, true);

    // Time (8 bytes as ASCII string)
    const TimeBytes = Array.from(new Uint8Array(byteArray.buffer.slice(offset + 32, offset + 40)));
    // console.log("Raw slice", Array.from(byteArray.slice(offset, offset + objectSize)));
    const TimeString = String.fromCharCode(...TimeBytes);
    const Time = this.formatTimeString(TimeString);

    // Symbol (20 bytes as ASCII)
    const symbolBytes: number[] = [];
    for (let j = 0; j < 20; j++) {
      const byte = view.getUint8(offset + 40 + j);
      if (byte === 0) break;
      symbolBytes.push(byte);
    }
    const Symbol = new TextDecoder().decode(new Uint8Array(symbolBytes)).trim();

    const Open = view.getFloat64(offset + 60, true);
    const Low = view.getFloat64(offset + 68, true);
    const High = view.getFloat64(offset + 76, true);
    const Close = view.getFloat64(offset + 84, true);
    const Timestamp = view.getFloat64(offset + 92, true);
    const TimeSec = Timestamp * 1000;
    
    // 🛡️ Skip invalid/empty data
    if (
      Bid === 0 && Ask === 0 && Vol === 0 && Last === 0 &&
      Time === "00:00:00"
    ) {
      console.warn("⚠️ Skipping zeroed-out packet");
      skippedPackets++;
      continue;
    }

    if (!Symbol || Symbol.trim() === "") {
      console.warn("⚠️ Skipping packet with empty symbol");
      continue;
    }

    const marketData = { Bid, Ask, Vol, Last, Time, Symbol, Close, High, Low, Open, TimeSec };
    // console.log("✅ Live Data:", marketData);
    objects.push(marketData);
  }
  // console.log(`ℹ️ Skipped packets in this chunk: ${skippedPackets}`);
  if (objects.length) {
    this.getLiveDataSoc(objects);
  } else {
    console.error("❌ No valid market data decoded.");
  }

  return { MSS_ID, Count: count, oQuote: objects };
}

  chartValueIndex:any =[]
  marketSymbolenght:any 
  getLiveDataSoc(val: any) {
    // console.log("val",val);  
    if (!val || !val.length) {
      // console.error('Invalid input:', val);
      this.marketSymbolenght=  val.length
      return; // Exit the function early if val is undefined or has no length
    }

    setInterval(() => {
      if (val && val.length) {
        this.getPriviceSoc(val);
      } else {
        // Handle the case where 'objects' is undefined or empty
        console.error("'val' is undefined or empty.");
      }

      // Assuming you have a method to fetch live data
    }, 300);

    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < this.data.length; j++) {
        if (this.data[j].oSymbolConfig.ScripCode === val[i].Symbol) {
          this.data[j].oInitial.Ask = val[i].Ask;
          this.data[j].oInitial.Bid = val[i].Bid;
          this.data[j].oInitial.Time = val[i].Time;
          this.data[j].oInitial.TimeSec = val[i].TimeSec;
          this.data[j].oInitial.High = val[i].High;
          this.data[j].oInitial.Open = val[i].Open;
          this.data[j].oInitial.Low = val[i].Low;
          this.data[j].oInitial.Close = val[i].Close;
        
          let val1 = (val[i].Ask + val[i].Bid) / 2;
          this.data[j].oInitial.currentP = val1;
          if(this.data){
            this.share.marketLiveData(this.data)
          }
   
       
          
        
        
         

          break;
        }
       
      }
    }

  }


 

  previousData: any = []
  getPriviceSoc(val: any) {
    // this.previousData = val
    for (let i = 0; i < val.length; i++) {
      for (let j = 0; j < this.data.length; j++) {
        if (this.data[j].oSymbolConfig.Symbol === val[i].Symbol) {
          this.data[j].oInitial.previousAsk = val[i].Ask;
          this.data[j].oInitial.previousBid = val[i].Bid;

          break; // Break the loop once the Ask property is updated for the current Symbol
        }
      }
    }
  }

  // onRightClick(event: MouseEvent) {
  //   console.log("right click", event)
  //   event.preventDefault(); // Prevent the default context menu from appearing
  //   this.menuPosition = { x: event.clientX-90, y: event.clientY-80 };
  //     this.isMenuVisible = true;
  
      
  //   // alert('Right click detected on element with ID!');
  // }
activeRow: any = null;

onRightClick(event: MouseEvent, item: any) {
  event.preventDefault();

  this.getMouseOverItemData = item;
  this.activeRow = item;

  this.menuPosition = {
    x: event.clientX,
    y: event.clientY
  };

  this.isMenuVisible = true;
  console.log('Right-clicked on:', item?.oSymbolConfig?.Symbol);
}
showClick(){
  this.isMenuVisible = true;
}
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu')) {
    this.isMenuVisible = false;
  }
  }

  onMenuItemClick(action: string) {

    this.isMenuVisible = false;
  }

  showSubMenu(subMenu: string) {
    this.activeSubMenu = subMenu;
  }

  hideSubMenu(subMenu: string) {
    if (this.activeSubMenu === subMenu) {
      this.activeSubMenu = null;
    }
  }

  showSubSubMenu(subSubMenu: string) {
    this.activeSubSubMenu = subSubMenu;
  }

  hideSubSubMenu(subSubMenu: string) {
    if (this.activeSubSubMenu === subSubMenu) {
      this.activeSubSubMenu = null;
    }
  }

  onSubMenuItemClick(action: string) {

    this.isMenuVisible = false;
  }

  onSubSubMenuItemClick(action: string) {

    this.isMenuVisible = false;
  }

  getMouseOverItemData:any={};
  listLength:any
onMouseOver(item:any){
console.log("mouseOver", item)
  this.getMouseOverItemData={}
this.getMouseOverItemData=item
this.getVal(item)
this.symName = this.getMouseOverItemData?.oSymbolConfig?.Symbol

console.log("this.getMouseOverItemData",this.getMouseOverItemData);

}

listOpen:any =[]

deleteRow() {
  const symbolToDelete = this.getMouseOverItemData?.oSymbolConfig?.Symbol;
  const accountId = Number(localStorage.getItem('loginId'));

  const bodyToGetOpen = {
    Account: accountId
  };

  // ✅ Step 1: Get open positions
  this.api.GET_USER_OPEN_POS(bodyToGetOpen).subscribe({
    next: (res: any) => {
      const listOpen = res.lstPos || [];

      // ✅ Step 2: Check if symbol is in open positions
      const isSymbolOpen = listOpen.some((pos: any) => {
        const rawSymbol = pos.Sy || '';
        const cleanSymbol = rawSymbol.split('.')[0];
        return symbolToDelete?.startsWith(cleanSymbol);
      });

      if (isSymbolOpen) {
        this.toster.error(`You have an open position for ${symbolToDelete}. You can't delete this symbol.`, 'Warning');
        this.isMenuVisible = false;
        return;
      }

      // ✅ Step 3: Proceed to delete if not in open positions
      const bodyToDelete = {
        Key: "",
        Account: accountId,
        oSymbols: [symbolToDelete]
      };

      this.api.DEL_MQ_SYMBOLS(bodyToDelete).subscribe({
        next: (res) => {
          console.log('Deleted:', res);
          this.removeSymbolFromTable(symbolToDelete);
          this.isMenuVisible = false;
          this.GET_USER_ALL_SYMBOLS_v2();
        },
        error: (err) => {
          console.error('Error deleting symbol:', err);
          this.isMenuVisible = false;
        }
      });
    },
    error: (err) => {
      console.error('Error fetching open positions:', err);
      this.toster.error('Failed to fetch open positions. Please try again.', 'Error');
      this.isMenuVisible = false;
    }
  });
}


removeSymbolFromTable(symbol: string) {
  this.data = this.data.filter((sym:any) => sym?.oSymbolConfig?.Symbol !== symbol);
  this.activeRow = null;
}
getSymbolDeta:any ={}
addS:any
getSymbolDetails(val:any){
  this.getSymbolDeta = val
  this.addS = val.sy
  console.log("this.getSymbolDeta",this.getSymbolDeta);
  
}

symName:any


isDivVisible: any = 1; // Initially, div is visible

toggleDivVisibility() {
  this.isDivVisible = 1;
  
  console.log("this.isDivVisible",this.isDivVisible);
  
}

toggleDivVisibility1() {
  this.isDivVisible = 2;
  console.log("this.isDivVisible",this.isDivVisible);
}

AddSymbol(){
 
  this.getSubscribe()
}

DeleteSym(){
 
  this.DEL_MQ_SYMBOLS()

}



data: any = []
data1:any =[]
checkData = []
get_Mk() {
  let obj = {
    "Key": "",
    "Account": Number(localStorage.getItem('loginId')),
    "PkgID":Number(localStorage.getItem('PkgId'))
  }

  this.api.GET_USER_SUBSCRIBE_MK_v2(obj).subscribe({
    next: (res: any) => {
      this.data = res.lstSymbols
      
      // this.getVal(this.data[0])
      this.share.getSubscribedSymbol(this.data)
      this.share.getSymData("NoData")

    },
    error: (err: any) => {
      console.log(err);
  
    },
  });
}


getVal(val:any){
  console.log("change", val);
  this.share.getSymData(val?.oSymbolConfig?.Symbol)
  if(val?.oSymbolConfig?.Symbol == undefined || ''){
    localStorage.setItem('changeSym',val?.oSymbolConfig?.Symbol)
  this.getInitial(val?.oSymbolConfig?.Symbol)
    }
    else{
      localStorage.setItem('changeSym',val?.oSymbolConfig?.Symbol)
      this.getInitial(val?.oSymbolConfig?.Symbol)
    }
  }
  


digitData: any

  formatBidAsk(vall: any, val: any) {
    if (vall === undefined) {
      let obj = {
        int: 0,
        decim: 0,
        supp: 0
      };


      return obj
    }
    else {
      this.digitData = vall;
      const formattedPrice = val.toFixed(vall); // Ensure we have at least val decimal places
      const [integerPart, decimalPart] = formattedPrice.split('.');

      const askString = val.toString();

      const lastDigit = askString.charAt(askString.length - 1);

      // const trim = decimalPart.toString();
      // const tim3 = trim.charAt(trim.length - 3);
      // const tim2 = trim.charAt(trim.length - 2);

      let obj = {
        int: integerPart,
        decim: decimalPart.slice(0, -1),
        supp: lastDigit
      };


      return obj
    }

  }
  
  dubb: any

  diggFont(val: string): { sin: string, dub: string } {
    let single: string;
    let dubble: string;

    if (val.length > 2) {
      single = val.slice(0, -2);
      dubble = val.slice(-2);
    } else {
      single = '';
      dubble = val;
    }

    return { sin: single, dub: dubble };
  }

  // Your existing currentAskP function
  currentAskP(previousAsk: any, currAsk: any, currBid: any): number {

    if (previousAsk < currAsk) {
      return 0; // Return 0 for blue
    } else if (previousAsk > currAsk) {
      return 1; // Return 1 for red
    } else if (currAsk === currBid) {
      return 2; // Return 2 for black
    }
    else {
      return 3;
    }
  }

  // Function to get styles based on currentAskP return value
  getAskStyle(previousAsk: any, currAsk: any, currBid: any): any {
    const returnValue = this.currentAskP(previousAsk, currAsk, currBid);
    switch (returnValue) {
      case 0:
        return { 'color': 'red' }; // Blue color for return value 0
      case 1:
        return { 'color': 'blue' }; // Red color for return value 1
      case 2:
        return { 'color': 'black' }; // Black color for return value 2
      default:
        return {}; // Default empty style
    }
  }
  private lastBid: any = null;
  private lastAsk: any = null;
  private lastClass: string = 'blue-class';
  private previousBidValue: any = null;
  private previousAskValue: any = null;
  private previousIconClass: string = 'fa-arrow-up'; // Default icon class


  getIconClass(data: any): string {
    const currentBidValue = data?.oInitial?.Bid;
    const currentAskValue = data?.oInitial?.Ask;
    const previousBid = data?.oInitial?.previousBid;
    const previousAsk = data?.oInitial?.previousAsk;

    if (this.previousBidValue !== null && (this.previousBidValue !== currentBidValue || this.previousAskValue !== currentAskValue)) {
      // Compare current values with previous values to determine if there has been a change
      if (this.arrowBidP(previousBid, currentAskValue, currentBidValue)) {
        if (previousBid < currentBidValue) {
          this.previousIconClass = 'fa-arrow-up';
        } else if (previousBid > currentBidValue) {
          this.previousIconClass = 'fa-arrow-down';
        } else if (previousBid === currentBidValue || previousAsk === currentAskValue) {
          this.previousIconClass = 'fa-dot-circle';
        }
      }
       else {
        this.previousIconClass = 'fa-arrow-up'; // Default icon if no significant change
      }
    }

    // Update the previous values
    this.previousBidValue = currentBidValue;
    this.previousAskValue = currentAskValue;

    return this.previousIconClass;
  }


  

  getClassBid(data: any): string {
    const currentBid = data?.oInitial?.Bid;
    const currentAsk = data?.oInitial?.Ask;
    const previousBid = data?.oInitial?.previousBid;

    if (this.lastBid !== null && (this.lastBid !== currentBid || this.lastAsk !== currentAsk)) {
      // Compare current values with last values to determine if there has been a change
      if (this.arrowBidP(previousBid, currentAsk, currentBid)) {
        if (previousBid < currentBid) {
          this.lastClass = 'blue-class';
        } else if (previousBid > currentBid) {
          this.lastClass = 'red-class';
        } else if (previousBid === currentBid) {
          this.lastClass = 'black-class';
        }
      } else {
        this.lastClass = 'blue-class'; // Default class if no significant change
      }
    }

    // Update the last values
    this.lastBid = currentBid;
    this.lastAsk = currentAsk;

    return this.lastClass;
  }

  getClassAsk(data: any): string {
    if (this.arrowBidP(data?.oInitial?.previousAsk, data?.oInitial?.Ask, data?.oInitial?.Ask)) {
      if (data?.oInitial?.previousAsk < data?.oInitial?.Ask) {
        return 'blue-class';
      } else if (data?.oInitial?.previousAsk > data?.oInitial?.Ask) {
        return 'red-class';
      } else if (data?.oInitial?.previousAsk == data?.oInitial?.Ask) {
        return 'black-class';
      }
      else {
    
        return 'black-class ';
      }
    }
    return 'blue-class';
   
  }

  arrowBidP(previousBid: number, ask: number, bid: number): boolean {
    // Your logic for determining if an arrow should be shown
    return previousBid !== bid; // Replace this with your actual logic
  }

  // Your existing currentAskP function
  currrentBidP(previousBid: any, currAsk: any, currBid: any): number {


    if (previousBid < currBid) {
      return 0; // Return 0 for blue
    } else if (previousBid > currBid) {
      return 1; // Return 1 for red
    } else if (currAsk === currBid) {
      return 2; // Return 2 for black

    }
    else {
      return 3;
    }
  }

  // Function to get styles based on currentAskP return value
  getBidStyle(previousBid: any, currAsk: any, currBid: any): any {
    const returnValue = this.currrentBidP(previousBid, currAsk, currBid);
    switch (returnValue) {
      case 0:
        return { 'color': 'blue' }; // Blue color for return value 0
      case 1:
        return { 'color': 'red' }; // Red color for return value 1
      case 2:
        return { 'color': 'black' }; // Black color for return value 2
      default:
        return {}; // Default empty style
    }
  }

  currentBidP(bid: any, ask: any) {
    let val = (bid + ask) / 2


    return val
  }

  //spred calculation
  spred(bid: any, ask: any, contr: any) {

    let spredData = (ask - bid) * contr
    return parseFloat(spredData.toFixed(2))
  }

  //change calculation
  change(bid: any, closeP: any, contr: any) {

    let change = (bid - closeP) * contr

    const formattedPrice = change.toFixed(2); // Limiting to 4 decimal places
    const [integerPart, decimalPart] = formattedPrice.split('.');

    let changeshow = `${integerPart}.${decimalPart}`
    return changeshow
  }
  //change color calculation
  changeForC(bid: any, closeP: any, contr: any) {

    let change = (bid - closeP) * contr


    return change
  }

  changeColor(bid: number, close: number, contract: any): string {
    const value = this.changeForC(bid, close, contract);
    return value < 0 ? 'red' : '#0056ff';
  }

  //change calculation percentage
  changePercent(bid: any, close: any) {
    let changNurmal = (bid - close) / bid
    let changePer = changNurmal * 100

    const formattedPrice = changePer.toFixed(2); // Limiting to 2 decimal places
    const [integerPart, decimalPart] = formattedPrice.split('.');

    let changePerShow = `${integerPart}.${decimalPart}`
    return changePerShow
  }

  //change  percentage color

  changePercent1(bid: any, close: any) {
    let changNurmal = (bid - close) / bid
    let changePer = changNurmal * 100


    return changePer
  }


  changePerColor(bid: number, close: number): string {
    const value = this.changePercent1(bid, close,);
    return value < 0 ? 'red' : '#0056ff';
  }


  


  getBgStyle(bid: any, ask: any) {
    if (bid == ask) {
      return { 'background-color': 'color-sky' };
    } else {
      return { 'background-color': 'black' };
    }
  }


  DEL_MQ_SYMBOLS(){
    let obj ={
      "Key": "",
      "Account": Number(localStorage.getItem('loginId')),
      "oSymbols": [this.symName]
  }

  this.api.DEL_MQ_SYMBOLS(obj).subscribe({next:(res:any)=>{
    this.get_Mk()
  }})
}


getSubscribe(){
  let obj = {
    "Key":"",
    "Symbol": this.slectedSym,
    "Account":Number(localStorage.getItem('loginId'))
   
  }

  this.api.SUBSCRIBE_SYMBOL(obj).subscribe({
      next: (res: any) => {
        this.getInitial(this.slectedSym)
        this.get_Mk()
        this.GET_USER_ALL_SYMBOLS_v2()
    
      },
      error: (err: any) => {
        console.log(err);
    
      },
    });
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


 details(val:any){
  if(val==1 ){
    this.data1 = this.data
  }
  else if(val == 2){
    this.data1 = this.data.filter((item: any) => item?.oSymbolConfig?.Symbol === this.slectedSym);
   
  }
  this.nvatabc('tab2')
 }
 

 GET_USER_ALL_SYMBOLS_v2(){
  let obj = {
    "Key":"",
    "Account":Number(localStorage.getItem('loginId')),
    "PkgID":Number(localStorage.getItem('PkgId'))
  }

  this.api.GET_USER_ALL_SYMBOLS_v2(obj).subscribe({
      next: (res: any) => {
        this.data2 = res
         
     this.filteredSymbolData = this.data2.sort((a: any, b: any) => a.oSecurities.localeCompare(b.oSecurities));

    // Sort each group's lstSymbols alphabetically
this.data2.forEach((group: any) => {
  group.lstSymbols.sort((a: any, b: any) => a.Symbol.localeCompare(b.Symbol));
});

// Optional: Sort the groups alphabetically
this.data2.sort((a: any, b: any) => a.oSecurities.localeCompare(b.oSecurities));

// Also set filtered data for display
this.filteredSymbolData = this.data2;
console.log("Ress",res);
      },
      error: (err: any) => {
        console.log(err);
     
      },
    });
 }


  getAll(){
    let obj = {
      "Key":"",
      "Account":Number(localStorage.getItem('loginId'))
     
    }
  
    this.api.GET_USER_ALL_SYMBOLS(obj).subscribe({
        next: (res: any) => {
          this.data2 = res
            console.log("Ress",res);
       
      
        },
        error: (err: any) => {
          console.log(err);
         
        },
      });
   }


  getUserSubscribe(){
    let obj = {
      "Key":"",
      "Account":Number(localStorage.getItem('loginId')),
       "PkgID":Number(localStorage.getItem('PkgId'))
    }
  
    this.api.GET_USER_SUBSCRIBE_MK_v2(obj).subscribe({
        next: (res: any) => {
          this.data = res.lstSymbols
            // console.log("Ress",res);
       
      
        },
        error: (err: any) => {
          console.log(err);
      
        },
      });
    }


   
 //=================================================Search Symbol===============================================================
 searchSymbData: any =''
 showData: any = false
 clerShowData: any = true
 onInputClick(event: Event): void {
  
 
  this.showData = true
  // inputElement.style.backgroundColor = 'yellow';

}
// filterData(): any[] {
 
//   const searchTerm = this.searchSymbData.toLowerCase().trim();

//   if (!searchTerm) {
//     return this.data2.filter((item: any) => {
//       return item.oSecurities.toLowerCase().includes(searchTerm) || 
//              item.lstSymbols.some((symbol: any) => symbol.Symbol.toLowerCase().includes(searchTerm));
//     });
//   }

//   return this.data2.flatMap((item: any) => {
//     const filteredSymbols = item.lstSymbols.filter((symbol: any) => symbol.Symbol.toLowerCase().includes(searchTerm));
//     if (filteredSymbols.length > 0 || item.oSecurities.toLowerCase().includes(searchTerm)) {
//       const newItem = { ...item, lstSymbols: filteredSymbols };
//       return [newItem]; // Return as an array
//     }
//     return [];
//   });
// }

// filterData(): any[] {
//   const searchTerm = this.searchSymbData.toLowerCase().trim();

//   if (!searchTerm) {
//     return this.data2; // Return all data if no search term is provided
//   }

//   return this.data2.flatMap((item: any) => {
//     const filteredSymbols = item.lstSymbols.filter((symbol: any) =>
//       symbol.Symbol.toLowerCase().includes(searchTerm)
//     );

//     if (filteredSymbols.length > 0 || item.oSecurities.toLowerCase().includes(searchTerm)) {
//       return [{ ...item, lstSymbols: filteredSymbols }];
//     }

//     return [];
//   });
// }

filterData(): any[] {
  const searchTerm = this.searchSymbData.toLowerCase().trim();

  let filtered = this.data2.flatMap((item: any) => {
    const filteredSymbols = item.lstSymbols
      .filter((symbol: any) =>
        symbol.Symbol.toLowerCase().includes(searchTerm) ||
        item.oSecurities.toLowerCase().includes(searchTerm)
      )
      .sort((a: any, b: any) => a.Symbol.localeCompare(b.Symbol)); // Sort symbols alphabetically

    if (filteredSymbols.length > 0 || item.oSecurities.toLowerCase().includes(searchTerm)) {
      return [{ ...item, lstSymbols: filteredSymbols }];
    }

    return [];
  });

  // Sort groups alphabetically by oSecurities
  filtered.sort((a: any, b: any) => a.oSecurities.localeCompare(b.oSecurities));

  return searchTerm ? filtered : this.data2.sort((a: any, b: any) => a.oSecurities.localeCompare(b.oSecurities));
}

//================================================== upper case================================================================
filteredSymbolData: any[] = [];
convertToUpperCase(): void {
  if (!this.searchSymbData) {
    this.showData = false;
    this.filteredSymbolData = this.data2; // default sorted list
  } else {
    this.searchSymbData = this.searchSymbData.toUpperCase();
    this.showData = true;
    this.filteredSymbolData = this.getFilteredData();
  }
}
getFilteredData(): any[] {
  const searchTerm = this.searchSymbData.toLowerCase().trim();

  let filtered = this.data2.flatMap((item: any) => {
    const filteredSymbols = item.lstSymbols
      .filter((symbol: any) =>
        symbol.Symbol.toLowerCase().includes(searchTerm) ||
        item.oSecurities.toLowerCase().includes(searchTerm)
      )
      .sort((a: any, b: any) => a.Symbol.localeCompare(b.Symbol));

    if (filteredSymbols.length > 0 || item.oSecurities.toLowerCase().includes(searchTerm)) {
      return [{ ...item, lstSymbols: filteredSymbols }];
    }

    return [];
  });

  filtered.sort((a: any, b: any) => a.oSecurities.localeCompare(b.oSecurities));
  return filtered;
}
getSubSy(val:any){
return val
}

data2:any
clearSearch(): void {
  this.clerShowData = true
  this.searchSymbData = '';
  this.showData = false
  // this.data2=[]

  this.GET_USER_ALL_SYMBOLS_v2()
}

//==============================================================toggele symbol============================================================
deleteSym: any= [];
// toggleSymbol(symbol: string, event: any): void {
//   // if (event.detail.checked) {
//   //   this.deleteSym.push(symbol);
//   //   console.log("add",this.deleteSym);
   
//   // } else {
//   //   const index = this.deleteSym.indexOf(symbol);
//   //   if (index !== -1) {
//   //     this.deleteSym.splice(index, 1);
//   //     console.log("dele",this.deleteSym);
//   //   }
//   // }
//   this.deleteSym.push(symbol);
//   this.getDel(this.deleteSym)
// }


getDel(val:any){

  let obj = {
    "Key": "",
    "Account":Number(localStorage.getItem('loginId')),
    "oSymbols": [val]
   
  }

  this.api.DEL_MQ_SYMBOLS(obj).subscribe({
      next: (res: any) => {
        this.GET_USER_ALL_SYMBOLS_v2()
          console.log("Ress",res);
     
    
      },
      error: (err: any) => {
        console.log(err);
      
      },
    });
 }

//============================================================== add single symbol ====================================================
selectedSymbolIndex: number = -1;
slectedSym: any 
addSym(sym: any,index: number,ev:any) {

    this.slectedSym = sym
    this.getSubscribe()
  
    console.log(" this.slectedSym", this.slectedSym);
  if(ev.detail.checked){
  

    this.selectedSymbolIndex = index;
    // this.getSubscribe()
  }
  
  
}
 


}
