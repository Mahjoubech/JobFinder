import { CommonModule } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {Auth} from '../../../core/service/auth';
import {User} from '../../../core/models/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private authService = inject(Auth);
  showProfileMenu = false;
  isDarkMode = false;
  user : User | null = null;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if(user){
      this.user = user;
    }
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    console.log('[Navbar] Initializing theme. Stored:', storedTheme, 'System Dark:', systemPrefersDark);

    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      console.log('[Navbar] Setting Initial Theme: DARK');
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      console.log('[Navbar] Setting Initial Theme: LIGHT');
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleTheme() {
    console.log('[Navbar] Toggle Theme Clicked. Previous State (isDarkMode):', this.isDarkMode);

    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      console.log('[Navbar] Switching to DARK mode');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      console.log('[Navbar] Switching to LIGHT mode');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    console.log('[Navbar] Document ClassList contains dark:', document.documentElement.classList.contains('dark'));
  }
}
