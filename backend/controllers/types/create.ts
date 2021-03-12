import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            name
        } = req.body;

        if (name) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const createType = `INSERT INTO Types (name)
                                            VALUES(
                                                    '${name}'
                                                )`;
                console.log(createType);
                connection.query(createType, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create new Type',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'new Type created'
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 500,
                message: 'name is required!'
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