import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'nestjsbackenddozero',
  expiresIn: '60s',
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
