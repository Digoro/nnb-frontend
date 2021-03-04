import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  phoneNumber: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private s3Service: S3Service,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.setUser();
  }

  setUser() {
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.user = resp;
      if (this.user.phoneNumber) this.phoneNumber = this.user.phoneNumber;
      this.form = new FormGroup({
        profilePhoto: new FormControl(resp.profilePhoto),
        nickname: new FormControl(resp.nickname, this.formService.getValidators(30)),
        name: new FormControl(resp.name, [Validators.maxLength(30)]),
        catchphrase: new FormControl(resp.catchphrase, [Validators.maxLength(30)]),
        introduction: new FormControl(resp.introduction, [Validators.maxLength(300)])
      });
    });
  }

  onFileInput(event) {
    const fileTypes = ["image/gif", "image/jpeg", "image/png"];
    const file = event.target.files[0];
    if (fileTypes.find(t => t === file.type)) {
      this.s3Service.uploadFile(file, environment.folder.user).then(res => {
        this.form.controls.profilePhoto.setValue(res.Location);
      })
    } else {
      alert(`이미지 형식만 가능합니다. (${fileTypes})`);
    }
  }

  onAddPhone(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  editUser() {
    const { profilePhoto, nickname, name, catchphrase, introduction } = this.form.value;
    this.userService.edit(this.user.id, profilePhoto, nickname, name, catchphrase, introduction).subscribe(resp => {
      alert('수정되었습니다.');
      window.location.href = `/tabs/profile/${this.user.id}`;
    })
  }
}