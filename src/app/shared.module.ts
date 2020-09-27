import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@hackages/ngxerrors';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxCronUiModule } from 'ngx-cron-ui';
import { TableModule } from 'ngx-easy-table';
import { QuillModule } from 'ngx-quill';
import { NgxUploaderModule } from 'ngx-uploader';
import { environment } from './../environments/environment';
import { CommentComponent } from './component/comment/comment.component';
import { EmptyMeetingCardComponent } from './component/empty-meeting-card/empty-meeting-card.component';
import { FooterComponent } from './component/footer/footer.component';
import { FormErrorsComponent } from './component/form-errors/form-errors.component';
import { HorizontalSliderComponent } from './component/horizontal-slider/horizontal-slider.component';
import { MeetingCardComponent } from './component/meeting-card/meeting-card.component';
import { MeetingControlComponent } from './component/meeting-control/meeting-control.component';
import { MeetingPreviewComponent } from './component/meeting-preview/meeting-preview.component';
import { SkeletonComponent } from './component/skeleton/skeleton.component';
import { HideToolbarDirective } from './directive/hide-toolbar.directive';
import { InputDigitsOnlyDirective } from './directive/input.digits.only.directive';
import { TruncatePipe } from './pipe/truncate.pipe';

@NgModule({
  declarations: [
    TruncatePipe,
    HorizontalSliderComponent,
    MeetingCardComponent,
    EmptyMeetingCardComponent,
    SkeletonComponent,
    CommentComponent,
    HideToolbarDirective,
    InputDigitsOnlyDirective,
    FooterComponent,
    MeetingPreviewComponent,
    MeetingControlComponent,
    FormErrorsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    NgxUploaderModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          // ['blockquote', 'code-block'],
          [
            { 'list': 'ordered' },
            { 'list': 'bullet' },
            { 'align': [] }
          ],
          // [{ 'indent': '-1' }, { 'indent': '+1' }],
          [
            { 'header': [3, 4, false] },
            { 'color': [] },
            // { 'size': ['small', 'large', 'huge'] },
          ],
          // { 'background': [] }
          ['link', 'image', 'video']
        ]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey,
      libraries: ['places']
    }),
    ClipboardModule,
    ModalModule.forRoot(),
    TableModule,
    CalendarModule,
    NgxCronUiModule
  ],
  exports: [
    HorizontalSliderComponent,
    MeetingCardComponent,
    EmptyMeetingCardComponent,
    SkeletonComponent,
    CommentComponent,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    NgxUploaderModule,
    TruncatePipe,
    QuillModule,
    AgmCoreModule,
    ClipboardModule,
    ModalModule,
    HideToolbarDirective,
    InputDigitsOnlyDirective,
    FooterComponent,
    MeetingPreviewComponent,
    TableModule,
    CalendarModule,
    MeetingControlComponent,
    FormErrorsComponent,
    NgxCronUiModule
  ],
})
export class SharedModule { }
