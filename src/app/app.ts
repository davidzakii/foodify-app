import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Navbar } from './shared/components/navbar/navbar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  constructor(@Inject('IS_BROWSER') public isBrowser: boolean) {}
}
