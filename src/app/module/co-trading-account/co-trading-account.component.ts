import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig,  NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-co-trading-account',
  standalone: true,
  imports: [NgbNavModule,CommonModule,FormsModule,ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './co-trading-account.component.html',
  styleUrls: ['./co-trading-account.component.scss']
})
export class CoTradingAccountComponent implements OnInit {
  startDate:any
  endDate:any
  personalForm!: FormGroup;
  active:any =1
  ChangePassForm!:FormGroup
  balanceForm!:FormGroup
limitForm!: FormGroup;
tradeForm!:FormGroup
accountForm!: FormGroup;
private intervalId: any;
cha!: FormGroup;
isOpen = false;
 
  index = 0;
  
  
  selectedNode1 = undefined;
  sideBarData1: any = false;
  isOpen1 = false;

  index1 = 0;
  menu1: any;
  expand1: any = {};
  selectedNode2 = undefined;
  sideBarData2: any = false;
  isOpen2 = false;
  private marketDataSubscription: any = Subscription;
  index2 = 0;
  menu2: any;
  expand2: any = {};
  private element:any= HTMLElement;

  private element1:any= HTMLElement;
  private element2:any= HTMLElement;
  countries: string[] = [
    'All Country','Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 
  'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 
  'Colombia', 'Comoros', 'Congo, Democratic Republic of the', 'Congo, Republic of the', 
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 
  'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 
  'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
  'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 
  'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  language: string [] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Portuguese",
    "Russian",
    "Italian",
    "Hindi",
    "Bengali",
    "Punjabi",
    "Urdu",
    "Turkish",
    "Vietnamese",
    "Persian",
    "Polish",
    "Dutch",
    "Greek",
    "Czech",
    "Swedish",
    "Hungarian",
    "Finnish",
    "Danish",
    "Thai",
    "Hebrew",
    "Indonesian",
    "Malay",
    "Romanian",
    "Bulgarian",
    "Slovak",
    "Croatian",
    "Serbian",
    "Norwegian",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Slovenian",
    "Maltese",
    "Icelandic",
    "Filipino",
    "Swahili",
    "Zulu",
    "Afrikaans"
  ]
  constructor( private el: ElementRef, private renderer: Renderer2,private share:ShareService,private datePipe: DatePipe,private modalService: NgbModal,private fb: FormBuilder, config: NgbModalConfig, private router:Router,private api: GlobalService) {
    config.backdrop = 'static';
		config.keyboard = false;
    
  }

  

