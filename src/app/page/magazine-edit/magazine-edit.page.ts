import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/service/form.service';
import { Magazine } from './../../model/magazine';
import { MagazineService } from './../../service/magazine.service';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'magazine-edit',
  templateUrl: './magazine-edit.page.html',
  styleUrls: ['./magazine-edit.page.scss'],
})
export class MagazineEditPage implements OnInit {
  form: FormGroup;
  previewImage: string | ArrayBuffer;
  quillStyle;
  magazine: Magazine;

  constructor(
    private formService: FormService,
    private magazineService: MagazineService,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.quillStyle = this.utilService.getQuillStyle();
    this.form = new FormGroup({
      title: new FormControl('', this.formService.getValidators(50)),
      catch_phrase: new FormControl('', this.formService.getValidators(50)),
      image: new FormControl(null, Validators.required),
      imageSource: new FormControl(null, Validators.required),
      content: new FormControl('', Validators.required),
    });
    this.route.params.subscribe(params => {
      this.magazineService.get(+params.id).subscribe(resp => {
        this.magazine = resp;
        this.setFormControlsValue(this.magazine);
      }, error => {
        if ((error as HttpErrorResponse).status === 404) {
          alert('매거진이 존재하지 않습니다.');
          this.router.navigate(['/tabs/home']);
        }
      });
    })
  }

  private setFormControlsValue(magazine: Magazine) {
    this.form.controls.title.setValue(magazine.title);
    this.form.controls.catch_phrase.setValue(magazine.catch_phrase);
    this.form.controls.content.setValue(magazine.content);
  }

  ionViewDidLeave() {
    this.form.reset();
    this.previewImage = undefined;
  }

  edit() {
    const { title, catch_phrase, imageSource, content } = this.form.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('catch_phrase', catch_phrase);
    formData.append('image', imageSource);
    formData.append('content', content);
    this.magazineService.edit(this.magazine.mid, formData).subscribe(resp => {
      console.log('수정되었습니다.');
      this.router.navigate(['/tabs/magazine-detail', this.magazine.mid])
    })
  }

  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.previewImage = reader.result
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        imageSource: file
      });
      this.readURL(event);
    }
  }
}
