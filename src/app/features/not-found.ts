import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      <div class="text-center space-y-8 max-w-lg mx-auto">
        
        <!-- Animated 404 Text -->
        <h1 class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 animate-pulse-slow font-mono tracking-tighter">
          404
        </h1>

        <!-- Message -->
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            The page you are looking for likes to stay hidden. <br>
            Let's get you back on track.
          </p>
        </div>

        <!-- Action Button -->
        <div class="pt-4">
          <a routerLink="/" 
             class="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </a>
        </div>

      </div>
      
      <!-- Subtle Background Element -->
      <div class="absolute bottom-10 text-sm text-gray-400 dark:text-gray-600 opacity-50 animate-bounce">
        Error Code: 404
      </div>

    </div>
  `,
  styles: [`
    .animate-pulse-slow {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
  `]
})
export class NotFound {}
