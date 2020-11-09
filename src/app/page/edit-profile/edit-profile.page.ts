import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private s3Service: S3Service
  ) { }

  ngOnInit() {
    this.setUser();
  }

  setUser() {
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.user = resp;
      this.form = new FormGroup({
        image: new FormControl(resp.image),
        nickname: new FormControl(resp.nickName, Validators.maxLength(30)),
        catchphrase: new FormControl(resp.catch_phrase, Validators.maxLength(30)),
        introduction: new FormControl(resp.introduction, Validators.maxLength(300)),
      });
    });
  }

  onFileInput(event) {
    const fileTypes = ["image/gif", "image/jpeg", "image/png"];
    const file = event.target.files[0];
    if (fileTypes.find(t => t === file.type)) {
      this.s3Service.uploadFile(file, environment.folder.user).then(res => {
        this.form.controls.image.setValue(res.Location)
        this.editUser();
      })
    } else {
      alert(`이미지 형식만 가능합니다. (${fileTypes})`);
    }
  }

  editUser() {
    const { image, nickname, catchphrase, introduction } = this.form.value;
    this.userService.edit(this.user.uid, image, nickname, catchphrase, introduction).subscribe(resp => {
      alert('수정되었습니다.')
      this.setUser()
    })
  }
}
