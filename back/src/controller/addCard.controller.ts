import { Controller, Post, Inject} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/addCard')
export class addCardController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/')
  async addCard(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body; // 获取请求体中的数据
    const { proId,user_id, project_id, project_state,project_name, project_ddl, project_content } = userData as {
      proId: any,
      user_id: string,
      project_id: any,
      project_state: string,
      project_name: string,
      project_ddl: string,
      project_content: string,
    };  //更改为卡片信息
    
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    // 执行插入操作
    try {
      const [tables] = await connection.query('SHOW TABLES LIKE "projects"');
      if (tables.length === 0) {
        // 如果表不存在，创建表
        await connection.query(`
          CREATE TABLE projects (
            proId BIGINT,
            user_id VARCHAR(255) NOT NULL,
            id INT PRIMARY KEY,
            state VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            ddl DATE,
            content VARCHAR(255)
          );
        `);}

      const [tables1] = await connection.query('SHOW TABLES LIKE "tasks"');
      if (tables1.length === 0) {
        await connection.query(`
          CREATE TABLE tasks (
            user_id VARCHAR(255) NOT NULL,
            id INT PRIMARY KEY,
            project_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT
          );
      `);}
      
      const [tables2] = await connection.query('SHOW TABLES LIKE "comments"');
      if (tables2.length === 0) {
        await connection.query(`
          CREATE TABLE comments (
              user_id VARCHAR(255) NOT NULL,
              id INT PRIMARY KEY,
              project_id INT NOT NULL,
              task_id INT NOT NULL,
              content TEXT NOT NULL
          );
        `);}

      const sql = `INSERT INTO projects (proId,user_id, id, state, name, ddl, content) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await connection.query(sql, [proId,user_id, project_id, project_state,project_name, project_ddl,project_content]);
    
      console.log(result);

      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { 
          message: '创建成功',
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
          message: '创建失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}