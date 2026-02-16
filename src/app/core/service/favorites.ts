import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FavoriteOffer} from '../models/favoritesOffers';
@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private http = inject(HttpClient);
   private API_URL = "http://localhost:3000/favoritesOffers";
   getFavorites(userId : string) : Observable<FavoriteOffer[]>{
     return this.http.get<FavoriteOffer[]>(`${this.API_URL}?userId=${userId}`);
   }
   addFavorite(fav : Omit<FavoriteOffer , 'id'>) : Observable<FavoriteOffer>{
     return this.http.post<FavoriteOffer>(this.API_URL , fav);
   }
   deleteFavorite(id : string) : Observable<void>{
     return this.http.delete<void>(`${this.API_URL}/${id}`);
     }

}
