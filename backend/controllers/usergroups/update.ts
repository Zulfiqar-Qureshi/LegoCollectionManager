import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            groupname
        } = req.body;

        if (id &&
            groupname ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateType = `UPDATE Usergroups SET groupname = '${groupname}'
                                            WHERE id=${id}`;
                connection.query(updateType, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update Usergroup',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Usergroup updated!'
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'id and groupname are required!'
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