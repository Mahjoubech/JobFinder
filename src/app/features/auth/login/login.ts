import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Auth} from '../../../core/service/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email:string = "";
  password:string = "";
  errorMess:string | null = null;
  constructor(private authService : Auth , private router:Router) {}
  login() {
    this.errorMess = null;
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMess = err.message;
      }
    });
  }
}
