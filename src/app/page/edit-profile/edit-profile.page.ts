import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
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
    private formService: FormService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.setUser();
  }

  setUser() {
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.user = resp;
      this.form = new FormGroup({
        nickname: new FormControl(resp.nickName, this.formService.getValidators(30)),
        catchphrase: new FormControl(resp.catch_phrase, this.formService.getValidators(30)),
        introduction: new FormControl(resp.introduction, this.formService.getValidators(300)),
      });
    });
  }

  editUser() {
    const { nickname, catchphrase, introduction } = this.form.value;
    this.userService.edit(this.user.uid, nickname, catchphrase, introduction).subscribe(resp => {
      this.setUser()
    })
  }
}
