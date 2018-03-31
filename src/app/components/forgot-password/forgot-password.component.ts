import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  languages: any;
  langArray: any;
  langobj: Array<Object> = [];
  forgottenPassword: FormGroup;
  emailField: boolean;
  emailRegex;
  constructor(private formBuilder: FormBuilder, private router: Router,
    public restservice: ApiServiceService) { 
      this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    }

  ngOnInit() {
   this.getlanguages();
   this.emailField = false;
   this.forgotPassword();
  }

  forgotPassword() {
    this.forgottenPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.emailRegex)]]
    });
  }

  getlanguages() {
    this.restservice.getCall('getLanguagesList').subscribe(data => {
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

  onSubmit(val) {
    if (val.controls.email.valid === false) {
      this.emailField = true;
    } else {
      this.emailField = false;
      this.restservice.postCall('sendUserCredentials', val.value).subscribe(data => {
        console.log(data);
        this.restservice.customalert('' , 'Success' ,
        'ok' , 'btn-green' , 'green');
       }, err => {
         this.restservice.customalert('' , 'Invalid Email ,This Email is not Registred' ,
         'Try Again' , 'btn-red' , 'red');
     });
    }

  }
}