  ngOnInit(): void {
    
    this.element = this.el.nativeElement.querySelector('#yourElementId');
    this.element1 = this.el.nativeElement.querySelector('#yourElementId2');
    this.element2 = this.el.nativeElement.querySelector('#yourElementId3');
      if (this.element) {
    this.renderer.listen(this.element, 'contextmenu', this.onRightClick.bind(this));
 
      }
    
      if (this.element1) {
     
        this.renderer.listen(this.element1, 'contextmenu', this.onRightClick1.bind(this));
       }
       if (this.element2) {
        this.renderer.listen(this.element2, 'contextmenu', this.onRightClick1.bind(this));
     
          }
    this.personalForm = this.fb.group({
      name: [''],
      lastName: [''],
      middleName: [''],
      company: [''],
      registered: [''],
      language: [''],
      status: [''],
      idNumber: [''],
      leadCampaign: [''],
      metaQuotesId: [''],
      leadSource: [''],
      email: [''],
      phone: [''],
      country: [''],
      state: [''],
      city: [''],
      zipCode: [''],
      address: [''],
      comment: ['']
    });
  
   this.limitForm = this.fb.group({
    oET:[],
    oE_API:[],
   
   });

   this.balanceForm = this.fb.group({
    operationType: [''] ,
    amount:[''],
    comment: ['']
   });

   this.ChangePassForm = this.fb.group({
    ChangeInvP:[''],
    ChangeMasterP:['']
   });

   this.accountForm = this.fb.group({
    group:[],
    oEA:[],
    oEP:[],
   
   })

   this.tradeForm= this.fb.group({
    tradeSymbol:[''],
    ordType: ['2'] ,
    tradeType: ['0'] ,
    Lot:[1],
    Price:[1],
    AtPrice:[1],
    SL:[0],
    PL:[0],
    fillType:[1],
    Expiry:[0],
    ExpTime:[''],
    comment:['']
   })
    this.getAllTradingUser()
    this.getAllExposure()
    this.getAllSecurities() 
  }
  allModelData:any ={}
  listOpen:any =[]
  modelRef:any
  data:any=[]
  symbolData:any = {}
symbolObj :any ={}
  openXl(content: any, modelData:any) {
    // this.marketDataSubscription = this.share.allMarketLiveData$.subscribe((res: any) => {
      this.modeOrdePosDeals = 1
    this.showHideRes = 0
    this.showHideRes1 = 0
    this.isReadonly = true
    this.allModelData = modelData
    console.log("this.allModelData",this.allModelData);
    
    this.GET_OPENED1()
   
    this.GET_MGR_GROUPS()
    
    this.setDateRange('today')
    const val = {
      name:this.allModelData.NF ,
      lastName: "",
      middleName: "",
      company: "",
      registered: "",
      language: "",
      status: "",
      idNumber: "",
      leadCampaign: "",
      metaQuotesId: "",
      leadSource: "",
      email: "",
      phone: this.allModelData?.P,
      country: this.allModelData?.CY,
      state: this.allModelData.S,
      city: this.allModelData.C,
      zipCode: this.allModelData.Z,
      address: this.allModelData.A,
      comment: " "
    }
    this.personalForm.patchValue(val);
    const limitF = {
      oET: this.allModelData?.oET,
      oE_API:this.allModelData?.oE_API
    }
    this.limitForm.patchValue(limitF);
    const account = {
      group:this.allModelData?.GP,
    oEA:this.allModelData?.oEA,
    oEP:this.allModelData?.oEP,
    oE_API:this.allModelData?.oE_API
    }
    this.accountForm.patchValue(account);

    const balanceF ={
      operationType: 'Balance' ,
    comment: '... put your comment here...'
    }
    this.balanceForm.patchValue(balanceF);
    this.tradeForm.patchValue(
      {
        ordType: '2' ,
        tradeType: '0' ,
        Lot:1,
        Price:1,
        AtPrice:1,
        SL:0,
        PL:0,
        fillType:1,
        Expiry:0,
        tradeSymbol:'AUDUSD Australian Dollar vs US Dollar'
      }
    )
    this.tradeSym = 'AUDUSD'
    
   
    this.changeSymbolData(this.tradeSym)
    // this.GET_QUOTE_BY_SYMBOL(this.tradeSym)
    // this.startInterval()
    this.modelRef = this.modalService.open(content, { size: 'xl modalone-two lg850', centered: true });
  }

changeAskBid:any =[]
  changeSymbolData(val:any){
  
    
    this.share.allMarketLiveData$.subscribe((res: any) => {
      this.data = res.filter((item: any) => item?.oSymbolConfig?.Symbol === val);
      this.tradeForm.patchValue({
        AtPrice: this.data[0]?.oInitial.Ask
      })
      
    })
    // localStorage.setItem('Ask',this.data.oInitial.Ask)
    //   localStorage.setItem('Bid',this.data.oInitial.Bid)
  
  }

  startInterval(): void {
    this.intervalId = setInterval(() => {
     this.GET_QUOTE_BY_SYMBOL(this.tradeSym)
    }, 100000); // Executes every 2 seconds
  }

  clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  closeModel(){
    this.modelRef.close()
    this.tradeForm.reset()

    this.clearInterval()
  }

  GET_QUOTE_BY_SYMBOL(val:any){
    this.symbolObj = localStorage.getItem("tradeData")
    this.symbolData = JSON.parse(this.symbolObj)
    this.tradeForm.patchValue({
      AtPrice: this.symbolData?.oInitial?.Bid
    })
   this.api.GET_QUOTE_BY_SYMBOL(val).subscribe({next:(res:any)=>{
    this.symbolData = res
    localStorage.setItem("tradeData",JSON.stringify(this.symbolData))
    this.symbolObj = localStorage.getItem("tradeData")
    this.symbolData = JSON.parse(this.symbolObj)
    this.tradeForm.patchValue({
      AtPrice: this.symbolData.Ask
    })
   },error:(err:any)=>{
    console.log(err);
    
   }})
  }

