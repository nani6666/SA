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
    this.serviceCall.getCall('http://34.245.8.159:8091/i4gorigin.accounts/getBaseCountryParamsOfSeller').subscribe(data => {
      console.log((<any>data)._body);
      const dataaa  = JSON.parse((<any>data)._body);
      console.log(dataaa);
  });
const postData = {
  'Language': {
    'LanguageName': 'English',
    'LanguageOperationTypes': {
      'OperationType': 'CUSTOMER_TYPE'
    }
  }
};
  this.serviceCall.postCall('http://34.245.8.159:8091/i4gorigin.accounts/getLanguageKeywords', postData).subscribe(data => {
    console.log((<any>data)._body);
  });
}
  }


