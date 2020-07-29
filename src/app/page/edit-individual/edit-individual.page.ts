import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/service/form.service';

@Component({
  selector: 'edit-individual',
  templateUrl: './edit-individual.page.html',
  styleUrls: ['./edit-individual.page.scss'],
})
export class EditIndividualPage implements OnInit {
  form: FormGroup;

  constructor(
    private formService: FormService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', this.formService.getValidators(30)),
      description: new FormControl('', this.formService.getValidators(30)),
      gender: new FormControl('', this.formService.getValidators(300)),
      birthday: new FormControl('', this.formService.getValidators(300)),
      email: new FormControl('', this.formService.getValidators(300)),
      phone: new FormControl('', this.formService.getValidators(300)),
    });
  }

  editUser() { }

}
