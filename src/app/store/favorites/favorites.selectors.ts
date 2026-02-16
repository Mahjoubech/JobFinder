import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from '../models/favoriteState';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state) => state.items
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);


export const selectIsFavorite = (offerId: string) => createSelector(
  selectAllFavorites,
  (favorites) => favorites.some(fav => fav.offerId === offerId)
);

export const selectFavoriteByOfferId = (offerId: string) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.find(fav => fav.offerId === offerId)
);
