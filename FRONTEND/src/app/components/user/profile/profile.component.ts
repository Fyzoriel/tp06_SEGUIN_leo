import { Component, HostBinding, OnInit } from "@angular/core";

import { Observable } from "rxjs";

import { UserService } from "../../../services/user.service";
import { UserAPIType } from "../../../types/user.type";

@Component({
  selector: "app-display-client-data",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  @HostBinding("class.app_content_centered")
  public userInformation$!: Observable<UserAPIType>;

  public constructor(private readonly userService: UserService) {}

  public ngOnInit(): void {
    this.userInformation$ = this.userService.getInformation();
  }
}
