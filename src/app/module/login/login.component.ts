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
    isConnectLoading: boolean = false;
    isDemoLoading: boolean = false;
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
   libuysell(tab: string) {
  this.libuysellTab = tab;
  if (tab === 'tab2') {
    this.openDemoAccountForm.reset();
  }
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
        firstName: ['', [Validators.required, this.nameValidator]],
        lastName: ['', [Validators.required, this.nameValidator]],
        email: ['', [Validators.required, this.customEmailValidator]],
        phone: ['', [Validators.required, this.phoneValidator]],
        // accountType: ['Trade MT5 USD', Validators.required],
        deposit: ['5000', Validators.required],
        leverage: ['5000', Validators.required],
        agreeTerms: [false, Validators.requiredTrue],
         server: ['0', [this.invalidSelectValidator]],
      });
    }
  
  invalidSelectValidator: ValidatorFn = (control: AbstractControl) => {
    return control.value == '0' ? { invalidSelect: true } : null;
  };

  nameValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) return null;
    
    const value = control.value.trim();
    
    // Check for empty after trim
    if (!value) return { emptyName: true };
    
    // Check for leading/trailing spaces
    if (control.value !== value) return { extraSpaces: true };
    
    // Check for multiple consecutive spaces
    if (/\s{2,}/.test(control.value)) return { multipleSpaces: true };
    
    // Check for spaces at beginning or end of words
    if (/^\s|\s$/.test(control.value)) return { invalidSpaces: true };

    if (/\d/.test(value)) {
      return { numbersNotAllowed: true };
    }
    return null;
  };
  onNameKeyPress(event: KeyboardEvent) {
    if (/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
  phoneValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) return null;
    
    // Remove any non-digit characters for validation
    const cleanPhone = control.value.replace(/\D/g, '');
    
    // Check if original contains invalid characters
    if (/[-.,\s]/.test(control.value)) return { invalidCharacters: true };
    
    // Check minimum length
    // if (cleanPhone.length > 3) return { minLength: true };
    if (!/^[0-9]{4,16}$/.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  };

  // customEmailValidator: ValidatorFn = (control: AbstractControl) => {
  //   if (!control.value) return null;
    
  //   const email = control.value.toLowerCase();
    
  //   // Check for dot at start
  //   if (email.startsWith('.')) return { dotAtStart: true };
    
  //   // Check for hyphens
  //   if (email.includes('-')) return { hyphenNotAllowed: true };
    
  //   // Check for underscores
  //   if (email.includes('_')) return { underscoreNotAllowed: true };
    
  //   // Check for plus signs
  //   if (email.includes('+')) return { plusNotAllowed: true };
    
  //   // Check for consecutive dots
  //   if (/\.{2,}/.test(email)) return { consecutiveDots: true };
    
  //   // Check domain part
  //   const parts = email.split('@');
  //   if (parts.length !== 2) return { invalidFormat: true };
    
  //   const [localPart, domainPart] = parts;
    
  //   // Check for multiple dots in domain
  //   if ((domainPart.match(/\./g) || []).length > 1) return { multipleSubdomains: true };
    
  //   // Check for domain presence
  //   if (!domainPart || domainPart.length === 0) return { noDomain: true };
    
  //   // Basic email format validation
  //   const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  //   if (!emailRegex.test(email)) return { invalidEmailFormat: true };
    
  //   return null;
  // };
  customEmailValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) return null;
  
    const email = control.value.toLowerCase();
  
    // Rule 1: Cannot start with dot
    if (email.startsWith('.')) return { dotAtStart: true };
  
    // Rule 2: Disallow hyphens, underscores, plus
    if (email.includes('-')) return { hyphenNotAllowed: true };
    if (email.includes('_')) return { underscoreNotAllowed: true };
    if (email.includes('+')) return { plusNotAllowed: true };
  
    // Rule 3: Consecutive dots not allowed
    if (/\.{2,}/.test(email)) return { consecutiveDots: true };
  
    // Rule 4: Split into local + domain
    const parts = email.split('@');
    if (parts.length !== 2) return { invalidFormat: true };
  
    const [localPart, domainPart] = parts;
  
    // Rule 5: Local part validation (letters + optional single dots inside)
    const localRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
    if (!localRegex.test(localPart)) return { invalidLocalPart: true };
  
    // Rule 6: Domain must have at least one dot
    if (!domainPart || !domainPart.includes('.')) return { noDomain: true };
  
    // Rule 7: Only allow one main dot + optional subdomain (gmail.com / domain.co.uk)
    const domainRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
    if (!domainRegex.test(domainPart)) return { invalidDomain: true };
  
    return null;
  };
  
    loginId :any = 771227
    loginDetails:any={}
    login(){
      if (this.connectAccountForm.valid) {
        this.isConnectLoading = true;
        console.log(this.connectAccountForm.value);
        
        let obj ={
          "Account":Number(this.connectAccountForm.value.login),
          "Password":this.connectAccountForm.value.password,
          "BrokerID":this.connectAccountForm.value.server     
        }
        
        this.api.LOGIN_USER_ACCOUNT(obj).subscribe({ 
          next:(res:any)=>{
            console.log("res",res);
            
            if(res.oResult.Result == true){
              this.loginDetails = res
              const updatedData = { ...this.loginDetails, BrokerURL: '' };
              
              this.share.setLoginData(updatedData);
              localStorage.setItem("Sock_Quote", this.loginDetails.Sock_Quote)
              localStorage.setItem("Sock_Trade", this.loginDetails.Sock_Trade)
              localStorage.setItem("PkgId", this.loginDetails.PkgId)
              localStorage.setItem("admin", JSON.stringify(updatedData))
              localStorage.setItem('loginId',this.connectAccountForm.value.login)
              this.toaster.success("Login successfully", "Success");
              
              setTimeout(() => {
                this.isConnectLoading = false;
                this.router.navigate(['/dashboard']).then(() => {
                  location.reload()
                });
              },1000);
            }
            
            if(res.oResult.Result == false){
              this.toaster.error(res.oResult.ADM_MSG, "Error");
            }
          },
          error:(err:any)=>{
            this.isConnectLoading = false;
            this.toaster.error("Connection failed. Please try again.", "Error");
            console.error("Login error:", err);
          }
        })
      } else {
        console.log('Form is invalid');
        this.markFormGroupTouched(this.connectAccountForm);
      }
    }

    loginDisable(): boolean {
      return this.connectAccountForm.invalid || this.isConnectLoading;
    }
    showPassword: boolean = false;

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
    loginDemoDisable(): boolean {
      return (
        this.openDemoAccountForm.invalid ||
        !this.openDemoAccountForm.get('agreeTerms')?.value ||
        this.isDemoLoading
      );
    }
    

    markFormGroupTouched(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
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

   // Phone number input handler
   onPhoneInput(event: any): void {
     const input = event.target;
     const value = input.value;
     
     // Remove any non-digit characters
     const cleanValue = value.replace(/[^0-9]/g, '');
     
     // Update the form control with clean value
     this.openDemoAccountForm.patchValue({ phone: cleanValue });
   }

   // Prevent invalid characters in phone input
   onPhoneKeyPress(event: KeyboardEvent): boolean {
     const charCode = event.which || event.keyCode;
     const char = String.fromCharCode(charCode);
     
     // Allow only digits, backspace, delete, tab, escape, enter
     if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
         // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
         (charCode === 65 && event.ctrlKey) ||
         (charCode === 67 && event.ctrlKey) ||
         (charCode === 86 && event.ctrlKey) ||
         (charCode === 88 && event.ctrlKey)) {
       return true;
     }
     
     // Ensure that it is a number and stop the keypress
     if (!/[0-9]/.test(char)) {
       event.preventDefault();
       return false;
     }
     
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
        "First": this.openDemoAccountForm.value.firstName.trim(),
        "Last": this.openDemoAccountForm.value.lastName.trim(),
        "Mobile": this.openDemoAccountForm.value.phone.replace(/\D/g, ''),
        "Email": this.openDemoAccountForm.value.email.toLowerCase().trim(),
        "BrokerID": this.openDemoAccountForm.value.server,
        "Leverage":this.selectedLeverageValue,
        "Deposit": this.selectedDepositValue,
      }
      
      console.log(this.openDemoAccountForm.value,obj);
      this.isDemoLoading = true;
      this.api.OPEN_ACCOUNT_PB(obj).subscribe({ 
        next:(res:any)=>{
          console.log("res",res);
          
          if(res.Account && res.Password) {
            this.demoAccount = res.Account
            this.demoPass = res.Password
            this.libuysellTab = 'tab9'
            this.isDemoLoading = false;
            this.toaster.success("Demo account created successfully!", "Success");
          } else {
            this.toaster.error("Failed to create demo account. Please try again.", "Error");
          }
        },
        error:(err:any)=>{
          this.isDemoLoading = false;
          this.toaster.error("Server error. Please try again later.", "Error");
          console.error("Demo account creation error:", err);
        }
      })
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.openDemoAccountForm);
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

