import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
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

        if (id &&
            name &&
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
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateUser = `UPDATE Sorters SET name = '${name}',
                                            lifter_status_url = '${lifter_status_url}',
                                            lifter_update_url = '${lifter_update_url}',
                                            lifter_alterspeed_url = '${lifter_alterspeed_url}',
                                            vfeeder_status_url = '${vfeeder_status_url}',
                                            vfeeder_update_url = '${vfeeder_update_url}',
                                            vfeeder_alterspeed_url = '${vfeeder_alterspeed_url}',
                                            conveyor_status_url = '${conveyor_status_url}',
                                            conveyor_update_url = '${conveyor_update_url}',
                                            conveyor_alterspeed_url = '${conveyor_alterspeed_url}',
                                            pusher_count = ${pusher_count},
                                            pusher_status_baseurl = '${pusher_status_baseurl}',
                                            pusher_mode_baseurl = '${pusher_mode_baseurl}',
                                            status = ${status}
                                            WHERE id=${id}`;
                connection.query(updateUser, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t update user',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 100,
                            message: 'Sorter updated!'
                        });
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