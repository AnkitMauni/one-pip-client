import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-minuts-history-chart',
  standalone: true,
  providers: [NgbModal],
  templateUrl: './minuts-history-chart.component.html',
  styleUrls: ['./minuts-history-chart.component.scss']
})
export class MinutsHistoryChartComponent {
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md modalone', centered: true });
  }
}
