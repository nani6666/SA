import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Headers, Http, HttpModule, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

 const api = 'http://34.245.8.159:8091/i4gorigin.accounts/';
@Injectable()
export class ApiServiceService {
  username: any;
  password: any;
  headers: any;
  constructor(private _http: Http) { }

  /* get call starts */
  getCall(url): Observable<any> {
    this.username = 'raju';
    this.password = 'raju';
    this.headers = new Headers();
    this.headers.append('services-testing', 'services-testing');
    this.headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));
    this.headers.append('Content-Type', 'application/json');
    return this._http.get(api + url , {headers: this.headers})
      .map((res: Response) => res)
      .catch((error: any) => error);
  }
   /* get call ends */

    /* post calls starts */
    postCall(url, data): Observable<any[]> {
      this.username = 'raju';
      this.password = 'raju';
      this.headers = new Headers();
      this.headers.append('services-testing', 'services-testing');
      this.headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));
      this.headers.append('Content-Type', 'application/json');
      return this._http.post(api + url, data , {headers: this.headers})
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'Server error'));
       }
    /*post calls Ends*/

}
