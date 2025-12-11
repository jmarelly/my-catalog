export type TCreateUser = {
  username: string;
  password: string;
  role?: 'admin' | 'customer';
};

export type TUserWithoutPassword = {
  id: string;
  username: string;
  role: 'admin' | 'customer';
};
