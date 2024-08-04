import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/deleteFile')
export class deleteDataController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async deletePro(): Promise<any> {
    const userData = this.ctx.request.body;
    const { filename } = userData as { filename: string };

    const uploadDir = path.join(__dirname,'..', 'uploads');
    const filePath = path.join(uploadDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 删除文件
        this.ctx.body = { success: true, message: 'File deleted successfully' };
        this.ctx.status = 200;

        return {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              message: '删除成功',
            },
          }
      } else {
        this.ctx.body = { success: false, message: 'File not found' };
        this.ctx.status = 404;
      }
    } catch (error) {
      this.ctx.body = { success: false, message: 'Failed to delete file', error: error.message };
      this.ctx.status = 500;
    }
  }
}
