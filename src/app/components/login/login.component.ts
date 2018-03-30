import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   languages: any;
   langArray: any;
   langobj: Array<Object> = [];
   login: FormGroup;
   emailfieldVald: boolean;
   passwordField: boolean;
   // private formSubmitAttempt: boolean;
  emailRegex;
  password;
  isPasswordForgot: boolean;
  isPasswordCorrect: boolean;
  constructor(private formBuilder: FormBuilder, private router: Router,
           public restservice: ApiServiceService) {
            this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            this.password = null;
            }

  ngOnInit() {
    this.createform();
    this.getlanguages();
    this.emailfieldVald = false;
    this.passwordField = false;
  }
   createform() {
    this.login = this.formBuilder.group({
      Username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(this.emailRegex)]],
      Password: [this.password, [Validators.required]],
    });
   }

  onSubmit(value) {
    // this.formSubmitAttempt = true;
    console.log(value.controls.Username);
    if (value.controls.Username.valid === false) {
      this.emailfieldVald = true;
    } else if (value.controls.Password.valid === false) {
      this.emailfieldVald = false;
      this.passwordField = true;
    } else {
      this.passwordField = false;
      console.log('form submitted');
      this.restservice.postCall('authorizeUser', value.value).subscribe(data => {
        console.log(data);
      }, err => {
        this.restservice.customalert('' , 'Invalid username/password, Please enter correct details' ,
        'Try Again' , 'btn-red' , 'red');
    });
    }
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
       console.log( this.langobj);

     });
   }
}
