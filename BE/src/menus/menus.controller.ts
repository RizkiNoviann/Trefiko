import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  private buildInlineImage(file: { mimetype: string; buffer: Buffer }) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new HttpException('Only image file is allowed', HttpStatus.BAD_REQUEST), false);
          return;
        }

        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }

    const extension = extname(file.originalname || 'image').toLowerCase();
    const baseName = (file.originalname || 'menu-image')
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();
    const filename = `${Date.now()}-${baseName}${extension || '.jpg'}`;
    const image = this.buildInlineImage(file);

    return {
      message: 'Image uploaded',
      image,
      filename,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
