import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/deleteCard')
export class deleteCardController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async deleteCard(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const { proId,project_id } = userData as {proId:any,project_id: any};
    
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `DELETE FROM projects WHERE proId = ? AND id = ?`;
      const [result] = await connection.query(sql, [proId,project_id]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          message: '删除成功',
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
          message: '删除失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}