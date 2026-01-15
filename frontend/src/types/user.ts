export type User = {
  id: string;
  username: string;
  email: string;
  isPaid: boolean;
};

export type AuthResponse = {
  user: User;
};

export type ErrorResponse = {
  error: string;
};
