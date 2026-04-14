import { Component } from '@angular/core';
import { JournalComponent } from './journal/journal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JournalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}