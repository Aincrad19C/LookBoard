import { Controller, Get, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/files')
export class ReadFileController {
  @Inject()
  ctx: Context;

  // 定义上传文件的存储路径
  private readonly uploadPath = path.join(__dirname, '..', 'uploads');

  @Get('/')
  async listFiles(): Promise<any> {
    try {
      // 确保上传目录存在
      if (!fs.existsSync(this.uploadPath)) {
        return {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            message: '上传目录不存在',
          },
        };
      }

      // 读取目录下的所有文件
      const files = fs.readdirSync(this.uploadPath);

      // 构建文件列表响应
      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '文件列表',
          files: files.map(file => ({
            name: file,
          })),
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
          message: '读取文件列表失败',
          error: err.message,
        },
      };
      return errorResponse;
    }
  }

  @Get('/:filename')
  async readFile(filename: string): Promise<any> {
    const filePath = path.join(this.uploadPath, filename);

    try {
      // 确保文件存在
      if (!fs.existsSync(filePath)) {
        return {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            message: '文件不存在',
          },
        };
      }

      // 读取文件内容
      const fileContent = fs.readFileSync(filePath);
      // 获取文件MIME类型
      const contentType = this.getMimeType(filename);

      // 返回文件内容
      return {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
        body: fileContent,
      };
    } catch (err) {
      console.error(err);
      const errorResponse = {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '读取文件失败',
          error: err.message,
        },
      };
      return errorResponse;
    }
  }

  // 简单的MIME类型映射，根据文件扩展名返回对应的MIME类型
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.svg': 'application/image/svg+xml',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.doc': 'application/msword',
      '.xls': 'application/vnd.ms-excel',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.txt': 'text/plain',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
