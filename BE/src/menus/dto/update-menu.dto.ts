import { MenuCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateMenuDto {
	@IsOptional()
	@IsString()
	@Matches(/^(https?:\/\/.+|\/images\/.+)$/, {
		message: 'image must be a valid URL or uploaded image path',
	})
	image?: string;

	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsEnum(MenuCategory)
	category?: MenuCategory;

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price?: number;

	@IsOptional()
	@IsBoolean()
	status?: boolean;

	@IsOptional()
	@IsBoolean()
	favorite?: boolean;
}
