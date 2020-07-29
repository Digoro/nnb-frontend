import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { EditIndividualPage } from './edit-individual.page';

const routes: Routes = [
  {
    path: '',
    component: EditIndividualPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditIndividualPage]
})
export class EditIndividualPageModule { }
