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
           partid
        } = req.body;

        if (partid) {
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
                        const findPartDataInDB = `SELECT * FROM Parts WHERE id = ${partid}`;
                        connection.query(findPartDataInDB, (err, partresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                console.log(partresult)
                                if(partresult == 'undefined' || partresult.length == 0) res.json({
                                        code: 202,
                                        message: 'PartData is not downloaded yet!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {no: partnumber} = partresult[0];
                                    const {type: type} = partresult[0];
                                    const {colorid: colorid} = partresult[0];
                                    const {id: userid} = result[0];
                                    blApi.bricklinkClient.getCatalogItem(type, partnumber, colorid)
                                    .then(function(partinfo:any){
                                        blApi.bricklinkClient.getPriceGuide(type, partnumber, 
                                            {new_or_used: blApi.Condition.Used,
                                                color_id:  colorid, 
                                                region: 'europe',  
                                                guide_type: 'stock'
                                            }).then(function(priceinfostockdata:any){
                                            blApi.bricklinkClient.getPriceGuide(type, partnumber, 
                                                {new_or_used: blApi.Condition.Used,
                                                    color_id:  colorid, 
                                                    region: 'europe', 
                                                    guide_type: 'sold'
                                                }).then(function(priceinfosolddata:any){
                                                    const updatePartData = `UPDATE Parts SET 
                                                    name = '${partinfo.name}',
                                                    category_id = '${partinfo.category_id}',
                                                    year = '${partinfo.year_released}',
                                                    weight_g = '${partinfo.weight}',
                                                    size = '${partinfo.dim_x} x ${partinfo.dim_y} x ${partinfo.dim_z} cm',
                                                    is_obsolete = ${partinfo.is_obsolete ? 1 : 0},
                                                    qty_avg_price_stock = ${priceinfostockdata.qty_avg_price},
                                                    qty_avg_price_sold = ${priceinfosolddata.qty_avg_price},
                                                    image_url = '${partinfo.image_url}',
                                                    thumbnail_url = '${partinfo.thumbnail_url}',
                                                    created = NOW(),
                                                    createdBy = ${userid}
                                                    WHERE id = ${partid}
                                                    `;
                                                    connection.query(updatePartData, (err1, result1) => {
                                                        if (err1) res.json({
                                                            code: 500,
                                                            message: 'Couldn\'t update Partdata',
                                                            errorMessage: process.env.DEBUG && err1
                                                        });
                                                        else {

                                                            res.json({
                                                                code: 201,
                                                                message: 'PartData successfully downloaded and refreshed!',
                                                                "priceinfostockdata": priceinfostockdata,
                                                                "priceinfosolddata" : priceinfosolddata
                                                            });
                                                        }
                                                    });
                                                })
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