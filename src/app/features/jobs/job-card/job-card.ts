import {Component, Input ,ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';

@Component({
  selector: 'app-job-card',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input() job!: Job;
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  getCompanyInitials(name: string | undefined): string {
    if (!name) return 'JF'; // JobFinder default

    let cleanName = name
      .replace(/[,.]/g, '')
      .replace(/Inc$/i, '')
      .replace(/LLC$/i, '')
      .trim();
    if (cleanName.length <= 4) return cleanName.toUpperCase();

    const words = cleanName.split(' ');

    if (words.length === 1) {
      return cleanName.substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

  getLogoBackground(name: string | undefined): string {
    if (!name) return 'bg-gray-100';

    const colors = [
      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
      'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
      'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}
