import {ChangeDetectionStrategy, Component, OnInit, signal, inject, Input} from '@angular/core';
import {Job, JobService} from '../../../core/service/job';
import {CommonModule} from '@angular/common';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import { HttpClient } from '@angular/common/http';
import { ApplicationService } from '../../../core/service/applications';
import { Auth } from '../../../core/service/auth';
import { ToastService } from '../../../core/service/toast';
import { Router } from '@angular/router';
import { Application } from '../../../core/models/applicationInterface';
import { FormsModule } from '@angular/forms';
import { LoginModal } from '../../../shared/components/login-modal/login-modal';
import { User } from '../../../core/models/user';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FavoriteOffer } from '../../../core/models/favoriteOffer';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectIsFavorite, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-job-detail',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule ,  LogoBackgroundPipe, FormsModule, LoginModal],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit{
  @Input() showStatusCard = true;
  isFavorite = signal<boolean>(false);
  favoriteData$!: Observable<FavoriteOffer | undefined>;
  job = signal<Job | null>(null);
  isTracked = signal(false);
  isProcessing = signal(false);
  application = signal<Application | null>(null);

  user: User | null = null;
  showLoginModal = false;

  private http = inject(HttpClient);
  private API_URL = '/themuse-api/api/public/jobs';
  private applicationService = inject(ApplicationService);
  private auth = inject(Auth);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private store = inject(Store);

  constructor(private jobService : JobService) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.jobService.selectedJob$.subscribe(job => {
      this.job.set(job);
      this.checkIfTracked(job);

      if (job) {
         // Setup NgRx selectors
         const isFav$ = this.store.select(selectIsFavorite(job.id.toString()));
         const favData$ = this.store.select(selectFavoriteByOfferId(job.id.toString()));
         
         // Convert to signal for easier template usage if preferred, or subscribe
         // Since we used manual isFavorite boolean before, let's use a signal or manual subscription to keep template valid or update template.
         // Let's update template to use async pipe or signal.
         // Actually, let's just subscribe here to update the isFavorite signal to keep template changes minimal or consistent?
         // No, let's be reactive. use toSignal or manual subscribe.
         // Since imports might be tricky with toSignal, manual subscribe is safe.
         isFav$.subscribe(val => this.isFavorite.set(val));
         this.favoriteData$ = favData$;

         if (!job.contents) {
          this.http.get<Job>(`${this.API_URL}/${job.id}`).subscribe(fullJob => {
             this.job.set(fullJob);
             this.checkIfTracked(fullJob);
          });
        }
      }
    });
  }

  checkIfTracked(job: Job | null) {
    if (!job) {
        this.isTracked.set(false);
        this.application.set(null);
        return;
    }
    const user = this.auth.getCurrentUser();
    if (user) {
      this.applicationService.isJobTracked(job.id.toString(), user.id).subscribe(apps => {
        if (apps.length > 0) {
            this.isTracked.set(true);
            this.application.set(apps[0]);
        } else {
            this.isTracked.set(false);
            this.application.set(null);
        }
      });
    } else {
        this.isTracked.set(false);
        this.application.set(null);
    }
  }

  apply() {
      const job = this.job();
      if (!job) return;
      
      if (!this.auth.isAuthenticated()) {
          this.openLoginModal();
          return;
      }
      
      this.router.navigate(['/jobs', job.id, 'apply']);
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  updateStatus(event: any) {
    const app = this.application();
    if (!app || !app.id) return;
    const newStatus = event.target.value;

    this.applicationService.updateStatus(app.id, newStatus).subscribe({
      next: () => {
        this.toastService.show('Status updated', 'success');
        this.application.update(a => a ? {...a, status: newStatus} : null);
      },
      error: () => this.toastService.show('Failed to update status', 'error')
    });
  }

  saveNotes() {
      const app = this.application();
      if (!app || !app.id) return;
      this.applicationService.updateNotes(app.id, app.notes).subscribe({
          next: () => this.toastService.show('Notes saved', 'success'),
          error: () => this.toastService.show('Failed to save notes', 'error')
      });
  }

  get companyDescriptionSnippet(): string {
    if (!this.job()?.contents) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.job()?.contents || '';
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }
  toggleFavorite() {
    if (!this.user || !this.job()) return;

    if (this.isFavorite()) {
       // Remove
       this.favoriteData$.pipe(take(1)).subscribe(fav => {
         if (fav) {
           this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
         }
       });
    } else {
      // Add
      const job = this.job()!;
      const newFav: Omit<FavoriteOffer, 'id'> = {
        userId: this.user.id,
        offerId: job.id.toString(),
        title: job.name,
        company: job.company.name,
        location: job.locations?.[0]?.name || 'Unknown'
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite: newFav }));
    }
  }
}
