import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    sideBarData: any = false;
    isOpen = false;
    selectedPath:any
    index = 0;
    menu: any;
    expand: any = {};
    getAllSymbol:any =[]
    selectedNode = undefined;
    parentNode: any;
    connectionStatus:any
    private element:any= HTMLElement;
    ArryForConnectivity:any =[]
    data:any =[]
    data2:any =[]
  constructor(private router:Router, private api: GlobalService,private share : ShareService) {
    // this.share.allMarketLiveData$.subscribe((res: any) => {
    //   this.data = res
    // });

    this.connectionStatus = localStorage.getItem('status') === 'Connect' ? 'Disconnect' : 'Connect';
    if(this.connectionStatus == 'Disconnect'){
        this.ArryForConnectivity =
        [{
            "path": "/dashboard",
            "title": "Servers",
            "thumb":"assets/images/sideimg/mt-icons4.png",
            "icon": "",
            "class": "",
            "label": "",
            "labelClass": "",
            "extralink": false,
            "submenu": [
                {
                    "path": "/account",
                    "title": "Unityfx-server",
                    "thumb":"assets/images/sideimg/top-dd9.png",
                    "icon": "",
                    "class": "",
                    "label": "",
                    "labelClass": "",
                    "extralink": false,
                    "submenu": [
                        {
                            "path": "/compatibilityloclu",
                            "title": "1061 BI_core-user",
                            "thumb":"assets/images/sideimg/mt-icons13-1.png",
                            "icon": "",
                            "class": "sidetitle-bold",
                            "label": "",
                            "labelClass": "",
                            "extralink": false,
                            "submenu": []
                        }
                    ]
                },
                
               
            ]
        },
        
        // {
        //     "path": "/articleassociationconfig",
        //     "title": "Analytics",
        //     "thumb":"assets/images/sideimg/mdd1.png",
        //     "icon": "",
        //     "class": "",
        //     "label": "",
        //     "labelClass": "",
        //     "extralink": false,
        //     "submenu": [
        //         {
        //             "path": "/analytics-trading-accounts",
        //             "title": "Trading Accounts",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/online-user",
        //             "title": "Online Users",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/open-position",
        //             "title": "Open Positions",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/open-order",
        //             "title": "Open Orders",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/advertising-campaigns",
        //             "title": "Advertising Campaigns",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/by-country",
        //             "title": "By Country",
        //             "thumb":"assets/images/sideimg/mdd1.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //     ]
        // },  
        // {
        //     "path": "/server-reports",
        //     "title": "Server Reports",
        //     "thumb":"assets/images/sideimg/mdd2.png",
        //     "icon": "",
        //     "class": "",
        //     "label": "",
        //     "labelClass": "",
        //     "extralink": false,
        //     "submenu": [
        //         {
        //             "path": "/articleassociationconfig",
        //             "title": "Accounts",
        //             "thumb":"assets/images/sideimg/top-dd9.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": [
        //                 {
        //                     "path": "/articleassociationconfig",
        //                     "title": "Accounts Groups",
        //                     "thumb":"assets/images/sideimg/mdd2.png",
        //                     "icon": "",
        //                     "class": "",
        //                     "label": "",
        //                     "labelClass": "",
        //                     "extralink": false,
        //                     "submenu": []
        //                 },
        //                 {
        //                     "path": "/articleassociationconfig",
        //                     "title": "Accounts Growth",
        //                     "thumb":"assets/images/sideimg/mdd2.png",
        //                     "icon": "",
        //                     "class": "",
        //                     "label": "",
        //                     "labelClass": "",
        //                     "extralink": false,
        //                     "submenu": []
        //                 },
        //             ]
        //         },
                
                
        //     ]
        // }, 
        {
            "path": "/co-trading-account",
            "title": "Clients & Orders",
            "thumb":"assets/images/sideimg/mt-icons13.png",
            "icon": "",
            "class": "",
            "label": "",
            "labelClass": "",
            "extralink": false,
            "submenu": [
                {
                    "path": "/co-online-user",
                    "title": "Online Users (4)",
                    "thumb":"assets/images/sideimg/mt-icons13.png",
                    "icon": "",
                    "class": "",
                    "label": "",
                    "labelClass": "",
                    "extralink": false,
                    "submenu": []
                },
                // {
                //     "path": "/co-client",
                //     "title": "Clients",
                //     "thumb":"assets/images/sideimg/mt-icons13.png",
                //     "icon": "",
                //     "class": "",
                //     "label": "",
                //     "labelClass": "",
                //     "extralink": false,
                //     "submenu": []
                // },
                {
                    "path": "/co-trading-account",
                    "title": "Trading Accounts ",
                    "thumb":"assets/images/sideimg/mt-icons13.png",
                    "icon": "",
                    "class": "",
                    "label": "",
                    "labelClass": "",
                    "extralink": false,
                    "submenu": []
                },
                {
                    "path": "/co-position",
                    "title": "Positions ",
                    "thumb":"assets/images/sideimg/mt-icons13.png",
                    "icon": "",
                    "class": "",
                    "label": "",
                    "labelClass": "",
                    "extralink": false,
                    "submenu": []
                },
                {
                    "path": "/co-orders",
                    "title": "Orders",
                    "thumb":"assets/images/sideimg/mt-icons13.png",
                    "icon": "",
                    "class": "",
                    "label": "",
                    "labelClass": "",
                    "extralink": false,
                    "submenu": []
                },
            ]
        }, 
        // {
        //     "path": "/articleassociationconfig",
        //     "title": "Subscriptions",
        //     "thumb":"assets/images/sideimg/mt-icons25.png",
        //     "icon": "",
        //     "class": "",
        //     "label": "",
        //     "labelClass": "",
        //     "extralink": false,
        //     "submenu": [
        //         {
        //             "path": "/compatibilityloclu",
        //             "title": "Active",
        //             "thumb":"assets/images/sideimg/mt-icons25.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/compatibilityloclu",
        //             "title": "History",
        //             "thumb":"assets/images/sideimg/mt-icons25.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": []
        //         },
        //         {
        //             "path": "/compatibilityloclu",
        //             "title": "Configuration",
        //             "thumb":"assets/images/sideimg/top-dd9.png",
        //             "icon": "",
        //             "class": "",
        //             "label": "",
        //             "labelClass": "",
        //             "extralink": false,
        //             "submenu": [
        //                 {
        //                     "path": "/compatibilityloclu",
        //                     "title": "Market Data",
        //                     "thumb":"assets/images/sideimg/top-dd9.png",
        //                     "icon": "",
        //                     "class": "",
        //                     "label": "",
        //                     "labelClass": "",
        //                     "extralink": false,
        //                     "submenu": [
        //                         {
        //                             "path": "/compatibilityloclu",
        //                             "title": "North America",
        //                             "thumb":"assets/images/sideimg/top-dd9.png",
        //                             "icon": "",
        //                             "class": "",
        //                             "label": "",
        //                             "labelClass": "",
        //                             "extralink": false,
        //                             "submenu": [
        //                                 {
        //                                     "path": "/compatibilityloclu",
        //                                     "title": "Server",
        //                                     "thumb":"assets/images/sideimg/mt-icons25.png",
        //                                     "icon": "",
        //                                     "class": "",
        //                                     "label": "",
        //                                     "labelClass": "",
        //                                     "extralink": false,
        //                                     "submenu": []
        //                                 },
        //                             ]
        //                         },
        //                     ]
        //                 },
        //                 {
        //                     "path": "/compatibilityloclu",
        //                     "title": "Server",
        //                     "thumb":"assets/images/sideimg/mt-icons25.png",
        //                     "icon": "",
        //                     "class": "",
        //                     "label": "",
        //                     "labelClass": "",
        //                     "extralink": false,
        //                     "submenu": []
        //                 },
        //             ]
        //         },
               
        //     ]
        // }, 
        // {
        //     "path": "/compatibilityloclu",
        //     "title": "Dealing",
        //     "thumb":"assets/images/sideimg/mt-icons24.png",
        //     "icon": "",
        //     "class": "",
        //     "label": "",
        //     "labelClass": "",
        //     "extralink": false,
        //     "submenu": []
        // },
        {
            "path": "/groups",
            "title": "Groups",
            "thumb":"assets/images/sideimg/mt-icons12.png",
            "icon": "",
            "class": "",
            "label": "",
            "labelClass": "",
            "extralink": false,
            "submenu": []
        },
        ]
  
      }
      else if(this.connectionStatus == 'Connect'){
        this.ArryForConnectivity =[]
        
        // [
        //     {
        //         "path": "/account",
        //         "title": "Unityfx-server",
        //         "thumb":"assets/images/sideimg/top-dd9.png",
        //         "icon": "",
        //         "class": "",
        //         "label": "",
        //         "labelClass": "",
        //         "extralink": false,
        //         "submenu": [
                   
        //         ]
        //     },
            
           
        // ]
  
      }
    let Menu = [
      {
        "path": "/home",
        "title": "MetaTrade 5 Manager",
        "thumb":"assets/images/sideimg/mt-icons13-2.png",
        "icon": "",
        "class": "",
        "label": "",
        "labelClass": "",
        "extralink": false,
        "submenu": this.ArryForConnectivity
    }, 
      
      ];
    this.menu = Menu.map(this.toNode.bind(this));
    console.log("MENUUUU",this.menu);
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
    if (node.submenu && node.submenu.length) {
      if (this.expand[node.index]) {
        this.expand[node.index] = false;
      } else {
        this.expand[node.index] = true;
      }
    }
  }

  selectNode(node: any) {
    this.selectedNode = node;
   
    this.router.navigateByUrl( node.path)
  }


  // isMenuVisible = false;
  // menuPosition = { x: 0, y: 0 };
  // activeSubMenu: string | null = null;
  // activeSubSubMenu: string | null = null;

  // @HostListener('document:click')
  // closeMenu() {
  //   this.isMenuVisible = false;
  //   this.activeSubMenu = null;
  //   this.activeSubSubMenu = null;
  // }

  // @HostListener('document:contextmenu', ['$event'])
  // onRightClick(event: MouseEvent) {
  //   event.preventDefault();
  //   this.isMenuVisible = true;
  //   this.menuPosition = { x: event.clientX, y: event.clientY };
  // }

  // onMenuItemClick(item: string) {
  //   console.log(item);
  //   this.isMenuVisible = false;
  //   this.activeSubMenu = null;
  //   this.activeSubSubMenu = null;
  // }

  // onSubMenuItemClick(subItem: string) {
  //   console.log(subItem);
  //   this.isMenuVisible = false;
  //   this.activeSubMenu = null;
  //   this.activeSubSubMenu = null;
  // }

  // onSubSubMenuItemClick(subSubItem: string) {
  //   console.log(subSubItem);
  //   this.isMenuVisible = false;
  //   this.activeSubMenu = null;
  //   this.activeSubSubMenu = null;
  // }

  // showSubMenu(subMenu: string) {
  //   this.activeSubMenu = subMenu;
  // }

  // hideSubMenu(subMenu: string) {
  //   if (this.activeSubMenu === subMenu) {
  //     this.activeSubMenu = null;
  //   }
  //   this.activeSubSubMenu = null; // Close sub-sub-menu when main sub-menu is hidden
  // }

  // showSubSubMenu(subSubMenu: string) {
  //   this.activeSubSubMenu = subSubMenu;
  // }

  // hideSubSubMenu(subSubMenu: string) {
  //   if (this.activeSubSubMenu === subSubMenu) {
  //     this.activeSubSubMenu = null;
  //   }
  // }
navigate(val:any){
  this.router.navigateByUrl(val)
}

ngOnInit(){
  
}




}
