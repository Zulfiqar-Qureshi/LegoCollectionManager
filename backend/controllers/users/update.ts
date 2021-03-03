import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            username,
            password,
            full_name,
            usergroup
        } = req.body;

        if (username &&
            password &&
            full_name &&
            usergroup ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateUser = `UPDATE Users SET username = '${username}',
                                            password = '${password}',
                                            full_name = '${full_name}',
                                            usergroup = ${usergroup}
                                            WHERE id=${id}`;
                connection.query(updateUser, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update user',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'User updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 500,
                message: 'username, password, full_name and usergroup are required!'
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