export interface UserData {
  email: string;
  password?: string;
  provider?: string;
  avatar?: string;
  providerId?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
