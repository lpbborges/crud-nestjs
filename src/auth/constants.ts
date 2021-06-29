import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'nestjsbackenddozero',
  expiresIn: '7d',
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
