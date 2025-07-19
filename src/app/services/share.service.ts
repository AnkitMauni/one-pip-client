import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { throttleTime } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private loaderValue = new Subject<any>();
    selectedloaderValue = this.loaderValue.asObservable();
    constructor(public rout:Router) {}

    private ConectionLogin = new Subject<any>();
    conectionLoginValue = this.ConectionLogin.asObservable();

    
   private slUpdate: Subject<any> = new Subject<any>();
   slUpdate$: Observable<any> = this.slUpdate.asObservable();

   private closePos: Subject<any> = new Subject<any>();
   closePos$: Observable<any> = this.closePos.asObservable();

    private allMarketLiveData: Subject<any> = new Subject<any>();
    allMarketLiveData$: Observable<any> = this.allMarketLiveData.asObservable();

    private shareNavigatePop = new Subject<any>();
    shareNavigatePopValue = this.shareNavigatePop.asObservable();

    private shareNavi = new Subject<any>();
    shareNaviValue = this.shareNavi.asObservable();


    private changeSym: Subject<any> = new Subject<any>();
    changeSym$: Observable<any> = this.changeSym.asObservable();

private getSymbols: Subject<any> = new Subject<any>();
    getSymbols$: Observable<any> = this.getSymbols.asObservable();

    private liveBalance: Subject<any> = new Subject<any>();
    liveBalance$: Observable<any> = this.liveBalance.asObservable();


    private activeValue: Subject<any> = new Subject<any>();
    activeValue$: Observable<any> = this.activeValue.asObservable();


     private orderFlagsSource = new BehaviorSubject<number[]>([]);
  public orderFlags$ = this.orderFlagsSource.asObservable();

  setOrderFlags(flags: number[]) {
    this.orderFlagsSource.next(flags);
  }
  livBalance(data: any){
     
      this.liveBalance.next(data)
  }

  active(data: any) {
    this.activeValue.next(data);
  }
  getSymData(data: any){
     console.log("changeSymchangeSymchangeSym",data);
     
      this.changeSym.next(data)
  }
  getSubscribedSymbol(data:any){
    this.getSymbols.next(data)
  }
  loader(data: any) {
    this.loaderValue.next(data);
  }

  Conection(data:any){
    this.ConectionLogin.next(data);
  }

  marketLiveData(data: any) {
    // console.log("marketLiveData",data);
    if(data){
      this.allMarketLiveData.next(data);
    }
  }

  shareNavigation(data:any){
  this.shareNavigatePop.next(data)
  }
  

  shareNavigateHight(data:any){
    this.shareNavi.next(data)
    }
  

  //login credationals
  private dataSubject = new BehaviorSubject<any>(null); // Initial value is null
  sharedData$ = this.dataSubject.asObservable(); // Observable for components

 setLoginData(data: any) {
    this.dataSubject.next(data); // Update data
  }


   //Position
   private dataArraySubject = new BehaviorSubject<string[]>([]); // Array of data
   public dataArray$: Observable<string[]> = this.dataArraySubject.asObservable();
   loc: any = {};
   addPositon(data: any) {
 
      const existingDataString = localStorage.getItem('positionListData');
     let existingDataArray: any[] = [];
 
     if (existingDataString) {
         existingDataArray = JSON.parse(existingDataString);
     }
 
     // Check if the ticket ID already exists
     const ticketExists = existingDataArray.some(item => item.Ticket === data.Ticket);
 
     if (!ticketExists) {
         // Merge existing data with new data if ticket ID does not exist
         const updatedDataArray = [...existingDataArray, data];
 
         // Save updated array to local storage
         localStorage.setItem('positionListData', JSON.stringify(updatedDataArray));
 
         // Update the BehaviorSubject with the updated array
         this.dataArraySubject.next(updatedDataArray);
     } else {
         console.log(`Ticket ID ${data.Ticket} already exists. Data not added.`);
     }
   }
 
   //wihtout check ticket id 
   addPos(data:any){
     const existingDataString = localStorage.getItem('positionListData');
     let existingDataArray: any[] = [];
     if (existingDataString) {
       existingDataArray = JSON.parse(existingDataString);
     }
 
     // Merge existing data with new data
     const updatedDataArray = [...existingDataArray, data];
 
     // Save updated array to local storage
     localStorage.setItem('positionListData', JSON.stringify(updatedDataArray));
 
     // Update the BehaviorSubject with the updated array
     this.dataArraySubject.next(updatedDataArray);
   }
 
   private dataArrayHistSubject = new BehaviorSubject<string[]>([]); // Array of data
   public dataArrayHist$: Observable<string[]> = this.dataArrayHistSubject.asObservable();
 
   addPositonHist(data: any) {
 
     const existingDataString = localStorage.getItem('historyOrder');
     let existingDataArray: any[] = [];
     if (existingDataString) {
       existingDataArray = JSON.parse(existingDataString);
     }
 
     // Merge existing data with new data
     const updatedDataArray = [...existingDataArray, data];
 
     // Save updated array to local storage
     localStorage.setItem('historyOrder', JSON.stringify(updatedDataArray));
 
     // Update the BehaviorSubject with the updated array
     this.dataArrayHistSubject.next(updatedDataArray);
   }
 
   private dataArrayOrderHistSubject = new BehaviorSubject<string[]>([]); // Array of data
   public dataArrayOrderHist$: Observable<string[]> = this.dataArrayOrderHistSubject.asObservable();
 
   addOrderHist(data: any) {
 
     const existingDataString = localStorage.getItem('orderHistory');
     let existingDataArray: any[] = [];
     if (existingDataString) {
       existingDataArray = JSON.parse(existingDataString);
     }
 
     // Merge existing data with new data
     const updatedDataArray = [...existingDataArray, data];
 
     // Save updated array to local storage
     localStorage.setItem('orderHistory', JSON.stringify(updatedDataArray));
 
     // Update the BehaviorSubject with the updated array
     this.dataArrayOrderHistSubject.next(updatedDataArray);
   }
 
   private dataArrayDesalHistSubject = new BehaviorSubject<string[]>([]); // Array of data
   public dataArrayDesalHist$: Observable<string[]> = this.dataArrayDesalHistSubject.asObservable();
 
   addDealsHist(data: any) {
 
     const existingDataString = localStorage.getItem('dealsListData');
     let existingDataArray: any[] = [];
     if (existingDataString) {
       existingDataArray = JSON.parse(existingDataString);
     }
 
     // Merge existing data with new data
     const updatedDataArray = [...existingDataArray, data];
 
     // Save updated array to local storage
     localStorage.setItem('dealsListData', JSON.stringify(updatedDataArray));
 
     // Update the BehaviorSubject with the updated array
     this.
       dataArrayDesalHistSubject.next(updatedDataArray);
   }
 
   updatePosition(ticketId: any, newData: any) {
     console.log("ticketId", ticketId, "nedtaa", newData);
 
   }
   //Order
   private dataArraySubject1 = new BehaviorSubject<string[]>([]); // Array of data
   public dataArray1$: Observable<string[]> = this.dataArraySubject1.asObservable();
 
 
   addOrder(data: any) {
 
     const existingDataString = localStorage.getItem('orderListData');
     let existingDataArray: any[] = [];
 
     if (existingDataString) {
         existingDataArray = JSON.parse(existingDataString);
     }
 
     // Check if the ticket ID already exists
     const ticketExists = existingDataArray.some(item => item.Ticket === data.Ticket);
 
     if (!ticketExists) {
         // Merge existing data with new data if ticket ID does not exist
         const updatedDataArray = [...existingDataArray, data];
 
         // Save updated array to local storage
         localStorage.setItem('orderListData', JSON.stringify(updatedDataArray));
 
         // Update the BehaviorSubject with the updated array
         this.dataArraySubject1.next(updatedDataArray);
     } else {
         console.log(`Ticket ID ${data.Ticket} already exists in orderListData. Data not added.`);
     }
   }
 
   //without check ticket id 
   addOrderr(data:any){
     const existingDataString = localStorage.getItem('orderListData');
     let existingDataArray: any[] = [];
     if (existingDataString) {
       existingDataArray = JSON.parse(existingDataString);
     }
 
     // Merge existing data with new data
     const updatedDataArray = [...existingDataArray, data];
 
     // Save updated array to local storage
     localStorage.setItem('orderListData', JSON.stringify(updatedDataArray));
 
     // Update the BehaviorSubject with the updated array
     this.dataArraySubject1.next(updatedDataArray);
   }
 

   UpToDate(data:any){
    this.slUpdate.next(data);
   
 }
 sendClosePosLiveData(data: any) {
   this.closePos.next(data);
 }


 private closeOrderbySocket: Subject<any> = new Subject<any>();
  closeOrderbySocket$: Observable<any> = this.closeOrderbySocket.asObservable();

  sendCloseOrderbyData(data: any) {
    this.closeOrderbySocket.next(data);
  }

  private footerClosOrder: Subject<any> = new Subject<any>();
  footerClosOrder$: Observable<any> = this.footerClosOrder.asObservable();

  // sharing data fro close order by service footer to header
  footerClosOrderData(data: any) {
    this.footerClosOrder.next(data);
  }

  //sharing data for modify order by service footer to header
  private sendModefy: Subject<any> = new Subject<any>();
  sendModefy$: Observable<any> = this.sendModefy.asObservable();

  sendModefyData(data: any) {
    this.sendModefy.next(data);
  }

  // sharing data for massage by service header to footer model
  private msgForClientToModify: Subject<any> = new Subject<any>();
  msgForClientToModify$: Observable<any> = this.msgForClientToModify.asObservable();

  msgForClientToModifyData(data: any) {
  
    this.msgForClientToModify.next(data);
  }

}
