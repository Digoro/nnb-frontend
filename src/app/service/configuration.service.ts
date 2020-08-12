import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Configuration } from './../model/configuration';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  urlPrefix = UrlService.prefix;
  static readonly SIGNUP_EVENT_KEY = "signupEvent"
  constructor(
    private http: HttpClient
  ) { }

  get(key: string): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(`${this.urlPrefix}/configurations/`).pipe(
      filter(configs => !!configs.find(config => config.key === key))
    )
  }

  update(configuration: Configuration) {
    return this.http.put(`${this.urlPrefix}/configurations/${configuration.configurationId}/`, configuration);
  }
}
