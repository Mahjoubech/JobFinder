import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Auth} from '../../../core/service/auth';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [FormsModule , CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
   firstName: string = "";
   lastName: string = "";
   email: string = ""
   password: string = "";
   confirmPass: string = "";
  errorMess : string | null = null;

   constructor(private authService : Auth , private router : Router) {}


  register(){
     this.errorMess = null;
     this.authService.register(this.firstName , this.lastName , this.email , this.password , this.confirmPass).subscribe(
       result => {
         if('error' in result){
           this.errorMess = result.error;
         }else{
           localStorage.setItem("user" , JSON.stringify(result));
           this.router.navigate(['/dashboard']);
         }
       }
     )
   }

}
