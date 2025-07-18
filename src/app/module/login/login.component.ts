import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl,ValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  libuysellTab: any = "tab1"
  brokerAccList:any =[]
  brokerList:any =[]
    connectAccountForm!: FormGroup;
    openDemoAccountForm!:FormGroup
    accountList:any =[]
    accountActiveList:any =[]
    accountUnActiList:any =[]
    constructor( private toaster: ToastrService,private el: ElementRef, private renderer: Renderer2,private share:ShareService,private datePipe: DatePipe,private modalService: NgbModal,private fb: FormBuilder, config: NgbModalConfig, private router:Router,private api: GlobalService) {
      this.accountList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
      this.accountActiveList=  this.accountList.filter((list:any) => list.account === Number(localStorage.getItem('loginId')))
      this.accountUnActiList=  this.accountList.filter((list:any) => list.account != Number(localStorage.getItem('loginId')))

    }
    

    ngOnInit(): void {
      this.createForm();
      this.onDepositChange()
      this.onLeverageChange()
      this.GET_MT_BROKERS()
      // this.GET_USER_ALL_SYMBOLS_v2()
      // this.GET_SYMBOL_PROP()
    }
    brokersList:any=[]
  GET_MT_BROKERS(){
    this.api.GET_MT_BROKERS().subscribe((data:any)=>{
      this.brokersList= data
      //  this.brokersList = [...]; // however you are populating it

  if (this.brokersList && this.brokersList.length > 0) {
    const firstBrokerId = this.brokersList[0].BrokerID;
    this.connectAccountForm.patchValue({ server: firstBrokerId });
    this.openDemoAccountForm.patchValue({ server: firstBrokerId });
  } else {
    // Show placeholder if no brokers
    this.connectAccountForm.patchValue({ server: '0' });
     this.openDemoAccountForm.patchValue({ server: '0' });
  }
    })
  }
    libuysell(tab: any) {
      this.libuysellTab = tab
    }

    createForm() {
     this.connectAccountForm = this.fb.group({
  login: ['', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(16),
    Validators.pattern(/^\d+$/) // Only digits, no letters, spaces, or special characters
  ]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!*\-?&^])[A-Za-z\d@#$%!*\-?&^]{8,}$/)
    // One uppercase, one lowercase, one digit, one special char
  ]],
  server: ['0', [this.invalidSelectValidator]],
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
        agreeTerms: [false, Validators.requiredTrue],
         server: ['0', [this.invalidSelectValidator]],
      });
    }
  
  invalidSelectValidator: ValidatorFn = (control: AbstractControl) => {
  return control.value == '0' ? { invalidSelect: true } : null;
};
    loginId :any = 771227
    loginDetails:any={}
    login(){

      if (this.connectAccountForm.valid) {
        console.log(this.connectAccountForm.value);
        // Handle login logic here
        let obj ={
      
          "Account":Number(this.connectAccountForm.value.login),
          "Password":this.connectAccountForm.value.password,
          "BrokerID":this.connectAccountForm.value.server     
          // wo jayegi jo hm varify manager mai bhejre h
      
      }
      this.api.LOGIN_USER_ACCOUNT(obj).subscribe({ next:(res:any)=>{
        console.log("res",res);
        if(res.oResult.Result == true){
        
          this.loginDetails = res
          const updatedData = { ...this.loginDetails, BrokerURL: '' }; // Merge BrokerURL into data
          
          this.share.setLoginData(updatedData);
          localStorage.setItem("Sock_Quote", this.loginDetails.Sock_Quote)
          localStorage.setItem("Sock_Trade", this.loginDetails.Sock_Trade)
          localStorage.setItem("PkgId", this.loginDetails.PkgId)
          localStorage.setItem("admin", JSON.stringify(updatedData))
          localStorage.setItem('loginId',this.connectAccountForm.value.login)
          this.toaster.success("Login successfully", "Success");
          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(() => {
                    this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
                    location.reload()
          });
          
          },1000);
         
        }
        if(res.oResult.Result == false){
          this.toaster.error(res.oResult.ADM_MSG, "Error");
        }
         
      }})
      } else {
        console.log('Form is invalid');
        
      }
    
    }

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
      this.api.GET_MT_USER_INFO(obj).subscribe({
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


demoAccount:any
demoPass:any
   openDemoAccount() {
    if (this.openDemoAccountForm.valid) {
    
      let obj = {
      
        "Key": "",
        "First": this.openDemoAccountForm.value.firstName,
        "Last": this.openDemoAccountForm.value.lastName,
        "Mobile": this.openDemoAccountForm.value.phone,
        "Email": this.openDemoAccountForm.value.email,
        "BrokerID": 100,
        "Leverage":this.selectedLeverageValue,
        "Deposit": this.selectedDepositValue,
        // "ERR_CODE": 1

       
    }
    console.log(this.openDemoAccountForm.value,obj);
    this.api.OPEN_ACCOUNT_PB(obj).subscribe({ next:(res:any)=>{
      console.log("res",res);
      this.demoAccount = res.Account
      this.demoPass = res.Password
      this.libuysellTab = 'tab9'
      
    }})
    } else {
      console.log('Form is invalid');
    }
  }

  getAcc:any 
  getAccount(val:any){
    this.getAcc = val
  }

   DeleteAcc(val:any){
    console.log("DeleteAcc",val);
   
    let brokerAccList = JSON.parse(localStorage.getItem('brokerAccList') || '[]')
 
    // Step 2: Filter out the account to be deleted
    brokerAccList = brokerAccList.filter((item:any) => item.account !== val);
 
    localStorage.setItem('brokerAccList', JSON.stringify(brokerAccList));

    setTimeout(() => {
      this.router.navigate(['/login']).then(() => {
              this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
              location.reload()
            });
    
    },500);
 }

  

   selectedDepositValue: any;
   selectedLeverageValue: any;
   onDepositChange() {
    this.openDemoAccountForm.get('deposit')?.valueChanges.subscribe((value:any) => {
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
    this.openDemoAccountForm.get('leverage')?.valueChanges.subscribe((value:any) => {
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
    this.api.GET_MT_USER_INFO(obj).subscribe({
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
  this.api.LOGIN_ACCOUNT(obj).subscribe({ next:(res:any)=>{
    console.log("res",res);
    if(res.Result == true){
      localStorage.setItem('loginId',this.listOb.account)
      setTimeout(() => {
           
        this.router.navigate(['/dashboard']).then(() => {
                this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
                location.reload()
              });
           
      
      },100);
     
     
    }
    else{

    }
     
  }})
  }

  //checking apis 
GET_USER_ALL_SYMBOLS_v2(){

  let obj ={
    "Key":"",
    "Account":90912,
    "PkgID":100
}
this.api.GET_USER_ALL_SYMBOLS_v21(obj).subscribe({ next:(res:any)=>{
  console.log("res",res);
  
}})

}


GET_SYMBOL_PROP(){

  let obj ={
    "Key":"",
    "Symbol":"AUDJPY"
}
this.api.GET_SYMBOL_PROP(obj).subscribe({ next:(res:any)=>{
  console.log("res",res);
  
}})

}
}

