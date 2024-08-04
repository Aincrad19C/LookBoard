import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/fileData')
export class fileDataController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;

  @Post('/')
  async fileData(): Promise<any> {
    const userData = this.ctx.request.body;
    const {files,information} = userData as {
        files:[{
            filename: string;
            data: string;
            fieldname: string;
            mimeType: string;
          }]
        information: {
            username:string,
            proId:any,
            project_id:any,
            id:any
          }
    };

    // 创建数据库连接
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    // 创建文件信息表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS file_info (
        username VARCHAR(255),
        proId BIGINT NOT NULL,
        project_id BIGINT NOT NULL,
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        data TEXT NOT NULL,
        fieldname VARCHAR(255),
        mimeType VARCHAR(255)
      );
    `);

    // 插入文件信息到数据库
    for (const info of files) {
      await connection.query(`
        INSERT INTO file_info (username, proId, project_id, id, filename, data, fieldname, mimeType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `, [information.username,information.proId,information.project_id,information.id,info.filename, info.data, info.fieldname, info.mimeType]);
    }

    await connection.end();

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        message: '文件信息已成功保存到数据库',
      },
    };
  }
}
