import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/deleteTask')
export class deleteTaskController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async deleteTask(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { user_id, project_id, task_id } = userData as {user_id: string, project_id: any,task_id: any};
    
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `DELETE FROM tasks WHERE user_id = ? AND id = ? AND project_id = ? `;
      const [result] = await connection.query(sql, [user_id,task_id,project_id]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          message: '删除任务成功',
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
          message: '删除任务失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}