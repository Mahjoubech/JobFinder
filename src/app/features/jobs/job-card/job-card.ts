import {Component, Input, ChangeDetectionStrategy, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import {CompanyInitialsPipe} from '../../../shared/pipes/company-initials-pipe';
import { Auth } from '../../../core/service/auth';
import { User } from '../../../core/models/user';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FavoriteOffer } from '../../../core/models/favoriteOffer';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectIsFavorite, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-job-card',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule , LogoBackgroundPipe , CompanyInitialsPipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard implements OnInit {
  @Input() job!: Job;
  @Input() isActive: boolean = false ;
  
  private authService = inject(Auth);
  private store = inject(Store);
  
  user: User | null = null;
  isFavorite$!: Observable<boolean>;
  favoriteData$!: Observable<FavoriteOffer | undefined>;
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    if (this.job) {
      this.isFavorite$ = this.store.select(selectIsFavorite(this.job.id.toString()));
      this.favoriteData$ = this.store.select(selectFavoriteByOfferId(this.job.id.toString()));
    }
  }

  toggleFavorite() {
    if (!this.user) return;

    // Use take(1) to get the current values without maintaining a subscription
    this.isFavorite$.pipe(take(1)).subscribe(isFav => {
      if (isFav) {
        this.favoriteData$.pipe(take(1)).subscribe(fav => {
          if (fav) {
            this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
          }
        });
      } else {
        const newFav: Omit<FavoriteOffer, 'id'> = {
          userId: this.user!.id,
          offerId: this.job.id.toString(),
          title: this.job.name,
          company: this.job.company.name,
          location: this.job.locations?.[0]?.name || 'Unknown'
        };
        this.store.dispatch(FavoritesActions.addFavorite({ favorite: newFav }));
      }
    });
  }
}
