import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './../../services/api-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
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
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  constructor(private formBuilder: FormBuilder, private router: Router,
    public restservice: ApiServiceService, private idle: Idle, private keepalive: Keepalive)  { 
      this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(172800);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(172800);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
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

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
