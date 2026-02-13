export interface Application {
  id?: string | number;
  userId: string;
  offerId: string;
  apiSource: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: 'en_attente' | 'accepted' | 'refused';
  notes: string;
  dateAdded: string;
}
