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
            type
        } = req.body;

        if (partnumber && colorid && type) {
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
                        const findPartDataInDB = `SELECT * FROM Parts WHERE no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' `;
                        connection.query(findPartDataInDB, (err, partresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(partresult !== 'undefined' && partresult.length > 0) res.json({
                                        code: 202,
                                        message: 'PartData information was already downloaded!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {id} = result[0];
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
                                                const createPartData = `INSERT INTO Parts (
                                                    no,
                                                    name,
                                                    type,
                                                    category_id,
                                                    color_id,
                                                    year,
                                                    weight_g,
                                                    size,
                                                    is_obsolete,
                                                    qty_avg_price_stock,
                                                    qty_avg_price_sold,
                                                    image_url,
                                                    thumbnail_url,
                                                    created,
                                                    createdBy)
                                                    VALUES(
                                                    '${partinfo.no}',
                                                    '${partinfo.name}',
                                                    '${type}',
                                                     ${partinfo.category_id},
                                                     ${colorid},
                                                    '${partinfo.year_released}',
                                                     ${partinfo.weight},
                                                    '${partinfo.dim_x} x ${partinfo.dim_y} x ${partinfo.dim_z} cm',
                                                     ${partinfo.is_obsolete},
                                                     ${priceinfostockdata.qty_avg_price},
                                                     ${priceinfosolddata.qty_avg_price},
                                                    '${partinfo.image_url}',
                                                    '${partinfo.thumbnail_url}',
                                                     NOW(),
                                                     ${id}
                                                    )`;
                                                    connection.query(createPartData, (err1, result1) => {
                                                        if (err1) res.json({
                                                            code: 500,
                                                            message: 'Couldn\'t store downloaded PartData',
                                                            errorMessage: process.env.DEBUG && err1
                                                        });
                                                        else {
                                                            const createStockPrices = `INSERT INTO Prices (
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
                                                                '${partinfo.no}',
                                                                '${type}',
                                                                '${priceinfostockdata.new_or_used}',
                                                                 ${colorid},
                                                                'europe',
                                                                'stock',
                                                                '${priceinfostockdata.currency_code}',
                                                                 ${priceinfostockdata.min_price},
                                                                 ${priceinfostockdata.max_price},
                                                                 ${priceinfostockdata.avg_price},
                                                                 ${priceinfostockdata.qty_avg_price},
                                                                 ${priceinfostockdata.unit_quantity},
                                                                '${priceinfostockdata.total_quantity}',
                                                                NOW(),
                                                                 ${id}
                                                                ) ON DUPLICATE KEY UPDATE id=id`;
                                                                connection.query(createStockPrices, (err1, result1) => {
                                                                    if (err1) res.json({
                                                                        code: 500,
                                                                        message: 'Couldn\'t store StockPrices of the Part.',
                                                                        errorMessage: process.env.DEBUG && err1
                                                                    });
                                                                    else {
                                                                        const createSoldPrices = `INSERT INTO Prices (
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
                                                                        '${partinfo.no}',
                                                                        '${type}',
                                                                            '${priceinfosolddata.new_or_used}',
                                                                        ${colorid},
                                                                        'europe',
                                                                        'sold',
                                                                        '${priceinfosolddata.currency_code}',
                                                                            ${priceinfosolddata.min_price},
                                                                            ${priceinfosolddata.max_price},
                                                                            ${priceinfosolddata.avg_price},
                                                                            ${priceinfosolddata.qty_avg_price},
                                                                            ${priceinfosolddata.unit_quantity},
                                                                            ${priceinfosolddata.total_quantity},
                                                                        NOW(),
                                                                            ${id}
                                                                        ) ON DUPLICATE KEY UPDATE id=id`;
                                                                        connection.query(createSoldPrices, (err1, result1) => {
                                                                            if (err1) res.json({
                                                                                code: 500,
                                                                                message: 'Couldn\'t store SoldPrices of the Part.',
                                                                                errorMessage: process.env.DEBUG && err1
                                                                            });
                                                                            else {
                                                                                
                                                                                
                                                                                res.json({
                                                                                    code: 201,
                                                                                    message: 'PartData and Prices successfully downloaded!',
                                                                                    "priceinfostockdata": priceinfostockdata,
                                                                                    "priceinfosolddata" : priceinfosolddata
                                                                                });
                                                                            }
                                                                                                                                             
                                                                        })
                                                                    }
                                                                })   
                                                    }
                                                });
                                            })
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