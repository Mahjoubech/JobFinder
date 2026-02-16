import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteOffer } from '../models/favoriteOffer';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private API_URL = "http://localhost:3000/favoritesOffers";

  getFavorites(userId: string): Observable<FavoriteOffer[]> {
    return this.http.get<FavoriteOffer[]>(`${this.API_URL}?userId=${userId}`);
  }

  addFavorite(favorite: Omit<FavoriteOffer, 'id'>): Observable<FavoriteOffer> {
    return this.http.post<FavoriteOffer>(this.API_URL, favorite);
  }

  removeFavorite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
