import { Controller, Inject, Post, Files, Fields } from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/upload')
export class upLoadController {

  @Inject()
  ctx;

  // 指定文件存储的路径
  private uploadPath = path.join('uploads');

  constructor() {
    // 在构造函数中创建上传目录
    this.createUploadsDirectory();
  }

  // 创建上传目录的方法
  private createUploadsDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
      console.log(`创建上传目录成功: ${this.uploadPath}`);
    }
  }

  @Post('/')
  async upload(@Files() files, @Fields() fields) {
    // 遍历所有上传的文件
    for (const file of files) {
      // 创建一个写入流
      const writeStream = fs.createWriteStream(path.join(this.uploadPath, file.filename));
      // 如果文件是临时文件，则使用文件路径
      if (typeof file.data === 'string') {
        const readStream = fs.createReadStream(file.data);
        readStream.pipe(writeStream);
      } else {
        // 如果文件是流，则直接写入
        file.data.pipe(writeStream);
      }

      // 当写入完成时，关闭流
      writeStream.on('finish', () => {
        writeStream.close();
        // 可以在这里执行其他操作，比如记录日志或者更新数据库
      });

      // 处理错误
      writeStream.on('error', (error) => {
        console.error('文件写入失败:', error);
      });
    }

    const response = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        message: '文件上传成功',
        files,
        fields
      },
    };
    return response;
  }
}
