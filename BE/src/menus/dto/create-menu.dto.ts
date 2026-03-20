import { MenuCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  Matches,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(https?:\/\/.+|\/images\/.+)$/, {
    message: 'image must be a valid URL or uploaded image path',
  })
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(MenuCategory)
  category: MenuCategory;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsBoolean()
  status: boolean;

  @IsBoolean()
  favorite: boolean;
}
