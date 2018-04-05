import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

declare const jQuery: any;
@Component({
  selector: 'app-crete-account',
  templateUrl: './crete-account.component.html',
  styleUrls: ['./crete-account.component.css']
})
export class CreteAccountComponent implements OnInit {
  idleState = 'Not started.';
  lastPing?: Date = null;
   languages: any;
   langArray: any;
   langobj: Array<Object> = [];
   iama: boolean;
   companyInfo: boolean;
   verification: boolean;
   companyobj: any;
   companyId: any;
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
   countryChangediv: boolean ;
   companylandline2: any;
   companyMobile1: any;
   companyMobile2: any;
   contryIndia: any;
   whoAmI: any;
   emaiIdExists: any;
   emailRegex;
   passwordValid: boolean;
   RegisteredBy: any;
   phoneVerify: any;
   EmailVerify: any;
   CompanyCurrency: any;
   emailIDregister: any;
   mobileIDregister: any;
   isEmailRegistered: boolean;
   ismobileResgistred: boolean;
   otpEmailObj: any;
   otpMobileObj: any;
   otpEmailObjmsg: any ;
   otpMobileObjmsg: any ;
   verifyEmailObj: any ;
   verifyMobileObj: any ;
   fianlSubmit: boolean;
   passwordRegex;
  constructor(private serviceCall: ApiServiceService,
    private formBuilder: FormBuilder, private router: Router,
    private idle: Idle, private keepalive: Keepalive) {
      this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.+#_^])[A-Za-z\d$@$!%*?&.+#_^]{8}/;
          // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(172790);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(172790);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      // this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!' ;
      sessionStorage.clear();
    });
    keepalive.interval(2);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    // sets the ping interval to 15 seconds
    this.reset();
    }

  ngOnInit() {
    if (sessionStorage.getItem('Token') !== null ) {
      this.router.navigate(['/my-account']);
    }
    this.getlanguages();
    this.iama = true;
    this.companyInfo = false;
    this.checkingPassword = false;
    this.getCountries();
    this.accountCreation();
    this.passwordValid = false;
    this.fianlSubmit = true ;
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
    companyLocation: ['', ''],
    companyEmail : ['', [Validators.required , Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.emailRegex)]],
    companyPswrd : ['', [Validators.required , Validators.minLength(8), Validators.maxLength(29), Validators.pattern(this.passwordRegex)]],
    companyCnfPswd : ['', [Validators.required , Validators.minLength(8), Validators.maxLength(29),
               Validators.pattern(this.passwordRegex)]],
    companyMobile2: ['', [Validators.required , Validators.minLength(7), Validators.maxLength(7)]],
    contryIndia: ['', ''],
    companyMobile1: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(3)]],
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
   if (this.whoAmI == 'seller') {
     this.countryChangediv = false ;
     this.contryIndia = 'India';
     this.countryCode = '+91' ;
    this.RegisteredBy = 'Seller';
   } else if (this.whoAmI == 'buyer') {
    this.countryChangediv = true ;
    this.RegisteredBy = 'Buyer';
   } else if (this.whoAmI == 'frighten') {
    this.RegisteredBy = 'Frighten';
    this.countryChangediv = true ;
   }
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
       if (this.createAcc.valid != true) {
        this.serviceCall.customalert('' , 'Please Enter the mandiatory Fields' ,
        'ok' , 'btn-red' , 'red');
       } else if (this.createAcc.controls.companyPswrd.valid === false) {
        this.serviceCall.customalert('' , 'Password should be of minimum 8 chars and max 29 chars. Atleast 1 Uppercase,' +
         '1 Lowercase and 1 special character' ,
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
       this.emaiIdExists = 'Email Id is already Exits';
       this.isEmailRegistered = true ;
       document.getElementById('emailId').click();
      //  this.serviceCall.customalert('' , 'Email is already Exits' ,
      //    'ok' , 'btn-red' , 'red');
        //  this.dialog(emailExits);
      } else {
        this.isEmailRegistered = false ;
        this.ismobileRegistred();
      }
    });
  }

  ismobileRegistred() {
    // let callingcode  = this.countrydata ;
    // console.log(callingcode);
    const mobile = {
      'code': (this.countrydata === undefined) ? this.countryCode : this.countrydata.callingCode ,
      'number': this.companyMobile2
    };
  //  console.log(mobile);
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
          'CompanyCurrency':  (this.countrydata === undefined) ? 'Rupee' :  this.countrydata.currencies[0].code,
          'Password': this.companyPswrd,
          'CompanyContactPersonFirstName': 'fName',
          'CompanyContactPersonSurname': 'sName',
          'CompanyBusinessLandlineCode': (this.countrydata === undefined) ? this.countryCode : this.countrydata.callingCode,
          'CompanyBusinessLandlineNumber': (this.companylandline2 === undefined ) ? '123' : this.companylandline2,
          'CompanyBusinessMobileCode': (this.countrydata === undefined) ? this.countryCode : this.countrydata.callingCode,
          'CompanyBusinessMobileNumber': this.companyMobile1 + this.companyMobile2,
          'BusinessLocation': (this.countrydata === undefined) ? 'India' :  this.countrydata.name,
          'AgreeToRecieveEmail': 'Y',
          'AgreeToRecieveSMS': 'Y',
          'AgreeTermsAndConditions': 'Y',
          'RegisteredBy': this.RegisteredBy
        }
      };
      if (this.whoAmI == 'seller') {
        this.serviceCall.postCall('saveSellerProfile', buyer).subscribe(data => {
          this.companyobj = JSON.parse((<any>data)._body);
          console.log(this.companyobj.message);
          this.companyId = this.companyobj.message ;
          this.otpEmail();
          this.otpMobile();
        });
      } else if (this.whoAmI == 'buyer') {
        this.serviceCall.postCall('saveBuyerProfile', buyer).subscribe(data => {
          console.log(data);
          this.companyobj = JSON.parse((<any>data)._body);
          console.log(this.companyobj);
          this.companyId = this.companyobj.message ;
          this.otpEmail();
          this.otpMobile();
        });
      } else if (this.whoAmI == 'frighten') {
        this.serviceCall.postCall('saveFreightProfile', buyer).subscribe(data => {
          console.log(data);
          this.companyobj = JSON.parse((<any>data)._body);
          console.log(this.companyobj);
          this.companyId = this.companyobj.message ;
          this.otpEmail();
          this.otpMobile();
        });
      }
    }

    reset() {
      this.idle.watch();
      this.idleState = 'Started.';
    }

   

