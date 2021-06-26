import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/user';

export default async function authenticate(params: {
  username: string;
  password: string;
}) {
  const user = await UserRepository.findByUsername(params.username);

  if (!user) {
    return null;
  }

  return (await bcrypt.compare(params.password, user.password)) && user;
}
