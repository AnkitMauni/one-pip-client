import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig,   } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-symbols',
  standalone: true,
  imports: [NgbNavModule],
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.scss']
})
export class SymbolsComponent {
  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig, private router:Router) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg modalone', centered: true });
  }
 
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
}
