import { Component, HostListener, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-position',
  standalone: true,
  imports: [NgbDropdownModule, NgbNavModule, FormsModule, CommonModule],
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {

  sideBarData: any = false;
  isOpen = false;

  index = 0;
  menu: any;
  expand: any = {};

  selectedNode = undefined;


  inputText: string = '';
  dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3'];

  selectItem(item: string) {
    this.inputText = item;
  }



  active = 1;
  constructor(private modalService: NgbModal, config: NgbModalConfig,) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl modaloneord', centered: true });
  }





// MENURIGJH
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











}
