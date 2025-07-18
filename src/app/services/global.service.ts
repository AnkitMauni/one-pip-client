import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  domain = environment.domain;
  constructor(private http: HttpClient, private router: Router) {

  }


  private sidenavState = new BehaviorSubject<boolean>(false);
  sidenavState$ = this.sidenavState.asObservable();

  toggleSidenav(): void {
    console.log("acse",this.sidenavState.value);
    
    this.sidenavState.next(!this.sidenavState.value);
  }

  // https://apimt.traderscabinet.com/Tradersroom_API_traderscabinetmt/GET_MGR_GROUPS?ManagerID=1061
  GET_MGR_GROUPS(obj:any){
    return this.http.get(this.domain + "GET_MGR_GROUPS?ManagerID="+obj);
  }

  GET_ADM_GROUPS_BRF(obj:any){
    return this.http.get(this.domain + "GET_ADM_GROUPS_BRF?Group="+obj);
  }
  GET_ADM_RPT_POS_GROUPS_ALL(obj:any){
    return this.http.get(this.domain + "GET_ADM_RPT_POS_GROUPS_ALL",obj);
  }

  GET_USERS_ALL(obj:any){
    return this.http.post(this.domain +'GET_MGR_USERS',obj);
  }

  VERIFY_MANAGER(obj:any){
    return this.http.post(this.domain + "VERIFY_MANAGER",obj);
  }

  LOGIN_USER_ACCOUNT(obj:any){
    return this.http.post(this.domain + "LOGIN_USER_ACCOUNT",obj);
  }

  GET_MQ_SECU_SYMBOLS(obj: any) {
    // Convert the object to a string and remove unwanted characters
    let filterValue = obj
  
    // Create HttpParams with the cleaned filter value
    const params = new HttpParams().set('Filter', filterValue);
  
    return this.http.get(`${this.domain}GET_MQ_SECU_SYMBOLS`,{ params });
  }

  GET_ADM_GROUPS_ALL(){
    return this.http.get(`${this.domain}GET_ADM_GROUPS_ALL`); 
  }

  GET_USER_TRADE_WD(obj: any){
    return this.http.get(this.domain + 'GET_USER_TRADE_WD?Account=' + obj.acc);
 }

 GET_MT_USER_INFO(obj: any){
  return this.http.post(this.domain + 'GET_MT_USER_INFO', obj);
}
MAKE_CHANGE_PASSWORD(obj:any){
   return this.http.post(this.domain + 'MAKE_CHANGE_PASSWORD', obj);
}
 GET_USER_HISTORY(obj: any){
  return this.http.post(this.domain + 'GET_USER_POS_HIS', obj);
   
}
OPEN_DEMO_ACCOUNT(obj: any){
  return this.http.post(this.domain + 'OPEN_DEMO_ACCOUNT', obj);
   
}
OPEN_ACCOUNT_PB(obj:any){
  return this.http.post(this.domain + 'OPEN_ACCOUNT_PB', obj);
}
LOGIN_ACCOUNT(obj: any){
  return this.http.post(this.domain + 'LOGIN_ACCOUNT', obj);
}

MAKE_CLOSE_ORDER(obj: any){
  return this.http.post(this.domain + 'MAKE_CLOSE_ORDER', obj);
}


GET_DM_HG_CHRT(obj: any) {
  return this.http.post(this.domain + 'GET_DM_HG_CHRT', obj);
}


  // https://apimt.traderscabinet.com/Tradersroom_API_traderscabinetmt/GET_SYMBOL_PROP_GET?
  
  GET_SYMBOL_PROP_GET(obj:any){
    return this.http.get(`${this.domain}GET_SYMBOL_PROP_GET?Symbol=`+obj);
  }
  ADD_EDIT_ADM_GROUP_COMMISSION(obj:any){
    return this.http.post(`${this.domain}ADD_EDIT_ADM_GROUP_COMMISSION`,obj);
  }
  
  DEL_ADM_GROUPS(obj:any){
    let filterValue = obj
  
    // Create HttpParams with the cleaned filter value
    const params = new HttpParams()
    .set('Group', filterValue.Group)
    .set('Security', filterValue.Security);
    return this.http.get(`${this.domain}DEL_ADM_GROUPS`,{ params });
}


