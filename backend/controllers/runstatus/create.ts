import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

//JS to MYSQL date
//new Date().toISOString().slice(0, 19).replace('T', ' ');
//OUTPUT => 2012-06-22 05:40:06

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            run_id,
            status,
            reason
        } = req.body;

        if (run_id &&
            status &&
            reason) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username:currentusernme} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${currentusernme}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id: userid} = result[0];
                        const createRunStatus = `INSERT INTO RunStatus(run_id,
                                                  status,
                                                  reason,
                                                  createdBy)
                                                  VALUES(
                                                         ${run_id},
                                                         ${status},
                                                         '${reason}',
                                                          ${userid})`;
                        console.log(createRunStatus);
                        connection.query(createRunStatus, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create new RunStatus',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 100,
                                    message: 'new RunStatus created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 500,
                message: 'no, collection_id, sorter_id and imagefolder are required!'
            });
        }
    } catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}