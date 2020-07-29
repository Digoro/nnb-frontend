import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/service/util.service';
import { Magazine } from './../../model/magazine';
import { MagazineService } from './../../service/magazine.service';

@Component({
  selector: 'magazine-detail',
  templateUrl: './magazine-detail.page.html',
  styleUrls: ['./magazine-detail.page.scss'],
})
export class MagazineDetailPage implements OnInit {
  magazine: Magazine;
  quillStyle;

  constructor(
    private route: ActivatedRoute,
    private magazineService: MagazineService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle();
    this.route.params.subscribe(resp => {
      const mid = resp.id;
      this.magazineService.get(mid).subscribe(resp => {
        this.magazine = resp;
      })
    })
  }
}
