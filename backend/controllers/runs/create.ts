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
            no,
            collection_id,
            sorter_id,
            imagefolder
        } = req.body;

        if (no &&
            collection_id &&
            sorter_id &&
            imagefolder) {
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
                        const createRun = `INSERT INTO Runs(no,
                                                  collection_id,
                                                  sorter_id,
                                                  imagefolder,
                                                  createdBy)
                                                  VALUES(
                                                         ${no},
                                                         ${collection_id},
                                                         ${sorter_id},
                                                         '${imagefolder}',
                                                          ${userid}
                                                        )`;
                        console.log(createRun);
                        connection.query(createRun, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create new Run',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Run created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
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