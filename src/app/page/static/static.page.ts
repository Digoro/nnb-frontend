import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';

@Component({
  selector: 'static',
  templateUrl: './static.page.html',
  styleUrls: ['./static.page.scss'],
})
export class StaticPage implements OnInit {
  isDesktop = true;
  type: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cds: CheckDesktopService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
    this.route.params.subscribe(resp => {
      this.type = resp.type;
    })
  }

  onClick(info: any, isLink: boolean = false) {
    if (isLink) {
      window.open(info);
    } else {
      this.router.navigate(['/tabs/meeting-detail', info]);
    }
  }
}
