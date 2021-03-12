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
            name,
            weight_kg,
            origin,
            origin_url,
            seller,
            description,
            cost,
            porto,
            thumbnail_url,
            status = 10,
        } = req.body;

        if (name &&
            weight_kg &&
            origin &&
            origin_url &&
            seller &&
            description &&
            cost &&
            porto) {
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
                        const createCollection = `INSERT INTO Collections(name,
                                                  weight_kg,
                                                  origin,
                                                  origin_url,
                                                  seller,
                                                  description,
                                                  purchase_date,
                                                  cost,
                                                  porto,
                                                  thumbnail_url,
                                                  status,
                                                  created,
                                                  createdBy)
                                                  VALUES(
                                                         '${name}',
                                                          ${weight_kg},
                                                         '${origin}',
                                                         '${origin_url}',
                                                         '${seller}',
                                                         '${description}',
                                                          CURDATE(),
                                                          ${cost},
                                                          ${porto},
                                                         '${thumbnail_url}',
                                                          ${status},
                                                         NOW(),
                                                          ${id}
                                                        )`;
                        connection.query(createCollection, (err1, result1) => {
                            if (err1) res.json({
                                code: 500,
                                message: 'Couldn\'t create the collection',
                                errorMessage: process.env.DEBUG && err1
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'Collection created!'
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