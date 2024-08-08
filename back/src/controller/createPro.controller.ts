import { Inject, Controller, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/createPro')
export class createProController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/')
  async createPro(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { user_id, id, title, content, members } = userData as {
      user_id: any,
      id: any,
      title: string,
      content: string,
      members: any
    };

    user_id

    const membersJson = JSON.stringify(members);
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const [tables] = await connection.query('SHOW TABLES LIKE "pro"');
      if (tables.length === 0) {
        // 如果表不存在，创建表
        await connection.query(`
            CREATE TABLE pro (
                user_id VARCHAR(255) NOT NULL,
                id BIGINT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                members JSON
            );
          `);
      }

      for (let i = 0; i < members.length; i++) {
        const sql = `INSERT INTO pro (user_id, id, title, content, members) VALUES (?, ?, ?, ?, ?)`;
        await connection.query(sql, [members[i].name, id+i*2000000, title, content, membersJson]);
      }

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
    } catch (err) {
      console.error(err);
      const errorResponse = {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}