import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig,  NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


interface TreeNode {
  id: number;
  name: string;
  pid?: number;
  hasChild?: boolean;
  expanded?: boolean;
  checked?: boolean;
  children?: TreeNode[];
}


@Component({
  selector: 'app-trading-accounts',
  standalone: true,
  imports: [NgbNavModule,CommonModule,FormsModule,ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './trading-accounts.component.html',
  styleUrls: ['./trading-accounts.component.scss']
})
export class TradingAccountsComponent {

  inputText: string = '';
  dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3'];

  selectItem(item: string) {
    this.inputText = item;
  }




  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig, private router:Router) {
    config.backdrop = 'static';
		config.keyboard = false;
  }
  


  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg modalone-two', centered: true });
  }
 
  navigate(val:any){
    this.router.navigateByUrl(val)
  }
  
  public treeData: TreeNode[] = [];


  ngOnInit() {
    const countries: TreeNode[] = [
      { id: 1, name: 'Australia', hasChild: true, expanded: false },
      { id: 2, pid: 1, name: 'New South Wales' },
      { id: 3, pid: 1, name: 'Victoria' },
      { id: 4, pid: 1, name: 'South Australia' },
      { id: 6, pid: 1, name: 'Western Australia' },
      { id: 7, name: 'Brazil', hasChild: true, expanded: false },
      { id: 8, pid: 7, name: 'Paraná' },
      { id: 9, pid: 7, name: 'Ceará' },
      { id: 10, pid: 7, name: 'Acre' },
      { id: 11, name: 'China', hasChild: true, expanded: false },
      { id: 12, pid: 11, name: 'Guangzhou' },
      { id: 13, pid: 11, name: 'Shanghai' },
      { id: 14, pid: 11, name: 'Beijing' },
      { id: 15, pid: 11, name: 'Shantou' },
      { id: 16, name: 'France', hasChild: true, expanded: false },
      { id: 17, pid: 16, name: 'Pays de la Loire' },
      { id: 18, pid: 16, name: 'Aquitaine' },
      { id: 19, pid: 16, name: 'Brittany' },
      { id: 20, pid: 16, name: 'Lorraine' },
      { id: 21, name: 'India', hasChild: true, expanded: false },
      { id: 22, pid: 21, name: 'Assam' },
      { id: 23, pid: 21, name: 'Bihar' },
      { id: 24, pid: 21, name: 'Tamil Nadu' },
      { id: 25, pid: 21, name: 'Punjab' }
    ];
    this.treeData = this.buildTree(countries);
  }

  buildTree(data: TreeNode[]): TreeNode[] {
    let map = new Map<number, TreeNode>();
    let roots: TreeNode[] = [];

    data.forEach(node => {
      map.set(node.id, { ...node, children: [], expanded: node.expanded || false });
    });

    data.forEach(node => {
      if (node.pid) {
        let parent = map.get(node.pid);
        if (parent) {
          parent.children?.push(map.get(node.id)!);
        }
      } else {
        roots.push(map.get(node.id)!);
      }
    });

    return roots;
  }

  onCheckChange(node: TreeNode) {
    if (node.children) {
      this.checkUncheckChildren(node, node.checked || false);
    }
  }

  checkUncheckChildren(node: TreeNode, isChecked: boolean) {
    node.children?.forEach(child => {
      child.checked = isChecked;
      if (child.children) {
        this.checkUncheckChildren(child, isChecked);
      }
    });
  }

  toggleExpand(node: TreeNode) {
    node.expanded = !node.expanded;
  }
}
