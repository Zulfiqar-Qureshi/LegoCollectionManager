import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from './../middleware/token_encode.interface';

//JS to MYSQL date
//new Date().toISOString().slice(0, 19).replace('T', ' ');
//OUTPUT => 2012-06-22 05:40:06

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
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
                        const {id} = result[0];
                        const createUser = `INSERT INTO Users(username,
                                                  password,
                                                  full_name,
                                                  usergroup,
                                                  created,
                                                  createdBy)
                                                  VALUES(
                                                         '${username}',
                                                         '${password}',
                                                         '${full_name}',
                                                          ${usergroup},
                                                         NOW(),
                                                          ${id}
                                                        )`;
                        connection.query(createUser, (err1, result) => {
                            if (err1) res.json({
                                code: 500,
                                message: 'Couldn\'t create new User',
                                errorMessage: process.env.DEBUG && err1
                            });
                            else {
                                res.json({
                                    code: 100,
                                    message: 'new User created'
                                });
                            }
                        })
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