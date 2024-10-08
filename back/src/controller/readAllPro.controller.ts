import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/readAllPro')
export class readAllController {
    @Inject()
    ctx: Context;
    @Inject()
    userService: UserService;

    @Post('/')
    async readAllPro(): Promise<any> {
        const mysql = require('mysql2/promise');
        const userData = this.ctx.request.body;
        const { user_id } = userData as { user_id: string };
        const connection = await mysql.createConnection({
            host: 'db',
            user: 'root',
            database: 'mysql',
            password: 'Misaka20001',
            port: 3306,
        });

        try {
            const sql = `SELECT user_id, id, title, content, members FROM pro WHERE user_id = ?`;
            const [responses] = await connection.execute(sql, [user_id]);

            const newForm = [];
            for (let i = 0; i < responses.length; i++) {
                const newProjectForm = {
                    id: responses[i].id,
                    title: responses[i].title,
                    content: responses[i].content,
                    members: responses[i].members,
                };
                newForm.push(newProjectForm);
            }
            const response = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    message: '查询成功',
                    projects: newForm,
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