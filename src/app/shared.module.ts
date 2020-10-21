import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { NgxErrorsModule } from '@hackages/ngxerrors';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { koLocale } from 'ngx-bootstrap/locale';
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
import { MyinfoMeetingComponent } from './component/myinfo-meeting/myinfo-meeting.component';
import { NotionDescComponent } from './component/notion-desc/notion-desc.component';
import { SkeletonComponent } from './component/skeleton/skeleton.component';
import { HideToolbarDirective } from './directive/hide-toolbar.directive';
import { InputDigitsOnlyDirective } from './directive/input.digits.only.directive';
import { TruncatePipe } from './pipe/truncate.pipe';
defineLocale('ko', koLocale);

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin, interactionPlugin
]);

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
    FormErrorsComponent,
    MyinfoMeetingComponent,
    NotionDescComponent
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
          ['strike', { 'color': [] }, 'link', 'image', 'video'],
          // ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          // // ['blockquote', 'code-block'],
          [
            { 'list': 'ordered' },
            { 'list': 'bullet' },
            { 'align': [] }
          ],
          // // [{ 'indent': '-1' }, { 'indent': '+1' }],
          // [
          //   { 'header': [3, 4, false] },
          //   { 'color': [] },
          //   // { 'size': ['small', 'large', 'huge'] },
          // ],
          // // { 'background': [] }
          // ['link', 'image', 'video']
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
    NgxCronUiModule,
    FullCalendarModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    HorizontalSliderComponent,
    MeetingCardComponent,
    EmptyMeetingCardComponent,
    SkeletonComponent,
    CommentComponent,
    MyinfoMeetingComponent,
    NotionDescComponent,
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
    NgxCronUiModule,
    FullCalendarModule,
    BsDatepickerModule
  ],
})
export class SharedModule { }
