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
            priceid
        } = req.body;

        if (priceid) {
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
                        const findPriceDataInDB = `SELECT * FROM Prices WHERE id=${priceid}`;
                        connection.query(findPriceDataInDB, (err, priceresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(priceresult == 'undefined' || priceresult.length == 0) res.json({
                                        code: 202,
                                        message: 'PriceData is not downloaded yet!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const archive = `INSERT INTO PricesArchive 
                                    SELECT * FROM Prices WHERE id=${priceid}`
                                    connection.query(archive, (err, archive: any) => {
                                        if (err) res.json({
                                            code: 500,
                                            message: 'Some Error Occurred!',
                                            //@ts-ignore
                                            errorMessage: process.env.DEBUG && err
                                        });
                                        else{
                                            const {no: partnumber} = priceresult[0];
                                            const {type: type} = priceresult[0];
                                            const {colorid: colorid} = priceresult[0];
                                            const {new_or_used: condition} = priceresult[0];
                                            const {region: region} = priceresult[0];
                                            const {guide_type: guide_type} = priceresult[0];
                                            const {id: userid} = result[0];
                                            let con = blApi.Condition.Used;
                                            if(condition != "U")
                                                con = blApi.Condition.New;

                                            blApi.bricklinkClient.getPriceGuide(type, partnumber, 
                                                {new_or_used: con,
                                                color_id:  colorid, 
                                                region: region,  
                                                guide_type: guide_type
                                                }).then(function(priceinfo:any){
                                                const updatePriceData = `UPDATE Prices SET 
                                                min_price = ${priceinfo.min_price},
                                                max_price = ${priceinfo.max_price},
                                                avg_price = ${priceinfo.avg_price},
                                                qty_avg_price = ${priceinfo.qty_avg_price},
                                                unit_quantity = ${priceinfo.unit_quantity},
                                                total_quantity = ${priceinfo.total_quantity},
                                                created = NOW(),
                                                createdBy = ${userid}
                                                WHERE id = ${priceid}
                                                `;
                                                console.log(updatePriceData)
                                                connection.query(updatePriceData, (err) => {
                                                    if (err) res.json({
                                                        code: 500,
                                                        message: 'Couldn\'t update PriceData',
                                                        errorMessage: process.env.DEBUG && err
                                                    });
                                                    else {

                                                        res.json({
                                                            code: 201,
                                                            message: 'PriceData successfully downloaded and refreshed!',
                                                            "priceinfo": priceinfo
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    });
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