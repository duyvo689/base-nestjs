import { CustomDecorator, SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'PUBLIC_KEY';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
