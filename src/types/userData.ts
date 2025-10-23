export interface UserData {
  email: string;
  password?: string;
  provider?: string;
  avatar?: string; 
  providerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
