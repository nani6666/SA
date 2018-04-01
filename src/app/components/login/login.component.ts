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
   keepmeloggedin: any;
   loginObj: any;
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
    console.log(sessionStorage.getItem('Token'));
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
    // console.log(value.controls.Username);
    // console.log(this.keepmeloggedin);
    if (value.controls.Username.valid === false) {
      this.emailfieldVald = true;
    } else if (value.controls.Password.valid === false) {
      this.emailfieldVald = false;
      this.passwordField = true;
    } else {
      this.passwordField = false;
      // console.log('form submitted');
      this.restservice.postCall('authorizeUser', value.value).subscribe(data => {
       console.log((<any>data)._body);
       this.loginObj =  JSON.parse((<any>data)._body);
       console.log(this.loginObj.token);
       sessionStorage.setItem('Token', this.loginObj.token);
       this.router.navigate(['/my-account']);
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
      // console.log( this.langobj);

     });
   }
}
