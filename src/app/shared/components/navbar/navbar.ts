import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/service/auth';
import { User } from '../../../core/models/user';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { LoginModal } from '../login-modal/login-modal';
import { LogoutConfirm } from '../logout-confirm/logout-confirm';
import { NotificationService } from '../../../core/service/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LoginModal, LogoutConfirm],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private store = inject(Store);
  showProfileMenu = false;
  isDarkMode = false;
  user: User | null = null;
  showNotifications = false;

  private route = inject(ActivatedRoute);

  constructor(
    public authService: Auth,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if(user){
        this.store.dispatch(FavoritesActions.loadFavorites({userId: user.id}));
       }
     this.user = user;
    });

    this.route.queryParams.subscribe((params: any) => {
      if (params['login'] === 'true') {
        this.openLoginModal();
      }
    });

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

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.markAsRead();
    }
  }

  showLoginModal = false;
  showLogoutConfirm = false;

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  closeLogoutConfirm() {
    this.showLogoutConfirm = false;
  }

  logout() {
    // Open confirmation modal instead of logging out immediately
    this.showLogoutConfirm = true;
    this.showProfileMenu = false;
  }

  onConfirmLogout() {
    this.authService.logout();
    this.showLogoutConfirm = false;
    this.router.navigate(['/']);
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
