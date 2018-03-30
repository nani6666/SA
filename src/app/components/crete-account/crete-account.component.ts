import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-crete-account',
  templateUrl: './crete-account.component.html',
  styleUrls: ['./crete-account.component.css']
})
export class CreteAccountComponent implements OnInit {
   languages: any;
   langArray: any;
   langobj: Array<Object> = [];
   iama: boolean;
   countries: any;
   countryobj: any;
  constructor(private serviceCall: ApiServiceService) { }

  ngOnInit() {
    this.getlanguages();
    this.iama = false;
    this.getCountries();
  //   this.serviceCall.getCall('http://34.245.8.159:8091/i4gorigin.accounts/getBaseCountryParamsOfSeller').subscribe(data => {
  //     console.log((<any>data)._body);
  //     const dataaa  = JSON.parse((<any>data)._body);
  //     console.log(dataaa);
  // });
const postData = {
  'Language': {
    'LanguageName': 'English',
    'LanguageOperationTypes': {
      'OperationType': 'CUSTOMER_TYPE'
    }
  }
};
  // this.serviceCall.postCall('http://34.245.8.159:8091/i4gorigin.accounts/getLanguageKeywords', postData).subscribe(data => {
  //   console.log((<any>data)._body);
  // });
}

getlanguages() {
  this.serviceCall.getCall('getLanguagesList').subscribe(data => {
   this.langobj = [];
    this.languages = JSON.parse((<any>data)._body);
    this.langArray = this.languages.Languages.Language ;
     // console.log(this.langArray);
    this.langArray.forEach(ele => {
      // console.log(ele.LanguageName);
      if (ele.LanguageName == 'English'){
       this.langobj.push({'LanguageName': ele.LanguageName, 'LanguageID': ele.LanguageID ,
      'langImg': './assets/image/demo/flags/gb.png'});
      } else if (ele.LanguageName == 'French'){
       this.langobj.push({'LanguageName': ele.LanguageName, 'LanguageID': ele.LanguageID ,
       'langImg': './assets/image/demo/flags/lb.png'});
      }
    });
    // console.log( this.langobj);

  });
}

/* Get Countries Starts */
getCountries() {
  this.serviceCall.getCall('getCountriesList').subscribe(data => {
    this.countryobj = JSON.parse((<any>data)._body);
    console.log(this.countryobj);
    this.countries = this.countryobj.Countries.Country;
    console.log(this.countries);
  });
}

/* Get Countries Ends */
  }


