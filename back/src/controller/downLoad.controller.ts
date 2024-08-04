import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/downLoadFile')
export class downLoadController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;

  @Post('/')
  async downloadFile(): Promise<any> {
    const userData = this.ctx.request.body;
    const { filename } = userData as { filename: string };

    // 确定上传目录的路径
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    console.log(filePath);

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        const downloadDir = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
        const localFilePath = path.join(downloadDir, filename);
        fs.writeFileSync(localFilePath, fileContent);

        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            message: '下载成功',
          },
        }
      } else {
        this.ctx.status = 404;
        this.ctx.body = { success: false, message: 'File not found' };
      }
    } catch (error) {
      this.ctx.status = 500;
      this.ctx.body = { success: false, message: 'Failed to download file', error: error.message };
    }
  }
}
