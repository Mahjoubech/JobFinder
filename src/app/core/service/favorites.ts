import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { FavoriteOffer } from '../models/favoriteOffer';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);

  private API_URL = 'http://localhost:3000/favoritesOffers';

  getFavorites(userId: string): Observable<FavoriteOffer[]> {
    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const favorites = this.getStoredFavorites();

      const userFavorites = favorites.filter(
        favorite => favorite.userId === userId
      );

      return of(userFavorites);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http.get<FavoriteOffer[]>(
      `${this.API_URL}?userId=${userId}`
    );
  }

  addFavorite(
    favorite: Omit<FavoriteOffer, 'id'>
  ): Observable<FavoriteOffer> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const favorites = this.getStoredFavorites();

      const newFavorite: FavoriteOffer = {
        ...favorite,
        id: crypto.randomUUID(),
      };

      favorites.push(newFavorite);

      localStorage.setItem(
        'favoritesOffers',
        JSON.stringify(favorites)
      );

      return of(newFavorite);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http.post<FavoriteOffer>(
      this.API_URL,
      favorite
    );
  }

  removeFavorite(id: string): Observable<void> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const favorites = this.getStoredFavorites();

      const updatedFavorites = favorites.filter(
        favorite => favorite.id !== id
      );

      localStorage.setItem(
        'favoritesOffers',
        JSON.stringify(updatedFavorites)
      );

      return of(void 0);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );
  }

  private getStoredFavorites(): FavoriteOffer[] {
    const stored = localStorage.getItem('favoritesOffers');

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
}