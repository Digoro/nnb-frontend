import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from 'src/app/service/form.service';
import { MagazineService } from './../../service/magazine.service';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'magazine-add',
  templateUrl: './magazine-add.page.html',
  styleUrls: ['./magazine-add.page.scss'],
})
export class MagazineAddPage implements OnInit {
  form: FormGroup;
  previewImage: string | ArrayBuffer;
  quillStyle

  constructor(
    private formService: FormService,
    private magazineService: MagazineService,
    private router: Router,
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
  }

  ionViewDidLeave() {
    this.form.reset();
    this.previewImage = undefined;
  }

  add() {
    const { title, catch_phrase, imageSource, content } = this.form.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('catch_phrase', catch_phrase);
    formData.append('image', imageSource);
    formData.append('content', content);
    this.magazineService.add(formData).subscribe(resp => {
      console.log('등록되었습니다.');
      this.router.navigate(['/tabs/magazine'])
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
