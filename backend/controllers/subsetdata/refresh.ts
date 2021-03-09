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
            setid
        } = req.body;

        if (setid) {
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
                        const findDetailedSetInDB = `SELECT no FROM Subsets WHERE id='${setid}'`;
                        connection.query(findDetailedSetInDB, (err, setresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(setresult == 'undefined' || setresult.length == 0) res.json({
                                        code: 100,
                                        message: 'Subset is not downloaded yet!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {no} = setresult[0];
                                    const {id: userid} = result[0];
                                    blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, no + '-1')
                                    .then(function(setinfo:any){
                                        blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, no + '-1', {new_or_used: blApi.Condition.Used,  region: 'europe', guide_type: 'stock'})
                                        .then(function(priceinfo:any){
                                            const updateSetData = `UPDATE Subsets SET 
                                            name = '${setinfo.name}',
                                            category_id = '${setinfo.category_id}',
                                            year = '${setinfo.year_released}',
                                            weight_g = '${setinfo.weight}',
                                            size = '${setinfo.dim_x} x ${setinfo.dim_y} x ${setinfo.dim_z} cm',
                                            min_price = ${priceinfo.min_price},
                                            max_price = ${priceinfo.max_price},
                                            avg_price = ${priceinfo.avg_price},
                                            qty_avg_price = ${priceinfo.qty_avg_price},
                                            unit_quantity = ${priceinfo.unit_quantity},
                                            total_quantity = ${priceinfo.total_quantity},
                                            thumbnail_url = '${setinfo.thumbnail_url}',
                                            image_url = '${setinfo.image_url}',
                                            created = NOW(),
                                            createdBy = ${userid}
                                            WHERE id = ${setid}
                                            `;

                                            connection.query(updateSetData, (err1, result1) => {
                                                if (err1) res.json({
                                                    code: 500,
                                                    message: 'Couldn\'t download the Subsets',
                                                    errorMessage: process.env.DEBUG && err1
                                                });
                                                else {
                                                    res.json({
                                                        code: 100,
                                                        message: 'Subsets downloaded and refreshed!',
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