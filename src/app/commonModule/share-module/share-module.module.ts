import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketwatchComponent } from '../marketwatch/marketwatch.component';
import { QueueComponent } from '../queue/queue.component';
import { MarginCallComponent } from '../margin-call/margin-call.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [HeaderComponent, SidebarComponent, FooterComponent, PaginationComponent,MarketwatchComponent,QueueComponent,MarginCallComponent],
  imports: [
    CommonModule, NgbDropdownModule,FormsModule, ReactiveFormsModule,NgbAccordionModule,NgbTooltipModule
  ], 
  providers: [DatePipe],
  exports: [HeaderComponent, SidebarComponent, FooterComponent, PaginationComponent,MarketwatchComponent,QueueComponent,MarginCallComponent]
})
export class ShareModuleModule { }
