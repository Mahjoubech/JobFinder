import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Navbar} from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-job-search',
  imports: [RouterLink, CommonModule ,Navbar],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch {

}
