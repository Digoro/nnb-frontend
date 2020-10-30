import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from 'src/app/model/location';
import { FormService } from 'src/app/service/form.service';
import { User } from './../../model/user';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  method: string;
  sexs = ['남', '여', 'Other'];
  checkAllFlag = false;
  termsOfService = 'https://www.notion.so/gdgdaejeon/43b16b117aa840d397a71350a8d08412';
  collectPersonal = 'https://www.notion.so/gdgdaejeon/5ad28ab509bb461090e2bca00af5ac59';

  constructor(
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.method = params.method;
      if (params.method === 'kakao') {
        this.signupForm = new FormGroup({
          service: new FormControl(false, Validators.requiredTrue),
          personal: new FormControl(false, Validators.requiredTrue),
          marketing: new FormControl(false)
        });
      } else {
        this.signupForm = new FormGroup({
          id: new FormControl('', this.formService.getValidators(30)),
          password: new FormControl('', this.formService.getValidators(30)),
          passwordConfirm: new FormControl('', this.formService.getValidators(30)),
          name: new FormControl('', this.formService.getValidators(30)),
          nickName: new FormControl('', this.formService.getValidators(30)),
          sex: new FormControl('', this.formService.getValidators(30)),
          age: new FormControl('', this.formService.getValidators(30)),
          service: new FormControl(false, Validators.requiredTrue),
          personal: new FormControl(false, Validators.requiredTrue),
          marketing: new FormControl(false)
        });
      }
    });
  }

  signup() {
    if (this.method === 'kakao') {
      window.open('https://nonunbub.com/accounts/kakao/login/?process=login');
    } else {
      const { id, password, name, nickName, sex, age } = this.signupForm.value;
      const user = new User(0, 'email', name, nickName, 'birth', sex, 'phone', 'image',
        new Location(0, 0, 'address'), 0, 'catch_phrase', 'introduction', 'password', 'provider', 0, true);
      this.userService.signup(user).subscribe(resp => {
        alert(resp);
        this.router.navigate(['/tabs/home']);
      });
    }
  }

  checkAll() {
    this.checkAllFlag = !this.checkAllFlag;
    this.signupForm.controls.service.setValue(this.checkAllFlag);
    this.signupForm.controls.personal.setValue(this.checkAllFlag);
    this.signupForm.controls.marketing.setValue(this.checkAllFlag);
  }

  login() {
    window.open('https://nonunbub.com/accounts/kakao/login/?process=login');
  }

  back() {
    this.router.navigate(['/tabs/login']);
  }
}
