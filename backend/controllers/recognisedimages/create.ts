import { Console } from 'console';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            image_id,
            part_id,
            score
        } = req.body;

        if (image_id && 
            part_id &&
            score) {
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
                        const {id:userid} = result[0];
                        const createRecognisedimages = `INSERT INTO Recognisedimages (
                                                  image_id,
                                                  part_id,
                                                  score
                                                  createdBy)
                                                  VALUES(
                                                          ${image_id},
                                                          ${part_id},
                                                          ${score},
                                                          ${userid}
                                                        )`;
                        connection.query(createRecognisedimages, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the recognised image',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 100,
                                    message: 'Recognised image created!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 500,
                message: 'image_id, part_id and score are required!'
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