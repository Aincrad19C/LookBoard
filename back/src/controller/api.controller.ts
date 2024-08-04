import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }

  @Post('/login')
  async login(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { username, password } = userData as {
      username:string;
      password:string;
    };

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      //检查用户名和密码
      const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
      const [rows] = await connection.query(sql, [username, password]);
  
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
        // 用户名或密码不匹配
        const errorResponse = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: { 
            message: '用户名或密码错误',
          },
        };
        return errorResponse;
      }
    } catch (err) {
      console.error('登录失败:', err);
      const errorResponse = {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          message: '登录失败',
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

  @Post('/register')
  async register(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body; // 获取请求体中的数据
    const { username, password } = userData as {
      username:string;
      password:string;
    };
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    
    // 执行插入操作
    try {
      const [tables] = await connection.query('SHOW TABLES LIKE "users"');
      if (tables.length === 0) {
        // 如果表不存在，创建users表
        await connection.query(`
          CREATE TABLE users (
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          )
        `);}

      const sql0 = `SELECT * FROM users WHERE username = ?`;
      const [rows] = await connection.query(sql0, [username]);

      if (rows.length > 0) {
        const errorResponse = {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
          },
          body: { 
            message: '注册失败',
            error: '用户名已存在',
          },
        };
        return errorResponse;
      }
      const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
      const [result] = await connection.query(sql, [username, password]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          message: '注册成功',
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
          message: '注册失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }


}