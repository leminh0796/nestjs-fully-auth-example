import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string): string {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePasswords(rawPassword: string, hash: string): boolean {
  return bcrypt.compareSync(rawPassword, hash);
}
