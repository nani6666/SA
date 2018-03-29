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
  constructor(public router: Router, public restservice: ApiServiceService) { }

  ngOnInit() {
   this.getlanguages();
  }

  onSubmit() {
    this.restservice.postCall('authorizeUser', '').subscribe(data => {
      console.log(data);
    }, err => {
       console.log('daata');
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
         if (ele.LanguageName == 'English'){
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
