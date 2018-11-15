import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings } from 'oidc-client'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userManager: UserManager;

  constructor() {
  }

  async login(): Promise<void> {
    await this.ensureUserManagerInitialized();
    return this.userManager.signinRedirect();
  }

  async completeAuthenticationProcess(): Promise<void> {
    await this.ensureUserManagerInitialized();
    if (window.location.hash) {
      if (window.location.hash.includes('id_token')) {
        await this.userManager.signinRedirectCallback();
      } else {
        await this.userManager.signoutRedirectCallback();
      }
      window.location.hash = '';
    }
  }

  async logout(): Promise<void> {
    await this.ensureUserManagerInitialized();
    return this.userManager.signoutRedirect();
  }

  async isLoggedIn(): Promise<boolean> {
    let userName = await this.getUserName();
    return userName !== undefined;
  }

  async getUserName(): Promise<string> {
    await this.ensureUserManagerInitialized();
    let user = await this.userManager.getUser();
    if (!!user) {
      return user.profile.name;
    } else {
      return undefined;
    }
  }

  async getAccesstoken(): Promise<string> {
    await this.ensureUserManagerInitialized();
    let user = await this.userManager.getUser();
    return user.access_token;
  }

  private async ensureUserManagerInitialized(): Promise<void> {
    if (this.userManager !== undefined) {
      return;
    }

    let response = await fetch('/_configuration/AngularAuthSPA');
    if (!response.ok) {
      throw new Error(`Could not load settings for 'AngularAuthSPA'`);
    }

    let settings: UserManagerSettings = await response.json();
    this.userManager = new UserManager(settings);
  }
}