GET_USER_OPEN_RT(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('ManagerIndex', filterValue.ManagerIndex)
  .set('Account', filterValue.Account);
  return this.http.get(`${this.domain}GET_USER_OPEN_RT`,{params});
}
GET_USER_OPEN_POS(obj:any){
  return this.http.post(`${this.domain}GET_USER_OPEN_POS`,obj)
}
GET_MGR_ORDS(obj:any){
  return this.http.post(`${this.domain}GET_MGR_ORDS`,obj);
}
  
GET_MGR_POSs(obj:any){
  return this.http.post(`${this.domain}GET_MGR_POSs`,obj);
}

GET_MQ_SEC_SYMBOLS(){
  return this.http.get(`${this.domain}GET_MQ_SEC_SYMBOLS`); 
}
  
  
  GET_MQ_SECURITIES(){
    return this.http.get(this.domain + `GET_MQ_SECURITIES?Key=`);
  }
  
  ADD_EDIT_ADM_GROUP_SYMBOLS(obj:any){
    return this.http.post(`${this.domain}ADD_EDIT_ADM_GROUP_SYMBOLS`,obj);
  }

  EDIT_USER_FINO(obj:any){
    return this.http.post(`${this.domain}EDIT_USER_FINO`,obj);
  }

  GET_OPENED(obj:any){
    let filterValue = obj
  
    // Create HttpParams with the cleaned filter value
    const params = new HttpParams()
    .set('ManagerIndex', filterValue.ManagerIndex)
    .set('Account', filterValue.Account);
    return this.http.get(`${this.domain}GET_OPENED`,{ params });
}

GET_MGR_POS_BY_USERID(obj:any){
  // let filterValue = obj

  // // Create HttpParams with the cleaned filter value
  // const params = new HttpParams()
  // .set('Key', filterValue.Key)
  // .set('ManagerIndex', filterValue.ManagerIndex)
  // .set('Account', filterValue.Account);
  return this.http.post(`${this.domain}GET_MGR_POS_BY_USERID`,obj);
}

GET_MGR_POS_USERID_HIS(obj:any){
  // let filterValue = obj

  // Create HttpParams with the cleaned filter value
  // const params = new HttpParams()
  // .set('Account', filterValue.Account)
  // .set('dtFrom', filterValue.dtFrom)
  // .set('dtTo', filterValue.dtTo)
  // .set('ManagerIndex', filterValue.ManagerIndex);
  return this.http.post(`${this.domain}GET_MGR_POS_USERID_HIS`,obj);
}

GET_MGR_DEALS_USERID_HIS(obj:any){
  // let filterValue = obj

  // // Create HttpParams with the cleaned filter value
  // const params = new HttpParams()
  // .set('Account', filterValue.Account)
  // .set('dtFrom', filterValue.dtFrom)
  // .set('dtTo', filterValue.dtTo)
  // .set('ManagerIndex', filterValue.ManagerIndex);
  return this.http.post(`${this.domain}GET_MGR_DEALS_USERID_HIS`,obj);
}
GET_CLOSED(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('StartTm', filterValue.StartTm)
  .set('EndTm', filterValue.EndTm)
  .set('ManagerIndex', filterValue.ManagerIndex);
  return this.http.get(`${this.domain}GET_CLOSED`,{ params });
}

GET_MGR_SUMMARY(obj:any){
 
  return this.http.post(`${this.domain}GET_MGR_SUMMARY`,obj);
}

GET_MGR_JOURNEL(obj:any){
 
  return this.http.post(`${this.domain}GET_MGR_JOURNEL`,obj);
}

GET_MGR_EXPOSURE(obj:any){
 
  return this.http.post(`${this.domain}GET_MGR_EXPOSURE`,obj);
}

