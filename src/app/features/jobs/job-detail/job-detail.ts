import { Component } from '@angular/core';

@Component({
  selector: 'app-job-detail',
  imports: [],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail {
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
