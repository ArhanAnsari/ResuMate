export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  lastLogin?: number;
}

export interface AuthResponse {
  user: UserProfile;
  session: any; // Appwrite session object
}
