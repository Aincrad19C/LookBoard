import { Controller, Post, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/readData')
export class readDataController {
    @Inject()
    ctx: Context;
    @Inject()
    userService: UserService;

    @Post('/')
    async readAllPro(): Promise<any> {
        const mysql = require('mysql2/promise');
        const userData = this.ctx.request.body;
        const { proId, project_id } = userData as {
            proId: number,
            project_id: any,
        };
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'mysql',
            password: 'Misaka20001',
            port: 3306,
        });

        try {
            const sql = `SELECT filename FROM file_info WHERE proId = ? AND project_id = ?`;
            const [pros] = await connection.execute(sql, [proId, project_id]);
            const response = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    message: '查询成功',
                    files:pros
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