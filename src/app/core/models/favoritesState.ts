import { FavoriteOffer } from './favoriteOffer';

export interface FavoritesState {
  items: FavoriteOffer[];
  loading: boolean;
  error: string | null;
}
