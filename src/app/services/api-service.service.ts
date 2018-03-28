import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Headers, Http, HttpModule, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ApiServiceService {
  username: any;
  password: any;
  headers: any;
  constructor(private _http: Http) { }

  call(url): Observable<any> {
    this.username = 'raju';
    this.password = 'raju';
    this.headers = new Headers();
    this.headers.append('services-testing', 'services-testing');
    this.headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));
    this.headers.append('Content-Type', 'application/json');
    return this._http.get(url , {headers: this.headers})
      .map((res: Response) => res)
      .catch((error: any) => error);
  }
}
