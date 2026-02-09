import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Auth} from '../../../core/service/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule , CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email:string = "";
  password:string = "";
  errorMess:string | null = null;
  constructor(private authService : Auth , private router:Router) {}
  login(){
    this.errorMess = null;
    this.authService.login(this.email , this.password).subscribe(
      result => {
        if('error' in result){
          this.errorMess = result.error;
        }else{
          localStorage.setItem('user' , JSON.stringify(result));
          this.router.navigate(['/dashboard']);
        }
      }
    )

  }
}
