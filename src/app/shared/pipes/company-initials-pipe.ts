import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone:true,
  name: 'companyInitials',
})
export class CompanyInitialsPipe implements PipeTransform {
  transform(name: string | undefined): string {
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
}
