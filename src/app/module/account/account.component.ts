import { Component } from '@angular/core';
import { ShareModuleModule } from '../../commonModule/share-module/share-module.module';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ShareModuleModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

}