  updateData(){

    this.tradeForm.patchValue({
      AtPrice: this.symbolData.Ask
    })
  }
  listOpenObj:any ={}

  GET_OPENED1(){
    let obj ={
      Key:"",
      ManagerIndex:Number(localStorage.getItem('managerId')),
      Account:this.allModelData.AC
    }

    this.api.GET_MGR_POS_BY_USERID(obj).subscribe({next: (res:any)=>{
      
      this.listOpen = res.lstPos
      console.log("dddd",res);
    },
    error: (err:any)=>{
      console.log(err);
      
    }})
  }
 

  modeOrdePosDeals:any = 1
  clickModeType(val:any){

    if(val == 1){
      this.modeOrdePosDeals = 1
    }
    else if(val == 2){
      this.modeOrdePosDeals = 2
      this.GET_OPENED1()
    }
    else if(val == 3){
      this.modeOrdePosDeals = 3
    }
    this.showContextMenu2 = false
  }
 
  navigate(val:any){
    this.router.navigateByUrl(val)
  }

  selectedRowIndex:any
  getSelectRow(index:any){
    this.selectedRowIndex = index
  }

  allTradeUser:any =[]
  getAllTradingUser(){
    // this.share.loader(true)
    // let data = localStorage.getItem('allTradeUser') || '[]';
    // this.allTradeUser = JSON.parse(data)
  
    let obj = {
      "Account":Number(localStorage.getItem('loginId')),     // NOTE:- NEED TO SEND MANAGERID IN THIS PARAM
      "ManagerIndex":Number(localStorage.getItem('managerId'))
    }
    this.api.GET_USERS_ALL(obj).subscribe({ next:(res:any)=>{
     
      if(this.allTradeUser){
        this.allTradeUser = res
        localStorage.setItem('allTradeUser',JSON.stringify(this.allTradeUser))
      }
      else if(!this.allTradeUser){
        let data = localStorage.getItem('allTradeUser') || '[]';
        this.allTradeUser = JSON.parse(data)
      }
      
      // this.share.loader(false)
      console.log("this.allTradeUser",this.allTradeUser);
      
    }, error : (err:any)=>{
      console.log(err);
      
      this.share.loader(false)
    }})
  }

  EDIT_USER_FINO(){
    let per = this.personalForm.value
    let  obj = {
      "AC":this.allModelData.AC,
      "NF":per.name,
      "NL":per.lastName,
      "e":per.email,
      "P":per.phone,
      "A":per.address,
      "C":per.country,
      "S":per.state,
      "CY":per.city,
      "Z": per.zipCode,
      "LV":5000,
      "oEA":this.accountForm.value.oEA,
      "oEP":this.accountForm.value.oEP,
      "oET":this.limitForm.value.oET
  }
  this.api.EDIT_USER_FINO(obj).subscribe({ next: (res:any)=>{
    console.log(res,"edit");
    this.getAllTradingUser()
  },
error: (err:any)=>{
  console.log(err);
  
}})
  }

  setValDate:any = 'Today'
  setDateRange(range: string) {
    this.setValDate = range
    const today = new Date();
    console.log("today",today);
    
    let start: Date;
    let end: Date = new Date(); // Ensure 'end' is a new instance of today's date
  
    switch(range) {
      case 'Today':
        start = new Date();
        break;
      case 'last3Days':
        start = new Date();
        start.setDate(today.getDate() - 3);
        break;
      case 'lastWeek':
        start = new Date();
        start.setDate(today.getDate() - 7);
        break;
      case 'lastMonth':
        start = new Date();
        start.setMonth(today.getMonth() - 1);
        break;
      case 'last3Months':
        start = new Date();
        start.setMonth(today.getMonth() - 3);
        break;
      case 'last6Months':
        start = new Date();
        start.setMonth(today.getMonth() - 6);
        break;
      case 'allHistory':
        start = new Date(1970, 0, 1); // Arbitrary start date
        break;
      default:
        start = new Date();
    }
  
    this.startDate = formatDate(start, 'yyyy-MM-dd', 'en');
    this.endDate = formatDate(end, 'yyyy-MM-dd', 'en');
    this.GET_CLOSED()
  }
  
