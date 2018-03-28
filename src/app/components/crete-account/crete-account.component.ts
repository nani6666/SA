import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
@Component({
  selector: 'app-crete-account',
  templateUrl: './crete-account.component.html',
  styleUrls: ['./crete-account.component.css']
})
export class CreteAccountComponent implements OnInit {

  constructor(private serviceCall: ApiServiceService) { }

  ngOnInit() {
    this.serviceCall.call('http://34.245.8.159:8091/i4gorigin.accounts/getBaseCountryParamsOfSeller').subscribe(data => {
      console.log((<any>data)._body);
      const dataaa  = JSON.parse((<any>data)._body);
      console.log(dataaa);
  });
}
  }


