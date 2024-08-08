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
        // 创建一个可读流
        const fileStream = fs.createReadStream(filePath);

        // 设置HTTP响应头
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);

        // 将文件流直接传递给响应
        this.ctx.body = fileStream;

        // 监听流错误，关闭响应
        fileStream.on('error', (error) => {
          console.error('文件读取失败:', error);
          this.ctx.status = 500;
          this.ctx.res.end(); // 结束响应
        });

        // 监听流结束，关闭响应
        fileStream.on('end', () => {
          this.ctx.res.end(); // 结束响应
        });
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
