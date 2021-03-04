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
            id,
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

        if (
            id &&
            run_id &&
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
                const updatePartimage = `UPDATE Partimages SET run_id = ${run_id},
                                            path = '${path}',
                                            size_kb = ${size_kb},
                                            x = ${x},
                                            y = ${y},
                                            w = ${w},
                                            h = ${h},
                                            blue = ${blue},
                                            green = ${green},
                                            red = ${red},
                                            color = '${color}',
                                            camera = '${camera}'
                                            WHERE id=${id}`;
                connection.query(updatePartimage, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the Partimage',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'Partimage updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 500,
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