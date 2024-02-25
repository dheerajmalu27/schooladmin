import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { Helpers } from '../../../helpers';
import { MENU_CONFIG } from './aside-nav-config';
import { CommonService } from 'src/app/_services/common-api.service';
import { environment } from 'src/environments/environment';

declare let mLayout: any;

@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
  menuConfig: any = MENU_CONFIG.admin;

  constructor(private commonService: CommonService) {
    let userType = localStorage.getItem(environment.userType);

    if (userType !== null) {
      userType = this.commonService.b64_to_utf8(userType);
      this.menuConfig = MENU_CONFIG[userType as keyof typeof MENU_CONFIG];
    }
  }

  toggleSubMenu(item: any): void {
    mLayout.initAside();
    // item.expanded = !item.expanded;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.openMenu();
  }

  openMenu() {
    mLayout.initAside();
    // Example of finding and setting active menu item
    // let menu = $('#m_aside_left').mMenu();
    // let item = menu.find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item');
    // menu.data('menu').setActiveItem(item);
  }

  setUserToLocalStorage(userData: any): void {}
}
