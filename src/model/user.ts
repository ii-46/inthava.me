export interface User {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUser {
  id: string;
  user: User;
}