 allHistory:any ={}
 allHistoryList:any =[]
  GET_CLOSED(){

    let obj ={
  Account:Number(this.allModelData.AC),
  StartTm:`${this.startDate} 00:00:59`,
  EndTm:`${this.endDate} 11:59:59`,
  ManagerIndex:Number(localStorage.getItem('managerId')),
    }

    
    this.api.GET_CLOSED(obj).subscribe({next:( res:any)=>{
      console.log("ress histoo",res);
      this.allHistory = res
      this.allHistoryList = res.lstCLOSE
    },
      error:(err:any)=>{
        console.log("err",err);
        
      }})
  }

  onCheckboxChange1(event: any, controlName: string): void {
    const isChecked = event.target.checked;
    this.limitForm.get(controlName)?.setValue(isChecked ? 1 : 0);
    console.log("this.limitForm",this.limitForm.value.oET);
    this.ENABLE_TRADING()
  }


  ENABLE_TRADING(){
    let obj={
    Account:Number(this.allModelData.AC),
    Enable_Disable:this.limitForm.value.oET,
    ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.ENABLE_TRADING(obj).subscribe({next:(res:any)=>{
         console.log(res,"Enabel");
         
    },error:(err:any)=>{
      console.log(err);
      
    }})
  }
  onCheckboxChange(event: any, controlName: string): void {
    const isChecked = event.target.checked;
    this.accountForm.get(controlName)?.setValue(isChecked ? 1 : 0);
    console.log("this.accountForm",this.accountForm.value.oEA);
    console.log("this.accountForm",this.accountForm.value.oEP);
    
  }

  CHANGE_INVESTOR_PASSWORD(){
    let obj ={
     ManagerIndex:Number(localStorage.getItem('managerId')),
     Account:Number(this.allModelData.AC),
     Password:this.limitForm.value.ChangePassForm,
    }
    this.api.CHANGE_INVESTOR_PASSWORD(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  }

  CHANGE_MASTER_PASSWORD(){
    let obj ={
      Account:Number(this.allModelData.AC),
      Password:this.ChangePassForm.value.ChangeMasterP,
     ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.CHANGE_MASTER_PASSWORD(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  }
  
  perationTypes:any = [
    'Balance', 'Credit', 'Charge', 'Correction', 'Bonus', 
    'Commission', 'Dividend', 'Franked Dividend', 'Tax', 
    'SO compensation', 'SO Credit Compensation'
  ];

  operationTypes1: any = [
    'Deposit', 'Withdrawal', 'Deposit from #put your bank', 
    'Withdraw to #put your bank', 'Credit In', 'Credit Out', 
    '... put your comment here...'
  ];
  isCommentSelected = false;

  onOperationTypeChange() {
    const selectedType = this.balanceForm.get('operationType')?.value;
    this.OprationType(selectedType);
  }

  perationTypesVal:any = 'Balance'
  OprationType(type: string) {
    console.log('Selected Operation Type:', type);
    this.perationTypesVal= type
    // Implement your logic here based on the selected operation type
  }
  
 perationTypesVal1:any = 'Deposit'
  onOperationTypeChange1() {
    const selectedType = this.balanceForm.get('comment')?.value;
    this.isCommentSelected = selectedType === '... put your comment here...';
  }
  
  isDropdownOpen:any = false
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    if (option === '... put your comment here...') {
      // Set the input value to empty if "put your comment here" is selected
      this.balanceForm.get('comment')?.setValue('... put your comment here...');
    } else {
      // Set the input value to the selected option
      this.balanceForm.get('comment')?.setValue(option);
    }
    this.isDropdownOpen = false; // Close the dropdown after selection
  }

  MAKE_DEPOIST_BALANCE(){
    let obj ={
      Account:Number(this.allModelData.AC),
      Amount: Number(this.balanceForm.value.amount),
      Comment:this.balanceForm.value.comment,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.MAKE_DEPOIST_BALANCE(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  }

  MAKE_WITHDRAW_BALANCE(){
    let obj ={
      Account:Number(this.allModelData.AC),
      Amount: Number(this.balanceForm.value.amount),
      Comment:this.balanceForm.value.comment,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.MAKE_WITHDRAW_BALANCE(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  }

  MAKE_DEPOIST_CREDIT(){
    let obj ={
      Account:Number(this.allModelData.AC),
      Amount: Number(this.balanceForm.value.amount),
      Comment:this.balanceForm.value.comment,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.MAKE_DEPOIST_CREDIT(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  }

  MAKE_WITHDRAW_CREDIT(){
    let obj ={
      Account:Number(this.allModelData.AC),
      Amount: Number(this.balanceForm.value.amount),
      Comment:this.balanceForm.value.comment,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.MAKE_DEPOIST_CREDIT(obj).subscribe({next:(res:any)=>{
      console.log(res,"change");
      
 },error:(err:any)=>{
   console.log(err);
   
 }})
  } 

  
  listAllGroup:any =[]
  getAllGroup:any =[]
  thumbPath:any
  getAllGroupConvert:any =[]
  GET_MGR_GROUPS(){
  
    
     this.listAllGroup = localStorage.getItem('group') || '[]';
    
     let groupData = JSON.parse(this.listAllGroup)
    
     let currentLevel: any = {};
     
     // Function to build the menu tree
     const buildMenuTree = (data: string[]) => {
         const tree: any = {};
     
         data.forEach((item: string) => {
             const parts = item.split("\\");
             currentLevel = tree;
     
             parts.forEach((part: string, index: number) => {
                 if (!currentLevel[part]) {
                     currentLevel[part] = index === parts.length - 1 ? null : {};
                 }
                 currentLevel = currentLevel[part];
             });
         });
     
         return tree;
     };
     
     // Function to format the menu tree
     const formatMenuTree = (tree: any, basePath = ""): any[] => {
         return Object.keys(tree).map((key: string) => {
             const submenu = tree[key] ? formatMenuTree(tree[key], `${basePath}/${key}`) : [];
     
             let thumbPath = "";
     
             // Logic to determine thumb path based on number of backslashes in basePath
             if (basePath.includes("/")) {
                 thumbPath = "assets/images/sideimg/mt-icons12-2.png";
             } else {
                 thumbPath = "assets/images/sideimg/mt-icons12-1.png";
             }
     
             return {
                 path: basePath || "/",
                 title: key,
                 thumb: thumbPath,
                 icon: "",
                 class: "",
                 label: "",
                 labelClass: "",
                 extralink: false,
                 submenu: submenu
             };
         });
     };
     
     // Build and format the menu tree
     const menuTree = buildMenuTree(groupData);
     const formattedMenu = formatMenuTree(menuTree);
     
     // Convert the formatted menu to the required structure
     this.getAllGroupConvert = formattedMenu;
     this.menu1 = this.getAllGroupConvert.map(this.toNode1.bind(this));

  
    
  }


  selectNode1(node: any) {
    console.log('Selecting node for selectNode1:', node);
   
    this.selectedNode1 = node;
    
    this.accountForm.patchValue(
      {
       
        group:node.title
      }
    )
  
   
    this.isDropdownOpen1 = false; // Close the dropdown
   
  }

    
isDropdownOpen1 = false;
toggleDropdown1() {
  
  this.isDropdownOpen1 = !this.isDropdownOpen1;
}

private toNode1(x: any): any {
  const y: any = { ...x };
  y.index = ++this.index1;
  for (let n = 0; n < y.submenu.length; n++) {
    y.submenu[n] = this.toNode1(y.submenu[n]);
  }
  return y;
}

toggleVisible1(node: any) {
console.log("node", node)

  if (node.submenu && node.submenu.length) {
    if (this.expand1[node.index]) {
      this.expand1[node.index] = false;
    } else {
      this.expand1[node.index] = true;
    }
  }
}


private toNode2(x: any): any {
  const y: any = { ...x };
  y.index = ++this.index;
  for (let n = 0; n < y.submenu.length; n++) {
    y.submenu[n] = this.toNode2(y.submenu[n]);
  }
  return y;
}


toggleVisible2(node: any) {
  console.log("node", node.title)

    if (node.submenu && node.submenu.length) {
      if (this.expand2[node.index]) {
        this.expand2[node.index] = false;
      } else {
        this.expand2[node.index] = true;
      }
    }
  }

tradeSym:any
  selectNode2(node: any) {
      
    console.log('Selecting node for selectNode:', node);
    this.selectedNode2 = node.title;
  
    let trimmedPath = node.path.split('/').pop();

    this.tradeForm.patchValue(
      {
       
        tradeSymbol:node.title
      }
    )
    this.tradeSym = trimmedPath
    this.changeSymbolData(this.tradeSym)
    // this.GET_QUOTE_BY_SYMBOL(this.tradeSym)
    console.log("trimmedPath",trimmedPath);
    this.isDropdownOpen2 = !this.isDropdownOpen2;

  // this.isDropdownOpen2 = false; // Close the dropdown

}
 
isDropdownOpen2 = false;


toggleDropdown2() {
  
  this.isDropdownOpen2 = !this.isDropdownOpen2;
}


getAllSymbol2:any=[]
getAllSymbol:any =[]
getAllSecurities() {
  
  this.getAllSymbol = JSON.parse(localStorage.getItem('getAllSymbol') || '[]');
  console.log("this.getAllSymbol",this.getAllSymbol);
  
 
    this.getAllSymbol2= this.generateMenu(this.getAllSymbol)
     console.log(this.getAllSymbol2);
    this.menu2 = this.getAllSymbol2.map(this.toNode2.bind(this));
 
  
}

generateMenu(data: any[]): any[] {
  const thumbPath = 'assets/images/sideimg/mt-icons22.png';

  const processSecrity = (secrity: string) => {
    const parts = secrity.split('\\');
    return parts.map((part, index) => ({
      path: parts.slice(0, index + 1).join('/'),
      title: part
    }));
  };

  const tree: any = [];

  data.forEach(category => {
    const pathParts = processSecrity(category.Secrity);
    let currentLevel = tree;

    pathParts.forEach((part, index) => {
      let existing = currentLevel.find((item: any) => item.path === part.path);
      if (!existing) {
        existing = {
          path: part.path,
          title: part.title,
          thumb: thumbPath,
          icon: '',
          class: '',
          label: '',
          labelClass: '',
          extralink: false,
          submenu: []
        };
        currentLevel.push(existing);
      }

      if (index === pathParts.length - 1) {
        category.lstSecu.forEach((secu: any) => {
          existing.submenu.push({
            path: `${existing.path}/${secu.Symbol}`,
            title: `${secu.Symbol} ${secu.Desc}`,
            thumb: thumbPath,
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          });
        });
      } else {
        currentLevel = existing.submenu;
      }
    });
  });

  return tree;
}

orderty:any = 0
Ordertype(ev:any){
  const selectElement = ev.target as HTMLSelectElement;
  this.orderty = selectElement.value
  console.log("ec", ev,selectElement.value);
  this.tradeForm.patchValue({
    tradeType: selectElement.value
  })
 
}

orderty1:any = 2
Ordertype1(ev:any){
  const selectElement = ev.target as HTMLSelectElement;
  this.orderty1 = selectElement.value
  console.log("ec", ev,selectElement.value);
  this.tradeForm.patchValue({
    ordType: selectElement.value
  })
 
}

orderty3:any = 0
Ordertype3(ev:any){
  const selectElement = ev.target as HTMLSelectElement;
  this.orderty3 = selectElement.value
  console.log("ec", ev,selectElement.value);
  this.tradeForm.patchValue({
    Expiry: selectElement.value
  })
 
}


orderty4:any = 1
Ordertype4(ev:any){
  const selectElement = ev.target as HTMLSelectElement;
  this.orderty4 = selectElement.value
  console.log("ec", ev,selectElement.value);
  this.tradeForm.patchValue({
    fillType: selectElement.value
  })
 
}


priceTrade:any =0
orderResData:any ={}
MAKE_NEW_ORDER_Market(val:any, price:any){
  this.priceTrade = this.tradeForm.value.Price
  this.tradeForm.patchValue({
    AtPrice:price
  })
  let obj ={
    "Login": this.allModelData.AC,
    "Symbol": this.tradeSym,
    "Lot": Number(this.tradeForm.value.Lot),
    "Price":Number(this.tradeForm.value.AtPrice),
    "SL":Number(this.tradeForm.value.SL),
    "PL":Number(this.tradeForm.value.PL),
    "ordType":val,               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
    "fillType":1,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
    "trdType":3,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
    //"StopLimit":185.890,
    "Expiry": this.orderty3,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
    "ExpTime": this.timeStamp,
    "Comment":this.tradeForm.value.comment
}
console.log("New order ",obj);

this.api.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
  this.orderResData= res
  if(this.orderResData.ERR_MSG == ""){
    this.showHideRes1 = 1
    this.showHideRes = 1
    this.isReadonly1 = true
  }
  else   if(this.orderResData.ERR_MSG != ""){
    this.showHideRes = 2
    this.showHideRes1 = 1
    this.isReadonly1 = true
  }
  else{
    this.showHideRes = 0
    this.showHideRes1 = 0
    this.isReadonly1 = false
  }
  this.GET_OPENED1()
console.log("resssss",res);

},error:(err:any)=>{
  console.log(err);
  
}})
}

timeStamp:any
onDateChange(event: any) {
  const selectedDate = new Date(event.target.value);
  const epochTimestamp = Math.floor(selectedDate.getTime() / 1000); // Convert to Unix Timestamp
  console.log('Epoch/Unix Timestamp:', epochTimestamp);
  this.timeStamp = epochTimestamp
  // You can now use epochTimestamp as needed
}

okReturn(){
  this.showHideRes1= 0
this.showHideRes = 0
this.isReadonly1 = false
}
showHideRes1:any = 0
showHideRes:any = 0
MAKE_NEW_ORDER(val:any){
  
  let obj ={
    "Login": this.allModelData.AC,
    "Symbol": this.tradeSym,
    "Lot": Number(this.tradeForm.value.Lot),
    "Price":Number(this.tradeForm.value.Price),
   "SL":Number(this.tradeForm.value.SL),
    "PL":Number(this.tradeForm.value.PL),
    "ordType":val,               //Buy = 0,Sell = 1,BuyLimit = 2,SellLimit = 3,BuyStop = 4,SellStop = 5,BuyStopLimit = 6,SellStopLimit = 7
    "fillType": this.orderty4,               //FillOrKill = 0,ImmediateOrCancel = 1,FlashFill = 2,Any = 3
    "trdType":2,                //TradePrice = 0,RequestExecution = 1,InstantExecution = 2, MarketExecution = 3,ExchangeExecution = 4,SetOrder = 5,ModifyDeal = 6,ModifyOrder = 7,CancelOrder = 8,Transfer = 9,ClosePosition = 10,ActivateOrder = 100,ActivateStopLoss = 101,ActivateTakeProfit = 102,ActivateStopLimitOrder = 103,ActivateStopOutOrder = 104,ActivateStopOutPosition = 105,ExpireOrder = 106, ForSetOrder = 200,ForOrderPrice = 201,    ForModifyDeal = 202,ForModifyOrder = 203,ForCancelOrder = 204,ForActivateOrder = 205,ForBalance = 206,ForActivateStopLimitOrder = 207,ForClosePosition = 208
    //"StopLimit":185.890,
    "Expiry": this.orderty3,                //GTC = 0, Today = 1,Specified = 2,SpecifiedDay = 3
    "ExpTime": this.timeStamp,
    "Comment":this.tradeForm.value.comment
}
console.log("New order ",obj);

this.api.MAKE_NEW_ORDER(obj).subscribe({next:(res:any)=>{
  this.orderResData= res
  if(this.orderResData.ERR_MSG == ""){
    this.showHideRes1 = 1
    this.showHideRes = 1
    this.isReadonly1 = true
  }
  else   if(this.orderResData.ERR_MSG != ""){
    this.showHideRes = 2
    this.showHideRes1 = 1
    this.isReadonly1 = true
  }
  else{
    this.showHideRes = 0
    this.showHideRes1 = 0
    this.isReadonly1 = false
  }
  this.GET_OPENED1()
console.log("resssss",res);

},error:(err:any)=>{
  console.log(err);
  
}})
}

isReadonly: boolean = true; // Initialize the readonly state
isReadonly1: boolean = false;
// Method to toggle readonly state based on checkbox value
toggleReadonly(event: any) {
  this.isReadonly = event.target.checked;
}

getAllExpos:any =[]
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
onMouseOver(item:any){
 console.log("item",item);
 

}

onMouseOver1(item:any){
  console.log("item",item);
  
 
 }

isMenuVisible = false;
  menuPosition = { x: 0, y: 0 };
  activeSubMenu: string | null = null;
  activeSubSubMenu: string | null = null;


  isMenuVisible1 = false;
  menuPosition1 = { x: 0, y: 0 };
  activeSubMenu1: string | null = null;
  activeSubSubMenu1: string | null = null;
  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default context menu from appearing
    this.menuPosition = {x: event.clientX-470, y: event.clientY-50  };
    this.isMenuVisible = true;
    this.isMenuVisible1 = false; // Hide the other menu
    this.showContextMenu2 = false;
    
  }

  onRightClick1(event: MouseEvent) {
    event.preventDefault(); // Prevent the default context menu from appearing
    this.menuPosition1 = { x: event.clientX - 90, y: event.clientY - 80 };
    console.log(" this.menuPosition1",  this.menuPosition1)
    this.isMenuVisible1 = true;
    this.isMenuVisible = false; // Hide the other menu
    this.showContextMenu2 = false;
    console.log("event.clientX ", event.clientX,"event.clientY", event.clientY )
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isMenuVisible = false;
    this.showContextMenu = false;
    this.showContextMenu2 = false;
  }

  onMenuItemClick(action: string) {
    this.isMenuVisible = false;
    this.showContextMenu = false;
    this.showContextMenu2 = true;
    // Handle the action based on the clicked menu item
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
showContextMenu = false;
showContextMenu2 = false;
contextMenuPosition = { x: 0, y: 0 };
 contextMenuPosition2= { x: 0, y: 0 };

  onRightClick11(event: MouseEvent, i:any) {
    event.preventDefault(); // Prevent the default browser context menu

    console.log("dfgdfghdffghfgjhfgjfghdfhfg")

    // this.contextMenuPosition = { x: ((this.tdIndex*120+60)-this.tdIndex*5) , y: 200+((i+2)*50) };
    this.contextMenuPosition = { x: event.clientX-470, y: event.clientY-50 };
   
    this.showContextMenu = true;
  }

  onRightClick2(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu

    console.log("dfgdfghdffghfgjhfgjfghdfhfg")

    // this.contextMenuPosition = { x: ((this.tdIndex*120+60)-this.tdIndex*5) , y: 200+((i+2)*50) };
    this.contextMenuPosition2 = { x: event.clientX - 90, y: event.clientY - 80 };
    this.isMenuVisible1 = false;
    this.isMenuVisible = false; 
    this.showContextMenu2 = true;
  }
  tdIndex:any=0
  gettdIndex(val:any){
    this.tdIndex=val
  }

  getAllPos:any =[]
  getAllPos1:any ={}
  transform(value: string, limit: number = 5): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
  

  getPosHistory(){

    let obj = {
      Account:Number(this.allModelData.AC),
      dtFrom:`${this.startDate} 00:00:59`,
      dtTo:`${this.endDate} 11:59:59`,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.GET_MGR_POS_USERID_HIS(obj).subscribe({next: (res:any)=>{
      this.getAllPos1 = res
      this.getAllPos = res.lstPos
      
    },
    error: (err:any)=>{
      console.log(err);
      
    }})
  }


  getAllDeals:any =[]
  getAllDeals1:any ={}

  getDeals(){

    let obj = {
      Account:Number(this.allModelData.AC),
      dtFrom:`${this.startDate} 00:00:59`,
      dtTo:`${this.endDate} 11:59:59`,
      ManagerIndex:Number(localStorage.getItem('managerId')),
    }
    this.api.GET_MGR_DEALS_USERID_HIS(obj).subscribe({next: (res:any)=>{
      console.log("Deals", res);
      this.getAllDeals1 = res
      this.getAllDeals = res.lstPos
      
    },
    error: (err:any)=>{
      console.log(err);
      
    }})
  }
}