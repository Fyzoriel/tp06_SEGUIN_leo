import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  private currentUserToken: string | undefined;

  // front-end
  public clearUserToken = (): void => {
    this.currentUserToken = undefined;
  };

  public saveUserToken = (currentUserToken: string): void => {
    this.currentUserToken = currentUserToken;
  };

  public getUserToken = (): string | null => {
    return this.currentUserToken ?? null;
  };

  public isLoggedIn = (): boolean => {
    return this.currentUserToken !== undefined;
  };
}
