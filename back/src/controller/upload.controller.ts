import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/upload')
export class UploadController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;

  @Post('/')
  async upLoad(): Promise<any> {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    try {
      if (!this.ctx.is('multipart')) {
        throw new Error('请上传文件');
      }

      const parts = this.ctx.multipart();
      let part;
      while ((part = await parts()) != null) {
        if (part.length) {
        } else {
          const filename = part.filename;
          const filePath = path.join(uploadPath, filename);
          const writeStream = fs.createWriteStream(filePath);
          part.pipe(writeStream);

          await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
          });
        }
      }

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '文件上传成功',
        },
      };
      return response;
    } catch (err) {
      console.error(err);
      const errorResponse = {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '文件上传失败',
          error: err.message,
        },
      };
      return errorResponse;
    }
  }
}
