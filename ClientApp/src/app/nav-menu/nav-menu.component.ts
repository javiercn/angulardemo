import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  userName: string = undefined;
  isLoggedIn: boolean = false;
  constructor(private authenticationService : AuthenticationService) {}

  collapse() {
    this.isExpanded = false;
  }

  async ngOnInit() {
    await this.authenticationService.completeAuthenticationProcess();
    this.userName = await this.authenticationService.getUserName();
    this.isLoggedIn = await this.authenticationService.isLoggedIn();
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  login() {
    this.authenticationService.login();
  }

  logout() {
    this.authenticationService.logout();
  }
}
