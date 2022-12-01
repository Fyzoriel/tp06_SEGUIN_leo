import { Component, HostBinding, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth.service";

import { CustomValidators } from "../../../validators/CustomValidators";

import { UserRegisterType } from "../../../types/user.type";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.css", "../styles.css"]
})
export class RegisterFormComponent implements OnInit {
  @HostBinding("class.app_content_centered")
  public userDataForm!: FormGroup;

  public registerError: string | undefined;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const minPassphraseLength = 8;

    this.userDataForm = this.formBuilder.group({
      firstName: [
        "",
        {
          validators: Validators.required
        }
      ],
      name: [
        "",
        {
          validators: Validators.required
        }
      ],

      email: [
        "",
        {
          validators: [Validators.required, Validators.email]
        }
      ],
      phone: [
        "",
        {
          validators: [
            Validators.required,
            Validators.pattern(
              "(0|\\+33 ?)[1-9]([-. ]?[0-9]{2} ?){3}([-. ]?[0-9]{2})"
            )
          ]
        }
      ],
      address: ["", Validators.required],
      passphrase: [
        "",
        {
          validators: [
            Validators.required,
            Validators.minLength(minPassphraseLength),
            CustomValidators.mustMatch("confirmPassphrase", true)
          ]
        }
      ],
      confirmPassphrase: [
        "",
        {
          validators: [
            Validators.required,
            Validators.minLength(minPassphraseLength),
            CustomValidators.mustMatch("passphrase")
          ]
        }
      ]
    });
  }

  onSubmit = () => {
    if (!this.userDataForm.valid) {
      return;
    }

    const user: UserRegisterType = {
      firstName: this.userDataForm.get("firstName")?.value,
      name: this.userDataForm.get("name")?.value,
      email: this.userDataForm.get("email")?.value,
      phone: this.userDataForm.get("phone")?.value,
      address: this.userDataForm.get("address")?.value,
      passphrase: this.userDataForm.get("passphrase")?.value,
      confirmPassphrase: this.userDataForm.get("confirmPassphrase")?.value
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.registerError = undefined;

        void this.router.navigate(["/login"]);
      },
      error: () => {
        this.userDataForm.patchValue({
          passphrase: "",
          confirmPassphrase: ""
        });
        this.userDataForm.markAsUntouched();
        this.userDataForm.markAsPristine();
        this.registerError = "An error occurred during registration";
      }
    });
  };
}
