export interface UserAPIType {
  firstName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UserRegisterType extends UserAPIType {
  passphrase: string;
  confirmPassphrase: string;
}
