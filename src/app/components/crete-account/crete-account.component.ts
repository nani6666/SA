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
   companylandline1: any;
   companylandline2: any;
   companyMobile1: any;
   companyMobile2: any;
   whoAmI: any;
   emailRegex;
   passwordValid: boolean;
   RegisteredBy: any;
   CompanyCurrency: any;
   emailIDregister: any;
   mobileIDregister: any;
   isEmailRegistered: boolean;
   ismobileResgistred: boolean;
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
    this.passwordValid = false;
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
    companyPswrd : ['', [Validators.required , Validators.minLength(8), Validators.maxLength(29), Validators.pattern(this.passwordRegex)]],
    companyCnfPswd : ['', [Validators.required , Validators.minLength(8), Validators.maxLength(29),
               Validators.pattern(this.passwordRegex)]],
    companyMobile2: ['', [Validators.required]],
    companyMobile1: ['', ''],
    companylandline1: ['', ''],
    companylandline2: ['', '']
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
  this.serviceCall.customalert('' , 'Please Click any button' ,
  'ok' , 'btn-red' , 'red');
} else {
  if (val == 'iama') {
    this.iama = false ;
    this.companyInfo = true;
    this.verification = false ;
    } else if (val == 'cmpnyInfo') {
      if (this.createAcc.controls.companyPswrd.valid === false) {
        this.serviceCall.customalert('' , 'Password should be of minimum 8 chars and max 29 chars. Atleast 1 Uppercase,' +
         '1 Lowercase and 1 special character' ,
        'ok' , 'btn-red' , 'red');
      } else if (this.createAcc.valid != true) {
        this.serviceCall.customalert('' , 'Please Enter the mandiatory Fields' ,
        'ok' , 'btn-red' , 'red');
      } else {
        this.isemailRegister();
      }
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
  /*country change option ends*/
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
       this.serviceCall.customalert('' , 'Email is already Exits' ,
         'ok' , 'btn-red' , 'red');
      } else {
        this.isEmailRegistered = false ;
        this.ismobileRegistred();
      }
    });
  }

  ismobileRegistred() {
    const mobile = {
      'code': this.countrydata.callingCode,
      'number': this.companyMobile2
    };
   // console.log(mobile);
    this.serviceCall.postCall('isMobileRegistered', mobile).subscribe(data => {
      this.mobileIDregister = JSON.parse((<any>data)._body);
      console.log(this.mobileIDregister.message);
      if (this.mobileIDregister.message == 'true') {
       this.ismobileResgistred = true ;
       this.serviceCall.customalert('' , 'Mobile is already Exits' ,
         'ok' , 'btn-red' , 'red');
      } else {
        this.ismobileResgistred = false ;
        this.postcallCopanyInfo();
      }
    });
  }

  postcallCopanyInfo() {
      this.iama =  false ;
      this.companyInfo = false;
      this.verification = true ;
     // console.log(this.countrydata);
     if (this.whoAmI == 'seller') {
      this.RegisteredBy = 'Seller';
     } else if (this.whoAmI == 'buyer') {
      this.RegisteredBy = 'Buyer';
     } else if (this.whoAmI == 'frighten') {
      this.RegisteredBy = 'Frighten';
     }
      const buyer = {
        'Company': {
          'CompanyName': this.companyName,
          'CompanyDefaultLanguage': 'English',
          'CompanyEmail': this.companyEmail,
          'CompanyCurrency': this.countrydata.currencies[0].code,
          'Password': this.companyPswrd,
          'CompanyContactPersonFirstName': 'fName',
          'CompanyContactPersonSurname': 'sName',
          'CompanyBusinessLandlineCode': this.countrydata.callingCode,
          'CompanyBusinessLandlineNumber': (this.companylandline2 === undefined ) ? '123' : this.companylandline2,
          'CompanyBusinessMobileCode': this.countrydata.callingCode,
          'CompanyBusinessMobileNumber': this.companyMobile2,
          'BusinessLocation': this.countrydata.name,
          'AgreeToRecieveEmail': 'Y',
          'AgreeToRecieveSMS': 'Y',
          'AgreeTermsAndConditions': 'Y',
          'RegisteredBy': this.RegisteredBy
        }
      };
      if (this.whoAmI == 'seller') {
        this.RegisteredBy = 'Seller';
        console.log(buyer);
        this.serviceCall.postCall('saveSellerProfile', buyer).subscribe(data => {
          console.log(data);
        });
      } else if (this.whoAmI == 'buyer') {
        this.serviceCall.postCall('saveBuyerProfile', buyer).subscribe(data => {
          console.log(data);
        });
      } else if (this.whoAmI == 'frighten') {
        this.serviceCall.postCall('saveFreightProfile', buyer).subscribe(data => {
          console.log(data);
        });
      }
    }

}
