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
            partnumber,
            colorid,
            type,
            condition,
            region,
            guide_type
        } = req.body;

        if (partnumber && colorid && type &&  condition && region && guide_type) {
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
                        const findPriceDataInDB = `SELECT * FROM Prices WHERE 
                        no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' 
                        AND new_or_used = '${condition}' AND region = '${region}' AND guide_type = '${guide_type}'`;
                        connection.query(findPriceDataInDB, (err, priceresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(priceresult !== 'undefined' && priceresult.length > 0) res.json({
                                        code: 202,
                                        message: 'Pricedata was already downloaded!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    }); 
                                else{
                                    const {id:userid} = result[0];
                                    let con = blApi.Condition.Used;
                                    if(condition != "U")
                                        con = blApi.Condition.New;

                                    blApi.bricklinkClient.getPriceGuide(type, partnumber, 
                                        {new_or_used: con,
                                          color_id:  colorid, 
                                          region: region,  
                                          guide_type: guide_type
                                        }).then(function(priceinfo:any){
                                            const insertPrices = `INSERT INTO Prices (
                                                no,
                                                type,
                                                new_or_used,
                                                color_id,
                                                region,
                                                guide_type,
                                                currency_code,
                                                min_price,
                                                max_price,
                                                avg_price,
                                                qty_avg_price,
                                                unit_quantity,
                                                total_quantity,
                                                created,
                                                createdBy)
                                                VALUES(
                                                '${partnumber}',
                                                '${type}',
                                                '${priceinfo.new_or_used}',
                                                 ${colorid},
                                                '${region}',
                                                '${guide_type}',
                                                '${priceinfo.currency_code}',
                                                 ${priceinfo.min_price},
                                                 ${priceinfo.max_price},
                                                 ${priceinfo.avg_price},
                                                 ${priceinfo.qty_avg_price},
                                                 ${priceinfo.unit_quantity},
                                                 ${priceinfo.total_quantity},
                                                 NOW(),
                                                 ${userid}
                                                ) ON DUPLICATE KEY UPDATE id=id`;
                                                connection.query(insertPrices, (err1, result1) => {
                                                    if (err1) res.json({
                                                        code: 500,
                                                        message: 'Couldn\'t store SoldPrices of the Part.',
                                                        errorMessage: process.env.DEBUG && err1
                                                    });
                                                    else {
                                                        res.json({
                                                            code: 201,
                                                            message: 'Pricedata successfully downloaded!',
                                                            "priceinfo": priceinfo,
                                                        });
                                                    }
                                            })  
                                        })
                                }                                      
                            }
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
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