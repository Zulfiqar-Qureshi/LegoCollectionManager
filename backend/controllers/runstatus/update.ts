import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            run_id,
            status,
            reason
        } = req.body;

        if (id &&
            run_id &&
            status &&
            reason) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateRun = `UPDATE RunStatus SET run_id = ${run_id},
                                            status = ${status},
                                            reason = '${reason}'
                                            WHERE id=${id}`;
                connection.query(updateRun, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update RunStatus',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'RunStatus updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 400,
                message: 'id, run_id, status, reason are required!'
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