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
   companyInfo: boolean;
   verification: boolean;
   countries: any;
   countryobj: any;
   countrydata: any;
   countryCode: any;
   companyName: any;
   companyEmail: any;
   companyPswrd: any;
   companyCnfPswd: any;
   createAcc: FormGroup;
   checkingPassword: boolean;
   whoAmI: any;
   emailRegex;
   emailIDregister: any;
   isEmailRegistered: boolean;
   passwordRegex;
  constructor(private serviceCall: ApiServiceService,
    private formBuilder: FormBuilder, private router: Router) { 
      this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.+#_^])[A-Za-z\d$@$!%*?&.+#_^]{8}/;
    }

  ngOnInit() {
    this.getlanguages();
    this.iama = true;
    this.companyInfo = false;
    this.checkingPassword = false;
    this.getCountries();
    this.accountCreation();
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
 accountCreation() {
  this.createAcc = this.formBuilder.group({
    companyName: ['', [Validators.required]],
    companyLocation: ['', [Validators.required]],
    companyEmail : ['', [Validators.required , Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.emailRegex)]],
    companyPswrd : ['', [Validators.required , Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.passwordRegex)]],
    companyCnfPswd : ['', [Validators.required , Validators.minLength(5), Validators.maxLength(50),
               Validators.pattern(this.passwordRegex)]],

  });
 }

/*Password checking Starts */
 passwordMatch() {
   if (this.companyPswrd === this.companyCnfPswd) {
    // console.log('password mathed');
    this.checkingPassword = false;
     return false;
   } else {
    this.checkingPassword = true;
    // console.log('password not mathed');
    return true;
   }
 }
 /*Password checking End */
  firsttab(val) {
   console.log(val);
   this.whoAmI = val ;
   }


getlanguages() {
  this.serviceCall.getCall('getLanguagesList').subscribe(data => {
   this.langobj = [];
    this.languages = JSON.parse((<any>data)._body);
    this.langArray = this.languages.Languages.Language ;
     // console.log(this.langArray);
    this.langArray.forEach(ele => {
      // console.log(ele.LanguageName);
      if (ele.LanguageName == 'English') {
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
    // console.log(this.countryobj);
    this.countries = this.countryobj.Countries.Country;
   //  console.log(this.countries);
  });
}

/* Get Countries Ends */


/*tab next starts*/
nexttab(val) {
console.log(this.whoAmI);

if (this.whoAmI === undefined) {
  this.serviceCall.customalert('' , 'Please Click Any one button' ,
  'Try Again' , 'btn-red' , 'red');
} else {
  if (val == 'iama') {
    this.iama = false ;
    this.companyInfo = true;
    this.verification = false ;
    } else if (val == 'cmpnyInfo') {
      this.isemailRegister();
   }
}
}
/*tab next ends*/
/*tab previous starts*/
previoustab() {
  this.iama = true ;
  this.companyInfo = false;
  this.verification = false ;
  }
  /*tab previous ends*/

  /*country change option starts*/
  countryData(val) {
    // console.log(val);
    // console.log(this.countrydata.callingCode);
    this.countryCode = this.countrydata.callingCode ;

  }
  /*country change option starts*/
  isemailRegister() {
    const emaili = {
      'email':  this.companyEmail
    };
    console.log(emaili);
    this.serviceCall.postCall('isEmailRegistered', emaili).subscribe(data => {
      this.emailIDregister = JSON.parse((<any>data)._body);
      console.log(this.emailIDregister.message);
      if (this.emailIDregister.message == 'true') {
       this.isEmailRegistered = true ;
      } else {
        this.isEmailRegistered = false ;
        this.iama =  false ;
        this.companyInfo = false;
        this.verification = true ;
      }
    });
  }

  }


