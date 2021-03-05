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
            batchsize
         } = req.body;
 
         if (batchsize) {
        //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, userResult: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const findallPrices = `SELECT * FROM Prices WHERE created < CURDATE() LIMIT ${batchsize}`;
                        connection.query(findallPrices, (err, allpricesresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(allpricesresult == 'undefined' || allpricesresult.length == 0) res.json({
                                        code: 100,
                                        message: 'no existing PriceData found that is not up to date!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    allpricesresult.forEach(function(priceresult:any){
                                        const {id: priceid} = priceresult;
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
                                                const {no: partnumber} = priceresult;
                                                const {type: type} = priceresult;
                                                const {colorid: colorid} = priceresult;
                                                const {new_or_used: condition} = priceresult;
                                                const {region: region} = priceresult;
                                                const {guide_type: guide_type} = priceresult;
                                                const {id: userid} = userResult[0];
                                                let con = blApi.Condition.Used;
                                                if(condition != "U")
                                                    con = blApi.Condition.New;

                                                blApi.bricklinkClient.getPriceGuide(type, partnumber, 
                                                    {new_or_used: con,
                                                    color_id:  colorid, 
                                                    region: region,  
                                                    guide_type: guide_type
                                                    }).then(function(priceinfo:any){
                                                    if(typeof priceinfo !== 'undefined') {
                                                        const updatePriceData = `UPDATE Prices SET 
                                                        min_price = ${priceinfo.min_price},
                                                        max_price = ${priceinfo.max_price},
                                                        avg_price = ${priceinfo.avg_price},
                                                        qty_avg_price = ${priceinfo.qty_avg_price},
                                                        unit_quantity = ${priceinfo.unit_quantity},
                                                        total_quantity = ${priceinfo.total_quantity},
                                                        created = NOW(),
                                                        createdBy = ${userid}
                                                        WHERE id = ${priceid}`;
                                                        connection.query(updatePriceData, (err) => {
                                                            if (err) res.json({
                                                                code: 500,
                                                                message: 'Couldn\'t update PriceData',
                                                                errorMessage: process.env.DEBUG && err
                                                            });
                                                        
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    res.json({
                                        code: 100,
                                        message: 'PriceData successfully downloaded and refreshed!'
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
                message: 'Batchsize is required!'
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