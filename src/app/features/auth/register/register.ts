import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Auth} from '../../../core/service/auth';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [FormsModule , CommonModule ,RouterLink],
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


  register() {
    this.errorMess = null;

    if (this.password !== this.confirmPass) {
      this.errorMess = "Passwords do not match";
      return;
    }

    this.authService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: (user) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMess = err.message;
      }
    });
  }

}
