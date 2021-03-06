import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            no,
            collection_id,
            sorter_id,
            imagefolder
        } = req.body;

        if (id &&
            no &&
            collection_id &&
            sorter_id &&
            imagefolder ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateRun = `UPDATE Runs SET no = ${no},
                                            collection_id = ${collection_id},
                                            sorter_id = ${sorter_id},
                                            imagefolder = '${imagefolder}'
                                            WHERE id=${id}`;
                connection.query(updateRun, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update run',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'Run updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 500,
                message: 'id, no, collection_id, sorter_id and imagefolder are required!'
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