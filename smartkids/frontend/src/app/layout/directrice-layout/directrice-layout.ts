import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-directrice-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './directrice-layout.html',
  styleUrls: ['./directrice-layout.css']
})
export class DirectriceLayoutComponent {}