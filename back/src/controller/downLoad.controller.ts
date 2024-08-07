import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/downLoadFile')
export class DownloadFileController {
  @Inject()
  ctx: Context;

  @Post('/')
  async downLoadFile(): Promise<any> {
    const userData = this.ctx.request.body;
    const { filename } = userData as { filename: string };

    const filePath = path.join('uploads',filename)

    try {
      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', (error) => {
          console.error('文件读取失败:', error);
          this.ctx.status = 500;
          this.ctx.body = { success: false, message: 'Failed to read file', error: error.message };
        });

        // 设置HTTP响应头
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
        const send = require('koa-send');
        await send(this.ctx,filePath);
        console.log("success")

        const response = {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            message: '成功',
          },
        };
        return response;
      } else {
        this.ctx.status = 404;
        this.ctx.body = { success: false, message: 'File not found' };
      }
    } catch (error) {
      console.error('请求失败:', error);
      this.ctx.status = 500;
      this.ctx.body = { success: false, message: 'Failed to download file', error: error.message };
    }
  }
}