ENABLE_TRADING(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Enable_Disable', filterValue.Enable_Disable)
  .set('ManagerIndex', filterValue.ManagerIndex);
  return this.http.get(`${this.domain}ENABLE_TRADING`,{ params });
}

CHANGE_INVESTOR_PASSWORD(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('ManagerIndex', filterValue.ManagerIndex)
  .set('Account', filterValue.Account)
  .set('Password', filterValue.Password)
  return this.http.get(`${this.domain}CHANGE_INVESTOR_PASSWORD`,{ params });
}

CHANGE_MASTER_PASSWORD(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Password', filterValue.Password)
  .set('ManagerIndex', filterValue.ManagerIndex)
  return this.http.get(`${this.domain}CHANGE_MASTER_PASSWORD`,{ params });
}

MAKE_DEPOIST_BALANCE(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Amount', filterValue.Amount)
  .set('Comment', filterValue.Comment)
  .set('ManagerIndex', filterValue.ManagerIndex)
  return this.http.get(`${this.domain}MAKE_DEPOIST_BALANCE`,{ params });
}

MAKE_WITHDRAW_BALANCE(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Amount', filterValue.Amount)
  .set('Comment', filterValue.Comment)
  .set('ManagerIndex', filterValue.ManagerIndex)
  return this.http.get(`${this.domain}MAKE_WITHDRAW_BALANCE`,{ params });
}

MAKE_DEPOIST_CREDIT(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Amount', filterValue.Amount)
  .set('Comment', filterValue.Comment)
  .set('ManagerIndex', filterValue.ManagerIndex)
  return this.http.get(`${this.domain}MAKE_DEPOIST_CREDIT`,{ params });
}

MAKE_WITHDRAW_CREDIT(obj:any){
  let filterValue = obj

  // Create HttpParams with the cleaned filter value
  const params = new HttpParams()
  .set('Account', filterValue.Account)
  .set('Amount', filterValue.Amount)
  .set('Comment', filterValue.Comment)
  .set('ManagerIndex', filterValue.ManagerIndex)
  return this.http.get(`${this.domain}MAKE_WITHDRAW_CREDIT`,{ params });
}

GET_QUOTE_BY_SYMBOL(obj:any){
  
  return this.http.get(`${this.domain}GET_QUOTE_BY_SYMBOL?Symbol=`+obj);
}

MAKE_NEW_ORDER(obj:any){
  
  return this.http.post(`${this.domain}MAKE_NEW_ORDER`,obj);
}

GET_USER_SUBSCRIBE_MK_v2(obj:any){
  
  return this.http.post(`${this.domain}GET_USER_SUBSCRIBE_MK_v2`,obj);
}




GET_USER_ALL_SYMBOLS_WEB(obj: any){
  return this.http.post(this.domain + 'GET_USER_ALL_SYMBOLS_WEB', obj);
}


GET_USER_ALL_SYMBOLS_v2(obj: any){
  return this.http.post(this.domain + 'GET_USER_ALL_SYMBOLS_v3', obj);
}

GET_USER_ALL_SYMBOLS(obj: any){
  return this.http.post(this.domain + 'GET_USER_ALL_SYMBOLS', obj);
}

DEL_MQ_SYMBOLS(obj:any){
  
  return this.http.post(`${this.domain}DEL_MQ_SYMBOLS`,obj);
}
GET_MT_BROKERS(){
  return this.http.get(`https://connectapi.onepip.app/api/GET_MT_BROKERS`);
}
GET_SYMBOL_INITIAL(obj: any){
  return this.http.post(this.domain + 'GET_SYMBOL_PROP', obj);
}

SUBSCRIBE_SYMBOL(obj: any){
  return this.http.post(this.domain + 'SUBSCRIBE_SYMBOL', obj);
}


GET_USER_ALL_SYMBOLS_v21(obj:any){
  return this.http.post(this.domain + 'GET_USER_ALL_SYMBOLS_v2', obj);
}
GET_SYMBOL_PROP(obj:any){
  return this.http.post(this.domain + 'GET_SYMBOL_PROP', obj);
}

}
