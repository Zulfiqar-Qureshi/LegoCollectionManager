import { Console } from 'console';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            run_id,
            no,
            color_id,
            score,
            identifier
        } = req.body;

        if ( run_id && 
            no &&
            score && 
            identifier) {
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
                        const createRecognisedparts = `INSERT INTO Recognisedparts (
                                                  run_id,
                                                  no,
                                                  color_id,
                                                  score,
                                                  identifier,
                                                  createdBy)
                                                  VALUES(
                                                          ${run_id},
                                                          '${no}',
                                                          ${color_id},
                                                          ${score},
                                                          '${identifier}',
                                                          ${userid})`;
                        connection.query(createRecognisedparts, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the recognised parts',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'Recognised parts created!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'run_id, no, color_id, score and identifier are required!'
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