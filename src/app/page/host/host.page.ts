import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CheckDesktopService } from './../../service/check-desktop.service';

@Component({
  selector: 'host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  isDesktop = false;
  isOpenSidebar = false;

  constructor(
    private cds: CheckDesktopService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.cds.setIsDesktop(window.innerWidth);
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp);
  }

  openSidebar() {
    this.menu.close();
  }

  noReady() {
    alert('서비스 준비중입니다.')
  }
}
