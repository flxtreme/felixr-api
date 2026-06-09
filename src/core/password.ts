import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verify = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
