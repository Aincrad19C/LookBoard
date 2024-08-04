import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/addTask')
export class addTaskController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async addTask(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { user_id, project_id, id, title, content } = userData as {
        user_id: string,
        project_id: any,
        id: any,
        title: string,
        content: string
    };
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `INSERT INTO tasks (user_id, id, project_id, title, description) VALUES (?, ?, ?, ?, ?)`;
      const [result] = await connection.query(sql, [user_id,id,project_id,title,content]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '创建任务成功',
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
          message: '创建任务失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}