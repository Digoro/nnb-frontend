import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { NgxErrorsModule } from '@hackages/ngxerrors';
import { IonicModule } from '@ionic/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'ion2-calendar';
import { CarouselModule } from 'ngx-bootstrap/carousel';
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
import { FormInputComponent } from './component/form-input/form-input.component';
import { HorizontalSliderComponent } from './component/horizontal-slider/horizontal-slider.component';
import { MeetingCardComponent } from './component/meeting-card/meeting-card.component';
import { MeetingControlComponent } from './component/meeting-control/meeting-control.component';
import { MeetingPreviewComponent } from './component/meeting-preview/meeting-preview.component';
import { MyinfoMeetingComponent } from './component/myinfo-meeting/myinfo-meeting.component';
import { NotionDescComponent } from './component/notion-desc/notion-desc.component';
import { PriceComponent } from './component/price/price.component';
import { SkeletonComponent } from './component/skeleton/skeleton.component';
import { DebounceClickDirective } from './directive/debounce-click.directive';
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
    FormInputComponent,
    HideToolbarDirective,
    InputDigitsOnlyDirective,
    DebounceClickDirective,
    FooterComponent,
    MeetingPreviewComponent,
    MeetingControlComponent,
    FormErrorsComponent,
    MyinfoMeetingComponent,
    NotionDescComponent,
    PriceComponent
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
        toolbar: '#ql-toolbar'
        // toolbar: [
        //   ['strike', { 'color': [] }, 'link', 'image', 'video'],
        //   // ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        //   // // ['blockquote', 'code-block'],
        //   [
        //     { 'list': 'ordered' },
        //     { 'list': 'bullet' },
        //     { 'align': [] }
        //   ],
        //   // // [{ 'indent': '-1' }, { 'indent': '+1' }],
        //   // [
        //   //   { 'header': [3, 4, false] },
        //   //   { 'color': [] },
        //   //   // { 'size': ['small', 'large', 'huge'] },
        //   // ],
        //   // // { 'background': [] }
        //   // ['link', 'image', 'video']
        // ]
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
    NgSelectModule,
    CarouselModule.forRoot()
  ],
  exports: [
    HorizontalSliderComponent,
    MeetingCardComponent,
    EmptyMeetingCardComponent,
    SkeletonComponent,
    CommentComponent,
    MyinfoMeetingComponent,
    NotionDescComponent,
    FormInputComponent,
    PriceComponent,
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
    DebounceClickDirective,
    FooterComponent,
    MeetingPreviewComponent,
    TableModule,
    CalendarModule,
    MeetingControlComponent,
    FormErrorsComponent,
    NgxCronUiModule,
    FullCalendarModule,
    BsDatepickerModule,
    NgSelectModule,
    CarouselModule
  ],
})
export class SharedModule { }
