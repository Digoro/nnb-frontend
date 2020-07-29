import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
import { UserService } from '../../service/user.service';
import { KakaoUser } from './../../model/user';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: User;
  kakaoUser: KakaoUser;
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private formService: FormService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(resp => {
      this.user = resp.user;
      this.kakaoUser = resp.kakaoUser;
      this.form = new FormGroup({
        nickname: new FormControl('', this.formService.getValidators(30)),
        catchphrase: new FormControl('', this.formService.getValidators(30)),
        description: new FormControl('', this.formService.getValidators(300)),
      });
    });
  }

  editUser() {
    // this.userService.edit(undefined).subscribe(resp => {
    //   alert(resp)
    // })
    alert('서비스 준비중입니다 ^^');
  }
}
