import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, TemplateRef, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalConfig,   } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { ShareService } from 'src/app/services/share.service';


interface MenuItem {
  path: string;
  title: string;
  thumb: string;
  icon: string;
  class: string;
  label: string;
  labelClass: string;
  extralink: boolean;
  submenu: MenuItem[];
}


@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [NgbNavModule,CommonModule,FormsModule,ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  active = 1;

  active1 = 1;
  modeRef:any
  modeRef1:any
  modeRef2:any
  sideBarData: any = false;
  isOpen = false;
  modeForm!:FormGroup
  modeMarginForm!:FormGroup
  SymbolCommForm!:FormGroup
  commissionForm!:FormGroup
  Sym_marginForm!:FormGroup
  SymbolTradeFrom!:FormGroup
  SymbolExecutionFrom!:FormGroup
  swapForm!: FormGroup
  index = 0;
  EnableSw:any= false
  // menu: any[] = []; // Assuming your menu data is populated here
  menu: MenuItem[] = [];
  editingIndex: number | null = null;
  editingColumn: string | null = null;
  @ViewChildren('inputRef') inputRefs:any = QueryList<ElementRef>;
  selectedTitle: any;
  dropdownOpen = false;
  expand: any = {};
  constructor(private renderer: Renderer2, private share:ShareService,private datePipe: DatePipe,private modalService: NgbModal,private fb: FormBuilder, config: NgbModalConfig, private router:Router,private api: GlobalService) {
    config.backdrop = 'static';
		config.keyboard = false;
   
  }
  modeAllData:any ={}
   getALLGroupInfo:any ={}
  
  async openXl(content: any,val:any) {
    this.active =1
    this.modeAllData = val;
    this.getsendSymbolIndex = null
    console.log("getsendSymbolIndex",this.getsendSymbolIndex);
    // console.log("Model", this.modeAllData);
    try {
      const res: any = await firstValueFrom(this.api.GET_ADM_GROUPS_BRF(this.modeAllData.Group));
      this.getAllSecurities()
      this.getALLGroupInfo = res;
    
      
      

      const values = this.getALLGroupInfo;
      this.modeForm.patchValue({
        CO_NEG_BALANCE: values.CO_NEG_BALANCE ?? 0,
        Company: values.Company ?? '',
        Currency: values.Currency ?? '',
        Digit: values.Digit ?? 0,
        Group: values.Group ?? '',
        
        Server: values.Server ?? '',
       
      });
    
      this.riskSelecet = values.MarginMode ?? 0
      this.modeMarginForm.patchValue({
        SoMode: values.SoMode ?? 0,
        StopOut: values.StopOut ?? 0,
        Margin: values.Margin ?? 0,
        MarginMode: values.MarginMode ?? 0,
        SO_HEDGED: values.SO_HEDGED ,
        CO_NEG_BALANCE:values.CO_NEG_BALANCE,
        oMarginFreeMode:values.oMarginFreeMode ?? 0,
        oMarginFreeModePL: values.oMarginFreeModePL ?? 0,
        WD_CREDIT: values.WD_CREDIT
      })

  
      // Open the modal after data is loaded and form is patched
      setTimeout(() => {
        this.modeRef = this.modalService.open(content, { size: 'lg modalone', centered: true });
      }, 500);
    } catch (err) {
      console.log(err);
    }
  }


  removeComm(index: number) {
    const commissionFormArray = this.commissionForm.get('lstCommTier') as FormArray;
    commissionFormArray.removeAt(index);
    this.getALLGroupInfo.lstCommission.splice(index, 1);
  }

  riskSelecet:any 
  changeRisk(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.riskSelecet = value
    
  }

allGroupIndex:any
  getIndex(index:any){
    this.allGroupIndex = index
  }
  getAllResp:any ={}
  getAllOn(val:any){
    this.getAllResp = val
    // console.log("onfocus0", val);
    
  }

  senSymbol:any 
  getsendSymbolIndex:any
  sendSymbol(val:any, index:any){
    this.getsendSymbolIndex = index
   
  // Return the last part if exists, otherwise return the original string

    this.senSymbol = val
    console.log("this.senSymbol",this.senSymbol);
    
  }
 
  openXlClose(){
  
    this.modeRef.close()
  }

  openXl2Close(){
    
    this.modeRef1.close()
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

 // number and dotvalue
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Allow digits (0-9) and dot (.)
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      this.numericMessage = true;
      return false;
    }

    this.numericMessage = false;
    return true;
  }
 

  openXl3Close(){
 
    this.modeRef2.close()
  }

  deleteSymbol(index:number, event: MouseEvent) {
    event.stopPropagation(); // Prevent triggering the row click event
    this.getALLGroupInfo.lstSymbols.splice(index, 1);
    console.log("this.getALLGroupInfo.lstSymbols",this.getALLGroupInfo.lstSymbols,index);
    //this.senSymbol
    
    this.deleteSymbolRow()
  }

  deleteSymbolRow(){

    let obj ={
      Group:this.getALLGroupInfo?.Group,
      Security:this.senSymbol?.Symbol
    }
    this.api.DEL_ADM_GROUPS(obj).subscribe({ next:(res:any) =>{
      console.log("res",res);
    
    },
  error : ( err:any)=>{
    console.log(err);
    
  }})
  }

  removeTrailingZeros(value: number) {
    const valueStr = value.toString();
    const trimmedStr = valueStr.replace(/0000$/, ''); // Remove exactly 5 trailing zeros
    const result = parseFloat(trimmedStr)
    return result;
  }

  // Function to find the display value based on StepLot
  getDisplayValue(stepLot: any): string {
    const trimLenght = stepLot.toString()
    if (trimLenght.length>= 5) {
     const value = (this.removeTrailingZeros(stepLot)).toString()
      return value;
    }
    const option = this.listOfOptions.find(option => option.value === stepLot);
  
    // Check if stepLot is null or undefined before calling toString()
    if (option) {
      return option.display;
    } else if (stepLot != null) {
      return stepLot.toString();
    } else {
      return '';
    }
  }
  firstModelData:any
  symbolDetails:any ={}
  actionSymbolType:any = 3

  defaultValue:any ="0.0000000"
  openXl2(content2: any,val:any, vall:any) {
   
    this.active1 = 1
  if(vall == 1){
    this.getsendSymbolIndex =null
    this.rangeLength = null
    this.actionSymbolType = 1
    this.firstModelData = "*"
    this.SymbolTradeFrom.reset()
    this.Sym_marginForm.reset()
    this.swapForm.reset()
    this.SymbolExecutionFrom.reset()
  
   
  }
  else if(vall ==2){
    this.actionSymbolType = 2
    console.log("val.Symbol",val,val.Symbol);
   
    this.firstModelData = val.Symbol
    

      this.symbolDetails = val
      const patchValues2 = {
        Symbol: this.firstModelData,
        StepLot:this.getDisplayValue(this.symbolDetails?.VolStep),
        MinLot: this.getDisplayValue(this.symbolDetails?.VolMin),
        MaxLot: this.getDisplayValue(this.symbolDetails?.VolMax),
        Limit: this.getDisplayValue(this.symbolDetails?.VolLimit),
       
        MktDepth:this.symbolDetails?.MktDepth,
        SprdBalance:this.symbolDetails?.SpreadDiffBal,
        SpreadDiff:this.symbolDetails?.SpreadDiff,
        Spread: this.symbolDetails?.SpreadDiff

        };
        this.SymbolCommForm.patchValue(patchValues2);


        const patchValue3 = {
          Margin_Hedged: this.symbolDetails?.MarginHedged,
          Margin_Initial:this.symbolDetails?.MarginInitial,
          Margin_Maintainence:this.symbolDetails?.MarginMaintenance,
          MarginRateCurrency: this.symbolDetails?.MarginRateCurrency,
          MarginRateLiquidity: this.symbolDetails?.MarginRateLiquidity
        }
         
        this.Sym_marginForm.patchValue(patchValue3);

        const patchValue4 = {
          EnableSwap:this.symbolDetails?.EnableSwap,
          Swap_Friday: this.symbolDetails?.Swap_Friday,
          Swap_Monday: this.symbolDetails?.Swap_Monday,
          Swap_Saturday: this.symbolDetails?.Swap_Saturday,
          Swap_Sunday: this.symbolDetails?.Swap_Sunday,
          Swap_Thursday: this.symbolDetails?.Swap_Thursday,
          Swap_Tuesday: this.symbolDetails?.Swap_Tuesday,
          Swap_Wednesday: this.symbolDetails?.Swap_Wednesday,
          DayYear: 360,
          ShortPos:this.symbolDetails?.Swap_Short,
          LongPos:this.symbolDetails?.Swap_Long,
          SwapMode: this.symbolDetails?.SwapMode,
        

        }

        this.swapForm.patchValue(patchValue4);

        const patchValue5 ={
          OrderFlag:this.symbolDetails?.OrderFlag,
          FillFlags:this.symbolDetails?.FillFlags,
          ExpireFlags:this.symbolDetails?.ExpireFlags,
          TradeMode:this.symbolDetails?.TradeMode,
          StopsLevel:this.symbolDetails?.StopsLevel,
          FreezeLevel:this.symbolDetails?.FreezeLevel,
        }

        this.SymbolTradeFrom.patchValue(patchValue5)

        this.SymbolExecutionFrom.patchValue({
          ExecMode: this.symbolDetails?.ExecMode
        })
   

        this.rangeLength = this.symbolDetails.SpreadDiff
        this.rangeLengthAsk = Math.floor(this.rangeLength/2)
        this.rangeLengthBid = this.rangeLength - this.rangeLengthAsk
      console.log("this.senSymbol",this.senSymbol)
  }

  setTimeout(() => {
    this.modeRef1= this.modalService.open(content2, { size: 'lg modalone', centered: true });
  
  }, 500);
   
    // this.cdr.detectChanges()
   

  }



  getCommission:any ={}
  getCommissionIndex:any 

  getAllComm(val:any, index:any){
    this.getCommission = val

  
    this.getCommissionIndex = index
  }

  modeAllData3:any ={}
  typeModelButton: any = 0
  openXl3(content3: any, modelData:any,val:any) {

    this.getCommissionIndex = null
    
  if(val ==1){
    this.typeModelButton = 1
    this.modeAllData3 = modelData
    this.commissionForm.patchValue({
      lstCommTier:[]
  
    })
    console.log(" this.modeAllData3 ", this.modeAllData3 );
    this.commissionForm.patchValue({
  
      Name: this.modeAllData3.Name,
      Desc: this.modeAllData3.Desc,
      Symbol: this.modeAllData3.Symbol,
      Range: this.modeAllData3.Range,
      Mode_Charge: this.modeAllData3.Mode_Charge,
      TurnoverCurr: this.modeAllData3.TurnoverCurr,
      Mode_Entry: this.modeAllData3.Mode_Entry,
      Mode_Action: this.modeAllData3.Mode_Action,
      Mode_Profit: this.modeAllData3.Mode_Profit,
      dealReason: this.modeAllData3.dealReason,
      // CommType: this.modeAllData3.CommType,
   
        
  
    })
    if (typeof this.modeAllData3.CommType === 'number') {
      this.commissionForm.patchValue({ CommType: this.modeAllData3.CommType });
    } else {
      console.error('CommType is not a number');
    }
  
    // Patch lstCommTier array
    // this.modeAllData3.lstCommTier.forEach((tier:any) => {
    //   this.addTier(tier);
    // });
    while (this.lstCommTier.length) {
      this.lstCommTier.removeAt(0);
    }
    const maxIterations = this.modeAllData3.lstCommTier.length;

for (let i = 0; i < maxIterations; i++) {
  const tier = this.modeAllData3.lstCommTier[i];
  this.addTier(tier);
}
  }
  else if(val == 2){
    this.typeModelButton = 2
    this.modeAllData3 = modelData
    this.commissionForm.patchValue({
  
      Name: "",
      Desc: "",
      Symbol: "*",
      Range: 0,
      Mode_Charge:0,
      TurnoverCurr: "",
      Mode_Entry: 0,
      Mode_Action: 0,
      Mode_Profit: 0,
      dealReason: "",
      lstCommTier:[]
  
    })
    
    while (this.lstCommTier.length) {
      this.lstCommTier.removeAt(0);
    }
  }

    this.modeRef2= this.modalService.open(content3, { size: 'lg modalone', centered: true });
    // this.cdr.detectChanges()
 

  }
  


 
  ngOnInit() {
    this.allGroupIndex = null
    this.GET_MGR_GROUPS()
  

    this.modeForm = this.fb.group({
      CO_NEG_BALANCE: [""],
      Company: [""],
      Currency: [""],
      Digit: [],
      Group: [""],
      SO_HEDGED: [],
      Server: [""],
      WD_CREDIT: []
    });

    this.swapForm = this.fb.group({
      EnableSwap:[''],
      Swap_Friday: [''],
      Swap_Monday: [''],
      Swap_Saturday: [''],
      Swap_Sunday: [''],
      Swap_Thursday: [''],
      Swap_Tuesday: [''],
      Swap_Wednesday: [''],
      DayYear:[''],
      ShortPos:[''],
      LongPos:[''],
      SwapMode:['']
      })

      // SymbolTradeFrom
      this.SymbolTradeFrom = this.fb.group({
        OrderFlag:[''],
        FillFlags:[''],
        ExpireFlags:[''],
        TradeMode:[''],
        FreezeLevel:[''],
        StopsLevel:['']

      });

      this.SymbolExecutionFrom = this.fb.group({
        ExecMode:[0]
      });

    this.modeMarginForm = this.fb.group({
      SoMode: [],
      StopOut: [],
      Margin: [""],
      MarginMode: [],
      oMarginFreeMode: [],
      oMarginFreeModePL: [],
      SO_HEDGED:[1],
      CO_NEG_BALANCE:[1],
      WD_CREDIT:[1]
    });

    this.commissionForm = this.fb.group({
      Name: [''],
      Desc: [''],
      Symbol: [''],
      Range: [''],
      Mode_Charge: [''],
      TurnoverCurr: [''],
      Mode_Entry: [''],
      Mode_Action: [''],
      Mode_Profit: [''],
      dealReason: [''],
      CommType: [0],
      lstCommTier: this.fb.array([])
    });

    // Initialize form array with example data (optional)
    this.addTier({
      From: [0], // Initializing as number
      To: [1000], // Initializing as number
      Commisison: [1], // Initializing as number
      Min: [0], // Initializing as number
      Max: [0], // Initializing as number
      Mode: [0], // Initializing as number
      Currency: [' '], // Currency can stay as string
      Type: [0] // Initializing as number
    });

    this.SymbolCommForm = this.fb.group({
      Symbol: ['*'],
      Limit:[''],
      MaxLot:[''],
      MinLot:[''],
      StepLot:[''],
      MktDepth:[''],
      SprdBalance:[''],
      Spread:[''],
      SpreadDiff:['']

    });

    this.Sym_marginForm = this.fb.group({
      Margin_Hedged: [''],
      Margin_Initial: [''],
    Margin_Maintainence: [''],
    MarginRateLiquidity:[''],
    MarginRateCurrency:['']
    })

    
   
  }

  listOfOptions = [
    { display: '0.01', value: 100 },
    { display: '0.1', value: 1000 },
    { display: '1', value: 10000 },
   
  ];
  
  VolLimitSym: any
  VolMaxSym : any
  VolMinSym: any
  VolStepSym:any

  opTion:any ={}
  onOptionSele(event: any){
    const selectedValue = (event.target as HTMLInputElement).value;
    this.opTion = this.listOfOptions.find((opt:any) => opt.display === selectedValue);
   if(this.opTion){
    return this.opTion.value
   }
   else{
    const formValue = parseFloat(this.opTion.value) * 10000;
    
    return formValue
   }
   
  }

  onOptionSelect(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    const option = this.listOfOptions.find(opt => opt.display === selectedValue);
    if (option) {
      this.SymbolCommForm.patchValue({ MinLot: option.display });
    }
    const formValue = parseFloat(this.SymbolCommForm.value.MinLot) * 10000;
    this.VolMinSym = formValue
    console.log('Form value to submit:', formValue);
  }

  onOptionSelect1(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    const option = this.listOfOptions.find(opt => opt.display === selectedValue);
    if (option) {
      this.SymbolCommForm.patchValue({ StepLot: option.display });
    }
    const formValue = parseFloat(this.SymbolCommForm.value.StepLot) * 10000;
    this.VolStepSym = formValue
    console.log('Form value to submit:', formValue);
  }




  onOptionSelect2(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    const option = this.listOfOptions.find(opt => opt.display === selectedValue);
    if (option) {
      this.SymbolCommForm.patchValue({ MaxLot: option.display });
    }
    const formValue = parseFloat(this.SymbolCommForm.value.MaxLot) * 10000;
    this.VolMaxSym = formValue
    console.log('Form value to submit:', formValue);
  }

  onOptionSelect3(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    const option = this.listOfOptions.find(opt => opt.display === selectedValue);
    if (option) {
      this.SymbolCommForm.patchValue({ Limit: option.display });
    }
    const formValue = parseFloat(this.SymbolCommForm.value.Limit) * 10000;
    this.VolLimitSym = formValue
    console.log('Form value to submit:', formValue);
  }


  onCheckboxChange(value: number) {
    this.commissionForm.get('CommType')!.setValue(value);
  }

  onCheckboxChange1(event: any, controlName: string): void {
    const isChecked = event.target.checked;
    this.modeMarginForm.get(controlName)?.setValue(isChecked ? 1 : 0);
    console.log("this.commissionForm",this.modeMarginForm.value.SO_HEDGED);
    
  }

  get lstCommTier() {
    return this.commissionForm.get('lstCommTier') as FormArray;
  }

  addTier2() {
    let obj = this.fb.group({
      From: [0], // Initializing as number
      To: [1000], // Initializing as number
      Commisison: [1], // Initializing as number
      Min: [0], // Initializing as number
      Max: [0], // Initializing as number
      Mode: [0], // Initializing as number
      Currency: [this.commissionForm.value.TurnoverCurr], // Currency can stay as string
      Type: [0] // Initializing as number
    });
  
    this.lstCommTier.push(obj);
  }
  
  addTier(data: any) {
    const tier = this.fb.group({
      From: [data.From],
      To: [data.To],
      Commisison: [data.Commisison],
      Min: [data.Min],
      Max: [data.Max],
      Mode: [data.Mode],
      Currency: [data.Currency],
      Type: [data.Type]
    });
    this.lstCommTier.push(tier);
  }

  rangeLength:any
  rangeLengthAsk:any
  rangeLengthBid:any
