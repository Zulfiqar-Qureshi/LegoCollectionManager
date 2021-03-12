import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            groupname
        } = req.body;

        if (groupname) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const createUserGroup = `INSERT INTO Usergroups (groupname)
                                            VALUES(
                                                    '${groupname}'
                                                )`;
                console.log(createUserGroup);
                connection.query(createUserGroup, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create new Usergroup',
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
                message: 'groupname is required!'
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