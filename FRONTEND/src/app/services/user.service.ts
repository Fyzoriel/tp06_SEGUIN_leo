import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { UserAPIType } from "../types/user.type";

@Injectable({
  providedIn: "root"
})
export class UserService {
  env = environment;

  public constructor(private readonly httpClient: HttpClient) {}

  public getInformation = (): Observable<UserAPIType> => {
    return this.httpClient.get<UserAPIType>(`${this.env.baseApi}/user/profile`);
  };
}
