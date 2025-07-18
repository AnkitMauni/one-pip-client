import { ChangeDetectorRef, Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from './services/share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mt-admin';
  currentTab: any = "tab1";
  nvatabc (tab: any){
    this.currentTab = tab
  }
  isLoggedIn:any
  mainArea:any =88
  subArea :any= 12
  isLoader:boolean = false;
  // private idleTimeout: number = 3600; // in seconds
  private idleTimeout: number = 1600; // in seconds
  private timer: any;
  navigateNum : any = 0
  appDataMargin:any={}
  appDataque:any={}
  loginId :any = 771227
  constructor(private router: Router,private zone: NgZone, private cdr: ChangeDetectorRef, public share:ShareService)
  {

    // localStorage.setItem('loginId',this.loginId)
    this.share.loader(false);
    this.share.selectedloaderValue.subscribe((val:any)=>{
      this.isLoader=val;
    })

    
    this.share.selectedloaderValue.subscribe((val:any)=>{
      this.isLoader=val;
       this.cdr.detectChanges()

    })

    this.share.shareNavigatePopValue.subscribe((res:any)=>{
      console.log("resresresresres", res)
    this.gethideData(res)
      if(res.flag == true){
        this.navigateNum = this.navigateNum + 1;

      }
      else if(res.flag == false){
        this.navigateNum = this.navigateNum -1;
      }
     
      
      if(this.navigateNum ==1){
        this.mainArea = 64
        this.subArea = 12
      }
      else if(this.navigateNum ==2){
        this.mainArea = 64
        this.subArea = 12
      }
      else if(this.navigateNum ==0){
        this.mainArea = 76
        this.subArea = 0
      }
      console.log("this.navigateNum", this.navigateNum)
    })


   
  }

  gethideData(val:any){
if(val.name=="Queue")
{
this.appDataque=val
  
}
else{
this.appDataMargin=val

}
  }
  ngOnInit(){
    this.startTimer();
    this.isLoggedIn = !!localStorage.getItem('loginId');
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/login']);
    }

  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:keydown', ['$event'])
  handleUserActivity(event: MouseEvent | KeyboardEvent) {
    this.resetTimer();
  }

  connectionStatus:any
  startTimer() {
    this.timer = setTimeout(() => {
      console.log('Timeout Completed!');
      this.logout();
    }, this.idleTimeout * 1000);
  }
  logout() {
    
    this.router.navigate(['/login']).then(() => {
      this.router.navigate([{ outlets: { primary: null } }]); // Clear router state
      localStorage.removeItem('loginId');
  console.log('loginId removed from localStorage');
      window.location.reload()
    });

  }

  resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  stopTimer() {
    clearTimeout(this.timer);
  }
}
