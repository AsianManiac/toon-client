declare interface FieldError {
  code: string;
  message: string;
  path: string[];
  validation: string;
}

declare interface User {
  name: string;
  email: string;
  phoneNumber: string;
  gender: GENDER;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  country: COUNTRY;
  status?: ACCOUNT_STATUS;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatar: File | string;
  role?: ROLE;
}
