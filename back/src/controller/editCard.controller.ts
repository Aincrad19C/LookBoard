import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/editCard')
export class editCardController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async editCard(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { proId, user_id, project_id, project_state, project_name, project_ddl, project_content } = userData as {
        proId: any,
        user_id: string,
        project_id: any,
        project_state: string,
        project_name: string,
        project_ddl: string,
        project_content: string
    };

    console.log(project_ddl);
    
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `UPDATE projects
                   SET state = ?, name = ?, ddl = ?, content = ?
                   WHERE proId = ? AND user_id = ? AND id = ?`;
      await connection.query(sql, [project_state,project_name,project_ddl,project_content,proId,user_id,project_id]);

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