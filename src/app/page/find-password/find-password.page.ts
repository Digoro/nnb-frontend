import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/service/form.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'find-password',
  templateUrl: './find-password.page.html',
  styleUrls: ['./find-password.page.scss'],
})
export class FindPasswordPage implements OnInit {
  form: FormGroup;

  constructor(
    private formService: FormService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', this.formService.getValidators(254, [Validators.email]))
    });
  }

  send() {
    this.userService.findPassword(this.form.controls.email.value).subscribe(resp => {
      alert(`${resp.email}로 메일을 전송하였습니다.`);
    })
  }
}
