import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/readAll')
export class readAllController {
  @Inject()
  ctx: Context;
  @Inject()
  userService: UserService;
  
  @Post('/')
  async readAll(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const {proId, user_id} = userData as {proId: any,user_id:string}; 
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `SELECT user_id, id, state, name, ddl, content FROM projects WHERE proId = ? AND user_id = ?`;
      
      const [projectRows] = await connection.execute(sql,[proId,user_id]);

      const tasksMap = new Map();

      // 循环遍历projects表中的每一行，执行tasks表的查询
      for (const projectRow of projectRows) {
        const taskSql = `SELECT user_id, id, project_id, title, description FROM tasks WHERE project_id = ?;`;
        const [taskRows] = await connection.execute(taskSql, [ projectRow.id]);
        tasksMap.set(projectRow.id, taskRows);
      }

      const projectsWithTasks = [];
      for (const [projectId, taskRows] of tasksMap) {
        const projectRow = projectRows.find(row => row.id === projectId);
        if (projectRow) {
          projectsWithTasks.push({
            proId:proId,
            user_id: projectRow.user_id,
            id: projectRow.id,
            state: projectRow.state,
            title: projectRow.name,
            date: projectRow.ddl,
            content: projectRow.content,
            tasks: taskRows,
          });
        }
      }

      // 将查询结果添加到响应体中
      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '查询成功',
          projects: projectsWithTasks,
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
          message: '查询失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }

  @Post('/done')
  async readAllDone(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const {proId,user_id} = userData as {proId:any,user_id:string}; 
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      const sql = `SELECT user_id, id, state, name, ddl, content FROM projects WHERE proId = ? AND user_id = ? AND state = "DONE"`;

      const [projectRows] = await connection.execute(sql,[proId,user_id]);
      const tasksMap = new Map();
      for (const projectRow of projectRows) {
        const taskSql = `SELECT user_id, id, project_id, title, description FROM tasks WHERE project_id = ?;`;
        const [taskRows] = await connection.execute(taskSql, [ projectRow.id]);
        tasksMap.set(projectRow.id, taskRows);
      }

      const projectsWithTasks = [];
      for (const [projectId, taskRows] of tasksMap) {
        const projectRow = projectRows.find(row => row.id === projectId);
        if (projectRow) {
          projectsWithTasks.push({
            proId:proId,
            user_id: projectRow.user_id,
            id: projectRow.id,
            state: projectRow.state,
            title: projectRow.name,
            date: projectRow.ddl,
            content: projectRow.content,
            tasks: taskRows,
          });
        }
      }

      // 将查询结果添加到响应体中
      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '查询成功',
          projects: projectsWithTasks,
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
          message: '查询失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }

  @Post('/todo')
  async readAllTodo(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const {proId,user_id} = userData as {proId:any, user_id:string}; 
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      // 构建SQL查询语句，从projects表中检索数据
      const sql = `SELECT user_id, id, state, name, ddl, content FROM projects WHERE proId = ? AND user_id = ? AND state = "TODO"`;
      
      // 执行SQL语句
      const [projectRows] = await connection.execute(sql,[proId,user_id]);

      // 创建一个Map来存储每个projects记录的tasks数组
      const tasksMap = new Map();

      // 循环遍历projects表中的每一行，执行tasks表的查询
      for (const projectRow of projectRows) {
        const taskSql = `SELECT user_id, id, project_id, title, description FROM tasks WHERE project_id = ?;`;
        const [taskRows] = await connection.execute(taskSql, [projectRow.id]);
        tasksMap.set(projectRow.id, taskRows);
      }

      const projectsWithTasks = [];
      for (const [projectId, taskRows] of tasksMap) {
        const projectRow = projectRows.find(row => row.id === projectId);
        if (projectRow) {
          projectsWithTasks.push({
            proId:proId,
            user_id: projectRow.user_id,
            id: projectRow.id,
            state: projectRow.state,
            title: projectRow.name,
            date: projectRow.ddl,
            content: projectRow.content,
            tasks: taskRows,
          });
        }
      }

      // 将查询结果添加到响应体中
      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '查询成功',
          projects: projectsWithTasks,
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
          message: '查询失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }

  @Post('/doing')
  async readAllDoing(): Promise<any> {
    const mysql = require('mysql2/promise');
    const userData = this.ctx.request.body;
    const {proId,user_id} = userData as {proId:any,user_id:string}; 
    const connection = await mysql.createConnection({
      host: 'db',
      user: 'root',
      database: 'mysql',
      password: 'Misaka20001',
      port: 3306,
    });

    try {
      // 构建SQL查询语句，从projects表中检索数据
      const sql = `SELECT user_id, id, state, name, ddl, content FROM projects WHERE proId = ? AND user_id = ? AND state = "DOING"`;
      
      // 执行SQL语句
      const [projectRows] = await connection.execute(sql,[proId,user_id]);

      // 创建一个Map来存储每个projects记录的tasks数组
      const tasksMap = new Map();

      // 循环遍历projects表中的每一行，执行tasks表的查询
      for (const projectRow of projectRows) {
        const taskSql = `SELECT user_id, id, project_id, title, description FROM tasks WHERE project_id = ?;`;
        const [taskRows] = await connection.execute(taskSql, [projectRow.id]);
        tasksMap.set(projectRow.id, taskRows);
      }

      const projectsWithTasks = [];
      for (const [projectId, taskRows] of tasksMap) {
        const projectRow = projectRows.find(row => row.id === projectId);
        if (projectRow) {
          projectsWithTasks.push({
            proId:proId,
            user_id: projectRow.user_id,
            id: projectRow.id,
            state: projectRow.state,
            title: projectRow.name,
            date: projectRow.ddl,
            content: projectRow.content,
            tasks: taskRows,
          });
        }
      }

      // 将查询结果添加到响应体中
      const response = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          message: '查询成功',
          projects: projectsWithTasks,
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
          message: '查询失败',
          error: err.message,
        },
      };
      return errorResponse;
    } finally {
      await connection.end();
    }
  }
}
