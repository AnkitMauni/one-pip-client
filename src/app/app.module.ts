import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDropdownModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareModuleModule } from './commonModule/share-module/share-module.module';
import { DashboardComponent } from './module/dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { GlobalService } from './services/global.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
// import { AdvancedChartComponent } from './advanced-chart/advanced-chart.component';
// import { TradingviewWidgetModule } from 'angular-tradingview-widget';
import { AngularSplitModule } from 'angular-split';
import { LoaderComponent } from './commonModule/loader/loader.component';
import { AdvancedChartComponent } from './module/advanced-chart/advanced-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    RouterOutlet,
    AngularSplitModule,
    ToastrModule.forRoot({
      timeOut: 4000, // 15 seconds
      closeButton: true,
      progressBar: true,
    }),
    ShareModuleModule, NgbDropdownModule, DashboardComponent, NgbNavModule,HttpClientModule,AdvancedChartComponent
  ],  providers: [ApiService,DatePipe, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
