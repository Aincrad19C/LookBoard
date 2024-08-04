import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/editTask')
export class editTaskController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async editTask(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { user_id, id, project_id, title, description } = userData as {
        user_id: string,
        id: any,
        project_id: string,
        title: string,
        description: string
    };
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `UPDATE tasks
                   SET title = ?, description = ?
                   WHERE user_id = ? AND id = ? AND project_id = ?`;
      const [result] = await connection.query(sql, [title,description,user_id,id,project_id]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '修改项目成功',
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
          message: '修改项目失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}