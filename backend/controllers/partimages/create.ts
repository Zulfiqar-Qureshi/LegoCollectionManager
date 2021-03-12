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
            path,
            size_kb,
            x,
            y,
            w,
            h,
            blue,
            green,
            red,
            color,
            camera
        } = req.body;

        if (run_id &&
            path &&
            size_kb &&
            x &&
            y &&
            w &&
            h &&
            blue &&
            green &&
            red &&
            color &&
            camera) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id} = result[0];
                        const createPartimage = `INSERT INTO Partimages (run_id,
                                                  path,
                                                  size_kb,
                                                  x,
                                                  y,
                                                  w,
                                                  h,
                                                  blue,
                                                  green,
                                                  red,
                                                  color,
                                                  camera,
                                                  createdBy)
                                                  VALUES(
                                                          ${run_id},
                                                         ' ${path}',
                                                          ${size_kb},
                                                          ${x},
                                                          ${y},
                                                          ${w},
                                                          ${h},
                                                          ${blue},
                                                          ${green},
                                                          ${red},
                                                         '${color}',
                                                         '${camera}',
                                                          ${id}
                                                        )`;
                        connection.query(createPartimage, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the Partimage',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'Partimage created!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'All fields are required!'
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