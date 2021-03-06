import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { FormService } from './../../service/form.service';
import { S3Service } from './../../service/s3.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: User;
  form: FormGroup;
  phone: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private s3Service: S3Service,
    private formService: FormService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setUser();
  }

  setUser() {
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.user = resp;
      if (this.user.phone) this.phone = this.user.phone;
      this.form = new FormGroup({
        image: new FormControl(resp.image),
        nickname: new FormControl(resp.nickName, this.formService.getValidators(30)),
        name: new FormControl(resp.name, this.formService.getValidators(30)),
        catchphrase: new FormControl(resp.catch_phrase, [Validators.maxLength(30)]),
        introduction: new FormControl(resp.introduction, [Validators.maxLength(300)])
      });
    });
  }

  onFileInput(event) {
    const fileTypes = ["image/gif", "image/jpeg", "image/png"];
    const file = event.target.files[0];
    if (fileTypes.find(t => t === file.type)) {
      this.s3Service.uploadFile(file, environment.folder.user).then(res => {
        this.form.controls.image.setValue(res.Location);
      })
    } else {
      alert(`이미지 형식만 가능합니다. (${fileTypes})`);
    }
  }

  onAddPhone(phone: string) {
    this.phone = phone;
  }

  editUser() {
    const { image, nickname, name, catchphrase, introduction } = this.form.value;
    this.userService.edit(this.user.uid, image, nickname, name, catchphrase, introduction).subscribe(resp => {
      alert('수정되었습니다.');
      window.location.href = `/tabs/profile/${this.user.uid}`;
    })
  }
}