onRangeInput(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value;
  const valueToPatch = inputValue ? inputValue : 0;
  console.log("valueToPatch",valueToPatch);
  this.rangeLength = valueToPatch
 
}

  editTier(index: number) {
    const tier = this.lstCommTier.at(index);
  
    tier.patchValue({
      From: parseFloat(tier.value.From), // Convert to number
      To: parseFloat(tier.value.To), // Convert to number
      Commisison: parseFloat(tier.value.Commisison), // Convert to float
      Min: parseFloat(tier.value.Min), // Convert to number
      Max: parseFloat(tier.value.Max), // Convert to number
      Mode: parseInt(tier.value.Mode, 10), // Convert to integer
      Currency: tier.value.Currency, // Keep as string
      Type: parseInt(tier.value.Type, 10) // Convert to integer
    });
  
    this.editingIndex = index;
    
  }
  remove(val: any): string {
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    return val;
  }
  parseNumberFromString(value: string): number {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  saveTier(index: number) {
    this.editingIndex = null;
    this.editingColumn = null;
  }

  getModeName(modeValue: number) {
    const modes = [
      'deposit ccy',
      'base ccy',
      'profit ccy',
      'margin ccy',
      'points',
      'percents',
      'specified ccy',
      'profit percent'
    ];
    return modes[modeValue];
  }

  getTypeName(typeValue: number){
    const types = [
      'Per Trade',
      'Per Volume'
    ];
    return types[typeValue];
  }

  addObjValue: any ={}
  addCommission() {
    // console.log(this.commissionForm.value);
    this.addObjValue = this.commissionForm.value
    this.getALLGroupInfo.lstCommission.push(this.commissionForm.value)
    
    this.editingIndex = -1;
    
    this.openXl3Close()
    this.add_editGroupComm(2)
   
  }


 
  sortSymbols1(order: string) {
    if (order === 'asc') {
      this.getALLGroupInfo.lstCommission.sort((a:any, b:any) => a.localeCompare(b));
    } else if (order === 'desc') {
      this.getALLGroupInfo.lstCommission.sort((a:any, b:any) => b.localeCompare(a));
    }
  }

  sortSymbols(order: string) {
    if (order === 'asc') {
      this.getALLGroupInfo.lstSymbols.sort((a: any, b: any) => {
        return a.Symbol.localeCompare(b.Symbol);
      });
    } else if (order === 'desc') {
      this.getALLGroupInfo.lstSymbols.sort((a: any, b: any) => {
        return b.Symbol.localeCompare(a.Symbol);
      });
    }
  }

  add_editGroupComm(val:any){
    let vall = this.commissionForm.value
    let obj ={
      "Group": this.modeAllData.Group,
      "Edit_Add":val, // 1-Edit, 2-Add
      "oGrpComm": {
          "Name": vall.Name,
          "Desc": vall.Desc,
          "Symbol": vall.Symbol,
          "TurnoverCurr": vall.TurnoverCurr,
          "CommType":Number(this.addObjValue.CommType),               //COMM_STANDARD = 0,COMM_AGENT = 1,COMM_FEE = 2
          "Range": Number(vall.Range)?? 0,                  //COMM_RANGE_VOLUME = 0, COMM_RANGE_OVERTURN_MONEY = 1,COMM_RANGE_OVERTURN_VOLUME = 2,COMM_RANGE_VALUE = 3,COMM_RANGE_PROFIT = 4
          "Charge": Number(vall.Mode_Charge) ?? 0,                //COMM_CHARGE_DAILY = 0,COMM_CHARGE_MONTHLY = 1,OMM_CHARGE_INSTANT = 2
          "Mode_Action":Number(vall.Mode_Action)?? 0,            // COMM_ACTION_ALL = 0,  COMM_ACTION_BUY = 1, COMM_ACTION_SELL = 2
          "Mode_Entry":Number(vall.Mode_Entry)?? 0,             // COMM_ENTRY_ALL = 0,COMM_ENTRY_IN = 1,COMM_ENTRY_OUT = 2
          "Mode_Profit":Number(vall.Mode_Profit) ?? 0,            //  COMM_PROFIT_ALL = 0, COMM_PROFIT_PROFIT = 1,COMM_PROFIT_LOSS = 2
          "Mode_Charge":Number(vall.Mode_Charge)?? 0,            // COMM_CHARGE_DAILY = 0, COMM_CHARGE_MONTHLY = 1,COMM_CHARGE_INSTANT = 2
          "lstCommTier": this.addObjValue.lstCommTier
      }

      
  }
  
  console.log(obj)
 
  this.api.ADD_EDIT_ADM_GROUP_COMMISSION(obj).subscribe({ next:(res:any) =>{
    console.log("res",res);
    
  },
error : ( err:any)=>{
  console.log(err);
  
}})
}

  editCommission() {
    console.log(this.commissionForm.value);
    this.addObjValue =this.commissionForm.value
    this.editingIndex = -1;
    this.add_editGroupComm(1)
  
    this.openXl3Close()
  }

  removeTier(index: number) {
    this.lstCommTier.removeAt(index);
  }


  indexValue: any=0
selectedRowIndex: number = -1; // Initialize with -1 to indicate no row is selected initially
// findIndex(index: number) {
//   this.indexValue = index
//   // Set the index of the clicked row
//   this.selectedRowIndex = index;
//   this.editingColumn = null;
//   this.editingIndex = -1;
// }

// editCell(index: number, column: string) {
//   this.editingIndex = index;
//   this.selectedRowIndex = 1;
//   this.editingColumn = column;
// }
transform(value: string, limit: number = 5): string {
  if (!value) return '';
  return value.length > limit ? value.substring(0, limit) + '...' : value;
}




findIndex(index: number) {
  this.indexValue = index
  this.selectedRowIndex = index;
  this.editingColumn = null;
  // this.editingIndex = -1;
}

editCell(index: number, column: string) {
  this.editingIndex = index;
  this.editingColumn = column;

  // Focus the input element after a short delay to ensure it's rendered
  setTimeout(() => {
    const inputEl = this.inputRefs.find((ref:any, idx:any) => {
      const formControlName = ref.nativeElement.getAttribute('formcontrolname');
      return idx === index && formControlName === column;
    });

    if (inputEl) {
      this.renderer.selectRootElement(inputEl.nativeElement).focus();
    }
  }, 0);
}


  private toNode(x: any): any {
    const y: any = { ...x };
    y.index = ++this.index;
    for (let n = 0; n < y.submenu.length; n++) {
      y.submenu[n] = this.toNode(y.submenu[n]);
    }
    return y;
  }


  toggleVisible(node: any) {
    console.log("node", node.title)
  
      if (node.submenu && node.submenu.length) {
        if (this.expand[node.index]) {
          this.expand[node.index] = false;
        } else {
          this.expand[node.index] = true;
        }
      }
    }
  
   
  isDropdownOpen = false;
  
  
  toggleDropdown() {
    
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
    
  isDropdownOpen1 = false;
  selectedNode:any
  inSymnol:any ="*"
  selectNode(node: any) {
      
        console.log('Selecting node for selectNode:', node);
        this.selectedNode = node;
      
        this.commissionForm.patchValue(
          {
           
            Symbol:node.path
          }
        )

        this.SymbolCommForm.patchValue(
          {
           
            Symbol:node.path
          }
        )
    
  
      this.isDropdownOpen = false; // Close the dropdown
  
    }


  isMenuVisible = false;
  menuPosition = { x: 0, y: 0 };
  activeSubMenu: string | null = null;
  activeSubSubMenu: string | null = null;

  @HostListener('document:click')
  closeMenu() {
    this.isMenuVisible = false;
    this.activeSubMenu = null;
    this.activeSubSubMenu = null;
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.isMenuVisible = true;
    this.menuPosition = { x: event.clientX, y: event.clientY };
  }

  onMenuItemClick(item: string) {
    console.log(item);
    this.isMenuVisible = false;
    this.activeSubMenu = null;
    this.activeSubSubMenu = null;
  }

  onSubMenuItemClick(subItem: string) {
    console.log(subItem);
    this.isMenuVisible = false;
    this.activeSubMenu = null;
    this.activeSubSubMenu = null;
  }

  onSubSubMenuItemClick(subSubItem: string) {
    console.log(subSubItem);
    this.isMenuVisible = false;
    this.activeSubMenu = null;
    this.activeSubSubMenu = null;
  }

  showSubMenu(subMenu: string) {
    this.activeSubMenu = subMenu;
  }

  hideSubMenu(subMenu: string) {
    if (this.activeSubMenu === subMenu) {
      this.activeSubMenu = null;
    }
    this.activeSubSubMenu = null; // Close sub-sub-menu when main sub-menu is hidden
  }

  showSubSubMenu(subSubMenu: string) {
    this.activeSubSubMenu = subSubMenu;
  }

  hideSubSubMenu(subSubMenu: string) {
    if (this.activeSubSubMenu === subSubMenu) {
      this.activeSubSubMenu = null;
    }
  }
navigate1(val:any){
  this.router.navigateByUrl(val)
}


  getAllGroups: any =[]
  GET_ADM_GROUPS_ALL2(){
    this.api.GET_ADM_GROUPS_ALL().subscribe({ next: (res:any) =>{
      this.getAllGroups = res
      // console.log("this.getAllGroups",this.getAllGroups);
      
    },
  error:(err:any)=>{
    console.log(err)
  }})
  }


  GET_ADM_GROUPS_ALL(groupId: string): void {
    this.api.GET_ADM_GROUPS_ALL().subscribe({
      next: (res: any) => {
        if (groupId) {
          this.getAllGroups = res.filter((group: any) => group.Group.includes(groupId));
        } else {
          this.getAllGroups = res;
        }
        console.log('this.getAllGroups', this.getAllGroups);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }


  GET_ADM_GROUPS_BRF(val:any, vall:any){
    console.log("vall",vall);
    
  
    console.log("this.modeAllData",this.modeAllData);

}

getAllSymbol:any=[]


lisAllSymb: any = [];


getAllSymbol2:any=[]
getAllSymbol1:any=[]
getAllSecurities() {
  this.api.GET_MQ_SEC_SYMBOLS().subscribe({ next:( res:any)=>{
    console.log("GETMQ",res);
    this.getAllSymbol1= res
    localStorage.setItem('getAllSymbol',JSON.stringify(this.getAllSymbol1))
    this.getAllSymbol = JSON.parse(localStorage.getItem('getAllSymbol') || '[]');
    console.log("this.getAllSymbol",this.getAllSymbol);
    
   
      this.getAllSymbol2= this.generateMenu(this.getAllSymbol)
       console.log(this.getAllSymbol2);
      this.menu = this.getAllSymbol2.map(this.toNode.bind(this));
  },
 error: (err: any) => {
          console.log(err);
        }
      })
 
 
  
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


//=========================================================================Symbol =======================================================

symbolSave(){
  // Retrieve the symbol from the form
  const newSymbol = this.SymbolCommForm.value.Symbol;

  // Log the value for debugging
  console.log("New Symbol:", newSymbol);
console.log("  this.getALLGroupInfo.lstSymbols",  this.getALLGroupInfo.lstSymbols);

const values = this.SymbolCommForm.value
const tradeValue = this.SymbolTradeFrom.value
const marginValue= this.Sym_marginForm.value
const swapValue =  this.swapForm.value
 let obj = {
  "Symbol": values.Symbol,
  "SpreadDiff": Number(values.Spread),
  "SpreadDiffBal": Number( this.rangeLength),
  "TradeMode": Number(values.SprdBalance), // TRADE_DISABLED = 0, TRADE_LONGONLY = 1,TRADE_SHORTONLY = 2,TRADE_CLOSEONLY = 3,TRADE_FULL = 4,
  "OrderFlag": Number(tradeValue.OrderFlag), // ORDER_FLAGS_NONE = 0, ORDER_FLAGS_MARKET = 1, ORDER_FLAGS_LIMIT = 2, ORDER_FLAGS_STOP = 4, ORDER_FLAGS_STOP_LIMIT = 8,  ORDER_FLAGS_SL = 16, ORDER_FLAGS_TP = 32, ORDER_FLAGS_CLOSEBY = 64, ORDER_FLAGS_ALL = 127
  "MarginLmt": 1000, 
  "VolLimit": Number(this.VolLimitSym) ,
  "VolMax": Number(this.VolMaxSym) ,
  "VolMin":Number(this.VolMinSym) ,
  "VolStep": Number(this.VolStepSym) ,
  "ExecMode": Number(this.SymbolExecutionFrom.value.ExecMode), // EXECUTION_REQUEST = 0,EXECUTION_INSTANT = 1,EXECUTION_MARKET = 2, EXECUTION_EXCHANGE = 3
  "ExpireFlags": Number(tradeValue.ExpireFlags), // TIME_FLAGS_NONE = 0,TIME_FLAGS_GTC = 1, TIME_FLAGS_DAY = 2,TIME_FLAGS_SPECIFIED = 4, TIME_FLAGS_SPECIFIED_DAY = 8,TIME_FLAGS_ALL = 15
  "FillFlags": Number(tradeValue.FillFlags), // FILL_FLAGS_NONE = 0,   FILL_FLAGS_FOK = 1, FILL_FLAGS_IOC = 2,  FILL_FLAGS_FIRST = 1, FILL_FLAGS_ALL = 3
  "StopsLevel": Number(tradeValue.StopsLevel),
  "FreezeLevel": Number(tradeValue.FreezeLevel),
  "MarginHedged": Number(marginValue.Margin_Hedged),
  "MarginInitial": Number(marginValue.Margin_Initial),
  "MarginMaintenance": Number(marginValue.Margin_Maintainence),
  "MarginRateLiquidity": 2,
  "Enable_Calc_Hedge": 0, // Enable=1, Disable=0
  "Enable_Exclude_Long": 0, // Enable=1, Disable=0
  "Enable_Recalc_Margin": 0, // Enable=1, Disable=0
  "MarginRateCurrency": 101,
  "MarginRateInitial": 100,
  "SwapMode": Number(swapValue.SwapMode), // WAP_DISABLED = 0,SWAP_BY_POINTS = 1, SWAP_BY_SYMBOL_CURRENCY = 2,SWAP_BY_MARGIN_CURRENCY = 3, SWAP_BY_GROUP_CURRENCY = 4,SWAP_BY_INTEREST_CURRENT = 5, SWAP_BY_INTEREST_OPEN = 6, SWAP_REOPEN_BY_CLOSE_PRICE = 7,SWAP_REOPEN_BY_BID = 8, SWAP_BY_PROFIT_CURRENCY = 9,
  "Swap_Long":  Number(swapValue.LongPos) ?? 0,
  "Swap_Short":  Number(swapValue.ShortPos) ?? 0,
  "Swap_Sunday":  Number(swapValue.Swap_Sunday),
  "Swap_Monday":  Number(swapValue.Swap_Monday),
  "Swap_Tuesday":  Number(swapValue.Swap_Tuesday),
  "Swap_Wednesday":  Number(swapValue.Swap_Wednesday),
  "Swap_Thursday":  Number(swapValue.Swap_Thursday),
  "Swap_Friday":  Number(swapValue.Swap_Friday),
  "Swap_Saturday":  Number(swapValue.Swap_Saturday),
  // EnableSwap:[''],

}

  // Push the new symbol into the array
  if (obj && !this.getALLGroupInfo.lstSymbols.includes(obj)) {
    this.getALLGroupInfo.lstSymbols.push(obj);
    console.log(this.getALLGroupInfo.lstSymbols);
    
    
  } else {
    console.log("Symbol is either empty or already exists in the list.");
  }

  // Optionally, reset the form field after saving
  this.SymbolCommForm.reset();
  this.openXl2Close()

  
}

editSymbol(){
  console.log("  this.getALLGroupInfo.lstSymbols",  this.getALLGroupInfo.lstSymbols);
  const symbol= this.SymbolCommForm.value.Symbol;
  const symbolObject = this.getALLGroupInfo.lstSymbols.find((item:any) => item.Symbol === symbol);
  const values = this.SymbolCommForm.value
const tradeValue = this.SymbolTradeFrom.value
const marginValue= this.Sym_marginForm.value
const swapValue =  this.swapForm.value
  let newProperties ={
    "Symbol": values.Symbol,
    "SpreadDiff": Number(values.Spread),
    "SpreadDiffBal": Number(values.SprdBalance ) ?? this.rangeLength,
    "TradeMode": Number(tradeValue.TradeMode), // TRADE_DISABLED = 0, TRADE_LONGONLY = 1,TRADE_SHORTONLY = 2,TRADE_CLOSEONLY = 3,TRADE_FULL = 4,
    "OrderFlag": Number(tradeValue.OrderFlag), // ORDER_FLAGS_NONE = 0, ORDER_FLAGS_MARKET = 1, ORDER_FLAGS_LIMIT = 2, ORDER_FLAGS_STOP = 4, ORDER_FLAGS_STOP_LIMIT = 8,  ORDER_FLAGS_SL = 16, ORDER_FLAGS_TP = 32, ORDER_FLAGS_CLOSEBY = 64, ORDER_FLAGS_ALL = 127
    "MarginLmt": 1000,
    "VolLimit":  this.senSymbol?.VolLimit?? NaN ,
  "VolMax": this.senSymbol?.VolMax  ??  NaN,
  "VolMin": this.senSymbol?.VolMin  ??  NaN,
  "VolStep":  this.senSymbol?.VolStep  ??  NaN,
    "ExecMode": Number(this.SymbolExecutionFrom.value.ExecMode), // EXECUTION_REQUEST = 0,EXECUTION_INSTANT = 1,EXECUTION_MARKET = 2, EXECUTION_EXCHANGE = 3
    "ExpireFlags": Number(tradeValue.ExpireFlags), // TIME_FLAGS_NONE = 0,TIME_FLAGS_GTC = 1, TIME_FLAGS_DAY = 2,TIME_FLAGS_SPECIFIED = 4, TIME_FLAGS_SPECIFIED_DAY = 8,TIME_FLAGS_ALL = 15
    "FillFlags": Number(tradeValue.FillFlags), // FILL_FLAGS_NONE = 0,   FILL_FLAGS_FOK = 1, FILL_FLAGS_IOC = 2,  FILL_FLAGS_FIRST = 1, FILL_FLAGS_ALL = 3
    "StopsLevel": Number(tradeValue.StopsLevel),
    "FreezeLevel": Number(tradeValue.FreezeLevel),
    "MarginHedged": Number(marginValue.Margin_Hedged),
    "MarginInitial": Number(marginValue.Margin_Initial),
    "MarginRateLiquidity": 2,
    "MarginMaintenance": Number(marginValue.Margin_Maintainence),
    "Enable_Calc_Hedge": 0, // Enable=1, Disable=0
    "Enable_Exclude_Long": 0, // Enable=1, Disable=0
    "Enable_Recalc_Margin": 0, // Enable=1, Disable=0
    "MarginRateCurrency": 101,
    "MarginRateInitial": 100,
    "SwapMode": Number(swapValue.SwapMode), // WAP_DISABLED = 0,SWAP_BY_POINTS = 1, SWAP_BY_SYMBOL_CURRENCY = 2,SWAP_BY_MARGIN_CURRENCY = 3, SWAP_BY_GROUP_CURRENCY = 4,SWAP_BY_INTEREST_CURRENT = 5, SWAP_BY_INTEREST_OPEN = 6, SWAP_REOPEN_BY_CLOSE_PRICE = 7,SWAP_REOPEN_BY_BID = 8, SWAP_BY_PROFIT_CURRENCY = 9,
    "Swap_Long":  0,
    "Swap_Short": 0,
    "Swap_Sunday":  Number(swapValue.Swap_Sunday),
    "Swap_Monday":  Number(swapValue.Swap_Monday),
    "Swap_Tuesday":  Number(swapValue.Swap_Tuesday),
    "Swap_Wednesday":  Number(swapValue.Swap_Wednesday),
    "Swap_Thursday":  Number(swapValue.Swap_Thursday),
    "Swap_Friday":  Number(swapValue.Swap_Friday),
    "Swap_Saturday":  Number(swapValue.Swap_Saturday),
   
  
  }
  
  
  if (symbolObject) {
    // Update the properties of the found object
    Object.assign(symbolObject, newProperties);
    console.log('Updated symbol object:', symbolObject);
   this.SymbolTradeFrom.reset()
   this.Sym_marginForm.reset()
   this.swapForm.reset()
    this.openXl2Close()
   
  } else {
    console.log('Symbol not found:', symbol);
  }
}


ADD_EDIT_ADM_GROUP_SYMBOLS(){

let obj ={
  "Group": this.modeAllData.Group,
  "Margin":Number(this.modeMarginForm.value.Margin),
  "StopOut":Number(this.modeMarginForm.value.StopOut),
  "MarginMode":Number(this.modeMarginForm.value.MarginMode),              //MARGIN_MODE_RETAIL=0,  MARGIN_MODE_EXCHANGE_DISCOUNT=1,  MARGIN_MODE_RETAIL_HEDGED=3
  "SO_HEDGED":Number(this.modeMarginForm.value.SO_HEDGED),                // Enable=1, Disable=0
  "CO_NEG_BALANCE":Number(this.modeMarginForm.value.CO_NEG_BALANCE),           // Enable=1, Disable=0
  "WD_CREDIT":Number(this.modeMarginForm.value.WD_CREDIT),                  // Enable=1, Disable=0
  "oMarginFreeMode":Number(this.modeMarginForm.value.oMarginFreeMode), //FREE_MARGIN_NOT_USE_PL = 0, FREE_MARGIN_USE_PL = 1, FREE_MARGIN_PROFIT = 2, FREE_MARGIN_LOSS = 3 FREE_MARGIN_LOSS = 3
  "oMarginFreeModePL":Number(this.modeMarginForm.value.oMarginFreeModePL), //  FREE_MARGIN_PROFIT_PL = 0,  FREE_MARGIN_PROFIT_LOSS = 1
  "SoMode":Number(this.modeMarginForm.value.SoMode),//  STOPOUT_PERCENT = 0, STOPOUT_MONEY = 1
  "lstSymbols":  this.getALLGroupInfo.lstSymbols
}
console.log("ADD_EDIT_ADM_GROUP_SYMBOLS",obj);

this.api.ADD_EDIT_ADM_GROUP_SYMBOLS(obj).subscribe({next :(res:any)=>{
console.log("res",res);
this.openXlClose()

},
error:(err:any)=>{
console.log(err);

}})
}


 
  navigate(val:any){
    this.router.navigateByUrl(val)
  }

  allGroups:any ={}
  // GET_ADM_GROUPS_BRF(){
  //   this.share.loader(true)
  //   this.api.GET_ADM_GROUPS_BRF().subscribe({ next:(res:any)=>{
     
  //     this.share.loader(false)
  //     this.allGroups = res
  //     console.log("this.allTradeUser",this.allGroups);
      
  //   }, error : (err:any)=>{
  //     console.log(err);
      
  //     this.share.loader(false)
  //   }})
  // }


  
  listAllGroup:any =[]
  GET_MGR_GROUPS(){
    this.share.loader(true)
    let val = Number(localStorage.getItem('loginId'))
    this.api.GET_MGR_GROUPS(val).subscribe({ next:(res:any)=>{
     console.log(res);
     this.listAllGroup = res
     this.share.loader(false)

  
    }, error : (err:any)=>{
      console.log(err);
      
      this.share.loader(false)
    }})
  }
}
