import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            name,
            typeid,
            description
        } = req.body;

        if (id &&
            name &&
            typeid &&
            description) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateUser = `UPDATE Status SET name = '${name}',
                                            typeid = '${typeid}',
                                            description = '${description}'
                                            WHERE id=${id}`;
                connection.query(updateUser, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update Status',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'Status updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 500,
                message: 'id, name, typeid and description are required!'
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