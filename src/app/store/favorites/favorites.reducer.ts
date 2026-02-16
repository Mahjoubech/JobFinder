import { createReducer, on } from '@ngrx/store';
import { FavoritesState } from '../../core/models/favoritesState';
import * as FavoritesActions from './favorites.actions';

export const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const favoritesReducer = createReducer(
  initialState,
  

  on(FavoritesActions.loadFavorites, (state) => ({ ...state, loading: true })),
  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    items: favorites,
    loading: false
  })),
  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),


  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    items: [...state.items, favorite]
  })),


  on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter(item => item.id !== id)
  }))
);
