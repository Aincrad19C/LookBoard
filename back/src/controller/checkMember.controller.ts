import { Inject, Controller, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/checkMember')
export class checkMemberController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/')
  async checkMember(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { username } = userData as {
      username:string;
    };

    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      //检查用户名和密码
      const sql = `SELECT * FROM users WHERE username = ?`;
      const [rows] = await connection.query(sql, [username]);
  
      if (rows.length > 0) {

        const response = {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: { 
            message: '登录成功',
          },
        };
        return response;
      } else {
        const errorResponse = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: { 
            message: '用户不存在',
          },
        };
        return errorResponse;
      }
    } catch (err) {
      console.error('失败:', err);
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
      if (connection) {
        await connection.end();
      }
    }
  }
}