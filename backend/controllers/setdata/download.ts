import { Console } from 'console';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

const blApi = require("../../config/bl.api.js");


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            setnumber
        } = req.body;

        if (setnumber) {
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
                        const findSetDataInDB = `SELECT * FROM Sets WHERE no='${setnumber}'`;

                        connection.query(findSetDataInDB, (err, setresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(setresult !== 'undefined' && setresult.length > 0) res.json({
                                        code: 100,
                                        message: 'SetData information was already downloaded!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {id} = result[0];
                                    blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, setnumber + '-1')
                                    .then(function(setinfo:any){
                                        blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, setnumber + '-1', {new_or_used: blApi.Condition.Used,  region: 'europe', guide_type: 'stock'})
                                        .then(function(priceinfo:any){
                                            const createSetData = `INSERT INTO Sets (
                                            no,
                                            name,
                                            category_id,
                                            year,
                                            weight_g,
                                            size,
                                            min_price,
                                            max_price,
                                            avg_price,
                                            qty_avg_price,
                                            unit_quantity,
                                            total_quantity,
                                            thumbnail_url,
                                            image_url,
                                            created,
                                            createdBy)
                                            VALUES(
                                            '${setnumber}',
                                            '${setinfo.name}',
                                             ${setinfo.category_id},
                                            '${setinfo.year_released}',
                                             ${setinfo.weight},
                                            '${setinfo.dim_x} x ${setinfo.dim_y} x ${setinfo.dim_z} cm',
                                             ${priceinfo.min_price},
                                             ${priceinfo.max_price},
                                             ${priceinfo.avg_price},
                                             ${priceinfo.qty_avg_price},
                                             ${priceinfo.unit_quantity},
                                             ${priceinfo.total_quantity},
                                            '${setinfo.thumbnail_url}',
                                            '${setinfo.image_url}',
                                             NOW(),
                                             ${id}
                                            )`;
                                            connection.query(createSetData, (err1, result1) => {
                                                if (err1) res.json({
                                                    code: 500,
                                                    message: 'Couldn\'t store downloaded Setdata.',
                                                    errorMessage: process.env.DEBUG && err1
                                                });
                                                else {
                                                  
                                                  
                                                    res.json({
                                                        code: 100,
                                                        message: 'SetData successfully downloaded!',
                                                        "setinfo": setinfo,
                                                        "priceinfo" : priceinfo
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            }
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 500,
                message: 'Setnumber is required!'
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