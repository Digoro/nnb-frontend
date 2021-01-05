import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HostPage } from './page/host/host.page';
import { HostedMeetingsPage } from './page/hosted-meetings/hosted-meetings.page';
import { MeetingAddPage } from './page/meeting-add/meeting-add.page';
import { MeetingEditPage } from './page/meeting-edit/meeting-edit.page';
import { MeetingManagementPage } from './page/meeting-management/meeting-management.page';
import { CsrfInterceptor } from './service/csrf.interceptor';
import { ErrorHttpInterceptor } from './service/error-http-interceptor';
import { TabService } from './service/tab.service';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HostPage,
    MeetingManagementPage,
    HostedMeetingsPage,
    MeetingAddPage,
    MeetingEditPage
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    { provide: COMPOSITION_BUFFER_MODE, useValue: false },
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true },
    CookieService,
    TabService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
