import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle();
    this.route.params.subscribe(resp => {
      const id = resp.id;
      this.magazineService.get(id).subscribe(resp => {
        this.magazine = resp;
      }, error => {
        if ((error as HttpErrorResponse).status === 404) {
          alert('매거진이 존재하지 않습니다.');
          this.router.navigate(['/tabs/magazine']);
        }
      })
    })
  }
}