/*go to sign page starts*/
logoutPage() {
  this.router.navigate(['']);
}
/*go to sign page ends */

/*send verify Email starts*/
otpEmail() {
  const data = {
    'Company': {
      'CompanyID': this.companyId
    }
  };
  this.serviceCall.postCall('sendVerifyEmail', data).subscribe(data1 => {
    this.otpEmailObj = JSON.parse((<any>data1)._body);
    console.log(this.companyobj);
    this.otpEmailObjmsg = this.companyobj.message ;
  });
}
/*send Verify Email Ends */

/*send verify Mobile starts */
otpMobile() {
  const data = {
    'Company': {
      'CompanyID': this.companyId
    }
  };
  this.serviceCall.postCall('sendVerifyMobile', data).subscribe(data1 => {
    this.companyobj = JSON.parse((<any>data1)._body);
    console.log(this.companyobj);
  });
}
/*send Verify Mobile Ends */

verifyEmailId() {
  if (this.EmailVerify == '' || this.EmailVerify == undefined) {
    this.serviceCall.customalert('' , 'Please Enter OTP' ,
         'ok' , 'btn-red' , 'red');
  } else {
  const data = {
    'Company': {
      'CompanyID': this.companyId,
      'Code': this.EmailVerify
    }
  };
  this.serviceCall.postCall('validateEmailVerificationCode', data).subscribe(data1 => {
    this.verifyEmailObj = JSON.parse((<any>data1)._body);
    if (this.verifyEmailObj.message == 'false') {
      this.fianlSubmit = true ;
      this.serviceCall.customalert('' , 'Your OTP is not Valid,please Enter Correct OTP' ,
      'ok' , 'btn-red' , 'red');
    } else {
      this.fianlSubmit = false ;
      this.serviceCall.customalert('' , 'Your OTP is Valid,Thank you' ,
        'ok' , 'btn-green' , 'green');
    }
  });
 }
}
verifyMobileId() {
  if (this.phoneVerify == '' || this.phoneVerify == undefined) {
    this.serviceCall.customalert('' , 'Please Enter OTP' ,
         'ok' , 'btn-red' , 'red');
  } else {
    const data = {
      'Company': {
        'CompanyID': this.companyId,
        'Code': this.phoneVerify
      }
    };
    this.serviceCall.postCall('validateMobileVerificationCode', data).subscribe(data1 => {
      this.verifyMobileObj = JSON.parse((<any>data1)._body);
      console.log(this.verifyMobileObj);
      if (this.verifyMobileObj.message == 'false') {
        this.fianlSubmit = true ;
        this.serviceCall.customalert('' , 'Your OTP is not Valid,please Enter Correct OTP' ,
        'ok' , 'btn-red' , 'red');
      } else {
        this.fianlSubmit = false ;
        this.serviceCall.customalert('' , 'Your OTP is Valid,Thank you' ,
        'ok' , 'btn-green' , 'green');
      }
    });
  }
}

 finalSubmit() {
  this.emaiIdExists = 'Thank you for registering. Please proceed to login Page';
        document.getElementById('emailId').click();
 }
}
