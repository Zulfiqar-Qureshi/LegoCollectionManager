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
            lifter_status_url,
            lifter_update_url,
            lifter_alterspeed_url,
            vfeeder_status_url,
            vfeeder_update_url,
            vfeeder_alterspeed_url,
            conveyor_status_url,
            conveyor_update_url,
            conveyor_alterspeed_url,
            pusher_count,
            pusher_status_baseurl,
            pusher_mode_baseurl,
            status
        } = req.body;

        if (name &&
            lifter_status_url &&
            lifter_update_url &&
            lifter_alterspeed_url &&
            vfeeder_status_url &&
            vfeeder_update_url &&
            vfeeder_alterspeed_url &&
            conveyor_status_url &&
            conveyor_update_url &&
            conveyor_alterspeed_url &&
            pusher_count &&
            pusher_status_baseurl &&
            pusher_mode_baseurl && 
            status
             ) {
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
                        const createUser = `INSERT INTO Sorters(name,
                                                  lifter_status_url,
                                                  lifter_update_url,
                                                  lifter_alterspeed_url,
                                                  vfeeder_status_url,
                                                  vfeeder_update_url,
                                                  vfeeder_alterspeed_url,
                                                  conveyor_status_url,
                                                  conveyor_update_url,
                                                  conveyor_alterspeed_url,
                                                  pusher_count,
                                                  pusher_status_baseurl,
                                                  pusher_mode_baseurl,
                                                  status,
                                                  createdBy)
                                                  VALUES(
                                                         '${name}',
                                                         '${lifter_status_url}',
                                                         '${lifter_update_url}',
                                                         '${lifter_alterspeed_url}',
                                                         '${vfeeder_status_url}',
                                                         '${vfeeder_update_url}',
                                                         '${vfeeder_alterspeed_url}',
                                                         '${conveyor_status_url}',
                                                         '${conveyor_update_url}',
                                                         '${conveyor_alterspeed_url}',
                                                          ${pusher_count},
                                                         '${pusher_status_baseurl}',
                                                         '${pusher_mode_baseurl}',
                                                          ${status},
                                                          ${id}
                                                        )`;
                        connection.query(createUser, (err1, result) => {
                            if (err1) res.json({
                                code: 500,
                                message: 'Couldn\'t create new Sorter',
                                errorMessage: process.env.DEBUG && err1
                            });
                            else {
                                res.json({
                                    code: 100,
                                    message: 'new Sorter created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 500,
                message: 'all fields are required!'
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