import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from './../model/configuration';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  urlPrefix = UrlService.prefix;
  static readonly SIGNUP_EVENT_KEY = "signupEvent";
  static readonly ADMIN_PW_KEY = "adminPassword";

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(`${this.urlPrefix}/configurations/`);
  }

  update(configuration: Configuration) {
    return this.http.put(`${this.urlPrefix}/configurations/${configuration.configurationId}/`, configuration);
  }
}
